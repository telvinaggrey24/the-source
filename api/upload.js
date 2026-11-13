import crypto from 'crypto';

const MAX_BYTES = 5 * 1024 * 1024;

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return;
  let host = '';
  try {
    host = new URL(origin).hostname;
  } catch {
    return;
  }
  const allowed =
    host === 'thesource.co.tz' ||
    host.endsWith('.thesource.co.tz') ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app');
  if (!allowed) return;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function getCloudinaryConfig() {
  const url = process.env.CLOUDINARY_URL || '';
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  let apiKey = process.env.CLOUDINARY_API_KEY || '';
  let apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (match) {
    apiKey = apiKey || match[1];
    apiSecret = apiSecret || match[2];
    cloudName = cloudName || match[3];
  }

  return {
    cloudName: cloudName.trim(),
    apiKey: apiKey.trim(),
    apiSecret: apiSecret.trim(),
    folder: (process.env.CLOUDINARY_FOLDER || process.env.VITE_CLOUDINARY_FOLDER || 'the-source').trim(),
  };
}

function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method && req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const { cloudName, apiKey, apiSecret, folder } = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    return sendJson(res, 500, {
      error:
        'Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
    });
  }

  try {
    let payload = req.body;
    if (!payload || typeof payload === 'string' || Buffer.isBuffer(payload)) {
      const raw = typeof payload === 'string' ? payload : payload ? payload.toString('utf8') : await readBody(req);
      payload = raw ? JSON.parse(raw) : {};
    }

    // Browser uploads video/audio/photos directly to Cloudinary with this signature.
    if (payload.sign === true) {
      const timestamp = Math.round(Date.now() / 1000);
      const tags = Array.isArray(payload.tags) ? payload.tags.filter(Boolean).join(',') : '';
      const signFields = { folder, timestamp };
      if (tags) signFields.tags = tags;
      const signature = signParams(signFields, apiSecret);
      return sendJson(res, 200, {
        cloudName,
        apiKey,
        timestamp,
        signature,
        folder,
        resourceType: payload.resourceType || 'auto',
      });
    }

    const dataUrl = payload.file || payload.dataUrl;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return sendJson(res, 400, { error: 'Expected JSON body with sign:true or a data:image/* file field' });
    }

    // Rough size check from base64 length
    const b64 = dataUrl.split(',')[1] || '';
    const approxBytes = Math.floor((b64.length * 3) / 4);
    if (approxBytes > MAX_BYTES) {
      return sendJson(res, 400, { error: 'File size exceeds the 5MB limit.' });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const tags = Array.isArray(payload.tags) ? payload.tags.filter(Boolean).join(',') : '';
    const signFields = { folder, timestamp };
    if (tags) signFields.tags = tags;

    const signature = signParams(signFields, apiSecret);
    const form = new FormData();
    form.append('file', dataUrl);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    form.append('folder', folder);
    if (tags) form.append('tags', tags);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const upstream = await fetch(endpoint, { method: 'POST', body: form });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const msg =
        (data && data.error && data.error.message) ||
        `Cloudinary upload failed (${upstream.status})`;
      return sendJson(res, 502, { error: msg });
    }

    const url = data.secure_url || data.url;
    if (!url) return sendJson(res, 502, { error: 'Cloudinary response missing image URL' });

    return sendJson(res, 200, {
      url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('[api/upload]', message);
    return sendJson(res, 500, { error: message });
  }
}

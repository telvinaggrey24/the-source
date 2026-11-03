# THE SOURCE

Live Tanzania & East Africa headlines via NewsData.io and NewsAPI.org. Stories can open in-app, with links to original publishers for the full report.

## Run locally

**Prerequisites:** Node.js

1. `npm install`
2. Copy `.env.example` to `.env.local` and set server keys (`NEWSDATA_API_KEY`, `NEWSAPI_API_KEY`, Cloudinary, Firebase)
3. `npm run dev` → [http://localhost:3000](http://localhost:3000)

Live wire endpoint (dev + Vercel): `GET /api/news`

## Deploy on Vercel

| Name | Notes |
| --- | --- |
| `VITE_APP_URL` | `https://thesource.co.tz` |
| `NEWSDATA_API_KEY` | NewsData.io (server-only) |
| `NEWSAPI_API_KEY` | NewsAPI.org (server-only) |
| `VITE_ADMIN_EMAILS` | Google Sign-In allowlist for CMS |
| Cloudinary / Firebase | See `.env.example` |

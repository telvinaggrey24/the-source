# THE SOURCE

Live Tanzania & East Africa headlines via Google News wire. Stories link out to original publishers for the full report.

## Run locally

**Prerequisites:** Node.js

1. `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_APP_URL` if needed
3. `npm run dev` → [http://localhost:3000](http://localhost:3000)

Live wire endpoint (dev + Vercel): `GET /api/news`

## Deploy on Vercel

| Name | Production / Preview | Development |
| --- | --- | --- |
| `VITE_APP_URL` | `https://thesource.co.tz` | `http://localhost:3000` |

# THE SOURCE

Premier East African news publication: verified journalism across politics, business, sports, culture, and technology.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy [`.env.example`](.env.example) to `.env.local` and set `VITE_APP_URL` if you have a public URL
3. Run the app:
   `npm run dev`

The site runs at [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

The project is already set up for Vercel (`vercel.json`). In the Vercel dashboard, add this environment variable for Production, Preview, and Development:

| Name | Production / Preview | Development |
| --- | --- | --- |
| `VITE_APP_URL` | your deployment URL | `http://localhost:3000` |

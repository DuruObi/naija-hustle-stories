# Naija Hustle Stories

Simple Next.js project that lists NFTs from Zora (@nhs) with a serverless proxy for CORS-free fetching.

## Dev
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

## Deploy
- Push this repo to GitHub and import the repo on Vercel (Next.js auto-detected).
- Or upload ZIP to Vercel (manual upload).

Serverless proxy: `pages/api/nfts.js` — Vercel runs this server-side so browser won't be blocked by CORS.

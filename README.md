# Step landing page

A responsive, mobile-first product-concept landing page built with Vite, vanilla JavaScript, and a Cloudflare Pages Function. **Step is a provisional name and the on-page product preview is illustrative, not a launched product.**

## Run locally

```bash
npm install
npm run dev
npm run build
```

Vite serves the marketing page locally, but does **not** run the Pages Function. On a plain Vite preview the form will validate email and explicitly say the address was **not saved**. It only shows success after the API confirms a database write (or confirms an existing signup).

## Enable real waitlist collection on Cloudflare Pages

The Pages Function at `functions/api/waitlist.js` stores only a normalized email address and signup timestamp in Cloudflare D1. Duplicate addresses do not create extra rows. There is no mailing-list integration or outbound email; you must set that up separately before sending updates. No API credentials are embedded in this project.

1. Create a D1 database in your Cloudflare account (e.g. `step-waitlist`).
2. Apply `migrations/0001_create_waitlist.sql` to that database using the Cloudflare dashboard's D1 console or Wrangler, e.g. `npx wrangler d1 execute step-waitlist --remote --file=migrations/0001_create_waitlist.sql` (requires account login).
3. Create a Cloudflare Pages project with build command `npm run build` and build output directory `dist`. In the Pages project's **Settings → Functions → D1 database bindings**, bind the database using variable name `WAITLIST_DB` for the relevant deployment environments. Redeploy after adding the binding. Pages automatically deploys the `functions/` directory alongside `dist`.
4. Submit a test address and verify it appears in D1. Until the binding and table exist, the API returns an error and the form clearly reports that the address wasn't saved.

To test the Function locally, use Wrangler Pages dev with a local D1 binding/database and the migration applied locally, rather than the Vite dev server. Treat signup addresses as personal data: restrict D1 access, establish a privacy/retention policy, and add abuse protection before a public launch.

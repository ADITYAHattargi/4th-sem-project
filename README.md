# SkillBloom

Static HTML frontend with the SkillBloom Express backend in one project.

## Structure

```text
frontend/             Static HTML pages
frontend/assets/css/  Shared CSS
frontend/assets/js/   Shared page scripts
frontend/assets/images/
backend/              Express API and static frontend server
legacy/               Old React/Vite frontend kept for reference
```

## Run

```bash
npm run dev
```

The backend serves the frontend from `frontend/` and exposes the API under `/api`.

If port `5000` is already in use:

```bash
PORT=5001 npm run dev
```

## Deploy

Railway can run the backend from the project root with:

```bash
npm start
```

Use Railway MySQL variables (`MYSQL_URL`, or `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`). Set `JWT_SECRET` in Railway before sharing the app.

Deploy the Vercel frontend from `frontend/` and set:

```bash
SKILLBLOOM_API_BASE_URL=https://your-railway-backend-url
```

## Profile Images

`POST /api/upload` stores profile photos in Cloudflare R2 through Wrangler when these backend env vars are set:

```bash
CLOUDFLARE_R2_BUCKET=aditya
CLOUDFLARE_R2_PUBLIC_URL=https://pub-b22d2ee562fe41bbaae0004139862815.r2.dev
```

The `aditya` bucket must have public `r2.dev` access enabled for those URLs to render in the browser.

The route can also use Cloudflare Images when these backend env vars are set:

```bash
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_IMAGES_API_TOKEN=
CLOUDFLARE_IMAGES_VARIANT=public
```

Use a Cloudflare API token with account-level Cloudflare Images edit/write permission. The backend also supports `CLOUDFLARE_API_EMAIL` plus `CLOUDFLARE_GLOBAL_API_KEY`, but the scoped Images API token is preferred.

When Cloudflare credentials are not configured, local development falls back to data URLs.

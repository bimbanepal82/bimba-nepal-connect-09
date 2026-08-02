# Bimba Nepal — Website

Official website for **Bimba Nepal**, a non-profit advancing community health in Nepal through prevention, awareness, screening, and access — across geriatrics, women's health, mental health, radiology, and medical-legal support.

Live site: [bimba.org.np](https://bimba.org.np)

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router)
- TypeScript
- Tailwind CSS v4
- [Supabase](https://supabase.com) (database, auth, storage — powers the Notice Board / Document Library)
- Radix UI + shadcn-style components
- Tiptap (rich text editor, for notice/report content)
- Deployed on **Cloudflare Workers** via [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

## Prerequisites

- Node.js 20+
- Yarn (this project uses `.yarn/`, `yarn.lock`, and `.yarnrc.yml` — **use Yarn, not npm**, to avoid dependency drift. See [Known issues](#known-issues) below.)
- A Supabase project (or access to the shared one)
- Cloudflare account access, for deployment

## Getting started

```bash
# install dependencies
yarn install

# copy the env template and fill in your Supabase project values
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — never put it in `.env` for local frontend dev unless you're running server routes locally. In production it's set via:

```bash
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Then run the dev server:

```bash
yarn dev
```

## Available scripts

| Script | What it does |
|---|---|
| `yarn dev` | Start local dev server (Vite) |
| `yarn build` | Production build |
| `yarn build:dev` | Development-mode build |
| `yarn preview` | Build, then preview via `wrangler dev` (simulates Cloudflare Workers locally) |
| `yarn lint` | Run ESLint |
| `yarn format` | Run Prettier |
| `yarn deploy` | Build and deploy to Cloudflare Workers |
| `yarn cf-typegen` | Generate types for Cloudflare bindings |

## Project structure

```
db/       — database schema / migrations (Supabase)
src/      — application source (routes, components)
.env.example — required environment variables
wrangler.jsonc — Cloudflare Workers configuration
```

## Deployment

Deployed to Cloudflare Workers:

```bash
yarn deploy
```

Make sure `SUPABASE_SERVICE_ROLE_KEY` is set as a Wrangler secret (see above) before deploying — it should never be committed or bundled into client-side code.

## Known issues

- Both `yarn.lock` and `package-lock.json` currently exist in this repo. Only one package manager should be used — since the project is set up for Yarn (`.yarn/`, `.yarnrc.yml`), `package-lock.json` should be deleted and `.gitignore`'d going forward.
- The Notice Board / Document Library currently has no published documents — add at least one via Supabase before relying on that page for a live audience.

## Related repositories

- [`bimanepal`](https://github.com/bimbanepal82/bimanepal) — an earlier static HTML/CSS/JS version of the site. **Superseded by this repo.** Should be archived to avoid confusion about which repo is canonical.

## License

See [LICENSE](./LICENSE).

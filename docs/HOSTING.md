# Hosting: the website and course downloads

Erudior has two front doors:

- **app.erudior.com** — the web app for free learning, on Cloudflare Pages.
- **The desktop app** — for homeschool families and schools (records stay on the computer).

Production web, desktop and Android builds fetch the signed official catalog from the public **published-courses** branch of **Aziliz/erudior** on GitHub. The website refreshes its course listings on startup.
Nothing about a student is sent anywhere; the only requests are for the catalog and course files.

## How it works

`npm run courses:publish` turns `samples/` into `dist-courses/v1/`:

| File | What it is | Cache |
| --- | --- | --- |
| `catalog.json` | Every course's metadata, plus the file name, size and SHA-256 of its package | 5 minutes |
| `catalog.json.sig` | Ed25519 signature of `catalog.json`'s exact bytes | 5 minutes |
| `<course-id>.r<revision>.json` | One file per course revision; never changes once uploaded | 1 year, immutable |
| `states.<YYYY-MM-DD>.json` | The state homeschool rules (`content/states`), named by the date last checked; listed in the catalog with its SHA-256 | 1 year, immutable |

The app accepts a catalog only if its signature matches a public key in `src/lib/courseKeys.ts`,
and a course file only if its SHA-256 matches the signed catalog. The last good catalog is saved on
the device, so the app works offline; courses already started are stored locally.

The GitHub feed publishes the catalog and its detached signature together in `v1/catalog.signed.json`. Clients verify the exact catalog text before caching it and download individual revision files on demand. Local development can use bundled samples or a custom `VITE_COURSES_URL`.

To publish a course, merge its reviewed package, catalog entry and any required revision approvals under `samples/` on main. **Publish signed GitHub course feed** validates revisions and advances the public branch in one commit. Existing revisions stay available. Course publication requires the course signing key. The first migration also authenticates the existing release on R2, which continues to serve older clients.

## Signing, legacy R2 and website setup

1. **Signing key** (on your own machine, in the repo):
   - `npm run course-keys` — writes the secret key to `.keys/course-signing.key` (git-ignored) and
     adds the public key to `src/lib/courseKeys.ts`.
   - Commit and push `src/lib/courseKeys.ts`.
   - Back up `.keys/course-signing.key` somewhere safe (a password manager). If it's lost, a new
     key needs an app update before new catalogs are trusted.
2. **R2 bucket** (Cloudflare dashboard → R2):
   - Create a bucket named `erudior-courses`.
   - Settings → Custom Domains → add `courses.erudior.com` (the erudior.com zone must be on this Cloudflare account).
   - Settings → CORS policy:
     ```json
     [{ "AllowedOrigins": ["*"], "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 86400 }]
     ```
3. **Pages project** (Workers & Pages → Create → Pages → Direct Upload):
   - Name it `erudior` (upload anything once, e.g. an empty folder, to create it).
   - Custom domains → add `app.erudior.com`.
4. **API token** (My Profile → API Tokens → Create Token → Custom):
   - Permissions: Account · Cloudflare Pages · Edit, and Account · Workers R2 Storage · Edit.
   - Note your Account ID (right side of the account home page).
5. **GitHub** (Aziliz/erudior → Settings → Secrets and variables → Actions):
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `COURSE_SIGNING_KEY` (the contents
     of `.keys/course-signing.key`).
   - Variables: `COURSES_URL` = `https://courses.erudior.com/v1/`, `R2_BUCKET` =
     `erudior-courses`, `PAGES_PROJECT` = `erudior`.
6. Check **Publish signed GitHub course feed** and confirm its signed catalog is available at `https://raw.githubusercontent.com/Aziliz/erudior/published-courses/v1/catalog.signed.json`.
7. Deploy the website for engine changes. Advance `.github/desktop-release` with a versioned desktop engine change to publish signed installers.

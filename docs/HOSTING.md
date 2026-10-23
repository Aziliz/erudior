# Hosting: the website and course downloads

Erudior has two front doors:

- **app.erudior.com** — the web app for free learning, on Cloudflare Pages.
- **The desktop app** — for homeschool families and schools (records stay on the computer).

Both download courses from **courses.erudior.com/v1/**, a public Cloudflare R2 bucket.
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

Builds without `VITE_COURSES_URL` (local development, or before hosting exists) bundle the courses
as before.

## One-time setup

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
5. **GitHub** (Aziliz/examiner → Settings → Secrets and variables → Actions):
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `COURSE_SIGNING_KEY` (the contents
     of `.keys/course-signing.key`).
   - Variables: `COURSES_URL` = `https://courses.erudior.com/v1/`, `R2_BUCKET` =
     `erudior-courses`, `PAGES_PROJECT` = `erudior`.
6. Actions → **Publish website and courses** → Run workflow. Check
   `https://courses.erudior.com/v1/catalog.json` and `https://app.erudior.com`.
7. Actions → **Build installers**: with `COURSES_URL` set, new installers download courses instead
   of bundling them.

After that, every push to `main` that changes courses or the app republishes automatically.

## Community courses (api.erudior.com)

The `worker/` folder is a Cloudflare Worker with a D1 database (accounts, drafts, reviews,
reports) and a private R2 bucket (published versions and images). Builds with
`VITE_COMMUNITY_API` show community courses in the Library; the website build also gets the
editor (Create) and the review queue. Authors sign in with Google or GitHub, must confirm
they're 18+ and accept the terms; courses go live tagged **Not reviewed** until a reviewer
marks that version **Reviewed**.

1. **Database and bucket** (Cloudflare dashboard, or `npx wrangler` in `worker/`):
   - `npx wrangler d1 create erudior-community` and note the database id.
   - R2 → create a bucket named `erudior-community` (keep it private; the Worker serves it).
2. **Google sign-in** (Google Cloud console → APIs & Services):
   - OAuth consent screen: External, app name Erudior, scopes `openid`, `email`, `profile`.
   - Credentials → Create OAuth client ID → Web application. Authorized redirect URI:
     `https://api.erudior.com/auth/google/callback`. Note the client id and secret.
3. **GitHub sign-in** (GitHub → Settings → Developer settings → OAuth Apps → New):
   - Homepage `https://app.erudior.com`, callback `https://api.erudior.com/auth/github/callback`.
     Note the client id; generate a client secret.
4. **API token**: add Account · Workers Scripts · Edit, Account · D1 · Edit and
   Zone (erudior.com) · Workers Routes · Edit to the token from step 4 above (the Worker
   claims `api.erudior.com` as a custom domain when it deploys).
5. **GitHub** (Aziliz/examiner → Settings → Secrets and variables → Actions):
   - Variables: `COMMUNITY_API` = `https://api.erudior.com`, `D1_DATABASE_ID` = the id from
     step 1, `ADMIN_EMAILS` = your sign-in email (comma-separate several), `GOOGLE_CLIENT_ID`,
     `OAUTH_GITHUB_CLIENT_ID`.
   - Secrets: `GOOGLE_CLIENT_SECRET`, `OAUTH_GITHUB_CLIENT_SECRET` (GitHub doesn't allow
     names starting with `GITHUB_`).
6. Actions → **Deploy community API** → Run workflow; then re-run **Publish website and
   courses** so the web app picks up `COMMUNITY_API`. Sign in at app.erudior.com → Create.
   Admins can give others the Reviewer role from the review queue's People section.

Local development: `cd worker && npm install && npm run migrate:local && npm run dev`
(http://localhost:8787 with a development sign-in), then
`VITE_COMMUNITY_API=http://localhost:8787 npx vite --port 5181`. `node test/api.test.mjs`
checks the API; `node scripts/community-walkthrough.mjs` checks the whole flow in a browser.

## Day to day

- **New course revision:** build it as usual (`content/math/build.py …`), commit, push. The
  workflow uploads the new `<id>.r<revision>.json` and a new signed catalog; apps offer the update.
- **State rules update:** edit `content/states/states.yaml` (bump `checked` on the states you
  re-verified), run `python3 content/states/build.py`, commit, push. Desktop apps pick up the newer
  file from the signed catalog; every build also bundles the copy it was built with.
- **Try it locally:** `npm run dev:remote` signs with a local dev key and serves the packages at
  `/courses-dev/v1/` from the dev server.
- **Rotating the key:** `npm run course-keys -- --force` adds a second public key; ship an app
  update with it, then replace the `COURSE_SIGNING_KEY` secret.

## Privacy note

Community authors' name, email and courses are stored in D1; reports store a daily-salted
hash of the reporter's IP for rate limiting only. Cloudflare sees the IP address of each download, like any web host. Erudior adds no analytics
and sends no student data. The children's privacy notice (roadmap section 7) should say so.

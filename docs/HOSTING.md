# Hosting: the website and course downloads

Examiner has two front doors:

- **examiner.azilizlabs.com** — the web app for free learning, on Cloudflare Pages.
- **The desktop app** — for homeschool families and schools (records stay on the computer).

Both download courses from **examiner-courses.azilizlabs.com/v1/**, a public Cloudflare R2 bucket.
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
   - Create a bucket named `examiner-courses`.
   - Settings → Custom Domains → add `examiner-courses.azilizlabs.com`.
   - Settings → CORS policy:
     ```json
     [{ "AllowedOrigins": ["*"], "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 86400 }]
     ```
3. **Pages project** (Workers & Pages → Create → Pages → Direct Upload):
   - Name it `examiner` (upload anything once, e.g. an empty folder, to create it).
   - Custom domains → add `examiner.azilizlabs.com`.
4. **API token** (My Profile → API Tokens → Create Token → Custom):
   - Permissions: Account · Cloudflare Pages · Edit, and Account · Workers R2 Storage · Edit.
   - Note your Account ID (right side of the account home page).
5. **GitHub** (Aziliz/examiner → Settings → Secrets and variables → Actions):
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `COURSE_SIGNING_KEY` (the contents
     of `.keys/course-signing.key`).
   - Variables: `COURSES_URL` = `https://examiner-courses.azilizlabs.com/v1/`, `R2_BUCKET` =
     `examiner-courses`, `PAGES_PROJECT` = `examiner`.
6. Actions → **Publish website and courses** → Run workflow. Check
   `https://examiner-courses.azilizlabs.com/v1/catalog.json` and `https://examiner.azilizlabs.com`.
7. Actions → **Build installers**: with `COURSES_URL` set, new installers download courses instead
   of bundling them.

After that, every push to `main` that changes courses or the app republishes automatically.

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

Cloudflare sees the IP address of each download, like any web host. Examiner adds no analytics
and sends no student data. The children's privacy notice (roadmap section 7) should say so.

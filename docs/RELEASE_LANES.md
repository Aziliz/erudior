# Erudior release lanes

Website and app frontend, community API, and signed courses are separate deployments. Each has an independent workflow and distinct failure boundary.

| Lane | Workflow | Trigger on main | Checks | Destination |
| --- | --- | --- | --- | --- |
| Website and app UI | `.github/workflows/site.yml` | `src/**`, `public/**`, website assets/config | Identity check, TypeScript + production Vite build, optional prerender | Cloudflare Pages |
| Backend/community API | `.github/workflows/community.yml` | `worker/**` and API-relevant shared library changes | Typecheck, isolated API tests, migrations | Cloudflare Worker |
| Signed course publication | `.github/workflows/courses.yml` | `samples/**` and course publishing / format logic | Full regression, key verification, signed baseline, immutable R2 upload and readback | R2 catalog + immutable packages |

**Important:** A source change may legitimately trigger more than one lane when the same source is used by both. The workflows do not depend on each other's success or run as one release. A homepage-only change never triggers course publication or Worker deployment. A course package change does not require deploying Pages.

## Pull request checks

`identity.yml` retains the existing identity job and `regression` check context. For strictly website-only files, the regression job runs the full TypeScript/production build but skips unrelated full app regression. For other changes, or when a PR diff cannot be determined, it runs full regression and build. Never bypass course signature, publishing, or Worker tests.

## Operational rules

Deploy only complete features. The site can publish independently of courses. Never publish an incomplete course to make frontend changes visible. Keep diagnostics artifacts and native GitHub logs. Before confirming a release, verify the appropriate production page, Worker endpoint or signed catalog. If a lane fails, repair it without disabling its gates; the other lanes can continue independently.

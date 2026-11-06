# Private settings and export browser acceptance

Run `npm run test:accounts:browser` after installing dependencies and Chromium (`npx playwright install chromium`). Set `ERUDIOR_ACCOUNT_TEST_ADMIN_URL` to a disposable loopback PostgreSQL administrator URL. The test creates and drops an isolated database and non-owner, non-bypass-RLS runtime role using the existing integration harness. Missing PostgreSQL or Chromium fails; it never skips.

`ERUDIOR_BROWSER_EXECUTABLE` optionally selects an already installed Chromium binary. `ERUDIOR_BROWSER_ARTIFACT_DIR` selects the screenshot/summary directory (default `artifacts/private-account-browser`). No trace, cookies, raw request headers, callback URLs, credentials or database URLs are written into artifacts.

## What the test exercises

- Actual browser UI loaded from the explicitly enabled HTTP handler; every account operation reaches the real PostgreSQL runtime role.
- Browser-driven navigation between different sites (`private.erudior.test` and `personal.identity.invalid` / `school.identity.invalid`). The provider first commits an actual cross-site HTML document with an explicit Continue button. Only that form submission issues the callback redirect; a redirect-only chain is not used as evidence for Strict cookie withholding. The provider performs real code redemption, PKCE verification, token signing and JWKS signature verification.
- Chromium sets and sends the real response cookies. The test asserts Secure/HttpOnly/Lax login binding, Secure/HttpOnly/Strict session attributes, Lax callback presence, Strict callback absence (including fresh authentication), and no provider cookie leakage. It never injects cookies or mocks session authorization.
- Context rotation, reload/back, fresh authentication, two independent contexts, confirmation cancellation, remote/current/all session revocation, provider cancellation, invalid signature, callback replay, missing CSRF, cross-origin denial, school/weak/stale MFA denial, expired/idle sessions and lost/interrupted mutation responses.
- Delayed real responses with event-driven `pagehide`/`pageshow` concealment. This drives actual mounted client event listeners, but does **not** claim to prove operating-system window visibility or a natural BFCache restore.
- No browser persistence or script-readable account cookies, and desktop 1280/mobile 320 light/dark axe checks, overflow checks and screenshots.
- Opt-in export inventory, explicit version review/confirmation, same-session reload/resume, status, cancellation, and a real Playwright download whose UTF-8 JSON bytes are compared with exactly the chosen synthetic source records. The export store and host are enabled only in this fixture with an explicit 120-second artifact TTL.
- Export discovery exposes only authorized metadata, never source payloads or unauthorized record IDs. Unscoped runtime reads remain empty under PostgreSQL RLS. Cancellation and expiry clear service artifact bytes while cancellation leaves original source payloads intact.
- Interrupted create and lost successful create responses never trigger a second POST. Read-only refresh resumes the durable job after a lost response. Stable request-ID replay itself remains covered by the PostgreSQL export suite; the UI intentionally has no mutation retry button.
- Record-version changes, guardian-authority changes, context rotation (including switching back), and fresh-session replacement deny access to prior artifacts. Synthetic fixture edits use the graph harness/version checks or constraint-consistent bigint timestamps; they never inject authenticated sessions or cookies.
- Delayed export discovery and download responses cannot restore hidden private UI or a prepared Blob link. Download requires a second explicit Save action after preparation. Export review has its own 1280/320 light/dark axe, overflow and screenshot checks.

The suite contains the original 12 account/browser cases plus 10 export cases. These are executable acceptance requirements, not a claim that all cases passed in an environment where Chromium/PostgreSQL cannot run.

The configured provider has no restricted-learner login endpoint. This browser suite deliberately does not fabricate one or inject a restricted session. Restricted-learner denial remains covered by the existing authorization and PostgreSQL integration suites.

## Transport boundary

Public Chromium CDPSession Fetch interception forwards only the three exact synthetic HTTPS origins to real loopback HTTP servers. Method, body, Origin and browser-computed Cookie headers are forwarded unchanged; status, body and Set-Cookie responses come from those servers. Unknown origins are blocked. It does not use `ignoreHTTPSErrors`, install certificates, disable certificate verification or change real browser trust settings.

This synthetic transport makes browser site/cookie semantics testable without taking over DNS or TLS trust. It is **not production DNS, certificate, TLS termination or deployment evidence**. Those checks remain a separate deployment gate.

CI retains the existing protocol and real PostgreSQL suites, then installs Chromium and runs this browser suite. Screenshots and a completed-case summary are uploaded. Screenshots still need human visual review; an axe pass is not a visual-review claim. A local Chromium launch can be blocked by the execution sandbox's socket policy; do not work around that restriction or report screenshots as generated when they were not.

The transport intentionally uses `Fetch.requestPaused` for every navigation hop rather than `BrowserContext.route`. In Playwright 1.57's `playwright-core/lib/server/chromium/crNetworkManager.js`, `_onRequest` calls `Fetch.continueRequest` when `redirectedFrom` is present instead of creating a user route. High-level routing therefore lets the OIDC redirect escape synthetic forwarding. The CDP transport preserves each paused request's own browser-computed headers and keeps each Set-Cookie response header separate. It never constructs a Cookie header from a cookie jar. Sanitized failure artifacts contain only pathnames, status codes, cookie names/attributes, Fetch Metadata and DOM screenshots, not credential values or callback query strings.

Chromium 143 CDP Fetch interception reports no Sec-Fetch-Site header for these requests. The helper does not synthesize missing browser headers. Consequently this suite proves the observed browser cookie/Origin behavior, but does not prove on-wire Fetch Metadata generation; the independent HTTP tests enforce rejection of hostile Fetch Metadata values.

## Current local execution limitation

On this slice, `npm run test:accounts:browser` first reported that the Playwright-managed Chromium binary was absent. A supported retry with `ERUDIOR_BROWSER_EXECUTABLE=/usr/bin/chromium` reached Chromium but failed at `process_singleton_posix` with `socket() failed: Operation not permitted`. No socket-policy workaround was attempted. The disposable PostgreSQL administrator URL/server was also unavailable. Therefore this local run produced no successful acceptance summary or screenshots; the required real-browser/PostgreSQL CI gate must run before claiming browser acceptance. Synthetic event-driven lifecycle tests remain distinct from natural BFCache or physical tab-visibility proof.

The delayed-download case expects the mounted UI to abort its fetch on concealment. The transport recognizes this only for that explicitly expected GET when Chromium emits `Network.loadingFailed` with `canceled=true` for the matching paused request's network ID. Only a subsequent response-fulfillment failure is exempted; upstream, handler, hook and unrelated transport errors remain fatal. The test additionally requires the cancellation observation and continues to assert that no download or prepared Blob link appears. Sanitized failure diagnostics include only allowlisted assertion labels and test filename/line/column locations, never raw exception text or navigation logs.

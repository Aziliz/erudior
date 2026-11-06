# Private settings browser acceptance

Run `npm run test:accounts:browser` after installing dependencies and Chromium (`npx playwright install chromium`). Set `ERUDIOR_ACCOUNT_TEST_ADMIN_URL` to a disposable loopback PostgreSQL administrator URL. The test creates and drops an isolated database and non-owner, non-bypass-RLS runtime role using the existing integration harness. Missing PostgreSQL or Chromium fails; it never skips.

`ERUDIOR_BROWSER_EXECUTABLE` optionally selects an already installed Chromium binary. `ERUDIOR_BROWSER_ARTIFACT_DIR` selects the screenshot/summary directory (default `artifacts/private-account-browser`). No trace, cookies, raw request headers, callback URLs, credentials or database URLs are written into artifacts.

## What the test exercises

- Actual browser UI loaded from the explicitly enabled HTTP handler; every account operation reaches the real PostgreSQL runtime role.
- Browser-driven navigation between different sites (`private.erudior.test` and `personal.identity.invalid` / `school.identity.invalid`). The provider performs real code redemption, PKCE verification, token signing and JWKS signature verification.
- Chromium sets and sends the real response cookies. The test asserts Secure/HttpOnly/Lax login binding, Secure/HttpOnly/Strict session attributes, Lax callback presence, Strict callback absence (including fresh authentication), and no provider cookie leakage. It never injects cookies or mocks session authorization.
- Context rotation, reload/back, fresh authentication, two independent contexts, confirmation cancellation, remote/current/all session revocation, provider cancellation, invalid signature, callback replay, missing CSRF, cross-origin denial, school/weak/stale MFA denial, expired/idle sessions and lost/interrupted mutation responses.
- Delayed real responses with event-driven `pagehide`/`pageshow` concealment. This drives actual mounted client event listeners, but does **not** claim to prove operating-system window visibility or a natural BFCache restore.
- No browser persistence or script-readable account cookies, and desktop 1280/mobile 320 light/dark axe checks, overflow checks and screenshots.

The configured provider has no restricted-learner login endpoint. This browser suite deliberately does not fabricate one or inject a restricted session. Restricted-learner denial remains covered by the existing authorization and PostgreSQL integration suites.

## Transport boundary

Public Chromium CDPSession Fetch interception forwards only the three exact synthetic HTTPS origins to real loopback HTTP servers. Method, body, Origin, Fetch Metadata and browser-computed Cookie headers are forwarded unchanged; status, body and Set-Cookie responses come from those servers. Unknown origins are blocked. It does not use `ignoreHTTPSErrors`, install certificates, disable certificate verification or change real browser trust settings.

This synthetic transport makes browser site/cookie semantics testable without taking over DNS or TLS trust. It is **not production DNS, certificate, TLS termination or deployment evidence**. Those checks remain a separate deployment gate.

CI retains the existing protocol and real PostgreSQL suites, then installs Chromium and runs this browser suite. Screenshots and a completed-case summary are uploaded. Screenshots still need human visual review; an axe pass is not a visual-review claim. A local Chromium launch can be blocked by the execution sandbox's socket policy; do not work around that restriction or report screenshots as generated when they were not.

The transport intentionally uses `Fetch.requestPaused` for every navigation hop rather than `BrowserContext.route`. In Playwright 1.57's `playwright-core/lib/server/chromium/crNetworkManager.js`, `_onRequest` calls `Fetch.continueRequest` when `redirectedFrom` is present instead of creating a user route. High-level routing therefore lets the OIDC redirect escape synthetic forwarding. The CDP transport preserves each paused request's own browser-computed headers and keeps each Set-Cookie response header separate. It never constructs a Cookie header from a cookie jar. Sanitized failure artifacts contain only pathnames, status codes, cookie names/attributes, Fetch Metadata and DOM screenshots, not credential values or callback query strings.

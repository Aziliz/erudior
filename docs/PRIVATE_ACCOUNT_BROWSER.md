# Private account browser settings

The separate account service now has an opt-in browser client for already-provisioned identities. This is a private-service foundation, not a production account launch. It does not add sign-up, recovery, school provisioning, local-record upload, a public website login.

## Host configuration

Leave `browserUI` absent to retain the existing API-only behavior. An explicitly configured host may set `browserUI.providers` to an array of `{ id, label, authorizationEndpoint }` entries matching its configured OIDC providers. IDs must exactly cover the configured providers. Each HTTPS authorization endpoint must match the corresponding pinned OIDC endpoint; the browser rejects navigation outside that exact endpoint. Labels are display text, never HTML. Do not put secrets or claims in this configuration.

The HTML landing page is served only at the host's fixed `returnPath`, on its already configured exact HTTPS origin. It loads only `/v1/ui/settings.js` and `/v1/ui/settings.css`; `/v1/ui/config` retains the API request-header and origin boundary. Bundle the `account-service/browser` directory with the server source. No arbitrary asset path is read. HTML and assets are no-store, frame-protected and governed by a self-only script/style/connect CSP. Recognized callback failures return to the fixed landing page with a generic marker rather than reflecting provider query data.

Device controls appear only when the host separately enables device management. Store and host enablement, fresh personal MFA, ownership and current authorization remain enforced by the server. A generic unavailable response does not establish that MFA alone would grant access.

## Supported workflow

- Select a configured provider, complete the existing browser-bound PKCE/OIDC flow, and see the current authorized context.
- Switch among server-provided contexts, reload safely, sign out, or start a fresh sign-in.
- List minimal owned-session metadata and confirm revocation of one session, the current session, or all sessions.
- Keep mutation controls locked while a request is pending. After an interrupted response, reconcile with the server and report an unknown outcome if that reconciliation also fails.
- Clear private display when the page is hidden or leaves, and revalidate on return. Ignore stale responses after newer navigation or identity changes.

Session projections and CSRF values live only in memory. The client does not use local/session storage or register a service worker. Existing opaque HttpOnly cookie flags, API origin/header/CSRF checks, provider verification, PostgreSQL authorization and RLS are unchanged. The client is not imported into the public application, Worker or functions.

## Validation

`npm run test:accounts` includes host, UI lifecycle and public-source isolation checks alongside existing protocol contracts. `npm run test:accounts:browser` requires Chromium and the same disposable PostgreSQL administrator configuration as database acceptance. The dedicated private-account workflow runs protocol, database and browser stages and saves screenshot/accessibility evidence.

Browser acceptance uses distinct synthetic HTTPS sites, browser-managed cookies, a real signing/PKCE provider and a real PostgreSQL runtime role. A narrow browser transport forwards only those fixture sites to loopback services; it does not inject cookies or replace authorization. This verifies browser request and SameSite behavior, not production DNS, TLS termination or a real provider integration. Those remain deployment requirements.

Production identity-provider selection, hosting and storage region, operational key management, authority provisioning, native authentication and recovery still require their own release work. No production service or identity configuration is enabled by this change.


## Optional selected-record exports

When the host separately provides the complete export capability, the browser supports authorized metadata discovery, exact-version selection/review, explicit artifact creation, saved-job refresh, bounded authenticated download and confirmed cancellation. See [Private record exports](PRIVATE_RECORD_EXPORTS.md) for scope, pagination and lifecycle rules. Existing export handlers remain usable without the browser client. The public application and production account deployment remain unchanged.

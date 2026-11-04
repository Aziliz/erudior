# Learning content interoperability

This is a bounded content-exchange capability, **not a claim of 1EdTech certification,
complete standard coverage, or tested compatibility with every LMS**. The original
roadmap called for educational standards where useful and portable identifiers.
The content row consolidated CASE, QTI, LTI and Common Cartridge. OneRoster
(roster/SIS synchronization) is not implemented by this capability.

## Supported exchanges and review boundary

The supervising-adult **Content exchange** tab works with local files. It does not
fetch external resources, execute imported scripts, import learner results, grant
roles, change the competency graph, or confer publication/signature approval.
External identifiers remain in the original exchange artifact; local adaptations
are explicitly separate copies. Keep the original file for interoperability.

- **CASE 1.1:** bounded CFPackage framework exchange, stable document/item/association
  identifiers and URIs, human review and explicit external-item-to-local-skill mapping.
  Mapping review files can be saved and reopened. Export uses a caller-selected
  namespace and deterministic identifiers. Imported hierarchy/ordering is never
  silently treated as local prerequisite or mastery evidence. No CASE REST provider
  or service conformance is claimed.
- **QTI 3:** individual XML assessment items with plain text, choice interactions
  (single/multiple response) or exact string text-entry and `match_correct` scoring.
  The preview uses exact QTI response semantics and earns no academic credit.
  Unsupported interactions, response programs, rich content, media and metadata
  fail explicitly instead of being silently flattened. Original supported items can
  be re-exported. A reviewed supported choice item can become a **new local study
  bank**, with a new namespace and an explicit adaptation notice. Native study
  settings may reorder choices; external choice identifiers become indices.
  Required shuffle, unsupported language/selection semantics and text items are
  not installed into the native bank: its forgiving text grader is not QTI exact
  string matching. Selected native questions export only when their semantics fit
  the declared profile. This is not QTI test delivery, results reporting or a full
  assessment-package implementation.
- **Common Cartridge 1.3:** actual `.imscc` ZIP/manifest exchange for safe static
  web-content and HTTPS web-link resources, organization ordering and references.
  Re-export retains validated source artifacts; imported HTML is displayed only as
  text, never inserted into the document. Unsupported resource types fail explicitly.
  Selected lesson exports are labelled **static text snapshots**, not lossless full
  course exports: interactive blocks, grading, audio and runtime behavior are not
  claimed as portable static snapshots. CC 1.3's QTI resource profile is not QTI 3;
  standalone QTI 3 exchange is separate. Archive paths, compression expansion,
  duplicates, integrity, referenced files and XML structures are bounded/validated.
- **LTI 1.3:** isolated resource-link tool login/launch implementation, disabled when
  no trusted registrations are configured. No LTI Advantage grade/roster/deep-link
  services, legacy LTI 1.1 secret flow, dynamic registration, account provisioning or
  platform-to-Erudior role elevation is provided.

A conversion error leaves existing local courses and evidence unchanged. No file
can replace a signed or published course through this exchange UI. Importing an
original artifact or saving a mapping does not imply that its author is trusted.
Saved files may contain answer keys or proprietary teaching material: the adult
must review licensing and choose recipients before sharing. No learner names,
passwords, grades, observations or progress are included in these adapters.

## LTI deployment prerequisites — separate approval required

No real institutional integration or new persistent credential is configured by
this feature. Existing production deployments remain disabled by default.
A real launch requires the user's explicit approval for the exact platform trust
relationship and access to its LMS administration:

1. Agree the institution/platform issuer, issued client ID and deployment ID.
2. Approve the authorization endpoint and pinned public RSA signing keys, including
   an operational rotation/revocation owner. Private keys do not belong in this
   configuration. No token-selected JWKS or arbitrary external endpoint is fetched.
3. Approve exact HTTPS login/launch/resource URLs and privacy settings. Resources
   must remain on the configured Erudior app origin; no wildcard redirect is used.
4. Configure the trusted deployment variable `LTI_REGISTRATIONS` with those approved
   values, then perform an institution-specific launch test before claiming it works.
   Do not set this variable as part of routine code deployment without approval.

Each registration has `issuer`, `clientId`, `deploymentId`, `authorizationEndpoint`,
`targets` (exact app URLs), and `keys` (public RSA JWKs with unique `kid`). The
`/lti/login` endpoint accepts OIDC initiation; `/lti/launch` accepts a bounded form
POST. Short-lived state/nonce and a Secure, HttpOnly, SameSite=None browser cookie
bind the response to its initiating browser. D1 atomically consumes state. Missing
cookies, expired/replayed/altered tokens, unregistered contexts and invalid claims
fail closed. Successful launch redirects only to the registered resource and does
not create an Erudior login, bypass enrollment, unlock the adult area, retain LMS
identity/contact information, or award credit. Community OAuth/CSRF stays separate.

The ephemeral local simulator uses temporary keys and isolated local D1. It proves
our implementation behavior, including cross-site browser form POST; it is **not**
real-LMS compatibility testing or certification. No production credentials are
used by tests, and no generated test registration is deployed.

## Primary standards references

Reviewed 2026-10-29:

- [CASE 1.1 specification (Final, January 2025)](https://www.imsglobal.org/spec/case/v1p1)
- [QTI 3 implementation/beginner guide](https://www.imsglobal.org/spec/qti/v3p0/guide/)
- [LTI 1.3 Core](https://www.imsglobal.org/spec/lti/v1p3)
- [1EdTech Security Framework](https://www.imsglobal.org/spec/security/v1p1/)
- [Common Cartridge 1.3 Final specifications and schemas](https://www.imsglobal.org/cc/index.html)

The separately published CC 1.4 implementation page is labelled Candidate Final;
this implementation deliberately names its supported 1.3 profile rather than
misrepresenting 1.4 status. Certification and external access remain distinct from
passing the repository's tests.

### Operational limits

The LTI profile requires a single matching audience, a short-lived token, and a
cookie-capable top-level launch. Browser third-party-cookie blocking fails closed;
embedded LMS launches need institution-specific testing. Expired anonymous D1
correlation rows are removed on subsequent login initiation, rather than by a new
scheduled cleanup service. Outstanding state is bounded per registration and
across the deployment. Existing hosting invocation logs may include a GET login
URL and its login_hint; approval must include the platform's hint content,
observability retention and privacy review. This feature does not alter production
logging/security settings. Token bodies and learner claims are never deliberately
logged by the handler.

### Validation evidence and archive limits

Independent schema checks were run against the public primary schemas (not just
self-roundtrips): CASE 1.1 CFPackage with all 45 existing local skills and 86
associations; QTI 3.0.1 ASI choice and inline exact-string exports; CC 1.3 manifest
and web-link descriptor. All passed. These checks are development evidence, not
certification. The CASE schema used was
`caseservicegroupv1p1-getcfpackage-200-responsepayload-schemav1p0p0.json`
(SHA-256 `5e35c01635cdec57518f98cbe7f057e7f5cd91db9213f85db68290d2e9b7322c`).
Repository tests also include independently authored standard-shaped inputs and
adversarial cases, rather than only exports read by the same adapter.

The CC ZIP profile limits archives to 4 MiB compressed, 2 MiB expanded total,
512 KiB per file and 128 files; manifests allow at most 100 resources and 200
items. Only safe ASCII relative paths and UTF-8 stored/deflate entries are accepted.
Encryption, data descriptors, extra fields, multidisk archives, symlinks,
unreferenced files, duplicate paths and XML identifier collisions are rejected.
This intentionally does not accept every valid ZIP or every valid cartridge.

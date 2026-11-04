# Preparing an official-publication candidate

A community review tag is **not** official publisher authorization, a license, or a
release approval. Candidate preparation does not change the community publication,
write the official catalog, generate approvals, or sign anything.

## Explicit, lossless handoff

`preparePromotionCandidate` accepts the exact loaded published canonical authoring
payload plus its community publication ID and version. It returns three separate
objects:

- `source`: the unchanged canonical payload, retaining the original authored identity,
  revision, dates, metadata, resources, and source declarations.
- `course`: the portable `examiner-course` candidate. It does not use the installed
  `community-*` identity or runtime bank namespaces. The only permitted transformation
  is offline image embedding through the configured community `/images/:id` route.
- `provenance`: an explicitly **unapproved candidate** manifest, source/candidate hashes,
  source publication identity/version, and each resolved image transformation/hash.

Hash encoding is SHA-256 over UTF-8 `JSON.stringify` of the indicated object (and of
an embedded data-URL string for an image hash). These are reproducibility hashes,
not server signatures or evidence that remote bytes can never change. Retain the
original exported bundle; do not regenerate a manifest and call it an approval.

Only validated configured-origin media routes reach the resolver; resolved bytes
must pass the existing static-image validation. Preparation fails rather than dropping
unresolved/unsafe assets. Individual asset limits remain in force, and the candidate
has a 32 MiB preparation cap. Original source uses the existing publication size limit.
There is no arbitrary-URL fetching, native path expansion, or licensing decision.

## Publisher workflow remains mandatory

A publisher may save `course` separately as the candidate course JSON and retain
`source` and `provenance` as accompanying review evidence. Before proposing a real
catalog/content change, an authorized publisher must independently verify:

1. Content accuracy, accessibility, source attribution, rights and applicable license.
2. Intended official identity/revision and compatibility with the authenticated previous
   release. Preparation deliberately does not choose a new official ID or revision.
3. Required independent Spreadsheet release approvals where applicable.
4. All normal repository validation, review, production signing, signed prior-catalog
   verification, immutable artifact digest checks, and deployment validation.

Use the existing `scripts/publish-courses.ts` release path; do not route a candidate
around it, use development signing as production evidence, edit historical artifacts,
or convert the candidate status into a fabricated review/approval record. Actual
catalog changes and course content approval are separate operations, not side effects
of this export. Legacy block documents must first undergo the explicit canonical
migration/review workflow; preparation never silently upgrades a legacy document.

## Reviewed community-to-official handoff

The administrator page at `/admin/promotions` implements a **reviewed handoff**, not
one-click official publication. Only current, accepted-term, non-banned administrators
can use its private API. No signing credential, repository access, new trusted origin,
or official publisher role is created by this workflow.

1. Select an exact, currently published community version whose community review still
   applies. Inspect the full original canonical source and the self-contained candidate.
   The server loads that version itself, verifies its owner/review and owned media, and
   captures the source package and media hashes. A client cannot upload a candidate or
   manufacture its review identity.
The learner-facing preview is deliberately static: answer-bearing ordering choices and
interactive fence bodies are withheld. It is not the executable learner runtime and cannot
replace full source inspection or the normal engine acceptance tests.

2. Save the immutable candidate. Reopen it to inspect content and every resource, original
   identity/revision, source/candidate digests, and image substitution manifest. Only the
   recorded owned-image-to-embedded-image transformation is permitted. Authored content,
   metadata, course identity and revision are not silently changed.
3. Retain evidence entries with an ID, `content`, `rights` or `media-rights` category, an
   inert reference and the actual review text. A bare reference is not enough. Evidence
   references are neither fetched nor treated as executable markup. Record all six human
   attestations: content accuracy, accessibility, attribution, source rights, media rights,
   and source/candidate parity. Content and rights evidence are mandatory; image/audio-bearing
   candidates additionally require media-rights evidence. These are **recorded human
   statements**, not verified legal facts.
4. Approve for handoff, reject with a reason, or revoke a previous review with a reason.
   Decisions and their evidence are retained as immutable review records. Updates use a
   saved revision, exact candidate digest and request identity. Retrying an uncertain
   request reconciles that same operation rather than creating a second approval. A
   concurrent edit, changed version, lost review, unavailable source, changed media or
   lost administrator access blocks review/export until resolved.
5. Export only a current approved review. Retain its `handoffSha256` independently of the
   exported file, for example alongside the authenticated export/review record. Recheck
   the current server record immediately before the separate publisher process. Revoking
   a server review cannot recall an already downloaded historical file.

The exported `erudior-reviewed-promotion-handoff` version 1 contains the unchanged
`PromotionCandidate`, the retained `PromotionReviewRecord`, `reviewSha256` and
`handoffSha256`. Its status is always `reviewed-not-authorized`; the embedded candidate's
status remains `unapproved-candidate`. The review binds the community ID, exact published
version, original source, embedded candidate, intended unchanged official identity/revision,
reviewer, timestamp, evidence and checklist. Missing authored revision retains the existing
course format's default revision 1, without inserting or rewriting a source field.

Review and handoff hashes use SHA-256 over UTF-8 `JSON.stringify`, preserving property order.
The handoff hash covers the whole handoff except its own `handoffSha256` property. It is
not a hash of the pretty-printed file bytes. File whitespace may differ; changes to any
captured object, evidence, checklist, identity or property order change the retained digest.
The verifier rejects duplicate JSON keys, invalid UTF-8, reserved/unknown fields, unsafe
schemas, malformed dates, digest changes and unrecorded content/media substitutions. The
portable document is bounded to 36 MiB; a review to 200,000 UTF-8 bytes, 24 evidence entries,
6,000 characters per evidence text, 2,000 per reference and 8,000 for notes. The server has
its stricter 32 MiB private candidate-storage cap, at most 256 resolved community images,
and at most 100 retained candidates per preparing administrator, plus existing per-image/publication limits.
Rejected and revoked records remain retained and count toward that cap; the interface does not
purge review history. Known noncommitted private uploads are cleaned up, while uncertain
commit outcomes are retained for safe reconciliation.

The source package/media ownership guard remains private server state. It is not exported
as a license grant. The exporter rechecks source and actor metadata after asynchronous
work. R2 object/media byte checks are observations around those checks, **not** a global
atomic revocation transaction across R2 and D1. A handoff is historical, unsigned evidence:
anyone able to rewrite it can recompute unkeyed hashes. Importing it grants no administrator,
reviewer, legal, course ownership or official publication authority. The independently
retained digest detects substitution against that retained export; it does not authenticate
its original author or establish that a review is still current.

## Independent repository publisher verification

An independently authorized publisher must inspect the evidence and the exact course,
confirm their own publishing authority, independently review content and rights, confirm the
current server review/source status and assess intended identity/revision against the
current signed official catalog. An existing identity collision or a new official identity
with an authored revision greater than 1 must be resolved by an explicitly authored,
reviewed source change, not by rewriting the exported candidate or pretending the handoff
approved a different identity.

The new CLI is a **read-only preflight**. It does not modify the catalog or course, create an
approval, request a key, sign, fetch URLs or publish. Use it with a separately retained export
digest and a publisher-prepared independent review record:

```sh
node --import tsx scripts/verify-promotion-handoff.ts \
  --handoff reviewed-handoff.json \
  --expected-handoff-sha256 RETAINED_EXPORT_SHA256 \
  --course candidate-course.json \
  --publisher-review independent-publisher-review.json \
  --previous-dir authenticated-previous-release \
  --community-origin https://YOUR_EXISTING_COMMUNITY_API_ORIGIN
```

The origin is explicit trusted deployment configuration, required when the original source
uses community media. It is never trusted from an imported document and does not add an
origin to the application. The course file must have exactly the reviewed candidate's JSON
content, including identity/revision, metadata and embedded images. Its raw file SHA-256 is
reported separately. If Spreadsheet assignments are present, also pass
`--spreadsheet-approval samples/reviews/COURSE_ID.json`; the existing independent Spreadsheet
approval validator must accept the exact course snapshot. A promotion checklist is no
substitute for that approval.

The publisher record uses this strict schema. The publisher, not this tool, supplies all
review statements and evidence. The four boolean fields must be `true` only after the
corresponding independent checks have actually been performed:

```json
{
  "format": "erudior-independent-publisher-review",
  "version": 1,
  "handoffSha256": "RETAINED_EXPORT_SHA256",
  "courseId": "UNCHANGED_AUTHORED_ID",
  "revision": 1,
  "publisher": "INDEPENDENT_PUBLISHER_IDENTITY",
  "reviewedAt": "2026-11-04T00:00:00.000Z",
  "authorizedPublisher": false,
  "independentlyReviewedContent": false,
  "independentlyReviewedRights": false,
  "verifiedSourceEvidence": false,
  "authorizationReference": "Retained authority reference and scope",
  "contentEvidence": "Independent content and accessibility findings",
  "rightsEvidence": "Independent source/media rights and licensing findings",
  "sourceEvidence": "Provenance, current review/revocation and source verification"
}
```

The CLI rejects an identical recorded admin/publisher identity, an earlier publisher review,
a review for different bytes/identity/revision, and incomplete assertions. These checks
establish the record's consistency, not the real-world identity or legal authority of its
author. There is no production key override or development bypass. The previous catalog
must verify against `COURSE_PUBLIC_KEYS`; the relevant previous immutable artifact must
match its signed digest/size and identity. Revision comparison uses the existing course
revision validator. Reusing an existing revision requires identical raw course-file bytes.

Success prints a JSON report with status `preflight-passed-not-published`, verified byte and
signature checks, recorded human attestations, and facts **not established**: legal rights,
reviewer identity/authority, current server revocation/source state, deployed baseline
freshness, production signing and publication. Exit status 1 means blocked. Unknown and
duplicate options fail closed. Recheck live review status and release baseline freshness,
then use the **unchanged** `scripts/publish-courses.ts` production path and all repository,
Spreadsheet, authenticated-prior-release, signature, immutable-artifact and deployment
checks. Retain the report and source evidence with the separate authorized publication
change. This feature itself adopts no community course into the official catalog.

## Verification

- `node --import tsx tests/promotion-review.test.mts` checks strict parsing, source/media
  parity, exact review binding, evidence requirements, revocation export rejection and
  hostile/tampered data.
- `node --import tsx tests/promotion-publisher.test.mts` checks the read-only CLI and the
  unchanged signed release path in a disposable repository copy using ephemeral **test-only**
  signing keys. It covers untrusted signatures, identity/revision collisions, immutable byte
  tampering, Spreadsheet approval and compatible updates. No production key or pin changes.
- `node scripts/promotion-review-browser.mjs` exercises authenticated admin review, retained evidence,
  retry/conflict/refresh/revocation flows and a downloaded synthetic handoff through that
  isolated publisher fixture. Test fixture statements are not real legal or publishing approvals.

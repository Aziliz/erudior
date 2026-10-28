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

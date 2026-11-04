# Public learning access

Independent browser learning requires no account. Catalog prerequisites are recommended background for this mode only. Native/managed learners still use their assignment and prerequisite rules; public practice is not supervised credit, professional eligibility, or a certificate.

## Discovery and links

The public site links to the browser app. Catalog overviews expose course opening and lesson browsing. A fresh course/lesson/reader/reference/activity link retains its exact target while the user opens the course. Official bytes still load through the signed-catalog and SHA-256 path. Failed downloads leave a visible retryable error; malformed routes fail closed. No course prose, questions, identifiers or published artifact bytes are changed.

## Storage choice

Ordinary browser study uses existing IndexedDB local progress and the Progress screen's backup/export/recovery controls. **Start temporary session**, or `?guest=1`, creates an isolated in-memory course/progress/document/draft store. It neither reads nor overwrites saved learning data. Reloading, closing, or navigating away loses the temporary data. Export before leaving if it should be kept; use the existing backup recovery flow explicitly to import into saved-device study.

Temporary mode is not a browser privacy/anonymity mechanism: public catalog cache and display preferences may still use browser storage, and the hosting provider sees ordinary requests. Live rooms, presentations and account-based authoring/review are unavailable in temporary mode because they use separate server state. Public resource viewing remains subject to existing media/network behavior. Native and supervised browser builds ignore `guest=1`; it cannot switch a selected student's storage or authority.

Legacy code and spreadsheet drafts use the same explicit temporary lifetime. Code/workbook scratch drafts are not promised as part of the course-progress backup unless the existing export format includes them. Save/export the relevant work explicitly where provided.

## Acceptance

- Focused model/UI tests cover public advisory versus managed prerequisite locks, identity-safe routes, failure/retry and disabled duplicate controls.
- Temporary storage tests cover no persistent reads/writes, CAS contention, erase-generation fences, attachment recovery and legacy draft isolation.
- Browser acceptance covers real application course loading, reading/practice, direct links, persistence/reset/export, rejected downloads, light/dark mobile/desktop and accessibility.
- Full regression and required signing/security/release-integrity checks run unchanged after merge. Roadmap Done follows verified deployment only.

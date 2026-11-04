# Public audience-page screenshots

The For parents, For teachers and Live rooms pages explain the current application implementation. Their pictures are captures of the actual full Erudior App running in a browser, with disposable synthetic local records. They are not mockups, physical-device captures, or proof that an older installed preview includes the pictured changes.

The capture harness enables the existing `VITE_HOMESCHOOL=1` application feature flag, opens actual Family and Classroom navigation, and uses an isolated local Worker/D1/R2 service for live-room flows. It never reads real family records or creates public live rooms. It does not spoof native platform APIs. The public website itself retains no Family or Classroom account surface.

## Reproduction and provenance

Run `node scripts/audience-app-capture.mjs` in the supported browser environment. Desktop screenshots are intended for the public pages; phone screenshots are verification evidence. Retain the generated manifest with its exact source commit, feature flags, synthetic fixture notice, tab labels, screenshot paths and hashes. Deploy only captures reviewed against that manifest. WebP files are encoded copies of the captured PNGs, not redrawn or generated images.

The dedicated Actions workflow retains full evidence and validates the three real public routes at desktop/phone widths and light/dark modes. Public-site tests verify image delivery, text enlargement, accessibility, disclosure interactions, navigation and reload behavior. Full repository checks remain required before merging.

## Representation boundaries

Local family, classroom, academic and backup workflows do not imply remote school accounts, cloud synchronization, verified guardianship or regulatory compliance. File-based hand-ins are distinct from remote messaging. Live quizzes use a separately configured service and temporary sessions; they do not grant academic credit or issue credentials. Recent native changes require a subsequent installer release.

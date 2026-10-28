# Shared canonical course and content model

**Roadmap status: In Progress. Local integration; not yet deployed.** This document describes one complete roadmap capability, not a new subfeature or a claim of production completion.

## Representation and authority

`erudior-canonical-authoring` version1 contains one authoritative portable `examiner-course` version1 object. Canonical community documents cannot carry conflicting legacy lesson/deck/resource mirrors. All existing supported module/lesson, bank/exam/question, reader, language/vocabulary/audio, bibliography, glossary, reference/drill, writing/rubric/lab/activity and spreadsheet fields are validated without silent pruning. Authored prerequisites are references, not official approval or automatic academic credit.

Source IDs, authorship, revisions and optional metadata remain authored values. Runtime bank namespaces and installed community version/provenance are explicit adapter operations; they never replace the immutable published source. Exporting the original published authoring payload preserves source metadata. Exporting an installed course is a portable snapshot of that installed version, not a false claim that its runtime identity was the original source identity. No `canonicalSource` shadow object can overwrite subsequent edits.

Community review, licensing declarations, official publishing authorization, signed previous-catalog verification, immutable artifact checks and spreadsheet release approval remain separate gates. A browser payload, import, promotion candidate or reviewed community badge does not grant official publication authority. No license proposal is adopted by this work.

## Supported authored semantics

The model preserves all existing question families (choice, text, matching, labeling, order, models, maps, timelines and code), section/exam timing/quotas/marks, accessible image captions and phonics/listening metadata. Readers retain kinds, sections, vocabulary/footnotes, language/source information and first-bank question references. Lessons and rendered text preserve Markdown, ordinary fenced examples, tables and supported interactive blocks including phonics, maps/timelines/simulations, code, examples, figures/plots/shapes/number lines, manipulatives, assignments, dialogues/speaking and Mermaid diagrams.

Validation is worker-safe and never executes submitted code or renders untrusted figures. Mermaid preflight checks bounded supported families and excludes executable configuration/resources; the installed Mermaid runtime still supplies full syntax parsing and strict sanitized rendering. Ordinary code fences and literal widget markers remain inert. Figure label placement is bounded even for extreme offscreen coordinates.

## Assets and bounded transport

Existing900KiB community document, owned-image transport and audio upload limits are retained. These are transport constraints, not a reason to silently truncate or normalize larger source packages. Large packages receive an actionable limit error; this release does not claim that every historical package can fit one community document unchanged. Source/install validation uses separate structural bounds.

Embedded raster and static SVG assets are preserved byte-for-byte. SVG is parsed as XML with an explicit static element/attribute/CSS contract: no scripts, event handlers, foreign HTML, document types/entities, processing instructions or external references. Namespace-free geometry is allowed only in the existing map-fragment context. Community image references use trusted configured HTTPS origin and canonical image routes, require ownership at publication, and are embedded only in the runtime installation. The immutable source is not rewritten. Arbitrary external media is not fetched automatically; unresolved assets fail visibly. Original source rights still require review.

## Migration, durable storage and recovery

Explicit legacy migration reports every documented default/shorthand conversion and rejects unknown authored fields. Runtime recovery retains compatibility for historical local data; untrusted versioned imports and backups perform strict lossless preflight before any write/deletion. Authored `updated` metadata is no longer replaced by an incidental storage/export timestamp.

Reader state retains semantic revision fingerprints, archived completions and unchanged positions, cumulative writer receipts and time. Failed saves remain visible and retry without double-counting. Question launches persist before navigation. Community reading does not enter official records. Official reading-log updates share deletion/membership guards. Existing local/encrypted backup restores exact authored metadata and isolated learner histories. No new cloud learner storage, native filesystem permissions or grading authority is introduced.

Before downgrading, export an encrypted backup and retain source payloads. Older versions do not understand the canonical community envelope or all optional reading-history metadata; do not roundtrip newer data through an older permissive editor. Restore with a supporting version. Existing generic progress multi-process concurrency limitations are not represented as newly solved.

## Acceptance ledger

Local focused evidence includes explicit adapter/migration contracts; eight demo-family and full-corpus supported-model roundtrips; authoring save/reopen and pending-upload protection; canonical community draft/publish/install/review identity; immutable loaded-version review; image ownership; reader retry/revision/profile/deletion behavior; and encrypted metadata/history recovery. Exact final test/CI/deployment references must be added before the roadmap is marked Done.

Raw-source audit intentionally refuses three malformed historical flashcard objects with unsupported extra keys: geometry c419 (`E`, `F)`), linear algebra c303 (`4) code`), and biology c506 (`C4 and CAM plants`). This does not authorize silently deleting those fields or editing course content. Supported normalized models are audited separately from malformed raw migration.

Required before release: all newly added suites registered; complete regression/build and worker tests; independent security/ownership review; exact-head CI and unchanged signing/release integrity gates. Merge only the completed whole capability. Run full regression after merge, verify the applicable separated deployment lanes, then update both public/local roadmap status accurately. Spreadsheet remains In Progress for its original remaining broader scope.

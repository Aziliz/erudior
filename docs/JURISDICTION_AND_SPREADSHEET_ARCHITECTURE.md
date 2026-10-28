# Jurisdiction-neutral learning engine and spreadsheet workspace

## Design rule
No engine behavior is named for or restricted to one US state. Every state, the District of Columbia, and additional jurisdictions use the same contracts, evidence and simulation engines with independently versioned jurisdiction-specific content packs. Never apply a state's legal forms, required hours or scoring rules to another jurisdiction by default.

## Jurisdiction content pack (planned)
- `jurisdictionId`, `authority`, `effectiveFrom`, `effectiveThrough`, `sourceUrls`, `reviewedAt`, `version`.
- Course requirements: required subjects, hours, accepted learning evidence, assessment minimums, exemptions and renewal requirements.
- Forms and workflows: contract templates, disclosure requirements, counteroffers, deadlines, trust-account and escrow rules, proration policies, recording requirements.
- Separate statutory requirements from instructor-authored examples; require review and audit trail before an official pack is published.
- A course selects its jurisdiction pack, or explicitly operates in jurisdiction-agnostic training mode. Missing rules fail visibly as unavailable, never fall back silently to Colorado or another state.

## Reusable spreadsheet simulator (planned)
A spreadsheet workbook is an editable grid engine, not a purpose-built six-column closing worksheet.
- Worksheets, typed cells, formulas, named ranges, cross-sheet references, recalculation dependencies and validation rules.
- Instructor-provided templates with protected inputs, scenario data, expected outputs, automated grading and cell-level explanations.
- Include templates for six-column closing statements, settlement/proration sheets, account reconciliation, financial modeling, budgeting and general Excel skills.
- Separate formula runtime from optional Excel-compatible import/export and macro education. **Do not execute imported VBA or untrusted macros.** For macro lessons use a sandboxed, explicitly permissioned training interpreter or safe simulated outcomes with audit traces.
- Preserve workbook revisions, learner answers and grading evidence. Provide accessible table navigation and keyboard interactions.

## Reuse across courses
The same spreadsheet engine serves real estate, accounting, finance, business, statistics and spreadsheet/macro courses. The same state-pack mechanism serves real estate licensing, regulated vocational education, homeschool rules and other jurisdiction-based curricula, without mixing their subject-specific rules.

## Acceptance criteria
1. Two different jurisdiction packs produce different requirements from the same underlying engine, with no hardcoded Colorado branches.
2. A missing state pack cannot silently certify compliance.
3. The same grid/formula engine runs a closing/proration template and a generic spreadsheet-functions lesson.
4. Macro demonstrations cannot execute untrusted imported programs.
5. Public roadmap categories use only Planned, In Progress or Done for development work; examples of one jurisdiction are clearly labeled examples, not platform limits.

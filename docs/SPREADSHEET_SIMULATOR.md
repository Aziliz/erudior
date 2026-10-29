# Versioned spreadsheet simulator

The reusable spreadsheet engine supports canonical and community authoring,
review, publication/install, per-learner drafts, immutable submissions, instructor
review and encrypted recovery. It is an educational simulator, not Excel, official
financial advice or a macro execution host. No course content is added here.

## Author and review

In a course's **Spreadsheets** editor, explicitly enable **version 2 workbook
features**. Author named ranges, number/integer/list validation, cell explanations
and ordered simulated macro steps using the structured controls. Apply pending
feature and cell edits, then apply the assignment and save the course. The same
editor is used for community courses. Exact starter metadata is part of the
reviewed course snapshot; editing any field invalidates its review receipt.
Publication/install validates metadata before media retrieval and retains existing
licensing, signing, immutable package and human review gates.

Protection locks the raw contents of each listed cell, not all its dependencies.
Explicitly protect any input that learners must not edit. A protected formula may
recalculate when an intentionally editable input changes. Names, rules,
explanations and macro definitions are instructor metadata: learner work cannot
replace them. Validation checks calculated values, including formula results;
invalid outcomes cannot earn a passing grade. Allow blank cells when learners
need an incomplete intermediate state. All final rules are checked when grading.

## Calculation profile

Legacy workbooks without `engineVersion` retain the original arithmetic evaluator.
Opted-in `engineVersion: 2` supports arithmetic, comparisons, concatenation,
parentheses, dollar-marked references, quoted worksheet names, cross-sheet ranges
and named ranges. Dollar signs identify the same cell; this is not a drag-fill
relative-reference engine. Recalculation follows current dependencies with a
shared cache, rejects cycles and imposes operation/depth bounds.

Functions: `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT`, `IF`, `AND`, `OR`, `NOT`,
`ROUND`, `ABS`, `SUMIF`, `COUNTIF`, and `VLOOKUP`. IF evaluates only its selected
branch. Typed arithmetic does not coerce text to numbers. Logical results are
numeric 0/1; aggregates ignore text. Text comparisons and lookup are case-sensitive.
SUMIF/COUNTIF accept exact typed criteria or simple comparison strings, not
wildcards. VLOOKUP requires an exact match (fourth argument 0/FALSE). ROUND accepts
integer digits from -12 through 12. Numbers use finite JavaScript floating-point
arithmetic, not exact decimal currency; binary rounding effects remain possible.
Unsupported functions and malformed/circular calculations fail visibly.

Limits include 20 sheets, 1,000 populated cells per sheet, 2,048-character cell
text, 1,000 cells per range, 100 named ranges, 100 rules covering at most 10,000
cells, 1,000 explanations, 1,024 formula tokens, 64 nesting/dependency levels and
100,000 calculation operations per shared evaluation. Standard coordinate bounds
are retained. This is a documented subset, not universal Excel compatibility.

## Safe simulated macro teaching

Definitions contain only ordered **set** and **copy** cell steps. Copy copies exact
raw contents, including formula text; it does not translate relative references.
There are no loops, arbitrary script expressions, imported VBA, dynamic code,
filesystem, network, shell or external application operations. At most 20 macros
with 50 steps each are accepted. An author-supplied label never conveys permission.

Learners explicitly preview the changes, inspect before/after cells, then consent
for that run. Cancel does not modify work. Applying rechecks the exact current
workbook and recomputes the preview; stale or altered previews fail. Protected
cells, final validation rules, formulas and workbook limits are checked before
any atomic update. Traces contain exact definitions, before/after snapshots and
ordered changes. They are replay-validated, limited to 64 KiB each and five per
learner draft/submission, subject also to the existing 256 KiB submission limit.
A trace is local educational simulation evidence, not authenticated proof of who
ran a program. Manual edits after a run remain separate from its frozen snapshot.

## Learner, evidence and recovery

V2 cell edits are staged until Apply/Enter; pending edits cannot be silently skipped
by grading, submission or macro actions. Named scrollable tables and bounded cell
address navigation support keyboard and small screens. Rules and cell explanations
are visible. Invalid edits remain available to correct rather than being saved.
Drafts preserve traces; reset clears current work/traces but never old submissions.
Failures retain exact retry identities, and active-learner checks prevent stale
submission writes. Different learners and changed assignments do not reuse drafts.

New V2 submissions retain `gradingVersion: 2`; historical V1 entries always use
`spreadsheetGradingV1.ts`, unchanged. Future engine extensions must introduce a new
grading dispatch rather than reinterpret these saved versions. Evidence includes
exact source, submitted workbook, deterministic grade and optional trace history.
Instructor feedback, signed classroom transport, deletion and encrypted backup
use existing immutable workflows. Imported traces never grant roles, approval,
source trust or regulatory credit. Recovery validates complete mixed V1/V2 history
before writes; malformed grade/version/metadata/trace imports fail closed.

Optional Excel file exchange, real VBA execution, official financial templates,
new courses and consolidated desktop installers are not supplied by this change.
Synthetic tests demonstrate both closing/proration calculations and general
spreadsheet functions through the same engine, without state-specific branches.

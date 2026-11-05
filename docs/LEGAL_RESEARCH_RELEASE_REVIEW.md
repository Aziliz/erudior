# Legal Research and Citation — release candidate

Updated November 5, 2026 against app main 58b83b9759fe504bb8713b3e075dc0c0e4bc5629.
**Draft, unmerged and unpublished.** The LSAT-first J.D. Preparation program has
25 courses; this candidate offers four, with 21 planned. Existing saved 24-course
plans remain intact as custom plans. Following or viewing the program installs no
course; each course has an explicit Start action.

## Content and preservation

Revision 1 contains four modules, eight lessons, 80 questions, 64 cards, 56 glossary
entries and four references. The fictional research packet includes a model
authority table, research log and self-assessed explanatory note. It is independent
preparation; the objective quizzes do not grade the portfolio prose or grant credit.

Runtime SHA-256: 7324211b85de82cc66bb1f94fac0be9a9a27b0a40502c15b47696b2a59bfee36 (193,022 bytes).
Only description metadata differs from the earlier separately validated draft:
the obsolete “Third course” ordinal was removed when LSAT moved first. Every other
runtime field and instructional key is identical. Historical validation retains its
original digest and app pin; it is not represented as a new full-content review.

Current app candidate catalog SHA-256: 31651fd0f1d927811d220ebce3660399e62634b651f84ab2aa29697c0e04c416.
All 25 current-main packages and their catalog entries are preserved, including
Colorado broker r18 and the pending language revisions. All 33 existing sitemap
URLs remain, with the Legal Research overview added. The private source PR's
generated catalog belongs to source main 12122c5; it must not overwrite newer,
unrelated app catalog entries when this course is integrated.

## Executed checks

- The four-module draft's earlier complete review passed all 80 keys, 392 negative
  cases, 63 accepted text variants and 40 partial/empty cases. Those answer checks
  were also rerun against the final description-adjusted runtime in the prior slice.
- Current program model, learning pathways, rendered enrollment and Legal Research
  package checks pass. TypeScript and production build pass.
- Final Chromium 153 public/app navigation passes 40 accessibility/layout states:
  320px and 1280px, light and dark. All four course overviews and first lessons open;
  explicit Start installs only the selected course, reload retains the plan and
  stopping the plan preserves the four started courses. No page errors.
- Read-only comparison of all 26 candidate packages against the authenticated
  24-course production baseline finds no identity/revision compatibility issues,
  no removed courses and 3001 valid carried-vocabulary source-lesson references.
  Signature and package hashes were checked against the app-pinned key.
- The normal production publisher remains stopped at the approval gate described
  below. The read-only comparison is narrower evidence and does not replace it.

The signed baseline catalog SHA-256 is
13315e2ea68091a982ac1bae0358725dddfadd8fee1abf64b83c906af0726ea1.
Since that baseline, main contains German A1–B1 revisions, Japanese N5 and Colorado
broker r18; this candidate preserves them and adds Legal Research.

## Compatibility repairs and remaining gates

Main 54ef815 fixes the carried-vocabulary namespace error and validates external
source lessons in the publisher. Main 58b83b9 removes a duplicate v1-only canonical
workbook shape check, retaining the strict versioned workbook validator. Both
concurrent repairs are preserved exactly here. PR 146 now adds regression tests
for full v2 metadata roundtrip, inert macros and 12 invalid/authority-bearing inputs.
Its local official-source test passes 22 course migrations with the same three
documented unrelated source-format exceptions.

The current production publisher fails on **Colorado r18 approval snapshot digest
mismatch**. Its existing receipt binds
4e617115bdb8490ca7fce47a7cfa306c100df36b59b10322a6e2eb7846c372d5;
the repaired import produces
3f24507ceebc49585fffb68c443703ceefa3da0472af07a488996a87ef0de926.
A read-only old/new comparison finds four answer-array entries for ordering question
s4-034 (previously empty, now 0/1/2/3) and 654 omitted-versus-empty glossary alias
fields. The package bytes themselves are unchanged. This is not treated as a pure
formatting change: the resulting snapshot needs review and a valid approval record.
No reviewer identity, approval digest or review date was changed in this work.

Private source PR 7 remains blocked by GitHub's confirmed failed-payment/spending
restriction. Its check on source commit 32a108c, run 42110405714/job 127536133913, failed before
steps ran. Account-owner action is needed, followed by normal hosted validation.

Keep this PR draft. Resolve the approval binding and private runner prerequisite;
require passing checks on the current source/app commits, then use the unchanged
signed baseline, immutable-object checks, fresh-main/baseline guards, catalog-last
upload and authoritative readback. No billing, workflow, signing, review or trust
guard is weakened. Local success does not establish hosted success or publication.

Merge integration preserves subsequent main 97764d1a2a88ce20b9114c5309265dfe04be395d,
which only adds document/transaction validator paths to existing release workflows.
No tested application or course bytes changed in that concurrent commit.

# Spreadsheet assignment review approvals for official course releases

Spreadsheet-bearing courses require a human review record before production course packages can be signed. The release checks are independent of the spreadsheet practice lab, and courses without spreadsheet assignments are unaffected.

After verifying the exact course snapshot (including formulas, protected cells, tolerances, and lesson links), an authorized reviewer places `samples/reviews/<course-id>.json` into the proposed release changes:

```json
{
  "courseId": "example-course-id",
  "revision": 1,
  "snapshotSha256": "<64-character SHA-256 of exportCourseSnapshot(importValidatedCourseSnapshot(course file))>",
  "reviewer": "Reviewer identity",
  "reviewedAt": "2026-10-28T00:00:00Z"
}
```

The `snapshotSha256` must be produced from the normalized, validated course snapshot, not from the raw file. The release step calculates it independently. Any course change, including a changed lesson or grading formula, invalidates the approval and requires another review.

**Security boundary:** A JSON approval record in Git is an auditable acknowledgement, not cryptographic proof that an authorized reviewer approved it. Protect the reviews directory with branch protection and mandatory CODEOWNERS review before using this for regulated or production compliance. The official signed course publication pipeline retains all existing signature and revision checks. Development course signing (`--dev`) does not impose production review requirements.

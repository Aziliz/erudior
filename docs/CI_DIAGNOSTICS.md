# Erudior CI diagnostics

All four GitHub Actions workflows produce a **CI diagnostic summary** and a downloadable `erudior-diagnostics-<job>` artifact, retained for 30 days, even when an earlier build, test or deployment step fails.

## How to investigate a stopped run
1. Open **GitHub → Aziliz/erudior → Actions**, then select the failed run.
2. Read the job **Summary** for failed stages, commit SHA, runner OS and run attempt.
3. Download the **Artifacts → erudior-diagnostics-...** JSON file. It contains `schema`, `workflow`, `runId`, `attempt`, `commit`, `job`, `runnerOS`, `stages`, and `failedStages`.
4. Open the named failing step for full native logs, including error text and timing.
5. For R2 upload failures, expand the per-artifact verification log group to inspect HTTP status, DNS/connect/first-byte/transfer durations and curl exit status. On immutable byte mismatch, both artifact SHA-256 hashes and byte counts are logged.
6. Check the independent website and course-publish jobs separately: one can succeed while the other fails.

## Interpretation
- `previous_release: failure`: examine signed-catalog retrieval and verification, CDN/R2 discrepancies, and hash mismatch. Do **not** bypass signatures.
- `regression: failure` or `build: failure`: inspect the specific test or compiler error before the next merge.
- `upload: failure`: examine curl exit codes (28 = timeout), R2 origin fallback and network timing. An uncertain transfer never proves object absence.
- `deploy: failure`: inspect the Cloudflare Pages, community worker or Tauri installer deployment step.
- `skipped`: a prior dependency or job condition may have prevented a stage from running; it does not mean that step succeeded.
- A `queued` run has no runner logs or artifacts yet. GitHub Actions outages or an agent stopping before it starts a workflow cannot be diagnosed by runner-side logging.

## Privacy and security
The reporter only records an allowlist of step outcomes and GitHub runner metadata; it never dumps environment variables, access tokens, signing keys, request headers, student records or course contents. Native GitHub Actions logs are still subject to GitHub's permissions and retention rules. Artifact integrity/signature checks and branch protections remain mandatory.

## Schema contract
`erudior.ci-diagnostics.v1` is safe for future monitoring and incident analysis. The JSON is a diagnostic aid, not an attestation of release integrity or a replacement for native logs.

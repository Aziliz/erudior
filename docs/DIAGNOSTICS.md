# Erudior diagnostic logging

Erudior CI provides **two layers** of incident evidence: GitHub's native, timestamped
step logs (detailed, access-controlled by GitHub) and a deliberately minimal
structured diagnostic artifact (safe to retain and share internally).

## When a workflow fails

1. Open the failed GitHub Actions run and find the first failed step, not merely
   the artifact-upload or cleanup step.
2. Read the **Erudior diagnostics** entries in the run Summary.
3. Download the `erudior-diagnostics-*` artifact and compare
   `fingerprint`, `stage`, `exitCode`, `durationMs`, and `indicators`
   with previous failures.
4. Open the original GitHub step log for the actual compiler/test message.
   Correlate with run ID, attempt, commit, runner OS and stage.
5. Reproduce locally with `node scripts/diagnostic-command.mjs regression -- npm test`,
   or substitute the exact failing command. The local report is written under
   `./erudior-ci-diagnostics/`. The command retains its exit code.
6. If a job fails before checkout/setup, check its GitHub runner provisioning
   and permissions messages; no repository script can capture a pre-checkout failure.

## Privacy and security

The structured artifacts intentionally **do not** contain arbitrary raw output,
request bodies, user data, environment variables, URLs, authorization headers,
tokens or stack traces. The command wrapper passes through normal stdout/stderr
to the GitHub Actions log, which uses GitHub secret masking. Treat those native
logs as sensitive and restrict access. Diagnostic bundles only contain generic
error classifications and bounded metadata; no attempt is made to collect
unredacted logs in artifacts.

Artifacts expire after 30 days. Do not bypass required tests or integrity gates
in response to a diagnostic failure. A failure fingerprint can help group
repeated incidents but is not a substitute for the underlying error.

## Coverage and limitations

The installer workflow records regression, tagged/manual build and packaging
outcomes per OS, including on failed jobs. The command wrapper provides command
exit status, elapsed time, coarse error indicators and a stable fingerprint.
Future website deployment workflows can add the same two steps (diagnostic
manifest and `upload-artifact` with `if: always()`) to report publishing failures.

Application-side exception tracing, browser telemetry and server request logs
are *not* collected by this CI suite; they require separately designed consent,
retention and redaction controls appropriate to learner information.

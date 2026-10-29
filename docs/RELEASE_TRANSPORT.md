# Release transport reliability

Run 40660328683 authenticated all 20 existing packages, but several public
transfers repeatedly stalled. Its later immutable-object check failed with curl
exit 28 after receiving only 458752 of 2182362 bytes of Algebra 1. This was not a
hash mismatch; no catalog was published by that failed run.

The publisher now uses bounded public transfers with explicit diagnostics. For
known transient transport failures only, it can read the same artifact from the
authoritative R2 bucket using the workflow's existing credentials. Signature and
SHA-256 verification still apply to every candidate. Invalid signatures, content
mismatches, authentication/certificate/redirect failures and permanent HTTP errors
are not permission to accept alternative content. First-release bootstrap remains
explicit and requires its original signing and HTTP404 checks.

Immutable-file checks compare exact bytes regardless of transport. Only a
confirmed public HTTP404 returns the reserved missing-object status. Failed origin
lookups are normalized to failure, never interpreted as absence or permission to
overwrite. Upload/revision checks and catalog recheck/read-back remain unchanged.
Both long transfer stages have a 15-minute CI limit.

Tests: `node --import tsx tests/release-transfer.test.mts` covers transient fallback,
partial content, exact comparison, permanent errors, TLS/redirect rejection and
reserved-status collisions. The full regression suite remains post-merge.

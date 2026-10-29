# German course artifact recovery — 2026-10-28

The authenticated production catalog names German A1 revision 3, A2 revision 2,
and B1 revision 2 with SHA-256 digests matching source commit
`98a15b2e301d67a820e25697704830c10ecec886`. Earlier bytes were published under the
same filenames from commit `f9bf63b20a93b54953bd92c49e537aaa7b533223`.
The new publishing integrity checks correctly refuse these mismatches.

This incident repair does not issue a new signature or alter catalog contents.
It reads the authoritative R2 catalog and signature, verifies pinned app keys,
and restores only allowlisted old bytes to the exact bytes that the signed
catalog already requires. Unknown origin bytes, changed authority, or different
source bytes stop the repair. All three targets are checked before writing.
Old bytes are retained under content-addressed `recovery/2026-10-28/` R2 keys,
with verified read-back before restoring. Restored objects are read back again.
The job must be current `main`, and runs in the existing serialized publication
job. Its ordinary authenticated baseline, immutable artifact, revision, review,
and signing checks are not weakened.

## Completion and removal

The site workflow invocation is temporary. After verified repair, remove that
invocation in the next PR before continuing feature development. Retain the
script, allowlist, and tests as the incident record, not a general overwrite
facility. Normal publication must subsequently pass without invoking recovery.
Verify all production course digests, website deployment, post-merge regression
suite, and final publishing workflow. If public responses remain stale after
origin verification, investigate CDN caching; do not accept mismatched bytes.

The repair is not an atomic R2 compare-and-swap. Existing GitHub concurrency and
latest-main checks serialize this repository's writer. An independently
authorized external writer remains a race limitation; stop if observed.

## Verified recovery outcome

PR #55 merged as `166cb45fd8ea3788e2bfd52eea185fe35ce514f7`. Run
[40659248714](https://github.com/Aziliz/erudior/actions/runs/40659248714)
restored all three allowlisted objects, verified their retained backups and
origin read-back, authenticated all 20 public course files, and successfully
published/read back the catalog and signature. Website deployment and full
regression suite passed. Independent engine-integrity workflow
[40659248745](https://github.com/Aziliz/erudior/actions/runs/40659248745) also passed.

The temporary invocation has now been removed. The recovery script remains
an explicit incident record only; ordinary publication cannot invoke it.

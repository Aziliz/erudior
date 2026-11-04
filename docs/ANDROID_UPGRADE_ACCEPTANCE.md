# Android in-app upgrade acceptance

The `Android in-app upgrade acceptance / in-app-upgrade` job is a hard-failing
acceptance test, separate from the older same-APK reinstall and shell-origin
installer diagnostics. Do not treat those older green checks as a replacement.

The test builds optimized **0.25.1 / versionCode 250001** and **0.25.2 /
versionCode 250002** for x86_64 with one ephemeral signing certificate. It installs
only the baseline using ADB. Every upgrade attempt then starts by clicking the
normal **Verify and open installer** button in Erudior's actual Android WebView.

It verifies a corrupted native download is rejected, the app opens its per-app
installation-permission screen, the app's FileProvider handoff reaches Android's
approval UI, cancellation preserves the old version and records, approval installs
the newer version, and restarting it reloads the same stored course, lesson dates,
review cards, study preferences, plan, and separate-profile progress. The fixture
uses the application's storage APIs and valid data schemas, not files pushed into
an assumed data directory. It is synthetic learner data, not a human user's records.
It validates persistence of a stored course, not the public course-download service.

## Isolation

`prepare.py` runs only with both `GITHUB_ACTIONS=true` and `ERUDIOR_UPGRADE_E2E=1`.
Only the generated Kotlin copy receives local HTTPS endpoints and WebView debugging.
Its local certificate is trusted for `127.0.0.1` only. Production checksum, size,
package, signer, and version checks remain unchanged. The UI helper is copied and
imported only into this disposable CI checkout; it cannot mock the update action.
The test refuses physical devices and a preexisting Erudior installation. The job
has read-only repository permission, no release secrets, and never publishes APKs.
Evidence uploads exclude APKs, private keys, and certificates.

## Evidence and release boundary

`android-in-app-upgrade-evidence` contains ordered results, native permission and
approval screenshots, failure logs, and before/after synthetic-record snapshots.
A missing/failing acceptance result remains a blocker. After a passing test,
validate the combined current-main build, public signed ARM64 release bytes and
update manifest before recommending a fresh phone download. This fixture does not
prove GitHub CDN behavior or replace device validation of the production release.

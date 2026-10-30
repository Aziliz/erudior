# Publishing the Android preview

Use **Publish verified Android preview**. Run it on `main` with `publish_preview=true`, or merge an explicit change to `.github/android-preview-publish.json`. Ordinary application commits do not publish. The request version must match `package.json`; the source commit distinguishes same-version previews.

The release workflow builds the normal optimized ARM64 package and reruns the actual two-version in-app acceptance test from the same commit. Publication requires both to succeed. The reusable acceptance workflow gets no production signing secrets and cannot publish its disposable x86_64 fixtures.

Before replacing the rolling preview, the publisher downloads its existing public APK, checks its digest against GitHub asset metadata, verifies both APK signatures, and requires matching certificates/package IDs and a nondecreasing Android versionCode. Once an update manifest exists, it also verifies the old manifest against the old bytes and requires the old source commit to be an ancestor of the candidate. A key mismatch or downgrade blocks publication; do not work around it by clearing learner data.

The publisher uploads the APK and checksum first, downloads them over public HTTPS, and compares the bytes with the verified candidate. Only then does it upload `android-update.json`, download it and verify the complete set. Temporary release keys are deleted and never included in artifacts. Publication is serialized; failures remain failures.

Evidence is retained for 14 days in `android-preview-public-verification`, including the public APK, checksum, manifest and verification JSON. `physicalPhoneVerified` remains false: controlled emulator acceptance and public transport verification do not establish a physical-phone installation or exercise the public course-download service.

For an existing preview that predates the native updater, download the new APK once and install it over the old application. Do not uninstall or clear application storage. Subsequent releases can use the in-app update flow after Android's required installation permission and approval.

The older **Android APK (development)** workflow is a development diagnostic lane; use the workflow above for the gated publication procedure.

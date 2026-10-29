# Android preview download

The public download page checks GitHub's published release with the tag `android-preview` and displays its real `.apk` asset. If no published APK is available, it explicitly shows **coming soon** instead of linking to a private or expiring Actions artifact.

## Publishing (maintainer action)

1. Finish validating the APK on the Android CI branch and merge the tested code.
2. Run the `Android APK (development)` workflow manually on `main` with the `publish_preview` input enabled.
3. The workflow publishes `Erudior-Android-arm64.apk` to the public GitHub release tagged `android-preview`. Check the release asset URL and download on an actual phone.
4. Deploy the website normally. The Android card on `/download` then automatically picks up the published APK.

Do not treat an APK compilation as evidence that device launch, offline persistence, or homeschool workflows have been tested. The Android card is marked an early preview.

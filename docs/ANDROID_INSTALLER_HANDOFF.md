# Android update installer handoff acceptance criteria

## Current status

The Android updater checks a published manifest, verifies the downloaded APK SHA-256, and stages bytes in `app_cache_dir()/updates/verified-update.apk`. **No installer UI is launched yet.** This is intentional until the native bridge is verified.

## Required Android-only bridge

1. Make the native installer open **only** the staged, re-read, hash-verified APK, not a remote download URL.
2. Expose that cache path through a scoped Android `FileProvider` using a `content://` URI and read-only URI grant. Do not use `file://` or broad external-storage permissions.
3. Check `canRequestPackageInstalls()` on Android 8+, offer the system's per-source permission settings, then recheck authorization.
4. Open `ACTION_VIEW` or `ACTION_INSTALL_PACKAGE` with `application/vnd.android.package-archive`, user confirmation required. Resolve the app promise only for **installer launched**, never claim installation succeeded.
5. Compare package identity and installed signing certificate; enforce consistent permanent release signing. Reject downgrade and unexpected package identity.
6. On next startup, verify installed version/build, retain data in app data storage, and remove old staged files from cache only after an install is confirmed.

## Tests needed before merging

- Emulator install of two differently versioned APKs signed with the **same stable test certificate**.
- Seed progress, one downloaded course, and settings before upgrading; verify unchanged after the upgrade and app restart.
- Negative cases: invalid hash, corrupted ZIP, unexpected APK package name, wrong signing certificate, installer permission denied/cancelled, lower version, insufficient storage, and interrupted download.
- CI must compare the release manifest to the exact published signed APK bytes.
- Human approval from the device installer must never be bypassed.

The Tauri mobile plugin API supports calling Kotlin native commands. An existing third-party APK installer plugin is available but should be security-reviewed and pinned before use. Its README explicitly states that the OS installation result cannot be observed merely from launching the installer, and warns about the Google Play policy implications of `REQUEST_INSTALL_PACKAGES`.

Nothing in this document authorizes publication or claims that Android in-place upgrades have passed.

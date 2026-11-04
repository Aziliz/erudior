# Android release signing (maintainer setup)

The Android preview debug APK is not a production update channel. The optimized APK must be signed with **one persistent private keystore** before publication.

Generate a keystore offline on a trusted machine (never in Actions):

```bash
keytool -genkeypair -v -keystore erudior-android-release.jks -alias erudior-android -keyalg RSA -keysize 3072 -validity 10000
base64 -w0 erudior-android-release.jks
```

Store these as GitHub Actions repository secrets:
- `ANDROID_KEYSTORE_B64`: base64 of keystore bytes
- `ANDROID_KEYSTORE_PASSWORD`: keystore password
- `ANDROID_KEY_ALIAS`: `erudior-android` or the alias actually chosen
- `ANDROID_KEY_PASSWORD`: private-key password

Never paste keystore contents or passwords into a chat, issue, log, or repository. Back up the keystore and passwords securely: losing them prevents normal updates signed by that certificate. The workflow decodes the keystore into a protected temporary file, aligns the optimized APK, signs with `apksigner`, verifies it, and deletes the temporary keystore.

**Current behavior:** the optimized APK is NOT automatically published. Missing secrets leave it unsigned and unpublished. The former debug publication steps are disabled to prevent accidentally replacing the public preview with a debug build. Follow up by adding a separate release job with signed artifact validation, then test sideload install and upgrades before publishing.

Existing installs signed with a different key cannot be updated in place; back up data before any uninstall. No keys should be committed.

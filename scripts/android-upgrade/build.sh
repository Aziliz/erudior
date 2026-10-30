#!/usr/bin/env bash
# Two distinct optimized versions, one disposable certificate. No public release keys.
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" = true && "${ERUDIOR_UPGRADE_E2E:-}" = 1 ]]
umask 077
mkdir -p .android-upgrade
trap 'rm -f .android-upgrade/signing.p12' EXIT
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 2 \
  -keyout .android-upgrade/tls-key.pem -out .android-upgrade/ca.pem \
  -subj '/CN=Erudior ephemeral CI' -addext 'subjectAltName=IP:127.0.0.1' \
  -addext 'basicConstraints=critical,CA:TRUE'
keytool -genkeypair -noprompt -storetype PKCS12 -keystore .android-upgrade/signing.p12 \
  -storepass changeit -keypass changeit -alias ci-only -keyalg RSA -keysize 3072 \
  -validity 2 -dname 'CN=Erudior Upgrade CI ONLY'
npm run tauri android init -- --ci
python3 scripts/android-integrate-installer.py
python3 scripts/android-upgrade/prepare.py
# This assertion deliberately excludes main.tsx: it receives the CI-only data helper import.
git diff --exit-code -- src/lib/updates.ts src/lib/androidUpdates.ts src/lib/storage.ts \
  src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt
bt="$ANDROID_HOME/build-tools/35.0.0"
for variant in a b; do
  export VITE_ANDROID_BUILD_SHA
  VITE_ANDROID_BUILD_SHA="$(printf "$variant%.0s" {1..40})"
  npm run tauri android build -- --apk --ci --target x86_64 \
    --config "$(pwd)/src-tauri/ci-upgrade-$variant.json"
  mapfile -t apks < <(find src-tauri/gen/android/app/build/outputs/apk -type f -name '*release-unsigned.apk')
  [[ "${#apks[@]}" = 1 ]]
  "$bt/zipalign" -f -p 4 "${apks[0]}" .android-upgrade/aligned.apk
  "$bt/apksigner" sign --ks .android-upgrade/signing.p12 --ks-key-alias ci-only \
    --ks-pass pass:changeit --key-pass pass:changeit \
    --out ".android-upgrade/$variant.apk" .android-upgrade/aligned.apk
  "$bt/apksigner" verify --verbose --print-certs ".android-upgrade/$variant.apk" > ".android-upgrade/$variant.signing.txt"
  "$bt/aapt" dump badging ".android-upgrade/$variant.apk" > ".android-upgrade/$variant.badging.txt"
done
python3 - <<'PY'
from pathlib import Path
import re
p = Path('.android-upgrade')
for variant, code, version in [('a',250001,'0.25.1'),('b',250002,'0.25.2')]:
    text = (p / f'{variant}.badging.txt').read_text()
    assert f"versionCode='{code}'" in text and f"versionName='{version}'" in text, text
    assert "native-code: 'x86_64'" in text, 'Fixture must not target phone ARM64'
cert = lambda v: re.search(r'Signer #1 certificate SHA-256 digest: (\S+)', (p / f'{v}.signing.txt').read_text()).group(1)
assert cert('a') == cert('b'), 'Upgrade fixtures must use exactly the same signing certificate'
assert (p/'a.apk').read_bytes() != (p/'b.apk').read_bytes(), 'Not a same-APK reinstall'
print('Verified distinct APK versions and shared ephemeral signing certificate')
PY

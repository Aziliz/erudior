#!/usr/bin/env python3
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('release_verify', ROOT / 'scripts/android-release-verify.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
BUILD = 'a' * 40
CERT = 'b' * 64
BADGING = "package: name='com.erudior.app' versionCode='250000' versionName='0.25.0' platformBuildVersionName='15'\nnative-code: 'arm64-v8a'\n"


class ReleaseVerificationTests(unittest.TestCase):
    def setUp(self):
        self.data = b'PK\x03\x04signed-fixture'
        self.manifest = {'schema': 1, 'version': '0.25.0', 'build': BUILD,
                         'apk': v.APK_URL, 'bytes': len(self.data),
                         'sha256': hashlib.sha256(self.data).hexdigest()}
        self.info = {**v.parse_badging(BADGING), 'signers': [CERT]}

    def test_package_and_abi_parsing(self):
        self.assertEqual(self.info['versionCode'], 250000)
        self.assertEqual(self.info['abis'], ['arm64-v8a'])
        self.assertFalse(self.info['debuggable'])
        with self.assertRaises(ValueError):
            v.parse_badging('invalid')

    def test_only_certificate_digests_are_accepted(self):
        text = f'Signer #1 certificate SHA-256 digest: {CERT}\nSigner #1 public key SHA-256 digest: ' + 'c' * 64
        self.assertEqual(v.parse_signers(text), [CERT])
        with self.assertRaises(ValueError):
            v.parse_signers('signature valid but no signer evidence')

    def test_same_version_previews_keep_update_compatibility(self):
        v.validate_upgrade(self.info, self.info)
        v.validate_upgrade({**self.info, 'versionCode': 250001}, self.info)

    def test_downgrades_signer_and_package_changes_fail(self):
        for change in [{'versionCode': 249999}, {'signers': ['c' * 64]}, {'signers': []}, {'package': 'com.other.app'}]:
            with self.subTest(change=change), self.assertRaises(ValueError):
                v.validate_upgrade({**self.info, **change}, self.info)

    def test_exact_manifest_matches_bytes(self):
        v.verify_manifest(self.manifest, self.data, '0.25.0', BUILD)

    def test_manifest_tampering_and_wrong_types_fail(self):
        for change in [{'schema': True}, {'bytes': True}, {'bytes': 1.5}, {'bytes': v.MAX_BYTES+1},
                       {'bytes': len(self.data)+1}, {'sha256': 'c'*64}, {'version': '0.24.0'},
                       {'build': 'c'*40}, {'apk': 'https://example.org/untrusted.apk'}]:
            with self.subTest(change=change), self.assertRaises(ValueError):
                v.verify_manifest({**self.manifest, **change}, self.data, '0.25.0', BUILD)
        with self.assertRaises(ValueError):
            v.verify_manifest(self.manifest, self.data+b'corrupt', '0.25.0', BUILD)

    def test_baseline_must_match_public_github_asset_metadata(self):
        asset = {'name': v.APK_NAME, 'state': 'uploaded', 'size': len(self.data),
                 'digest': 'sha256:'+hashlib.sha256(self.data).hexdigest()}
        v.verify_baseline_digest({'assets': [asset]}, self.data)
        for assets in [[], [asset, asset], [{**asset, 'digest': None}], [{**asset, 'size': 0}], [{**asset, 'state': 'new'}]]:
            with self.subTest(assets=assets), self.assertRaises(ValueError):
                v.verify_baseline_digest({'assets': assets}, self.data)

    def test_packaged_release_checks_run_and_reject_debug_or_wrong_abi(self):
        with tempfile.TemporaryDirectory() as directory:
            apk = Path(directory) / v.APK_NAME
            with zipfile.ZipFile(apk, 'w') as z:
                z.writestr('res/xml/erudior_update_paths.xml', 'compiled-xml-fixture')
            for badging, passes in [(BADGING, True), (BADGING+'application-debuggable\n', False),
                                    (BADGING.replace('arm64-v8a', 'x86_64'), False)]:
                with self.subTest(badging=badging), patch.dict('os.environ', {'ANDROID_HOME': '/sdk'}), \
                     patch.object(v.subprocess, 'check_output', side_effect=[badging, f'Signer #1 certificate SHA-256 digest: {CERT}\n', '']), \
                     patch.object(v.subprocess, 'run') as run:
                    if passes:
                        info, data = v.inspect_apk(apk)
                        self.assertEqual(info['sha256'], hashlib.sha256(data).hexdigest())
                        self.assertEqual(run.call_args.args[0][1], 'scripts/android-verify-installer-package.sh')
                    else:
                        with self.assertRaises(ValueError): v.inspect_apk(apk)

    def test_missing_provider_and_bundled_course_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            apk = Path(directory) / v.APK_NAME
            with zipfile.ZipFile(apk, 'w') as z: z.writestr('unrelated', '')
            with self.assertRaisesRegex(ValueError, 'FileProvider'): v.inspect_apk(apk)
            with zipfile.ZipFile(apk, 'w') as z:
                z.writestr('res/xml/erudior_update_paths.xml', '')
                z.writestr('assets/samples/math/course.json', '{}')
            with self.assertRaisesRegex(ValueError, 'coursework'): v.inspect_apk(apk)

    def test_real_manifest_writer_produces_parseable_json_and_checksum(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            apk, manifest, evidence = root/v.APK_NAME, root/'android-update.json', root/'evidence.json'
            apk.write_bytes(self.data)
            info = {**self.info, 'sha256': self.manifest['sha256'], 'bytes': len(self.data)}
            argv = ['verify', str(apk), '--version', '0.25.0', '--build', BUILD, '--manifest', str(manifest),
                    '--create-manifest', '--evidence', str(evidence)]
            with patch.object(sys, 'argv', argv), patch.object(v, 'inspect_apk', return_value=(info, self.data)), patch('builtins.print'):
                v.main()
            written = json.loads(manifest.read_text())
            v.verify_manifest(written, self.data, '0.25.0', BUILD)
            self.assertTrue(manifest.read_bytes().endswith(b'\n'))
            self.assertEqual((root/(v.APK_NAME+'.sha256')).read_text(), self.manifest['sha256']+'  '+v.APK_NAME+'\n')
            self.assertFalse(json.loads(evidence.read_text())['publicTransportVerified'])
            self.assertFalse(json.loads(evidence.read_text())['physicalPhoneVerified'])

    def test_publication_waits_for_acceptance_and_signed_build(self):
        workflow = (ROOT/'.github/workflows/android-preview-publish.yml').read_text()
        publish = workflow.split('  publish-preview:\n', 1)[1]
        self.assertIn('needs: [release-contract, upgrade-acceptance, signed-arm64]', publish)
        self.assertIn("github.ref == 'refs/heads/main'", publish)
        self.assertIn('inputs.publish_preview == true', publish)
        self.assertIn('fetch-depth: 0', publish)
        self.assertNotIn('continue-on-error', workflow)
        self.assertIn("paths: ['.github/android-preview-publish.json']", workflow)

    def test_test_fixture_has_no_release_signing_secrets(self):
        workflow = (ROOT/'.github/workflows/android-preview-publish.yml').read_text()
        acceptance = workflow.split('  upgrade-acceptance:\n', 1)[1].split('  signed-arm64:\n', 1)[0]
        self.assertIn('uses: ./.github/workflows/android-upgrade.yml', acceptance)
        self.assertNotIn('secrets:', acceptance)
        build = workflow.split('  signed-arm64:\n', 1)[1].split('  publish-preview:\n', 1)[0]
        self.assertNotIn('ERUDIOR_UPGRADE_E2E', build)
        self.assertNotIn('android-upgrade/build.sh', build)
        self.assertIn('Persistent signing key missing', build)
        self.assertNotIn('keytool -genkeypair', build)

    def test_manifest_is_published_last_after_byte_comparison(self):
        workflow = (ROOT/'.github/workflows/android-preview-publish.yml').read_text()
        first = workflow.index('gh release upload android-preview candidate/Erudior-Android-arm64.apk')
        verified = workflow.index('          fetch_exact Erudior-Android-arm64.apk\n')
        manifest = workflow.index('gh release upload android-preview candidate/android-update.json')
        self.assertLess(first, verified)
        self.assertLess(verified, manifest)
        self.assertIn('cmp "candidate/$name" "public/$name"', workflow)
        self.assertIn('--baseline-metadata baseline/release.json', workflow)
        source = (ROOT/'scripts/android-release-verify.py').read_text()
        self.assertIn('"merge-base", "--is-ancestor"', source)

    def test_reusable_acceptance_keeps_real_upgrade_assertions(self):
        acceptance = (ROOT/'.github/workflows/android-upgrade.yml').read_text()
        self.assertIn('  workflow_call:', acceptance)
        self.assertIn('${{ github.workflow }}-${{ github.ref }}', acceptance)
        self.assertIn('script: node scripts/android-upgrade/run.mjs', acceptance)
        self.assertNotIn('continue-on-error', acceptance)


if __name__ == '__main__':
    unittest.main()

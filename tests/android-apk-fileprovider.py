#!/usr/bin/env python3
"""Release verification must tolerate optimized XML names without weakening scope."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('android_apk_provider', ROOT / 'scripts/android-apk-fileprovider-check.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
MANIFEST = '''
E: manifest (line=1)
  E: uses-permission (line=2)
    A: android:name(0x01010003)="android.permission.REQUEST_INSTALL_PACKAGES" (Raw: "android.permission.REQUEST_INSTALL_PACKAGES")
  E: application (line=3)
    E: provider (line=4)
      A: android:name(0x01010003)="com.erudior.updates.ErudiorUpdateFileProvider"
      A: android:authorities(0x01010018)="com.erudior.app.erudior-updates"
      A: android:exported(0x01010010)=(type 0x12)0x0
      A: android:grantUriPermissions(0x0101001b)=(type 0x12)0xffffffff
      E: meta-data (line=5)
        A: android:name(0x01010003)="android.support.FILE_PROVIDER_PATHS"
        A: android:resource(0x01010025)=@0x7f160001
    E: provider (line=7)
      A: android:name(0x01010003)="androidx.core.content.FileProvider"
      A: android:authorities(0x01010018)="com.erudior.app.fileprovider"
'''
RESOURCES = '''spec resource 0x7f160001 com.erudior.app:xml/erudior_update_paths: flags=0x00000000
resource 0x7f160001 com.erudior.app:xml/erudior_update_paths: t=0x03 d=0x00000080 (s=0x08 r=0x00)
'''
SCOPED = '''E: paths (line=1)
  E: cache-path (line=2)
    A: name="verified-update" (Raw: "verified-update")
    A: path="updates/" (Raw: "updates/")
'''


class ProviderInspectionTests(unittest.TestCase):
    def verify(self, name='res/a', manifest=MANIFEST, resources=RESOURCES, xml=SCOPED,
               header=module.ANDROID_XML_HEADER):
        with tempfile.TemporaryDirectory() as folder:
            apk = Path(folder) / 'test.apk'
            with zipfile.ZipFile(apk, 'w') as archive:
                archive.writestr('res/something.png', b'\x89PNG!')
                archive.writestr(name, header + b'other bytes')
            def fake_check(command, **kwargs):
                assert command[1] == 'dump', command
                if command[2] == 'xmltree':
                    return manifest if command[4] == 'AndroidManifest.xml' else xml
                if command[2] == '--values' and command[3] == 'resources':
                    return resources + f'          (string8) "{name}"\n'
                if command[2] == 'resources':
                    return resources
                raise ValueError(command)
            with patch.object(module.subprocess, 'check_output', side_effect=fake_check):
                return module.inspect(apk, Path('/fake-sdk/aapt'))

    def test_named_path_is_still_accepted(self):
        self.assertEqual(self.verify('res/xml/erudior_update_paths.xml'), 'res/xml/erudior_update_paths.xml')

    def test_optimizer_renamed_path_is_accepted(self):
        self.assertEqual(self.verify('res/a'), 'res/a')
        self.assertEqual(self.verify('res/j7.xml'), 'res/j7.xml')

    def test_permission_or_authority_must_be_on_installed_provider(self):
        for needle in ['android.permission.REQUEST_INSTALL_PACKAGES', module.PROVIDER, module.AUTHORITY,
                       'android.support.FILE_PROVIDER_PATHS', '@0x7f160001']:
            with self.subTest(needle=needle), self.assertRaises(ValueError):
                self.verify(manifest=MANIFEST.replace(needle, 'MISSING'))

    def test_nonexported_uri_grants_and_xml_reference_are_required(self):
        for old, new in [('0x0', '0xffffffff'), ('0xffffffff', '0x0')]:
            with self.subTest(old=old), self.assertRaises(ValueError):
                self.verify(manifest=MANIFEST.replace(old, new))
        with self.assertRaises(ValueError):
            self.verify(resources=RESOURCES.replace('resource 0x7f160001', 'resource 0x7f160099'))
        with self.assertRaises(ValueError):
            self.verify(resources=RESOURCES.replace(':xml/', ':drawable/'))

    def test_xml_must_contain_only_scoped_update_cache(self):
        for changed in [SCOPED.replace('cache-path', 'external-path'),
                        SCOPED.replace('path="updates/"', 'path="/"'),
                        SCOPED.replace('verified-update', 'other'),
                        SCOPED+'E: external-path (line=3)\n', 'not a path XML']:
            with self.subTest(xml=changed), self.assertRaises(ValueError):
                self.verify(xml=changed)

    def test_nonbinary_resource_is_not_accepted(self):
        with self.assertRaises(ValueError):
            self.verify(header=b'junk')

    def test_release_verifier_delegates_to_compiled_manifest_and_xml_check(self):
        checker = (ROOT / 'scripts/android-verify-installer-package.sh').read_text()
        self.assertIn('android-apk-fileprovider-check.py', checker)
        self.assertNotIn("grep -Fx 'res/xml/erudior_update_paths.xml'", checker)
        verifier = (ROOT / 'scripts/android-release-verify.py').read_text()
        self.assertIn('scripts/android-verify-installer-package.sh', verifier)
        self.assertNotIn('"res/xml/erudior_update_paths.xml" in names', verifier)


if __name__ == '__main__':
    unittest.main()

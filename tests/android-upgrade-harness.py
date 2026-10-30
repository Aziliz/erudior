import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("upgrade_prepare", ROOT / "scripts/android-upgrade/prepare.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class UpgradeHarnessTests(unittest.TestCase):
    def fixture(self, root):
        plugin = 'package com.erudior.updates\nclass InstallerPlugin(private val activity: Activity) : Plugin(activity) {\n'
        plugin += '\n'.join('val url = URL("' + module.PREFIX + name + '")' for name in ['android-update.json','Erudior-Android-arm64.apk'])+'\n}\n'
        files = {
          'src-tauri/gen/android/app/src/main/java/com/erudior/updates/InstallerPlugin.kt': plugin,
          'src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt': plugin,
          'src-tauri/gen/android/app/src/main/AndroidManifest.xml': '<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application android:label="Erudior" /></manifest>',
          'src/main.tsx': 'import App from "./App";\n',
          'scripts/android-upgrade/fixture.ts': 'export {};\n',
          '.android-upgrade/ca.pem': 'TEST CERTIFICATE\n',
        }
        for name, text in files.items():
            p=root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
        return files

    def test_refuses_non_ci_execution_without_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);files=self.fixture(root)
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'false','ERUDIOR_UPGRADE_E2E':'1'}):
                with self.assertRaises(RuntimeError): module.prepare(root)
            for name,text in files.items():self.assertEqual((root/name).read_text(),text)

    def test_only_generated_plugin_gets_test_endpoint_and_debugging(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);files=self.fixture(root)
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1'}):module.prepare(root)
            production='src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt'
            self.assertEqual((root/production).read_text(),files[production])
            generated=(root/'src-tauri/gen/android/app/src/main/java/com/erudior/updates/InstallerPlugin.kt').read_text()
            self.assertEqual(generated.count(module.ORIGIN),2)
            self.assertIn('setWebContentsDebuggingEnabled(true)',generated)
            manifest=ET.parse(root/'src-tauri/gen/android/app/src/main/AndroidManifest.xml')
            self.assertEqual(manifest.getroot().find('application').get('{'+module.ANDROID+'}networkSecurityConfig'),'@xml/erudior_upgrade_test_network')
            network=ET.parse(root/'src-tauri/gen/android/app/src/main/res/xml/erudior_upgrade_test_network.xml')
            self.assertEqual(network.find('domain-config/domain').text,'127.0.0.1')
            self.assertEqual(network.find('domain-config/domain').get('includeSubdomains'),'false')
            self.assertEqual(network.find('domain-config').get('cleartextTrafficPermitted'),'false')
            for variant,version in [('a',250001),('b',250002)]:
                self.assertEqual(json.loads((root/f'src-tauri/ci-upgrade-{variant}.json').read_text())['bundle']['android']['versionCode'],version)
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1'}):
                with self.assertRaises(RuntimeError):module.prepare(root)

    def test_unknown_native_endpoint_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);self.fixture(root)
            plugin=root/'src-tauri/gen/android/app/src/main/java/com/erudior/updates/InstallerPlugin.kt'
            plugin.write_text(plugin.read_text().replace('android-update.json','unexpected.json'))
            before=plugin.read_text()
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1'}):
                with self.assertRaises(RuntimeError):module.prepare(root)
            self.assertEqual(plugin.read_text(),before)

    def test_mobile_bridge_commands_do_not_block_main_thread(self):
        source=(ROOT/'src-tauri/src/lib.rs').read_text()
        for name in ['android_fetch_manifest','android_download_verified_apk','launch_android_installer']:
            self.assertIn('#[tauri::command(async)]\nfn '+name+'(app:',source)

    def test_upgrade_runner_never_uses_adb_reinstall_or_clear(self):
        source=(ROOT/'scripts/android-upgrade/run.mjs').read_text()
        self.assertEqual(source.count("adb('install'"),1)
        self.assertNotIn("'install','-r'",source)
        self.assertNotIn("'pm','clear'",source)
        self.assertIn("name:'Verify and open installer'",source)
        self.assertIn("versionCode()===250002",source)
        self.assertIn('assert.deepEqual(after,before',source)

if __name__=='__main__':unittest.main()

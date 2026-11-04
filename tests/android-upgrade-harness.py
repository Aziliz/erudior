import importlib.util
import json
import os
import subprocess
from pathlib import Path
import tempfile
import textwrap
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("upgrade_prepare", ROOT / "scripts/android-upgrade/prepare.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class UpgradeHarnessTests(unittest.TestCase):
    def fixture(self, root):
        plugin = (ROOT/'src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt').read_text()
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
            self.assertEqual(generated.count('override fun load(webView: WebView)'),1)
            self.assertIn('lifecycleWebView = webView',generated)
            self.assertIn('ErudiorLifecycleE2E',generated)
            self.assertIn('evaluated paused=$paused backgroundMs=$backgroundMs result=$result',generated)
            self.assertNotIn('ErudiorLifecycleE2E',files[production])

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

    def test_unknown_lifecycle_evaluation_fails_without_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);self.fixture(root)
            plugin=root/'src-tauri/gen/android/app/src/main/java/com/erudior/updates/InstallerPlugin.kt'
            plugin.write_text(plugin.read_text().replace('window.dispatchEvent', 'window.unknownDispatch'))
            before=plugin.read_text()
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1'}):
                with self.assertRaises(RuntimeError):module.prepare(root)
            self.assertEqual(plugin.read_text(),before)

    def test_lifecycle_bridge_preserves_native_monotonic_duration(self):
        source=(ROOT/'src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt').read_text()
        lifecycle=source[source.index('    private var lifecycleWebView'):source.index('    @Command')]
        self.assertIn('override fun onPause(activity: AppCompatActivity)',lifecycle)
        self.assertIn('override fun onResume(activity: AppCompatActivity)',lifecycle)
        self.assertIn('if (backgroundAt == null) backgroundAt = SystemClock.elapsedRealtime()',lifecycle)
        self.assertIn('(SystemClock.elapsedRealtime() - it).coerceAtLeast(0L)',lifecycle)
        self.assertIn('notifyLifecycle(true, 0L)',lifecycle)
        self.assertIn('notifyLifecycle(false, elapsed)',lifecycle)
        self.assertIn("new CustomEvent('erudior-native-lifecycle'",lifecycle)
        self.assertIn('activity.runOnUiThread',lifecycle)
        self.assertIn('lifecycleWebView === webView',lifecycle)
        self.assertNotIn('currentTimeMillis',lifecycle)
        self.assertNotIn('unlock',lifecycle)
        self.assertNotIn('setWebContentsDebuggingEnabled',source)

    def test_lifecycle_diagnostics_preserve_real_acceptance(self):
        shared=(ROOT/'scripts/android-upgrade/shared-device.mjs').read_text()
        runner=(ROOT/'scripts/android-upgrade/run.mjs').read_text()
        self.assertIn("await heading('Shared device locked').waitFor({timeout:45000})", shared)
        self.assertIn('await sleep(32000)', shared)
        self.assertIn("adb('shell','input','keyevent','KEYCODE_HOME')", shared)
        self.assertIn("adb('shell','monkey','-p',pkg", shared)
        self.assertIn("'after-home'", shared)
        self.assertIn("'after-foreground'", shared)
        self.assertIn("'native-received'", shared)
        self.assertIn("'lifecycle-evidence.json'", runner)
        self.assertNotIn('dispatchEvent', shared)
        self.assertNotIn('Date.now =', shared)
        self.assertNotIn('localStorage', shared)

    def test_mobile_bridge_commands_do_not_block_main_thread(self):
        source=(ROOT/'src-tauri/src/lib.rs').read_text()
        for name in ['android_fetch_manifest','android_download_verified_apk','launch_android_installer']:
            self.assertIn('#[tauri::command(async)]\nfn '+name+'(app:',source)

    def test_display_preferences_use_real_controls(self):
        fixture=(ROOT/'scripts/android-upgrade/fixture.ts').read_text()
        runner=(ROOT/'scripts/android-upgrade/run.mjs').read_text()
        self.assertNotIn('localStorage.setItem',fixture)
        for label in ['Theme','Reading width','Text size']:
            self.assertIn("getByLabel('"+label+"'",runner)
        self.assertIn("KEYCODE_HOME",runner)

    def test_emulator_partition_is_bounded_without_skipping_acceptance(self):
        workflow=(ROOT/'.github/workflows/android-upgrade.yml').read_text()
        self.assertIn('disk-size: 2048M',workflow)
        self.assertIn('script: node scripts/android-upgrade/run.mjs',workflow)
        self.assertNotIn('continue-on-error',workflow)

    def cleanup_script(self):
        workflow=(ROOT/'.github/workflows/android-upgrade.yml').read_text()
        build=workflow.index('run: bash scripts/android-upgrade/build.sh')
        cleanup=workflow.index('      - name: Reclaim disposable build space after fixture verification')
        acceptance=workflow.index('      - name: Real in-app download, permission, cancel, approval and retained-state checks')
        self.assertLess(build,cleanup)
        self.assertLess(cleanup,acceptance)
        return textwrap.dedent(workflow[cleanup:acceptance].split('        run: |\n',1)[1])

    def cleanup_fixture(self, root):
        files={
          '.android-upgrade/a.apk': b'verified baseline APK',
          '.android-upgrade/b.apk': b'verified candidate APK',
          '.android-upgrade/ca.pem': b'ephemeral certificate',
          '.android-upgrade/tls-key.pem': b'ephemeral test key',
          '.android-upgrade/a.signing.txt': b'signing evidence',
          'src/main.tsx': b'production source',
          'src-tauri/android-installer/keep.kt': b'production installer',
          'node_modules/playwright/keep.js': b'acceptance dependency',
          'artifacts/android-upgrade/keep.json': b'acceptance evidence',
          'home/.gradle/gradle.properties': b'keep non-cache configuration',
          'home/.android/avd/keep.ini': b'keep emulator',
        }
        disposable=['src-tauri/target','src-tauri/gen/android/app/build',
          'src-tauri/gen/android/.gradle','home/.gradle/caches','home/.gradle/wrapper/dists']
        for directory in disposable: files[directory+'/generated.bin']=b'disposable build output'
        for name,content in files.items():
            p=root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(content)
        (root/'tmp').mkdir()
        env={**os.environ,'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1',
          'RUNNER_ENVIRONMENT':'github-hosted','HOME':str(root/'home'),'RUNNER_TEMP':str(root/'tmp')}
        return files,disposable,env

    def test_cleanup_preserves_fixtures_sources_evidence_and_runtime(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);files,disposable,env=self.cleanup_fixture(root)
            subprocess.run(['bash','-c',self.cleanup_script()],cwd=root,env=env,check=True,capture_output=True,text=True)
            for name,content in files.items():
                if any(name.startswith(directory+'/') for directory in disposable):
                    self.assertFalse((root/name).exists())
                else: self.assertEqual((root/name).read_bytes(),content)

    def test_cleanup_refuses_non_hosted_runner_or_missing_fixture_before_deleting(self):
        for invalid in ['non-ci','self-hosted','missing-apk','symlink-apk']:
            with self.subTest(invalid=invalid), tempfile.TemporaryDirectory() as tmp:
                root=Path(tmp);files,disposable,env=self.cleanup_fixture(root)
                if invalid=='non-ci':env['GITHUB_ACTIONS']='false'
                if invalid=='self-hosted':env['RUNNER_ENVIRONMENT']='self-hosted'
                if invalid in ['missing-apk','symlink-apk']:
                    (root/'.android-upgrade/b.apk').unlink()
                    if invalid=='symlink-apk':(root/'.android-upgrade/b.apk').symlink_to('a.apk')
                result=subprocess.run(['bash','-c',self.cleanup_script()],cwd=root,env=env,capture_output=True,text=True)
                self.assertNotEqual(result.returncode,0)
                for directory in disposable:
                    name=directory+'/generated.bin'
                    self.assertEqual((root/name).read_bytes(),files[name])

    def test_classroom_fixture_accepts_real_homeschool_encoding_only_for_exact_synthetic_family(self):
        fixture=(ROOT/'scripts/android-upgrade/fixture.ts').read_text()
        # Evaluate the actual fixture predicate, removing only its TypeScript signature.
        start=fixture.index('const isSyntheticSharedDeviceFamily = ')
        predicate=fixture[start:fixture.index(';',start)+1].replace(
            '(family: Family | null): family is Family =>', '(family) =>')
        script=predicate+"""
const students=[{name:'Synthetic Android Alice'},{name:'Synthetic Android Bob'}];
const cases=[
  [{students},true], [{mode:'homeschool',students},true],
  [{mode:'classroom',students},false], [{mode:'unexpected',students},false],
  [null,false], [{students:[]},false], [{students:[...students,{name:'Other'}]},false],
  [{students:[{name:'Private Alice'},students[1]]},false],
  [{students:[students[0],{name:'Synthetic Android Other'}]},false],
];
for(const [family,want] of cases) {
  if(isSyntheticSharedDeviceFamily(family)!==want)throw Error('Synthetic fixture guard mismatch');
}
"""
        subprocess.run(['node','--input-type=module','-e',script],check=True,capture_output=True,text=True)
        self.assertIn('if (!inApp) throw Error("Classroom acceptance requires native persistence")',fixture)
        self.assertIn('if (!isSyntheticSharedDeviceFamily(family))',fixture)
        acceptance=(ROOT/'scripts/android-upgrade/classroom-workflows.mjs').read_text()
        self.assertLess(acceptance.index("await auth('Parent password')"),acceptance.index('prepareSyntheticClassroom()'))

    def test_upgrade_runner_never_uses_adb_reinstall_or_clear(self):
        source=(ROOT/'scripts/android-upgrade/run.mjs').read_text()
        self.assertEqual(source.count("adb('install'"),1)
        self.assertNotIn("'install','-r'",source)
        self.assertNotIn("'pm','clear'",source)
        self.assertIn("name:'Verify and open installer'",source)
        self.assertIn("versionCode()===250002",source)
        self.assertIn('assert.deepEqual(after,before',source)

if __name__=='__main__':unittest.main()

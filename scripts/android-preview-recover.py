#!/usr/bin/env python3
"""One explicitly pinned, manifest-only recovery; never uploads/rebuilds an APK.

The 7717d984 publisher verified its predecessor, uploaded the candidate, then
read the previous cached APK. Resume only from digest-pinned, same-repository
CI evidence, after all original acceptance and exact-build regressions succeed.
Any different/current-newer public APK aborts. All network writes target only
the existing preview manifest and notes; this is not a general bypass flag.
"""
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import unittest
import zipfile

REPO = 'Aziliz/erudior'
BUILD = '7717d984d89fe0f6d23a2486cd80da1ba59da3a9'
PREVIOUS = '2f7bc0d0f10d57f1c76a380075760ee57cfd9374'
RUN = 41147378105
PREVIOUS_RUN = 41142559563
CANDIDATE = (13021890794, 'android-preview-signed-candidate', 'f4c7bb2f763d7808d3a52c2c5cbdbbbab67045c5973de9f75d4b51563e9d6cda', RUN, BUILD)
BASELINE = (13019347712, 'android-preview-public-verification', 'c4131e4cd8ca41b275911b82b2e0a62931edb50e8e97189a2c9e9f999daf8161', PREVIOUS_RUN, PREVIOUS)
APK = 'Erudior-Android-arm64.apk'
BASE = 'https://github.com/Aziliz/erudior/releases/download/android-preview/'
CERT = 'e5c1b964c1d9099f064a75d9ee776c831ecf71e38ddd1e9a10de919dc0dd2d60'
APK_SHA = 'db542604ba0fa6086f3070b62e02dbcc9797c6defad987e813c9c552ba0b42e3'
PREVIOUS_SHA = 'bfc395cc46cbbcb8fb1969ef3e6b89a741ae13cee3a9182352e688ee385a31f0'
VERSION = '0.25.0'
MAX = 41_943_040
REQUIRED = ('release-contract', 'signed-arm64', 'upgrade-acceptance / in-app-upgrade')


def require(ok, message):
    if not ok:
        raise ValueError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def api(endpoint):
    require(endpoint.startswith(f'repos/{REPO}/'), 'Unexpected API repository')
    return json.loads(subprocess.check_output(['gh', 'api', '--method', 'GET', endpoint], timeout=90))


def check_run(run, run_id, build, workflow, outcomes=('success',)):
    require(run.get('id') == run_id and run.get('head_sha') == build, 'Unexpected source run/build')
    require(run.get('head_branch') == 'main' and run.get('event') == 'push', 'Untrusted source event/branch')
    require(run.get('repository', {}).get('full_name') == REPO, 'Untrusted source repository')
    require(run.get('path') == workflow, 'Unexpected source workflow')
    require(run.get('status') == 'completed' and run.get('conclusion') in outcomes, 'Source validation incomplete or failed')


def check_jobs(jobs):
    for name in REQUIRED:
        matches = [j for j in jobs if j.get('name') == name]
        require(len(matches) == 1 and matches[0].get('status') == 'completed'
                and matches[0].get('conclusion') == 'success', f'Acceptance gate not successful: {name}')
    publications = [j for j in jobs if j.get('name') == 'publish-preview']
    require(len(publications) == 1 and publications[0].get('status') == 'completed'
            and publications[0].get('conclusion') in ('failure', 'success'), 'Publication is still active or ambiguous')


def check_asset(release, name, data):
    assets = [a for a in release.get('assets', []) if a.get('name') == name]
    require(len(assets) == 1, 'Missing/ambiguous current asset: ' + name)
    asset = assets[0]
    require(asset.get('state') == 'uploaded' and asset.get('size') == len(data)
            and asset.get('digest') == 'sha256:' + digest(data), 'Current asset mismatch: ' + name)
    require(asset.get('browser_download_url') == BASE + name, 'Unexpected download URL')


def manifest_state(release, old, new):
    for label, data in [('previous', old), ('candidate', new)]:
        try:
            check_asset(release, 'android-update.json', data)
            return label, data
        except ValueError:
            pass
    raise ValueError('Current manifest is neither the verified predecessor nor this candidate')


def extract_verified_archive(raw, sha, destination):
    require(digest(raw) == sha, 'CI artifact digest mismatch')
    require(len(raw) < 64 * 1024 * 1024, 'Oversized artifact archive')
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        for name in (APK, APK + '.sha256', 'android-update.json', 'verification.json'):
            matches = [i for i in archive.infolist() if i.filename == name]
            require(len(matches) == 1 and 0 < matches[0].file_size <= MAX, 'Missing/ambiguous/oversized evidence member')
            # Only fixed filenames are read, never extracted paths from the archive.
            (destination / name).write_bytes(archive.read(matches[0]))


def download_evidence(spec, destination):
    artifact_id, name, sha, run_id, build = spec
    meta = api(f'repos/{REPO}/actions/artifacts/{artifact_id}')
    require(meta.get('id') == artifact_id and meta.get('name') == name and meta.get('expired') is False, 'Artifact identity/expiry mismatch')
    require(meta.get('digest') == 'sha256:' + sha and 0 < meta.get('size_in_bytes', 0) < 64 * 1024 * 1024, 'Artifact metadata mismatch')
    require(meta.get('workflow_run', {}).get('id') == run_id and meta['workflow_run'].get('head_sha') == build, 'Artifact source mismatch')
    raw = subprocess.check_output(['gh', 'api', f'repos/{REPO}/actions/artifacts/{artifact_id}/zip'], timeout=180)
    destination.mkdir(parents=True, exist_ok=True)
    extract_verified_archive(raw, sha, destination)


def fetch_exact(name, expected, output):
    require(name in (APK, APK + '.sha256', 'android-update.json'), 'Unsupported public asset')
    for attempt in range(12):
        result = subprocess.run(['curl', '--silent', '--show-error', '--fail', '--location', '--max-time', '45',
                                 '--proto', '=https', '--proto-redir', '=https', BASE + name, '-o', str(output)], timeout=50)
        if result.returncode == 0 and output.read_bytes() == expected:
            return
        print(f'Public exact-byte verification pending for {name}, attempt {attempt + 1}', flush=True)
        time.sleep(10)
    raise ValueError('Public asset does not match verified bytes: ' + name)


def main():
    require(os.environ.get('GITHUB_REPOSITORY') == REPO and os.environ.get('GITHUB_REF') == 'refs/heads/main', 'Recovery only runs on trusted main')
    check_run(api(f'repos/{REPO}/actions/runs/{RUN}'), RUN, BUILD, '.github/workflows/android-preview-publish.yml', ('failure', 'success'))
    jobs = api(f'repos/{REPO}/actions/runs/{RUN}/jobs?filter=latest&per_page=100')
    require(jobs.get('total_count') == len(jobs['jobs']), 'Uninspected job pagination')
    check_jobs(jobs['jobs'])
    check_run(api(f'repos/{REPO}/actions/runs/{PREVIOUS_RUN}'), PREVIOUS_RUN, PREVIOUS, '.github/workflows/android-preview-publish.yml')
    for run_id, workflow in [(41147378113, '.github/workflows/identity.yml'), (41147378206, '.github/workflows/learning-games.yml')]:
        check_run(api(f'repos/{REPO}/actions/runs/{run_id}'), run_id, BUILD, workflow)
    subprocess.run(['git', 'merge-base', '--is-ancestor', PREVIOUS, BUILD], check=True)
    subprocess.run(['git', 'merge-base', '--is-ancestor', BUILD, 'HEAD'], check=True)
    subprocess.run(['git', 'diff', '--exit-code', BUILD, '--', 'scripts/android-release-verify.py',
                    'scripts/android-verify-installer-package.sh', 'scripts/android-apk-fileprovider-check.py'], check=True)
    root = Path('.release-recovery')
    candidate, baseline, public = root / 'candidate', root / 'baseline', root / 'public'
    public.mkdir(parents=True, exist_ok=True)
    download_evidence(CANDIDATE, candidate)
    download_evidence(BASELINE, baseline)
    spec = importlib.util.spec_from_file_location('release_verify', 'scripts/android-release-verify.py')
    verifier = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(verifier)
    info, data = verifier.inspect_apk(candidate / APK)
    old_info, old_data = verifier.inspect_apk(baseline / APK, candidate=False)
    require(info['sha256'] == APK_SHA and old_info['sha256'] == PREVIOUS_SHA, 'Pinned APK hash mismatch')
    require(info['signers'] == old_info['signers'] == [CERT], 'Pinned certificate mismatch')
    verifier.validate_upgrade(info, old_info)
    for folder, source, details, binary, historical in [(candidate, BUILD, info, data, False), (baseline, PREVIOUS, old_info, old_data, True)]:
        verifier.verify_manifest(json.loads((folder / 'android-update.json').read_bytes()), binary, VERSION, source)
        evidence = json.loads((folder / 'verification.json').read_bytes())
        require(evidence.get('ok') is True and evidence.get('build') == source and evidence.get('candidate') == details, 'CI evidence mismatch')
        require((folder / (APK + '.sha256')).read_text() == details['sha256'] + '  ' + APK + '\n', 'Checksum sidecar mismatch')
        if historical:
            require(evidence.get('publicTransportVerified') is True and evidence.get('acceptanceRun') == str(PREVIOUS_RUN), 'Historical baseline not publicly verified')
    old_manifest = (baseline / 'android-update.json').read_bytes()
    new_manifest = (candidate / 'android-update.json').read_bytes()
    checksum = (candidate / (APK + '.sha256')).read_bytes()
    release = api(f'repos/{REPO}/releases/tags/android-preview')
    check_asset(release, APK, data)
    check_asset(release, APK + '.sha256', checksum)
    state, current_manifest = manifest_state(release, old_manifest, new_manifest)
    fetch_exact(APK, data, public / APK)
    fetch_exact(APK + '.sha256', checksum, public / (APK + '.sha256'))
    fetch_exact('android-update.json', current_manifest, public / 'android-update.json')
    # Recheck current authority/state immediately before the sole content write.
    release = api(f'repos/{REPO}/releases/tags/android-preview')
    check_asset(release, APK, data)
    check_asset(release, APK + '.sha256', checksum)
    state, _ = manifest_state(release, old_manifest, new_manifest)
    if state == 'previous':
        subprocess.run(['gh', 'release', 'upload', 'android-preview', str(candidate / 'android-update.json'), '--clobber', '--repo', REPO], check=True, timeout=90)
    fetch_exact('android-update.json', new_manifest, public / 'android-update.json')
    fetch_exact(APK, data, public / APK)
    release = api(f'repos/{REPO}/releases/tags/android-preview')
    for name, value in [(APK, data), (APK + '.sha256', checksum), ('android-update.json', new_manifest)]:
        check_asset(release, name, value)
    verifier.inspect_apk(public / APK)
    result = {'ok': True, 'build': BUILD, 'candidate': info, 'previous': old_info, 'upgradeCompatible': True,
              'publicTransportVerified': True, 'physicalPhoneVerified': False, 'acceptanceRun': str(RUN),
              'recoveryRun': os.environ['GITHUB_RUN_ID'], 'recovery': 'manifest-only, unchanged signed APK; digest-pinned prior and candidate CI artifacts'}
    (public / 'verification.json').write_text(json.dumps(result, indent=2) + '\n')
    notes = ('Updated ARM64 Android preview with Courses, local Family/Classroom workflows and Community configuration.\n\n'
             f'Source commit: {BUILD}\n\nVersion: {VERSION}\nSHA-256: {APK_SHA}\n\n'
             f'Original build/signing and same-source emulator upgrade acceptance: run {RUN}. '
             'Exact-source full regression and browser/API checks passed. Public APK, checksum and manifest bytes '
             'were reverified after a cached-predecessor response interrupted publication. Recovery changed only '
             'the update manifest and notes, not the signed APK. Install over the existing preview; do not clear app data. '
             'Physical-phone and Play Protect acceptance remain unverified. Production online accounts and cloud sync remain disabled.\n')
    (public / 'release-notes.md').write_text(notes)
    subprocess.run(['gh', 'release', 'edit', 'android-preview', '--repo', REPO, '--title', 'Erudior Android preview 0.25.0 — build 7717d984', '--notes-file', str(public / 'release-notes.md')], check=True, timeout=90)
    print(json.dumps(result, indent=2))


class RecoveryBoundaries(unittest.TestCase):
    def run_fixture(self):
        return {'id': RUN, 'head_sha': BUILD, 'head_branch': 'main', 'event': 'push', 'repository': {'full_name': REPO},
                'path': '.github/workflows/android-preview-publish.yml', 'status': 'completed', 'conclusion': 'success'}

    def test_trusted_runs(self):
        valid = self.run_fixture()
        check_run(valid, RUN, BUILD, valid['path'])
        for key, value in [('head_sha', PREVIOUS), ('head_branch', 'fork'), ('event', 'pull_request'), ('id', 1),
                           ('repository', {'full_name': 'other/repo'}), ('path', 'unrelated.yml'), ('status', 'in_progress'), ('conclusion', 'failure')]:
            with self.subTest(key=key), self.assertRaises(ValueError):
                check_run({**valid, key: value}, RUN, BUILD, valid['path'])

    def test_all_original_gates_required(self):
        jobs = [{'name': name, 'status': 'completed', 'conclusion': 'success'} for name in REQUIRED]
        jobs.append({'name': 'publish-preview', 'status': 'completed', 'conclusion': 'failure'})
        check_jobs(jobs)
        for i in range(3):
            for change in ['failure', 'skipped', None]:
                broken = [dict(j) for j in jobs]
                broken[i]['conclusion'] = change
                with self.assertRaises(ValueError): check_jobs(broken)
        with self.assertRaises(ValueError): check_jobs(jobs + [jobs[0]])
        with self.assertRaises(ValueError): check_jobs(jobs[:-1])

    def test_exact_public_state(self):
        data = b'candidate'
        asset = {'name': APK, 'state': 'uploaded', 'size': len(data), 'digest': 'sha256:' + digest(data), 'browser_download_url': BASE + APK}
        check_asset({'assets': [asset]}, APK, data)
        for key, value in [('digest', 'sha256:' + '0' * 64), ('size', 1), ('state', 'new'), ('browser_download_url', 'https://evil.test')]:
            with self.assertRaises(ValueError): check_asset({'assets': [{**asset, key: value}]}, APK, data)
        with self.assertRaises(ValueError): check_asset({'assets': [asset, asset]}, APK, data)

    def test_manifest_resume_and_idempotence(self):
        for label, value in [('previous', b'old'), ('candidate', b'new')]:
            asset = {'name': 'android-update.json', 'state': 'uploaded', 'size': len(value), 'digest': 'sha256:' + digest(value), 'browser_download_url': BASE + 'android-update.json'}
            self.assertEqual(manifest_state({'assets': [asset]}, b'old', b'new'), (label, value))
        with self.assertRaises(ValueError): manifest_state({'assets': []}, b'old', b'new')

    def test_archive_hash_required(self):
        with self.assertRaises(ValueError): extract_verified_archive(b'not zip', '0' * 64, Path('.'))

    def test_no_apk_upload_or_rebuild(self):
        source = Path(__file__).read_text().split('class RecoveryBoundaries')[0]
        self.assertNotIn("'release', 'upload', 'android-preview', str(candidate / APK)", source)
        self.assertNotIn('--create-manifest', source)
        self.assertIn("str(candidate / 'android-update.json'), '--clobber'", source)
        self.assertIn("verifier.inspect_apk(public / APK)", source)


if __name__ == '__main__':
    if sys.argv[1:] == ['--self-test']:
        unittest.main(argv=[sys.argv[0]], verbosity=2)
    else:
        require(not sys.argv[1:], 'No generic recovery parameters are accepted')
        main()

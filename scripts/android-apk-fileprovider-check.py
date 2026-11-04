#!/usr/bin/env python3
"""Verify the *compiled* Android updater provider and its scoped XML paths.

Release resource optimization can rename res/xml/*.xml to opaque res/* names.
Always resolve the manifest's provider reference and inspect binary XML rather
than trusting a source path or an APK ZIP member filename.
"""
import os
from pathlib import Path
import re
import subprocess
import sys
import zipfile

PROVIDER = 'com.erudior.updates.ErudiorUpdateFileProvider'
AUTHORITY = 'com.erudior.app.erudior-updates'
ANDROID_XML_HEADER = b'\x03\x00\x08\x00'


def require(test, message):
    if not test:
        raise ValueError(message)


def matching_provider_blocks(manifest: str):
    lines = manifest.splitlines()
    for index, line in enumerate(lines):
        start = re.match(r'^(\s*)E:\s+provider(?:\s|$)', line)
        if not start:
            continue
        indent = len(start[1])
        end = next((j for j in range(index + 1, len(lines))
                    if (m := re.match(r'^(\s*)E:\s+', lines[j])) and len(m[1]) <= indent), len(lines))
        block = '\n'.join(lines[index:end])
        if PROVIDER in block:
            yield block


def inspect(apk: Path, aapt_path: Path) -> str:
    def dump(what, *args):
        return subprocess.check_output([str(aapt_path), 'dump', what, str(apk), *args],
                                       text=True, stderr=subprocess.DEVNULL)

    manifest = dump('xmltree', 'AndroidManifest.xml')
    require('android.permission.REQUEST_INSTALL_PACKAGES' in manifest, 'Installer permission absent from manifest')
    matches = list(matching_provider_blocks(manifest))
    require(len(matches) == 1, 'Expected one uniquely named Erudior update FileProvider')
    block = matches[0]
    require(AUTHORITY in block, 'Updater FileProvider authority missing')
    require(re.search(r'android:exported[^\n]*(?:0x0|false)(?:\b|$)', block, re.I),
            'Updater provider must not be exported')
    require(re.search(r'android:grantUriPermissions[^\n]*(?:0xffffffff|0x1|true)(?:\b|$)', block, re.I),
            'Updater provider must grant one-time URI access')
    require('android.support.FILE_PROVIDER_PATHS' in block, 'Updater FileProvider metadata missing')
    references = re.findall(r'android:resource[^\n]*?=@(0x[0-9a-fA-F]{8})', block)
    require(len(references) == 1, 'Updater path metadata must reference one XML resource ID')
    reference = references[0].lower()
    resources = dump('resources')
    rows = [line for line in resources.splitlines() if re.search(r'^\s*resource\s+' + re.escape(reference) + r'\b', line, re.I)]
    require(any(':xml/' in line for line in rows), 'Updater metadata does not resolve to an XML resource')

    # With --values, aapt exposes the actual packaged filename for the manifest's
    # resource ID, even if Android's optimizer renamed it to res/a or res/k7.xml.
    # Fall back to examining all compiled XML only if this lookup is unavailable.
    resolved = set()
    try:
        detail = subprocess.check_output([str(aapt_path), 'dump', '--values', 'resources', str(apk)],
                                         text=True, stderr=subprocess.DEVNULL)
        region = re.search(r'(?ms)^\s*resource\s+' + re.escape(reference) +
                           r'\b[^\n]*:xml/[^\n]*\n(?:(?!^\s*(?:spec )?resource\s+).)*', detail)
        if region:
            resolved.update(re.findall(r'\(string(?:8|16)\)\s+"(res/[^"\n]+)"', region[0]))
    except subprocess.CalledProcessError:
        pass

    matched = []
    with zipfile.ZipFile(apk) as archive:
        for name in archive.namelist():
            if resolved and name not in resolved:
                continue
            if not name.startswith('res/') or name.endswith('/'):
                continue
            with archive.open(name) as member:
                if member.read(4) != ANDROID_XML_HEADER:
                    continue
            try:
                xml = dump('xmltree', name)
            except subprocess.CalledProcessError:
                continue
            if not re.search(r'^\s*E:\s+paths\b', xml, re.M):
                continue
            if re.search(r'^\s*E:\s+(?:external-path|external-files-path|external-cache-path|root-path)\b', xml, re.M):
                continue
            if not re.search(r'^\s*E:\s+cache-path\b', xml, re.M):
                continue
            if not re.search(r'\bname[^\n]*="verified-update"', xml):
                continue
            if not re.search(r'\bpath[^\n]*="updates/"', xml):
                continue
            matched.append(name)
    require(len(matched) == 1,
            'Updater FileProvider private cache-path missing or ambiguous after resource optimization')
    return matched[0]


def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: android-apk-fileprovider-check.py <apk>')
    home = os.environ.get('ANDROID_HOME')
    require(bool(home), 'ANDROID_HOME not set')
    aapt_path = Path(home) / 'build-tools' / '35.0.0' / 'aapt'
    require(aapt_path.is_file(), f'aapt unavailable at {aapt_path}')
    name = inspect(Path(sys.argv[1]), aapt_path)
    print(f'Updater FileProvider XML verified in APK: {name}')


if __name__ == '__main__':
    main()

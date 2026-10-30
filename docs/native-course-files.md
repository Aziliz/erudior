# Native offline course file transport

Course transfer uses `pick_portable_course()` and
`export_portable_course({ content, name })`, not the generic text-file helpers.
Both accept UTF-8 files up to 24 MiB; empty files fail. Course/schema, asset and
trust validation remains in the shared frontend before saving an import. A
successful native write is not an endorsement or signature of the course.

- Desktop: the existing native dialog chooses the only readable/writable path;
  bounded reads do not rely on file metadata. Default names cannot supply paths.
- Android: `PortableFilesPlugin` owns the system document picker and accesses
  only its returned `content://` URI through `ContentResolver`. The webview never
  supplies a URI. There are no new storage permissions or persistent URI grants.
- Cancel returns `null` on import or `false` on export. Errors reject; retries
  release the single-operation guard. A provider failing mid-write can leave an
  incomplete document; the error tells the user to remove it and retry. The app
  does not silently delete user-selected provider documents.
- This transfer does not change app storage, learner records, updater signing,
  community authorization, or the installer's private FileProvider.

## Validation

`python3 tests/portable-native-contract.py -v` checks wiring/security invariants,
not runtime behavior. Rust unit tests cover UTF-8 byte limits and safe names.
The existing Android upgrade acceptance workflow additionally executes
`scripts/android-upgrade/portable-files.mjs` on a disposable API 35 emulator:
real native picker cancellation, repeated export/import through Downloads,
the real portable-course model, fresh imported course IDs with preserved lesson
IDs/body, UTF-8 and inline asset byte preservation, actual Android WebView image
decoding, and rejection of oversized, empty or
invalid UTF-8 input. It uses synthetic transport fixtures, not real user data.
The complete application import/export controls and learner rendering are tested
separately in the browser suite; the native harness invokes the real model and
transport through a CI-only fixture bridge, not those React controls.

An emulator result is not physical-device or third-party document-provider proof.
Desktop interactive dialogs and non-Android mobile systems also require their
own platform acceptance; do not claim they were tested based on static guards.

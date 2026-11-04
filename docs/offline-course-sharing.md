# Private offline course sharing

Private local authoring, exporting and importing require no account or age gate.
Community publishing remains a separate authenticated, adult-only workflow.

## Author / recipient workflow

1. Open a course and choose **Share offline**. Read the report and redistribution notice.
2. For each linked image/audio asset, explicitly select its local file. The app
   never downloads authored URLs or sends account credentials to media hosts.
3. Choose **Save offline package**. Share the `.erudior.json` file using a method
   you choose (USB, local file transfer, or another application).
4. In Library choose **Import**, select the file, review the untrusted-content
   warning and choose **Import as local copy**. Cancel writes nothing.
5. Each import gets a fresh course namespace. Internal lesson/question/module
   IDs and authored attribution remain; existing courses and learner history
   are not overwritten. Imports enter the existing shared device course library,
   not a private per-learner store, and do not automatically enroll a learner.
   Review content before assigning it to a learner.

The existing **Export source JSON** option remains useful for editing; unlike the
new package it does not bundle linked media. A course file is not an app backup.

## Boundaries

- Versioned JSON, not ZIP: no extraction paths, archive nesting or decompression.
  Raw file, transformed content and envelope are bounded to 24 MiB. Images are
  limited to 2 MiB, audio clips to 400,000 bytes; existing stricter field limits
  still apply and produce explicit validation errors.
- Only canonical authored fields are accepted. Learner progress, submissions,
  recordings/evidence, account credentials, community approval and runtime
  authority are not exported. Authored audio clips are course content, not
  learner evidence. Course licensing/attribution is preserved.
- SHA-256 detects accidental corruption. It is **not** an author signature,
  publisher verification, community review, accreditation or approval. A sender
  can recompute it. Reconstructed copies never inherit official signed identity.
- Embedded data uses allowlisted MIME, canonical base64, static SVG validation
  and container-header checks. Header checking is not full codec validation;
  corrupt/unsupported codecs can still fail to play on a device.
- Unresolved local/HTTPS assets require explicit selected replacements. Unsafe
  paths, schemes, credentialed URLs and URL query/fragment values are rejected.
  No arbitrary remote fetch, ambient authorization or telemetry upload occurs.
- External reading/navigation links and prerequisite courses are not bundled.
  Python exercises may need the engine's initial runtime download; speech needs
  installed device voices. A portable content file does not promise all runtime
  dependencies or a complete curriculum are installed offline.
- Incomplete private authoring drafts may be transported: strict field, asset,
  reference and security validation remains, but sharing is not a publication
  readiness or pedagogical-quality review.
- Browser storage follows existing temporary guest / optional device retention
  behavior. Download the package for durable backup of authored content.

## Native transport and validation

See [native course files](native-course-files.md) for scoped Android SAF and
native desktop picker behavior, cancellation and partial-provider-write limits.
Synthetic core/UI tests cover corruption, authority injection, asset validation,
repeat/cancel/failure and separate imports. Browser acceptance exercises actual
course controls, import, offline embedded image rendering and reload. Android
acceptance separately exercises real system picker byte transport and failure.
Physical-device and third-party document-provider behavior require their own
acceptance; emulator/static tests do not establish those results.

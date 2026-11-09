# Encrypted Family recovery acceptance

## Browser gate

Run `npm run test:family-recovery-browser` (equivalently `node scripts/family-recovery-browser.mjs`) after `npm ci`, `npm run build`, and `npx playwright install --with-deps chromium`. A supported system Chromium can instead be selected with `CHROMIUM_PATH`. This does not waive any environment security restriction. The script exits nonzero if Chromium, the app, or an assertion fails. There is no skip-to-success fallback.

The suite serves the **actual App and production FamilyBackupRecovery component** through a local Vite server with `VITE_HOMESCHOOL=1`. It is not a mock React view and does not replace the production verification/restoration service. This suite exercises Vite-served source; the separate build step verifies the production build compiles. It does not claim emitted-bundle or native WebView coverage.

Every context starts with an isolated browser profile. `scripts/fixtures/family-recovery-fixture.mjs` creates only two clearly named synthetic learners, one local course, progress, parent planning, records, and attachment references. The present attachment has known synthetic bytes; another reference deliberately lacks bytes. The actual Settings export creates the downloaded PBKDF2/AES-GCM file. An independent Node WebCrypto reader validates those exported bytes. Corruption changes an actual ciphertext byte, not a mock decryption outcome. The app performs all successful verification and restoration with its production crypto, storage and authority checks.

External requests are blocked, and any attempted external request fails the suite. No accounts, production Family records, payments, third-party services, or external uploads are involved.

## Required assertions

- The actual supervising-adult gate is enabled. Entering Settings and starting a verification use real password authentication, never a disabled or injected session grant.
- The app authenticates before displaying file/passphrase inputs. The file is selected before entering a passphrase. Verification clears the passphrase, exposes readable inventory, learner/course names, replacement effects and the missing-attachment warning.
- All persisted IndexedDB keys, localStorage and sessionStorage values are compared before and after verification. Instrumentation also observes attempted writes. Verification, **Finish verification without restoring**, canceled review and canceled verification must make zero writes.
- Wrong passphrase and real ciphertext corruption show errors before any restoration or write.
- Current records changed after verification invalidate the prepared restore instead of silently overwriting the newer data.
- Restoration requires **Review restore**, an explicit replacement acknowledgement, and **Restore this verified backup**. Repeated final clicks must produce one real restore. After actual page reload and a new adult gate, the original records, course, progress and attachment bytes must be recovered.
- While an actual WebCrypto decrypt result is held, repeated Verify submissions start only one operation. Cancel, device lock, hidden document, requested learner switch, native lifecycle callback, pagehide and navigation away invalidate the pending review. Releasing the real result must not redisplay a private inventory, gain restore authority or write data.
- A newer real encrypted file may be verified after canceling the old pending operation. Releasing the older result must neither replace nor clear the newer review.
- A one-shot real IndexedDB `put` failure is injected after earlier restore writes. The suite independently confirms that the course really changed but the failing records write did not. The UI must say the restore may be partial, clear its one-use review, offer **Reload saved Family**, and never claim success or retry automatically. Recovery requires an explicit new verification and restore.
- 1280px and 320px viewports each run in light and dark color schemes. Restore and finish actions are exercised through keyboard focus/Enter. Whole-document WCAG A/AA axe checks and horizontal-overflow assertions accompany screenshots of verification, completion, final review, errors and recovered state. These checks complement, rather than replace, manual keyboard and screenshot inspection.

The low-level probes observe writes, hold completion of a **real** decryption, or inject a storage failure. They do not substitute successful verification/restoration, bypass authentication, or weaken production guards. The lifecycle tests dispatch the real DOM/native-bridge event handler; they do not claim physical-device HOME/background coverage.

## Artifacts and result interpretation

The default output is `test-results/family-recovery-browser/`; `BROWSER_ARTIFACTS` can override it. A completed pass creates `result.json` with checks and screenshot filenames. Failure creates `failure.json`, and a failure screenshot only if a browser page existed. Synthetic encrypted fixture files are retained with the run so their exact bytes can be investigated. They contain synthetic-only secrets and should still be treated as test artifacts, not a recommended credential-sharing pattern.

The dedicated `Family backup recovery acceptance` CI workflow must upload this directory even on failure. A green workflow does not replace reading `result.json`, checking that every expected case ran, and inspecting the generated screenshots. Existing `scripts/shared-device-browser.mjs` also uses the new staged UI for its actual restore and deleted-learner tombstone rejection cases; those older shared-device authorization assertions remain in place.

## Local execution status, 2026-11-09

- JavaScript syntax checks passed for the new browser script, fixture helper and migrated shared-device script.
- An independent fixture check passed using production `encryptText`, independent authenticated decryption, wrong-passphrase rejection, real ciphertext corruption, and production `decryptText` corruption rejection.
- The exact synthetic browser seed also passed production collect/encrypt/preflight against an isolated in-memory native-command boundary: two learners, one included attachment, one missing attachment, and zero verification writes. This is a fixture smoke test, not browser or native-device acceptance.
- Browser execution and screenshots **have not run in this executor**. The ordinary Playwright browser path was absent. A normal launch of the installed `/usr/bin/chromium` aborted before a page existed with `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`.
- No sandbox/security bypass, repeated denied launch, fabricated screenshot, or browser-pass assertion was used. The real-App suite remains a required CI gate, and visual/keyboard review remains pending until those artifacts exist.

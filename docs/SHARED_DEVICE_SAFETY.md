# Local shared-device sessions — implementation in progress

Scope: the existing **Parent dashboard PIN protection and child account switching** roadmap capability. This is a local interface boundary, not encryption at rest, verified guardianship, online authentication, or protection from an operating-system administrator/devtools. Public account-free learning is unchanged.

## Acceptance contract

- Existing adult password/PIN/recovery authorizes a specific learner; siblings cannot open one another's records by selecting a card. Startup/reload never silently selects even the sole learner. No new unknown child secret or irreversible migration is introduced.
- Grants live only in memory, bind current identity/credential and generation, and are never restored from backup or route history. Late callbacks cannot borrow a later unlock or another learner's authority. Removed learners and changed credentials fail closed.
- Explicit lock, bounded idle timeout, and background handling conceal/inert the mounted workspace without discarding drafts. Resume requires fresh adult authorization. Cancel/back/forward do not reveal or discard protected work.
- Sensitive settings, credential change, learner deletion, full export and restore require fresh adult authorization. Existing recovery remains available; recovery does not imply server identity.
- Homeschool and classroom roles, progress isolation, course-review receipts/revocation, CAS/tombstone safety, offline authoring/export, and academic evidence semantics are preserved.
- Synthetic real-App browser coverage includes startup/reload, sibling selection, wrong PIN/recovery/cancel, history, late callbacks, idle/background, drafts, backup restore, deletion, and desktop/mobile/light/dark accessibility. Native lifecycle behavior is separately verified where supported.

Implementation and verification are unfinished. Do not mark Done or publish an installer based on this checkpoint.

## Current implementation and recovery behavior

The adult uses the existing password, optional PIN, or recovery code to authorize one learner. Each successful selection or unlock creates a new memory-only generation. A route, a backup and a previously mounted callback cannot grant access. The same learner must be authorized after reload. No new child credential is required. Wrong password/PIN attempts retain the existing persisted cooldown; recovery rotates its code and removes the PIN.

Lock device conceals and makes the existing app subtree inert, retaining unsaved work until the adult resumes it. The app locks after ten minutes without input. Losing visibility or window focus immediately conceals the screen; background periods of thirty seconds or longer revoke the grant. Android Activity pause/resume also reports monotonic background duration, so a suspended WebView cannot rely on missed DOM events or paused timers to remain unlocked. Short native file-picker interruptions can return to the same session. Sensitive settings, credential changes, full encrypted backup/restore and learner removal require a new adult check. Canceling that check keeps the workspace locked and retains the pending form.

Credential material is bound to the local session. Changes from another app view are checked before state writes and at periodic/focus checks. A command already admitted to the operating system, including a native save dialog or an atomic storage write, may complete after locking; locking cannot retract an already-admitted command. Operating-system administrators, modified client code and developer tools are outside this interface boundary.

Full backup restoration spans multiple files, not a single database transaction. Every stage checks its originating authorization, credentials are installed last, and imported approvals/session grants do not become authority. If interrupted, the UI reports that some files may already have changed and asks for an explicit authenticated retry. Learner-deletion tombstones continue to reject resurrection from old backups. Device disk encryption, separate OS accounts and secure handling of exported backups remain separate protections.

## Validation still required

The real-App browser and isolated Android emulator suites are required before this capability is marked Done. The Android harness uses the actual App/WebView and native storage on a disposable emulator, after the existing updater-retention assertions, without changing production updater endpoints, trust or signing. Simulated browser visibility events alone are not evidence of native lifecycle behavior. No physical-device result or new installer release is implied.

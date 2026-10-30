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

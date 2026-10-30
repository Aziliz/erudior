# Android UI parity and child-owned devices

Status: proposed account/device architecture; NOT implemented or enabled by this UI change.

## Scope of this change

Android-only presentation changes restore display settings, student switching and family setup hidden by the first phone shell. Forms stack, parent/teacher sections scroll locally, typography and touch targets improve, and the bottom bar is hidden on wide screens to avoid duplicate navigation. Existing parent gates, storage, course signatures and native release protections are unchanged. Browser fixtures do not prove native feature parity or child authorization. Do not describe the entire app redesign as complete.

## Product rule

Same capabilities, role-appropriate access, device-appropriate layout. A parent's phone must support the same homeschool administration as the desktop app: family setup, learners, assignments, attendance review, grading, reports, transcripts, documents, games, presentations, export/backup and recovery. A child's phone runs the same learning engine but receives only that learner's authorized data and operations. Hiding a tab is never the authorization boundary.

The public website stays free to browse without an account. Account and managed-device setup belong in the app. Supervised plans may restrict assigned learning without pretending that Erudior controls what a child can access elsewhere on the public web. Learners may create and export/share course files offline; public community publishing stays 18+. Parents can review public community content and add it to learning plans. Under-13 profiles do not independently register or access professional courses.

## Interface direction

Use role-aware, three-to-five primary destinations, contextual search, a consistent SVG icon family, clear screen titles, readable light/dark themes and >=48 CSS-pixel touch targets for the WebView (verify physical touch sizing on actual Android devices). Parent administration should be grouped into Overview, Learning, Records and Family/settings with all existing sections still reachable. Small screens use drill-down lists/cards; wide screens can retain tables and split views. Reports, exports, reading controls, accessibility and backup must not disappear on phones. Native Back, keyboard insets, landscape/foldables and TalkBack require device testing. Show Offline, Waiting to sync, Synced and Failed honestly; never imply cloud sync is live merely because a network connection exists.

## Parent-approved learner device enrollment

Recommended flow: child opens "Student device" and displays a short-lived one-use code/QR. Parent signs in on a trusted adult device, chooses an existing learner, scans/enters that code and approves the named device. Server binds the new session to household + learner + device and issues learner-scoped credentials only. No parent password, adult token, recovery secret, family PIN hash or siblings' records go to the child phone. Pairing codes are short-lived, rate-limited, single-use and cannot grant access without authenticated parent approval. A local learner PIN/biometric may unlock an already paired device; it is not internet authentication. Parent can list and revoke devices and approve recovery. Adult operations on any device require a separate adult session/reauthentication; a parent passkey or biometric on the parent's device is not equivalent to the child's phone unlock.

Model separate GuardianAccount, HouseholdMembership, LearnerProfile, ConsentRecord, DeviceRegistration and scoped sessions. Keep one stable learner ID when changing devices or adding credentials. Turning 13 must not create a second learner or automatically remove parent supervision. At 18, offer an explicit transition/export with clear ownership and consent policy. Never infer adult authority from the chosen UI mode.

## Sync and storage

Current family.ts is device-local. worker/src/learnerProgress.ts is an optional encrypted-progress foundation that fails closed without separately approved trust/storage configuration; it is not complete family sync or a production identity service. Do not silently enable it or reuse community-author credentials for children.

For managed multi-device families, use the server as the authoritative record after validation, with encrypted local cache and durable offline submission queues. Preserve current local-only use and export. Download courses on demand; do not bundle coursework in APKs. Course/assignment versions must stay attached to submissions. Parent-approved assignments, grades and attendance decisions win over learner claims; offline attempts remain append-only evidence until accepted. Use idempotency IDs and optimistic revisions to prevent duplicates or silent overwrites. Do not sum overlapping study sessions on two devices. Revoked devices lose online access immediately at the server; a disconnected device cannot be remotely wiped instantly. Define bounded offline access and clearly disclose that cached files may remain until the next connection or local deletion. Revocation must not erase authoritative family history.

Avoid inventing home-grown encryption or reusing household secrets as child tokens. Store device keys in Android Keystore and wrap sensitive local credentials/data appropriately; do not put long-lived tokens in WebView localStorage. Establish recovery, encryption-key lifecycle, retention, deletion and data-export policies before enabling child sync.

## Privacy/release gates

For covered under-13 data collection, a parent's account or a PIN alone is not verifiable parental consent. Provide direct notice, an appropriate consent method, minimal collection, parental review/deletion, a security program and retention controls; obtain legal review before launch. No public child profiles, advertising tracking or unrelated location/contact collection. Device approval and legal consent are separate records. Local-only practice and public learning remain available without forcing account creation.

The reported Play Protect harmful-app warning remains a release issue to investigate using the exact APK hash, certificate and permissions. Do not instruct families to disable Play Protect or treat the warning as harmless because the app installs. Review and use Google's appeal process when warranted.

## Acceptance gates

- Test all homeschool workflows on an adult phone, not just the navigation shell.
- Ensure a child session cannot read siblings, change grades, create adult memberships or call administrative APIs directly.
- Expired/replayed codes, brute-force attempts, cross-household swaps, revoked devices and recovery are rejected safely.
- Test two devices offline concurrently, reconnect/replay, lost devices, sign-out and re-enrollment without losing or duplicating evidence.
- Verify exports, print/PDF sharing, file import, keyboard, text scaling, TalkBack, landscape and safe areas on actual phones.
- Preserve the native updater's signing, checksum and data-retention checks before a new APK is published.

References:
- https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns
- https://support.google.com/accessibility/android/answer/7101858
- https://developer.android.com/topic/architecture/data-layer/offline-first
- https://developer.android.com/privacy-and-security/keystore
- https://www.rfc-editor.org/info/rfc8628/
- https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- https://developers.google.com/android/play-protect/warning-dev-guidance

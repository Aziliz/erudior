# Erudior accounts, access, and data lifecycle

Design date: 2026-10-30. Status: proposed architecture and implementation contract. The navigation changes accompanying this document do not create production learner accounts, school identity, or cloud synchronization.

## Decisions and scope

The intended system has one account for a person, one stable academic identity for a learner, and separately authorized family and school relationships. Closing a parent's login must not cascade through every linked child or school record. A person can be a guardian at home and a teacher at school without combining those permissions.

Use these defaults for implementation planning:

| Decision | Proposed default |
| --- | --- |
| Public learning | Keep public discovery and independent local learning available without an account. |
| Public website | Keep `erudior.com` as the public site. Its sign-in entry, if added, opens the application account flow. Administrative publishing remains separate. |
| Account clients | The web application and native applications use the same private identity and learning services. |
| Authentication | Use a managed OpenID Connect identity provider with appropriate regional hosting, recovery, passkey/MFA, native application and school SSO support. Select the provider after contractual and technical review. |
| Private service | Deploy a separate account/learning API with its own credentials and bindings on the existing Workers platform. Public community routes do not receive private learner database credentials. |
| Private records | Create a managed PostgreSQL database in an explicitly selected US region, with application authorization and database row-level security. This is new storage; existing community D1 data stays in its current service. |
| Private files | Use a separate private R2 bucket with the `us` jurisdiction for a US rollout, plus authorization on every file operation. Public course storage stays separate. |
| School structure | Organizations own institutional workspaces; named teachers receive class assignments. Do not use a shared school or teacher login. |
| Learner continuity | Add credentials and change permissions on the same learner identity at age transitions; never use an email address or parent's account ID as the learner's identity. |
| Parent closure | Close the adult login, revoke relationships, transfer household stewardship, and erase applicable data as distinct operations. |
| Initial jurisdiction | Plan a US-first account rollout. This is a planning assumption, not authorization to collect data globally or a claim that one policy fits every state. |

The vendor, specific US region, launch states/countries, institutional contract, and privacy policy remain deployment decisions. No real child information should be uploaded until the relevant consent, access, retention, deletion, recovery, and operational controls are implemented and verified together.

## Current implementation and its boundaries

At baseline `a0939ac`, `FamilySetup` creates a local workspace. `Family.mode` is `homeschool` or `classroom`; it is not a verified online account role. The workspace has one adult password/PIN/recovery gate and local student profiles. The local learner picker does not authenticate a remote learner.

Native named state and documents are ordinary JSON in the operating system's application data directory. Browser saved-device state is IndexedDB; temporary guest state is memory-only. The adult gate does not encrypt those ordinary records. Encrypted family exports are a separate AES-GCM backup mechanism. See `src/lib/family.ts`, `src/lib/storage.ts`, `src/lib/webstore.ts`, `src/lib/backup.ts`, and `src-tauri/src/lib.rs`.

The existing community Worker authenticates publishing users, with author/reviewer/administrator permissions. Those permissions do not establish guardianship, school employment, class teaching authority, or student enrollment. See `worker/migrations/0001_init.sql` and the community authentication handlers in `worker/src/index.ts`.

The optional learner privacy engine supports deliberately minimized encrypted checkpoints. Its production identity adapter is not configured by the application, and its grant vocabulary currently covers `adult-self` and `verified-guardian`, not institutional authority or a full learner account. It does not synchronize the complete family/classroom workspace. Preserve that deliberately narrow feature and its cryptographic bindings; do not silently reinterpret it as the new account service. See [Learner data privacy](LEARNER_DATA_PRIVACY.md).

Classroom files currently carry a roster and a shared HMAC secret. Selecting a name from that file is not remote identity verification. Its receipts and exact evidence preservation are useful, but school account linking must use a different authenticated protocol. See [Classroom submission workflow](CLASSROOM_SUBMISSION_WORKFLOW.md).

Current full local learner removal cleans the profile's records, evidence and classroom references and retains deletion markers against stale imports; the interface prevents removing the last student. There is no online parent-account closure or age-based child-deletion cascade. Local removal does not erase previously exported files, other devices or separately retained copies.

Existing public privacy/setup copy says student records stay local. Update that copy before enabling cloud account storage, and preserve a truthful local-only option. Existing local records must not be silently uploaded when someone signs in.

## Navigation and workspaces

The main **Courses** destination summarizes enrolled courses and pathways. Detailed **Progress** remains inside each course. **Library** continues to mean course discovery and installation. Existing `/progress` links remain compatible.

| Active context | Management destination | Intended content |
| --- | --- | --- |
| Solo learner | None | Courses, pathways, own progress, account/device settings. |
| Guardian/family adult | Family | Child profiles, course assignment including community courses, homeschool records, guardian relationships, and authorized school updates. |
| Teacher | Classroom | Assigned classes, rosters, assignments, submissions, gradebooks, and permitted family invitations. |
| School administrator | Classroom, with an authorized school-management area | Staff memberships, class assignment, roster policy, school settings, records administration and audit access. |
| Restricted child/student session | Learner controls only | Own courses, assignments and permitted feedback; no guardian or teacher administration. |
| Adult with several roles | Destination follows the active workspace | An explicit Personal / Family / School workspace switch; each context is independently authorized. |

The immediate UI change derives Family/Classroom from the existing local mode and keeps the existing adult gate. The production implementation must derive available workspaces from current server permissions. Hiding a destination is a presentation choice; the service must independently authorize every operation.

A solo learner can create a family workspace later. Hiding a tab, changing the default workspace, disconnecting from a school, and deleting a workspace are distinct settings with distinct consequences.

## Identity and relationships

Use explicit entities with bounded purposes:

| Entity | Responsibility and required properties |
| --- | --- |
| Account/principal | Stable internal identifier for a person; status, verified contact methods and recovery configuration. Email is mutable contact data. |
| External identity | Unique issuer + subject association with an account. Linking another provider requires authenticated proof; never merge accounts merely because emails match. |
| Learner | Stable academic identity, lifecycle status, necessary age information and optional independent account association. A young child can exist before having independent login credentials. |
| Family workspace | Household planning and family-controlled records, with named adult memberships and a stewardship policy. |
| Guardian relationship | Account-to-learner link with verified authority, permitted purposes/scopes, effective dates, restrictions and revocation history. |
| School organization | Institution boundary, verified administrators, agreement, region and record-retention policies. |
| Organization membership | A named person's current role within a particular school. A role in one school grants no access to another. |
| Class/teaching assignment | Which staff members can act on which classes, for which term and operations. |
| Enrollment | Learner membership in a school/class/course and its effective dates. Keep school-scoped identifiers separate from the private global learner mapping. |
| Consent/authority receipt | Versioned purpose, responsible party, verification method, notice version, authorization dates, withdrawal and expiry. A checkbox is not proof of guardianship. |
| Device session | Account or restricted learner principal, device, active context, privileges, expiry, revocation and permission version. |
| Learning record | Learner, record category, source/revision, personal/family/school domain, authoritative owner or custodian, provenance and retention class. |
| Deletion job | Verified requester, precise scope, basis, deadlines, permitted exceptions, per-store progress and a minimal completion receipt. |

Do not expose a global student lookup across schools. School A should receive only its scoped student identifier and authorized records. A learner's family activities, previous school, other enrollments, and personal study are not discoverable merely because a teacher knows a name or birth date.

The same learner ID should survive a new guardian, email change, school transfer, and age transition while the account and records legitimately exist. This continuity is not a promise to retain identifying data forever after an authorized erasure.

## Signup and account recovery

### Independent adult and family signup

Start in the application with a neutral choice: study independently, manage a family, or join/create an institutional workspace. Route age-appropriate signup before collecting unnecessary child information. Verify the adult's contact method, establish authentication and recovery, show the relevant notices, and create the requested workspace.

Family setup then provisions each learner with only the information required for the selected service. Prefer a display name; collect a legal name, full birth date, address, or other sensitive field only where a specific feature requires it. Restrict age/identity evidence to the authorization service and relevant records staff. If a verification provider is used, retain a verification result/reference rather than raw identity documents whenever possible.

Obtain and record the necessary parental consent or other applicable authority before covered collection begins. A verified email, adult checkbox, credit card on an unrelated transaction, local parent PIN, or self-selected role must not be treated as interchangeable proof of guardianship.

Keep marketing choices separate from service consent. Proposed product policy: no advertising profiles, sale of children's data, or model training on identifiable child records; operational uses must match the stated educational purpose.

### Child access and age transitions

| Stage | Product behavior |
| --- | --- |
| Under 13 in the US consumer family service | A verified guardian provisions the learner. No independent child signup. A child's device gets a restricted learner session, never the guardian's unrestricted session. |
| School-provisioned learner | Use verified institutional enrollment and the documented school authorization route for its educational purpose. This does not silently authorize unrelated consumer/family services. |
| Age 13 transition | Offer appropriate independent credentials and recovery on the existing learner identity. Preserve records, memberships and provenance. Login capability and permission to share data change through separate policies. |
| Age 18 transition | Transfer account control and review ongoing guardian access. Let the learner choose appropriate continuing sharing, subject to applicable rights and institutional rules. |
| Earlier FERPA eligibility | Handle rights in the relevant institution separately when a student attends a postsecondary institution before 18. |

These are product defaults built around the user's intended US age transitions. COPPA addresses covered collection from children under 13; FERPA rights transfer at 18 or attendance at a postsecondary institution at any age. EU consent-based services have different thresholds, ranging from 13 to 16 by Member State. Do not encode a universal `age >= 13 means independent consent for everything` rule. [FTC](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data), [Department of Education](https://studentprivacy.ed.gov/faq/who-eligible-student), [European Commission](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en).

### Teacher and school signup

A teacher may create a personal account, but selecting Teacher does not grant student-record access. Join an existing verified school through an invitation or school-controlled identity connection, then receive explicit school and class assignments. A school email domain is useful evidence, not sufficient authorization by itself.

Verify a new institution and its authorized administrator before accepting a school agreement or provisioning real rosters. Support a second authorized administrator so staff departure does not strand the institution. The school owns its workspace; an individual teacher's personal account does not own all school records.

Support school identity providers through OIDC or SAML where the chosen service supports them. Authentication must still be followed by current school membership and class authorization. Account linking should survive school email changes without allowing a reassigned mailbox to inherit a former teacher's access.

### Recovery and sensitive changes

Use passkeys and MFA for adults with access to children's records, especially teachers and administrators. Provide usable recovery options such as additional authenticators and recovery codes. Recovery must not rely on public facts such as a child's school, birthday, or teacher's name. NIST recognizes properly verified FIDO2 passkeys as phishing-resistant multifactor authenticators. [NIST authenticator examples](https://pages.nist.gov/800-63-4-Implementation-Resources/authenticator/index.html).

Require fresh authentication for guardian changes, new privileged school roles, account deletion, sensitive exports, and recovery-method changes. Notify existing contact methods where appropriate. A support-assisted recovery needs a documented verification process, limited staff access, an audit trail, and safeguards against transferring another person's child records.

## Multi-device login and synchronization

### Shared identity, separate device sessions

The central identity service authenticates the person; the learning API decides which learner, workspace and records that person may access. Each device receives its own revocable session. Account settings show devices, recent security activity, last use, and controls to revoke one device or all sessions.

Web sessions should use a backend-for-frontend with host-scoped Secure/HttpOnly cookies, an explicit SameSite policy and CSRF defenses. Keep long-lived credentials out of browser Web Storage. Native clients should use the system browser for OAuth authorization with Authorization Code + PKCE, then protect device credentials with the operating system's keystore/keychain. [OWASP sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [RFC 8252](https://www.rfc-editor.org/rfc/rfc8252.html).

Use short-lived access credentials, independently revocable device grants and replay protection for refresh credentials. Rotation or sender binding must detect refresh-token reuse. Revocation-sensitive operations also consult current session/membership state; a signed token alone must not preserve revoked access until a long expiry. [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html).

For a child-owned device, show a short-lived pairing code or QR request. The guardian authenticates on their own device, selects the learner, reviews the device and approves a restricted session. Codes are single-use, expire quickly and are rate-limited. Leaving learner mode for guardian/teacher operations requires fresh adult authentication; a client-side flag or local PIN cannot elevate server privileges.

### Sync semantics

Treat synchronization as authorized records and events, not a shared folder containing `family.json`:

- Progress events have stable IDs and idempotent writes so retries do not duplicate completions or credit.
- Records retain exact course and source revisions where the existing engines require them.
- Mutable plans and drafts use revision checks and explicit conflict handling.
- Submitted work remains an immutable version. Instructor evaluations and corrections retain their authorship and history.
- A parent's private note, a learner's practice result, and an official school grade remain different record categories.
- Permission changes, identity deletion and consent withdrawal advance server state that invalidates stale queued operations.
- A reconnecting device applies revocation/deletion state before uploading old queued work. Restored backups cannot recreate deleted profiles or authority.

A school grade is authoritative in its school context. The Family view can display an authorized copy or summary with its source and update time; it must not overwrite the school grade using another device's local progress.

### Offline and local storage

Retain local-only learning as an explicit option. Opting into sync should show which profiles, courses and record categories will upload, create stable identity mappings, and preserve an export before migration. Matching names or birthdays is not enough to merge profiles.

For native account use, encrypt private caches with keys protected by platform secure storage. Public downloaded course content can remain separate. On shared computers, default to restricted cache persistence and clear sensitive data when the authorized session ends. Browser offline storage cannot be described as equivalent to an operating-system-backed encrypted native vault.

Offline reading/practice may continue within a bounded policy. Administrative changes, invitations, consent changes, grading publication and identity deletion require online authorization. Revocation can prevent new server access and trigger cache removal when a device reconnects; it cannot guarantee erasure of an already exported file or an unreachable offline device.

## Schools, multiple teachers, and family links

### Permissions

| Actor | Typical permitted scope | Scope that is not automatically granted |
| --- | --- | --- |
| Learner | Own enrolled courses, assigned work, submissions and released feedback. | Other students, teacher drafts, school administration or guardian settings. |
| Guardian | Verified linked learners and granted family/school views. | Another household's child or a whole class gradebook. |
| Teacher | Assigned classes and records needed for their responsibilities. | Every student in the school or a child's unrelated home records. |
| Teaching assistant | Explicit delegated operations for assigned classes. | Full teacher or administrator powers by default. |
| School administrator | Staff, rosters, institutional settings and specifically authorized records operations. | Unlimited access to every sensitive category solely because of the title. |
| Support operator | A time-limited, approved support purpose with audited access. | General browsing of child records. |

A staff member can teach several classes, co-teach a class, or work in more than one institution. Model those assignments explicitly. Removing a teacher's membership revokes their institutional access and transfers their duties without deleting the class's grades or student work. Keep former-staff attribution only for the appropriate documented record purpose.

Authorization should consider the authenticated actor, active workspace, relationship, class assignment, record category, operation and current purpose/authority. Apply it to individual records, list queries, search, exports, files, background work and support tools. OWASP recommends default-deny authorization and consistent request validation; tenant IDs and random record IDs are not authorization proof. [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [Multi-tenant security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html).

### Connecting a family to a school

1. Authorized school staff creates an invitation for a specific enrollment and intended recipient under school policy.
2. Send an expiring, single-use link. Store a token hash; keep child names, grades and roster details out of the URL and unauthenticated page.
3. The recipient signs in or completes the appropriate account flow. The link alone does not establish guardianship or grant record access.
4. Resolve the verified guardian/learner relationship and the school-scoped enrollment. A generic class link can request membership, but cannot open private records.
5. The school/guardian confirms the permitted connection according to the applicable authority. Record its scope, effective dates and provenance.
6. The Family page shows only approved updates: the child's assignments, released grades, progress, attendance and school messages as configured. Disconnecting revokes future access through that link without silently deleting the school's records.

One family may connect to several schools. Each school gets only its own authorized relationship. Do not distribute a complete class roster or shared class secret as the account-linking mechanism.

School authorization under COPPA is limited to its educational context, with notice and appropriate review/deletion controls. It does not authorize unrelated commercial use or remove the operator's responsibilities. Confirm the institutional agreement and applicable authority before enrollment. [FTC school guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions#N.%20COPPA%20AND%20SCHOOLS).

## Storage and security architecture

### Proposed deployment boundaries

| Component | Location and access model |
| --- | --- |
| Public website and course delivery | Existing public infrastructure; no private family/school-record bindings. |
| Identity provider | Selected managed US-region service for the US account rollout; credentials, authentication and recovery. |
| Account/learning API | Separate Worker/service, narrowly scoped secrets, current authorization and audit. |
| Account and educational metadata | New managed PostgreSQL in a selected US region, encrypted storage/backups, private network/TLS access and RLS. |
| Student attachments and private exports | Separate non-public R2 bucket with explicit `us` jurisdiction; metadata authorization before access. |
| Native cache | Encrypted account data with OS-protected keys; separately revocable device sessions. |
| Browser cache | Minimal per-user/context data with explicit trusted-device policy; no persistent authentication secrets in Web Storage. |
| Operational logs | Separate minimized logs with documented retention and no lesson answers, child names, raw tokens or sensitive document contents. |

The recommendation for PostgreSQL is an engineering choice for this new data domain. It adds an independent database boundary against an omitted tenant predicate and supports transactional membership/record changes. Existing D1 services remain appropriate for their existing purposes. Do not create two interchangeable private education backends at the same time.

RLS must be explicitly enabled and tested. Runtime database roles must not be superusers, owners that bypass policies, or holders of `BYPASSRLS`; use separate migration credentials, deliberate `FORCE ROW LEVEL SECURITY`, and policies for both read visibility and allowed writes. Application authorization remains necessary. [PostgreSQL row security](https://www.postgresql.org/docs/17/ddl-rowsecurity.html).

If Workers uses Hyperdrive for PostgreSQL, use a cache-disabled binding for private records, sessions and permissions. Apply server-derived actor/workspace context within each short transaction; do not rely on a previous request's pooled connection state. Hyperdrive caches eligible queries by default, does not invalidate those reads on writes, and uses transaction pooling. [Query caching](https://developers.cloudflare.com/hyperdrive/concepts/query-caching/), [Connection pooling](https://developers.cloudflare.com/hyperdrive/concepts/connection-pooling/).

### Residency, files, and encryption

Cloudflare currently offers explicit `us` jurisdictions for D1 and R2; location hints alone are not residency guarantees. The proposed private file bucket must use a jurisdiction setting, not merely a North America hint. A region for a database or bucket does not, by itself, constrain identity-provider processing, Worker execution, support, logs, replicas and disaster recovery. Document those separately in the provider review and school agreement. [D1 location](https://developers.cloudflare.com/d1/configuration/data-location/), [R2 location](https://developers.cloudflare.com/r2/reference/data-location/).

Authorize attachment metadata before upload/download. For sensitive child documents, prefer an authenticated download endpoint so current access can be checked. If issuing a signed URL, keep it narrowly scoped and short-lived; it is a bearer capability until expiry. Use opaque object keys, validate uploads, limit file sizes/types, scan supported content, and prevent public-bucket exposure. [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/).

Use TLS in transit, managed encryption at rest, controlled key access and encrypted backups. Do not describe school storage as end-to-end encrypted or zero-knowledge merely because transport and disks are encrypted. School reporting and multi-teacher access require a deliberate key/authorization design. Preserve the existing passphrase-encrypted personal backup/checkpoint option separately.

Implement rate limits, secure headers, CSRF defenses, dependency updates, secret rotation, isolated environments, logging alerts and an incident-response process. Scope production support access to a documented reason, approval and expiry. A valid login is not sufficient to export a child's records, change guardianship or issue credentials.

## Retention and account deletion

### Parent deletion is not a cascade

Do not make learner ownership a foreign-key consequence of a parent account. Offer clearly distinct actions:

| Action | Expected result |
| --- | --- |
| Close my adult account | Disable the login, revoke its sessions and remove its applicable relationships; explicitly resolve remaining workspace responsibilities. |
| Leave or transfer a family | End that adult's family membership or transfer stewardship to another verified guardian. |
| Delete a learner's family-controlled data | Verify authority and exact scope, stop covered collection as required, and run the applicable deletion workflow. |
| Request deletion of school-controlled data | Route through the responsible school and its applicable authority, retention and request process. |
| Remove this device's data | Clear its local cache/session; disclose that other devices, exports and remote records are separate. |

Account deletion first revokes access, then erases the Erudior account record at the identity provider, its external sign-in links, and unnecessary contact, recovery, device and account data under the applicable schedule. Retain only specifically justified records or minimal attribution, with a documented purpose and expiry. Deleting the adult account does not cascade into separately authorized learner, family or school records.

If the final guardian leaves any dependent learner without valid independent access or another authorized steward, resolve a verified transfer, appropriate school-only context, or explicit family-data deletion. This includes a 13–17-year-old who has never established independent credentials; a birthday alone does not provide account recovery. For an under-13 consumer profile, also resolve the applicable consent basis and stop consent-dependent collection while authority is unresolved. Do not leave orphaned child data collecting indefinitely. The presence of a second guardian must not be used as a blanket reason to ignore a valid privacy request; handle the request's actual authority and scope.

For a teen with independent credentials, closing the parent's login does not automatically destroy the teen's account. At adulthood, ongoing guardian access needs the appropriate new permission or other lawful basis. A school relationship and its records are not owned by a parent's consumer login.

COPPA includes parental review/deletion and limits on covered collection. FERPA applies to covered institutions and provides record-access, amendment and disclosure rights; it does not create a universal right to erase accurate school history. FERPA generally does not prescribe what records schools must retain, but outstanding access requests restrict destruction. State requirements, contracts and record categories still matter. [FTC](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), [FERPA applicability](https://studentprivacy.ed.gov/faq/which-educational-agencies-or-institutions-does-ferpa-apply), [FERPA rights](https://studentprivacy.ed.gov/legal-basics), [Retention and pending access](https://studentprivacy.ed.gov/faq/does-educational-agency-or-institution-have-discretion-over-what-education-records-it-decides).

### Proposed operational schedule

These are initial engineering/product targets to validate with providers and the applicable policy. They are not claims that law mandates these exact numbers, and shorter applicable deadlines take precedence.

| Category | Proposed trigger and handling |
| --- | --- |
| Unverified adult signup | Keep minimal pending state for 7 days, then purge if signup is not completed. |
| Device pairing request | Expire after 5 minutes; single use and bounded attempts. |
| Family/school invitation | Expire within 7 days; privileged staff invitations may use a shorter period. Delete unused invitation payload after expiry; retain only necessary security evidence. |
| Generated private export | Authenticated, short-lived access; purge the service copy within 24 hours. User-downloaded copies are controlled by the recipient. |
| Active personal/family records | Retain for the documented active educational purpose with a review date; provide export and scoped deletion. Reassess necessity instead of treating account existence as indefinite justification. |
| Inactive consumer workspace | Review after 12 months without activity or another current educational purpose; notify the responsible user and allow a 90-day response/export period. An active school enrollment is not abandoned merely because a parent has not signed in. Child-data necessity and valid requests take precedence over this inactivity workflow. |
| School records | Require a school-approved schedule by record category and jurisdiction before onboarding real rosters. Attendance, grades, transcripts, accommodations and drafts need separate rules; no universal deletion period. |
| Verified applicable erasure | Revoke access/stop affected collection promptly; target removal from active stores within 30 days, or sooner where required. Report exceptions and actual completion. |
| Operational backups | Use a bounded restore window, initially target at most 30 days after active-store erasure. Reconcile deletion records before restoring service. Confirm the actual provider behavior before promising a completion date. |
| Routine operational logs | Proposed 30-day rolling retention with sensitive content excluded. |
| Security/audit records | Proposed 90-day default for minimized security events; longer record-change evidence only under a documented institutional or legal purpose and retention class. |
| Deletion ledger and replay fences | Minimal pseudonymous identifiers and versions, separate from ordinary security logs; these can remain linkable personal metadata. Retain through every permitted backup-restore and offline replay window, with a documented expiry/end condition. Retired identities are never reassigned. Prune only after old snapshots, grants and queues can no longer recreate the erased scope. |

With the proposed 30-day active-store target followed by a 30-day backup window, ordinary backup expiry can occur up to 60 days after the verified request. Explain that end-to-end schedule clearly; do not advertise complete erasure within 30 days. Shorter applicable duties take precedence, and each provider's actual backup, log and identity-data behavior must be included in the completion calculation.

School contract termination is a separate lifecycle trigger: agree an export/return window, revoke institutional access, stop the terminated processing and delete records under the approved institutional schedule. Preserve independently authorized personal/family records in their separate domains. A teacher leaving, a parent closing a login, and a school ending its service agreement must not share one destructive cascade.

The amended COPPA rule's general compliance deadline was April 22, 2026. Its retention provisions require a written policy tied to specific purposes and deletion timeframes, rather than indefinite retention. A retention schedule therefore needs executable jobs and monitoring, not only policy text. [Official final rule](https://www.govinfo.gov/content/pkg/FR-2025-04-22/html/2025-05904.htm).

### Deletion execution and recovery

Verify the requester and resolve authority without collecting unnecessary new identity documents. Show a precise inventory, offer an export where appropriate, identify records under another custodian, and separate cancellation of access from data erasure.

Track deletion across relational rows, attachments, search projections, generated exports, sync queues, sessions, analytics, external processors and backups. Give every job an idempotency key, progress state, retry policy, deadline and monitored failure state. Preserve a minimal receipt rather than the deleted student content.

Prevent resurrection: invalidate device/permission versions, reject stale offline submissions for erased scopes, and reconcile a trusted deletion ledger after a backup restore before reopening reads or writes. Test restoration of a snapshot taken before an erasure. Legal or contractual holds need a documented basis, restricted access, review date and eventual release; they are not a blanket exception for retaining everything.

Do not promise deletion of copies outside Erudior's control. Disclose the limits for downloaded reports, exports held by families/schools and devices that never reconnect. Enforce future service access and deletion on managed stores that Erudior actually controls.

## Implementation sequence and release gates

Build this as one account program with staged internal milestones. No milestone alone enables production child-data collection.

1. **Contract and lifecycle foundation.** Confirm launch scope/providers, data inventory, notices, consent/authority model, retention classes, deletion flows, incident response and institutional agreements. Define the complete permission matrix and migration scope.
2. **Identity and authorization.** Add account/learner entities, named guardians and school memberships, provider login, recovery, device sessions, RLS and server authorization. Test revoked and cross-context access before adding record sharing.
3. **Family and devices.** Implement verified guardian provisioning, restricted child pairing, explicit local migration, encrypted caches and idempotent personal sync. Implement age transitions, export, transfer and erasure alongside the data being introduced.
4. **Schools.** Add verified organizations, teacher/class assignments, school identity connections, authenticated invitations, school-controlled submissions/grades and scoped Family updates. Enable each record type only with its retention and deletion rules.
5. **Operational acceptance.** Exercise real infrastructure with synthetic records: tenant isolation, role changes, pairing, lost devices, offline conflicts, restored backups, deletion/withdrawal, school termination and incident recovery. Complete independent security/privacy review and controlled user acceptance before allowing real records.

Required negative cases include School A versus School B; teacher versus an unassigned class; guardian versus an unrelated child; a teacher-parent switching workspaces; revoked staff/device sessions; expired or replayed invitations; child attempts at adult actions; private file/export access; an offline queue after deletion; and a backup restore after a withdrawal.

Keep existing release signing, course integrity, credential authority, local CAS/tombstone protections and immutable assessment evidence. A new account must never grant professional credit, reviewed publishing status or issuer authority automatically.

## What the accompanying change delivers

The code change renames the global Progress destination to Courses, retains in-course Progress, and adjusts the visible Family/Classroom navigation using the local workspace that exists today. The account, organization, school-link, secure-device and lifecycle design in this document remains to be implemented and accepted as a complete service.

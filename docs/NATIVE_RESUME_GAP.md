# Fail closed when Android returns without a recorded pause

## Observed release blocker

While continuing Math K integration, PR #138 upgrade run 41780558204 installed version B and retained saved course/progress/settings/review records. Explicit shared-device locking, draft recovery and sibling isolation also passed. The first real HOME/foreground long-absence check then failed to show the lock screen. Its evidence records launcher foreground followed by Erudior foreground after about 32 seconds, but the received native event has backgroundMs=0, sequence=3 and revocation=0. The cause of the missing recorded pause is not established.

Evidence artifact 13299771215 was downloaded and archive-hash checked: 239bb04efd1b33848848a01d8d036ec3b0e26c1698d5830c693f85c54984582e. The relevant source is PR merge3df69ec0b586f4009dfb5a5feeb2dfaf75e5258e; the production Java reducer and TypeScript consumer were confirmed at current main a8ff56196cde513092054fcc717df9d98f13dd92. Do not infer a physical-phone result or a specific upstream framework defect from this trace.

## Narrow defense

A resume without a recorded pause, or with a backwards monotonic-clock interval, now creates an owed revocation when no older one is pending. An unmeasured duration remains zero in telemetry; no thirty-second duration is invented. The existing consumer independently honors the positive revocation token and locks synchronously before reveal. The native visibility/paint acknowledgement fence remains unchanged.

Repeated delivery or another unknown resume while the same obligation is still pending cannot erase or repeatedly replace it. A new unknown resume after consumption requires a new revocation. This intentionally favors reauthentication over retaining access when lifecycle evidence is incomplete; a redundant native resume after an earlier ACK can therefore relock a managed workspace. A genuinely paired short absence retains the existing thirty-second grace behavior. No role, learner grant, credential, progress record or account permission is created or changed.

## Verification

The three original native files/test runner were reconstructed locally and their exact Git blob IDs checked. The existing production Java tests passed before the change. The new missing-pause regression fails on the original reducer and passes with the patch. All existing assertions remain, with four added regression groups and six measured grace-boundary cases. Two new tests exercise the unchanged production TypeScript consumer: revocation-before-reveal, duplicate/reloaded delivery, newer revocations, wrong bridge and no ACK when commit throws. Both passed locally.

Commands:

```
python3 tests/android-upgrade-lifecycle.py
node --import tsx --test tests/native-resume-gap.test.mts
```

Local testing compiled the real Android-independent reducer and used the exact production consumer, not copies of their behavior. It did not execute Android Activity callbacks, WebView visibility, full-app storage, physical-device or audible speech tests. Hosted execution and merge status must be recorded separately in the PR.

## Still required

This guard does not prove that pause delivery is repaired, nor that private views were concealed while backgrounded. The existing real-emulator assertions still require measured long-absence delivery and visual commitment; none is removed, relaxed or relabeled. Investigate the missing callback and require full native acceptance before release. No APK is published by this change. Guided-practice support and private Math K remain separate drafts.

# Learning games and live quiz modes

## Acceptance boundary

This is one original Lesson Engine capability, not additional roadmap rows. Source: roadmap `8d90b78f` (Teacher Assistant games and classroom tools), consolidated into the Lesson Engine in `077a9952`; `MASTER_ROADMAP.md` also specifies memory.

Required end-to-end behaviors:

- Existing installed course material supplies review boards, bingo, memory and matching. Selection and unsupported-content exclusions are visible; no new authored courses or fabricated answers.
- Parent/classroom-teacher access includes accessible local games, reset/replay, deterministic scoring, timers, random picker/team formation, polls, whiteboard, exit tickets and a presentation view.
- Live rooms preserve individual timed/untimed play and add team battle and cooperative play with authoritative scoring, safe question/reveal transitions, reconnect/close handling, and no answer leakage.
- Learners see only their own identity/result and anonymous aggregate totals, never other learner names. Host controls remain in the existing adult area. Ephemeral room/game data is not academic evidence, mastery, grades or credentials.
- Repeated actions, malformed input, stale connections, interrupted sessions and responsive keyboard/screen-reader interaction are tested. Existing security, course signing/publication and licensing gates remain unchanged.
- Complete exact-head regression/build and native gates before merge; post-merge applicable regression, native, integrity, web/API and signed-course publication/readback must pass before the original single roadmap row is Done. Desktop installer packaging remains deliberately deferred.

The neighboring interactive-presentations and generated-content capabilities remain separate; this feature does not claim a slide authoring system or generated educational materials.

## Use

Open the existing unlocked Parent or Teacher area → **Learning games**. Select an installed course and text question pairs, notecards or glossary material. The compatible/excluded counts explain unsupported media and ambiguous pairs; normal course practice remains available for those items. Review boards use an adult's explicit correctness judgement; matching, memory and bingo compare exact pair identities. Restart keeps the selected set; end returns to selection. Leaving the page clears games and local notes. Large-text presenter view disables classroom editing while displaying the activity.

Classroom tools are offline/local facilitation: a pausable timer; nickname picker and balanced teams; editable teacher-tallied polls; an exit-ticket prompt/class summary; and an accessible plain-text shared writing board. They do not send remote learner responses or persist student information.

For separate devices, choose **Live room** with internet connectivity. Select individual practice, anonymous numbered team battle, or a cooperative class challenge; select timed speed points or untimed correctness points. Team assignment/rebalancing is lobby-only. The host sees nicknames; players see their own result and anonymous totals. Existing host authorization, room limits and expiration remain enforced. No live results become academic credit. Closing waits for server confirmation; interrupted closure remains explicitly unconfirmed and can be retried.

## Verification commands

- `npm test` — aggregate source/mechanics, UI and socket-state regressions (plus all existing suites).
- `npm run build` — frontend typecheck and production bundling.
- `npm run test:games-browser` — isolated test fixture, all four games and tools, keyboard interactions, 320/1280 layouts, light/dark, overflow and axe; install Chromium with `npx playwright install chromium` first.
- `npm test --prefix worker` — isolated local D1/R2 API and live WebSocket integration; never production bindings.
- `worker/node_modules/.bin/tsc -p worker` — worker typecheck.

Browser and live integration are an explicit PR/post-merge CI lane. Their result must be verified for the exact candidate; merely adding the suite is not a pass.

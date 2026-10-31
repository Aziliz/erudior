# Logo navigation sidebar

The native-app header logo opens a left-side navigation drawer rather than returning directly to Library. The public website brand remains its existing home-page link. Existing desktop/header navigation and phone bottom tabs remain available.

The drawer offers Courses (enrollment progress and pathways), Notebook (the student workspace), Library, configured Community, the current local Family or Classroom workspace, and Search. Utilities include Account management, Display settings, existing Settings/app-update tools, privacy terms and, for managed workspaces, Lock device.

Account management is a local navigation panel, not a newly launched identity service. It links to the existing learner picker, gated learner management, security/backup and learner privacy workflows. Independent users can open existing local workspace setup and learning-data tools. Only the selected learner's name is shown; no sibling roster or recovery credential is loaded into the drawer. Online sign-in, account recovery and cloud synchronization remain explicitly unavailable. No fake signup, signout, remote deletion or verified guardianship is introduced.

All page changes go through the existing AppApi.go and its draft/session guards. Opening a menu does not unlock an adult gate. Lock, concealment and authentication prompts synchronously remove the modal from the DOM; changing the local-session epoch remounts its state. The component never issues a session grant, switches a student directly, writes family data or fetches an account endpoint.

The native HTML dialog supplies modal focus containment. Close, Escape and backdrop dismissal restore focus to the logo; dragging from the inside to the outside is not a backdrop click. Display controls reuse the app's existing theme, size and width state. The drawer includes safe-area spacing, bounded width, scrolling, high-contrast tokens and reduced-motion support.

Validation commands:

```
node --test tests/app-sidebar.test.mjs
npm run build
node scripts/app-sidebar-browser.mjs
```

The dedicated CI job runs the real App with isolated synthetic solo, Family and Classroom data, 1280px/light and 320px/dark views, large text, accessibility checks, route veto, adult-gate and lock checks. It saves screenshots and a result file. Browser native-look validation does not establish physical Android Back/installation behavior. Normal full regression, native persistence, Android build/upgrade and release checks remain unchanged. No new installer or publication request is part of this UI change; native delivery requires a subsequent signed preview built from validated source.

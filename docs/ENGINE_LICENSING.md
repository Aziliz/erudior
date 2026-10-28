# Erudior Engine licensing and attribution

**Status:** Draft terms proposed for review. This document explains, but does not replace, the root [proposed license](../LICENSE-DRAFT.md). Legal counsel should review the copyright ownership, redistribution permissions, trademark terms and enforceability before it is merged.

## What is covered?
The Engine code that Erudior's copyright holders can license: the lesson rendering/assessment engine and app. A third-party dependency is not relicensed by this policy. Independent educational content (course JSON, questions, art, worksheets), learner records, and other user-created content do not become Erudior property simply because they were created with the engine.

## What adopters must do
1. Display the Erudior splash when their Engine-based graphical product launches. Until the branded art is supplied, an accessible "Powered by Erudior" splash and https://erudior.com link is sufficient.
2. Preserve appropriate Engine license and copyright notices and identify modifications.
3. When distributing or publicly hosting a modified Engine, publish the corresponding Engine modification source and submit it back to the main repository as a PR or publicly accessible equivalent. Maintainers can reject a PR; submission still meets the contribution obligation.
4. Respect all independent third-party software licenses and rights.

## Examples
- Publishing a math course authored using the Erudior editor **without redistributing the Engine**: the course is independent content; no splash requirement for the JSON itself, and no source contribution of the course.
- Forking Erudior to launch a new desktop educational app: show splash, keep notices, and submit Engine modifications when distributed.
- Running a publicly accessible website with modified Erudior Engine: show launch attribution to users and publish/submit modifications upon deployment.
- Developing changes privately without distributing or publicly operating the modified Engine: contribution requirement has not yet triggered.
- Editing lesson material or a question bank: not automatically an Engine Modification.

## Splash screen implementation
- Erudior brand identity with accessible text alternative.
- Responsive for web, desktop and mobile.
- Startup behavior that does not cause inaccessible or excessively long delays.
- An equivalent startup/documentation attribution for headless or CLI projects.
- Official asset published in the repository and linked from the license.
- Test coverage for the splash presence and accessibility.

## Important caveats
This is a **custom source-available** license and may be incompatible with some third-party distribution policies and copyleft dependencies. The license binds only materials that the Licensor actually owns or has rights to sublicense. Contributions from others may require contributor terms or explicit authorization. A contribution-back obligation needs legal review, especially for commercial, network-hosted and mixed-license scenarios.

Before adopting this as a final enforceable license, identify the legal copyright holder(s), review third-party notices and any prior contributions, confirm trademark authority, and obtain legal review.

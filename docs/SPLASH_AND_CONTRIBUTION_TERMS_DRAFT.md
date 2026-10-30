# Erudior Engine splash, attribution and contribution terms — draft for legal review

**Not an effective license.** The canonical [nonbinding proposal](../LICENSE-DRAFT.md) must be reviewed by counsel and rights holders before adoption. See the [licensing guide and remaining decisions](ENGINE_LICENSING.md). The project's current repository does not yet publish an adopted root LICENSE. The homepage footer links to the draft publication; showing a preview does not adopt or amend the license.

## Current official application behavior (implementation, not a license condition)
- Automatic branding plays **only when opening the web app**, not on erudior.com, its public pages, or in native desktop/Android builds.
- Play once per tab session on a fresh navigation. Do not replay on refresh, internal navigation, browser back/forward, or tab focus. Denied storage and reduced-motion preferences skip the automatic intro.
- The intro is a 3.0-second presentation including its fade: closed half-book, one physical cover opening, exactly two two-sided page turns, then a 600 ms teal bookmark reveal.
- Fetch application code immediately and render/fetch data while the intro plays. Never await the animation before starting the application; independently remove the overlay if startup fails.
- Official branding uses **ERUDIOR** and **Learn without limits.**, without external developer attribution.
- Runtime overlays remain excluded from prerendered HTML. A still third-party example in the homepage footer is ordinary page content, not an automatic overlay.

## Proposed attribution for an independent third-party Engine product
- Use the same book/teal bookmark visual, its own product name, readable **Powered by Erudior** linked to https://erudior.com, and the independence notice.
- Add **Independent product; not affiliated with or endorsed by Erudior.**
- Do not use the official motto to imply that Erudior publishes or endorses the third-party product.
- `createStartupSplash({kind:"third-party",productName:"Example"})` provides the launch variant. `createBrandingPreview(brand)` provides the still, inline example; explicit playback is opt-in.
- The homepage footer's Play button demonstrates the required startup attribution **under the proposed terms**. It does not autoplay, loop, or change web-app session playback.
- The proposal calls for equivalent attribution in `--about` output or accompanying startup documentation for headless products. It also calls for accessibility, screen-reader semantics, and reduced motion. These are proposed conditions, not current obligations.

## Proposed source contribution obligation
- On distributing or publicly deploying a **modified Engine**, provide recipients the corresponding modified Engine source under the proposed terms if separately adopted, preserve notices, and submit changes upstream via a pull request or public link. Merely authoring courses, spreadsheets, worksheets, videos, or personal learner content does not transfer ownership or trigger a contribution duty.
- Include modification and version identification, source location, and third-party notices.
- Upstream maintainers may reject contributions without voiding the requirement to make modifications available.
- No requirement to contribute private work not distributed or hosted publicly.
- License cannot grant rights in material the licensor does not control. Patent, trademark, network-service terms, contributor ownership, and copyleft compatibility require formal legal review.

## Status
Both visual variants share the same animation implementation. The contribution-back language remains a **proposal**, not an enforceable licensing claim until the actual license has been reviewed and adopted. Existing third-party dependencies retain their own licenses.

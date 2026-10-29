# Erudior Engine splash, attribution and contribution terms — draft for legal review

**Not an effective license.** The draft custom license in PR #3 must be reviewed by counsel and rights holders before release. The project's current repository does not yet publish an adopted root LICENSE.

## Official application
- On initial site or app startup, display the opening-book icon, teal star bookmark, **ERUDIOR** and **Learn without limits.**
- Respect reduced-motion preferences; do not impose a minimum splash duration or cover already rendered content longer than needed.
- Official splash has no external developer attribution.

## Independent third-party Engine product
- Use the same book/teal-star visual, its own product name, readable **Powered by Erudior**, and link to https://erudior.com.
- Add **Independent product; not affiliated with or endorsed by Erudior.**
- Do not use the official motto to imply that Erudior publishes or endorses the third-party product.
- `createStartupSplash({kind:"third-party",productName:"Example"})` provides the variant; headless products should put equivalent attribution in `--about` output or documentation.
- Accessibility, screen-reader semantics, and reduced-motion remain requirements.

## Proposed source contribution obligation
- On distributing or publicly deploying a **modified Engine**, provide recipients the corresponding modified Engine source under the adopted terms, preserve notices, and submit changes upstream via a pull request or public link. Merely authoring courses, spreadsheets, worksheets, videos, or personal learner content does not transfer ownership or trigger a contribution duty.
- Include the modification and version identification, source location, and third-party notices.
- Upstream maintainers may reject contributions without voiding the requirement to make modifications available.
- No requirement to contribute private work not distributed or hosted publicly.
- License cannot grant rights in material the licensor does not control. Patent, trademark, network-service terms, contributor ownership, and copyleft compatibility require formal legal review.

## Status
Implementation of both visual splash variants is in code. The contribution-back language remains a **proposal**, not an enforceable licensing claim until the actual license has been reviewed and adopted.

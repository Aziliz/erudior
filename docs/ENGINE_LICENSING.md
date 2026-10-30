# Erudior Engine license proposal and adoption decisions

**Nonbinding proposal — not adopted and not effective.** The canonical proposed text is [LICENSE-DRAFT.md](../LICENSE-DRAFT.md). Publishing, reading or using Erudior does not activate or accept it. This publication grants no permissions and imposes no obligations, does not establish that the Engine is licensed for reuse, and does not replace existing rights or third-party terms. There is no adopted root LICENSE in this change. The proposal is custom source-available text, not an OSI-approved open-source license.

## Reconciliation of PR #3 and PR #67

PR #3 proposed placing the text in a root LICENSE and described requirements as current obligations in its README. PR #67 preserved that text as a draft and added a public explanation. This publication follows #67, retaining #3's useful proposed attribution, contribution and exclusion language without adopting its root-license placement or effective-license claims. The draft's nonbinding header controls its hypothetical permission and acceptance sections. The public text download is an identical copy; the website renders the canonical draft directly.

The reconciliation also removes the guide's text-only interim splash exception (not present in the proposed terms), aligns the network trigger with publicly accessible deployment, and makes termination refer to the proposed notice-and-cure provision rather than a conflicting immediate revocation phrase. These are draft clarifications for review, not adopted policy.

## Scope and proposed conditions, if separately adopted

| Area | Proposed treatment |
| --- | --- |
| Engine | Only application and lesson-engine code the identified rights holders can license; third-party materials excluded. |
| Independent graphical products | Opening-book and teal star-bookmark motif, own product name, readable linked **Powered by Erudior** credit, and **Independent product; not affiliated with or endorsed by Erudior.** No official motto suggesting endorsement. |
| Headless products | Equivalent attribution in `--about` output or accompanying startup documentation. |
| Accessibility | Respect reduced motion; no artificial minimum wait. The current official web-app animation is an implementation, not a binding condition or a universal playback schedule. |
| Distributed or publicly network-accessible modified Engine | Publish corresponding Engine modification source and reproducible build instructions under the proposed terms and submit upstream by first distribution/deployment; retain source availability while that version is offered. |
| Submission | Pull request, or public source repository plus notice when pull requests are unavailable. Maintainer acceptance is not required; accessible good-faith submission is the proposed condition. |
| Private changes | Changes never distributed or publicly offered do not trigger the proposed contribution condition. Private-network and organizational distribution boundaries still require review. |
| Independent content and records | Independently authored courses, textbooks, questions, worksheets, datasets, documents, artwork, user data and learner records are not assigned to Erudior or required upstream merely by using published interfaces or Erudior formats. Never include personal information or secrets in a submission. |
| Third-party materials | Original licenses and notices continue to govern. No third-party proprietary code may be submitted without permission; the draft cannot supply that permission. |

For example, authoring a course without distributing Engine code would not trigger proposed splash or Engine-source submission conditions for the course itself. Distributing a modified desktop Engine or publicly hosting a modified Engine would trigger the proposed conditions if adopted. Editing question banks alone does not make them Engine modifications. Bundled third-party media remains governed by its own terms.

Separate community publishing terms in [Terms of Use](../src/components/Terms.tsx) address content voluntarily submitted to the hosted community. The Engine proposal neither changes those terms nor treats independent content as assigned by Engine use. Any future reconciliation of community content terms is a separate decision.

## Existing implementation and third-party notices

See [splash implementation and proposed attribution](SPLASH_AND_CONTRIBUTION_TERMS_DRAFT.md), `src/lib/startupSplash.ts`, and `src/components/EngineAttribution.tsx`. Current official behavior is web-app-only first-session playback, with refresh, navigation and reduced-motion safeguards. The public footer example is opt-in. No splash timing or runtime behavior changes are introduced by publishing this draft.

The separate [third-party notice bundle](../public/third-party-licenses.txt) and `/licenses` page remain intact. `scripts/third-party-licenses.mjs` generates dependency notices, including a preserved saxes notice fallback documented in `scripts/licenses/README.md`. Their presence is not a completed compatibility audit or permission to relicense dependencies. Course, media and font notices must also be retained under their own terms.

## Decisions required before a separate adoption PR

No approvals below are asserted by this publication. Keep the proposal nonbinding until the relevant decisions and approvals are recorded.

- **Copyright authority:** Identify the legal rights holder(s), covered files and contributions, any employment or assignment obligations, prior grants, and each authorization needed to license them. Do not assume repository ownership establishes copyright ownership.
- **Contributor terms:** Decide the inbound license/authorization for future contributions and whether an agreement is necessary. Upstream submission does not itself assign copyright or guarantee permission to relicense.
- **Boundary and source duties:** Review derivative works versus independent plugins, integrations and content; private networks, organizational distribution and public services; corresponding source/build scope; deadlines, duration, unavailable upstream and good-faith submission rules.
- **Brand and artwork:** Confirm ownership and permission to use the name, motif, artwork and link; resolve necessary trademark permission, no-endorsement wording, graphical products without a startup screen, headless attribution, offline links and accessible equivalents. The proposal supplies no current trademark or artwork permission.
- **Compatibility and patents:** Audit dependencies, fonts, media, distribution platforms and prior licenses; decide patent scope and mixed-license handling. Review the exclusion of third-party proprietary materials and when a separate license would be needed.
- **Legal operation:** Obtain legal review of grant, network obligations, acceptance, cure/reinstatement, warranty/liability and governing-law wording. Resolve the current broad governing-law placeholder and document enforceability decisions.
- **Release and approvals:** Record rights-holder approval and completed legal review; select final version, effective date, covered releases and treatment of earlier versions. Adopt an effective root license only in a separate reviewed PR, updating every explanation consistently. Do not infer retroactive coverage from this publication.

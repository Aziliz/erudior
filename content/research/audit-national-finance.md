# Audit: national valuation, finance, lending law, math, federal tax (n2, g1, f1, refs/02-math.md, drills.json)

Audited 2026-10-13. Scope: parts/n2.json (5 lessons, 29 questions, 59 cards, 63 glossary), parts/g1.json (2 lessons, 18 questions, 31 cards, 26 glossary), parts/f1.json (37 quiz-fill questions, checked against their lessons in samples/colorado-broker-course.json), refs/02-math.md, drills.json (22 templates).

## Primary sources checked
- RESPA §8 penalties, 12 U.S.C. 2607(d): fine up to $10,000 and/or up to 1 year; civil liability of 3x the charge. https://www.law.cornell.edu/uscode/text/12/2607
- Reg Z §1026.24(d) trigger terms and required disclosures; comment 24(d)(1): "no down payment", "monthly payments to suit your needs" and a bare APR are not triggers. https://www.consumerfinance.gov/rules-policy/regulations/1026/24/
- Reg Z §1026.2(a)(3)(ii), the six-item TRID application, and §1026.2(a)(6), the two business-day definitions (the precise one applies to 19(e)(1)(iii)(B), (e)(1)(iv), (f)(1)(ii)). https://www.consumerfinance.gov/rules-policy/regulations/1026/2/
- Reg Z §1026.19(e)(1)(iii)(A)/(B): LE by the 3rd business day after application and the 7th business day before consummation. §1026.19(f)(1)(ii)(A): CD received 3 business days before consummation. §1026.19(f)(2)(ii): only APR inaccuracy, product change or added prepayment penalty need a new waiting period. https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-C/section-1026.19
- Reg Z §1026.23: rescission covers principal-dwelling security, until midnight of the 3rd business day. A residential mortgage transaction (purchase) is exempt, and so is a same-creditor refinance except for new money, so a refinance with a different lender is rescindable (supports f1-028). https://www.consumerfinance.gov/rules-policy/regulations/1026/23/
- Reg Z §1026.42 appraisal independence: scope is consumer credit secured by the principal dwelling, and comment 42(b)(1)-1 names real estate agents as covered persons. Prohibited acts include conditioning the appraiser's pay on consummation. Allowed: asking the appraiser to consider more information. 42(g) requires reporting a material failure, defined as one "likely to significantly affect the value". https://www.consumerfinance.gov/rules-policy/regulations/1026/42/
- HMDA / Regulation C (purpose and reporting). https://www.consumerfinance.gov/data-research/hmda/
- 26 U.S.C. 1031(a)(1)–(3), (b): real property held for business or investment, property held primarily for sale excluded, 45/180 days or the return due date if earlier, gain recognized up to boot. https://www.law.cornell.edu/uscode/text/26/1031 ; IRS like-kind tips page.
- IRC 121 via IRS Topic 701: $250k/$500k; 24 of 60 months for ownership and use; for joint filers either spouse may meet ownership but each must meet use; 2-year reuse bar. https://www.irs.gov/taxtopics/tc701
- 26 U.S.C. 6323(a) and (b)(6): federal tax lien priority and the property-tax/special-assessment superpriority. https://www.law.cornell.edu/uscode/text/26/6323
- Ginnie Mae: guarantees MBS issued by private issuers and backed by FHA/VA/RHS/PIH loans; doesn't buy or sell loans; wholly owned government corporation within HUD (GAO-06-9, ginniemae.gov). https://www.gao.gov/assets/a248332.html
- Colorado appraiser levels: Licensed Ad Valorem, Licensed, Certified Residential, Certified General. https://dre.colorado.gov/division-programs/real-estate-appraiser/licensing/appraiser-steps-for-initial-licensure-levels-of
- For the f1/drill Colorado items: C.R.S. 38-31-101 (TIC unless JT expressly declared), 38-31-201 (attempted TBE creates JT), 39-13-102 (doc fee 1¢/$100 or major fraction, none at $500 or less), 39-22-604.5 (lesser of 2% or net; none at $100k or less), 38-12-102.5 (2 months' rent cap), all via colorado.public.law.

## Calculations
- Every worked example in n2 (appraisal adjustments, cost approach, income approach, GRM, LTV, ratios, ARM cap, commission split, price-to-net, acreage, both proration conventions, seller net, cash to close, points, cap rate, amortization with payment checked by formula: $1,199.10 and $1,498.88, appreciation, the 10%-loss trap, mill levy) and in g1 (gain, $500k exclusion, cost recovery, adjusted basis, boot) was recomputed. All correct.
- All n2/g1/f1 calculation questions were recomputed, including what each distractor represents. All keys correct.
- refs/02-math.md: every formula and example rechecked ($48.50 doc fee, 40-acre survey example, proration directions). No errors.
- drills.json: I ported expr.ts to Python (same grammar, `round` with EPSILON, JS Math.round semantics) along with drills.ts `pick`/`checkAnswer`. Each of the 22 templates got 200 draws per seed across 5 seeds (1,000 each), compared against an independent computation. Price-to-net was checked as the lowest whole-dollar price and doc fee with major-fraction rounding. Tax proration used Python `datetime` day counts, and the `doy` formula was checked against the calendar for every m 2–11 and d 1–28. Results: 0 mismatches and no unresolved placeholders in any prompt or solution.

## Changes made
1. **n2 m2-loan-types (secondary market table and exam tip):** Ginnie Mae was described as a "government agency" that "stays a government agency". Changed to a government-owned corporation within HUD that guarantees securities issued by approved private issuers, and that does not buy *or sell* loans. Source: GAO-06-9, ginniemae.gov.
2. **n2-018 explanation:** made to match (1).
3. **n2 m2-lending-laws:** HMDA is in the assigned topic list but wasn't covered anywhere in the part. Added a short "HMDA — Home Mortgage Disclosure Act" section: Regulation C, loan-level reporting and public disclosure, used to judge community credit needs and spot discriminatory patterns such as redlining, and not a rate or approval law. The `[[Redlining]]` link moved to its new first use. No questions added.

No other errors were found. All ids are unchanged, no questions or drills were added or removed, and every answer index matches its explanation.

## Verified with no change needed (highlights)
- RESPA penalties, AfBA conditions, the seller-required title insurer ban; TILA trigger terms and non-triggers; the three-day rescission scope; the LE, CD and 7-day timing and business-day definitions; the three CD re-disclosure triggers; ECOA classes; QM features.
- Appraisal independence (g1, g1-017, g1-c030); USPAP/ASB/AQB/FIRREA roles; credential ladder; the Colorado ad valorem credential.
- §121, §1031 (including the QI and agent-disqualification rule), installment sale, depreciation periods, the post-May 6, 1997 depreciation rule, federal tax lien priority, inherited basis.
- f1: every one of the 37 items is supported by its lesson's text, keyed correctly, and has one defensible answer (f1-001–017 against the n1 lessons; f1-018–037 against m2/g1).

## Validation
- n2, g1, f1 and drills.json parse; every question has 4 choices and one in-range answer; every `[[link]]` in n2 and g1 resolves to that file's own glossary (f1 has none).
- `python3 content/build_course.py` completes (48 lessons with 10-question quizzes). I reverted the regenerated samples/colorado-broker-course.json so the caller can rebuild once all audits are in.

## For a human to double-check
- f1-007 (the Colorado tenancy-by-the-entirety question) has `section: "state"` but the national topic "Property ownership". It's correct on substance; whether a state question should carry a national topic is an organizational call.
- In the AQB criteria, a trainee is supervised by a *certified* appraiser (g1, f1-037). The Colorado DRE licensure page doesn't list a trainee level. The lesson already says states may use their own names, so I left it as is.

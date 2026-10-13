# Audit: national property content (parts/n1.json, refs/07-property.md)

Audited 2026-10-13. Scope: 5 lessons, 28 questions, 50 cards, 76 glossary terms, ref sheet 07-property.md. The audit covers property ownership, land use controls, and transfer of title.

## Sources used
- C.R.S. 38-31-101 (joint tenancy / TIC presumption, natural persons, fiduciaries): colorado.public.law/statutes/crs_38-31-101
- C.R.S. 38-31-201 (tenancy by the entirety): colorado.public.law/statutes/crs_38-31-201
- C.R.S. 38-41-101 (adverse possession): colorado.public.law/statutes/crs_38-41-101
- C.R.S. 38-35-109 (recording; "This is a race-notice recording statute."): colorado.public.law/statutes/crs_38-35-109
- C.R.S. 38-35-106 (recorded instrument gives notice even if unacknowledged or defectively acknowledged): colorado.public.law/statutes/crs_38-35-106
- C.R.S. 14-10-113 (division of marital property "in such proportions as the court deems just"): colorado.public.law
- 42 U.S.C. 9607(a) (CERCLA liable parties): law.cornell.edu; EPA "Superfund Liability" page (strict, joint and several, retroactive; 4 PRP classes): epa.gov/enforcement/superfund-liability
- 15 U.S.C. 1701, 1702, 1703 (Interstate Land Sales: CFPB administers it; the fewer-than-25-lots exemption; registration plus a property report before signing; 7-day revocation): law.cornell.edu
- 26 U.S.C. 856(a), (c)(3), 857(a)(1) (REIT: 100+ owners, 75% gross income test, 90% distribution): law.cornell.edu; Mass. DOR TIR 01-2 (95% → 90% for tax years beginning after 2000)
- DRE contracts and forms page: the Commission-approved deeds are Warranty, Special Warranty, Bargain and Sale, and Quit Claim (dre.colorado.gov/real-estate-broker-contracts-and-forms)
- Colorado meridians: townshipamerica.com Colorado PLSS guide and Mesa County Ute Meridian Resurvey Guidelines (the Ute Meridian covers the Grand Valley around Grand Junction)

## Changes (old → new, source)

### parts/n1.json
1. **Lesson `n1-estates-and-forms-of-ownership` (REIT):** "passes income through without paying corporate income tax" → "avoids corporate income tax on the income it distributes to owners". Source: 26 U.S.C. 857. A REIT is taxed on undistributed income and gets a dividends-paid deduction. It is not a full pass-through entity like a partnership.
2. **Lesson `n1-encumbrances` (personal easement in gross):** "usually end when that person dies or sells" → "usually can't be sold or transferred, and they end when that person dies". A personal easement in gross has no dominant land to "sell". The standard rule is that it isn't assignable and ends at the holder's death. Standard principle.
3. **Lesson `n1-encumbrances` (Colorado adverse possession):** "For fee-title claims filed on or after July 1, 2008, … clear and convincing … and … good-faith belief" → clear and convincing evidence applies to cases **filed** on or after July 1, 2008, and the good-faith-belief requirement applies where title **vests** on or after July 1, 2008. Source: C.R.S. 38-41-101(3)(a), (3)(b). These are two different triggers in the statute.
4. **Lesson `n1-land-use-controls` (CERCLA):** "current and past owners can be liable" → the current owner or operator, plus anyone who owned or operated the site **when the hazardous waste was disposed of**. Added that liability is strict, joint and several, and retroactive. Source: 42 U.S.C. 9607(a)(1)–(2); EPA Superfund Liability page. Not every past owner is liable.
5. **Lesson `n1-land-use-controls` (Interstate Land Sales):** added that the CFPB administers the act, buyers have a 7-day revocation right, and subdivisions of fewer than 25 lots are exempt. Source: 15 U.S.C. 1701(1),(12), 1702(a)(1), 1703(b). The topic assignment names ILSA, and these are its most-tested details. The lesson had no specifics.
6. **Card `n1-c004` (MARIA):** "intention is the key test" → "courts treat intention as the key test (some prep courses key method of attachment)". This flags the contested point, consistent with the lesson's heads-up.
7. **Card `n1-c006` and glossary "Emblements":** added the condition "if the tenant didn't cause the lease/tenancy to end". This matches the lesson. Without it, the card overstated the right.
8. **Card `n1-c033`:** split the Colorado triggers the same way as change 3 (clear and convincing evidence for cases filed since July 1, 2008; good-faith belief for title vesting since that date).

### refs/07-property.md
9. **Tenancy in common / joint tenancy table, "In Colorado" row:** "a deed to two or more people" → "two or more **natural persons**". Added that only natural persons can be joint tenants, except co-fiduciaries, who are **presumed** joint tenants. Source: C.R.S. 38-31-101(3),(4). The old wording implied a TIC presumption for any grantees, but co-trustees and co-personal representatives get the opposite presumption.

No questions were added or deleted. All ids, choices, answer indices and explanations in the questions are unchanged. None needed a fix: all 28 have exactly one defensible key, and the explanations match.

## Confirmed items a human might doubt
- **Colorado TIC presumption, natural-persons limit, JTWROS wording** (lesson, c025): C.R.S. 38-31-101(1),(4).
- **Attempted tenancy by the entirety creates a joint tenancy** (lesson, c026, ref): C.R.S. 38-31-201(3) for deeds on or after July 1, 2006. Pre-2006 deeds are *presumed* to create a joint tenancy, so the plain statement is accurate for current practice.
- **Adverse possession is 18 years and doesn't run against government land; the court may order compensation to the former owner**: C.R.S. 38-41-101(1),(2),(5).
- **Colorado is race-notice**: the statute literally says "This is a race-notice recording statute." (38-35-109(1)).
- **A recorded deed gives notice even if unacknowledged** (transfer lesson): C.R.S. 38-35-106(1). Also, a defectively acknowledged instrument of record for 10 years is deemed properly acknowledged.
- **Colorado isn't a community property state; equitable distribution** (lesson, c027): C.R.S. 14-10-113(1).
- **Colorado's approved deed forms**: Warranty, Special Warranty, Bargain and Sale, and Quit Claim, per the DRE forms page. There is no PR's deed form, and the lesson doesn't claim one.
- **Three Colorado meridians** (Sixth PM for most of the state, New Mexico PM in the south and southwest, Ute near Grand Junction): confirmed.
- **REIT**: 100+ owners (856(a)(5)); 75% of gross income from real-estate sources (856(c)(3)); 90% distribution (857(a)(1)), changed from 95% for tax years beginning after 2000. The lesson's "dropped to 90% in 2001" is consistent with that.
- **Fixtures, "most important test"**: intention is controlling in case law, and Van Ed keys method of attachment. The lesson already flags this, and the card now does too.
- **Math, all recomputed**:
  - 640/16 = 40 (lesson example, n1-002)
  - 640/32 = 20 (exam tip)
  - 640/8 = 80 (c016)
  - 330 × 660 = 217,800; 217,800 / 43,560 = 5 acres
  - township = 23,040 acres (36 × 640)
  - 1 acre = 4,840 sq yd (43,560 / 9)
  - 1 rod = 16.5 ft
  - joint tenancy scenario n1-005 (Bea 2/3 JT survivor, Dana 1/3 TIC)
- **Section numbering** (1 in the NE corner, 6 in the NW, 36 in the SE; boustrophedon): standard PLSS.
- **Lien priority example** (taxes, then the 2019 mortgage, then the 2023 judgment), and the property tax lien as specific/involuntary (n1-010): standard.
- **n1-024**: a missed recorded lien and forgery are covered under standard coverage; an encroachment that only a survey would reveal is excluded. Standard.

## Unverifiable / left as-is
- The "5 or fewer individuals own no more than 50%" REIT test comes from 856(h) via 542(a)(2). The fetched LII page didn't include subsection (h), but this is a well-established rule, so it was left in.
- Standard national-exam conventions with no single primary source include MARIA, PETE, OCEAN, the quadrangle (24 mi) and correction lines (every 24 mi), tenancy at will ending at death, and leaseholds as personal property. They match mainstream texts and were left as written.

## Validation
- parts/n1.json parses. There are 5 lessons, 28 questions, 50 cards and 76 glossary terms. Every question has 4 choices and one answer index in range. The answer spread is A 7, B 7, C 6, D 8.
- All `[[links]]` resolve to n1's glossary terms or aliases.
- Lesson word counts are now 1,402 / 1,714 / 1,321 / 1,464 / 1,619. The estates lesson was already over the 1,600 guideline before the audit (1,711).

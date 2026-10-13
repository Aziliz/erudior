# Audit: national contracts & disclosures (parts/n3.json, parts/f2.json)

Audited 2026-10-13. Scope: all 4 n3 lessons, 34 n3 questions, 59 cards, 63 glossary terms; all 15 f2 quiz-fill questions, each checked against its target lesson in `samples/colorado-broker-course.json` (rev 9; the n3 lesson bodies there match parts/n3.json as audited).

## Sources used
- 40 CFR 745.101, 745.103, 745.110, 745.113, 745.115 (law.cornell.edu): lead disclosure scope, exemptions, definitions, 10-day evaluation period, record retention, agent duties
- EPA, Lead-Based Paint Disclosure Rule (Section 1018 of Title X): https://www.epa.gov/lead/lead-based-paint-disclosure-rule-section-1018-title-x
- EPA, Health Risk of Radon: https://www.epa.gov/radon/health-risk-radon (No. 1 cause among nonsmokers, No. 2 overall; fix at 4 pCi/L; consider fixing at 2–4)
- 42 U.S.C. 4013(c) (law.cornell.edu): NFIP 30-day waiting period and exceptions
- 42 U.S.C. 4012a(a)–(b) (law.cornell.edu): mandatory purchase for SFHA property with federally regulated lenders, federal agency lenders, and GSE-purchased loans
- C.R.S. 38-35.5-101 (colorado.public.law): psychologically impacted property
- LII Wex "offer": revocation before acceptance, rejection, counteroffer = rejection + new offer
- research/s2-notes.md: C.R.S. 12-10-403(2) transaction-broker presumption (cited in the implied-contract note)
- IRC 3508 statutory nonemployee test (f2-010), as stated in the n4-practice-laws lesson; matches the standard IRS three-part test

## Changes (old → new, source)

### n3.json
1. `property-disclosures-hazards`, lead list: "Include a Lead Warning Statement in or attached to the contract or lease" → "in an attachment to the sales contract (for a lease, in the lease or attached to it)". Source: 40 CFR 745.113(a) requires an attachment for sales, while (b) allows either for leases.
2. Same lesson: buyer may waive the 10-day period → "may waive it **in writing**". Source: 745.110(b).
3. Same lesson, exemptions: "properties certified lead-free" → "leases of units a certified inspector has found free of lead-based paint". Also clarified that the under-six-child exception applies to both zero-bedroom units and elderly/disabled housing, and that short leases qualify only with no renewal **or extension**. Source: 745.101(b)–(c), 745.103 "target housing". Note: EPA's summary page lists "lead-based paint free" housing generally, but the regulation text (745.101(b)) limits that exemption to **leases**. The regulation controls. A seller of a certified lead-free pre-1978 home still owes the sales disclosure.
4. Same lesson, NFIP: the waiting-period exception sentence now adds "(plus a few narrow exceptions, such as a purchase within a year after a flood map revision)". Source: 42 U.S.C. 4013(c)(2)(B)–(C). The old text implied the loan exception was the only one.
5. `n3-c058` back and the "Special flood hazard area" glossary definition: "required with federally backed loans" → "federally backed or federally regulated loans". Source: 42 U.S.C. 4012a(b)(1). Most mandatory-purchase loans come from federally regulated lenders, not federally backed programs. This now matches the lesson and n3-034.
6. `n3-025` (sublease): the old stem had the tenant move out "for the last six months of a two-year lease". That transfers the tenant's **entire remaining term**, which is the textbook test for an **assignment**, yet the key was sublease. So two choices were defensible. Rewrote the stem so the tenant transfers three months mid-lease and plans to return, which makes it clearly a sublease. The explanation now also says why an assignment differs. Choices, answer (D) and id are unchanged.

### f2.json
No changes. All 15 questions have one defensible answer, each explanation matches its key, and each is answerable from its target lesson:
- f2-001 to f2-005 → contract-law-fundamentals / breach-remedies-leases
- f2-006 → property-disclosures-hazards. The 30-day wait with the loan exception is verified at 42 U.S.C. 4013(c). The stem rules out the loan exception, and none of the other exceptions apply.
- f2-007/008 → n4-fiduciary-duties
- f2-009 to f2-011 → n4-practice-laws
- f2-012 to f2-014 → n4-property-management
- f2-015 → g2-technology-safety. UETA §5(b) applies only where the parties agreed, and that agreement can be shown by context and conduct.

## Verified, unchanged (items a reviewer might doubt)
- Lead: pre-1978; 10-day buyer evaluation period, which the parties can change by written agreement or the buyer can waive; tenants get no evaluation period; 3-year retention from sale completion or lease start (745.113(c)); agents must inform sellers and lessors and ensure compliance (745.115). Agents who informed the seller aren't liable for hazards the seller knew of but didn't disclose to them. Foreclosure sales exempt. Elderly housing = reserved for households with someone 62+.
- Radon: 4 pCi/L action level; "consider fixing" at 2–4 pCi/L (n3-029 explanation); No. 2 cause of lung cancer overall, No. 1 among nonsmokers.
- Colorado stigma statute: homicide, other felony, suicide, and HIV/AIDS or other disease highly unlikely to be transmitted through occupancy are not material facts; no cause of action against a broker for not disclosing them.
- SFHA = 1% annual chance, Zones A/V; mandatory purchase applies only where NFIP coverage is available (participating community). The lesson doesn't state that nuance, which is acceptable at exam level.
- Contract doctrine items (revocation before acceptance communicated, counteroffer kills offer, mirror image, minors' contracts voidable by the minor, adjudicated incompetent = void, assignment leaves assignor liable vs. novation releases, option = unilateral until exercised) are standard and consistent with LII.
- Math: n3-022 = $36,000; lesson percentage-lease example = $30,000. Both are correct.
- All [[links]] in n3 resolve to n3's glossary. Answer spread: n3 A9/B9/C8/D8, f2 A4/B5/C3/D3.

## Validation
- Both files parse; n3 kept its original 2-space indent so the diff is limited to the edited strings.
- Ran a copy of `build_course.py` writing to a scratch path (bundled sample not regenerated): 48 lessons, 458 questions, all lesson quizzes at 10, no unresolved glossary links, no duplicate ids.
- `samples/colorado-broker-course.json` still has the pre-audit text until someone reruns `python3 content/build_course.py`.

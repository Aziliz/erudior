# Audit: Colorado contracts/forms content (parts/s3.json, parts/g4.json)

Audited 2026-10-12 against official sources (WebFetch of dre.colorado.gov PDFs/pages, colorado.public.law, LII copy of 4 CCR 725-1 Ch. 7).
Note: the 2026 CREM Ch. 2 PDF as fetched ended inside Rule 6.10(F); the Chapter 7 forms rules were not in it. Rule 7 facts were checked against the LII copy of 4 CCR 725-1 Ch. 7 instead.

## Sources used
- CBS1 2026: https://dre.colorado.gov/sites/dre/files/documents/Contract%20to%20Buy%20and%20Sell%20Real%20Estate%20%28Residential%29%20V2%20%28fillable%29_for%20use%20on%20or%20after%20January%201%2C%202026.pdf
- ERTS 2026, ERTB 2026, SPD 2026, Counterproposal, Closing Instructions 2026, PCO 2026, Licensee Buyout Addendum, Exchange Addendum, LBP (Sales), Promissory Note, Short Sale Addendum (CBS), CBSF1 2026, MHC1 2026, Income-Residential 2026, TON45, Agreement to Revive 2026, Extension or Termination 2026: all from dre.colorado.gov/real-estate-broker-contracts-and-forms
- CREM 2026 Ch. 3 (CP-1, CP-14, CP-15), Ch. 5 (CCIOA)
- 4 CCR 725-1 Ch. 7 (LII): Rules 7.1–7.5
- C.R.S. 38-33.3-316, 38-33.3-117, 38-35.7-102, 6-1-1110, 6-1-1113 (colorado.public.law)
- DRE notice "Refusing to Present Offers to Sellers"

## Megan's Law / sex-offender provision
- Current 2026 CBS1: **no** such provision. Searched every section range (§§ 1–31 and the broker acknowledgments) for "offender", "Megan", "Bureau of Investigation", "law enforcement", "sheriff", "police". No matches. The Van Ed statement is outdated for CBS1.
- It does appear in the 2026 **Exclusive Right to Buy Listing Contract § 31 "MEGAN'S LAW"**: if a registered sex offender's presence concerns the buyer, the buyer must contact local law enforcement for that information. ERTS and SPD have no such provision.
- Action: added one bullet to the Exclusive Right-to-Buy section of lesson `co-listing-disclosures-addenda-financing`, noting the CBS1 has no such paragraph. Nothing was added to the CBS1 lessons.

## Changes (old → new, source)

### s3.json
1. `co-forms-commission-approved` (builder/REO contracts): "the broker should advise the client in writing" → "Commission rules require the broker to advise the client in writing to get legal advice from an attorney". Source: Rule 7.5. It is a requirement, not advice.
2. `co-forms-commission-approved` (broker as party): "the broker still uses a Commission-approved form when one exists" → a broker selling through their firm must use approved forms when appropriate (outside the firm may use other forms); a guaranteed buy-out requires the Licensee Buy-Out Addendum; written disclosure of license status. Source: CREM Ch. 3 CP-1, CP-14. The old wording overstated the rule for a broker selling outside the firm.
3. `co-forms-commission-approved` (2027 forms): "In August 2026 the Commission adopted another round of revisions" → "The Division has already posted another round of revisions". Source: the forms page gives no adoption date for the 2027 set, so the August date could not be verified.
4. `co-cbs1-part2` (seller disclosures): **added** a radon bullet. CBS1 § 10.13 Radon Disclosure is a CDPHE advisory that strongly recommends a radon test, and the seller must provide known radon test results. This was an omission.
5. `co-counterproposals-amend-notices` (notice table): Title-Related Objection Notice purpose "Objects to title, survey or association matters" → "record title, off-record title, ILC/survey or due diligence document matters". Source: TON45. The form doesn't cover association documents; under CBS1 § 7.4 those are handled by termination only.
6. `co-counterproposals-amend-notices` (multiple offers): "can't refuse an offer because … different contract software or works under a different compensation model" → software is stated as improper; the compensation-model issue is described as reports the Division flagged. Source: DRE notice. The Division states the software point as a rule but only raises the compensation-model concern.
7. `co-listing-disclosures-addenda-financing` (ERTB): added the Megan's Law bullet (see above). Source: ERTB 2026 § 31.
8. `co-listing-disclosures-addenda-financing` (Closing Instructions): "documents and money go back" → "the closing company may return documents and money". Source: Closing Instructions § 10. The return is permissive.
9. `co-listing-disclosures-addenda-financing` (seller financing): added the CBS1 § 4.7 warning. Lending laws can apply to sellers and private lenders. Unless exempt, the financing documents should be prepared by a Colorado attorney or licensed MLO, and brokers should not prepare or advise on financing specifics, including exemption. This is an important omission for the practice-of-law topic.
10. `s3-026` explanation: "the party entitled to sign … must do so" (wrong) → the seller signs within 3 days when the buyer is entitled, and vice versa. Source: CBS1 § 4.3.2. The answer was unchanged.
11. `s3-037` explanation: added the § 4.7 attorney/MLO warning. The answer was unchanged.
12. `s3-c007` back: "nonbinding" → "nonbinding and creates no legal rights or obligations, plus a not-Commission-approved disclaimer". Source: Rule 7.1.H.

### g4.json
13. `g4-other-contracts-addenda`: "A ranch sale goes on the Land contract … or to an attorney" → "typically uses the Land contract … If it doesn't fit, talk to your managing broker or an attorney". The Commission doesn't prescribe the Land form for ranches, so this was softened.
14. `g4-other-contracts-addenda` (Licensee Buy-Out): added that CP-14 requires the property to keep being marketed as **active** in the MLS and other advertising. Source: CREM Ch. 3 CP-14.
15. `g4-hoa-ccioa`: removed "Generally there is no statutory cap on dues increases unless the governing documents create one". No source was found, and per SPEC an unverifiable claim is left out.
16. `g4-hoa-ccioa`: added the 14-calendar-day statement of unpaid assessments under 38-33.3-316(8). It is requested in writing (personal delivery or certified mail to the registered agent). The statement is binding, and if none is furnished, there is no lien for amounts due as of the request date. Source: C.R.S. 38-33.3-316(8), now verified on primary text. The earlier g4 notes had left this out as unverified.
17. `g4-hoa-ccioa` (38-35.7-102 defense): "if the buyer already knew" → "if the buyer had actual or constructive knowledge". Source: statute.
18. `g4-c003` back: same softening as item 13.

No questions were added or deleted. All ids, answer indices and choices are unchanged.

## Confirmed items a human might doubt
- Weekend/holiday deadline is **not** extended if neither box is checked (CBS1 § 3.3.3).
- Time of Day Deadline applies only to Objection, Resolution, Examination and Termination deadlines (§ 3.3.1).
- If no title box is checked, the seller selects the title company and pays for the owner's policy (§ 8.1.1).
- If no deed is selected, a special warranty deed is delivered (§ 13).
- Liquidated damages are the default for buyer default. Specific performance applies only if the § 20.1.1 box is checked.
- Inspection Termination right is lost once an Inspection Objection is delivered (§ 10.3.1). An unresolved objection terminates the contract at the Inspection Resolution Deadline unless the buyer withdraws it (§ 10.3.3).
- Damage threshold for buyer termination is 10% of the purchase price (§ 18.1).
- Status letter is requested at least 14 days before closing, and the seller pays its fee (§ 15.3).
- Seller's continuing disclosure duty: buyer may terminate by the earlier of Closing or 5 days after the new disclosure (§ 10.2).
- Mediation: costs are shared equally, mediators can't impose binding decisions, and the duty ends 30 days after the written request (§ 22). EM dispute: 120 days (§ 23).
- Notice after Closing must reach the party, not the broker. For electronic notice, notices after cancellation or termination must also reach the party (§ 26.1/26.2).
- Late association documents: 10 days after receipt. If they are never received, or the date would fall after closing, the notice is due by Closing (§ 7.4).
- New Loan Availability can't be used for loan terms, appraisal, lender property requirements, insurability or conditional sale. Missing the deadline makes the EM nonrefundable unless the seller is in default (§ 5.2.2).
- Tax proration exemption adjustments (seniors, disabled veteran) are in § 16.1.1.
- Counterproposal: "the Contract is not to be signed by the party initiating this Counterproposal". It supersedes prior counterproposals.
- ERTS: transaction-broker is the default; holdover unchecked = not owed; offers-existence unchecked = no consent; offers must be presented while under contract (§ 5.1.2).
- ERTB: transaction-broker is the default; the buyer pays the unpaid portion only if disclosed in writing before contracting (§ 7.3.1); competing buyers may be shown the same property (§ 5.3); the buyer refers inquiries to the broker (§ 9).
- Rule 7.3.B: attorney-drafted clauses are kept 4 years from last use. Rule 7.2: struck text stays legible; inapplicable sections are marked "omitted-not applicable".
- CFPA: earlier of midnight of the 3rd business day or noon the day before the sale (6-1-1113). The translation requirement (CBSF1 § 11.2, HWN) is confirmed, and changing the § 11.1 conditions voids the contract.
- Short sale: seller has 3 days and buyer has 3 days after acceptance. Deadline changes go through Amend/Extend.
- Licensee Buy-Out deletes § 6.2 appraisal, § 20.1.2 liquidated damages and § 20.2 seller default.
- PCO: 60 days maximum, deposit no more than 2 months' rent returned within 30 days, 24-hour access notice, seller may end early on 5 days' notice.
- Exchange Addendum doesn't alter dates, and the exchange is not a condition.
- MHC1: certificate of title plus Authentication of Paid Ad Valorem Taxes to DOR, lot owner approval, lot owner status letter at least 14 days before closing.
- CCIOA: lien priority exceptions, 6-month super-priority, foreclosure requires a balance of at least 6 months plus a recorded board vote, 6-year enforcement limit, recording the declaration perfects the lien, § 316 applies to pre-1992 communities via § 117(1)(k), non-waiver (§ 104), registration suspension, CAM licensing ended June 30, 2019, HOA Center sunset Sept 1, 2030.
- Income-Residential contract has a 1–4 units / larger checkbox, tenant estoppels (§ 11), rent roll (checkbox), Phase I and ADA.
- No farm & ranch contract and no pre-closing occupancy form appear on the forms page.

## Unverifiable / not re-checked
- Conway-Bogue specifics (no separate fee, only in own transactions). Taken from the 2007 CREM summary in s3-notes. The 2026 CREM chapter containing it wasn't fetched.
- ERTS "exclusive and irrevocable" wording and lease-commission terms were not re-checked in this pass. The other ERTS items were verified.
- Counterproposal "Acceptance" mechanics are verified. The Amend/Extend form text was not re-fetched; it relies on s3-notes.
- 2026 Promissory Note: the form on the page is NTD81-10-06 titled "Promissory Note". The lesson calls it "a Promissory Note for Deed of Trust", which matches the forms-page link label, so it was left as is.
- Exclusive Right-to-Lease, Brokerage Duties Addendum, Assignment of Lease and MHA2 details come from g4-notes and were not re-fetched.
- 38-33.3-316 says fines, fees and similar charges are "not subject to a foreclosure action". The lesson's wording "can't by themselves be the basis" is consistent with that, but slightly softer.

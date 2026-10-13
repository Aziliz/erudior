# Audit: national agency, fair housing, practice and property management

Scope: parts/n4.json (5 lessons, 39 questions, 55 cards, 59 glossary terms), parts/g2.json (2 lessons, 20 questions, 30 cards, 32 terms), refs/06-federal.md, refs/01-exam.md. Audited 2026-10-13. No questions were added or deleted, and all ids are unchanged.

## Sources checked
- PSI, Colorado Real Estate Broker candidate information bulletin, test-takers.psiexams.com/api/content/bulletin/2598 ("Updated 10/1/2023", the current posted version).
- 47 CFR 64.1200 (eCFR): (c)(1) hours, (c)(2) 31-day safe harbor, (d)(3) 10 business days, (d)(6) 5 years, (f)(5) EBR 18 months / 3 months, (a)(2) prior express written consent.
- FTC, CAN-SPAM Act compliance guide for business.
- ADA Title III Technical Assistance Manual (ada.gov), III-1.2000 and III-4.4200.
- HUD/FHEO withdrawal notice, FR Doc. 2026-06624 (published Apr. 6, 2026; withdrawal effective Sept. 17, 2025). It lists 8 documents, including the 2024 digital-platforms ad guidance and the Feb. 11, 2021 EO 13988 memo.
- justice.gov/atr "Antitrust Laws and You": price fixing, bid rigging and market allocation are criminal.
- Earlier research notes for Colorado cross-references: s2-notes (12-10-406 dual agency ban, designated brokerage), s1/g5 notes (12-10-217(1)(t) secret compensation), audit-license (net listings).
- The following were checked from settled federal text (42 USC 3602-3613, 24 CFR 100): FHA classes and amendment years (1974 sex, 1988 disability and familial status), exemptions (3-home and 24-month single-family rule, Mrs. Murphy, religious, private club, 55+/62+ with 80%), familial status definition, 1-year HUD and 2-year suit deadlines, March 13, 1991 design-and-construction date, the modification restoration rule, and 24 CFR 100.75 on ad media. Also checked: 26 USC 3508 (the three statutory-nonemployee tests) and the E-SIGN 15 USC 7003 exceptions and 7001(c) consent.

## PSI bulletin and exam numbers
Every number matches SPEC.md, build_course.py and 01-exam.md: national 80 questions, 120 minutes, 60 to pass; state 74 questions, 110 minutes, 53 to pass. The national weights match (Property Ownership 10, Land Use 5, Valuation 8, Financing 9, Contracts 19, Agency 13, Disclosures 7, Property Management 5, Transfer 6, Practice 12, Calculations 6), and so do the state item counts (2/5/11/7/23/5/10/11). build_course.py's sectionPassing of 75 and 71.6 equals 60/80 and 53/74.

## Changes

| File / id | Was | Now | Why |
|---|---|---|---|
| 01-exam.md | "a handful of unscored pretest questions" | 5 to 10 unscored "experimental" questions that count against time | Bulletin wording |
| 01-exam.md | "passing score good for one year; one year after passing to apply" | Can retake only the failed portion; a passing portion score is accepted for no more than 1 year; apply within 1 year of passing the whole exam or retake both | Bulletin wording |
| 01-exam.md | "250-question bank"; "timer is the combined 230 minutes" | "the question bank"; separate 120- and 110-minute timers | The bank has 458 questions. build_course.py sets sectionTimeLimits, and session.ts runs split timers |
| 01-exam.md | Source line | Names the bulletin and its 10/1/2023 date | Traceability |
| 06-federal.md | DNC row | Adds called party's local time, 10-business-day / 5-year rule for do-not-call requests | 47 CFR 64.1200(c)(1), (d)(3), (d)(6) |
| 06-federal.md | CAN-SPAM row | Adds identify-as-ad and 30-day opt-out operation; "valid physical postal address" | FTC guide |
| 06-federal.md | Antitrust row "never discuss commission rates with other firms" | "never agree on (or even discuss) rates with competing firms" | Precision: the violation is an agreement among competitors. Cooperating-broker splits are discussed lawfully |
| n4-fair-housing | ADA covers "model homes open to the public" | Covers the sales office in a model home; DOJ says the model home itself generally isn't covered | ADA TA Manual III-1.2000 |
| n4-fair-housing | Modification "done professionally" | "in a workmanlike manner (with any needed permits)" | 24 CFR 100.203(b) wording |
| n4-fair-housing | Tip: "No exemption allows a discriminatory ad" | States that the single-family and Mrs. Murphy exemptions never cover discriminatory ads | Accurate for 3603(b) exemptions and what PSI tests. The blanket form overstated it: 55+ housing may lawfully advertise as such |
| n4-practice-laws | EBR "18 months (540 days) … 3 months (90 days)" | Day counts removed | The FCC rule states months only. The day equivalents come from the FTC TSR and aren't needed |
| n4-practice-laws | IC table: firm "can't set hours or require floor time" | Firm generally controls results, not methods; tax status turns on the 26 USC 3508 tests, not control | The original was an overstatement. Statutory nonemployee status doesn't depend on control |
| n4-015 explanation | Undisclosed dual agency can "void the contract" | "make the contract voidable (rescission)" | Matches the lesson ("rescission") |
| n4 glossary | Fair Housing Act alias "FHA" | Removed (kept "Title VIII") | Collides with n2's "FHA loan" alias. Merged glossary lookups for "FHA" were ambiguous |
| n4 glossary | Misrepresentation alias "Fraud" | Removed | n3 defines "Fraud" as its own term, and n3 links [[Fraud]]. The alias collided |
| n4 glossary | Principal alias "Client" | Removed | s2 defines "Client" as its own (Colorado) term. Unused alias collided |

## Verified, no change
- All 59 questions have one defensible key, and every explanation matches its key. g2 math checked: g2-001 $40,000; g2-002 $600,000; g2-003 $5,750/mo; card g2-c006 $30,000; lesson examples $45,000 and $62,500.
- Familial status, 55+ (80%) and 62+ rules; single-family exemption (3 homes, no broker, no discriminatory ad, 1 non-occupant sale in 24 months); Mrs. Murphy (up to 4 units, owner-occupied).
- HUD complaint 1 year; suit 2 years (HUD proceeding time excluded); 1866 Act and Jones v. Mayer (1968).
- 2021 HUD SOGI memo (EO 13988) withdrawn effective Sept. 17, 2025. The lesson's framing is correct. Note: PSI's outline still lists "Protections against discrimination based on gender identity and sexual orientation" under Practice of Real Estate. The lesson already says that federal law lists 7 classes and that Colorado expressly protects these.
- TCPA: texts are calls; telemarketing robocalls need prior express written consent.
- CAN-SPAM details; the sender remains liable when outsourcing.
- E-SIGN exceptions and consumer consent; UETA 1999 (Colorado adopted).
- IDX attribution, seller opt-out, no alteration; MLS is private. Rules are described as "typical", which is appropriate.
- Colorado cross-references in n4: dual agency banned even with consent (12-10-406); transaction-broker presumption; designated brokerage doesn't create dual agency; 12-10-217(1)(t) secret compensation; no approved net-listing form.
- g2 prior appropriation in Colorado; oil and gas terms; ground lease; LOI; bulk sales (UCC Art. 6 largely repealed).

## For a reviewer
- n4-practice-laws says "A licensee can only be paid by their own employing broker". That is true in Colorado and most states. It's left as is.
- n4-agency-fundamentals says that, since 2024, NAR-affiliated MLS participants need a written buyer agreement before touring. That matches the NAR settlement practice change. It could change if NAR rules change again.
- PSI's outline also lists "disparate treatment" under prohibited conduct. n4 doesn't name the term explicitly. No questions were added, per scope.

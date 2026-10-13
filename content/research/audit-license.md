# Audit: s1.json, g5.json, f3.json (license law, Commission rules, position statements) vs 2026 CREM

Audited 2026-10-12. Sources: 2026 Colorado Real Estate Manual (accurate as of Jan 1, 2026) Ch 1 (C.R.S. Title 12 Art. 10), Ch 2 (Commission Rules, 4 CCR 725-1), Ch 3 (Commission Positions), read with WebFetch from dre.colorado.gov. Direct download of the PDFs was blocked (proxy 403).

**Coverage limits.** WebFetch returns only about 116K characters of each chapter:
- Ch 1 ends partway through Part 4 (12-10-402). 12-10-404, 407, 409 and 709 were checked on colorado.public.law; 12-10-709 also in CREM Ch 8.
- Ch 2 ends partway through Rule 6.10.F. Rules 6.10.F–6.26 were checked against the LII copy of 4 CCR 725-1 ch. 6 (LII shows chapter effective 3/30/2024). Rule 7.1 (forms) was checked on LII ch. 7.
- Ch 3 ends partway through CP-23. CP-23 and CP-28 were read from the standalone DRE PDFs.

## Changes made (all ids kept; no questions added or deleted)

| # | Location | Old | New | Source |
|---|---|---|---|---|
| 1 | s1 lesson `co-keeping-your-license`, renewal | "Renewal opens before expiration" | "Renewal opens 45 days before expiration" | Ch 2 Rule 3.11.B.3.a |
| 2 | s1 lesson `co-keeping-your-license`, CE (added) | none | Limits on the 24-hour Broker Reactivation course: an Active broker can't use it in back-to-back cycles; an inactive or expired broker can use it only if off Active status for no more than 36 months in total. | Ch 2 Rule 4.2.A.3, 4.2.B; DRE CE page ("once every other license cycle") |
| 3 | s1 lesson `co-keeping-your-license`, notifications | 30-day notice list: conviction/plea, fair housing violation, discipline elsewhere | Added the fourth trigger: a suspension or revocation in the last 5 years (Colorado or elsewhere) for fraud, deceit, material misrepresentation, theft, or breach of fiduciary duty. | Rule 6.23 |
| 4 | s1 lesson `co-advertising-supervision-compensation`, referral fees | Non-RESPA referral compensation "must be disclosed in writing to the person referred before the referral" | A broker who accepts compensation for referring a provider must disclose it in writing to the person referred "at the time of the referral". | Rule 6.21.B.2 ("at the time of making such referral") |
| 5 | g5 lesson `g5-commission-rules-in-practice`, "When a brokerage relationship ends" | Surviving duties stated for every broker: account for money, and keep confidential information confidential | Every broker must still account for money/property; only a single agent (seller's or buyer's agent) also keeps confidential the info the client asked to keep confidential (with the written-consent / required-by-law / public exceptions). A transaction-broker's only surviving duty is accounting. Quick-review bullet added. | C.R.S. 12-10-409(2)(b), (3) |
| 6 | Question `g5-011` stem + explanation | "A listing expired..." (relationship type unstated, but the keyed answer is confidentiality) | Stem now says "A seller's agent's listing expired..."; explanation says single agency, and notes a transaction-broker owes only the accounting. Answer unchanged (index 0). | 12-10-409(2)(b)(II), (3) |
| 7 | Card `g5-c017` | "Account for money/property; keep confidential information confidential..." | "Every broker: account for money/property. Single agents also keep ... confidential ... Transaction-brokers: accounting only." | 12-10-409 |
| 8 | Question `f3-022` explanation | "After closing, the Commission doesn't require you to keep copies of loan applications, title commitments..." | A broker isn't required to obtain and keep copies of loan applications, title commitments, public records, lender-required disclosures, or related affirmations from an independent closing entity after closing. Answer unchanged (index 0). | Rule 6.20 (the exemption is about copies from third-party closing entities, not a blanket "don't keep") |

## Confirmed items a reviewer might doubt

Commission and Division
- 5 members, governor appoints; 3 brokers with 5+ years' Colorado experience (one with substantial property management experience) + 2 public; 3-year terms; governor removes for misconduct, neglect of duty, or incompetence. 12-10-206.
- No license denied, suspended, or revoked except by majority vote. 12-10-206(4).
- Fine up to $2,500 per separate offense; letter of admonition by certified mail, licensee may request formal proceedings in writing within 20 days after proven receipt; revoked = no application considered for 1 year; complaints and investigations closed, stipulations and final agency orders public; firm's right to operate can be suspended/revoked whether or not the designated broker knew. 12-10-217.
- ALJ conducts hearings; review by the Court of Appeals; court may stay an order only after a hearing on whether the stay endangers public health, safety and welfare (and sets a bond). 12-10-219.
- Subpoena power: Commission, director, or ALJ. 12-10-224 (the lesson doesn't cite a section).
- Employer disciplined for an employee's act only with actual knowledge or negligent supervision. 12-10-222.
- Unlicensed brokerage = class 2 misdemeanor. 12-10-223. Injunctions: 12-10-226.
- Position statements are "not law", "non-binding direction", best practices. Ch 3 intro.

Licensing
- Age 18; 168 hours (48 law & practice, 48 Colorado contracts, 72 = trust accounts 8, current legal issues 8, closings 24, practical applications 32) or a real-estate degree; fingerprints to CBI before applying. 12-10-203; Rule 2.1.A.2.
- Passing score valid 1 year. 12-10-212; Rule 2.2.F.
- Independent: 2 years Active as an Associate Broker (Rule 2.5.B). Employing: 2 years Active within the prior 5 years + 50 experience points + 24-hour Brokerage Administration (Rule 2.5.C.3; 12-10-203(5)(c)(II)).
- High-level supervision elements, incl. closings attended by the employing broker or an associate with more than 2 years' Active licensure. Rule 6.3.D.
- Reasonable supervision = signed office policy manual, review of all executed contracts and all transaction files. Rule 6.3.C. Delegation in writing; employing broker still ultimately responsible. Rule 6.3.F.
- Temporary license up to 90 days + one 90-day extension for good cause. 12-10-203(6)(c).
- Issued Inactive if E&O or employing broker isn't provided within 30 days of notice (Rule 3.6.E); initial license expires Dec 31 of the year issued (Rule 3.6.C); calendar 3-year cycle (Rule 3.11.B.1); firms don't renew separately (Rule 3.11.A).
- Colorado place of business for resident independent/employing brokers; associates and inactive brokers exempt. Rule 3.10.
- Exemptions: unpaid attorney-in-fact; salaried on-site apartment/condo manager (customary duties; no unit-count limit); out-of-state broker sharing a commission on a cooperative transaction; corporation through officers/employees (75% salary condition). 12-10-201(6)(b).

Renewal, CE, E&O
- Reinstatement fees (31 days / 1 year / 3 years). 12-10-212; Rule 3.15.
- CE: 24 hours, 12 from the Annual Commission Update in annual 4-hour increments + 12 elective; can't retake the same version; no CE for the first (Dec 31) period; keep proof 4 years. 12-10-213(4); Rules 4.1, 4.2.A.1, 4.5.J.
- "A missed update can't be made up": not stated in rule text; it's on the DRE CE page ("Once the course year has passed, that version cannot be made up"). Kept.
- Alternatives: Reactivation course / pass state exam / 72 hours (48 contracts + 24 closings). Rule 4.2. More than 36 months inactive: state exam or 72 hours only.
- Inactive brokers renew and pay fees (Rule 3.12.C); may be paid by a former employing broker for commissions earned while employed (Rule 3.12.D, 3.14.B).
- Employing broker's license suspended, revoked, or expired: employees' licenses automatically inactive. 12-10-212(5).
- Change of location/employment: immediate notice, or the license is automatically inactivated; on termination, joint duty, and the party giving notice tells the other in person or in writing. 12-10-211.
- E&O (Rule 3.9): every Active broker and firms with more than one broker; $100k per claim, $300k aggregate, defense outside limits, deductible max $1,000 (none on defense), lockbox $25k, 365-day extended reporting; firm's own policy $1M/$1M, deductible max $10k; group carrier can cancel only for nonpayment, inactive/revoked, or denied application; lapse or failure to certify = Inactive immediately. Attorney exemption: 12-10-204.

Conduct, advertising, compensation
- Advertising (Rule 6.10): firm name clear and conspicuous (own unlisted property exempt); one trade name, filed; franchise "independently owned and operated" statement; team name banned words incl. Realtors, Corp., LP/LLP; team ads include firm name; team member names on request; no outside-firm use of team name; firm name on every viewable page; "first click" when space is limited; expired listings off within 3 days plus written request to syndicators; others' listings need the listing broker's written permission and disclosure of that firm; advertised price = agreed price; past-sales data cites source with "not necessarily listed or sold by the Broker" disclaimer; designations only in good standing and verifiable.
- Team definition: 2+ brokers in the same firm cooperating on an ongoing basis. Rule 1.52.
- Employed broker paid only by employing broker. 12-10-221. Firm may pay a broker's wholly owned entity. CP-8.
- Out-of-state referral conditions. Rule 6.21.C. RESPA kickback ban. Rule 6.21.B.1. Affiliated business disclosures and reporting to the Commission. Rule 6.18.
- Rebates: written terms; buyer rebate disclosed to and approved by the lender, on the settlement statement, never outside closing. CP-4.
- Itemize separately charged closing costs and get written consent; no separate fee for legal documents. Rule 6.14.B.
- No lien/lis pendens/clouding title for a residential commission without a judgment (commercial lease lien exception). Rule 6.22.
- Own-account deals: license disclosed in the contract or a concurrent writing. Rule 6.17.B. Buying own listing: CP-14 four steps. Team member buying team listing: CP-14 (consent, removal, firewall). Guaranteed buy-out addendum: CP-14.
- Conflicts: continuing written disclosure (Rule 6.17.A); vendor interests (6.17.C); CP-22 examples incl. 20%+ ownership, early disclosure/opt-out for PM vendors, fees for non-settlement referrals.
- Copies at time of preparation; listings in writing before services; definite termination date; holdover limited to names submitted in writing during the term; no advice on title exceptions. Rule 6.14. Offers to listing broker → employing broker → directly. Rule 6.13. Sign crossing. Rule 6.15. Closing statement signed by the broker. Rule 6.19.
- Must use a Commission-approved form when one exists and fits; advise that forms have legal consequences and to consult counsel. Rule 7.1.
- Minimum services can't be waived "in writing or otherwise"; added duties in writing; Commission doesn't regulate fees. CP-28.
- CP-23: no Commission-approved form; use a Colorado attorney; each party should get separate counsel.
- Promissory note as earnest money. Rule 5.13. Earnest money 3 business days after receipt or mutual execution, whichever is later; PM funds 5 business days. Rule 5.7.
- Money belonging to others in non-brokerage activities goes in a trust account; office policy manual first; otherwise the broker's own account with a journal and monthly two-way reconciliation. Rule 5.11. (12-10-217(1)(h) "whether acting as real estate brokers or otherwise".)
- Commingling bank-charge exception, recorded. Rule 5.14.D. Monthly three-way reconciliation. Rule 5.14.C.
- 6.25 respond in writing; failure is grounds; extensions on reasonable request. 6.26 7-day consumer notices and 30-day disbursements. 6.24 records producible to Commission or any principal party.
- Transaction-broker and seller's agent both have a statutory duty to present offers in a timely manner (12-10-404(1)(c)(II), 407(2)(b)(I)), supporting g5-003.
- MLO: seller financing of no more than 3 properties in 12 months (12-10-709(1)(a)(I)); broker representing such a seller exempt (709(1)(j)); "real estate brokerage activity" excludes negotiating financing matters (12-10-702(20)(c)).

## Not verified / notes for reviewers

- **Net listings (s1 lesson, s1-c057, f3-016):** the 2026 CREM (statute, rules, CPs as retrievable) says nothing about net listings. The content rests on the 2007 manual (see s1-notes.md). The "secret compensation" ground (12-10-217(1)(t)) and absence of an approved form are consistent. Left as is.
- **Conway-Bogue:** not in the retrievable CREM text. Rule 7.1 and 6.14.B support the rule-based parts.
- **"Character ... and competence" (s1 lesson):** 12-10-203(3) lists truthfulness, honesty, and good moral character; competency comes from 12-10-202. Left as is.
- **Inactive brokers don't need CE while inactive:** implied (Rule 4.1.A lists renewing Active, activating, reinstating; 12-10-212(4)(a)(II)), not stated outright.
- **f3-019 ("technical problem is not an excuse") and f3-024 (broker stays responsible for files after transferring) and f3-025 (emails/texts recommended, not required):** these come from the DRE transaction-file web page, not the CREM rules. Rule 6.24 is consistent (records must stay retrievable).
- **Rental-lease license disclosure (g5 lesson):** from a DRE Spring 2023 newsletter clarification; CP-15 is consistent (disclose license and conflicts when managing your own rental).
- **CP-29 repealed Aug 4, 2026** (DRE position-statement page and the CP-29 PDF). No g5 text cites CP-29 by name. Its substance is still in Rule 5.11, so no change was needed. Remove any "CP-29" references elsewhere.
- **Rules after the CREM date:** 4 CCR 725-1 has a version effective 01/30/2026 (adopted Dec 2, 2025). Per the notice of hearing, it added a "Client" definition, a new Rule 6.27 (informed consent before disclosing confidential client information), expanded Rule 6.17 (employing broker supervising both sides), and CE provider rules. The DRE Education Provider Bulletin 2026-02 says that starting in **2027** the Annual Commission Update must be completed by **June 30** each year. None of this is in the Jan 1, 2026 CREM text I could read, so nothing was changed. Consider a later pass.
- **CP-31 marked REPEALED** on the DRE page.

## Errors noticed in other files (not edited)

- `content/refs/03-co-numbers.md`: Pre-license course named "Contracts and Regulations 48"; the rule title is "Colorado Real Estate Contracts" (minor). The CE row omits the limits on the Broker Reactivation course (once every other cycle; ≤36 months inactive/expired). Otherwise the license, E&O, Commission, and money rows match the CREM.
- No other errors were found in the files sampled for these topics (s2.json's surviving-duties text is already correct for single agents).

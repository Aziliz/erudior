# Audit: s2.json (brokerage relationships, trust accounts, records) vs 2026 CREM

Audited 2026-10-12. Sources: 2026 CREM Ch 1 (C.R.S. Title 12 Art. 10), Ch 2 (Commission Rules, 4 CCR 725-1), Ch 3 (Commission Positions), fetched from dre.colorado.gov with WebFetch. Direct download of the PDFs was blocked (proxy 403).

**Coverage limits.** WebFetch returns only about 116K characters of each chapter:
- Ch 2 ends partway through Rule 6.10, so Rules 6.11–6.25 (contracts and holdover, conflicts, closing, transaction files, electronic records, audits) were checked against the LII copy of 4 CCR 725-1 ch. 6.
- Ch 1 ends partway through 12-10-407(2)(b)(VII). The rest of 12-10-407 and all of 408–410 were checked on colorado.public.law.
- Ch 3: the CP-27 text was taken from the standalone DRE Commission Position 27 PDF (recodified 2022). The text of CP-31 could not be retrieved.

## Changes made (all ids kept; no questions added or deleted)

| # | Location | Old | New | Source |
|---|---|---|---|---|
| 1 | Lesson `co-trust-accounts`, interest-bearing accounts | "interest belongs to the person whose money it is unless a written agreement says otherwise" | Absent a specific written agreement, interest does **not** belong to the brokerage firm. The contract should say which party gets interest on earnest money; the management agreement and lease should cover rents and security deposits. | Ch 3 CP-5. The CP says only that interest isn't the firm's; it doesn't award it to "the owner." |
| 2 | Card `s2-c044` | "Interest on trust funds belongs to… / The owner of the funds, unless a written agreement says otherwise." | "Interest on trust funds: who gets it? / Not the brokerage firm, absent a specific written agreement. The contract, management agreement or lease should say which party gets it." | Ch 3 CP-5 |
| 3 | Lesson `co-trust-accounts`, release of EM | "A release that holds the brokerage harmless or waives its liability may not be required." (ambiguous: reads like "might not be needed") | The firm may not demand a hold-harmless or liability-waiver release, because the rules prohibit exculpatory terms. | Ch 3 CP-6 |
| 4 | Question `s2-023` explanation | "The only firm money allowed in the account is bank-charge funds and labeled advances" | Firm money is allowed only in narrow cases, such as bank-charge funds or a recorded advance, and a "cushion" isn't one of them. The answer is unchanged (index 1). | Ch 2 Rules 5.10.A–E, 5.14.D. 5.10.D/E also let rental proceeds from licensees' own properties go into trust accounts, so "only" was too absolute. |
| 5 | Lesson `co-brokerage-relationships`, summary table | Transaction-broker row, "Written agreement needed?": "No, but a written disclosure is required" | Not needed to create the relationship (it's presumed), but a written disclosure is required, and any seller or landlord listing must be in writing. | Ch 2 Rule 6.14 (listing in writing regardless of relationship); CP-17 |
| 6 | Lesson `co-brokerage-relationships`, change of status (added) | none | When the transaction ends, the relationship automatically reverts to the one designated in the listing contract. | Ch 3 CP-17 |
| 7 | Lesson `co-brokerage-relationships`, designated brokerage (added) | none | It is a conflict of interest when an employing broker supervises designated brokers on both sides and confidential client information reaches the employing broker (or the employing broker represents one side). There is a continuing duty to disclose known conflicts in writing. | Ch 3 CP-22; Rule 6.17 |
| 8 | Lesson `co-broker-duties-and-engagement-contracts`, listing contracts (added) | none | If a seller or landlord refuses to sign a listing contract, the broker may not perform brokerage services. | Ch 3 CP-17 |
| 9 | Same lesson (added) | none | Short passage on C.R.S. 12-10-403.5, residential broker engagement contracts: no running with the land or binding future owners; no assignment without notice and the owner's agreement; no lien, encumbrance or recordable interest (void); offering such a term is a deceptive trade practice; property management agreements exempt. | Ch 1, 12-10-403.5 (SB 23-077, contracts on or after Aug 7, 2023) |

## Confirmed items a reviewer might doubt

- **Transaction-broker presumption (12-10-403(2))** and **dual agency prohibited even with consent (12-10-406):** confirmed. The statute says "A broker shall not establish dual agency…"
- **Limited agent:** confirmed. 12-10-404(1) and 405(1) call single agents "limited agents."
- **No subagents:** confirmed for single agents (404(5), 405(6)) and transaction-brokers (407(8)).
- **Designated brokerage, 403(6):** confirmed.
  - The relationship doesn't extend to the employing broker, other brokers or the firm.
  - Opposite-side designated single agents are not dual agency.
  - One broker may be a transaction-broker for both sides, or a single agent for one side with the other as a customer, but not a single agent for both.
  - There is no imputation to non-designated brokers.
- **Team members:** all must be designated in the same capacity and named in the listing contract (Rule 6.6.B). Confirmed.
- **No imputation for transaction-brokers:** knowledge isn't imputed between a party and the broker or among people in the entity (407(7)). Confirmed.
- **Confidentiality consent:** a transaction-broker needs the informed consent of **all parties** (407(3)). Confirmed.
- **Buyer's agent duty to the seller:** includes the buyer's financial ability to perform and intent to occupy as a principal residence (405(3)). Confirmed.
- **No duty to inspect or verify:** 404(3)(b), 405(5), 407(4). Confirmed.
- **Disclosure timing (Rule 6.5.A):** "prior to eliciting or discussing confidential information." The small-talk exclusion is in 6.5.B. Confirmed.
- **Disclosure acknowledgment:** it is not a contract, and a refusal to sign is noted on a copy that the broker keeps (408(2)(a)(II), (c)(II)). The DRE page adds the date and keeping the delivery email.
- **Definitions of Working Relationships:** required only when a party asks about a relationship the firm doesn't offer (408(1)(c)). Its definitions section is "not a disclosure" (DRE brokerage-disclosure page; the form isn't mentioned in the CREM rules text).
- **Same broker on both sides:** one forbidden combination and three permitted ones (Rule 6.7). Confirmed.
- **Ministerial tasks:** the list in Rule 6.8 is confirmed.
- **Change of Status:** given to the consumer whose relationship changes, no later than when that consumer signs the contract (Rule 6.9). Confirmed.
- **Duration (409(1)):** the relationship ends at the earliest of expiration, termination or one year after engagement. Confirmed.
- **After termination (409(2), (3)):** the single agent still owes accounting and confidentiality. The transaction-broker owes accounting only. Confirmed.
- **Compensation (410(2), (5)–(7)):** payment alone doesn't create agency; the buyer's written approval is needed before proposing a split of the seller's compensation; the payer must be disclosed before signing; payment by more than one party requires prior written consent. Confirmed.
- **Psychologically impacted property (C.R.S. 38-35.5-101 via 404(2) and CP-27):** confirmed. The owner's agent may not disclose without informed consent, and the Commission encourages seeking consent.
- **Holdover clause:** limited to names submitted in writing during the term (Rule 6.14). A definite termination date is required. Confirmed.
- **Deposit deadlines:** 3 business days for earnest money and other money, 5 for property management, each from receipt or mutual execution, whichever is **later** (Rule 5.7.A/B). The s2-019 calculation (Tuesday receipt → Friday) is consistent.
- **Property management accounts:** at least one account for rents and at least one for security deposits (Rule 5.5). Confirmed.
- **Account setup:** zero accounts is allowed (5.4); the account is in the entity's name (5.3); the employing broker keeps responsibility even when others are authorized signers (5.3.C). Confirmed.
- **Recognized depository:** must be insured by the FDIC or NCUA (Rule 1 definition). "In this state" comes from the statute, 12-10-217(1)(i). Confirmed.
- **Commingling rules:** earned money withdrawn monthly (5.10.A); fees earned only after services are complete with no right of recall, absent a written agreement (5.10.C); bank-charge funds allowed (5.14.D). Confirmed.
- **Earnest money handling:** dated, signed receipt (5.12). Promissory note: tell the seller the due date, and if it goes unpaid, notify the seller promptly and deliver the original note (5.13). Confirmed.
- **Security deposit transfers:** 30-day disclosure and 60-day transfer (5.8). Owner reports within 30 days after month-end (5.15.A). Cash basis is the default (5.16). Confirmed.
- **Monthly three-way reconciliation (5.14.C):** confirmed.
- **Earnest money disputes (CP-6):** a signed release from both parties is not required; the Commission won't discipline a firm for holding disputed funds per the contract; a title company holder relieves the broker of responsibility; unclaimed funds go to the State Treasurer. Confirmed.
- **Record retention:** 4 years in statute (12-10-217(1)(k)), running from consummation, or from listing expiration if no closing (Rule 6.20). The items not required after closing are confirmed (Rule 6.20).
- **Electronic records:** must be retrievable and legibly printable, and produced on request of the Commission or any principal party (Rule 6.24).
- **Technical problems:** "not an excuse" comes from the DRE transaction-file page, not the rule text.
- **Complaint or audit:** a written response is required; failure is grounds for discipline even if the complaint lacks merit; reasonable extensions are granted (Rule 6.25). Confirmed.
- **Associate broker turns over money "as soon after receipt as is practicably possible":** C.R.S. 12-10-217(1)(g). Confirmed.
- **Employing broker as supervisor and designated broker in the same transaction:** allowed (Rule 6.4.B.5). PII disposal policy (6.4.C). Office policy manual signed by each associate broker (6.3.C.1). New associate broker (under 2 years) gets high-level supervision (6.3.B.5). Confirmed.

## Unverifiable / not checked against CREM text

- **CP-31 text** (managing confidential client information by an employing broker) was not retrievable. Only the cross-reference in CP-22 was used.
- **Commission listing and buyer form wording** (neither box checked → transaction-broker; "compensation … not set by law and is fully negotiable"; ERTB §7.3 details; holdover "Submitted Prospects") is not in CREM Ch 1–3. This comes from the earlier s2 research notes on the 2026 forms and was not re-verified here.
- **The interpleader / 120-day-notice return option** (lesson `co-trust-accounts`) comes from the Contract to Buy and Sell, not the CREM. It was left as written ("the contract's waiting period").

## Validation

- `parts/s2.json` parses.
- Counts are unchanged: 4 lessons, 27 questions, 52 cards, 35 glossary terms.
- No question's keyed fact changed. All 27 answer indices were re-read against their explanations and are consistent. The answer distribution is 0:7, 1:6, 2:8, 3:6.
- All [[links]] resolve to the glossary terms or aliases in s2.
- **Note:** lesson `co-brokerage-relationships` is about 1,900 words, over SPEC's 1,600 limit. It was about 1,780 before this audit.

# g2 research notes (commercial/specialty leasing; technology, MLS/IDX, data security, safety)

## Percentage leases / breakpoints
- Natural breakpoint = annual base rent / percentage rate; tenant pays % only on sales above breakpoint. Artificial breakpoint = negotiated fixed threshold. https://tangoanalytics.com/blog/percentage-rent/ ; https://rets.ai/glossary/natural-breakpoint
- Existing course (n3.json) already has a basic percentage-lease calc and glossary for Gross/Net/Triple net/Percentage/Ground/Graduated/Index lease — g2 redefines those terms it links (merged later) and adds breakpoint math.

## Oil and gas leases
- Mississippi State Univ. Extension, "Introduction to Oil and Gas Leasing": https://extension.msstate.edu/publications/introduction-oil-and-gas-leasing
  - Surface and minerals can be owned separately; mineral owner can drill regardless of surface ownership.
  - Lessor = mineral owner granting rights; lessee = company.
  - Bonus = one-time payment per mineral acre at signing, paid whether or not anything is produced.
  - Annual rental (delay rental) keeps lease alive in primary term without drilling; "paid-up" leases prepay.
  - Royalty = owner's fractional share of production value, free of production costs.
  - Primary term typically a few years (3-5); lease continues as long as production in paying quantities = "held by production" (secondary term).
  - Shut-in royalty keeps lease alive when a well is shut in.

## Bulk sales
- Cornell LII Wex "bulk sales law": https://www.law.cornell.edu/wex/bulk_sales_law — bulk-sale rules impose notice/procedures; most states moved away from UCC Art. 6; some states still have bulk-sale/tax notice rules (e.g., NY sales-tax notice). Taught as a concept only ("in some states"); no state specifics.

## E-SIGN Act (15 U.S.C. 7001-7003)
- govinfo: https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap96.htm
  - 7001(a): signature/contract/record not denied legal effect solely because electronic.
  - 7001(b): nobody (other than govt agencies in some cases) is required to use or accept electronic records/signatures.
  - 7001(c): for consumer disclosures legally required in writing: affirmative consent; prior clear disclosure of right to paper copy, right to withdraw consent, scope, how to get paper copy; hardware/software statement; consent given electronically in a way that reasonably demonstrates ability to access.
  - 7001(e): electronic record may be denied effect if it can't be retained and accurately reproduced.
  - 7002: states can supersede via enacting UETA (1999 version).
- Exceptions, 15 U.S.C. 7003: https://www.govinfo.gov/content/pkg/USCODE-2021-title15/html/USCODE-2021-title15-chap96-subchapI-sec7003.htm
  - Wills, codicils, testamentary trusts; family law (adoption, divorce); most UCC (except 1-107, 1-206, Arts 2 and 2A); court orders/documents; notices of utility cancellation; notices of default, acceleration, repossession, foreclosure, eviction or right to cure under credit agreement secured by / rental agreement for primary residence; cancellation of health/life insurance; product recall notices; hazmat transport docs.

## UETA
- https://en.wikipedia.org/wiki/Uniform_Electronic_Transactions_Act (uniformlaws.org not fetchable): 1999 uniform act; adopted by 49 states + DC + USVI; applies only when parties agree to transact electronically (agreement can be inferred from conduct, Sec. 5); e-signature satisfies signature requirement, records not denied effect solely because electronic (Sec. 7). Course says "nearly all states" — keep that wording.

## Fair housing and digital advertising
- 24 CFR 100.75(c): https://www.law.cornell.edu/cfr/text/24/100.75 — prohibited: words/phrases/photos/symbols indicating preference; (c)(3) selecting media or locations for ads that deny particular segments of the housing market information about housing because of protected class; refusing ads or charging different rates based on protected class.
- HUD digital platform advertising guidance released Apr 29 / May 2, 2024 (https://archives.hud.gov/news/2024/pr24-098.cfm): warned about ad targeting/delivery tools that deny info based on protected characteristics, etc.
- IMPORTANT: HUD withdrew that 2024 digital advertising guidance (among eight documents), effective Sept 17, 2025, announced in Federal Register April 2026: https://infobytes.orrick.com/2026-04-10/hud-withdraws-eight-fair-housing-guidance-documents-as-part-of-deregulatory-review/ . The statute (42 U.S.C. 3604(c)) and 24 CFR 100.75 are unchanged. Lesson therefore grounds digital-ad rules in the Act/regulation, not the withdrawn guidance.

## IDX
- NAR handbook page requires login. Used MLS IDX rules modeled on NAR policy (Rhode Island MLS IDX compliance policies, Aug 2024): https://www.rirealtors.org/clientuploads/documents/mls/IDX_CompliancePolicies-08_2024.pdf
  - Participants presumed to consent to IDX display unless they opt out (blanket or listing-by-listing); blanket opt-out loses right to display others' listings.
  - Seller can direct listing broker to withhold listing (or address) from internet display.
  - Listing firm must be identified in a reasonably prominent location; displaying broker's name visible.
  - Can't modify other participants' listing content; MLS must be identified as source; certain fields (seller names, expired/withdrawn listings, confidential fields) not displayed.
  - Rules vary by MLS — taught generally ("typical MLS rules").
  - Colorado REcolorado data policy exists: https://cdn.recolorado.com/files/data/DataPolicy.pdf (not used for specifics).

## Wire fraud
- FBI FY2022 congressional report on BEC & real estate wire fraud: https://www.fbi.gov/file-repository/fy-2022-fbi-congressional-report-business-email-compromise-and-real-estate-wire-fraud-111422.pdf — criminals compromise email of parties, send spoofed instructions near closing; verify changes through a secondary channel; contact bank immediately to request recall; file at ic3.gov; IC3 Recovery Asset Team works to freeze domestic funds.
- CFPB mortgage closing scams: https://www.consumerfinance.gov/about-us/blog/mortgage-closing-scams-how-protect-yourself-and-your-closing-funds/ — confirm wire instructions by phone/in person using number already known, never follow instructions in an email, don't email financial info; if scammed contact bank immediately and file at ic3.gov.

## Data security
- FTC "Protecting Personal Information: A Guide for Business": https://www.ftc.gov/node/42173 — five principles: Take stock, Scale down, Lock it, Pitch it, Plan ahead.
- No state statutes cited.

## Agent safety
- NAR "56 Safety Tips for REALTORS": https://www.nar.realtor/safety/56-safety-tips-for-realtors — meet new prospects at office first, copy ID and keep at office; tell someone itinerary, client name, return time, check-in calls; at open houses identify escape routes, check all rooms before locking; walk behind prospect; distress code word; own vehicle, park on street not driveway.

## Not separately sourced (standard textbook principles)
- CAM charges, tenant improvements/TI allowance, letters of intent (generally non-binding except specific clauses), co-brokerage commission split set by agreement, business opportunity (goodwill, inventory, fixtures, licensing caution — may require securities/other licensing in some states), riparian vs prior appropriation water rights, conservation easements (permanent restrictions held by land trust/government, possible tax benefits).

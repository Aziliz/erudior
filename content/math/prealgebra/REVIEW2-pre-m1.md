# REVIEW2-pre-m1: Round 2 review of pre-m1 (Whole numbers)

Reviewer for assignment 94. Scope: honors lessons 05h1-number-bases, 05h2-euclid, 05h3-estimation; round 2 additions to core lessons 01–05; `questions/r2-pre-m1.yaml` (70), `drills/r2-pre-m1.yaml` (9), `glossary-r2-pre-m1.yaml` (12), `cards-r2-pre-m1.yaml` (31), `images/pre-m1-*` (12 SVGs).

`content/math/check-module.sh prealgebra pre-m1` after fixes: **OK, zero problems** (8 lessons, 125 questions, 19 drills, 62 cards).

## Changes

| Where | Problem | Fix |
|---|---|---|
| pre-m1-r2-h33 (answer key) | The question asked "what is an upper bound for $6{,}240 - 1{,}780$?" The exact answer is 4,460, so the distractor 4,500 (round both up) is *also* an upper bound, and so is the distractor 4,460 (the exact value; the lesson's bounds are non-strict). Three defensible answers. | Changed to $6{,}240 - 1{,}720$ (exact 4,520), stem "Rounding each number to the hundreds, which of these is an upper bound", choices 4,600 / 4,400 / 4,500 / 4,000. Now 4,500 (both up) lands *below* the exact answer, which illustrates the lesson's point, and only 4,600 is ≥ 4,520. Explanation rewritten. Correct index unchanged (0). |
| pre-m1-r2-h31 (explanation) | Said 3,000 ($50 \times 60$) "isn't a bound at all", but 3,000 > 2,914, so it is in fact an upper bound. | Says it happens to be above the product here but is not guaranteed to be on either side (one factor rounded up, one down); also explains the 2,914 distractor. The stem specifies the method (round down), so the key 2,400 stays unique. |
| pre-m1-r2-h20 (explanation) | "works for any two whole numbers that aren't both 0": if one number is 0 the first step divides by 0. | "works for any two positive whole numbers, prime or not." |
| 04-factors.md, prime-test Mermaid (core addition) | The chart started with "Divide n by the next prime on the list" before checking the list was non-empty; for $n = 2$ or 3 the list of primes up to $\sqrt n$ is empty, so the chart had no valid path. | Check "Any primes left on the list?" first; accDescr updated to describe the new flow, including the empty-list case. Re-rendered and read. |
| cards-r2-pre-m1.yaml, "Why Fermi estimates often land close" | "twice too big times half too small" is ambiguous ("half too small" can read as 50 % short of… or as one and a half times too small). | "a piece guessed twice too big times a piece guessed half as large as it should be is exactly right." |

Counts: answer-key errors 1 (h33); factual fixes 2 (h31 and h20 explanations); picture fixes 0; other fixes 2 (prime-test flowchart, card wording).

## Checked and found right (things a reader might doubt)

- **Every question worked independently** before reading the key (all 26 core, 44 honors). Recomputed in Python: base conversions ($1032_5 = 142$, reversed-digit distractor $2301_5 = 326$, base-four reading 78; $101011_2 = 43$, reversed 53; $300 = 12\text{C}_{16}$, wrong-order $\text{C}21$; $19 = 201_3$; $1101_2 + 111_2 = 10100_2$ and the no-carry distractor 1212), Euclid chains (252/198 → 18; 391/299 → 23; LCM 5,083; product 116,909), divisor counts (48 → 10; 200 → 12; 16, 30, 49, 72 → 5, 8, 3, 12; smallest with 6 divisors 12), q20 factor counts 2, 3, 4, 5, 6 (unique order), q19 smallest prime factors, $30{,}031 = 59 \times 509$, time conversions (86,400 s/day, 525,600 min/year), parking-lot range 1,100–1,280, $312 \times 18 = 5{,}616$ (only $320 \times 20$ above it), h43 sum 176.
- Order questions have one order each (q24's "list the primes" and "take larger power" are dependent, not swappable). Match/label answers unambiguous; select-all choices all clearly right or wrong.
- **Lessons:** all worked numbers recomputed: $2304_5 = 329$, $234_5 = 69$, $321_5 = 86$, $45 = 101101_2$, $1011_2 + 110_2 = 10001_2$, $\text{C}8_{16} = 200$, GCF(1,071, 462) = 21 and 22/51, Euclid table for 2,024 and 1,309 (GCF 11, LCM 240,856; $2{,}024 = 2^3 \cdot 11 \cdot 23$, $1{,}309 = 7 \cdot 11 \cdot 17$), 72 divisor table, 360 → 24, 12-divisor table (2,048 / 96 / 72 / 60), $211$ prime, bounds 17,400 < 22,382 < 23,600, 5,400 < 5,557 < 5,600, stadium 1,050–1,320 and "off by 150 / 120", heartbeats 36,792,000, school hours 14,040 with bounds 12,240–15,540.
- "Every two steps the remainder drops to less than half": standard ($r_{k+2} < r_k/2$; Knuth TAOCP vol. 2 §4.5.3).
- History: Euclid's *Elements* c. 300 BC; the algorithm is Book VII Props. 1–2 and the infinitude of primes Book IX Prop. 20 (Heath's translation). Babylonian sexagesimal place value in the Old Babylonian period (c. 1900–1600 BC), so "nearly 4,000 years ago" is fair; a placeholder sign appears in late Babylonian texts, and the Maya used a zero glyph with an 18 × 20 place in the Long Count (Ifrah; MacTutor history of Babylonian and Maya numerals). *Quatre-vingts* = 80. Fermi (1901–1954); at Trinity he estimated about 10 kilotons from the paper scraps (Fermi's own report, July 1945), versus later yields of roughly 20 kilotons, so "same order of magnitude" is accurate; the piano-tuner question is properly hedged ("is said to have").
- Cross-references to core lessons hold: lesson 01 really has the $38 \times 589 \approx 24{,}000$ front-end example; lesson 04 says primes go on forever; lesson 05 introduces the Fundamental Theorem of Arithmetic and factors 360.
- **Pictures** (all 12 rendered and read): base-ten blocks (10×10 flats, 10-cube rods), area model (parts 1,200 / 210 / 240 / 42, bottom row = $47 \times 6$ as the text says), long division (quotient digits aligned over the dividend digits, steps correct, remainder 5), square/cube, factor arrays, sieve (shaded exactly the 15 primes to 50; 1 neither), Venn 84/90, base-five sticks (5 per bundle, 1-2-3), Euclid tiling (to scale, 2 + 1 + 2 squares). Label markers on the three blanks sit on or immediately beside the named parts (long-division markers are placed beside the numbers so they don't cover digits; unambiguous).
- **Mermaid** (8) and the one numberline rendered and read; accTitle/accDescr describe whole diagrams.
- **Drills:** formulas recomputed in Python over the full parameter ranges (base-to-ten vs `int(s, b)`, binary for every n in 9–127, Euclid drill always has a nonzero first remainder and GCF = g, LCM = g·m·k, round-range endpoints round to the target while one beyond them doesn't, for all three places). All answers are integers, no rounding tolerance needed. Checker generated each 40 times without problems.
- **Glossary:** no duplicate term/alias with any other `glossary*.yaml` in the course (upper/lower bound correctly left to pre-m8; pre-m6 notes confirm it did not redefine *order of magnitude*). Definitions correct.

## Overlap

- 05h3 (bounds of products) and pre-m8's 35h3-measurement-error both compute bounds of products; the writer already avoided duplicate glossary entries. The angle differs (whole-number rounding vs measurement), acceptable.
- pre-h1 notes say its lessons deliberately avoid bases, Euclid and divisor counting; pre-m3's 12h1 avoids naming the Euclidean algorithm. No other overlap found.

## Left uncertain

- Mermaid edge labels in the GCF-or-LCM chart sit close to the curved arrows at default rendering; still readable, not changed.
- Lesson 05's existing "the answer is smaller than the numbers" (round 1, out of scope) remains slightly imprecise, as the writer noted; the new chart states it correctly.

# Round 2 review: stat-m5 (Probability)

Reviewer for item 23. Scope: honors lessons 23h1 and 23h2, the round 2 additions to lessons 19–23,
`questions/r2-stat-m5.yaml` (54), `drills/r2-stat-m5.yaml` (8), `glossary-r2-stat-m5.yaml` (9),
`cards-r2-stat-m5.yaml` (20) and `images/stat-m5-*` (8). After the fixes,
`content/math/check-module.sh ap-statistics stat-m5` reports OK with zero problems (7 lessons,
110 questions, 20 drills).

## Changes

### Answer key
- **q14** (match: classify pairs of events). The answer "Dependent" for the two hearts
  dealt without replacement was ambiguous. "A roll is a 1 / the roll is a 6" (key: Mutually
  exclusive) is also dependent, as the lesson itself says, so a learner who chose "Dependent"
  there was marked wrong for a true answer. Changed the answer for the hearts pair to "Dependent,
  not mutually exclusive" and added a sentence to the explanation. Each pairing now has exactly
  one right answer.

### Facts
- **Lesson 23, Mermaid "which counting rule?"** The "can an item be used again? Yes → n^r"
  branch was presented as covering every choice of r items from n. That is wrong when order
  doesn't matter (repetition with order not mattering is $\binom{n+r-1}{r}$). Relabeled the box
  "n^r (in order, like a PIN)" and changed accDescr to match. The lesson's only examples of this
  case (PIN, license plate) are ordered.
- **23h1, Bonferroni sentence.** "Odd number of sums overestimates, even underestimates" changed to
  "never underestimates / never overestimates": the partial sums are bounds, and they can be equal
  to the true value (for example, when the events are disjoint).
- **23h2, likelihood ratios "depend only on the test".** Now labeled as a first approximation,
  with a note that sensitivity and specificity, and so the LRs, can differ between clinical
  settings (spectrum effect). Also changed "usually use a shortcut" to "often use a shortcut".
- **Card "Sally Clark case"** said the figure "was then misread as the chance of innocence".
  Reworded to "press reports widely presented it as the chance of innocence", which is what the
  source documents (Wikipedia, *Sally Clark*: RSS statement 23 Oct 2001; press presented the figure
  as the probability of innocence).

### Pictures and plots
- **23h1, birthday plot.** The label "n = 23: 0.507" at (33, 0.44) sat just under the dashed
  0.5 line and touched the approximation curve. I rendered it with `src/lib/figure.ts` and moved
  it to (13, 0.64), which is clear of both lines.
- **23h2, posterior-vs-prior plot.** The point label "prior 0.02 → 0.162" ran across the dashed
  diagonal. Shortened it to "0.162" and moved the explanation into the caption ("the dot is the
  screening example, prior 0.02 → posterior 0.162").
- No SVG changes were needed (see below).

### Other
- Explanations now name the mistake behind each distractor:
  - h03: 0.68 is the union with the triple term dropped.
  - h17: 9 = 0.90/0.10.
  - h28: 0.15 is the base rate alone.
  - h29: 0.5 and 0.10 each use only one of the LRs.
- **h16:** the explanation said "$2/3$ forgets to add". In fact 2/3 is the odds against. Corrected.
- **h26** (Monty Hall with an ignorant host): the explanation was muddled ("also with probability 1
  (it was the door left closed)"). Rewrote it with the correct likelihoods, ½ under both
  hypotheses, so LR = 1. The answer (1/2) was already right.
- **Drill `stat-m5-r2-odds-update`:** the prompt asks for LR₊ to 2 decimals and then the posterior
  to 4 decimals. A learner who carries the rounded LR forward can be off by up to 0.00034 (worst
  case, prev 0.2, sens 0.93, spec 0.81, found by enumerating the whole grid in Python), and
  tolerance 0.0001 rejected that. Three changes:
  - The prompt now says to carry the unrounded LR.
  - The tolerance is now 0.0004.
  - The solution shows LR to 4 significant figures in the odds product, so the displayed chain
    reproduces the bolded answer.
- **Drill `stat-m5-r2-derange`:** the solution wrote "{pno:num4} × n! = D", which is only
  approximately true with the rounded probability (0.3679 × 40320 ≠ 14833 exactly). It now reads
  "P(no match) × n! = D".
- **Lesson 22:** added a blank line between the frequency-tree image and the next paragraph, so the
  image isn't run into the text as one paragraph.
- **23h2 Mermaid:** the box "Multiply by the likelihood ratio of each piece of evidence" now adds
  "(if conditionally independent)", matching its accDescr and the text.

## Checked and found right (worth noting)

- **Questions:** I worked all 54 before reading the keys, and every key is correct (apart from
  q14's ambiguity, fixed above). Text accept lists are complete for "give only the number" stems.
  The order questions (q05, q06, q17, h05, h20) each have exactly one valid order. The select-all
  sets (q04, q08, q13, q19, q23, h04, h21) are exact.
- **Numbers (Python):**
  - Birthday problem: 0.4927 and 0.2937 for n = 23 and 30. The plotted points (0.117, 0.253,
    0.411, 0.507, 0.706, 0.891, 0.970, 0.994) all match. The approximation e^(−253/365) is 0.500.
    The "shares my birthday" probability is 0.0586 (22 others) and 0.101 (39 others).
  - Derangements: D₄ = 9, and the 9 listed permutations are all valid. The table values 0.3667,
    0.3681 and 0.3679 match. round(n!/e) = Dₙ for n = 3–8.
  - Commuter Venn regions: 130/95/45/60/20/15/10/125, giving a union of 375.
  - h02/h03: 0.73 and 0.46.
  - Odds examples: 0.162, 0.648, LR₋ = 0.0556, P(D | −) = 0.00113, 0.9048 at a 50% prior.
  - Trace evidence: 0.0196, about 50 other matches. Cab problem: 0.4138. h23: ≈ 1/3. h29: 10/11.
  - 8,543² = 72,982,849 ≈ 73 million.
- **Drills:** I recomputed them in Python over their full ranges.
  - incl-excl3: "none" ≥ 20 is guaranteed by `where`.
  - birthday: the lgamma form matches the direct product.
  - neg-test: posterior from 1.0×10⁻⁴ to 0.0968; 3 sig figs is fine.
  - repeat-tests: rounding the prior odds to 4 s.f. changes the posterior by less than 5×10⁻⁵.
  - odds-convert: fine.
  - All 4-decimal answers use tolerance ≥ half the last place.
- **Statements I verified:**
  - "Unevenness can only make a shared birthday more likely": uniform birthdays minimize the match
    probability under independence.
  - Von Mises first published the birthday problem in 1939, and its origin is uncertain
    (Davenport is often credited, unpublished). Source: Wikipedia, *Birthday problem*.
  - Montmort studied the *problème des rencontres* in 1708 (*Essay d'analyse sur les jeux de
    hazard*). Source: Wikipedia, *Derangement*.
  - Sally Clark: convicted 9 November 1999. The 1 in 8,543 figure was for an affluent, non-smoking
    family like the Clarks (which supports the parenthesis in h27). RSS statement October 2001.
    Convictions quashed January 2003, mainly over withheld microbiology evidence. Source:
    Wikipedia, *Sally Clark*.
  - Turing and Good's ban/deciban scale in Banburismus at Bletchley Park. Source: I. J. Good,
    "A. M. Turing's statistical work in World War II", *Biometrika* 66 (1979); I did not re-check
    this online.
- **Pictures:** I rendered all 8 SVGs, with label markers for q01, q11, q16 and h01.
  - The region values and geometry are right. The area-model strip widths and heights are
    proportional (0.4/0.6; 0.30/0.10).
  - In the three-circle Venn, every number lies in the region it names (checked by distance to
    each circle centre).
  - Every marker sits on the part its label names. No text overlaps or is cut off.
  - The area model is drawn as a rectangle rather than a literal square. Its alt text says "unit
    square", which is harmless.
- **Diagrams:** all 7 Mermaid diagrams render and are readable, and their accDescr covers the
  whole diagram. The lesson 23 shape tree renders cleanly.
- **Glossary:** no term or alias duplicates any other glossary file in the course. stat-m3's
  15h3 bolds **odds** and relies on this module's entry, as its notes say.

## Overlap with other round 2 lessons

- **stat-m6 27h1 (indicators and linearity)** also uses the matching problem (expected number of
  matches = 1) and the birthday pairs (expected number of matching pairs). These are complementary
  rather than duplicates: 23h1 finds the probabilities, and 27h1 the expectations. A
  cross-reference could be added later by the stat-m6 owner.
- **stat-m3 15h3 (risk and odds ratios)** defines odds, $p/(1-p)$, again in its own words. The
  short repetition is fine for a learner who takes only one honors lesson.
- **stat-h1 92 (multiple testing)** builds on 23h1's union bound, which is consistent.

## Left uncertain

- Turing/Good attribution details (unit names, Bletchley use) are from the standard published
  account and were not re-checked online. I am confident they are correct.

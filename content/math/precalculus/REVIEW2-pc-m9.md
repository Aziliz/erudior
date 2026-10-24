# Round 2 review: module pc-m9 (Sequences, series, induction and counting)

Reviewer, item 112. Scope: honors lessons 40h1–40h3, round 2 additions to core lessons 36–40,
`questions/r2-pc-m9.yaml` (64), `drills/r2-pc-m9.yaml` (9), `glossary-r2-pc-m9.yaml` (19),
`cards-r2-pc-m9.yaml` (28), 16 `images/pc-m9-*.svg`. After fixes,
`content/math/check-module.sh precalculus pc-m9` reports zero problems.

## Changes

| Where | Problem | Fix |
|---|---|---|
| pc-m9-r2-q06 explanation | Said the 1.44 m distractor is "$0.6 \times 2.4$", which names no real mistake. | 1.44 m is 40% of 3.6 m (height lost instead of kept, same mistake as the 4 m distractor); added the real next rebound (≈ 1.30 m). |
| 40h3, "Bernoulli trials" | "Drawing cards without replacement … (Lesson 40, Example 8 needed combinations)": Example 8 draws marbles, not cards. | Now "Drawing cards or marbles without replacement … (the marbles of Lesson 40, Example 8 …)". |
| 40h3, "The expected number of successes" | "The histogram above peaks at 3, close to $np = 3$": reads as if it were not equal, and the histogram ($p = 0.3$) sits after the $p = 0.25$ example, so the reader could mix them up. | States $n = 10$, $p = 0.3$, "exactly $np = 3$", plus a note that the peak is not always at $np$ but always within 1 of it. (I checked this for every $n \le 59$, $p = 0.01 \dots 0.99$ in Python; it follows from mode $\in [(n+1)p - 1, (n+1)p]$.) |
| 40 (core), after the counting-method chart | The new chart sends every "order doesn't matter" case to $\binom nr$, which is wrong for unordered choices with repetition (scoops of ice cream). | Added one sentence: the combination box assumes no repeats; unordered choices with repeats need another count (honors lesson on counting techniques). Chart unchanged. |
| 40h1, "The fixed point" | Overlap with pc-m2 honors lesson 07h2, which derives the same linear fixed point $c/(1-m)$. | Added a short cross-reference "(Module 2's honors lesson on iteration met this same linear case)". |

Counts: answer-key errors 0; factual fixes 2 (Example 8 reference, histogram/np statement); picture fixes 0; other fixes 3 (q06 distractor explanation, counting-chart caveat, cross-reference).

## Checked and found right
- All 64 questions worked independently before reading keys; every key correct, select-alls exact, order questions have one order (h24's steps are fixed by their wording "subtract … add back … to get the union"), match/label pairings unambiguous.
- Recomputed in Python: loan payment \$332.14 and \$10,126.83 after a year of \$90 payments; $2^{64}-1$; $\varphi^{10}/\sqrt5 = 55.0036$, $\varphi^{15}/\sqrt5 = 609.99967$; 89/55; MISSISSIPPI 34,650; grid paths 56, 30; stars and bars 286, 84; inclusion–exclusion 734 and all seven Venn regions; $D_3..D_6 = 2, 9, 44, 265$, $D_{10}/10! = 0.3678794$ vs $1/e$; Example 1 (0.2335, 0.1493), Example 2 (0.9437, 0.0197); every histogram bar; raffle −2.50; roulette −2/38; h29–h39 values.
- Drills: brute-forced the formulas (affine recurrence with exact fractions, second-order closed form for 7 terms, multiset by enumerating permutations, stars and bars by enumeration both modes, inclusion–exclusion for every allowed big/d1/d2). Tolerances: 4-dp answers 0.0001, 1-dp answers 0.051, cents 0.006 on multiples of 1/6 (no rounding ties) all accept correctly rounded values.
- Lesson 37's drug example (100, 140, 156, 162.4 → 166.7) matches 40h1's $A_{n+1} = 0.4A_n + 100$.
- Tower of Hanoi: published by Édouard Lucas in 1883 (under the pen name "N. Claus de Siam"): MacTutor, https://mathshistory.st-andrews.ac.uk/Extras/Hanoi/ ; https://en.wikipedia.org/wiki/Tower_of_Hanoi .
- Statements labeled as unproved are labeled: repeated-root form, linearity of expectation, law of large numbers, $D_n/n! \to 1/e$, $E$ finite in the waiting-time argument. h31's mention of variance is labeled "met in statistics" (acceptable).
- All 16 SVGs rendered: content, proportions (bounce heights 10/6/3.6/2.16 drawn to scale), tilings (all 1/2/3/5 tilings correct and distinct), trees, Venns; label markers on the right parts for all six label questions. All 6 Mermaid charts and 4 new figures rendered and readable; accTitle/accDescr describe the whole diagram.
- Glossary: no term or alias duplicates any other glossary file ("characteristic equation" vs pc-m6's "characteristic equation of the matrix" are distinct; "fixed point" correctly reused from pc-m2).

## Overlap
- 40h1's fixed point of $a_{n+1} = ra_n + c$ repeats the linear case in pc-m2's 07h2 (now cross-referenced).
- 40h1's Fibonacci/golden ratio/Binet section overlaps pc-m6's 27h3 (eigenvalues), which derives Binet another way and already cross-references this lesson. Consistent ($F_0 = 0$, $\psi = 1 - \varphi$). No change needed.

## Left uncertain / minor
- The 40h1 recurrence plot draws each point in a different default color and the $n = 0$ point sits on the y-axis near the "20" tick label; legible, left as is.
- Drill pc-m9-r2-affine-limit's solution shows values to 2 decimals while the prompt asks for 1; accepted answers are unaffected.

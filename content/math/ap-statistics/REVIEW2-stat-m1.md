# Round 2 review: module stat-m1 (Exploring one-variable data)

Reviewer for assignment 19. Scope: honors lessons 06h1 (density histograms / KDE), 06h2 (robust
statistics), 06h3 (grouped and combined data); round 2 additions to core lessons 01–06; 
`questions/r2-stat-m1.yaml` (73), `drills/r2-stat-m1.yaml` (9), `glossary-r2-stat-m1.yaml` (21),
`cards-r2-stat-m1.yaml` (30), `images/stat-m1-*` (12 SVGs).

`content/math/check-module.sh ap-statistics stat-m1` after fixes: OK, zero problems.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| q26 (label, boxplot) | Marker 6 sat exactly on the outlier circle and hid it completely, so the learner could not see the part being labeled. | Moved marker 6 to y = 33.5 (just above the circle); alt text updated to say "just above". Re-rendered and checked. |
| `images/stat-m1-kde.svg` | The "h = 0.8" label crossed the dashed kernel curve over 7. | Added a white text halo (`stroke` + `paint-order`) so the label reads cleanly. Re-rendered. |
| 06h2 "What each center minimizes", glossary `midrange`, card "Midrange", h29 explanation | Said the midrange is "the least resistant summary/measure of center (of all)". Overstated: its breakdown point is $1/n$, the same as the mean's; it is more sensitive per unit of error, not uniquely least resistant. | Reworded to "among the least resistant"; h29 explanation now gives the concrete reason (an error in the maximum shifts the midrange by half of it, the mean by $1/n$ of it). |
| h05 explanation | Distractor "2" had no explanation. | Added: "dropping the factor 2 gives 2" ($20 \times 1000^{-1/3} = 2$). |
| drill `stat-m1-r2-trimmed-mean` solution | Said the ordinary mean is "pulled up by {a10}"; in about 0.4% of generated instances (200,000 simulated) the ordinary mean is at or below the trimmed mean, so the sentence would be false. | Now: "(The ordinary mean, which keeps {a1} and {a10}, is {mn:dp3}.)" |
| drill `stat-m1-r2-modified-z` | For MAD = 11, value 57 from the median, $|M| = 3.4951$, which rounds to the asked 2 decimals as 3.50 while the key says "not flagged": consistent with "> 3.5" but a trap for a student who compares the rounded value. | Added `where` clause `abs(abs(0.6745*dv/mad) - 3.5) > 0.005` to exclude near-cutoff instances (only those two cases were affected). |

Counts: answer-key errors 0; factual fixes 1 (midrange claim, in 4 places); picture fixes 2
(q26 marker, KDE label); other fixes 3 (h05 explanation, two drill fixes).

## Checked and found right (things a reader might doubt)

- **All honors numbers recomputed in Python** (scipy for normal values): densities
  0.0056/0.0257/0.0250/0.0180/0.0100/0.0025; ages 30–40 ≈ 0.215; Sturges for n = 200 → 9 bins,
  Scott 8.35, FD 6.16 (≈ 15 bins), Silverman 4.19; KDE $\hat f(4) = 0.1425$, $\hat f(3) = 0.2208$;
  identity check 130/150, absolute sums 20/22; logger mean 19.87 → 1017.78, median 19.75 → 19.95,
  trimmed 19.84 → 20.08 (19.8375, 20.075), winsorized 19.86; MAD 3, 1.4826·3 = 4.45,
  IQR/1.349 = 4.45, $s$ = 6.15, z = 2.28, M = 3.48; defects mean 1.175, $s$ = 1.06; grouped commute
  SD 13.6, median 21, Q1 13.08, Q3 31.67; combined sections 76.8, 9.98 (both routes); Welford
  51.09, 274.91, 5.24.
- **Plots:** the three-bandwidth KDE plot really has 4 local maxima at h = 0.3 (3 and 3.6 merge,
  so "a spike for nearly every value" is fair), 2 at h = 0.8 (3.0 and 6.5), 1 at h = 2. Left-skew
  plot in lesson 04 is a reflected gamma(2, 1.6): median 7.315, mean 6.8, heights at the dashed
  lines 0.196 and 0.169 match. Ogive points and Q1/Q3 dashed lines match the grouped calculation.
  Labels sit off the curves.
- **Constants:** $\Phi^{-1}(0.75) = 0.67449$, $1/0.6745 = 1.4826$, $2 \times 0.6745 = 1.349$.
  Scott 3.49, FD factor 2, Silverman 0.9·min(s, IQR/1.34)·n^(-1/5): standard (Scott 1979;
  Freedman & Diaconis 1981; Silverman 1986, eq. 3.31). R's `hist` default `breaks = "Sturges"`
  (R documentation, `?hist`, `nclass.Sturges` = ceiling(log2(n) + 1)). Modified z-score with
  0.6745 and cutoff 3.5: Iglewicz & Hoaglin (1993), as given in the NIST/SEMATECH e-Handbook §1.3.5.17.
  Breakdown points (mean/SD/range 1/n, α-trimmed mean α, IQR 25%, median/MAD 50%): Hampel (1971);
  Huber & Ronchetti, *Robust Statistics*. Sheppard's correction $w^2/12$ correctly described and
  labeled as not used. Welford (1962) update formulas verified numerically.
- **Masking claim (h26):** with 18 readings of 10 plus 100 and 102, $\bar x = 19.1$, $s = 28.0$,
  z-scores 2.89 and 2.96, both under 3: the example illustrates masking as claimed.
- **Every core and honors question worked independently before reading the key** (q01–q30,
  h01–h43): all keys correct, select-all sets complete, order questions have one order, match
  pairings unambiguous, text `accept` lists complete (numbers compare by value).
- **Pictures:** all 12 SVGs rendered; data-table, shapes, boxplot and KDE label markers checked on
  their parts. Pie angles and segmented-bar percentages match the lesson's counts
  (120+32, 84+12, 54+34, 42+22 = 152, 96, 88, 64; 300 weekday, 100 weekend). Balance beam points
  and fulcrum at 15 are at the right scale positions; deviation squares have the right sides.
- **Mermaid:** all 8 diagrams rendered; accTitle/accDescr describe the whole diagram.
- **Drills:** fd-width uses perfect-cube n; `Math.log2` is exact for 512, so Sturges' ceiling is
  never off by one there. Tolerances: ≥ half the last asked place everywhere; `sigfigs: 3` for
  density and KDE. Grouped-median branching checked by hand on boundary cases (n/2 equal to a
  cumulative count gives the bin's upper edge, which is consistent).
- **Glossary:** no term or alias duplicates any other `glossary*.yaml` in the course (only
  "density curve" exists, a different term).
- q05 (star rating → ordinal) is anchored to lesson 01's own worked example, which classifies a
  1–5 satisfaction rating as ordinal and says to treat its averages with care.

## Overlap

None found. No other ap-statistics lesson (core or round 2, including stat-m2 and stat-h1) teaches
kernel density estimation, density histograms, MAD/modified z-scores, breakdown points, winsorizing,
or combining group SDs.

## Left uncertain / outside scope

- Round 1 (not changed): lesson 04 and its "choosing a center" flowchart (round 2) say the mode is
  the *only* center for categorical data. For ordinal data a median category is also meaningful
  (e.g., the median rating). The round 2 flowchart only repeats the round 1 rule; a later pass on
  lesson 04 could add "(for ordinal data, the median category also works)".
- Distractors "4.5" in h16 and "7.07" in h36 don't correspond to a named mistake (7.07 ≈ √50);
  they are clearly wrong, so left as is.

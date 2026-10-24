# Round 2 review: module a2-m4 (Radicals and rational exponents)

Reviewer for item 12. Scope: honors lessons `14h1-irrational-roots.md` and `14h2-power-laws.md`, the
round 2 additions to `13-radicals.md` and `14-radical-equations.md`, `questions/r2-a2-m4.yaml` (40),
`drills/r2-a2-m4.yaml` (5), `glossary-r2-a2-m4.yaml` (10), `cards-r2-a2-m4.yaml` (19) and the six
`images/a2-m4-*` SVGs. `content/math/check-module.sh algebra2 a2-m4` reports OK (4 lessons,
67 questions, 11 drills, 28 cards) after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| 14h1, Example 5 step 2 | $\tfrac{10}{2.16667^2}$ is $2.130170\ldots$, not $2.13018$ ($2.13018$ is $\tfrac{360}{169}$, the value for the unrounded $\tfrac{13}{6}$), so the line did not match its own input | Now $\approx 2.13017$, used in the average; the result $2.1545$ is unchanged |
| 14h2, "Where the exponent rules break" | Said "this course defines $a^{m/n}$ for a negative $a$ only with $\tfrac mn$ in lowest terms". The core lessons never state that rule, so the sentence pointed to something that doesn't exist | Now "with a negative base $a$, this course (like most textbooks) uses $a^{m/n}$ only with $\tfrac mn$ in lowest terms" (the rule is stated here). Question h17 ("Following this course's rule…") now agrees with it |
| 14h2, Example 3 | "small animals lose heat faster than large ones" is false in absolute terms: an elephant loses far more heat than a mouse. Only the rate per unit of size is higher | Now "lose heat faster for their size" |
| 14h2, power-function shapes | The "rises ever more slowly / bends downward" bullets hold only for $x > 0$ ($x^{2/3}$ falls on the negative side, as the plot shows) | Added "for $x > 0$" to the sentence that introduces the bullets |
| glossary-r2-a2-m4, astronomical unit | Said "equal to the average distance from Earth to the Sun". Since 2012 the IAU has defined the AU as exactly 149,597,870,700 m (IAU 2012 Resolution B2), and that is only roughly the mean distance | Definition now says "roughly equal to the average distance…: exactly 149,597,870,700 m by definition, about 150 million km". The lesson's "about 150 million km" wording is fine as it is |
| drills/r2-a2-m4, a2-m4-r2-find-exponent | Prompt said "as an exact fraction", but the answer box has `lowestTerms: true`, so an unreduced answer such as `2/4` or `4/2` was marked wrong (97 of 600 generated instances had a reducible answer) | Prompt now says "Give $p$ as a fraction in lowest terms (or a whole number)." |
| images/a2-m4-radical-parts.svg | The labels "power (numerator)" and "(denominator)" ran past the right edge of the yellow panel (to x ≈ 630–634; the panel ends at 620) | Moved those two labels and the "root" label left, and shortened their leader lines. Re-rendered and checked |
| 14h2, power-function gallery plot | The right-end curve labels for $x^{1/2}$ and $x^{1/3}$ overlapped each other and the curves, and the "(1, 1)" label sat on the curves | x-range widened to $[-4, 9]$ and y-range to $[-2, 5]$ so the curves spread apart. Dropped `equal` and shortened the labels to `x^(1/2)` etc. Moved "(1, 1)" to a free spot below and right of the point. Rendered: all labels are clear of the curves |
| 14h2, Kepler plot | The Mercury, Venus and Earth labels overlapped each other and the curve, and the Mars and Jupiter labels sat on the curve | Points are now unlabeled. One "Mercury, Venus, Earth" label with an arrow down to the cluster, plus "Mars" and "Jupiter" labels placed below and right of their points, off the curve. Rendered and checked |

## Checked and found right (things a reader might doubt)

- **All 40 questions:** I worked each one before reading the key. One defensible answer each, and every distractor explanation names a real mistake. Recomputed in Python:
  - q05 order: $\sqrt[3]{20} \approx 2.714 < \sqrt8 \approx 2.828 < 3 < \sqrt{10} < 8$.
  - h10: $5.47727 \to 5.4773$. h14 and its distractors: $2.7407$, $4.2222$, $4.1111$, $2.6111$.
  - h12: $0.002^2/6 \approx 6.7\times10^{-7}$.
  - h22: $1.52^{1.5} = 1.874$; distractors $1.52^{2/3} = 1.32$, $1.52^2 = 2.31$, $1.52^3 = 3.51$.
  - h27: $81^{5/4} = 243$.
- **q11 match:** "Square both sides" is not a defensible first move for any of the four equations, so it works as a distractor. The text answers (q01, q08, h06, h09, h18, h21) take only numbers, and the value comparison covers equivalent forms.
- **Drills:** I generated each one 600 times with the app's `generate()` and re-solved it from the prompt text in Python: 0 mismatches. Correctly rounded answers were accepted every time. So were Heron $x_2$ computed from the rounded $x_1$, and Kepler answers computed via the 4-decimal root shown in the solution. A wrong answer (off by 0.0012 or 0.03, or a reciprocal fraction) was rejected every time.
- **Lesson numbers:**
  - Heron's $\sqrt{720}$: $27 \to 26\tfrac56 \to 26.8328157$, which actually agrees with $\sqrt{720}$ to 9 significant figures, so "7 correct digits" understates it but is not wrong.
  - The $\sqrt2$ table: $\tfrac32$, $\tfrac{17}{12}$, $\tfrac{577}{408}$, $\tfrac{665857}{470832}$ and their errors.
  - The error identity $\tfrac{e^2}{2x}$ and the AM-GM-style inequality.
  - The cube-root iteration is Newton's method for $x^3 - n$.
  - $\sqrt[3]{10}$ example: $2.1545^3 = 10.0009$.
  - Kepler: Mars $1.524^{1.5} = 1.881$ yr = 687 d; Halley $75^{2/3} = 17.78$ AU (the measured semi-major axis is about 17.8 AU); Jupiter $5.2^{1.5} = 11.86$. Plot points Mercury 0.387/0.241, Venus 0.723/0.615, Jupiter 5.203/11.86 yr match the NASA planetary fact sheets.
  - Square–cube and Kleiber arithmetic.
- **History and attributions:**
  - Aristotle refers to the odd/even incommensurability proof (*Prior Analytics* I.23).
  - The Hippasus story is labeled a later legend.
  - Heron of Alexandria (1st century CE), *Metrica* I.8, works $\sqrt{720}$ from 27 to $26\tfrac56$ (Heath, *A History of Greek Mathematics* vol. 2).
  - YBC 7289 (Yale Babylonian Collection, c. 1800–1600 BCE): 1;24,51,10 = 1.41421296…, error $-6.0\times10^{-7}$. "How they got it is not known" is the honest position (Fowler & Robson 1998).
  - Kepler's third law: *Harmonices Mundi* (1619).
  - Galileo, *Two New Sciences* (1638), on the bones of giants.
  - Kleiber (1932, Hilgardia) is labeled empirical, with the 3/4 vs 2/3 debate noted (e.g. White & Seymour 2003, PNAS).
- **Rational root test:** $\sqrt[n]{k}$ is rational exactly when $k$ is a perfect $n$th power (monic $x^n - k$). The $\sqrt4$ counterexample and the $\sqrt2 + \sqrt3$ proof are correct.
- **Core additions:**
  - Rationalizing a cube root with $\sqrt[3]{b^2}$ is correct.
  - The Mermaid method chart and its loop are correct, as is the extraneous-root SVG (the line meets $y = -\sqrt{x+7}$ at $(-3, -2)$).
  - Label markers sit on the parts their labels name: q02 (six markers beside the 5, the index, $2x$, the 8, and the 2 and 3 of the exponent) and q09 (marker 1 on $(-4, \sqrt3)$, marker 2 on $(1, -\sqrt8)$, marker 3 on $(3.5, 4.5)$ of the line, plus the two crossings).
  - Heron rectangles are drawn to scale (40 px per unit; $3.1786 \times 3.1461$ against $\sqrt{10} = 3.1623$).
  - All four Mermaid diagrams render, are readable, and have full `accTitle`/`accDescr`.
- **Glossary:** none of the 10 terms or aliases duplicates any `glossary*.yaml` in the course.

## Overlap

- **a2-m6** (`22h2-log-scales`) also uses Kepler's third law. Its notes say it builds on 14h2 on purpose: it doesn't re-define power functions or power laws, and it uses Kepler to read the exponent off a log-log plot. Complementary, not duplicated.
- **a2-m3** (`12h1-locating-zeros`) teaches bisection and only mentions Newton's method. 14h1's Heron/Newton iteration is a different method, so this is no conflict.

## Left as is / uncertain

- Cosmetic, already noted by the writer:
  - a2-m4-r2-find-exponent can show $b^{1}$ in its solution.
  - a2-m4-r2-scale-factor shows $\sqrt[2]{\,}$ when $q = 2$.
  - Both are correct notation, so I didn't change them.
- 14h1 calls the Hippasus attribution "a legend". Historians agree the drowning details are legend. Whether Hippasus had any part in the discovery is uncertain, not settled as false. The wording is acceptable, but a stricter writer might say "unreliable".

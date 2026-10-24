# Round 2 review: calc-m2 (The derivative)

Reviewer pass over the round 2 work in calc-m2: honors lessons 08h1 and 08h2, the additions to
core lessons 06, 07 and 08, `questions/r2-calc-m2.yaml` (41), `drills/r2-calc-m2.yaml` (4),
`glossary-r2-calc-m2.yaml` (14), `cards-r2-calc-m2.yaml` (19) and the 8 `images/calc-m2-*` SVGs.
`content/math/check-module.sh calculus calc-m2` reports zero problems after the fixes.

## Changes

1. **08h1, the secant plot under "Three difference quotients" (picture/plot fix).** When rendered,
   the segment labels "forward" and "backward" sat on the dashed forward secant and on the curve.
   Removed the three segment labels and wrote the caption so it says which line is which (forward
   dashed from (1, 1) to (2, 4), backward dashed from (0, 0) to (1, 1), central solid from (0, 0) to
   (2, 4), tangent the long dashed line below the curve). Re-rendered: clean.
2. **08h2, Key points, first bullet (factual tightening).** It said the one-sided derivatives at a
   seam equal the limits of the pieces' derivatives "only when $f$ is continuous there". That is
   stronger than the theorem the lesson states. Continuity is a sufficient condition, not a
   necessary one: a function that jumps at $a$ but takes its value $f(a)$ from the left piece still
   has $f'_-(a)$ equal to the left limit. Reworded: the shortcut is guaranteed when $f$ is continuous
   (and the limits exist), and it can give the wrong answer if $f$ jumps.
3. **cards-r2-calc-m2.yaml, card "Piece-by-piece shortcut for one-sided derivatives" (factual
   tightening).** It had the same "valid only if continuous" overstatement. Reworded the same way.
4. **calc-m2-r2-h11 (explanation).** The explanation didn't account for the $0.02$ m/s distractor. Added:
   $0.02$ m/s is the numerator's error before dividing by $h$.

No answer keys were wrong.

## Checked and found right (things a reader might doubt)

- **Every number in 08h1** was recomputed in Python double precision: the Example 1 table
  ($D_+$ errors 0.0517/0.0254/0.0126; $D_c$ errors 0.00167/0.000417/0.000104), Example 2
  ($0.999135$, error $8.65\times10^{-4}$, about 29 times smaller than 0.0254; central Richardson
  $0.9999998$, error $2.1\times10^{-7}$), the Example 3 error table at $x = 1$ ($0.14$,
  $1.4\times10^{-4}$, $6.6\times10^{-9}$, $4.3\times10^{-4}$, $2.7$), Example 4
  ($0.415$, $0.19$, $h \approx 0.0516$, $0.155$ m/s), $2\sqrt{\varepsilon} \approx 2\times10^{-8}$ and
  $\varepsilon^{1/3} \approx 5\text{–}6\times10^{-6}$ ("near $10^{-5}$" is a fair rule of thumb, and the lesson labels it as one).
- **The step-error SVG** matches the computed data at every power of 10: the forward minimum is
  $6.6\times10^{-9}$ at $h = 10^{-8}$, the central minimum is about $6\times10^{-11}$ at $10^{-5}$ to
  $10^{-7}$, and both errors are $e$ at $h = 10^{-16}$ (in double precision $1 + 10^{-16}$ rounds to 1).
- Truncation error formulas $\frac{f''}{2}h$ and $\frac{f'''}{6}h^2$, the exact $x^3$ errors, and
  $D_c$ being exact for quadratics are all correct, as is the Richardson error being $O(h^4)$ for
  central differences (only even powers of $h$ appear).
- **08h2:** the jump counterexample ($f'_+(1) = \lim(1/h + 2 + h) = \infty$), $x^2\sin(1/x)$
  ($f'(0) = 0$, $f'$ discontinuous), $x|x|$ is $C^1$ but not $C^2$, $|x|^3$ is $C^2$ but not $C^3$, and
  Example 3 ($a = 1$, $c = -3$, $d = 1$; $f'''$ jumps 6 → 0). The curvature formula, $v^2\kappa$, and
  "a transition makes the path $C^2$" are right. The clothoid's curvature is proportional to arc
  length, and the cubic parabola is a standard railway transition.
- **History:** Darboux's theorem comes from his 1875 *Mémoire sur les fonctions discontinues*.
  Weierstrass presented his function to the Berlin Academy on 18 July 1872, with the conditions
  $0<a<1$, $b$ an odd integer and $ab > 1 + 3\pi/2$, and Hardy (Trans. AMS 17, 1916) relaxed them to
  $ab \ge 1$. Ampère's 1806 attempted proof, Bolzano's example of about 1830 (published in the 1920s/30s),
  Hermite's "plaie lamentable" (letter to Stieltjes, 1893), L. F. Richardson's 1911 paper, and
  Brownian paths being nowhere differentiable with probability 1 (Paley–Wiener–Zygmund, 1933)
  are all correct. Sources: Abbott, *Understanding Analysis* (Darboux, Weierstrass); Hardy 1916;
  the MacTutor biographies of Weierstrass, Bolzano and Hermite; Burden & Faires, *Numerical Analysis*
  §4.1–4.2 (finite differences, Richardson extrapolation).
- Cross-references hold: Lesson 4 is squeeze, Lessons 9 and 11 are product/quotient and chain rule,
  Lesson 17 contains the MVT, and Lesson 44 is Taylor.
- **All 41 questions** were worked independently. Every key is right, every select-all set is
  exact, and the order and match items are unambiguous. The q13 order is fixed by its stem. The
  text `accept` lists cover the reasonable forms.
- **Drills:** I generated 400 instances of each drill with the app's generator and recomputed the
  answers from the prompt as displayed: central-error from the parsed polynomial, Richardson from
  the shown $D_c$ values, one-sided by numerical one-sided slopes plus a check that the pieces meet,
  and the $C^2$ join from $k$ and $q$. Every correct answer was accepted and every answer off by 0.5
  was rejected. No "+ -", "+ 0", "1x" or unfilled placeholders turned up.
- **Pictures:** all 4 SVGs and their blanks were rendered, the blanks with the label-question
  markers. Content is correct and nothing overlaps or is cut off. In q04, marker 2 sits on the
  secant about 13 px from the curve. That was left as is, because the curve isn't a label option.
- **Mermaid:** all 5 diagrams were previewed. They are readable, and the accTitle/accDescr text
  describes each whole diagram.
- **Plots:** the 08 s/v/a plot and both 08h2 plots were rendered, and their captions match. The
  plot parser accepts `2abs(x)`.
- **Glossary:** no term or alias duplicates any other `glossary*.yaml` in the course.

## Overlap

08h1's Richardson extrapolation section overlaps calc-m8's honors lesson 36h3 (Richardson and
Romberg), but 36h3 cites the Lesson 8 honors lesson explicitly and applies the idea to
integration. That's complementary, not a duplicate. The Darboux name also comes up in calc-h1
(Darboux sums), but that is a different topic.

## Uncertain

Nothing substantive. The round-off rule $2\varepsilon|f|/h$ uses $\varepsilon \approx 10^{-16}$
(the unit roundoff is $1.1\times10^{-16}$ and machine epsilon is $2.2\times10^{-16}$). The lesson
labels this as a rule of thumb.

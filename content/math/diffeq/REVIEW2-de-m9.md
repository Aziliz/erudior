# Round 2 review: de-m9 (Series solutions, Fourier series and PDEs)

Reviewer, independent of the writer. `content/math/check-module.sh diffeq de-m9` after fixes:
zero problems (7 lessons, 105 questions, 14 drills).

## Changes

| Where | Problem | Fix |
|---|---|---|
| `de-m9-r2-q20` (order) | Steps "Expand $w(x,0)$ in a sine series" and "Attach the decaying factor to each mode" can be swapped: Lesson 40 writes the decaying superposition first and then matches the initial data. So the question had two correct orders. | Merged them into one step ("Solve for $w$: decaying sine modes whose coefficients are the sine coefficients of $f - v$"). Now 4 items with one order; explanation updated. |
| `de-m9-r2-h22` (MC) | Asked for $u(-1, 2)$ from the Example 3 disk solution, but the disk has radius 2 and $(-1, 2)$ is at distance $\sqrt5 > 2$, outside the disk. The formula has no physical meaning there. | Changed to the point $(-1, 1)$ (distance $\sqrt2$), answer $1.5$; distractors $0.5$ (sign of $-xy/2$), $2$ (dropped the $\tfrac12$), $5.5$ (sign of $2x$). Key stays index 3. |
| L38 Mermaid (series method) | The "singular point" branch said "use Frobenius", which suggests Frobenius always works at a singular point. It only applies at regular singular points (the honors lesson says this too). | Box now says "Power series may fail: Frobenius if the point is regular singular"; accDescr updated to match. Re-rendered. |
| 41h1 $J_0$ plot | The zero label "5.520" sat on the rising curve. | Removed the three point labels (points kept) and gave the values in the caption ("zeros marked at x ≈ 2.405, 5.520 and 8.654"). Re-rendered. |

## Checked and found right (things a reader might doubt)
- Frobenius Example 1: series for $r = 0$ and $r = \tfrac12$ match sympy's expansions of $\cos\sqrt{2x}$ and $\sin\sqrt{2x}/(\sqrt2\,\sqrt x)$ through $x^4$; $a_4 = 1/2520$ (h05).
- $J_0(1) = 0.765198$, four-term partial sum $0.765191$ ("within about $10^{-5}$" holds); $J_0(2) = 0.22389$; zeros 2.404826, 5.520078, 8.653728 (mpmath); ratios 2.2954 and 3.5985. The $x^{40}$ polynomial in the plot is accurate to $2\times10^{-7}$ at $x = 12$.
- Bessel order $\tfrac12$: roots $\pm\tfrac12$, solutions $\sin x/\sqrt x$, $\cos x/\sqrt x$ with no log (standard; e.g. Boyce & DiPrima, Ch. 5). Equal-root and integer-difference forms on the chart and cards match the standard Frobenius theorem.
- History: Fuchs 1866 (regular singular points), Frobenius 1873 (J. reine angew. Math. 76); d'Alembert 1747 (vibrating string, published 1749); Daniel Bernoulli's sine-mode proposal 1753; Laplace's equation in Laplace's 1780s attraction work, with Euler/Lagrange earlier in hydrodynamics. All stated cautiously.
- Laplace lesson: $\sinh(\pi/4)/\sinh(\pi/2) = 0.37747$ (Example 1, $u \approx 3.775$); square-plate series terms $25.3716 - 0.3812 + 0.0099$, sum to 200 terms $= 25.0000$; $20/(2\cosh(\pi/2)) = 3.985$ (h16); $6/\sinh 2\pi = 0.0224$ (h25). Isotherm curves solve $u = c$ exactly. Example 3 Cartesian form $3 + 2x - xy/2$ and $u(1,1) = 4.5$ (inside the disk) correct. Strict inequality $0 < u < 100$ is the strong maximum principle (connected region).
- d'Alembert lesson: Examples 1–3 recomputed (flat top 0.5 at $t = 0.25$; separation at $t = 0.5$; $u(3, t)$ piecewise; $u(x,2) = 0$, $u(x,4) = -f$, period $2L/a$). Product-to-sum identity and h36 alternatives verified.
- Core additions: L39 extension plots (odd = sawtooth, even = $|x|$ triangle wave) and "which series" chart correct; L40 separation chart and string-modes figure ($n - 1$ interior nodes); L41 rod picture and end-condition chart (quarter-wave sines for 0/insulated match the lesson's table).
- All 60 questions worked independently; the other 58 keys, accept lists and distractor explanations are correct.
- Drills: `indicial` checked for all 31 parameter pairs (sympy roots = $u/2$, $v$); `frob-coef` checked for all 90 instances by substituting the three-term series back into $mxy'' + y' + ky$ (coefficients of the three lowest powers vanish) and confirming $d_1 = 2m - 1$, $d_2 = 2(3m - 1)$; `pulse` (704 instances) and `velocity-kick` (588 instances, numerical integration of $g$) recomputed, all answers exact to 4 decimals so `num4` display is exact; plate/disk use tolerance 0.00006 ≥ half of the 4th decimal. Number answers accept typed fractions (docs/COURSE_FORMAT.md › Answers), so "decimal or fraction" prompts are honest.
- Pictures: all five SVGs and four blanks rendered; text readable, nothing cut off; every marker sits on the part its label names (radius, string modes, rod ends, characteristics).
- Glossary (13) and cards (28): definitions correct; no term or alias duplicates any `glossary*.yaml` in the course (scripted check). The hammer card's permanent displacement $g_0w/a$ is right.

## Overlap
Minor, not duplicative: 21h2 (de-m5, Sturm) uses Bessel's equation and the near-$\pi$ spacing of its zeros; 32h2 (de-m7) derives $\mathcal{L}\{J_0\}$ and points to 41h1 for the Frobenius derivation. Consistent with this module; nothing to fix.

## Left as is / uncertain
- The shared glossary entry **indicial equation** (glossary.yaml) is defined only for Cauchy–Euler equations; 41h1 uses the term more generally without bolding it. Not wrong, so not edited (shared file); a course maintainer could widen it.
- `de-m9-r2-indicial` has only 31 distinct instances (writer noted it too); adequate.
- The radius figure's note "series converges inside the disk" is true for this equation (the singular points $\pm i$ are where the actual radius ends); left unchanged.

Sources: Boyce, DiPrima & Meade, *Elementary Differential Equations and Boundary Value Problems* (Ch. 5 series/Frobenius/Bessel, Ch. 10 Fourier series, heat, wave and Laplace equations); OpenStax-level standard results; numerical values from mpmath/sympy.

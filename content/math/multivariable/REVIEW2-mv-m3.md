# Round 2 review: mv-m3 (Partial derivatives)

Reviewer for item 74. Scope: honors lessons 16h1, 16h2, 16h3; round 2 additions to lessons 11–16;
`questions/r2-mv-m3.yaml` (72 questions), `drills/r2-mv-m3.yaml` (6 drills),
`glossary-r2-mv-m3.yaml` (16 terms), `cards-r2-mv-m3.yaml` (27 cards), `images/mv-m3-*` (6 SVGs).

## Changes

### Answer keys / questions
- **mv-m3-r2-q17** (order, linear approximation): steps 2 and 3 could be swapped, since the generic
  formula for $L$ can be written before the values are computed. Step 3 now reads "Substitute those
  three values into $L(x, y) = …$", so it can only follow step 2.
- **mv-m3-r2-q21** (order, implicit differentiation): "Substitute the coordinates of the point" could
  validly come before "Form $-F_x/F_z$" (evaluate $F_x$, $F_z$ first, then divide). Step 4 now reads
  "…into that formula", so the order is unique.

### Factual
- **16h3 intro**: "which is how the wave equation was first solved in general" overstated the
  history (d'Alembert's 1747 argument is equivalent to, but not literally, the characteristic-coordinate
  computation shown). Now: "which is the idea behind d'Alembert's general solution of the wave
  equation."

### Pictures / plots
All four honors-lesson plots had their curve labels piled on top of each other (the renderer puts a
function label at the right end of the curve, and all curves end at the same place):
- **16h1 plot** (directional slopes): function labels replaced by free `labels` placed in clear space;
  y range raised to 0.7 so the label clears the axis title; x-axis title shortened to "θ (radians)" so
  it no longer sits on the curve where it touches 0 at θ = 3π/2.
- **16h2 plot** (polar patch): "P(2, π/6)" and "Δr · column 1" overlapped each other, and
  "Δθ · column 2" sat on the dashed arrow. Moved all three to free labels in clear space.
- **16h3 heat plot**: labels t = 0, t = 0.1, t = 0.5 placed next to their curves; caption now says
  which curve is which (dashed = t = 0.1).
- **16h3 d'Alembert plot**: labels t = 0, t = 1, t = 3 (both bumps) placed beside their curves;
  caption names the dashed curve.

No SVG needed changes.

### Other
None.

## Checked and found right (a reader might doubt)
- 16h1: facts 1–3 from the definition; Example 1 ($E = hk$, $|hk| \le \rho^2/2$); Example 2
  ($D_{\mathbf u}f(0,0) = u_1^2u_2$, $1/(2\sqrt2) \approx 0.354$); example (c) ($u_2^2/u_1$; value ½ on
  $x = y^2$); the C¹ ⇒ differentiable proof (legs: vertical then horizontal, matching the bracket
  split); Example 3's $f_x = 2x\sin(1/\rho) - (x/\rho)\cos(1/\rho)$; second-difference argument (consistent
  with the course convention $f_{xy} = (f_x)_y$ from Lesson 13); Peano example $f_{xy}(0,0) = -1$,
  $f_{yx}(0,0) = 1$, and off-origin mixed partial $(x^2 - y^2)(x^4 + 10x^2y^2 + y^4)/(x^2 + y^2)^3$
  (sympy). Attribution "often credited to Peano (1884)" is appropriately hedged (Genocchi–Peano,
  *Calcolo differenziale*, 1884). The "only one partial needs to be continuous" remark is a true
  standard sharpening.
- 16h2: Example 1 estimate (1.7687, 1.1366) vs true (1.76390, 1.13958), error ≈ 0.0057; Example 2
  product [[5, 4], [1, −1]] verified by direct differentiation of G∘F; polar inverse matrix and
  $|\nabla f|^2 = z_r^2 + z_\theta^2/r^2$; $\nabla\theta = \langle -y, x\rangle/(x^2 + y^2)$; plot
  coordinates (column vectors ×0.6 and ×0.3 at (2, π/6)). Cross-references (Lesson 7 $\mathbf r'(t)$,
  Lesson 23 $dA = r\,dr\,d\theta$, Lesson 28 Jacobians, Lesson 15 implicit function theorem) exist.
- 16h3: λ = 18, half-life ln 2/18 ≈ 0.0385; characteristic-coordinate derivation
  ($u_{tt} - c^2u_{xx} = -4c^2U_{\xi\eta}$); d'Alembert formula; polar Laplacian and Example 4
  ($r^n\cos m\theta$ gives $(n^2 - m^2)r^{n-2}\cos m\theta$); harmonic checks including
  $\ln(x^2 + y^2)$; maximum principle statement (strong form, connected region) is correct.
  Fourier dating ("early 1800s": 1807 memoir, 1822 book) and d'Alembert "1740s" (1747) are right.
- All 72 questions worked independently: keys, `accept` lists and distractor explanations are
  correct; select-all sets are exactly right; match pairings unambiguous; h08, h21, h34, q06, q27
  have unique orders.
- Drills recomputed in Python: dir-origin (all inputs; max rounding error 0.00045 < tolerance
  0.0006), mixed-unequal ($-q$, $p$), deriv-matrix, matrix-chain, heat-decay (sigfigs 3),
  dalembert (reduced fraction equals the exact value for every input).
- SVGs rendered with and without markers: contour map (0.5 curve correctly encloses both peaks
  below saddle height 0.6), partial slice (plane y = b is parallel to the x-axis; trace falls at P, so
  $f_x < 0$ as the lesson says), gradient directions (P on the f = 6 ellipse; ∇f arrow is exactly the
  ellipse normal; dashed line exactly tangent). All markers sit on the parts their labels name.
- Six Mermaid diagrams previewed: readable, content right, accTitle/accDescr describe the whole
  diagram.
- Glossary: no term or alias duplicates any other glossary file in the course.

## Overlap
16h3's harmonic-function section (mean value property, maximum principle stated without proof)
overlaps with mv-h1's `92-harmonic-functions.md`, which proves them; 92 explicitly refers back to
"the lesson on partial differential equations (Module 3)", so the overlap is deliberate and
complementary. No change.

## Left uncertain / not fixed
- d'Alembert plot: the renderer draws y-axis tick numbers (0.4, 0.8) at x = 0, on top of the central
  bump. This is fixed renderer behavior for any plot whose axis crosses a curve (no spec option to
  move ticks); left as is.
- `check-module.sh multivariable mv-m3`: OK, zero problems.

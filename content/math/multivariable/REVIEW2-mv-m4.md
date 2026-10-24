# Round 2 review: mv-m4 (Optimization)

Reviewer pass over the round 2 work listed in NOTES2-mv-m4.md: 3 honors lessons (20h1, 20h2, 20h3), additions to lessons 17–20, questions/r2-mv-m4.yaml (60), drills/r2-mv-m4.yaml (5), glossary-r2-mv-m4.yaml (17), cards-r2-mv-m4.yaml (26), images/mv-m4-* (8 SVGs).

## Changes

| Where | Problem | Fix |
|---|---|---|
| 20h2, Example 3 plot | The label "λ = 1/2" at (2.8, −0.5) sat on the x-axis tick label "3" | Moved to (2.5, −0.9); re-rendered, no overlap |
| 20h3, intro | "change one exponent … and no formula exists" overstated (changing an exponent often leaves a solvable system) | "change an exponent or add a term like $e^{xy}$ and there is usually no formula for the solution" |
| 20h3, Example 2 | "The exact minimum is at $x = y = 1/\sqrt2$" implied a unique minimum; $x^4 + y^2 - 2xy$ has two, at $\pm(1/\sqrt2, 1/\sqrt2)$, plus a saddle at the origin | Reworded to "The iterates approach the minimum at …" and added the mirror minimum and the saddle |

No answer-key errors found.

## Checked and right (things a reader might doubt)

- All 60 question keys worked independently before reading the key; every distractor explanation names a real mistake. Notable: q03 (tangent plane horizontal at a saddle: true), q13 ($\lambda$ can be negative at a constrained max: $-(x^2+y^2)$ on $x+y=2$ gives $\lambda = -2$), h07 (largest curvature along the $\lambda = 12$ eigenvector $\langle 2,1\rangle$; $\langle 1,1\rangle$ gives 11), h09 ($D_3 = -17$), h10 ($-,-,-$ is a saddle), h25 ($1 - x^2 - y^2$ is concave, so option 4 fails), h34 (Newton from $(0.5,0.5)$ lands on $(1,1)$).
- Order questions (q02, q07, q12, h08, h21, h32): one order only; q07 values $-3 < -2.25 < -2 < 0 < 4$ are distinct; in h08 the "$m > 0$" step needs the positivity step before it.
- Text questions: accept lists cover the reasonable forms (numbers compare by value; h02 lists the expression variants).
- Lesson numbers recomputed in Python: H1 Examples 1–3 (eigenvalues 8, 4; rotated form $4u^2 + 2v^2$; critical point $(1,-1,1)$, $f = -1$, minors 2, 3, 4; minors $6x, 12x, 18x$); H2 Examples 1–3 ($F(k) = k^2/16$, $289/16$; $\lambda = 3 - k$; $\lambda = 1/2$ and $-5/2$); H3 Example 1 iterates and $f$ values, Newton iterates and the error table (0.29, 0.093, 0.014, 0.0004, 3.4e-7), gradient descent 46 steps (α = 0.1, both coordinates within 0.001), Newton from (0.3, 0.3), (0.1, 0.05), (0.2, 0.1) converges to the saddle (0, 0).
- Math claims: completing-the-square proof and the $A = 0$ case; $\mathbf u^{\mathsf T}H\mathbf u$ as the second directional derivative with extremes at the eigenvalues; Sylvester's criterion and the "nonzero $D_3$ + neither pattern ⇒ saddle" argument; KKT sign rule (λ ≥ 0 for max, ≤ 0 for min) and sufficiency for concave $f$ / convex $g$ (labeled "stated without proof"); GD convergence on a quadratic iff $0 < \alpha < 2/\lambda_{\max}$; quadratic convergence of Newton. Sources: OpenStax Calculus Vol. 3 §4.7–4.8; Nocedal and Wright, *Numerical Optimization* (2nd ed.), ch. 3 and 12.
- History: Karush, 1939 University of Chicago master's thesis; Kuhn and Tucker, "Nonlinear programming", Proc. Second Berkeley Symposium (published 1951); J. J. Sylvester (1814–1897), English. All right as stated.
- Pictures: all 8 SVGs rendered; label questions previewed with their markers (q04, q09, q14, q19), each marker on the part it names. The contour map's 14 curves were checked numerically: each is a true level set of $x^3 - 3x + y^3 - 3y$ at ±1.2, ±2.5, ±3.5 or 0, dashed exactly for negative levels; the "not critical" dot at about (−0.2, −0.45) has $\nabla f \ne 0$. The residuals picture's line is the real least squares line of its six points, and the square is exactly the point of means.
- Plots: all 3 honors plots rendered; level-ellipse and iterate coordinates recomputed. (The H3 plot crops the left part of the ellipses, as intended; nothing that matters is cut off.)
- Mermaid: all 7 new diagrams rendered; content, accTitle/accDescr and readability fine.
- Drills: each generated 400 times with the app's generator and recomputed independently from the prompt text (numpy eigenvalues/solve for minors and crit3, closed-form half-plane projection for kkt, direct iteration for gd/newton): 0 mismatches. Exact answers accepted (fractions for kkt; 3-dp rounding and fractions for newton); wrong answers rejected; no "+ -", "+ 0", "1x" or unfilled placeholders. kkt rejects decimals like 0.5 because it asks for exact fractions (fraction answer type).
- Glossary: no duplicate terms or aliases among all glossary*.yaml files; definitions correct. Cards correct.

## Overlap

- mv-m1's honors lesson 06h2-quadratic-forms.md gives the eigenvalue-sign classification in one paragraph and points to 20h1 for the proof. 20h1 cross-references it and does not redefine quadratic form or eigenvalue. This is intended and fine.
- mv-h1's 93-gauss-bonnet.md uses the Hessian eigenvalues as principal curvatures and refers to this module's honors lesson. They work together without repeating each other.

## Left uncertain

- Nothing material. The kkt drill solution prints the feasibility test as "feasible exactly when 11 ≤ 10" in active cases. That is logically right but reads oddly. I left it.

Check: `content/math/check-module.sh multivariable mv-m4`: OK, zero problems.

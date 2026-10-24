# Precalculus module pc-m6 (Systems and matrices), round 2: writer notes

## Added

**Honors lessons (3)**. The module has six core lessons, and there were three topics clearly worth teaching that build on each other.
- `lessons/27h1-matrix-transformations.md`: pc-m6-h-transformations, "Matrices as transformations of the plane" (45 min, about 2,150 words). A 2×2 matrix acting on points; linearity; the columns are the images of (1, 0) and (0, 1); a gallery of stretch, reflection, rotation (derived from the unit circle), shear and projection; composition as a product (order matters); proving the angle-addition formulas from R(α)R(β) = R(α + β); |det A| as the area scale factor, with a dissection proof of ad − bc; the sign of the determinant and orientation; det = 0 means the plane is squashed (no inverse); inverses read from geometry; translations and homogeneous coordinates. 4 worked examples.
- `lessons/27h2-markov-chains.md`: pc-m6-h-markov, "Markov chains and steady states" (45 min, about 1,950 words). States, transition probabilities, the transition matrix in the **column convention** (with a warning that many books use rows), state vectors, x_n = Pⁿx₀, the steady state from (P − I)q = 0, regular chains and the convergence theorem (stated without proof), periodic and absorbing chains, Markov's 1906/1913 work and PageRank (labeled as simplified). 2 worked examples (weather chain; three bike stations).
- `lessons/27h3-eigenvalues.md`: pc-m6-h-eigen, "Eigenvalues and eigenvectors" (50 min, about 2,000 words). Definition and geometry; the characteristic equation det(A − λI) = 0 and λ² − (trace)λ + det = 0; eigenvectors from the dependent system; reflections, rotations (complex eigenvalues), shears (repeated eigenvalue) and triangular matrices; Aⁿv = λⁿv; the weather chain solved exactly (2/3 + (1/3)(0.4)ⁿ); why every transition matrix has eigenvalue 1; Fibonacci and the golden ratio. 3 worked examples.

**Core lessons (additions only)**
- 22-gaussian: SVG of the three cases for two lines (one, none, infinitely many solutions); Mermaid flowchart of Gaussian elimination and how to read the outcome; plot of the Example 4 parabola through its three points; plot of the circle and line in the nonlinear note. One existing sentence ended "...(3, 4) and (−4, −3)." and now ends "..., as the picture shows." with the following sentence moved to a new paragraph.
- 23-matrix-ops: SVG tracing row 2 of C times column 1 of D into an entry of CD (Example 3); Mermaid decision chart "is the sum or product defined?".
- 24-matrix-inverse: SVG of [A | I] → [I | A⁻¹] with the Example 3 numbers; Mermaid chart for solving AX = B with an inverse.
- 25-determinants: SVG of the minor M₁₂ and cofactor C₁₂ for the Example 1 matrix with the sign checkerboard; Mermaid "which method for a square system" chart.
- 26-partial-fractions: Mermaid flowchart of the procedure; plot showing Example 1's function as the sum of its two pieces.
- 27-linear-programming: Mermaid flowchart of the corner point method, including the unbounded-region check.

**Questions** (`questions/r2-pc-m6.yaml`, 72)
- Core, pc-m6-r2-q01 to q30 (5 per lesson): 9 text, 6 match, 5 order, 6 select-all, 4 label. Module quiz: q01, q04, q06, q09, q11, q14, q16, q19, q21, q26, q29 (two per lesson, one for partial fractions).
- Honors, pc-m6-r2-h01 to h42 (14 per lesson): 26 multiple choice, 5 text, 3 match, 3 order, 3 select-all, 2 label. No module_quiz, since they are honors lessons in a core module.
- Correct positions of the 26 four-choice questions: 7 / 7 / 6 / 6.

**Pictures** (14 original SVGs in `images/`, all under 12 KB): pc-m6-solution-cases (+ -blank), pc-m6-row-times-column (+ -blank), pc-m6-inverse-by-rows, pc-m6-minor (+ -blank), pc-m6-lp-parts-blank (labeled counterpart is the existing lesson 27 plot), pc-m6-unit-square-map, pc-m6-transform-gallery (+ -blank), pc-m6-det-area, pc-m6-eigen-directions (+ -blank). I rendered each one with preview-figure.mjs and looked at it, with label markers on the blanks. I also rendered all new lesson plots with renderFigure and the app CSS.

**Mermaid diagrams (10)**: one in each core lesson (6), composition order (27h1), two transition diagrams (27h2), and the eigenvalue procedure (27h3). Each has accTitle and accDescr. All were rendered and checked.

**Drills** (`drills/r2-pc-m6.yaml`, 6): pc-m6-r2-transform-point and pc-m6-r2-image-area (27h1); pc-m6-r2-markov-step and pc-m6-r2-markov-steady (27h2); pc-m6-r2-eigenvalues and pc-m6-r2-eigenvector (27h3). Each was generated 2,000 times and checked against an independent solver that reads the prompt as shown. Every target matched, the displayed answer typed back was accepted, and a wrong answer was rejected. There were no NaN values, "+ -" or "1x"-style artifacts.

**Glossary** (`glossary-r2-pc-m6.yaml`, 16): linear transformation, rotation matrix, shear, homogeneous coordinates, Markov chain, state, transition probability, transition matrix, state vector, steady-state vector, regular, absorbing state, eigenvector, eigenvalue, characteristic equation of the matrix, trace. I checked every glossary file in the course for duplicates before and after writing (none).

**Cards** (`cards-r2-pc-m6.yaml`, 27): 9 per honors lesson.

`content/math/check-module.sh precalculus pc-m6`: OK, zero problems.

## For a reviewer
- **Convention:** Markov chains use column-stochastic matrices (x_{n+1} = Px_n) to match Ax elsewhere in the module. The lesson, a card and the glossary flag the row convention used in many finite-math texts. Every Markov question says "columns are from states".
- **Glossary clash avoided:** pc-m9's writer defines "characteristic equation" for recurrences (and "golden ratio"). So 27h3 bolds "characteristic equation of the matrix" (its own entry) and does not bold golden ratio. 27h3's Fibonacci section points to the Module 9 recurrence lesson, and its Binet's formula matches that lesson's form (ψ = 1 − φ, F₀ = 0).
- The glossary term "regular" (aliases: regular transition matrix, regular Markov chain) is broad. If another writer bolds "regular" with a different meaning, the entry needs a more specific name.
- 27h1: the dissection proof of |ad − bc| is shown for one arrangement of the columns, and the text says so. "Every area scales by |det A|" is justified by approximating with tiny squares, which is an intuition, not a proof.
- 27h2: the regular-chain theorem is stated without proof (Perron–Frobenius). PageRank is described as simplified, with the damping value 0.85 that Brin & Page (1998) used.
- 27h3: "the long-run growth rate is usually the eigenvalue of largest absolute value" is hedged on purpose.
- Label questions: q04 (solution cases), q09 (row times column), q16 (minor), q26 (LP parts), h12 (transformation gallery), h41 (eigen directions). Marker coordinates were checked on rendered previews.
- Order questions were chosen so that only one order works. Two of them (q12, q20) order the lines of a derivation, because "procedure" orders for inverses and Cramer's rule had steps that could be swapped.

## Errors found in existing content
None in lessons 22–27 or in questions/drills m6 (not edited).

## Sources
All numbers were computed or checked in Python/sympy: every worked example, question key and distractor, and the plot data. Standard facts come from OpenStax Precalculus 2e (ch. 9 systems and matrices) and standard linear-algebra references (Lay, *Linear Algebra and Its Applications*, ch. 4.9 and 5 on Markov chains and eigenvalues; Strang, *Introduction to Linear Algebra*, on linear transformations and eigenvalues). History: A. A. Markov's 1906 paper on dependent trials and his 1913 analysis of 20,000 letters of *Eugene Onegin* (as described in B. Hayes, "First Links in the Markov Chain", *American Scientist* 101, 2013); S. Brin and L. Page, "The Anatomy of a Large-Scale Hypertextual Web Search Engine" (1998), damping factor 0.85. I made no web lookups in this pass, so a reviewer may want to spot-check these dates. All writing and drawings are original.

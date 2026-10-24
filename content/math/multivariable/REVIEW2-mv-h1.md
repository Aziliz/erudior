# Round 2 review: mv-h1 (Honors: Vector calculus in physics and geometry)

Reviewer's independent check of lessons 90–93, `questions/r2-mv-h1.yaml` (56), `drills/r2-mv-h1.yaml`
(11), `glossary-r2-mv-h1.yaml` (31), `cards-r2-mv-h1.yaml` (36) and `images/mv-h1-*` (5 SVGs + 4 blanks).
`content/math/check-module.sh multivariable h1` after fixes: OK, zero problems.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| mv-h1-r2-h50 (explanation) | `ellipsoid''s` inside a `|-` block scalar, so learners saw two apostrophes | Single apostrophe; also named the mistake behind the $4\pi/(abc)$ and "no simple formula" distractors |
| mv-h1-r2-h06 (choice 5) | "The field points toward the center" is listed as correct, but the field is zero at the center (the same question says so) and in any hollow core | "Wherever the field is not zero, it points toward the center"; explanation matched |
| mv-h1-r2-h23 (explanation) | Distractor $4.43\times10^{-6}$ not explained | Named it: the average energy density $\tfrac12\varepsilon_0E_0^2$ (J/m³), not multiplied by $c$ |
| mv-h1-r2-h29 (explanation) | Distractor 24 not explained | Named it: adds $r^2 = 25$ |
| mv-h1-r2-h40 (explanation) | Distractors 3 and 8/3 not explained | Named them: 1 or 2/3 used in place of the average 1/3 of $x^2$ |
| L91 "Why Maxwell needed an extra term" | The section reads as if the charge-conservation argument were Maxwell's own reasoning. Historically he reached the term in 1861–62 through his mechanical (molecular-vortex) model of the ether | Added a labeled note: the consistency argument is the modern motivation; Maxwell's own route was different (Siegel, *Innovation in Maxwell's Electromagnetic Theory*, 1991; Griffiths §7.3) |
| L91 Example 3 | "$B_0 \approx 3.38$ μT, several times weaker than the Earth's field (25–65 μT)": the ratio is 7.4–19, so "several" understates it | "roughly 7 to 20 times weaker" |
| L90 Mermaid | First box asked whether the mass is spherical, cylindrical or planar "in shape". Gauss's law needs symmetry of the mass distribution, not shape (the accDescr already said symmetry) | "Does the mass have spherical, cylindrical or planar symmetry?" |
| L93 "Computing them with the Hessian" | The term "parabolic" is used in the Mermaid chart, key points, cards and h43/h46, but never introduced in the body | Added "a parabolic point, like any point of a cylinder, if exactly one is 0" (not bolded; the glossary already explains it under planar point) |
| L90 plot (field of a uniform ball) | The "surface" label sat on the dashed line and the "g₀ R²/r² outside" label sat on the curve | Moved labels to free `labels` positions clear of curves and lines |
| L92 plot (flow past a cylinder) | "stagnation" label overlapped the circle and axis; "cylinder" label sat on the axis; two streamlines crossed the y-axis exactly at the 1.5 and 2 tick labels | Two "stagnation point" labels above the axis clear of everything; circle identified in the caption; streamline constants changed to ψ = ±0.45, ±1.18, ±1.81 (cross x = 0 at 1.25, 1.75, 2.25, between ticks) with t-ranges recomputed so each reaches x = ±3.1. Streamline formula r = (c/sin θ + √(c²/sin²θ + 4))/2 rechecked from ψ = U(r − a²/r) sin θ |
| L93 plot (torus K(v)) | Long x-axis title ran over the curve and y-axis; the function label sat on the curve | x title "v"; the v = 0 / ±π explanation moved to the caption; label placed in empty space |
| drill mv-h1-r2-graph-curv | Prompt printed "z = 1(x^2 + y^2)" when a = 1 | `{a:coef}` |

## Checked and found right (a reader might doubt)

- Every question worked independently before reading the key; all 56 keys correct. h17 and Example 1 of L91 checked by computing the curl twice in sympy; h44/h45 eigenvalues; h47/h55 graph-curvature values; h49, h53, h56 numbers.
- Numbers: tunnel period 5063 s / 84.4 min (Earth), Moon one-way 54.2 min; $c = 1/\sqrt{\mu_0\varepsilon_0} = 2.99792458\times10^8$ m/s from CODATA 2022 $\mu_0 = 1.25663706127\times10^{-6}$, $\varepsilon_0 = 8.8541878188\times10^{-12}$; sunlight $E_0 = 1013$ V/m, $B_0 = 3.38$ μT; Bouguer slab $2\pi G\rho h = 1.13\times10^{-3}$ m/s² (0.012% of g); 0.5° excess on Earth = 354,000 km² (Germany ≈ 358,000 km²); Earth $K = 2.46\times10^{-8}$ km⁻².
- Shell-potential integral (both cases) in sympy; uniform-ball interior potential and its Poisson check; torus $K = \cos v/(b(a + b\cos v))$ and $dA = b(a + b\cos v)\,du\,dv$ from the first and second fundamental forms in sympy; hemisphere $K = 1/R^2$ everywhere from the graph formula.
- Plane-wave derivation, transversality, $\mathbf B = \frac1\omega\mathbf k\times\mathbf E$, Poynting identity and theorem, intensity formula (Griffiths ch. 7–9).
- Mean value proof, maximum principle, $D \le 0$ for harmonic $f$, Earnshaw (with its labeled idealization), Neumann uniqueness up to a constant, cylinder flow speed $2U|\sin\theta|$ (Evans ch. 2; Batchelor §6.4).
- Global Gauss–Bonnet sketch: $\sum(\alpha+\beta+\gamma-\pi) = 2\pi V - \pi F = 2\pi(V - E + F)$ using $3F = 2E$; labeled as a sketch.
- Dates: Principia 1687; Poisson 1813; Maxwell 1862/1865; Hertz 1887–88; Poynting 1884; Earnshaw 1842; d'Alembert 1752; Euler curvature 1760 (published 1767, "1760s" fine); Gauss *Disquisitiones generales circa superficies curvas* 1827; Bonnet 1848; Euler's polyhedron formula 1750s.
- "Gravity increases with depth through the mantle": true for PREM (about 9.8 m/s² at the surface to about 10.7 m/s² at the core–mantle boundary); "a realistic density profile shortens the trip noticeably" matches Klotz (Am. J. Phys. 83, 2015: about 38 min vs 42).
- Drills: 300 instances each generated with the app's own code and recomputed independently in Python (sympy curls, numpy eigenvalues, numerical circle averages, numerical differentiation of φ, closed forms): 0 mismatches; every displayed (rounded) answer is accepted; no "+ -", "1x", thousands commas or long decimals inside math. Exact fractions are accepted in graph-curv (the sigfigs check compares values).
- SVGs all rendered and read; geometry right (the plane wave's E, B and travel direction form a right-handed set; E and B in phase; wavelength bracket spans neighboring crests); every label marker sits on the part its label names.
- Mermaid: all four rendered; accTitle/accDescr describe the whole diagram.
- Glossary: no term or alias duplicates any other glossary file in the course.

## Overlap

- 38h2 (mv-m8) already defines Poisson's equation in general and proves Dirichlet uniqueness; L90 reuses the glossary term and L92 cites 38h2 and gives a second uniqueness proof via the maximum principle. 16h3 (mv-m3) states the mean value property and "no interior maxima or minima" without proof; L92 proves both. Repeated on purpose and cross-referenced, not duplicated.

## Left as is / uncertain

- "$\chi = 2 - 2g$ for a surface with $g$ holes" implicitly means closed orientable surfaces; not stated, but there are no non-orientable surfaces anywhere in the course.
- The y-axis tick labels "1" and "−1" in the cylinder-flow plot sit where the unit circle crosses the axis. The app draws these ticks and they can't be moved without changing a = 1.
- "Newton ... it bothered him" (L90) is the common account and is stated mildly. The stronger claim that it delayed the *Principia* for years is disputed, and the lesson doesn't make it.

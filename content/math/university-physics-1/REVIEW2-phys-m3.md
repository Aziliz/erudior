# Round 2 review: phys-m3 (Forces and Newton's laws)

Reviewed independently: 3 honors lessons (10h1 friction systems, 10h2 drag, 10h3 non-inertial frames),
the round 2 additions to core lessons 07–10, `questions/r2-phys-m3.yaml` (59 questions),
`drills/r2-phys-m3.yaml` (7 drills), `glossary-r2-phys-m3.yaml` (13 terms), `cards-r2-phys-m3.yaml`
(28 cards) and the 10 `images/phys-m3-*` SVGs. `content/math/check-module.sh university-physics-1 phys-m3`
reports zero problems after the fixes.

## Changes

### Pictures
- **phys-m3-banked-curve.svg and -blank.svg** (lesson 10, question phys-m3-r2-q16). The vertical
  component $n\cos\theta$ was drawn 154 px long but the weight $mg$ only 100 px, while the text next to
  the picture (and the physics at the design speed) says $n\cos\theta$ balances $mg$. Redrew the normal
  force at 130 px along the 25° normal so $n\cos\theta = mg = 117.8$ px and $n\sin\theta = 54.9$ px;
  moved the labels to the new tips. Moved q16 markers 1, 3 and 4 so they sit on the redrawn arrows
  without covering each other (1: 40.7, 38.1; 3: 47.6, 38.1; 4: 41.8, 57.8).
- **phys-m3-accel-van.svg and -blank.svg** (10h3, question phys-m3-r2-h38). The bob is at rest in the
  van frame, so the tension must equal $m g_{\text{eff}}$, but the tension arrow (100 px) was shorter
  than both $m g_{\text{eff}}$ (138 px) and even $mg$ (125 px). Rebuilt the picture with the bob lower on
  the string (string 160 px at 25°) and T = $m g_{\text{eff}}$ = 130 px, $mg$ = 117.8 px,
  $-mA$ = 54.9 px (tan 25° = A/g kept). Updated h38 markers 1–4 to the new arrows
  (47.3, 36.9; 41.5, 69.0; 35.7, 53.6; 34.4, 73.8).
- **phys-m3-table-pulley.svg and -blank.svg** (lesson 09, q11). The tension arrow on block 1 floated
  12 px clear of the block; it now starts on the block's right edge. q11 marker 4 moved from x 56.0 to 54.2.
- **phys-m3-capstan.svg**: the "wrap angle θ" label ran into the post's outline; split it onto two lines
  inside the post.

### Facts
- 10h2 Example 2: "Drag has taken off a third of her speed already" — free fall would give 76.0 m/s,
  she has 46.5 m/s, a 39% reduction. Now "nearly 40%".

### Explanations
- phys-m3-r2-h23: "Re about 0.02 for the droplet" holds only if 10 μm is the radius (Stokes terminal
  speed 1.2 cm/s, Re ≈ 0.016); for a 10 μm diameter it is ≈ 0.002. Now gives the range and says why.
  The answer key was right.

No answer-key errors were found.

## Checked and right (a reader might doubt)
- Every number in the three honors lessons recomputed in Python: 31.4 N; 6.25 m/s², 12.5 N vs 7.84 N,
  2.94 and 7.35 m/s², 0.476 s; 26.6°, 175 N (10.6% less), 78 N lift; $e^{5.65} = 286$, 28.6 kN,
  $e^{1.885} = 6.59$, ratio² ≈ 43; 2.0 s, 13.9 m, 0.82 m/s; $c = 0.294$, $v_T = 51.6$ m/s (186 km/h),
  τ = 5.27 s, 7.76 s, 226 m, free fall 76 m/s and 295 m; 3.57 s, 2.53 s vs 3.06 s, 34.4 m vs 45.9 m,
  22.8 m/s, 2.77 s down; 17.0°, 10.2 m/s²; 3.57 m/s²; 0.313 rad/s, 20.1 s, 2.99 rpm, 0.94 m/s²,
  9.8 + 0.94 + 0.02; ω²R = 0.0339 m/s²; equator drop $\tfrac13\omega g t^3 = 2.2$ cm for t = 4.52 s;
  Foucault period in Paris (48.85° N) 23.93/sin λ = 31.8 h.
- Derivations: capstan element ($dn = T\,d\theta$, $dT = \mu T\,d\theta$); best-angle minimum and the
  rope-perpendicular-to-contact-force argument (dot product is zero); coasting $v(t)$ and $v(x)$;
  tanh / ln cosh falling solution; $t_{\text{up}}$, $h$ and the return-speed simplification;
  rotating-frame equation and the sign of the Coriolis term for running with the spin (outward, heavier).
- Every one of the 59 questions worked before reading the key, every distractor's stated mistake
  reproduced numerically (e.g. h07 257 / 514 / 41.6 N, h20 18.7 / 6.85 m, h31 2.26 / 32.1 s, q20 33.7 /
  66.3 / 315 m/s). Select-all sets (q04, q09, q14, q19, h11, h24, h37) and order items (q08, h13, h25)
  have a single defensible answer.
- q06 (incline picture): the dashed components are exact (75 and 130 px for a 150 px weight at 30°).
  The friction arrow (95 px) is longer than $mg\sin\theta$ (75 px), i.e. a block sliding down while
  slowing; the stem only says it slides with friction, so this is consistent and left as is (it matches
  the round 1 `shape` figure in lesson 08).
- Facts checked: normal gravity 9.780 / 9.832 m/s² (WGS 84); sidereal day 23.93 h, ω = 7.292×10⁻⁵ rad/s;
  Foucault's 1851 Paris demonstration; Euler–Eytelwein name for the capstan equation; drag
  coefficients ≈ 0.47 smooth sphere, ≈ 1 belly-down skydiver, ≈ 0.3 car (OpenStax University Physics
  Vol. 1 §6.4, labeled approximate in the text); quadratic regime for a sphere with nearly constant C
  for Re ≈ 10³ to 2×10⁵ (below the drag crisis); ρ/η = 1.2/1.8×10⁻⁵ for air gives Re ≈ 7×10⁴ vD; hurricane rotation
  senses; Coriolis deflection for northward motion purely eastward (no vertical part).
- Drills: all 7 generated over their full input ranges in Python; a correctly rounded 3 s.f. answer is
  inside tolerance for every instance (worst cases 0.49% against 1% relative; angles 0.05° against 0.2°;
  $g_{\text{eff}}$ 0.48% against 0.5%). No placeholder collisions with TeX braces.
- Plots and figures rendered with `preview-plots.mjs` (friction vs push, stacked-block shape, drag
  curves): labels clear of curves, nothing cut off; the drag functions match the lesson's formulas.
  All 7 Mermaid diagrams rendered and read; accTitle/accDescr describe the whole diagram.
- Glossary: no term or alias duplicates any other `glossary*.yaml` in the course.

## Overlap
- 10h2's Reynolds-number paragraph and question h23 touch phys-m7's 29h3 (viscous flow). They agree
  (Stokes below Re ≈ 1, close to quadratic from about 10³); 10h2 defers Stokes's law to 29h3 and bolds
  nothing there. No change.
- phys-h1's 92-kepler-problem mentions a "fictitious particle" (reduced mass), unrelated to fictitious
  forces. No conflict.

## Uncertain
- $v_T \approx 35$ m/s for a baseball is an estimate (published values roughly 33–42 m/s); the lesson
  labels it "a rough figure".

# Round 2 review: phys-m7 (Fluids and thermodynamics)

Reviewer, independent of the writer. Scope: honors lessons 29h1, 29h2, 29h3; round 2 additions to core lessons 24–29; `questions/r2-phys-m7.yaml` (72), `drills/r2-phys-m7.yaml` (8), `glossary-r2-phys-m7.yaml` (22), `cards-r2-phys-m7.yaml` (26), `images/phys-m7-*` (15 SVGs). `content/math/check-module.sh physics phys-m7` reports zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| phys-m7-r2-h29 (explanation) | Said "multiplying by $R$ gives 480 W". Multiplying gives $12 \cdot 20 \cdot 2.5 = 600$ W, so the explanation misdescribed the distractor. | 480 W is what you get from the 0.50 layer alone ($240/0.50$), so the explanation now says so. The key (96 W) was already right. |
| phys-m7-r2-q09 (choice 0 and explanation) | "Shower curtain bulging in" was listed as a correct Bernoulli example. Physicists still disagree about the cause (Bernoulli, a buoyancy or chimney effect, or a spray-driven vortex), so it doesn't belong in a select-all answer key. | Replaced it with a perfume atomizer drawing liquid up a tube, a standard Venturi/Bernoulli device, and rewrote the explanation to match. The key [0, 1] is unchanged. |
| 29h1, "Drag at low speed" | Said the friction lesson "used a drag force growing as $v^2$". Lesson 08 actually gives both $F_D = bv$ for slow motion and $\propto v^2$ for fast objects. | Reworded to match lesson 08: about $v^2$ for fast objects, about $v$ for slow motion, and Stokes's law is the exact linear case. |
| 29h3, Example 2 | Used Wien's law "from the modern-physics module". That module (phys-m12, lesson 47) comes after m7, so a learner at this point hasn't seen it. | The sentence now states the law ($\lambda_{\max}T = 2.898\times10^{-3}$ m·K) and says it is explained in the modern-physics module. |
| `phys-m7-capillary.svg` and `-blank.svg` | The meniscus fills were wrong. In the water tube, the air pocket above the concave meniscus was coloured as water. In the mercury tube, the dome under the convex meniscus was white, as if empty. | Added a white fill above the water meniscus and a mercury-coloured fill under the mercury dome. Re-rendered both files and checked them with the h12 markers. |
| 27, isotherm plot (round 2) | The "600 K" curve label sat on the dashed curve. The 300 K curve ran through the "P (atm)" axis title. | Replaced the curve labels with free labels ("300 K" below its curve, "600 K (dashed)" above its curve) and started the 300 K curve at V = 0.45. |
| 29h1, laminar profile plot | The "laminar" label overlapped the x-axis title. The "average…" label sat on the dashed line. The axis title ran through the right wall. The "1" tick sat on the curve apex. | Redrew the plot across the pipe with the walls at 0 and 2 radii, so the y-axis is the left wall. Shortened the axis title, used free labels clear of the lines, and moved the explanation into the caption. Same physics: $v = 1 - (x-1)^2$ and an average of ½. |
| 29h2, Otto PV plot | With r = 8 on a linear scale, points 1 and 4 were about 6 px apart. Point 1's label was hidden under the axis title and point 4's sat on the axis title. | Redrew with r = 4 (adiabats $4^{1.4}/V^{1.4}$ and $3\cdot4^{1.4}/V^{1.4}$, corners at 6.96 and 20.89) and shortened the axis titles. The caption says r = 4 is used so the corners show. The text's examples (r = 10, 18) are unaffected. |

Totals: answer-key errors 0 (keys all correct; 2 explanation/choice fixes counted under other), factual fixes 2, picture fixes 4 (1 SVG pair, 3 plots), other fixes 2 (h29 explanation, q09 choice).

## Checked and found right (things a reader might doubt)

- I worked all 72 questions before looking at the keys. Distractor arithmetic checks out, e.g. h01's 40 N ($\eta A/(vd)$), h04's 1250 (2.5 cm read as 0.0025 m), h15's 80% (Carnot between PV = 1000 and PV = 200), h17's 95% ($1 - 8^{-1.4}$), h18's 6500 K ($300\cdot9^{1.4}$), h31's 650, 496 and 2.6 W, and h35's 237 and 260 K.
- Order questions (q04, q08, q13, q19, q25, q28, h10, h22, h24, h39) each have one strict order. Cyclic ones (q28, h22, h24) give a fixed starting step. In q25, W(adiabatic) < W(isothermal) < W(isobaric) for the same start state and the same final volume.
- Lesson numbers recomputed in Python:
  - 29h1: Example 2, $R_{\text{flow}} = 1.258\times10^{11}$, $\Delta P = 2.5\times10^4$ Pa, F = 1.98 N, needle Re ≈ 849. Example 4, $v_T = 0.0121$ m/s, Re ≈ 0.016. Example 5, h = 0.149 m.
  - 29h2: Example 1, e = 22%. $10^{0.4}$ gives e = 0.602 and T = 754 K. $300\cdot18^{0.4} = 953$ K. $1 - 18^{-0.4} = 0.685$. Example 4, $Q_C = 1.34\times10^5$ J, $W = 4.47\times10^4$ J, $Q_H = 1.79\times10^5$ J. Carnot COP 277.15/18 = 15.4.
  - 29h3: wall R = 2.487 m²·K/W, 100.5 W, 22.6 K. Net radiation 115 W. Wien 9.47 µm. S = 1362 W/m² from L = 3.83e26 W. Mars 589 W/m². Earth $T_e$ = 254.6 K. Mars $T_e$ = 210.2 K. One-layer model 303.3 K.
- Data values against sources:
  - Solar luminosity 3.828e26 W (IAU 2015 nominal) and solar constant about 1361 W/m² (Kopp & Lean 2011).
  - NASA planetary fact sheets: Mars Bond albedo 0.250 and black-body temperature 209.8 K. Mars mean surface about −63 to −65°C, so "roughly −60°C, about 210 K" is fair. Venus black-body temperature 226.6 K ("about 230 K") and surface 737 K ("near 735 K").
  - R-value conversion: 1 h·ft²·°F/Btu = 0.1761 m²·K/W.
  - Viscosities (air 1.81e-5, water 1.00e-3, olive oil about 0.08 Pa·s) and surface tensions (water 0.0728, mercury 0.485, ethanol 0.022 N/m) match standard tables (CRC Handbook, OpenStax College Physics ch. 12 and 11).
  - Mercury–glass contact angle about 130–140°.
  - Compression ratios and the 200–250°C diesel autoignition range are labeled as approximate.
- The heat-transfer picture has the convection loops rising in the middle and sinking at the sides. Either circulation pattern is possible for a pot heated across its base, and the alt text matches the drawing.
- The one-layer greenhouse model is clearly labeled as a simplified teaching model, both in the lesson and in the cards.
- Every SVG was rendered and read, and every blank was rendered with its label question's markers. All 21 markers sit on the parts their labels name.
  - On the capillary blank, markers 1 and 2 cover the small meniscus curves, but their position (top of the liquid in each tube) still identifies them.
- All 7 Mermaid diagrams were rendered and read. Content is correct and the accTitle/accDescr lines describe each whole diagram.
- All 8 drills: I recomputed sample instances in Python from the prompts as shown. A correctly rounded 3-sig-fig answer is always within the 1% relTolerance, since its worst rounding error is 0.5%.
  - In the net-radiation drill, using 273 instead of 273.15 changes the answer by at most 0.15%, so it is still accepted.
- Glossary, cards: definitions correct, no duplicates. "Stokes's law" is defined in glossary-r2-phys-m8 and fits this lesson.

## Overlap

- `93-climate-physics.md` (phys-h1, Frontiers module) recaps the 29h3 energy balance: $T_e$ = 255 K, the factor of 4, and the all-absorbing one-layer model giving 303 K. This is deliberate and short (NOTES2-phys-h1 says so), and 93 goes on to the partial absorber, lapse rate and feedbacks. No change needed. If 29h3 changes, 93's recap should be checked.
- The core lesson 25 already states Poiseuille's law in one paragraph. 29h1 says it extends that.

## Left uncertain

- At its extreme inputs (R = 0.1 mm, 0.3 mL/s, water), the Poiseuille drill reaches Re ≈ 1910. That is just under the usual 2000, so the drill's "laminar" premise is reasonable, but it sits at the edge.
- "Real gasoline engines reach roughly 30 to 40%" refers to peak brake efficiency. Typical on-road averages are lower. The wording "roughly" is acceptable.

# Round 2 review: de-m3 (Modeling with first-order equations)

Reviewer check: `content/math/check-module.sh diffeq de-m3` reports OK (5 lessons, 79 questions,
15 drills, 30 cards, zero problems) after the fixes below.

## Changes

| Where | What was wrong | What I changed | Source |
|---|---|---|---|
| 13h1, "Where the two drag laws come from" (drag crisis parenthesis) | Said "rough or irregular bodies like a person don't" have a drag crisis. Rough spheres do have one; roughness moves it to lower Re (the reason golf balls are dimpled). Only bluff, sharp-edged bodies lack it. | Rewrote the sentence: roughening moves the drop to a lower Re (golf-ball dimples); bluff, sharp-edged bodies like a person show no such drop. | Standard fluid mechanics (e.g. White, *Fluid Mechanics*, sphere drag curves; NASA Glenn "Drag of a Sphere") |
| de-m3-r2-h02 explanation | Said 2000 comes from leaving $D$ in µm "or $v$ in mm/s". $v$ in mm/s gives Re = 2, not 2000. | Explanation now names only the real slip (D in micrometers). | Recomputed |
| de-m3-r2-h05 distractor | "about 22.0 m/s" matched no identifiable mistake and was unexplained. | Replaced with "about 18.3 m/s" = $v_T(1 - e^{-2gx/v_T^2})$ (forgetting the formula gives $v^2$), and explained it. Key unchanged (27.1 m/s, index 2). | Recomputed |
| drill de-m3-r2-quad-return | The fall time is very sensitive to the return speed (d t_f / d v_ret = (v0²+vT²)/(g vT²), up to 0.74 s per m/s), so a student who reuses the 1-dp return speed misses the 0.006 s tolerance by up to ~0.04 s. | Prompt now says to keep full precision in the return speed when finding the time. Tolerances unchanged. | Python |

Counts: answer-key errors 0; factual fixes 1; picture fixes 0; other fixes 3 (h02 explanation, h05 distractor, drill prompt).

## Checked and found right (a reader might doubt)

- Every number in 13h1 and 13h2 recomputed in Python: skydiver $v_T = 53.9$ m/s (194 km/h), 8.1 s and 246 m to 90%, free fall 321 m / 79 m/s; Example 2 (2.63 s, 36.4 m, 24 m/s, 2.83 s, total 5.46 vs 6.12 s); linear vs quadratic at 5 s (23.6 vs 21.2 m/s); fog droplet Stokes speed 1.2 cm/s and Re ≈ 0.016; skydiver Re ≈ 1.7×10⁶; bolus fit (k 0.173, C(0) 11.3, V 44.2, CL 7.66); infusion (3.47 L/h, 34.7 mg/h, 26.6 h); repeated dosing (peaks 10, 15, 17.5…, average 14.4 mg/L); tablet $t_{\max}$ 2.01 h and $C_{\max}$ 5.35 mg/L.
- Quadratic-drag formulas (fall velocity, max height, time to top, return speed, fall time) verified against `solve_ivp` with drag $-kv|v|$ for random drill instances; repeated-dose steady peak/trough verified by iteration.
- All 41 questions worked before reading the keys; every key correct. Distractor explanations checked (h01, h04, h06, h07, h14, h15, h16, h19, h20, h25, h26 each match a real computed slip).
- h13's "about 5 s versus 8 s" to 96% of $v_T$: 4.86 s vs 8.05 s.
- h22 order (dissolve, absorb, distribute, eliminate): in the one-compartment model distribution is instantaneous and elimination acts on drug already in the body, so the order is unique as stated.
- Rough physical figures are labeled as rough in the text: Re cutoffs, sphere $C_d$ ≈ 0.4–0.5 (subcritical range), drag crisis near Re ≈ 3×10⁵, air ρ ≈ 1.2 kg/m³, μ ≈ 1.8×10⁻⁵ Pa·s, belly-down skydivers ~50–55 m/s (commonly cited ~53 m/s / 120 mph). Alcohol as the near-zero-order exception is correct (saturable alcohol dehydrogenase). The "not dosing advice" disclaimer is present.
- Drills: all six formulas match the lessons; tolerances ≥ half the last place; bolus-fit computes answers from the rounded concentrations shown and the `where` keeps C2 > 1 so 2 decimals give 3 sig figs.
- Pictures rendered (tank, falling forces, circuits, drag up/down, and the three blanks with their markers): content correct, markers on the named parts, no overlaps or clipping. Battery symbol long plate marked +.
- Mermaid (5) and plots (4 new) rendered: content right, accTitle/accDescr describe the whole diagram, labels clear of curves. The loan plot's payoff dot sits next to the "t (years)" axis label; legible, left as is.
- Glossary/cards: definitions correct; no duplicate terms ("terminal velocity", "half-life", "steady state" are already in glossary.yaml and are not redefined).

## Overlap

No real overlap. de-m8's 37h2 has a three-tank compartment chain (linear systems/eigenvalues), not pharmacokinetics; it reuses this module's "compartment model" alias rather than redefining it. de-m7's 32h1 "sawtooth" is a periodic input, unrelated to the dosing sawtooth.

## Uncertain

Nothing substantive. The quad-fall drill can still reject a student who rounds $v_T$ to 1 dp before computing $v$ in rare mid-range cases (error up to ~0.08 vs tolerance 0.06); I left it, since the prompt asks for each value to 1 dp, not for chained rounding.

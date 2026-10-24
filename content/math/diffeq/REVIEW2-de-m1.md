# Round 2 review: module de-m1 (Bridge: differential equations at the AP level)

Reviewer, independent of the writer. `content/math/check-module.sh diffeq de-m1` after fixes:
OK, zero problems (7 lessons, 106 questions, 17 drills, 45 cards).

## Changes

| Where | What was wrong | Fix | Source |
|---|---|---|---|
| `de-m1-r2-q06` (label, slope field) | Marker 4 sat on the centre of the highlighted red segment, which is shorter than the marker is wide, so in the question the highlight was completely hidden. | Moved marker 4 to (56.2, 17.6), the lower-right end of the red segment; the segment stays visible and points to the marker. Rendered and checked. | Preview render |
| `de-m1-r2-h11` explanation | Said "9 comes from swapping the coordinates' roles ($2\cdot4+1$)", but two choices equal 9 for different reasons. | Explains both: $x^2+2y^2=9$ uses $(1,2)$; $2x^2+y^2=9$ puts the 2 on the wrong variable. | Recomputed |
| `de-m1-r2-h18` explanation | Distractors 750, 1200, 1050 were not explained. | Added a sentence naming them as extrapolations from the raw counts. | — |
| `de-m1-r2-h26` choice and explanation | Distractor 640 matched no mistake. | Changed it to 641 (using $\log_{10}4$ instead of $\ln 4$: $800e^{-0.2215}\approx 641.06$) and explained it. The key (480) is unchanged. | Python |
| 05h1, Common mistakes ("Using $-f$") | Said the hyperbolas $xy=K$ "do not cross the lines at right angles", but along $y=\pm x$ they do (slopes $\pm1$ and $\mp1$). Q h10's explanation already says this correctly. | Now reads "cross the lines at right angles only along $y=\pm x$, not in general." | Recomputed |

## Checked and found right
- I worked all 51 new questions before reading the keys. Each has one defensible answer, the select-all sets are right (q03, q09, q12, q19, q24, h05, h21), each order question has only one correct order, and the match/label pairings are unambiguous. Numbers checked in Python: q25 $2(1.1)^5=3.221$; h18 $K=900$ (with $A=2$, $q=1/2$); h19 $500/e\approx184$; h20 $200/e\approx73.6$; h26 480.4, 380.3, 543.7.
- 05h1: the self-orthogonality algebra for $y^2=4C(x+C)$ (focus at the origin, so confocal) holds. The rule $y=Cx^n \to x^2+ny^2=K$ is right. The plot's ellipses are $K=1, 6, 14$. The ideal corner flow ($w=z^2$: streamlines $xy=C$, equipotentials $x^2-y^2$) is right, and so is the oblique-trajectory slope formula. A 45° trajectory of the lines through the origin is $r=Ae^{\pm\theta}$.
- 05h2: Example 1 gives 12.43 days, 625 per day, 1146 and 119. Example 2 gives $K=800$, $A=3$, $k=\ln3/2$. The $u=1/P$ derivation and the three-point formula are right. Gompertz inflection is at $K/e$ with rate $kK/e$. Example 3 gives 598, 2.78 weeks and 110.4; the logistic comparison gives 332 and 7.32 weeks, with relative rates 0.69 vs 0.27. The plot labels don't sit on the curves: the logistic is at 777 or more under "logistic (dashed)", and the Gompertz curve is at 337 or less under "Gompertz".
- History: Verhulst proposed the equation in 1838 and named it *logistique* in 1845. Pearl and Reed rediscovered it in 1920 (PNAS). Gompertz's paper on mortality is from 1825 (Phil. Trans.) and Kermack–McKendrick from 1927 (Proc. R. Soc. A). Sources: J. S. Cramer, [The early origins of the logit model](https://dare.uva.nl/id/ad3d4ef1-ecc5-49ef-9562-3032ea229a02); [Encyclopedia of Math, Verhulst–Pearl logistic process](https://encyclopediaofmath.org/wiki/Verhulst–Pearl_logistic_process).
- Drills, checked in Python over every input:
  - logistic-3pt: all 591 valid inputs give integer counts, and both formulas recover $K$ and $A$ exactly.
  - gompertz: $t$ and the fastest rate match a numerical maximisation of the rate.
  - si-peak: $I(t_p)=N/2$ for every input.
  - Tolerances of 0.01 are right for answers given to 2 decimal places.
  - orth-power and orth-slope: formulas right, no placeholder collisions.
- Pictures: all 3 SVGs and their blanks rendered. Geometry is right (field $x-y$; solution $x-1+2e^{-x}$ with its minimum on $y=x$; inflection at $t=3.66$; tangent and error on a concave-up curve), and the other markers are on their parts.
- Mermaid: all 7 diagrams rendered, readable, with complete accTitle/accDescr.
- Glossary (7) and cards (19) are correct. The log-spiral entry ($c=\pm1$ gives 45°) is right.
- Overlap: no other round 2 module covers orthogonal trajectories, SI or Gompertz. The forward references to Module 2 (Bernoulli/homogeneous, lesson 10) are right.

## Left as is / uncertain
- `de-m1-r2-h04` says "Give the exact value" but also accepts -0.1667 and -0.167. That's harmless.
- The simplifications (SI with no recovery, the illustrative tumor numbers, ideal flow, isotherms in a uniform material) are labeled in the text.

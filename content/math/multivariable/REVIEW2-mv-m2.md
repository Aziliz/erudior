# Round 2 review: mv-m2 (Vector functions and motion)

Reviewer for item 73. Scope: honors lessons 10h1 (Frenet–Serret) and 10h2 (Kepler), round 2
additions to core lessons 07–10, `questions/r2-mv-m2.yaml` (50 questions), `drills/r2-mv-m2.yaml`
(5 drills), `glossary-r2-mv-m2.yaml` (18 terms), `cards-r2-mv-m2.yaml` (22 cards), 9 `images/mv-m2-*`
SVGs, 5 Mermaid diagrams, 2 new plots. `content/math/check-module.sh multivariable mv-m2`: zero
problems after the fixes.

## Changes

1. **images/mv-m2-orbit.svg** (picture fix). The italic label "a" sat on the stretch of the dashed
   axis between the Sun and the perihelion. That reads as "a = Sun-to-perihelion distance", which is
   the very mistake the lesson's Common mistakes list warns against (the semi-major axis runs from the
   *center* to the perihelion). Added end ticks at the center and the perihelion, moved "a" to the
   midpoint of that whole segment, and added a key line "a = semi-major axis, from the center to the
   perihelion" above the caption. Re-rendered: nothing overlaps or is cut off. The blank copy has no
   "a", so the h16 label markers are unchanged.
2. **10h2-kepler.md, "From projectiles to planets"** (factual fix). The text said Kepler found *the laws*
   "by fitting Tycho Brahe's naked-eye observations of Mars". Only the first two laws came from the
   Mars orbit (*Astronomia nova*, 1609). The third law (*Harmonices mundi*, 1619) came from comparing the
   periods and distances of all the known planets. Reworded to say this. Sources: standard history of
   astronomy, e.g. the Stanford Encyclopedia of Philosophy entry "Johannes Kepler" and OpenStax
   *Astronomy 2e* §3.1.
3. **drills mv-m2-r2-torsion-helix, solution** (clarity fix). The solution ended with
   $\kappa = \dfrac{a}{a^2+b^2}$, but this problem never defines $a$ and $b$. Added the step with this
   problem's numbers and "(here $a = …$, $b = …$)". The answers are unchanged.

There were no answer-key errors.

## Checked and found right (a reader might doubt these)

- **Every question (q01–q20, h01–h30) worked independently.** Highlights:
  - h06: $\langle\cos t, -\sin t, t\rangle$ has $\mathbf r'\times\mathbf r'' = \langle -\sin t, -\cos t, -1\rangle$ and triple product $-1$, so $\kappa = \tfrac12$ and $\tau = -\tfrac12$ (left-handed).
  - h05: $-2x + y + z = 1$; no other choice is constant.
  - h08: $v^3/(RL) = 15625/32000 = 0.488$, and each distractor matches the mistake named in the explanation.
  - h20: the distractors are $0.5^{1.5} = 0.354$ and $1.5^{1.5} = 1.837$.
  - h21: $5.2^{1.5} = 11.858$; the observed value is 11.86 yr.
  - h28: 7.546 km/s.
  - h29: 3.337 km/s with the altitude, 3.075 km/s with the radius.
  - q09: $\kappa$ values 2, 0.952, 0.179 and 0.0285.
  - q08: the counterexample $0.4$ vs $0.179$.
  - The select-all keys (q04, q08, q14, q19, h13, h27) are each right, and each wrong choice is clearly wrong.
  - Each order question has only one valid order.
- **Lesson math, recomputed with Python.**
  - Helix: $\kappa = a/(a^2+b^2)$, $\tau = b/(a^2+b^2)$.
  - Twisted cubic: $\tau = 3/(9t^4+9t^2+1)$, which gives $3/19 = 0.158$; $\kappa(1) = \sqrt{76}/14^{3/2} = 0.166$.
  - Derivation of $\mathbf N'$; the Darboux vector checks for T, N and B; the $\kappa\tau v^3$ B-component of $\mathbf r'''$.
  - Example 4 of 10h1: $\theta = 0.1$ rad $= 5.73°$, $1.8$ m/s², jerk $0.54$ m/s³, endpoint $y \approx L^3/(6A^2) = 3.33$, $x \approx L - L^5/(40A^4) = 99.90$.
  - Kepler numbers:
    - Earth's year: $a^3 = 3.348\times10^{33}$, $T = 3.156\times10^7$ s $= 365.28$ d.
    - Mars: 1.881 yr.
    - $v_p/v_a = 1.034$.
    - Geostationary radius: 42,164 km, so 35,786 km above the equator.
    - 400 km orbit: 7.67 km/s, 92.4 min.
- **History, conventions and engineering claims.**
  - Dates: Frenet 1847 (thesis) and Serret 1851; *Astronomia nova* 1609, *Harmonices mundi* 1619, *Principia* 1687.
  - The sign convention $d\mathbf B/ds = -\tau\mathbf N$ (right-handed helix has $\tau > 0$) is the usual one (Stewart, Pressley, O'Neill). A few books, notably do Carmo, use $+\tau$; the lesson says some books differ and labels it a convention. Correct.
  - "Clothoid transitions … on railways since the nineteenth century" is supported by Talbot's *The Railway Transition Spiral* (1890). Highway use is in the AASHTO spiral curves.
  - Cant is labeled as a simplification.
  - Two-body $G(M+m)$, Mercury's relativistic precession and hyperbolic interstellar objects ('Oumuamua, Borisov) are stated correctly.
- **Pictures.** All 9 SVGs rendered and looked at.
  - Helix: the axis and shadow are centered on the z-axis, and the tangent points the way the curve climbs.
  - TNB: N is drawn exactly along the plane's depth direction, toward the concave side of the in-plane curve. B is vertical and T lies along the plane.
  - Projectile: H is at the apex and the arrow is tangent at launch.
  - Orbit: the Sun is at $x = 340 + 0.45\cdot230 = 443.5$ (the focus), $b = a\sqrt{1-e^2}$, and the shaded sector areas are 9967 and 9961 px² (equal within 0.06%).
  - Transition: the curvature graph is 0, then linear, then $1/R$.
  - Label markers for q01, q11, q16 and h16 were rendered on the blanks. Each sits on the part its label names.
- **Mermaid (5) and plots (2 new).** All rendered. They are readable, and each accTitle/accDescr describes the whole diagram.
  - Secant plot: $r(1.6) = (1.6, 1.28)$, $r(2.2) = (2.2, 2.42)$, tangent direction $\langle 1,1\rangle$.
  - Chord plot: the points lie on $y = x^2/2$.
- **Drills.** Generated each drill 400 times with the app's own generator and recomputed every answer independently.
  - Rounded answers were accepted every time (default tolerance 0.01 for 2 dp; 0.0006 for 3 dp; 0.051 for 1 dp), and perturbed wrong answers were rejected. 0 failures.
  - No unfilled placeholders, "+ -" or "1x". Thousands commas appear only in prose or as `{,}`.
- **Glossary and cards.** The definitions are correct. No term or alias duplicates any other `glossary*.yaml` in the course (checked by script). The AU is exactly 149,597,870,700 m (IAU 2012).

## Overlap

There is no duplication. `90-gravity-gauss.md` (mv-h1) refers to "the honors lesson on Kepler's laws" and builds on it, treating the planet as a point via Gauss's law. That is complementary material, not repeated.

## Left uncertain / minor

- The 08 chord plot: the four chords almost coincide with the curve at this scale. It is correct but not very vivid. Left as is.
- 10h2 calls the *Principia* "one of the first great triumphs of calculus". Newton wrote it mostly in geometric limit arguments rather than fluxion notation. This is a common phrasing, so it was left.

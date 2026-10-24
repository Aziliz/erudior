# Round 2 review: trig-m7 (Oblique triangles)

Reviewer, independent of the writer. Scope: honors lessons 31h1 and 31h2, the round 2 additions
to lessons 28–31, `questions/r2-trig-m7.yaml` (48), `drills/r2-trig-m7.yaml` (4),
`glossary-r2-trig-m7.yaml` (11), `cards-r2-trig-m7.yaml` (19), `images/trig-m7-*` (9 SVGs).
`content/math/check-module.sh trigonometry trig-m7` after the fixes: OK, zero problems.

## Changes

1. **Lesson 31, "Heron's formula and rounding" (round 1 text, contradicted by new 31h2).** It said
   that for thin triangles with measured sides you should switch from Heron to the law of cosines
   plus $\tfrac12 ab\sin C$. That is wrong two ways: sensitivity to measurement error comes from the
   triangle, not the formula (31h2 now says so explicitly: "no formula can recover accuracy the
   measurements don't have"), and the law-of-cosines route has the same cancellation problem
   that 31h2's Example 2 demonstrates. Rewrote the paragraph: the sensitivity is intrinsic, a
   different formula doesn't remove it, and what you control is rounding (don't round $s$ before
   subtracting). Source: standard numerical analysis (Kahan, "Miscalculating Area and Angles of a
   Needle-like Triangle"); consistent with 31h2.
2. **31h1, "How the two radii compare" (attribution).** "A formula of Euler's" for
   $OI^2 = R(R - 2r)$ now notes Euler published it in 1765 and William Chapple published it earlier,
   in 1746. Source: Wikipedia "Euler's theorem in geometry".
3. **Lessons 28 and 31, obtuse-angle shape figures (new).** The label "180° − A" nearly touched
   segment AC; moved from (1.35, 0.4) to (1.2, 0.45). Re-rendered: clear of lines and the right-angle mark.

## Checked and found right (things a reader might doubt)

- All 48 questions worked independently before reading the key; every key correct, every
  select-all set complete, every order unique, every match/label unambiguous. Recomputed in
  Python: q01 16.96, q06 9.18, q17 84, h04 3.125, h12 4.6957 → 4.70, h13 distractor 5.196,
  h16 78.46, h22 86.33 (law of cosines cross-check), h24 1.737 and each distractor
  (1.000, 1.060, 0.574), h28 53.13.
- 31h1: Example 2 R = 9.334, b = 16.17, c = 18.39; 13-14-15 R = 8.125, r = 4; Example 6 K = 39.69,
  R = 6.05, r = 2.65, largest angle 82.8°; equilateral R = 2√3, r = √3; R/r = 2.03, 2.5, 5.31
  (9-10-17: K = 36, R = 10.625, r = 2). Obtuse-case proof (cyclic quadrilateral ABDC, D on the
  other side of BC) is correct.
- 31h2: 7-9-12 half angles 35.43°, 48.19°, 96.38° (sum 180.00); thin triangle cos C = 0.9999995,
  arccos 0.999999 = 0.0810°, true C = 0.0573°; Example 3 cot 18.5° = 2.9887, half-difference 25.26°,
  B = 46.24°, C = 96.76°, a = 6.67; Mollweide check 1.5318 vs 1.5321 (exact 1.53209), swapped 1.879.
  Derivations of sin²(A/2), cos²(A/2), Heron, law of tangents and Mollweide verified line by line.
- History: law of tangents to Abu al-Wafa (10th c.) per Wikipedia "Law of tangents" (also notes
  al-Jayyānī, 11th c.); Fincke's *Geometria rotundi* (1583) introduced "tangent" and "secant" and
  gave the law of tangents (MacTutor, Fincke). Labeled "disputed" in the lesson, which is
  appropriate. Mollweide: Newton 1707, Oppel 1746, Simpson 1748, Mollweide 1808 (Wikipedia
  "Mollweide's formula"). Heron's incircle proof in the *Metrica*; Archimedes priority hedged.
- Drills: 20,000 random instances each, compared with an independent law-of-cosines solver
  (max difference 1e-13). Tolerances (0.01 for 2 dp, 0.0001 for 4 dp) accept correctly rounded
  answers. `num4` uses thousands separators, but every `num4` value inside math stays below
  1,000 for the given ranges; larger values (`pr`, `prod`) use `dp` formats, which have none.
- Pictures: all 9 rendered. Incircle SVG is exactly a 13-14-15 triangle scaled by 32 (incenter
  (252, 312), r = 128, touch points at tangent lengths 224/192/256 px), matching Example 4.
  Circumcircle SVG: A, B, C, D all at distance 180 from O, D antipodal to B, right angle at C.
  SSA panels: radius < h, = h, between h and b (two crossings in front of A), > b (one behind A).
  cos-sign: a = 120 and b ≈ 100 in all three panels. All label markers sit on the named parts.
- Mermaid (4): rendered; content correct (the SSA chart handles sin B = 1, obtuse A and a = b);
  accTitle/accDescr describe the whole diagram.
- Glossary and cards: definitions correct; no duplicates.

## Overlap

- 27h3 (trig-m6, Ptolemy and chords) uses chord = 2R sin(inscribed angle), which is the same fact
  as the extended law of sines, in a different setting (deriving the sum formula). 31h1 proves it
  for triangles and applies it, so this is reinforcement, not duplication. Cross-references
  could be added later; not changed.
- 08h1 (trig-m2) uses the circumradius of regular polygons; no conflict.

## Left uncertain

- The drill `trig-m7-r2-circle-radii` shows $\sqrt{pr}$ with `pr` at 2 decimals, while
  pr = N/16 can have 4; the displayed radicand is then slightly rounded, but K, R and r are exact.
  Left as is.
- A learner who rounds tan(C/2) to 4 decimals before taking arctan can, rarely, land just
  outside the 0.01° tolerance on C. The solution shows the unrounded route. Left as is.

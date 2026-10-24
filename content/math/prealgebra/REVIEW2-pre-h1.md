# REVIEW2-pre-h1: Honors module pre-h1, Number theory and problem solving

Reviewer for assignment 103. Scope: lessons 90–93, `questions/r2-pre-h1.yaml` (55),
`drills/r2-pre-h1.yaml` (10), `glossary-r2-pre-h1.yaml` (16), `cards-r2-pre-h1.yaml` (38),
`images/pre-h1-*` (6 SVGs), 4 Mermaid diagrams. `content/math/check-module.sh prealgebra pre-h1`:
zero problems after the fixes.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| 91-parity-proof.md, "Why examples are not enough" | "Christian Goldbach proposed it in a letter to Euler in 1742" is not accurate: Goldbach's 7 June 1742 letter (and its margin note) was about sums of three primes (with 1 then counted as prime); the even-number, two-prime form is the one Euler wrote in his 30 June 1742 reply. | Now: "It grew out of letters between Christian Goldbach and Euler in 1742 (Goldbach wrote about sums of three primes, and Euler, replying, put the claim in this two-prime form)". | Wikipedia "Goldbach's conjecture" (History section, quoting the letters); MacTutor history notes |
| glossary-r2-pre-h1.yaml, Goldbach's conjecture | Same attribution ("from a 1742 letter by Christian Goldbach") | "from 1742 letters between Christian Goldbach and Leonhard Euler" | same |
| drills, pre-h1-r2-consecutive-sum (solution) | `${kk}n = {sm}$` put the sum inside TeX, and sums of 1,000 or more (k = 7, middle up to 150) printed as "1,036" inside math | Sum moved out of math: "So $7n$ equals 1,036, and dividing by 7 gives $n = 148$." | brief rule (no thousands commas inside math) |
| drills, pre-h1-r2-last-digit (solution) | When the remainder was 0 the text read "A remainder of 0 means position 4 of the cycle (remainder 0 would mean position 4)" | "A remainder of {rm} points to position {pos} of the cycle (a remainder of 0 always points to the last position, 4)." | wording |
| cards, "Perfect squares divided by 4" | "Remainder 0 (even numbers) or 1 (odd numbers)" could be read as the squares themselves being even/odd numbers in a confusing way | "(squares of even numbers) … (squares of odd numbers)" | wording |

## Checked and found right

- **All 55 questions** worked independently before reading the key; every key correct, every
  distractor explanation names a real mistake. Recomputed in Python: 45 days from Friday (Monday);
  last digits of $3^{50}$ (9) and $8^{103}$ (2); $47 \times 59 = 2{,}773 \equiv 1 \pmod 6$;
  $2{,}345 \times 67 = 157{,}115$ (student's 157,151 has the same digit-sum remainder 2, so h06's
  "might be right" is the correct conclusion); $438 \times 26 = 11{,}388$; $3^{20} \equiv 2 \pmod 7$;
  15,924 ≡ 3 (mod 9); 9 + 100 h ≡ 1 o'clock; 1,000,00x mod 4; ± signs on 1–9 (all totals odd, 15
  reachable); same-side corners leave 31/31 and a tiling exists; counts 62, 21, 93, 10, 16, 12
  zeros of 50!, 49 zeros of 200!, $3^{14} \| 30!$, 858; sums 1,275, 860, 900, 210/100/110/55; 66
  handshakes; 30 squares on 4×4; 50th odd = 99; 21 fence posts; $n = 15$. Select-all, order and
  match items: each has exactly one defensible answer (h25's repeated answer "Proved true" is
  allowed for match).
- **Lessons:** every number recomputed (100 days from Tuesday; 7,006,652; $7^k$ table; $2^{50}
  \approx 1{,}126$ trillion; $40^2+40+41 = 41^2$ and $n^2+n+41$ prime for $n = 0$–39; counts 34,
  20, 333/667, 375 with the wrong LCM, 26 (and the block-of-30 check with 91, 97); $100!$ has
  158 digits and 24 end zeros; 1,000! has 249; 18 factors of 2 in 20!; 25! has 6 zeros; 5,050;
  5,047 with 49 terms; 204 squares; 45 handshakes). The swapped-digit example (7,006,562) really
  has the same digit sum. "Casting out nines catches most single-digit slips" is right (only a
  0↔9 change escapes).
- **History:** Euler and $n^2 + n + 41$ ("in the 1700s"; his 1772 letter to Bernoulli); Goldbach
  verification to $4 \times 10^{18}$ (Oliveira e Silva, Herzog, Pardi, *Math. Comp.* 83 (2014));
  Pólya, *How to Solve It*, 1945; Legendre's formula (Legendre, 1808, *Essai sur la théorie des
  nombres*); the Gauss story is correctly labeled as a popular, probably embellished story.
- **Drills:** 500 instances of each of the 10 generated with the app's own generator
  (`src/lib/drills.ts` on the built module) and every answer recomputed by brute force in Python
  (actual products mod m, `pow` last digits, counting by enumeration, trailing zeros of the actual
  factorial, explicit consecutive runs, explicit sums): 0 mismatches; answer + 1 rejected every
  time; no unfilled placeholders or "+ -". All answers are exact integers.
- **Pictures** (rendered and inspected): day clock (Tue + 2 → Thu), chessboard (both removed
  corners are the dark color in this drawing; 32 light / 30 dark is right for it; the domino spans
  one light and one dark), Venn 1–30 (every number in the right region; 10/5/5/10), blank Venn with
  the h33 markers exactly in left-only, overlap, right-only and outside, staircase (blue columns
  1–5, tan copy 5–1, 5×6), odd-number L layers 1/3/5/7/9. Text readable, nothing cut off. Note:
  on a real chessboard the top-left square (a8) is light; the drawing is a generic checkerboard
  and the lesson never says which color the real corners are, so it is not wrong.
- **Mermaid** (4, rendered): content correct, accTitle/accDescr describe the whole diagram.
- **Glossary/cards:** definitions correct; no term or alias duplicates any other
  `glossary*.yaml` in the course (checked by script, including plural/singular).

## Overlap

- No other prealgebra lesson covers modular arithmetic, casting out nines, parity proofs,
  inclusion–exclusion, factorials, Gauss sums, handshakes or Pólya.
- Light overlap: lesson 91 bolds and explains **counterexample**, which 08h1 (pre-m2 honors)
  also introduces; it is glossed only once (glossary-r2-pre-m2), so no conflict. Lesson 05
  uses a Venn diagram for GCF/LCM; 92 uses one for counting, which is a different use.

## Left uncertain

Nothing material.

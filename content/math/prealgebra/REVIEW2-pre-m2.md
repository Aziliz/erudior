# Round 2 review: pre-m2 (Integers)

Reviewer for item 95. Scope: honors lessons 08h1 and 08h2, the round 2 additions to lessons 06–08,
`questions/r2-pre-m2.yaml` (42 questions), `drills/r2-pre-m2.yaml` (5 drills),
`glossary-r2-pre-m2.yaml` (7 terms), `cards-r2-pre-m2.yaml` (20 cards) and the 6 `images/pre-m2-*` SVGs.
`content/math/check-module.sh prealgebra pre-m2` reports zero problems after the fixes.

## Changes

| Where | Problem | Change |
|---|---|---|
| 08h1, second numberline ((-3) × (-2)) | The point label "3 (flipped)" sat almost against the "6" label (rendered with preview-plots). | Label shortened to "3"; caption now says "flip -3 to 3 (open dot), then stretch by 2 to reach 6". Re-rendered: no crowding. |
| 08h1, "The sign rules, proved", Step 1 | It said the step $ab + (-a)b = (a + (-a))b$ is the distributive law and $0 \times b = 0$ is Fact B. The table states only $a(b + c) = ab + ac$, and Fact B is $a \times 0 = 0$, so both steps also need the commutative law. That is a small gap in a lesson about rigorous proof. | Added that the commutative law lets the factors be written in the other order, in both places. |
| drill pre-m2-r2-midpoint | The prompt and solution printed negative numbers as plain text ("midpoint of -12 and -8"), so they showed a hyphen, not a minus sign. | Wrapped `{a}`/`{b}` in `$…$` in the prompt and in "Start at ${a}$". |
| card "$\|x - a\| \le d$" | "$2d + 1$ integers" is true only for integer $a$ and $d$. | Added "for integers $a$ and $d \ge 0$". |

No answer-key errors were found.

## Checked and found right

- **All 42 questions worked independently before reading the key.** Each has one defensible answer. The select-all sets (q03, q08, q12, h14, h23) are exact. The order items (q02, q07, q13, h12, h25) have only one valid order: in q13, $3 \cdot 9$ must come before $\div 9$ (left to right). Every match/label pairing is unambiguous. In q10 each expression fits only its temperature sentence, and the distractor ($-8 + 3$) matches none. The text accept lists are sufficient (all answers are single integers). The distractor explanations name real mistakes (h18: subtracting the 1 gives $\|x-3\| = 6$, so $-3$ and 9; q15: multiplying before dividing gives $-6$).
- **Drills:** each of the 5 drills was generated 300 times with the app's `generate`. The prompts were parsed and the answers recomputed in Python by brute force (product; factored sum; scan of $x$ for the absolute value equation; average; counting integers with ≤/<). 0 mismatches. All answers are integers, and there are no unfilled placeholders or "+ -".
- **Pictures:** I rendered all 6 SVGs. Thermometer: 10 px per degree with 0 at y = 270. The pointers are at y = 420/340/240/150, which is −15/−7/3/12, and the markers (72.41/58.62/41.38/25.86 % of 580) land exactly on them. The column reaches −4, with 6 a.m. at −11, matching Example 3. Counters: the markers sit on the third + counter, the uncircled last − counter and the first zero-pair outline. Trip: the markers are at 0, 7 and −3 and on the net-change arrow. The arcs are +7 and −10, and the text 7 + 10 = 17 is right. All alt texts match the pictures.
- **Mermaid (5):** all rendered and readable, and accTitle/accDescr describe the whole chart. The 08 sign chart's zero branch ("Product is 0 (dividing by 0 is undefined)") is correct for both products and quotients.
- **Numberlines (6 new):** all rendered with the app CSS. Nothing is cut off, and apart from the fix above no labels collide.
- **Math in the lessons:** Facts A and B and the proofs of $(-a)b = -(ab)$ and $(-a)(-b) = ab$ are valid from the stated laws. Examples 1–6 in both lessons were recomputed: $(-8)(97) = -776$, $-91 + 21 = -70$, subtraction is associative only when $c = 0$, $\|x-4\| = 9 \to -5, 13$, $\|x+6\| = 2 \to -8, -4$, $3\|x-1\|+4 = 19 \to -4, 6$, the midpoint of −11 and 5 is −3, 11 and 9 integers, and the diver: net −16, distance 26. The equality case of the triangle inequality (same sign or one is 0) is correct.
- **History in 08h1** is labeled simplified. The Nine Chapters' final form around the 1st century CE, Liu Hui's commentary of 263 CE with red rods for positive and black for negative, and the rules for signed numbers all agree with [Wikipedia, The Nine Chapters on the Mathematical Art](https://en.wikipedia.org/wiki/The_Nine_Chapters_on_the_Mathematical_Art). Brahmagupta (628 CE, *Brāhmasphuṭasiddhānta*) gives the product of two debts as a fortune; this is standard. Calling negative roots "false"/"fictitious" in Europe (Cardano 1545, Descartes 1637) and the 19th-century justification from the laws of arithmetic (Peacock, Hankel) are standard as well.
- **Glossary:** none of the 7 terms or aliases duplicates any `glossary*.yaml` in the course. "closed" is separate from the existing "closed circle".
- **Core-lesson cross-references:** 08h2 says Lesson 7 showed $a - b$ is the signed trip from $b$ to $a$, and Lesson 7 (round 2 addition) does say that.

## Overlap (not fixed; other writers' files)

- **pre-m7 honors lesson 29h2 (absolute value equations and compound inequalities)** covers $\|a-b\|$ as distance and solving $\|u\| = c$ with isolation first. That repeats a good part of 08h2's "Absolute value equations" section; 29h2 also does $\|u\| < c$, which 08h2 touches as $\|x - a\| \le d$. 29h2 doesn't redefine the glossary term. The overlap is reasonable, since 29h2 is more general (any linear $u$, inequalities written out), but a course editor may want 29h2 to refer back to 08h2.
- pre-h1 lesson 91 uses "counterexample" and does not redefine it. No conflict.

## Uncertain

- Nothing material. Whether Liu Hui or the Nine Chapters text itself first gives the red/black rod colors varies between secondary sources. The lesson attributes the colors to Liu Hui's commentary, which is the usual reading.

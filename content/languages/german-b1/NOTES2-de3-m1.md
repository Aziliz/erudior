# Round 2 notes: German B1, module de3-m1 (Stories and time)

## Honors lessons (2)
- `lessons/05h1-futur-zwei.md`, id `de3-m1-h-futur-zwei`: **Looking back from the future: Futur II**
  (45 min, about 2,100 words). Form (werden + perfect infinitive, word order in main, subordinate and question
  clauses), use 1 (finished by a future point, with the everyday perfect alternative), use 2 (guess
  about the past, contrasted with Futur I + wohl), receptive notes on muss + perfect infinitive and the
  passive Futur II, a decision diagram, a six-tense timeline picture, two worked examples, an original
  crime scene in Tatort style (dialogue + translation), pronunciation, common mistakes, key points.
- `lessons/05h2-time-phrases.md`, id `de3-m1-h-time-phrases`: **Clause or phrase? Time in written German**
  (45 min, about 2,000 words). Time conjunction ↔ preposition pairs (bei, nach, vor, während + Gen preview, seit,
  bis zu, gleich nach), building the noun (-ung, stem nouns, nominalised infinitive with beim/zum),
  subject → possessive/genitive, tense disappearing and being restored, receptive ehe / sooft / kaum …, als,
  two worked examples, a museum plaque (picture) about a fictional photographer plus the guide's spoken
  version (translation), pronunciation, common mistakes, key points.
  Both topics are listed as B2 in RESEARCH.md (Futur II, nominalization), so they are a real step up.

## Core lessons (additions only)
| lesson | added |
|---|---|
| 01 Präteritum | Mermaid: weak/strong/mixed decision chart; SVG `de3-m1-bracket.svg` (separable verb bracket) |
| 02 Plusquamperfekt | SVG `de3-m1-timeline.svg` (past perfect / simple past / present); Mermaid: nach / nachdem / danach (vor / bevor / vorher) |
| 03 Temporal clauses | Mermaid: als or wenn; SVG `de3-m1-time-clauses.svg` (während, seit, bis, sobald as bars) |
| 04 Futur | Mermaid: present or werden for the future; Mermaid: the jobs of werden |
| 05 n-nouns | SVG `de3-m1-n-declension.svg` (der Kollege vs der Tisch); Mermaid: is it a weak noun? |

## Questions (`questions/r2-de3-m1.yaml`, 55)
- Core `de3-m1-r2-q01`–`q25` (5 per lesson, 10 `module_quiz`): text 8, match 5, order 5, select-all 5, label 3
  (bracket, timeline, time-clause bars). Every lesson has text + order/match + select-all; label where a picture fits.
- Honors `de3-m1-r2-h01`–`h30` (15 per lesson): multiple choice 18, text 5, match 2, order 2, select-all 2,
  label 1 (tense timeline); one MC uses the plaque image.

## Pictures and diagrams
- SVGs in `images/`: `de3-m1-bracket`, `-timeline`, `-time-clauses`, `-tenses` (each with a `-blank` copy for
  label questions), `de3-m1-n-declension`, `de3-m1-plaque`. All previewed; markers checked on the blanks.
- Mermaid: 8 diagrams (6 in core lessons, 1 per honors lesson); all previewed.

## Vocabulary, glossary, cards
- `vocab-r2-de3-m1.yaml`: 28 words (w01–w19, w21–w29; w20 *der Tod* was dropped because German A2 round 2
  now adds it as de2-m6-r2-w39). Checked by term + pos and by first meaning against every vocab file in
  german-a1, german-a2 and german-b1, including all r2 files: no duplicates.
- `glossary-r2-de3-m1.yaml`: Futur II, perfect infinitive, prepositional phrase, nominalised infinitive
  (no clash with any B1 glossary file). *nominal style* and *temporal clause* are bolded but already exist.
- `cards-r2-de3-m1.yaml`: 24 cards (12 per honors lesson).

## For the reviewer
- *einbrechen*: vocab note gives the perfect as *ist eingebrochen*; some sources also allow *hat* with *bei*. Left out.
- *der Verdacht* plural given as *die Verdachte (rare)*.
- Claim that the guess use of Futur II is "probably" the one heard more often in conversation is hedged.
- *Tatort*: "has run on Sunday evenings on German public television since 1970, with teams in different cities,
  including Austrian and Swiss ones" (first episode 29 Nov 1970) — from general knowledge, please confirm.
- Order questions were written with an English target sentence and a fixed first word so only one order is right;
  please double-check `q05`, `q15`, `q19`, `q24`, `h11`, `h27`.
- `q09` treats *Nachdem er aß, ging er spazieren* as wrong in written German, as lesson 2 teaches.

## Errors found in existing content
None.

## Check status
`content/math/check-module.sh german-b1 de3-m1` currently fails with 20 problems, **none in de3-m1 files**:
German A2 round-2 vocab files (de2-m3-r2, de2-m6-r2, de2-h1-r2) now add words that already exist in B1 vocab-m1
(berichten, erscheinen, der Leser, die Leserin, der/die Verwandte, die Ehe, ein Erwachsener, ein Jugendlicher,
die Bevölkerung, ein Deutscher, eine Deutsche), plus two A2-internal clashes. The A2 writers or the coordinator
need to resolve these (I did not touch A2 or B1 m1 vocab). With the A1/A2 r2 vocab files left out (scratch copy),
the same check builds and the checker reports OK: 7 lessons, 115 questions, 24 cards, 75 terms, 0 problems.

## Sources
Duden and DWDS for verb forms, genders and plurals (from knowledge, not fetched in this session); course RESEARCH.md for B1/B2 scope.
All texts, examples and the plaque person are original.

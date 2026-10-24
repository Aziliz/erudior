# Round 2 notes: module de1-m1 (First steps)

`content/math/check-module.sh german-a1 de1-m1`: build and checker report zero problems
(7 lessons, 114 questions, 35 cards, 101 terms, 153 words).

## Added

**Honors lessons** (3; the module's four core lessons cover four different areas, so each honors
lesson extends one or two of them)
- `lessons/04h1-sounds-in-depth.md` (de1-m1-h-sounds-in-depth, "Sounds in depth: vowel length,
  the glottal stop and sentence melody", 45 min, about 2,200 words): reading vowel length from
  spelling (open syllables, word families, short function words), schwa and vocalic r (bitte /
  bitter), the glottal stop (ein | Ei, Spiegelei, verreisen / vereisen), more letter groups (pf,
  chs, ng, -tion, v and y in loanwords), intonation, regional standard pronunciations (-ig as -ik,
  initial ch, rolled r), the 1996 spelling reform and the capital ẞ (2017). Examples: vowel length
  for six words; reading Mittagessen aloud; the traditional tongue twister "Fischers Fritz".
  Original reading: a learner's voice message.
- `lessons/04h2-german-speaking-world.md` (de1-m1-h-german-world, "du, Sie and the
  German-speaking world", 45 min, about 2,000 words): where German is official (D, A, CH, LI, LU,
  east Belgium, South Tyrol), DACH, Hochdeutsch and dialects, Swiss German, German as a
  pluricentric language (Jänner, Velo, Strasse), regional greetings (Moin, Grüß Gott, Grüß dich,
  Servus, Grüezi, Hoi), duzen/siezen (du duzt, links to Lesson 4's -z rule), how people switch
  from Sie to du, groups (ihr/Sie), titles. Examples: choosing the form of address; forms of
  duzen/siezen; reading between the lines. Original reading: an e-mail from Vienna.
- `lessons/04h3-numbers-in-life.md` (de1-m1-h-numbers-life, "Numbers in everyday life: sums,
  grades and handwriting", 40 min, about 1,850 words): plus/minus/mal/geteilt durch, German maths
  signs (· and :), the present-tense e-insertion after consonant + m/n (rechnen, zeichnen, öffnen
  vs lernen, wohnen), number nouns (die Eins), grade scales in Germany (1–6), Austria (1–5) and
  Switzerland (6–1, pass 4), counting from the thumb, the crossed 7, Zahlendreher and the
  Zwanzigeins proposal. Examples: reading sums; choosing verb forms; good or bad grade news.
  Original reading: homework at the kitchen table.

Topics, cross-references and vocabulary stay within what Lessons 1–4 taught; later grammar in
the readings (im Sommer, in einem Büro, mit den Fingern in a vocab example) is glossed.

**Core lessons 01–04** (additions only; a sentence or two introduces each picture):
- 01: Mermaid "ß or ss?", Mermaid "Which ch sound?", SVG side view of the mouth (de1-m1-mouth)
  with a short paragraph on where ich-ch, ach-ch, the throat r and ü/ö are made (labelled as
  simplified).
- 02: Mermaid "du or Sie with one person", SVG greetings by time of day (de1-m1-greeting-times).
- 03: SVG reading order of 73 (de1-m1-number-73), SVG labelled envelope address (de1-m1-envelope).
- 04: Mermaid "choosing the du and er endings", SVG verb positions (de1-m1-verb-slots).

**Pictures** (13 SVGs, original, 1–8 KB each, all rendered and checked): de1-m1-mouth,
-mouth-blank, -greeting-times, -greeting-times-blank, -envelope, -envelope-blank, -number-73,
-verb-slots, -melody, -dach-map, -dach-map-blank, -digits, -grades. Blank copies are for label
questions; markers were checked with preview-figure --markers.

**Diagrams** (6 Mermaid, all with accTitle/accDescr, rendered): ß or ss; which ch; du or Sie;
du/er endings; long or short vowel (04h1); switching from Sie to du (04h2).

**Questions** (62, in `questions/r2-de1-m1.yaml`)
- Core de1-m1-r2-q01…q20, 5 per lesson. Each lesson has a text, a match or order, a select-all
  and (01–03) a label question: label 3 (q01 mouth, q06 greetings, q11 envelope), text 5 (q02,
  q07, q12, q13, q16), match 3 (q04, q10, q18), order 3 (q08, q15, q17), select-all 4 (q03, q09,
  q14, q19), MC 2 (q05, q20). module_quiz: q02, q05, q10, q12, q15, q17.
- Honors h01–h14 (sounds: 9 MC, 1 text, 1 match, 2 select-all, 1 order), h15–h28 (German-speaking
  world: 7 MC, 1 label, 2 text, 2 match, 1 select-all, 1 order), h29–h42 (numbers: 7 MC, 3 text,
  1 match, 2 select-all, 1 order). No module_quiz (core-module honors).
- Answer positions of the 25 four-choice MC questions: 0: 5, 1: 8, 2: 7, 3: 5.

**Vocabulary** (`vocab-r2-de1-m1.yaml`, 30 words, ids de1-m1-r2-w01…w30): 04h1 die Aussprache,
aussprechen, der Akzent, die Silbe, der Laut, das Spiegelei, verreisen, der Zungenbrecher;
04h2 duzen, siezen, Servus, Moin, Grüezi, Grüß dich, Liechtenstein, Luxemburg, Belgien, die
Muttersprache, Hochdeutsch; 04h3 rechnen, zählen, zeichnen, plus, minus, mal, geteilt durch, der
Finger, der Daumen, die Eins, Mathe. Checked against every vocab file in German A1, A2 and B1
(ids, term + part of speech, first meaning): no clashes. Avoided on purpose because A2/B1 own
them: die Note, das Zeugnis, der Dialekt, der Kollege, die Chefin, höflich, betonen, das Ergebnis.

**Glossary** (`glossary-r2-de1-m1.yaml`, 16 terms, checked against every glossary*.yaml in the
course, including other writers' r2 files): open syllable, schwa, vocalic r, glottal stop,
minimal pair, loanword, intonation, spelling reform, official language, standard German, dialect,
Swiss German, pluricentric language, cardinal number, number noun, decimal comma. Every bolded
term in the honors lessons has an entry.

**Cards** (`cards-r2-de1-m1.yaml`, 35): 12 sounds, 12 address/countries, 11 numbers.

## For a reviewer to double-check
- The mouth diagram is schematic: the ach-sound is placed at the soft palate (after a it is often
  further back, uvular) and the throat r at the uvula. Labelled "simplified" in the lesson.
- The map uses rough hand-made outlines ("Simplified outlines, not exact borders"); Ostbelgien is
  shown but not used in the label question.
- Hedged claims worth a look: the origin of Moin (debated; stated as such); the glottal stop being
  weaker in the south/Austria/Switzerland; "most Germans" counting from the thumb; Austrian use of
  titles; "German is the most widely spoken first language in the EU"; about 80,000 people in the
  German-speaking community of Belgium.
- Sums: "ist" given as the usual verb, with "sind" mentioned as also heard (Duden allows both), so
  no question marks "sind" wrong.
- q02 accepts only ß for Stra___e, since the stem says "as written in Germany".
- The envelope label markers sit on the words themselves, so they partly cover the text.

## Errors found in existing content
None. No existing question, card or glossary entry was edited.

## Sources
- Rat für deutsche Rechtschreibung, press release 29 June 2017 (capital ẞ allowed):
  https://www.rechtschreibrat.com/DOX/rfdr_PM_2017-06-29_Aktualisierung_Regelwerk.pdf
- Zwanzigeins e.V. (number-naming proposal): https://zwanzigeins.justedit.com
- Grade scales, official languages, the 1996/2006 spelling reform, regional pronunciation: standard
  reference knowledge (Duden pronunciation conventions; national school grading systems),
  written in my own words.

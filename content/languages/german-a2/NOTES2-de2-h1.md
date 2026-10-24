# Round 2 notes: de2-h1, "Honors: Lesen und Hören (reading and listening)"

Writer for item 161. Honors module, so all four lessons are new (files 90–93); no core lessons touched.
`content/math/check-module.sh german-a2 h1`: build and checker OK, zero problems (4 lessons, 56 questions,
43 cards, 45 words). `check-module.sh german-b1 m6` also builds clean with these words carried into B1.

## Lessons

| file | id | title | words* | minutes |
|---|---|---|---|---|
| 90-lesestrategien.md | de2-h-lesestrategien | Reading strategies: skim, scan and read closely | ~2,080 | 45 |
| 91-woerter-erschliessen.md | de2-h-woerter | Unknown words: compounds, word families and context | ~1,640 | 45 |
| 92-hoeren.md | de2-h-hoeren | Listening: announcements, voice messages and real spoken German | ~1,910 | 45 |
| 93-geschichten.md | de2-h-geschichten | Stories and a poem: reading literature in German | ~2,180 | 50 |

*Not counting Mermaid source and image alt text.

- 90: three ways of reading (skimming, scanning, detailed reading) with a decision chart; text types and
  their clues (Aushang, Plakat, Anzeige, Zettel, Infotafel, Meldung); a notice-board picture with four
  original texts; the small words that decide answers (nur, erst, schon, noch nicht, nicht mehr, außer, ab,
  bis spätestens, ohne); an original news report ("Bibliothek der Dinge", fictional town Neustadt) and how
  the lead works. 3 worked examples.
- 91: reading compounds from the back (head word and modifier; gender and plural from the head word;
  linking -s-/-n-/-e-), word families, meaning-bearing prefixes and suffixes (-er, -ung, -heit/-keit,
  -lich/-ig, -bar, -los, un-), false friends, guessing from context, finding the dictionary form. 3 worked
  examples. Builds on A1 lesson 5 (suffixes for gender); B1 lesson 25 later covers word formation for
  gender/production, so this lesson keeps to guessing meaning while reading.
- 92: reductions (hab, ham, is, nich/net, 'nen, grad, vorm…), modal particles, filler words, tag
  questions, self-corrections, the structure of station announcements (chart + departures board + three
  transcripts), an informal voice message with note-taking in Stichworte, number traps (units first,
  -zehn/-zig, halb drei). 3 worked examples. Extends lessons 19 and 24 without repeating them.
- 93: narrator and tense in stories, story words, the Grimms' collection, more strong simple past forms
  for recognition, an original fairy tale ("Lina und der Vogel", ~200 words, with translation), the
  fairy-tale path (chart), and Goethe's "Wandrers Nachtlied" (public domain) with a line-by-line reading:
  old forms, diminutives, rhyme and rhyme scheme, history. 3 worked examples.

## Pictures and diagrams

- SVG (original, checked in previews): `images/de2-h1-board.svg` (notice board, also used for a label
  question), `de2-h1-compound.svg` + `-blank`, `de2-h1-departures.svg` + `-blank`, `de2-h1-poem.svg` +
  `-blank`. All under 6 KB.
- Mermaid: 4 (choosing how to read; what to do with an unknown word; how a station announcement is built;
  the usual path of a fairy tale). All previewed.

## Questions (`questions/r2-de2-h1.yaml`, ids de2-h1-r2-h01…h56)

14 per lesson, 5 per lesson `module_quiz: true` (20 of 56). By type: 32 multiple choice (answer index
evenly spread, 8 each of 0–3), 4 select-all, 8 text, 4 match, 4 order, 4 label (one per lesson). 24 of 56
are new types.

## Vocabulary, glossary, cards

- `vocab-r2-de2-h1.yaml`: 45 words (ids de2-h1-r2-w01…w45): 11 + 10 + 11 + 13 across lessons 90–93.
  Checked on 2026-10-23 against every A1, A2 and B1 vocab file, including other writers' r2 files (term +
  pos, first meaning, id). Words already taken elsewhere are only glossed in the lessons: Zettel, Titel,
  flüstern (A2 r2), Richtung, klingeln (A1 r2), kaum (B1 r2), Gipfel, Hütte, Hof, König, Stimme,
  Verbindung, ausfallen, Bahnsteig, Fahrgast, kostenlos, pflegen, voraussichtlich (B1). To avoid clashes
  I changed two first meanings: Überschrift "heading (of a text)" (B1 Schlagzeile = headline) and Gegenteil
  "opposite (the contrary)" (A1 gegenüber = opposite).
- `glossary-r2-de2-h1.yaml`: 20 terms, one for every bolded term: skimming, scanning, detailed reading,
  text type, lead, head word, modifier, word family, prefix, suffix, false friend, context, reduction,
  modal particle, filler word, tag question, narrator, diminutive, rhyme, rhyme scheme. No term or alias is
  in any other A2 glossary file (checked at the time of writing).
- `cards-r2-de2-h1.yaml`: 43 cards (11 / 10 / 10 / 12 for lessons 90–93), topics matching the lessons.

## For a reviewer to double-check

- Goethe poem text follows the 1815 printing ("Die Vögelein schweigen im Walde"); the lesson notes that
  printed versions differ (Vögel / Vöglein / Vögelein). The date (6 September 1780 by most accounts; Goethe
  later gave 1783) is given as "by most accounts … September 1780"; first printed 1815 as "Ein Gleiches";
  Schubert's setting is D 768 (1823). Interpretation of the last lines (sleep or death) is labelled as an
  interpretation.
- Regional claims are written as tendencies, not rules: halt (more southern) vs eben; ne? (north),
  gell?/gelt? (south, Austria), oder? (everywhere, especially Switzerland); net for nicht (south, Austria).
- Train announcements: genders der ICE / der RE / die RB / die S-Bahn; "Zurückbleiben, bitte!" is credited
  to Berlin's U-Bahn. Trains, times and the station are illustrative, not a real timetable.
- Lesson 92 points to Deutsche Welle's free courses (Nicos Weg, on the reading list) and its slowly spoken
  news, with "offers change, so check".
- Dates on the notice board are consistent (Tuesday 14 May → Saturday 18 May).

## Errors found in existing content

None found in the files I read (A2 lessons 02, 19, 24; A1 05; course notes).

## Sources

- Wandrers Nachtlied: text of the 1815 printing, dating and variants as summarised on
  figures-of-speech.com ("Über allen Gipfeln", 2020) and standard editions; Schubert D 768.
- Grimm, Kinder- und Hausmärchen, vol. 1 (1812).
- Goethe-Zertifikat A2 format: as in this course's RESEARCH.md and lesson 24.
- German forms (genders, plurals, strong past forms, Stichworte/Stichwörter) checked against
  Duden/DWDS conventions; all example texts, dialogues, the news report and the fairy tale are original.

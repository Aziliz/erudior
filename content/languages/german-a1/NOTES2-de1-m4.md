# Round 2 notes: module de1-m4 (Free time and plans)

`content/math/check-module.sh german-a1 de1-m4`: build and checker report zero problems
(6 lessons, 98 questions, 26 cards, 101 terms, 142 words). The only warning is about another
writer's file (questions/r2-de1-m1.yaml had a YAML error at the time of checking).

## Honors lessons

- `lessons/16h1-clubs-quiet-hours.md`: **Clubs, quiet hours and favourite things**
  (de1-m4-h-vereine, 45 min, about 2,200 words incl. tables). Vereine and e. V. (with club and
  membership figures), an original tennis-club notice, Sunday rest (Art. 140 GG / Art. 139 WRV),
  Nachtruhe, Mittagsruhe (labeled as house-rule dependent, not a general law), an original
  Hausordnung, the Lieblings- prefix, lieber … als …, a like/dislike scale, an e-mail text.
  Examples: reading the notice; answering with nicht dürfen from a house rule; building a
  lieber … als comparison. Quiet-hours SVG and a "how to say what you like" Mermaid chart.
- `lessons/16h2-holidays-date-ranges.md`: **The German year: holidays, customs and date ranges**
  (de1-m4-h-feiertage, 45 min, about 2,200 words). The nine nationwide public holidays, 3 October
  as the only one set by federal law, state holidays, Austria/Switzerland national days, Easter
  arithmetic, customs (Silvester, Karneval/Fasching, Ostern, Sankt Martin, Advent, Nikolaus,
  Bescherung on the 24th), birthday customs (early congratulation labeled as a superstition),
  ordinals as adjectives (der + -e; am/vom/zum/den + -en), date ranges, the letter date
  ("Hamburg, den 6. Dezember 2026"), an original card text. Examples: reading a Christmas-market
  sign; Easter Monday/Good Friday 2027; writing a greeting card. Holiday calendar SVG and a
  date-pattern Mermaid chart.

## Core lessons (additions only)

- 13: hobbies picture (6 tiles), stem-change decision chart (Mermaid), gern/lieber/am liebsten
  steps picture.
- 14: sentence-bracket picture (statement and W-question), "which modal" chart (Mermaid).
- 15: nicht dürfen vs nicht müssen chart (Mermaid), four signs picture.
- 16: seasons year wheel (with a sentence on meteorological vs calendar seasons), weather
  picture, invitation-answer chart (Mermaid).

## Pictures (13 SVGs, all original, 2–8 KB, rendered and checked; markers checked)

de1-m4-hobbies, -hobbies-blank, -gern-steps, -bracket, -bracket-blank, -signs, -signs-blank,
-weather, -weather-blank, -seasons, -quiet-hours, -holidays, -holidays-blank.

## Diagrams (6 Mermaid, all with accTitle/accDescr, rendered)

Stem-change decision (13), choosing können/wollen/möchten/mögen/gern (14), nicht dürfen vs
nicht müssen (15), answering an invitation (16), how to say what you like (16h1), which date
pattern (16h2).

## Questions (50 new, questions/r2-de1-m4.yaml)

- Core de1-m4-r2-q01…q22 (22): text 6 (q01, q02, q07, q12, q17, q18), order 4 (q03, q08, q16,
  q19), match 4 (q04, q09, q13, q22), select-all 4 (q05, q10, q14, q21), label 4 (q06 hobbies,
  q11 sentence bracket, q15 signs, q20 weather). module_quiz: q01, q06, q07, q11, q12, q15, q18,
  q20 (two per lesson).
- Honors h01…h14 (clubs, 14: 8 MC, 3 text, 1 order, 1 match, 1 select-all) and h15…h28
  (holidays, 14: 8 MC, 2 text, 1 order, 1 match, 1 label, 1 select-all).
- Answer positions of the 16 MC questions: 4 each at 0, 1, 2, 3.

## Glossary, cards, vocabulary

- glossary-r2-de1-m4.yaml: prefix, adjective ending (checked against every glossary*.yaml,
  including other writers' r2 files).
- cards-r2-de1-m4.yaml: 22 cards (11 per honors lesson).
- vocab-r2-de1-m4.yaml: 21 words (de1-m4-r2-w01…w20, w22): der Sportverein, der Chor, das
  Tennis, das Schach, die Halle, die Nachtruhe, die Mittagsruhe, der Lieblingsfilm, die
  Lieblingsfarbe, das Lieblingsessen; Frohes neues Jahr!, Frohe Ostern!, Alles Gute zum
  Geburtstag!, der Fasching, der Nikolaustag, der Weihnachtsmarkt, die Laterne, das Osterei,
  der Adventskranz, das Plätzchen, die Mitternacht. Checked against A1, A2 and B1 vocabulary
  (term and first meaning). w21 (dauern) was dropped because de1-m3's r2 file now has it.
  Words A2/B1 already teach (der Verein, das Mitglied, der Feiertag, Weihnachten, Ostern,
  Silvester, Guten Rutsch!, kostenlos, der Müll, das Treppenhaus, trainieren …) are only glossed
  in the lesson text, so A2/B1 builds won't get duplicates. "als" (than) was not added: A2 has
  als (conjunction, "when"), and the same term + pos would clash.

## For a reviewer to double-check

- Figures: ZiviZ count of 628,992 registered clubs (March 2026) rounded to about 629,000; DOSB
  2025: about 86,000 sports clubs and about 29.3 million memberships.
- Bavaria "12 to 14 holidays depending on the town" (13 in most of the state with a Catholic
  majority; 12 without Mariä Himmelfahrt; Augsburg 14 with the Friedensfest).
- Ascension = Easter Sunday + 39 days, Whit Monday + 50; Easter 2027 = 28 March (computed with
  dateutil).
- Mittagsruhe is described as house-rule/local, Nachtruhe as "usually 22 to 6"; the quiet-hours
  picture says it is a simplified guide.
- Lesson 16's existing dialogue has Tom congratulating early; 16h2 mentions this as a contrast
  (no change to lesson 16's text).
- Vocab clash risk: other writers working now could add the same words (e.g. a de1-h1 culture
  module adding Fasching or Weihnachtsmarkt); a final full build will catch it.

## Errors found in existing content

None.

## Sources

- ZiviZ, "Vereinssterben oder neue Gründungsdynamik?" (2026):
  https://www.ziviz.de/sites/ziv/files/2026-09/vereinssterben_oder_neue_gruendungsdynamik.pdf
- DOSB Bestandserhebung 2025 press release (via Deutscher Basketball Bund):
  https://www.basketball-bund.de/wp-content/uploads/sites/2/2025/11/2025_11_11_PM-Bestandserhebung-2025_Mitgliederrekord.pdf
- Night quiet hours: https://www.anwalt.org/nachtruhe/ ; Mittagsruhe:
  https://www.oekotest.de/geld-versicherungen/muss-man-sich-als-mieter-immer-an-die-mittags-und-nachtruhe-halten_15628_1.html
- Bavarian holidays: https://www.feiertage-deutschland.de/bundesland/bayern/
- Basic Law Art. 140 / WRV Art. 139; Unification Treaty Art. 2(2) (3 October); 32. BImSchV § 7
  (lawn mowers on Sundays and holidays); standard reference knowledge for holiday dates and
  customs.

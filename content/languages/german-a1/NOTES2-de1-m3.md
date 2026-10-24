# Round 2 notes: module de1-m3 (Food, shopping and time)

`content/math/check-module.sh german-a1 de1-m3`: build and checker report zero problems
(6 lessons, 98 questions, 34 cards, 101 terms, 157 words).

## Added

**Honors lessons** (`honors: true`, `module: de1-m3`, 45 min each)
- `lessons/12h1-food-culture.md` (de1-m3-h-food-culture), "Honors: Brötchen, Kaffee und Kuchen —
  eating the German way", about 2,000 words. A traditional day of meals (labeled as simplified),
  Guten Appetit / satt / Mahlzeit!, German bread culture (national intangible heritage list, 2014),
  regional names for the bread roll (Brötchen, Semmel, Schrippe, Weck, Rundstück; labeled as
  simplified), Austrian food words (Erdapfel, Paradeiser, Schlagobers, Topfen), polite orders with
  *Ich hätte gern* + accusative (subjunctive), *noch ein(en)* and *kein … mehr*, paying and tipping
  (Zusammen oder getrennt?, saying the total, Stimmt so, cash-only shops). 3 worked examples, a
  reading text (Sonntag bei Oma), a bakery dialogue in Munich, pronunciation, common mistakes, key points.
- `lessons/12h2-week-planning.md` (de1-m3-h-week-planning), "Honors: Planning the week — opening
  hours, habits and time without a preposition", about 1,800 words. Reading opening-hours signs
  (geöffnet, geschlossen, Ruhetag, feiertags; Sunday closing, rules set by the states), -s adverbs
  of time (montags, abends, nachts), the accusative of time (jeden, nächsten, diesen, den ganzen
  …), duration with *dauern*, gegen / kurz nach / Punkt, frequency scale with meistens and selten,
  einmal pro Woche, two time phrases in one sentence. 3 worked examples, reading (Unsere Woche).

**Core lessons** (additions only: an introducing sentence plus the figure)
- 09: breakfast-table picture; "nominative or accusative?" flowchart.
- 10: labeled price tag (1.299,95 €); shopping-conversation steps flowchart.
- 11: clock face for the hour 3–4 (nach / vor / halb); parts-of-the-day bar; um/am/in der/von…bis chart.
- 12: sentence-slot picture (Morgen früh | rufe | ich | meine Mutter | an.); separable-verb flowchart.

**Pictures** (12 original SVGs in `images/`, 1–9 KB, all rendered and checked, blanks checked with
markers): de1-m3-breakfast(+blank), de1-m3-price-tag(+blank), de1-m3-clock(+blank),
de1-m3-day-parts, de1-m3-sentence-slots(+blank), de1-m3-meals(+blank), de1-m3-hours.

**Diagrams** (6 Mermaid, all with accTitle/accDescr, rendered): accusative choice, shopping steps,
time prepositions, separable verbs (core); paying in a café (12h1); choosing a time expression (12h2).

**Questions** (`questions/r2-de1-m3.yaml`, 50 new)
- Core de1-m3-r2-q01…q20 (5 per lesson): label 4, text 4, match 4, order 4, select-all 4.
  module_quiz: q01, q02 (09), q07, q08 (10), q11, q12 (11), q16, q20 (12).
- Honors food culture h01…h15: 8 MC, 2 text, 2 select-all, 1 match, 1 label, 1 order.
- Honors week planning h16…h30: 9 MC, 3 text, 1 match, 1 order, 1 select-all.
- Answer positions of the 17 new MC questions: 0: 4, 1: 4, 2: 5, 3: 4.

**Vocabulary** (`vocab-r2-de1-m3.yaml`, 33 words, ids de1-m3-r2-w01…w33): 15 for 12h1 (die Semmel,
die Brezel, die Sahne, der Quark, die Marmelade, der Honig, das Abendbrot, die Mahlzeit, satt,
Guten Appetit!, Stimmt so., Ich hätte gern, die Scheibe, das Bargeld, der Bäcker), 18 for 12h2
(montags, sonntags, morgens, abends, nachts, nächste Woche, jeden Tag, den ganzen Tag, gegen,
dauern, meistens, selten, einmal, pro, geöffnet, geschlossen, die Öffnungszeiten, der Ruhetag).
Checked against every vocab file in German A1, A2 and B1 (term + pos, id, first meaning): no
clashes. Restaurant words that A2 owns (Speisekarte, Rechnung, Trinkgeld, Tasse, Zucker, Torte…),
B1's Pfand and A2's ab, Kalender, Feiertag, Uhrzeit are only used glossed, not added.

**Glossary** (`glossary-r2-de1-m3.yaml`, 4): regional variant, subjunctive, accusative of time,
adverb of time. *Standard German* is bolded in 12h1 but uses the m1 writer's existing entry.

**Cards** (`cards-r2-de1-m3.yaml`, 23): 12 for 12h1, 11 for 12h2.

## For a reviewer
- Cultural generalizations (meal pattern, Abendbrot region, regional roll names, tipping 5–10 %,
  Sunday closing) are labeled simplified in the text; regional borders for Semmel/Weck/Rundstück are fuzzy.
- Watch for later clashes: if an A2/B1 writer adds montags, gegen, dauern, meistens, selten, satt,
  Sahne, etc. in their own round 2, their build will report the A1 duplicate.
- The de1-h1 honors module (91-zusammen-wohnen) covers Pfand and quiet Sundays; 12h2 only mentions
  Sunday shop closing briefly.
- Prices in examples and dialogues recomputed (7,60 € + tip → 8,40 €, change 1,60 €; bakery
  4 × 0,45 + 0,90 + 2 × 2,20 = 7,10 €, change 2,90 €; 66,5 opening hours a week).

## Errors found in existing content
None.

## Sources
- KMK, 12.12.2014: 27 Kulturformen ins deutsche Verzeichnis des immateriellen Kulturerbes
  aufgenommen (includes "Deutsche Brotkultur"):
  https://www.kmk.org/aktuelles-1/artikelansicht/27-kulturformen-ins-deutsche-verzeichnis-des-immateriellen-kulturerbes-aufgenommen.html
- Regional names for Brötchen: German Way, https://german-way.com/?p=5956 (cross-checked with
  general dictionary knowledge; presented as approximate).

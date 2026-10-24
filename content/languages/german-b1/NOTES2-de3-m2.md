# Round 2 notes: de3-m2 (Reasons, goals and contrasts)

Module check: `content/math/check-module.sh german-b1 de3-m2` gives 7 lessons, 113 questions, 24 cards. Build and checker report 0 problems.

## Honors lessons (2)

- `lessons/10h1-contrast-exceptions.md`, `de3-m2-h-contrast`: **Whereas, however, unless: contrast and exceptions** (45 min). Covers contrast vs concession; während/wohingegen; dagegen/hingegen/im Gegensatz dazu, including the position after the first element; im Gegensatz zu + dative; allerdings (limiting, and *Allerdings!* as an answer); es sei denn + main clause, außer wenn, sonst/andernfalls. Culture: Sunday shop closing. Reading: an exchange student's blog, "Das ist bei uns anders". Diagram: Mermaid chart "contrast, concession, limit or exception?". Picture: bakery door sign (`de3-m2-bakery-sign.svg`).
- `lessons/10h2-even-if-argument.md`, `de3-m2-h-argument`: **Even if, no matter how: concessive conditions and the argument essay** (50 min). Covers auch wenn and selbst wenn (vs obwohl); wenn … auch (receptive); egal wie/was/ob and wie … auch with subject-first main clauses; the structure and signposts of an Erörterung. Model essay: "Sollte man das Bargeld abschaffen?". Diagram: Mermaid chart of the essay structure. Picture: `de3-m2-concession-scale.svg` (obwohl, auch wenn, selbst wenn).

Each lesson has two worked examples, "Common mistakes" and "Key points". Word counts with the English translations and diagrams included: 2,558 and 2,148. The prose alone is about 2,150 and 1,800, in line with the core lessons (2,066–2,498).

## Core lessons: additions only

| Lesson | Added |
|---|---|
| 06 obwohl | Mermaid "weil, deshalb, obwohl or trotzdem?"; SVG word-box diagram `de3-m2-obwohl-trotzdem.svg` (+ `-blank`) |
| 07 um-zu-damit | Mermaid "um … zu, damit, ohne … zu, ohne dass, statt … zu"; SVG campus scene `de3-m2-campus.svg` (+ `-blank`) |
| 08 da-falls | SVG contract timeline `de3-m2-contract.svg` (+ `-blank`); Mermaid insurance-claim flow (steps from Tobias's letter) |
| 09 two-part | SVG chart of the pairs `de3-m2-pairs.svg`; SVG building types `de3-m2-houses.svg` (+ `-blank`) |
| 10 je-desto | `plot` of je mehr …, desto mehr / weniger (labelled simplified, not real data); Mermaid "am schnellsten or der schnellste?"; SVG podium `de3-m2-podium.svg` |

Each addition comes with one or two introducing sentences; no existing text was changed.

## Questions (`questions/r2-de3-m2.yaml`, 53)

- Core (q01–q25, 5 per lesson): 5 text, 4 label, 6 match, 5 order, 5 select-all. 10 are marked `module_quiz` (2 per lesson).
- Honors (h01–h28, 14 per lesson): 16 multiple choice (correct answers spread evenly, 4 on each index), 4 text, 4 match, 2 order and 2 select-all. That makes 12 of 28 new types.
- The label questions use the `-blank` SVGs. I checked every marker in a preview. On the obwohl/trotzdem diagram the markers sit under the boxes so the words stay visible.

## Vocabulary, glossary, cards

- `vocab-r2-de3-m2.yaml`: 31 words, 15 for the contrast lesson and 16 for the argument lesson. Each was checked against every vocab file in german-a1, german-a2 and german-b1 (including the other writers' r2 files) and against PRIOR-WORDS.tsv, by term + part of speech, by term alone and by first meaning: no duplicates. Bargeld, Öffnungszeiten and Höflichkeit already exist in A1/A2 round-2 files, so I left them out and only use them in the text.
- `glossary-r2-de3-m2.yaml`: adversative connector, exceptive clause, concessive conditional clause, argumentative essay. No term or alias clashes with any german-b1 glossary file.
- `cards-r2-de3-m2.yaml`: 24 cards (12 per honors lesson), with topics Contrast, Connectors, Culture, Concession and Argument.

## For the reviewer

- **Bundesbank claim:** "cash is still the most-used means of payment at the checkout, but its share is falling" comes from the Bundesbank's press release on its *Zahlungsverhalten in Deutschland 2023* study. I deliberately left out percentages.
- **Shop opening hours:** described in general terms: Sunday rest is protected by law, the detailed hours are set by each Bundesland, and stations, airports, petrol stations and (in many states) bakeries are typical exceptions. The lesson also says Austria and most of Switzerland largely keep Sunday free of shopping.
- **Lesson 08 timeline:** labelled "example"; the text says the rules depend on the contract and the country. It does not cover the German rule since 2022 on cancelling contracts monthly once they have been renewed.
- **es sei denn:** the lesson says a comma always comes before it and that this course also writes one after *denn*. It does not claim the second comma is required.
- **Word order after fronted clauses:** after *auch wenn* the lesson teaches inverted word order for writing. After *egal …* and *wie … auch* clauses it gives subject-first order as the norm.
- **abwägen:** the note gives both participles, *abgewogen* and *abgewägt*, as Duden does.
- **Images folder:** the de3-m4 writer drew recycling bins, so I kept recycling and Pfand out of the honors lesson to avoid overlap.

## Errors found in existing content

None. No existing questions, cards, glossary entries or vocab were edited.

## Sources

- Deutsche Bundesbank press release "Zahlungsverhalten in Deutschland 2023": https://www.bundesbank.de/de/presse/pressemitteilungen/zahlungsverhalten-in-deutschland-2023-934828
- Austria's single-use deposit since January 2025 (checked while planning, not used in the end): https://www.oesterreich.gv.at/themen/umwelt_und_klima/klima_und_umweltschutz/einwegpfandsystem.html
- Grammar points (es sei denn, wohingegen, hingegen after the first element, abwägen participles) checked against Duden usage.

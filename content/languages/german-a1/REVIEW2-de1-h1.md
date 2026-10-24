# Round 2 review: de1-h1 (Honors: Kultur und Alltag)

Reviewed independently: lessons 90–93, questions/r2-de1-h1.yaml (56), vocab-r2-de1-h1.yaml (53),
glossary-r2-de1-h1.yaml (4), cards-r2-de1-h1.yaml (43), images/de1-h1-* (4 pictures + 4 blanks),
4 Mermaid diagrams. `content/math/check-module.sh german-a1 h1` reports OK after my fixes.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| 90, "Reading a letter from the Amt" | Said the full formal-letter layout (sender, address, date, Betreff) was met in lesson 23; lesson 23 only teaches greeting and closing, the layout is in 24h2 | Points to the module 6 honors lesson for the layout and lesson 23 for greeting/closing | lessons 23, 24h2 |
| 90, "Abbreviations" + glossary `abbreviation` | Said every abbreviation is written with a full stop, then gave PLZ/ICE, which have none | Full stop for abbreviations read as full words; letter-by-letter ones (PLZ, ICE) have no full stop | Duden rules on Abkürzungen (Punkt only for those read as full words) |
| 91, glass containers + card "Where does glass go?" | "only on weekdays": German rules say *werktags*, which includes Saturday | "working days (werktags, includes Saturday), typically 7–20 Uhr, never Sundays/holidays"; card likewise | Umweltbundesamt, Altglassammelbehälter: "werktags von 7:00 Uhr bis 20:00 Uhr" |
| 91, Mermaid "Where does it go?" | First node "Pfand logo?" sends Mehrweg bottles (which often have no logo, but do have Pfand, as the lesson says) to the glass container | Node "Pfand?", accDescr "has a deposit (Pfand)" | lesson's own Pfand section |
| 92, Example 2 | "List its verbs" table and "weak verbs" note silently skip miaute and krähte | Note now names them as weak (miauen, krähen) | — |
| 93, "Words that are only diminutives" + card 46 | Intro said these have no "big" version, but the table includes Brötchen (Brot exists) | Intro adds "or have moved away from it in meaning"; card front "Diminutives that are words of their own" | — |
| 93, table row Kaninchen | "there's no Kanin today": Kanin exists (dated/regional; rabbit fur) | "Kanin survives only in old or regional use" | Wiktionary "Kanin" (dated, dialectal; rabbit fur) |
| 93, Kleingarten | "rent from a club" stated flat; the writer's notes flag it as a simplification but the lesson didn't say so | Added a one-sentence simplification note (club leases from the town, sub-leases plots) | BKleingG (Zwischenpacht), BDG factsheet |
| h10 explanation | "you can't have [a Steuer-ID] yet" is wrong for anyone moving within Germany | Says it isn't needed and, after a first registration, arrives by post later | — |

## Checked and right (a reader might doubt)
- Every question worked before reading the key: 56/56 keys correct, one defensible answer each;
  order questions h09, h16, h34, h54 have a single order (capitalised first tile, story sequence);
  select-alls h10, h24, h38, h46 clean; text answers (z. B., abmelden, den, im, machten, finden,
  Häuschen/Haeuschen) complete. module_quiz: 18 (4/4/5/5).
- Letter dates: 20 Oct 2026 is a Tuesday (computed in Python).
- Anmeldung two weeks (BMG § 17); Austria three days (Meldezettel); Steuer-ID 11 digits;
  Rundfunkbeitrag one per household; Pfand 25 ct single-use, 8/15 ct Mehrweg.
- Grimm: Jacob 1785–1863, Wilhelm 1786–1859, born Hanau, KHM vol. 1 1812, Bremer
  Stadtmusikanten added 1819 (2nd ed.); Märchenstraße ~600 km Hanau–Bremen; Marcks statue 1953.
- Strong/weak forms and participles in 92 (schrie/geschrien, ist gesprungen/geflogen/gefallen,
  hat gestanden with southern ist gestanden, which lesson 22 mentions).
- Kleingarten: BKleingG § 3 (≤400 m², Laube ≤24 m² incl. covered seating, not for living);
  "about a third" from BGH case law (labeled); ~900,000 gardens (BDG). Schreber 1808–1861, Leipzig;
  first Schreberverein 1864, starting with a playground.
- Etymologies: Mädchen < Magd, Märchen < Märe, bisschen < Bissen, Müesli < Mues, Eichhörnchen <
  Eichhorn; regional -le/-li/-erl examples (Häusle, Müesli, Sackerl, Kipferl).
- Vocab: no clash (id, term+pos, exact first meaning as build.py compares it) with any vocab file
  in German A1, A2, B1 including other writers' vocab-r2 files. Glossary terms not defined elsewhere.
- Pictures: all 8 rendered; labeled versions match the text, blanks' markers sit on the named parts
  (h08, h19, h37, h48); nothing cut off. Mermaid: all 4 rendered, readable, accDescr complete.

## Overlap (report only)
- 91's Hausordnung (quiet hours, bikes in stairwell, sorting rubbish) partly repeats 16h1 (module 4
  honors), though 91 points to it and adds infinitive commands, bins, Pfand and Wohin?.
- 90's abbreviations are a different set from 20h2's flat-ad abbreviations; no conflict.
- 90's formal letter reading builds on 24h2 (letter layout); complementary.

## Uncertain
- "der Restmüll" as the name of a bin (label h19) is common shorthand for die Restmülltonne; left.
- The gelbe Tonne row says "plastic and metal" but lists drink cartons (composites), which do go
  there; left as is.

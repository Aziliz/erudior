# Round 2 review: de2-m3 (Describing things), German A2

Reviewer for item 157. I reviewed both honors lessons (12h1, 12h2), the additions to core lessons 09–12,
`questions/r2-de2-m3.yaml` (48 questions, each worked before I read the key), `vocab-r2-de2-m3.yaml`,
`glossary-r2-de2-m3.yaml`, `cards-r2-de2-m3.yaml`, all 9 SVGs (rendered, label markers checked on the
blanks), all 6 Mermaid diagrams (rendered) and the one plot (rendered with preview-plots.mjs).
`content/math/check-module.sh german-a2 de2-m3` reports OK.

## Changes

| Where | Problem | Fix | Source |
|---|---|---|---|
| 12h2, ```plot bar chart | Picture fix. Bar labels ("Zugspitze 2962 m" …) were drawn under the axis on top of the meaningless x tick labels (0.5, 1, 1.5 …), and the y tick labels were cut off at the left ("000"). | Redrew it with `grid: false`, a baseline segment, the height above each bar and the mountain name under it; the caption now says "Height in metres". Re-rendered: nothing overlaps or is cut off. | — |
| `images/de2-m3-landscape.svg` and `-blank.svg` | Picture fix. Both hills ended in vertical cut edges at the river (x = 300 and 360), so they looked clipped. | Hill curves now come down to the horizon on either side of the river; the river's top starts at the horizon; the mountain's base is extended along its own slopes so it stays hidden behind the right hill. Label lines, labels and all six markers of de2-m3-r2-q16 still land on their parts (re-rendered). | — |
| de2-m3-r2-q11 (label, kitchen) | Picture fix. Marker 4 (die Gabel) sat on the fork's neck, below the head and close to marker 5. | Moved to y = 37, on the tines. | — |
| 12h2 reading text and de2-m3-r2-h24 | Factual fix (spelling). "der Genfersee" is the Swiss spelling; standard German (Germany) writes "der Genfer See", which is also exactly what 12h1 teaches about place-name adjectives in -er (separate word, capitalized). | "Genfer See" in the text and in h24 (choice and explanation). | Duden spelling (geographic -er derivatives written separately: Genfer See); course rule: Germany spelling. |
| 12h2, "Find the tools" list after the text | Other fix. It listed *die meisten Menschen* (most) as a tool in the text, but the text says *Viele Menschen denken …*; *die meisten* does not occur in it. | Removed that item from the list. | — |
| 12h1, adjectival-noun table | Factual fix. The strong (no-article) column had "—" for masculine and feminine singular, implying no such forms, while the lesson itself uses the strong masculine *Er ist Deutscher*. | Filled in *als Erwachsener (as an adult)* and *als Erwachsene*. | Duden grammar: adjectival nouns decline strong without article (Erwachsener, Deutscher). |
| Lesson 10, Mermaid "Taking something back" (core addition) | Factual fix. The faulty-product branch said "the guarantee covers it". In Germany a faulty product is covered by the seller's statutory warranty (Gewährleistung, 2 years, BGB §§ 437, 438), whether or not a voluntary guarantee (Garantie) exists. | Box now "reklamieren: the legal warranty covers it"; accDescr explains the legal warranty (usually two years in Germany), whether or not there is also a guarantee. | BGB § 438 (gesetze-im-internet.de). |
| vocab de2-m3-r2-w07 (die Paprika) | Other fix. Duden lists the vegetable as "der oder die Paprika"; a learner typing *der Paprika* would have been marked wrong, and the note implied der was only Austrian. | Added `alt: [der Paprika]`; note now says Duden allows both, der is usual in Austria. | duden.de "Paprika (Gemüse)": der oder die; plural Paprika/Paprikas. |
| de2-m3-r2-h14 explanation | Other fix (same point). Said only "die Paprika is feminine". | Added that Duden also allows der Paprika, in which case one pepper would be "Gefüllter Paprika"; the answer (no article, feminine or plural, nominative → -e) is unchanged. | as above |

## Checked and right (a reader might doubt)

- All 48 answer keys correct, with one defensible answer each. Text accept lists are complete (rotes,
  blauen, zweiten, warmer, mehr, höchste/hoechste, lachenden, Schweizer, Deutscher, doppelt/zweimal,
  größten/groessten, 836). q05 word order has only one correct order; q15 matches the order of lesson 11's
  recipe exactly with no swappable steps; h21 heights in order. Select-alls q04, q09, q14, q19, h08, h22:
  each wrong choice is clearly wrong.
- Numbers (recomputed): 83,900/41,300 = 2.03; 357,600/83,900 = 4.26 ("mehr als viermal"); 83/9.2 = 9.0;
  3,798 − 2,962 = 836; Danube 2,850/Rhine 1,233 = 2.3 ("mehr als doppelt"); museum 2×12 + 8 = 32 €.
- Geography: Zugspitze 2,962 m, Großglockner 3,798 m (newer survey 3,797.74 m), Dufourspitze 4,634 m;
  areas DE 357,588 / AT 83,879 / CH 41,285 km²; Switzerland passed 9 million residents in 2024 (BFS, via
  swissinfo.ch), Austria about 9.2 million (Statistik Austria) — so "Austria has slightly more" holds;
  Vienna (~2.0 m) ahead of Hamburg (~1.9 m) as second-biggest German-speaking city; Bodensee 536 km² <
  Lake Geneva 580 km²; Müritz is the largest lake entirely in Germany; the Bodensee border question is
  genuinely unsettled (correctly flagged as a simplification); Swiss constitution names no capital, Bern is
  the "Bundesstadt". "Die meisten Schweizer sprechen Deutsch": German/Swiss German is the main language of
  about 62% (BFS), so "most" is fair.
- Kennedy 1963 "Ich bin ein Berliner": the doughnut story is correctly called a myth; Berliner/Pfannkuchen/
  Krapfen distribution is stated as a generalization.
- Grammar: weak/mixed/strong naming; mixed = strong in masc. nom. and neut. nom./acc.; present participle =
  infinitive + -d and not used for progressive; adverb before participle uninflected; place-name -er
  adjectives capitalized and uninflected; Österreicher/Schweizer ordinary nouns vs Deutsche adjectival;
  *einer der höchsten Berge* (genitive plural chunk); *zweitgrößte* one word; *viel* not *sehr* + comparative;
  *so viele/so viel*. All Mermaid charts (09 ein-word endings, 11 all three tables, 12 als/wie, 12h1, 12h2)
  are correct and their accDescr describe the whole chart.
- Pictures: outfit, Kaufhaus, kitchen, market board — content and labels right, markers on the named parts.
- Vocab duplicates against German A1, A2, B1 (incl. other writers' r2 files): no same term + pos, id, or
  identical first meaning. die Erwachsene / die Jugendliche have first meanings "adult (female)" / "young
  person (female)", distinct from B1's der Erwachsene ("adult") and der Jugendliche ("young person").
- Glossary terms do not clash (build passes; language builds fail on duplicates).

## Overlap

None found: de2-m1 round 2 covers participles only for forming the perfect; no other A2 round 2 lesson
covers adjective declension names, place-name adjectives or comparison of the German-speaking countries.

## Left uncertain

- Population figures drift yearly; the lesson says "about" and mid-2020s. Fine as is.
- The Kaufhaus picture places "Erdgeschoss" at the top right of the ground floor while "1. Stock" and
  "2. Stock" sit at the bottom right of their floors; each label is inside its own floor, so I left it.
- Not mine: the writer reports `glossary-r2-de2-m1.yaml` defines "ablaut" twice.
- Blocked: dwds.de/wb/Paprika (permission prompt timed out); used duden.de instead.

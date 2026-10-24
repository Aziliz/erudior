# Round 2 notes: de3-m3 (Describing in detail)

## Honors lessons (honors: true, module de3-m3)
- `lessons/15h1-participle-phrases.md`, `de3-m3-h-participle-phrases`: **Packed into one phrase:
  extended participle attributes** (about 2,150 words incl. text translation, 45 min). The
  article…noun frame; three types and how to unpack them (Partizip I active/same time; Partizip II
  of an object verb passive; Partizip II of a sein verb active/finished; no attributive Partizip II
  for haben verbs without an object); 5-step reading strategy (Mermaid); extended adjectives;
  zu + Partizip I (gerundive, receptive); style guideline; news report "Römischer Schatz unter dem
  Marktplatz" (Kronstein, the invented town from lesson 12); 3 worked examples. Labeled as B2
  material, slightly above B1.
- `lessons/15h2-official-genitive.md`, `de3-m3-h-official-genitive`: **Office German: aufgrund,
  bezüglich, dessen and the genitive debate** (about 2,150 words, 45 min). aufgrund, infolge,
  angesichts, dank, mangels, bezüglich, hinsichtlich, laut, mithilfe, anhand, anlässlich,
  oberhalb/unterhalb, entlang (postposition); Mermaid "which genitive preposition"; dessen/deren
  productive (after prepositions, strong adjective endings); the genitive debate (Bastian Sick 2004,
  possessive dative), presented as two opinions plus a practical rule; official letter from the
  Tiefbauamt with picture; 2 worked examples.

## Core lessons (additions only)
- 11: labeled picture of a relative clause's parts + Mermaid "choosing the relative pronoun".
- 12: Mermaid "der/die/das, was or wo?" + labeled old-town scene (Dom, Burg, Rathaus, Brunnen,
  Denkmal, Bühne).
- 13: Mermaid "genitive or von?" + Jonas's family tree with genitive phrases (matches the lesson's
  text: Jonas, his mother's side).
- 14: Mermaid "preposition, conjunction or adverb?" + departure board (wegen Personalmangels etc.),
  with a one-line gloss of Personalmangel and ca.
- 15: Mermaid "strong or weak ending?" + four participle pictures (brennende Kerze, schlafende
  Kind, zerbrochene Glas, umgefallene Baum) with a sentence on umfallen + sein.

## Pictures (images/)
de3-m3-relative-parts(.svg, -blank), de3-m3-altstadt(.svg, -blank), de3-m3-family-tree(.svg,
-blank), de3-m3-departures, de3-m3-participles(.svg, -blank), de3-m3-h-bracket(.svg, -blank),
de3-m3-h-letter(.svg, -blank). All original, under 6 KB, previewed; label markers checked on the
blanks. 7 Mermaid diagrams (5 core, 2 honors), all previewed.

## Questions (`questions/r2-de3-m3.yaml`, 53)
- Core q01–q25 (25, 5 per lesson): text 5, order 5, select-all 5, match 5, label 4, choice 1
  (departure-board reading). module_quiz on 2 per lesson (q01, q03, q06, q09, q11, q14, q16, q18,
  q22, q24).
- Honors h01–h28 (14 per lesson): choice 15, text 5, label 2, order 2, match 2, select-all 2.
  Reading questions on both texts.

## Vocabulary, glossary, cards
- `vocab-r2-de3-m3.yaml`: 31 words. 15h1 (13): Ausgrabung, ausgraben, Fund, Archäologe/-in,
  Sammlung, stammen, zahlreich, bisherig, Besucher/-in, Gegenstand, römisch. 15h2 (18): aufgrund,
  infolge, angesichts, dank, mangels, bezüglich, hinsichtlich, mithilfe, anhand, anlässlich,
  entlang, Angelegenheit, Anwohner/-in, Sanierung, sanieren, Grundstück, erneuern. Checked by
  term + pos and first meaning against every vocab file in German A1, A2 and B1, including the
  other writers' r2 files. Dropped as duplicates (ids w10, w11, w16 left unused): der Schatz
  (A2 r2 de2-h1), die Münze (B1 r2 de3-m2), vermuten (B1 r2 de3-m1); the lesson only glosses them.
- `glossary-r2-de3-m3.yaml`: extended participial attribute, gerundive, possessive dative,
  postposition (none exist in any B1 glossary).
- `cards-r2-de3-m3.yaml`: 24 cards (12 + 12).

## Checks
`check-module.sh german-b1 m3` passed with zero problems (7 lessons, 113 questions). A later run
shows 4 problems that are not in this module: A2's `vocab-r2-de2-h1.yaml` (w38 tree, w41 witch)
duplicates A1's `de1-h1` r2 words; those writers need to resolve it.

## For the reviewer
- Possible overlaps with writers who are still working: aufgrund, dank, entlang etc. may also be
  added by another B1 writer (m2's da/falls or m6's writing lessons); the de3-h1 honors module
  (history) might add Ausgrabung/Archäologe. Re-run a duplicate check before release.
- Grammar claims to double-check: no attributive Partizip II for intransitive haben verbs ("with
  very few exceptions" is left implicit); entlang: postposed + accusative, preposed + genitive
  (rarely dative); dank + genitive or dative; laut with no ending without an article; mangels
  Beweisen (dative plural); aufgrund/auf Grund and mithilfe/mit Hilfe both correct (2006 rules).
- The genitive debate is labeled as two opinions; Sick's book is dated 2004. No claim is made
  about which case wegen originally took beyond "the dative means the same".
- 15h1 cross-references lesson 18 (sein + zu) and 27 (lassen); 15h2 references lessons 5, 18, 25
  and 26 for words it glosses.

## Errors found in existing content
None.

## Sources
- Duden online entries (wegen, laut, dank, entlang, aufgrund, mithilfe, mangels) for case use and
  spellings. https://www.duden.de/rechtschreibung/wegen
- Universität Oldenburg, "Zweifelsfälle – Kasus" (wegen: genitive and dative, Strecker 2015).
  https://wp.uni-oldenburg.de/zweifelsfaelle/wissenschaftliche-analyse-kasus/
- Bastian Sick, Der Dativ ist dem Genitiv sein Tod (2004), publication year confirmed via
  bookseller listings (e.g. https://www.ebay.de/p/30846649).

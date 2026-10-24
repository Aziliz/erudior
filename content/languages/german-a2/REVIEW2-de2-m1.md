# German A2, module 1 (de2-m1, Telling your story), round 2: review

Reviewed: honors lessons 04h1-biographies.md and 04h2-reported-speech.md; round 2 additions to
lessons 01–04 (7 Mermaid diagrams, 7 SVG pictures + 4 blanks); questions/r2-de2-m1.yaml (46);
vocab-r2-de2-m1.yaml (17); glossary-r2-de2-m1.yaml (5); cards-r2-de2-m1.yaml (21). Every
question worked before reading the key; every SVG and Mermaid diagram rendered and looked at
(label blanks with their markers). `content/math/check-module.sh german-a2 de2-m1`: OK, zero
problems, after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| de2-m1-r2-q07 (label, Zeugnis) | Markers 1 and 3 sat exactly on "3b" and on the grade "4", hiding the very thing to be labeled (marker 1 showed an empty spot); marker 2 covered half of "Mathematik". | Markers moved beside their targets: Klasse x 65.5→71.5, Fach x 24→35.5, Note x 75.8→84 (y unchanged). Re-rendered: all four targets visible, each marker next to its part. |
| de2-m1-r2-h24 | Distractor "Kann ich Sie verbinden?" is a natural, defensible reply when the colleague is out (put you through to someone else), so the item had two plausible answers. | Changed to "Kann ich Sie mit Frau Ott verbinden?", which is clearly wrong because she isn't there; explanation updated. |
| 04h1, ablaut table, row i → a → u | Listed *beginnen – begann – begonnen* as a verb "like" *finden – fand – gefunden*; its participle has *o*, not *u*. | Row now gives *trinken – trank – getrunken* (but *beginnen – begann – begonnen*, with *o*). |
| 04h1, after the strong-verb list | "The er/sie/es form has no ending at all" directly after listing *werden – wurde*, which has an *-e* (and plural *wurden*, not *-en*). | Limited to strong verbs and added "*werden* is the exception: *er wurde, sie wurden*." |
| 04h1, intro | "Producing the simple past of all verbs is officially B1 material": the CEFR has no official grammar list. | "is usually taught at B1". |
| 04h2, Key points | "Statements: *sagen, dass …* or *sagen* + main clause … In all of them the verb goes to the end" contradicts the main-clause option (verb in position 2). | "In the *dass*, question-word and *ob* clauses the verb goes to the end." |
| images/de2-m1-reporting.svg (04h2) | Nothing in the picture showed that Anna's "Kommst du morgen zu mir?" was meant for Clara; read naturally (Anna talking to Ben), Ben's "ob du morgen zu ihr kommst" to Clara would be a wrong report, the opposite of the lesson's point. | Added a dashed arrow Anna → Ben labeled "a message for Clara"; alt text updated. Re-rendered, no overlaps. |
| vocab de2-m1-r2-w05 (der Motor) | Note gave only MO-tor; Duden lists *Motor* with stress on either syllable. | "Stress: MO-tor (also mo-TOR), plural mo-TO-ren." |

## Checked and right (things a reader might doubt)

- Bertha Benz (Wikipedia "Bertha Benz"; DPMA page on Bertha Benz): born 3 May 1849 Pforzheim;
  married Carl 20 July 1872; trip 5 August 1888 Mannheim → Pforzheim (about 105–106 km), left at
  dawn, arrived after dusk; sons Eugen (b. 1873, 15) and Richard (b. 1874, 13); without Carl's
  knowledge; ligroin from the Stadt-Apotheke Wiesloch; hatpin for a blocked fuel line; blacksmith
  mended a chain; cobbler put leather on the wooden brakes; telegram; return several days later;
  suggested an extra gear for hills; died 5 May 1944 Ladenburg (two days after her 95th birthday).
  Patent DRP 37435 filed 29 January 1886 (granted later that year), so "1886 bekam Carl ein Patent"
  holds. The dowry was actually invested in 1870, before the marriage and in Carl's earlier
  company; the text's "gab das Geld von ihrer Familie für seine kleine Firma" after the 1872
  wedding is a simplification, covered by the lesson's "The story is simplified" note.
- Strong-verb patterns and principal parts in 04h1 (bleiben, fliegen, ziehen, finden, trinken,
  sprechen, sterben, helfen, nehmen, geben, sehen, lesen, essen, fahren, tragen, wachsen, schlafen,
  fallen, halten, laufen, verlassen, bekommen, erfinden): all correct per Duden.
- Vocab genders/plurals (die Mailbox – die Mailboxen, die Berufserfahrung – -en, der Zettel – die
  Zettel, das Gerücht – -e, das Geheimnis – -se; verraten: du verrätst, verriet, hat verraten;
  versprechen: versprach, hat versprochen) per Duden. No term + pos, first-meaning or id clash with
  any vocab file in German A1, A2 or B1 (the build compares the full first meaning, so
  "to pass on (tell others)" vs A2 m5's "to pass on (a message)" is not a clash).
- q11 order "weil ich heute arbeiten muss": "weil heute ich arbeiten muss" only works with
  contrastive stress on ich; not a fair alternative, so the order is unique. q19 likewise unique
  (unstressed pronoun Sie directly after ob).
- q19 ends with "?" while h26 teaches a full stop: consistent, since q19's main clause
  ("Können Sie mir sagen, …") is itself a question.
- Zeugnis: Opa born 1952 in class 3 in 1961/62 is plausible (school start 1959); "Grundschule" was
  the name of the first four school years since 1920. Grades consistent with the dialogue.
- Lebenslauf SVG consistent with Tomasz's interview (born 1987 Breslau/Wrocław, studied in
  Kraków, Leipzig job 2013, own piano workshop since 2025).
- 04h2: indicative reported speech without backshift as the everyday norm; sollen (and spoken
  sollte) for commands; Konjunktiv I forms sei, habe, werde, könne, müsse, gebe, komme: correct and
  labeled recognition-only.
- All 7 Mermaid diagrams render, are readable, have accTitle/accDescr covering the whole diagram,
  and agree with the lesson text (haben/sein chart matches the A1-style rule in lesson 1).

## Overlap with other round 2 lessons

- 04h1's "The German Lebenslauf" section (sections, newest first, optional photo, place/date/
  signature) overlaps the CV section of 20h1-job-application.md (de2-m5), which has its own CV
  picture. They agree; 04h1's angle (turning CV lines into third-person sentences) is different.
- 24h1-news.md (de2-h1) also covers simple-past recognition in written reports and *sollen* for
  hearsay; 04h2's Konjunktiv I preview complements it rather than repeating it.

## Left uncertain

- The Stille-Post text's claim that each person drops "on holiday" is loose (Weber never says
  *Urlaub* until the end; the dropped detail is that it's a three-week visit). Not wrong enough to
  change.
- 04h1 is about 2,300 words, slightly over the 2,200 guide (writer's note); not trimmed.

Sources: https://en.wikipedia.org/wiki/Bertha_Benz;
https://dpma.de/dpma/veroeffentlichungen/patentefrauen/berthabenz/index.html; Duden online
(Motor, Mailbox, verraten, Berufserfahrung).

# German A2, module 1 (de2-m1, Telling your story), round 2: writer notes

## Added

**Honors lessons (2)**
- `lessons/04h1-biographies.md` (de2-m1-h-biographies, 45 min): "Lebensgeschichten: reading and
  writing a short biography". Why written biographies use the simple past; principal parts;
  producing the third-person simple past (weak -te/-ete, strong verbs by ablaut pattern in a
  7-row table, mixed verbs, inseparable and separable prefixes); a biography phrase toolkit;
  an original reading text on Bertha Benz's 1888 drive (German + translation) with a Mermaid
  timeline; the German tabular Lebenslauf (labeled SVG); 3 worked examples (dictionary entry →
  sentence, spoken perfect story → written biography, CV lines → sentences). Common mistakes, key
  points. About 2,300 words without the English translation (counting tables and the German
  reading text), a little over the 2,200 guide; trim the "Notice the forms" paragraph if needed.
- `lessons/04h2-reported-speech.md` (de2-m1-h-reported-speech, 45 min): "Passing it on: reporting
  what people said and asked". Direct vs reported speech; reporting statements (dass / no dass),
  keeping the tense in everyday German, pronoun/possessive/place/time shifts (table + SVG);
  reported W- and yes/no questions (fragen, wissen wollen); commands with sollen (sollte noted as
  common in speech); message phrases (ausrichten, weitersagen, Mailbox, Zettel, secrets); a
  Konjunktiv I recognition preview (sei, habe, werde, könne, müsse, gebe, er komme), flagged as B1;
  original text "Das Gerücht im dritten Stock" (a Stille Post chain); Mermaid "how to report"
  chart; 3 worked examples. About 1,960 words without the translation.
- Topic choice: B1 already has full lessons on the Präteritum, Plusquamperfekt/nachdem and
  reported speech. 04h1 limits production to third-person forms and is culture/reading-led;
  04h2 uses indicative everyday reporting and only previews Konjunktiv I, so neither duplicates
  the A2 core and both are clearly a head start on B1. Plusquamperfekt was left out for that reason.

**Questions (`questions/r2-de2-m1.yaml`, 46)**
- Core, de2-m1-r2-q01–q20, 5 per lesson: 4 text, 4 order, 4 match, 4 select-all, 3 label,
  1 multiple choice (q20). Label questions: life events (L1), Zeugnis (L2),
  feelings faces (L3); lesson 4 has no labelable picture. `module_quiz: true` on q01, q03, q06,
  q09, q11, q14, q16, q18 (2 per lesson).
- Honors, de2-m1-r2-h01–h26, 13 per lesson: 04h1 = 2 text, 1 match, 1 order, 1 label, 1 select-all,
  7 multiple choice; 04h2 = 3 text, 1 match, 1 order, 1 select-all, 7 multiple choice. No
  module_quiz (core-module honors lessons).
- Single-answer 4-choice answer positions (15): 0→4, 1→4, 2→4, 3→3. Existing m1.yaml unchanged.

**Pictures (11 SVGs, all original, generated from a script and rendered with preview-figure.mjs)**
- de2-m1-life-events (+ -blank) lesson 1; de2-m1-zeugnis (+ -blank) lesson 2 (Opa's 1961/62 report,
  consistent with his text: bad in Mathe, Sport best); de2-m1-verb-end and de2-m1-feelings
  (+ -blank) lesson 3; de2-m1-als-wenn lesson 4; de2-m1-lebenslauf (+ -blank) 04h1 (Tomasz from
  lesson 1, dates consistent with his interview); de2-m1-reporting 04h2. All blanks checked with
  their label markers.

**Mermaid diagrams (7)**: participle decision chart and haben/sein chart (L1); which past tense
(L2); where the verb goes after und/weil/dropped dass (L3); wann/wenn/als/ob chart (L4); Bertha
Benz timeline (04h1); how to report statements/questions/commands (04h2). All have
accTitle/accDescr and were rendered.

**Core lesson edits**: additions only (figure + one introducing sentence each). L1: 2 diagrams +
1 picture; L2: 1 diagram + 1 picture; L3: 1 diagram + 2 pictures; L4: 1 diagram + 1 picture.

**Vocab (`vocab-r2-de2-m1.yaml`, 17)**: 04h1 heimlich, das Benzin, tanken, die Bremse, der Motor,
das Pferd, der Kilometer, die Rückfahrt, die Berufserfahrung; 04h2 weitersagen, flüstern, das
Gerücht, versprechen, verraten, das Geheimnis, der Zettel, die Mailbox. Checked against every
vocab file of German A1, A2 and B1 (including other writers' r2 files) for term + pos and first
meaning: no clashes. Words the lessons use that B1 already owns (erfinden, die Strecke, der Mut,
die Pressekonferenz, die Kenntnis …) were deliberately not added, so B1's build isn't broken;
they're glossed in the lesson text.

**Glossary (`glossary-r2-de2-m1.yaml`, 5)**: principal parts, ablaut, direct speech, reported
speech, Konjunktiv I (alias "Konjunktiv" avoided: it belongs to Konjunktiv II). All A2 glossary
files checked for duplicate terms/aliases, before and after: none.

**Cards (`cards-r2-de2-m1.yaml`, 21)**: 11 for 04h1 (topics Simple past, Biographies), 10 for 04h2
(Reported speech, Indirect questions).

`content/math/check-module.sh german-a2 m1`: OK, zero problems.

## For a reviewer
- Bertha Benz facts (checked against Wikipedia and the DPMA page): born 3 May 1849 Pforzheim, née
  Ringer; married Carl Benz 1872; patent DRP 37435 filed 29 Jan 1886; trip 5 Aug 1888 from
  Mannheim to Pforzheim (about 100–106 km), with sons Eugen (15) and Richard (13), without
  telling Carl; ligroin bought at the Stadt-Apotheke Wiesloch; hatpin for a blocked fuel line;
  blacksmith mended a chain; cobbler put leather on the wooden brakes; sons pushed uphill;
  telegram on arrival after dusk; she later suggested an extra gear for hills; died 5 May 1944
  in Ladenburg, aged 95 (ages computed in Python: 23 at marriage, 39 on the trip). "Only a few
  people were interested" and "many found it loud and dangerous" are simplifications, and the
  lesson says the story is simplified and leaves out undocumented details (note on the table,
  Carl asleep). "Bertha wanted to show everyone…" is the usual account of her motive; the
  official purpose was visiting her mother, which the text also says.
- Lebenslauf conventions (newest first, photo optional, place/date/signature) are given as usual
  practice, not rules.
- 04h2 teaches indicative reported speech without backshift as the everyday norm, and soll/sollte
  for reported commands; Konjunktiv I is presented for recognition only.
- q11 order item "weil ich heute arbeiten muss": "weil heute ich arbeiten muss" is not acceptable
  standard order, so the order is treated as unique. q19 relies on the pronoun Sie preceding
  "am Montag".
- Word count of 04h1 slightly above the guide (see above).

## Errors found in existing content
None found in m1 lessons, questions, vocab or glossary.

## Sources
Bertha Benz: https://en.wikipedia.org/wiki/Bertha_Benz and the German Patent and Trade Mark
Office page https://dpma.de/dpma/veroeffentlichungen/patentefrauen/berthabenz/index.html.
Grammar (strong-verb patterns, reported speech, Konjunktiv I forms) from standard references
(Duden grammar, DWDS); vocab genders/plurals checked against Duden. All writing and drawings are
original.

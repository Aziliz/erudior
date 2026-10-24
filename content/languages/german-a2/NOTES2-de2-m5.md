# Round 2 notes: de2-m5 (Work, learning and services)

`content/math/check-module.sh german-a2 de2-m5`: build and checker report zero problems
(7 lessons, 107 questions, 34 cards, 154 module words).

## Honors lessons (3)

The module covers four separate areas (work, school, offices, health), so it got three honors lessons. Each is about
reading real-life documents in German-speaking countries:

1. `20h1-job-application.md`, `de2-m5-h-application`: **Applying for a job: CV, cover letter and the Arbeitszeugnis**
   (about 2,080 words). What goes in an application, the application process (Mermaid), the German CV (SVG),
   the nominal style in CVs, a model cover letter with notes, da-word + zu-infinitive in letters, the coded
   language of the Arbeitszeugnis (the satisfaction scale, *stets bemüht*, the closing sentence). 3 worked examples.
2. `20h2-package-insert.md`, `de2-m5-h-medicine`: **At the pharmacy: prescriptions and the package insert**
   (about 1,840 words). Prescription only, pharmacy only and general-sale medicines; E-Rezept and Zuzahlung; pharmacy
   dialogue; the six EU package-insert sections (SVG of a made-up medicine "Musterin"); side-effect frequency words;
   recognizing the passive (werden + participle); compound nouns; the AU. 3 worked examples.
3. `20h3-official-letters.md`, `de2-m5-h-official-letters`: **Letters from the authorities: reading Amtsdeutsch**
   (about 1,620 words). DIN 5008 letter layout (SVG), Bescheid, Mahnung, Widerspruch and Rechtsbehelfsbelehrung,
   a reading procedure (Mermaid), sein/haben + zu + infinitive, the nominal style in official sentences,
   abbreviations, a payment reminder with numbers. 3 worked examples.

All three say that their passive and sein + zu content is recognition only (B1 teaches it in full).

## Core lessons (additions only)

- 17: office picture (`de2-m5-office.svg`); Mermaid "Do I need zu, and where does it go?" at the end of the grammar.
- 18: Mermaid of school routes (labeled as simplified); subjects picture (`de2-m5-subjects.svg`); Mermaid "three ways
  to say whose".
- 19: Mermaid procedure for indirect questions; lassen picture (`de2-m5-lassen.svg`).
- 20: doctor's-office items picture (`de2-m5-medical.svg`); Mermaid "who to call" (112 / 116 117 / practice);
  seit vs vor time line (`de2-m5-seit-vor.svg`).

## Questions (`questions/r2-de2-m5.yaml`, 59)

- Core (q01–q20, 5 per lesson): 5 text, 4 order, 4 select-all, 3 label, 4 match. `module_quiz: true` on two per
  lesson (q01, q04, q07, q09, q11, q13, q16, q19).
- Honors (h01–h39, 13 per lesson): 21 multiple choice, 5 text, 4 order, 3 select-all, 4 match, 2 label.

## Other files

- Pictures: 8 SVGs plus 5 `-blank` copies for label questions (`images/de2-m5-*.svg`), all under 7 KB, previewed
  with markers.
- Mermaid diagrams: 7 (5 in core lessons, 1 each in 20h1 and 20h3; all previewed).
- `vocab-r2-de2-m5.yaml`: 43 words (12 / 17 / 14), ids `de2-m5-r2-w01`–`w43`, checked against A1, A2 (including
  the other round 2 files present now) and B1 vocabulary for term, first meaning and id clashes. Dropped
  *die Berufserfahrung* (now in `vocab-r2-de2-m1.yaml`) and *die Abkürzung* (in German A1 round 2); words that
  B1 teaches (*die Probezeit, die Nebenwirkung, die Frist, einreichen, der Absender, …*) are used and glossed
  in the text but not added.
- `glossary-r2-de2-m5.yaml`: *compound noun*, *sein + zu + infinitive*. *nominal style* and *passive* are bolded
  in my lessons but defined in `glossary-r2-de2-m6.yaml` (written by the m6 writer), so I didn't repeat them.
- `cards-r2-de2-m5.yaml`: 34 cards (12 / 10 / 12).

## For the reviewer

- The Arbeitszeugnis satisfaction scale is presented as the commonly quoted convention, not law; some guides put
  *zu unserer vollsten Zufriedenheit* (without *stets*) at "gut". Question h06 relies on the lesson's table.
- Facts to double-check: Zuzahlung 10 % (min 5, max 10 euros; children exempt); E-Rezept mandatory since 2024;
  eAU since 2023 and the AU needed after more than three calendar days (EntgFG §5); probation up to six months with
  two weeks' notice (BGB §622(3)); BAG 2012 ruling (9 AZR 227/11) that there is no right to the closing sentence;
  §109 GewO (right to a reference, no secret codes); Widerspruch usually within one month (some decisions go straight
  to court, which the lesson mentions); side-effect frequency bands from the EU template.
- "Musterin"/"Musterol" and "Musterstadt" are invented and labeled as such; the dosage in the insert is fictional.
- B1's generated `PRIOR-WORDS.tsv` will need regenerating to include the new A2 words (none of them clash with B1).
- No errors found in the existing m5 lessons, questions, vocab or glossary; nothing existing was edited except the
  additions listed above.

## Sources

Gewerbeordnung §109 and BGB §622 (gesetze-im-internet.de); Entgeltfortzahlungsgesetz §5; BAG judgment of
11 Dec 2012, 9 AZR 227/11; SGB V §61 (Zuzahlung); gematik / Bundesgesundheitsministerium on the E-Rezept (2024) and
eAU (2023); EMA QRD template (German version) for package-insert headings and frequency terms; DIN 5008 summaries
for letter layout; Bundesmeldegesetz §19 (Wohnungsgeberbestätigung); VwGO §70 (one-month Widerspruch deadline).
All from my knowledge; I did not look them up online in this session.

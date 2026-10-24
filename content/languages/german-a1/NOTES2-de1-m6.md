# Round 2 notes: de1-m6 (The past and the A1 exam)

## Honors lessons (2)

- `lessons/24h1-past-stories.md`, `de1-m6-h-past-stories`: **Honors: telling a story in the past
  (konnte, musste, wollte)**. 45 min, about 2,190 words. The simple past of the modals (konnte,
  musste, wollte, durfte, sollte, mochte), why it is preferred to the perfect (double infinitive),
  konnte vs könnte, common spoken simple past forms (es gab, wusste, dachte), a "which past form"
  rule of thumb with a labelled regional caveat, story structure, 3 worked examples, an original
  ~170-word story "Ein Montag zum Vergessen" with translation. Slightly above A1 (modal past is
  normally A2); said so in the intro.
- `lessons/24h2-letters.md`, `de1-m6-h-letters`: **Honors: letters, e-mails and postcards the
  German way**. 40 min, about 1,870 words. Layout of a formal letter, the register ladder of
  openings and closings, regional greetings (Moin, Servus, Grüezi), capitalization of Sie/du in
  writing, duzen/siezen custom, a three-point e-mail and an informal-to-formal rewrite (worked
  examples), the holiday postcard.

A third lesson didn't seem necessary: the other honors topics (haben/sein edge cases, exam
practice) are covered by the core lessons and by the de1-h1 honors module.

## Core lesson additions (no text rewritten; short intro sentences only)

- 21: perfect-bracket SVG; Mermaid "which participle pattern?" checklist (new `###` subsection
  after pattern 5); timeline SVG (after the time-words table).
- 22: Mermaid "haben or sein?" rule of thumb; labelled landscape SVG (Berg, See, Dorf, Strand,
  Meer, Insel) with a sentence on See vs Meer.
- 23: position-zero SVG (denn/aber vs deshalb); Mermaid message-structure chart; filled-in form
  SVG.
- 24: CEFR staircase SVG; Mermaid diagram of the exam parts.

## Questions (`questions/r2-de1-m6.yaml`, 47)

- Core, 20 (`de1-m6-r2-q01`–`q20`, 5 per lesson): 5 text, 4 order, 4 match, 4 select-all,
  3 label. Module quiz: q01, q03, q07, q09, q13, q14, q16.
- Honors 24h1, 14 (`h01`–`h14`): 7 multiple choice, 3 text, 2 order, 1 match, 1 select-all.
- Honors 24h2, 13 (`h15`–`h27`): 7 multiple choice, 2 text, 1 order, 1 match, 1 select-all,
  1 label.

## Pictures and diagrams

SVGs (all original, in `images/`): de1-m6-perfect-bracket, de1-m6-timeline (+ -blank),
de1-m6-landscape (+ -blank), de1-m6-position-zero, de1-m6-form (+ -blank), de1-m6-cefr-steps,
de1-m6-modal-past, de1-m6-letter (+ -blank). Every one was previewed, the blank ones with
their question markers. Mermaid: 5 (participle checklist, haben/sein, message structure, exam
parts, which past form), all previewed.

## Vocabulary, glossary, cards

- `vocab-r2-de1-m6.yaml`, 13 words: konnte, musste, wollte, durfte, sollte, mochte, es gab, der
  Wecker, klingeln, aufwachen, zum Schluss (24h1); die Briefmarke, Freundliche Grüße (24h2).
  Checked against every vocab file in German A1, A2 and B1, including the round 2 files (id, term +
  part of speech, first meaning). Many words I would have liked (der Stau, das Pech, nass, der
  Betreff, die Anrede, der Absender, Hallo zusammen, Mit freundlichen Grüßen…) are already taught
  in A2 or B1, so they are only glossed in the lessons. Moin/Servus/Grüezi and duzen/siezen are
  already in `vocab-r2-de1-m1.yaml`, so I didn't add them.
- `glossary-r2-de1-m6.yaml`, 4 terms: double infinitive, register, salutation, sign-off.
  "subjunctive" is bolded in 24h1 but defined by de1-m3 (`glossary-r2-de1-m3.yaml`); its
  definition fits.
- `cards-r2-de1-m6.yaml`, 20 cards (10 per honors lesson).

## For the reviewer to check

- The rule of thumb in 24h1 about which past form to use in speech (simple past for sein, haben
  and the modals; es gab/wusste/dachte common; perfect otherwise), and the regional note (the
  south uses the simple past even less; "ich bin gewesen"). It's labelled as a simplification.
- 24h2: "the word Betreff is usually left out" (DIN 5008 practice), optional capital du/dein
  in letters (official since the 2006 reform), "many people find MfG rude", and the
  duzen custom (labelled as tradition that is changing).
- The exam diagram in 24 shows the written parts in the order Hören → Lesen → Schreiben, the
  same order as the lesson's table.
- Label marker positions were checked on rendered previews: q05, q09, q15, h15.

## Errors found in existing content

None in de1-m6's questions, vocabulary or glossary.

## Sources

- Duden, rules on capitalizing the forms of address in letters (since the 2006 reform).
- DIN 5008 letter layout (described only in general terms).
- Goethe-Institut, Goethe-Zertifikat A1: Start Deutsch 1 overview and model test (already cited
  in lesson 24).
- Council of Europe, CEFR global scale (A = basic user, B = independent, C = proficient).
- German forms and simple past paradigms checked against Duden/DWDS conjugation tables.

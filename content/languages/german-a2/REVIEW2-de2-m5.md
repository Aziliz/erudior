# Round 2 review: de2-m5 (Work, learning and services)

I reviewed independently: honors lessons 20h1, 20h2 and 20h3, the additions to core lessons 17–20, `questions/r2-de2-m5.yaml`
(59 questions), `vocab-r2-de2-m5.yaml`, `glossary-r2-de2-m5.yaml`, `cards-r2-de2-m5.yaml` and the 13 `images/de2-m5-*` files.
I worked every question before reading its key, rendered every SVG (label ones with their markers) and all 7 Mermaid diagrams.
`content/math/check-module.sh german-a2 de2-m5` reports zero problems after my fixes.

## Changes

### Answer keys and questions
- **q11** (`Wissen Sie, ___ ich einen Termin brauche?`, accept `ob`): *wann* and *wo* also make correct sentences
  ("Do you know when / where I need an appointment?"), so the blank had more than one right answer. The stem now gives the
  direct yes/no question to convert ("Brauche ich einen Termin?"), so only *ob* fits.
- **q15** (`Er ___ sein Fahrrad reparieren.`, accept `lässt`): *ließ* (simple past) is also correct German. The stem now asks for
  the present-tense form.
- **h35**: the explanation said you object to a Finanzamt decision with a *Widerspruch*. For tax decisions the remedy is the
  *Einspruch* (Abgabenordnung §347, one month under §355). Explanation corrected; the answer (Rechtsbehelfsbelehrung) was right.

### Facts and language in the lessons
- **20h3, "Kinds of letters"**: added that against the Finanzamt the objection is *der Einspruch* (the lesson's own example of a
  Bescheid is a tax assessment, so a learner would have looked for the wrong word). Same note in the Mermaid node and its
  `accDescr`, in Key points, and on the Widerspruch card. Source: AO §§347, 355; VwGO §70 for Widerspruch.
- **20h3, sein + zu**: the text said "with a negative 'must not'" and then gave a positive example (*Die Frist ist unbedingt
  einzuhalten*). Rewritten so each meaning has a matching example: must (*einzuhalten*), must not (*Das Gelände ist nicht zu
  betreten*), cannot (*Diese Regel ist nicht zu ändern*).
- **20h3, Example 1**: "confirmation from the landlord that he moved in" was ambiguous (he = landlord?); now "that Daniel has moved in".
- **20h1, vollsten**: "grammar books call it incorrect" overstated the case (Duden lists *vollste*; the objection is a
  style/logic one). Now "style guides call it illogical".
- **20h1, photo**: "employers no longer ask for one" → "many employers no longer ask for one" (the AGG doesn't ban photos; it made
  asking for them risky).
- **20h1, Common mistakes**: *Ich freue mich, Sie kennenzulernen* in a letter is not really a mistake; reworded as when each form
  is used, keeping the *darauf* advice.
- **17, zu chart**: the decision "Same subject for both verbs? no → dass clause" contradicted the lesson's own table example
  *Der Chef bittet uns, morgen früher zu kommen* (different subjects, but zu). The question is now "Does the second verb need a new
  subject?" (yes → dass, no → zu), with the `accDescr` updated and one introducing sentence explaining the *bitten* case. The round 1
  sentence "When the two subjects are different, you can't use zu" (line 106, and Common mistakes) is left as is; the new
  sentence refines it rather than contradicting it.

### Pictures
- **de2-m5-seit-vor.svg**: the dashed line from Thursday down to the *vor* arrow ran through the word *heute*; it now starts below it.
- **q07 markers** (subjects): marker 1 sat on the sums and marker 5 covered the football's black pentagon (the ball then looked
  like a wheel). Moved to (10.6, 30.5) and (50, 77.5).
- **h27 markers** (letter): markers 2, 4, 5 and 6 covered the first letter of the text they label (including the "A" of *Anlage*,
  the answer itself). Moved left into the margin, x 14.2 → 13.3.

### Vocabulary
- **w38 fällig**: removed "overdue" from accepted meanings (overdue is *überfällig*; fällig is "due").
- **w41 das Finanzamt**: removed "IRS" (a US agency name, not a translation).

## Checked and found right
- Probezeit up to six months with two weeks' notice (BGB §622(3)); right to a simple or, on request, qualified reference and the
  ban on coded wording (GewO §109); BAG 11 Dec 2012, 9 AZR 227/11 (no right to the thanks-and-wishes closing sentence); AGG 2006.
- The satisfaction scale is labeled as a convention, not law; the five levels match the usual published scale. h05/h06 follow it.
- Zuzahlung 10 %, min 5 / max 10 euros, never more than the price, children exempt (SGB V §§61, 31); h24 (30 euros → 5 euros)
  is right. E-Rezept mandatory for statutory patients since 1 Jan 2024; eAU since 1 Jan 2023; AU after more than three calendar
  days, by the next working day, employer may ask earlier (EntgFG §5(1)).
- The six package-insert headings match the EMA QRD German template; the frequency wording matches the QRD/SmPC convention
  (sehr häufig "mehr als 1 von 10" in QRD wording, sehr selten < 1/10,000).
- Medicine categories (verschreibungspflichtig / apothekenpflichtig / freiverkäuflich); common painkillers are pharmacy-only.
- DIN 5008: subject line without the word "Betreff", spaced abbreviations (*z. B.*), no comma after *Mit freundlichen Grüßen*.
  Wohnungsgeberbestätigung required for registration (BMG §19). Widerspruch one month (VwGO §70).
- Arithmetic: 96 + 5 = 101 euros; 12 Feb → 26 Feb = 14 days; 3 tablets × 3 days = 9; 2 × 3 = 6.
- Lena's CV dates are consistent (born 2000, Realschule 2010–2016, Ausbildung 2016–2019, job since 07/2019 = "seit 2019" in
  the letter); the letter SVG matches h38 and h37 (Sachbearbeiterin Frau Brenner signs "Im Auftrag").
- All other questions: one defensible answer, select-all sets right, order items unique, label markers on the right parts
  (office, medical, CV checked visually). Vocab: no clash of id, term + pos or first meaning with any German A1/A2/B1 vocab
  file, including all `vocab-r2-*` (B1's *der Einspruch* is untouched; I only gloss it).

## Overlap with other round 2 lessons (not changed)
- 20h1 "The German CV" repeats much of 04h1 (de2-m1: tabular Lebenslauf, newest first, photo optional, signature).
- 20h2 "Compound nouns: read them from the back" repeats 91-woerter-erschliessen (de2-h1: head word/modifier, gender from
  the last part).
- 20h1/20h3 nominal style and 20h2 passive recognition overlap 24h1-news (de2-m6), which also defines both glossary terms.
  All are consistent with each other; the repetition works as reinforcement but an editor may want cross-references.

## Uncertain
- Sources were checked from my knowledge of the statutes and templates; I only looked up the *vollste* question online
  (t-online summary of Duden guidance on absolute adjectives: "voll" is listed as non-gradable in the strict sense).

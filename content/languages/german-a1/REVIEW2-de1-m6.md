# Round 2 review: de1-m6 (The past and the A1 exam)

Reviewer, independent of the writer. Scope: honors lessons 24h1 and 24h2, round 2 additions to
lessons 21–24, `questions/r2-de1-m6.yaml` (47), `glossary-r2-de1-m6.yaml`, `cards-r2-de1-m6.yaml`,
`vocab-r2-de1-m6.yaml`, `images/de1-m6-*`. `content/math/check-module.sh german-a1 de1-m6`
reports OK after the fixes.

## Changes

| where | problem | fix | source |
|---|---|---|---|
| Lesson 22, Mermaid "haben or sein?" (node B and accDescr) | The node asked "Movement from A to B?". The lesson calls the chart a rule that works for the A1 verbs, but it sends *schwimmen*, *laufen* and *wandern* with no destination (*Ich bin im See geschwommen*) to *haben*. The lesson's own table and the 24h2 model e-mail (*sind im Meer geschwommen*) use *sein*. | Changed the node to "Verb of movement (gehen, fahren, fliegen, laufen, schwimmen)?" and updated accDescr to match. Re-rendered it. | Duden grammar: verbs of motion take *sein* (in the south, *haben* also occurs for *schwimmen* without a direction) |
| 24h2, Pronunciation | "*Grüezi*: GRÜ-e-tsi, three syllables" is wrong. Swiss German *üe* is a single opening diphthong /yə̯/, so the word has two syllables. | "GRÜE-tsi, two syllables", plus a short description of the gliding *üe*. | Wikipedia, "Swiss German" (diphthongs /iə̯, uə̯, yə̯/) |
| 24h2, Pronunciation | "*Servus* … voiced *s* … like English z" is misleading. That is the northern standard pronunciation, but in Bavaria and Austria, the only places the word is used, /z/ is voiceless. | Said both. | Wikipedia, "Standard German phonology" (/z/ is voiceless in Austrian Standard German and most southern varieties) |
| 24h2, Common mistakes and Key points; h22 explanation; card "Liebe Frau Weber: du or Sie?" | "A surname always goes with *Sie*" overstates the rule. A surname with *du* (the "Münchner Du") does exist as a rare local habit. | Softened to "*Frau/Herr* + surname goes with *Sie*" / "As a rule". The rare exceptions are mentioned only in Common mistakes. | — |
| 24h2, letter picture alt text | Said "(Betreff: Kurs am Dienstag)", but the picture prints only "Kurs am Dienstag". That matches the lesson: the word *Betreff* is left out. | Alt now says "the subject line in bold (Betreff), which reads Kurs am Dienstag". | — |
| 24h2, Example 1 "Check" | "the verbs are in position 2", but the message ends with a yes/no question (*Hast du …?*) where the verb comes first. | "the verbs of the statements are in position 2". | — |
| vocab w04 *durfte* | "might" was an accepted meaning. "Might" is the sense of *dürfte* (subjunctive), the exact confusion the lesson warns about. | Removed "might". | — |
| vocab w11 *zum Schluss* | The first meaning "in the end (zum Schluss)" put the German answer in the English prompt, which gives the answer away in the English → German direction. | "in the end (as the last part of a story)". It is still distinct from B1's *schließlich* "in the end (eventually)" and *letztlich* "in the end". | — |

## Checked and found right (a reader might doubt)

- **Every one of the 47 questions worked independently.** All keys are correct, with exactly one
  order for every order question and unambiguous match and label pairs. Notes on a few:
  - q14: "Er kommt nicht heute, sondern morgen" is correct, because contrastive *nicht* stands
    before the contrasted element.
  - q07: the distractor "hat geflogen" exists only with an object (flying a plane). *fliegen* →
    *ist geflogen* is the intended pairing and is unambiguous.
  - q19 agrees with lesson 24: 100 points, pass with 60, no preparation time in Sprechen.
- **Simple past of the modals.** All the forms in the table, the cards and the vocab notes are
  right (Duden conjugation tables), and so is *mögen* → *mochte*. These are also right:
  - *möchte* has no past, so *wollte* is used;
  - *Ich habe nicht schlafen gekonnt* is wrong, and the double infinitive is correct but rarer;
  - *möchte* is the Konjunktiv II of *mögen*.
- **Regional note on spoken past forms.** The south and Austria avoid the simple past even for
  *sein* (*ich bin gewesen*). This is the well-known "Präteritumschwund" and is labeled as a
  simplification.
- **Worked examples and story.** The past-form counts in Example 3 are right (2 modals, *war*
  twice, 3 perfects). The timings in "Ein Montag zum Vergessen" are consistent: woke 7:30,
  arrived 9:10, appointment at 9:30. The translation is faithful. The Example 1 e-mail is 45
  words, as stated.
- **24h2 letter rules:**
  - The word *Betreff* is omitted in DIN 5008 letters (since the 1996 revision).
  - There is no comma after the Grußformel, and the text starts with a small letter.
  - Writing *du/dein* and *ihr/euer* with a capital letter in letters has been allowed since
    the 2006 reform (Duden rule on forms of address).
  - The date format is *12. Mai 2026*.
  - *Empfänger* is stressed on the second syllable, because *emp-* is an unstressed inseparable
    prefix.
  - The postcard layout is right: message on the left, address on the right.
- **Lesson 24 exam diagram.** The part order and timings (20/25/20 min, written block about
  65 min, oral about 15 min, 100 points, pass with 60) match lesson 24's table and the
  Goethe-Institut overview.
- **CEFR staircase.** The bands are right: basic user, independent user, proficient user.
- **Lesson 21 participle checklist.** The order is right: *-ieren* first, so *ausprobiert*
  also comes out correctly.
- **Lesson 21 timeline.** With Thursday as today, Tuesday is *vorgestern*, Wednesday *gestern*
  and Friday *morgen*.
- **Pictures.** All 8 pictures and the 4 blank versions were rendered. Text is readable at 14px
  or larger, nothing overlaps or is cut off, and the content is right. Label markers for q05,
  q09, q15 and h15 sit on the correct parts.
- **Mermaid.** All 5 diagrams were rendered and are readable. The accTitle/accDescr lines
  describe each whole diagram.
- **Vocab duplicates.** I checked against every vocab file in German A1, A2 and B1, including
  the other `vocab-r2-*` files: no duplicate id, term + part of speech, or first meaning.
- **Glossary.** No term duplicates an existing one.

## Overlap with other round 2 lessons

- 24h2 "Saying hello around the German-speaking countries" (Moin, Servus, Grüezi) and "Who says
  du first?" (duzen/siezen, who offers *du*) repeat material in de1-m1's honors lesson
  `04h2-german-speaking-world.md`, as does question h18. 24h2 points back to that lesson and
  treats it as review. It doesn't contradict it, so I left it.

## Uncertain

- The claim that "many people find *MfG* rude" is common etiquette advice (Knigge-type
  sources), not something that can be measured. The wording is fine as advice.
- I couldn't fetch the Wiktionary page for *grüezi* (the permission request timed out). The
  two-syllable fix rests on the Wikipedia description of the Swiss German /yə̯/ diphthong.

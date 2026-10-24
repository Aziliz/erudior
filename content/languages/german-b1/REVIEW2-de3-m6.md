# Round 2 review: module de3-m6 (Living independently and the B1 exam)

Reviewer, independent of the writer. `content/math/check-module.sh german-b1 de3-m6` reports zero
problems after the fixes (7 lessons, 119 questions, 27 cards, 114 terms, 204 words).

## Changes

| Where | Problem | Fix |
|---|---|---|
| `images/de3-m6-news-blank.svg`, `images/de3-m6-news.svg`, question de3-m6-r2-h11 | Picture/marker problem. In the blank image the numbered markers sat in the gaps between lines, so each one was as close to the word above (for example "bleibt" for 2, "sei" for 3) as to its target word below. That made the label question ambiguous. | I rebuilt both SVGs with the same text and colours. The lines are reflowed so that every target ends its line ("… Einem Gutachten zufolge" / "waren die Schäden …" / "… hat angeblich" / "zu wenig Personal."). The blank copy puts a neutral dashed box round each of the five targets, all the same colour so nothing is given away, and each marker now sits right after its box on the same line. I updated h11's marker coordinates and alt text to match. I rendered both images with markers and checked them. |
| Lesson 26, Mermaid "Reporting what someone said" | The shared end box said "Change the pronouns: ich becomes er or sie", but the instruction branch on the same chart ("Ich soll …") needs Sie → ich. | Changed the label to "Change the pronouns to fit: ich becomes er or sie, Sie becomes ich". |
| Lesson 30h2, light verb table | *zur Kenntnis nehmen* was glossed as "*bemerken, wissen*". *wissen* (to know, a state) is not an equivalent. | Changed to *bemerken, registrieren* (Duden synonyms). This now matches the h21 explanation. |
| `vocab-r2-de3-m6.yaml` w33 *einsehen* | The first meaning "to inspect (documents)" also fits *kontrollieren* (B1 vocab-m4, first meaning "to inspect"). A learner prompted English → German could fairly type *kontrollieren* and be marked wrong. | The first meaning is now "to view (files or records)", and "to view" is added to the accepted answers. I checked that no A1/A2/B1 vocab file has "to view" as a first meaning. |

Counts: answer-key errors 0, factual fixes 1 (*zur Kenntnis nehmen*), picture fixes 1 (news image and h11 markers), other fixes 2 (Mermaid label, vocab prompt).

## Checked and found right (a reader might doubt these)

- **All 53 questions worked independently.** Each select-all key (q04, q09, q14, q19, q24, h07, h21) is right, and every unlisted choice is clearly wrong. Each order item has only one order. Each match pairing has one answer. The text answers are complete: lässt/laesst, herunter, bestanden, Mit freundlichen Grüßen/Gruessen/Grüssen, sei, habe, solle, Guthaben, and 120 for h18 (12 × 150 = 1,800; 1,920 − 1,800 = 120).
- **Konjunktiv I in 30h1.** The forms in the paradigm table are right. The asterisks for forms identical to the indicative are right too: ich habe/werde/komme are starred, ich könne is not. "Only sein is irregular" is right. The replacement-rule examples hold up: sie arbeiten/arbeiteten → würden arbeiten, denken → dächten (not dachten), kommen → kämen. Every past becomes sei/habe + participle, and *hätten … gehabt* is used where *haben gehabt* would look like the indicative. Example 1 (dauern → würden dauern), Example 2 and the reading all apply the rule correctly.
- **Legal points in 30h2.**
  - One-month Widerspruch after Bekanntgabe: § 70 VwGO, which allows it in writing, electronically or zur Niederschrift.
  - Some states have no Widerspruchsverfahren for some decisions: § 68 Abs. 1 S. 2 VwGO.
  - Posted letters count as delivered on the fourth day after posting since 1 Jan 2025 (§ 41 Abs. 2 VwVfG, as amended by the Postrechtsmodernisierungsgesetz).
  - Service-charge bill: the landlord has 12 months after the billing period, and the tenant has 12 months to object (§ 556 Abs. 3 BGB).
  - Advance payments can be adjusted to a fitting amount after a bill (§ 560 Abs. 4 BGB).
  - § 66 SGB I is about the consequences of not cooperating.
  - All of these are hedged in the lesson and labelled "simplified, Germany, not legal advice".
- **Dates in Example 1, checked in Python.** 3 May 2027 is a Monday, 7 May a Friday and 7 June a Monday. Under § 188 Abs. 2 BGB the deadline ends on 7 June.
- **Service-charge sums, checked in Python.** 2,687.40 − 2,520.00 = 167.40; 2,687.40 / 12 = 223.95; 1,920.00 − 1,812.60 = 107.40. h28 is right: a 2026 bill is due by 31 Dec 2027.
- **Exam facts (q21, q22, q24, exam SVG, speaking-test diagram).** These match the Goethe-Zertifikat B1 for adults: Lesen 65 min in 5 parts, Hören about 40 min in 4 parts, Schreiben 60 min (80/80/40 words), Sprechen about 15 min in pairs plus 15 min preparation. Each module is worth 100 points and is passed with 60. Modules can be taken and repeated separately. In Teil 2 and Teil 3 one candidate presents and answers questions, then the other.
- **q14.** Austria has 9 Bundesländer and Switzerland 26 cantons. The Zugspitze is 2,962 m.
- **Pictures.** I rendered and looked at all 13 SVGs, with markers on the blank copies. The pillars, building, hin/her, letter, Bescheid and exam images are correct and readable, with every marker on its part. In the hin/her picture, all four directions are right from the viewpoint of the speaker upstairs.
- **Mermaid diagrams.** I rendered all 8 (6 in core lessons, 2 in honors). Their content is correct and each has a full accTitle/accDescr. The writer's notes say "10", but there are 8.
- **Vocab.** I checked independently against every vocab file in A1, A2 and B1, including all r2 files. There is no id clash and no clash of term + part of speech. The near-matches of first meanings are all separated by their parenthetical notes: dementieren "to deny (officially)" vs bestreiten "to deny (a claim)", Abrechnung "statement (of costs)" vs Aussage "statement", sich äußern "to comment (…)" vs the noun Kommentar. Genders, plurals and principal parts are right: das Gutachten/die Gutachten, das Einschreiben/die Einschreiben, die Heizkosten (plural only), betragen–betrug–hat betragen, vorgehen–ist vorgegangen.

## Overlap with other round 2 lessons

- 30h1 builds on 20h2 (sources and claims). 20h2 already introduces *sei* as reported speech and *bestreiten*. 30h1 refers to 20h2 rather than repeating it, so the overlap is small.
- 30h2 overlaps a little with 15h2 (office German, with a letter from the Tiefbauamt) on the general theme of official letters. The content is different: 15h2 covers genitive prepositions, while 30h2 covers the Bescheid, Widerspruch, light verbs and the Nebenkostenabrechnung.
- I made no changes to other writers' files.

## Left uncertain or minor

- In 30h1's reading, the English translation of *Seitdem kämen kaum noch Kunden* is "hardly any customers had come". That is an acceptable English backshift, so I left it.
- The rule of four days after posting is federal. The lesson says states follow "similar" rules and tells learners to act well within a month, which is safe.
- Both honors lessons run to about 2,250–2,300 words, slightly over the 2,200 guide. I left them as they are.

## Sources

- VwGO §§ 68, 70; VwVfG § 41; BGB §§ 188, 556, 560; SGB I § 66: gesetze-im-internet.de
- Bekanntgabefiktion change: https://www.advant-beiten.com/aktuelles/aus-drei-mach-vier-aenderung-der-bekanntgabefiktion ; https://www.ihk.de/erfurt/service/recht/aktuelles/neue-zustellungs-und-bekanntgabefiktionen-ab-2025-6353672
- Goethe-Zertifikat B1 structure: goethe.de (Durchführungsbestimmungen / Modellsatz B1), as in RESEARCH.md
- Konjunktiv I forms and the Ersatzregel; zur Kenntnis nehmen synonyms: Duden

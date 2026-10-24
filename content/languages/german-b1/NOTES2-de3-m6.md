# Round 2 notes: module de3-m6 (Living independently and the B1 exam)

`content/math/check-module.sh german-b1 de3-m6`: build and checker report zero problems
(7 lessons, 119 questions, 27 cards, 114 terms, 204 words).

## Added

**Honors lessons** (2)
- `lessons/30h1-reported-speech-news.md` (de3-m6-h-reported-news, "Reported speech in full:
  Konjunktiv I and the replacement rule", 45 min): why the news uses Konjunktiv I (a whole
  paragraph stays attributed), direct vs reported speech, full Konjunktiv I paradigm (sein, haben,
  werden, können, kommen) with the forms that match the indicative marked, the replacement rule
  (KI → KII → würde), three times in reported speech, reported questions and requests
  (solle/möge/sollten), reporting verbs and what they reveal (behaupten, einräumen, bestätigen,
  dementieren …). Examples: direct → news style (5 sentences); whose view is it? (KI vs
  indicative); news German → everyday German. Original reading: a residents' meeting about a closed
  bridge, with translation. Builds on lesson 26; laut/zufolge/hearsay sollen are left to the m4
  honors lesson 20h2 (only referred to).
- `lessons/30h2-official-letters.md` (de3-m6-h-official-letters, "Letters from offices and
  landlords: reading Amtsdeutsch", 50 min): parts of a Bescheid (quick review), Bekanntgabe and the
  one-month Widerspruch deadline, writing a Widerspruch (model letter), nominal style (new
  examples), light verb constructions, sein + zu, abbreviations (z. Hd., i. V., o. g., bzgl., gem.,
  Abs.), the Nebenkostenabrechnung (Vorauszahlung, Nachzahlung, Guthaben, 12-month rules).
  Examples: answering a rejected residents' parking permit (deadline worked out); decoding an
  officialese sentence; checking the service-charge numbers. Original reading: a letter from a
  property management company, with translation. Labelled "simplified, Germany, not legal advice".
  Avoids repeating the German A2 honors lesson 20h3 (letter layout, reminders, A2 abbreviations),
  which it mentions.

**Core lessons 26–30** (additions only, one introducing sentence per figure):
- 26: SVG Sozialversicherung pillars (de3-m6-pillars); Mermaid "where to go when ill"
  (112 / 116 117 / Hausarzt → Überweisung → Facharzt); Mermaid "reporting what someone said".
- 27: Mermaid "which meaning of lassen?"; SVG block of flats (de3-m6-building).
- 28: SVG hin/her house seen from a speaker upstairs (de3-m6-hin-her); Mermaid five parts of a
  presentation.
- 29: Mermaid "choosing the register"; SVG formal letter layout (de3-m6-letter).
- 30: SVG four exam modules (de3-m6-exam); Mermaid speaking-test sequence.

**Pictures** (13 original SVGs, 2–6 KB, all rendered and looked at; label markers checked with
--markers): de3-m6-pillars(-blank), -building(-blank), -hin-her(-blank), -letter(-blank), -exam,
-news(-blank), -bescheid(-blank). The Bescheid blank copy has its section headings removed so the
label question isn't given away.

**Diagrams** (10 Mermaid, all with accTitle/accDescr, rendered): 8 in core lessons as above,
replacement rule (30h1), what to do when a Bescheid arrives (30h2). Branching ones use LR to stay
narrow on phones.

**Questions** (53, `questions/r2-de3-m6.yaml`)
- Core q01–q25, 5 per lesson: label 4 (q01 pillars, q06 building, q11 hin/her, q16 letter), text 5
  (q02, q07, q12, q17, q23), order 5 (q03, q08, q13, q18, q22), match 6 (q05, q10, q15, q20, q21,
  q25), select-all 5 (q04, q09, q14, q19, q24). module_quiz: q01, q04, q06, q12, q13, q16, q21.
- Honors h01–h14 (30h1): 8 MC, 2 text, 1 match, 1 order, 1 select-all, 1 label (news article).
  h15–h28 (30h2): 7 MC, 2 text, 2 match, 1 order, 1 select-all, 1 label (Bescheid). No
  module_quiz (core-module honors).
- Answer positions of the 15 four-choice MC questions: 0: 4, 1: 4, 2: 4, 3: 3.

**Vocabulary** (`vocab-r2-de3-m6.yaml`, 35, ids de3-m6-r2-w01…w35): 30h1 einräumen, dementieren,
sich äußern, das Zitat, die Pressemitteilung, fordern, auffordern, die Sperrung, das Gutachten, der
Umweg, die Bürgerversammlung, einsetzen, verärgert, vorgehen, die Fähre; 30h2 bewilligen, die
Begründung, die Bekanntgabe, Widerspruch einlegen, einen Antrag stellen, zur Verfügung stellen, in
Anspruch nehmen, zur Kenntnis nehmen, das Einschreiben, die Abrechnung, die Vorauszahlung, die
Nachzahlung, das Guthaben, der Beleg, gemäß, anbei, betragen, einsehen, anpassen, die Heizkosten.
Checked against every vocab file in German A1, A2 and B1 (including all r2 files present today)
and PRIOR-WORDS.tsv, by id, term + part of speech and first meaning: no clashes. Dropped because
other files own them: bestätigen, behaupten, warnen, die Brücke, bezüglich (de3-m3 r2), zufolge,
die Angabe, bestreiten, offenbar (de3-m4 r2), der Bescheid, der Widerspruch, das Aktenzeichen,
der Sachbearbeiter/-in, fällig, die Mahnung, beifügen, die Anlage, hiermit, das Schreiben (de2-m5
r2), gegebenenfalls (de1-h1 r2). bewilligen and der Beleg got disambiguated first meanings ("to
grant (an application)", "proof of payment (document)") because genehmigen and die Quittung own
"to approve" and "receipt".

**Glossary** (`glossary-r2-de3-m6.yaml`, 5, checked against every glossary*.yaml in the course):
direct speech, reporting verb, replacement rule, officialese, light verb construction.

**Cards** (`cards-r2-de3-m6.yaml`, 26): 13 per honors lesson.

## For a reviewer to double-check
- Legal points in 30h2, all hedged and labelled simplified: one-month Widerspruch after
  Bekanntgabe (§ 70 VwGO); posted letters deemed delivered on the fourth day after posting under
  the federal VwVfG since 1 Jan 2025 (previously third; states "similar", not verified state by
  state); some states/decisions have no Widerspruch (go to court); Nebenkostenabrechnung within
  12 months of the end of the billing period and tenant objections within 12 months
  (§ 556 Abs. 3 BGB); advance-payment adjustment after a bill (§ 560 Abs. 4 BGB). Example 2 cites
  § 66 SGB I (consequences of not cooperating) as the basis for a possible rejection.
- Example 1 in 30h2 counts the deadline: letter dated Mon 3 May 2027 → deemed delivered Fri 7 May →
  month ends Mon 7 June 2027; the advice is to send by the end of May.
- The residents' parking scenario (car registered to a sister, keeper's confirmation needed) is a
  plausible, fictional rule; real requirements vary by town.
- 30h1 says many papers also use the indicative after a verb of saying, and that in speech people
  often use KII/würde for all reported speech: deliberately not presented as errors.
- Word counts: both honors lessons are about 2,250–2,300 words of body text including the reading
  translations and tables (similar to lesson 26), slightly above the 2,200 guide.
- q14 relies on the Zugspitze being just under 3,000 m (2,962 m), as lesson 28 says.

## Errors found in existing content
None. No existing question, card, vocab or glossary entry was edited.

## Sources
- Bekanntgabefiktion change (three → four days from 2025): ADVANT Beiten, "Aus drei mach vier":
  https://www.advant-beiten.com/aktuelles/aus-drei-mach-vier-aenderung-der-bekanntgabefiktion ;
  NWB Experten-Blog: https://www.nwb-experten-blog.de/verlaengerung-der-bekanntgabefiktion-bei-verwaltungsakten-ab-2025-was-bedeutet-das-fuer-unternehmen-und-buerger/
- VwGO § 70, BGB §§ 556, 560, SGB I § 66: statutory texts (gesetze-im-internet.de), summarized in
  my own words.
- Goethe-Zertifikat B1 structure and scoring: as already researched for this course (RESEARCH.md,
  goethe.de Durchführungsbestimmungen B1).
- Konjunktiv I forms and the replacement rule: standard grammar (Duden-Grammatik conventions),
  written in my own words. All texts, letters and articles are original.

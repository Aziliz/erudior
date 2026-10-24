# Round 2 notes: de3-m5 (If only: Konjunktiv II and more)

## Honors lessons (honors: true, module de3-m5)
- `lessons/25h1-diplomatic-german.md`, `de3-m5-h-diplomatic`: **Diplomatic German: softening, guessing
  and "otherwise"** (about 2,200 words without the English translation, 45 min). Hedging with the
  Konjunktiv II (Ich würde sagen, Ich hätte da eine Frage, Ich fände, Wäre es nicht sinnvoller,
  Ich hätte gedacht, Könnte es sein, dass …?); epistemic modals muss / müsste / dürfte / könnte /
  kann nicht with a probability-scale picture; dürfte as "probably" vs "Dürfte ich …?"; past
  guesses (Er dürfte … verpasst haben, receptive) vs the reproach hätte … müssen; sonst / andernfalls
  + indicative (real warning) vs + Konjunktiv II; meeting dialogue; 3 worked examples.
- `lessons/25h2-literature-history.md`, `de3-m5-h-literature`: **Was wäre, wenn …? The Konjunktiv
  in literature and history** (about 2,130 words without translations, 50 min). Written one-word
  forms (läge, stünde/stände, sähe, nähme, hielte, fiele, täte, führe, brächte, dächte); weak verbs =
  simple past; Kafka's complete "Wunsch, Indianer zu werden" (public domain) with a labeled
  horse-and-rider picture and a verb-by-verb reading (wäre vs ließ/wegwarf/sah/gab), interpretation
  labeled as such; note on the word "Indianer"; original essay "Eine Welt ohne Buchdruck?"
  (Gutenberg, Luther) with a Mermaid chain of real vs imagined events; passive past subjunctive
  (erfunden worden wäre, receptive); 3 worked examples.
- A third lesson on the Arbeitszeugnis was drafted and then removed: German A2's honors lesson
  `20h1-job-application.md` (de2-m5) already teaches the same Zufriedenheit scale and decoding
  example, so it would have duplicated it.

## Core lessons (additions only; text added only to introduce figures)
- 21: Mermaid "Which Konjunktiv II form?"; SVG conditional sentence structure (`de3-m5-conditional`).
- 22: Mermaid "hätte or wäre?" (incl. modal + double infinitive); SVG two paths of Markus's story
  (`de3-m5-two-paths`).
- 23: Mermaid "hope or unreal wish?"; SVG politeness staircase (`de3-m5-politeness`).
- 24: SVG case rules of thumb (`de3-m5-prep-cases`); Mermaid "wo(r)- or preposition + wen/wem".
- 25: Mermaid "müssen / nicht dürfen / nicht brauchen zu"; SVG formal e-mail layout (`de3-m5-letter`).

## Pictures (images/)
de3-m5-conditional(.svg, -blank), de3-m5-two-paths(.svg, -blank), de3-m5-politeness,
de3-m5-prep-cases, de3-m5-letter(.svg, -blank), de3-m5-h-probability, de3-m5-h-rider(.svg, -blank).
All original, under 7 KB, previewed; label markers checked on the blank versions.

## Questions (`questions/r2-de3-m5.yaml`, 53)
- Core q01–q25 (5 per lesson): text 7, match 5, order 5, select-all 5, label 3 (lessons 21, 22,
  25). module_quiz: q01, q04, q06, q07, q11, q13, q16, q19, q21, q24 (2 per lesson).
- Honors h01–h14 (25h1): choice 7, text 3, select-all 2, order 1, match 1.
- Honors h15–h28 (25h2): choice 7, text 2, select-all 1, match 2, order 1, label 1.

## Vocabulary, glossary, cards
- `vocab-r2-de3-m5.yaml`: 27 words. 25h1 (10): möglicherweise, sinnvoll, die Summe, berechnen,
  sich verrechnen, die Tabelle, nachfragen, erwarten, der Saal, reichen. 25h2 (17): der Buchdruck,
  die Druckerei, das Verfahren, beweglich, der Mönch, abschreiben, die Bibel, die Reformation, die
  Übersetzung, die Spekulation, das Gedankenexperiment, verlaufen, der Reiter, der Zügel, der Sporn,
  die Heide, schief. Checked against every vocab file in German A1, A2 and B1, including all r2
  files and PRIOR-WORDS.tsv: no shared term + part of speech, first meaning or id. andernfalls
  (in de3-m2's r2 vocab) and Bescheid sagen (A2) are only taught in the text.
- `glossary-r2-de3-m5.yaml`: hedging, epistemic modal, counterfactual (no clash with any German
  glossary).
- `cards-r2-de3-m5.yaml`: 22 cards (11 + 11).

## For the reviewer
- `check-module.sh german-b1 de3-m5`: build and checker OK, zero problems.
- Probability scale: the order muss > müsste > dürfte > könnte follows Hueber's "Sicher! C1"
  grammar overview (100 / 90 / 75 / 50 %). The lesson calls it a rough guide, and the order question
  (h03) leaves out müsste, because sources differ on müsste vs dürfte.
- Kafka text checked fragment by fragment against an online edition: 61 words, one sentence.
  Betrachtung was printed at the end of 1912, and its title page says 1913. The reading of the
  change from Konjunktiv to past forms is labeled as one interpretation among others.
- The "Indianer" note presents the modern debate neutrally and keeps the historical title.
- Luther's influence on standard written German is stated as strong but debated in degree.
  "Within a few weeks" for the theses follows the usual account.
- Vocab added by other writers at the same time could still clash. Watch for erwarten, reichen,
  die Tabelle, die Summe and verlaufen, which are common words.
- The Kafka piece might also suit the de3-h1 honors module (literature); if that writer uses it too,
  one of the two should go.

## Errors found in existing content
None.

## Sources
- Kafka, "Wunsch, Indianer zu werden" (Betrachtung): text checked against
  https://fleursdumal.nl/mag/?p=9223; publication: https://en.wikipedia.org/wiki/Contemplation_(short_story_collection)
- Modal scale: Hueber, Sicher! C1 Grammatikübersicht, https://legacy.hueber.de/media/36/Sicher_C1_Grammatikuebersicht.pdf
- (Background for the dropped Arbeitszeugnis lesson: § 109 GewO, https://www.gesetze-im-internet.de/gewo/__109.html;
  IHK Bonn Merkblatt Arbeitszeugnis; BAG 18.11.2014, 9 AZR 584/13.)
- Duden for genders, plurals and strong forms (Sporn/Sporen, Saal/Säle, stünde/stände, verlaufen).

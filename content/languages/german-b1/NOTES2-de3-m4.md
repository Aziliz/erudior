# Round 2 notes: de3-m4 (Society and the world)

## Honors lessons (honors: true, module de3-m4)
- `lessons/20h1-how-laws-are-made.md`, `de3-m4-h-lawmaking`: **Wie ein Gesetz entsteht: the passive in
  official German** (about 2,080 words, 45 min). An original process text on how a federal law is made
  (bill, Bundesrat comment, three readings, committee, Bundesrat consent or objection, mediation
  committee, countersignature, President's signature, Bundesgesetzblatt, entry into force) with a Mermaid
  flowchart; the state passive for active use; passives with no subject (dative verbs, verbs with a
  preposition, es + dass/ob clauses); sich lassen + infinitive alongside man, sein + zu and -bar; reading
  Art. 76(2) GG; critical reading of "Es wurden Fehler gemacht". 3 worked examples.
- `lessons/20h2-sources-claims.md`, `de3-m4-h-sources`: **Wer sagt das? Sources, claims and checking the
  news** (about 2,040 words, 45 min). laut / nach Angaben / zufolge / wie-clauses; hearsay sollen and
  claim wollen with the perfect infinitive; Konjunktiv I in reports (receptive, points to lesson 26);
  certainty adverbs incl. scheinbar vs anscheinend; an original news report that continues the lesson 19
  post; fact-checking method (Mermaid); press freedom (Art. 5 GG), Pressekodex, public broadcasting.
  3 worked examples.

## Core lessons (additions only)
- 16: bins picture (de3-m4-bins) + Mermaid "active to passive" + Mermaid "which job is werden doing".
- 17: newspaper-page picture (de3-m4-newspaper) + Mermaid "wurde, worden or geworden".
- 18: signs picture (de3-m4-signs) + Mermaid "muss nicht or darf nicht" + Mermaid "sein + zu: must or
  can", with one added sentence noting that *nicht zu* on a sign is a ban.
- 19: Mermaid "da-compound or preposition + pronoun" + labeled social-media post (de3-m4-post).
- 20: political-system diagram (de3-m4-system, with a sentence on the Bundesversammlung) + Mermaid
  "three passes".

## Pictures (images/)
de3-m4-bins(.svg, -blank), de3-m4-newspaper(.svg, -blank), de3-m4-signs, de3-m4-post(.svg, -blank),
de3-m4-system(.svg, -blank). All original, 3–5 KB, previewed; label markers checked on the blanks.

## Questions (`questions/r2-de3-m4.yaml`, 53)
- Core q01–q25 (5 per lesson): text 6, match 5, order 5, label 4, select-all 5. module_quiz: q01, q03,
  q06, q09, q11, q14, q16, q18, q21, q23.
- Honors h01–h28 (14 per lesson): choice 16 (answers spread over 0–3), select-all 3, text 4, order 3,
  match 2 (no labels; the images are in the core lessons).

## Vocabulary, glossary, cards
- `vocab-r2-de3-m4.yaml`: 38 words (w01–w20 for 20h1: Gesetzentwurf, Entwurf, Lesung, Ausschuss,
  Bundesrat, Bundespräsident(in), verabschieden, in Kraft treten, Einspruch, Zustimmung, unterzeichnen,
  Abstimmung, Koalition, Opposition, der Abgeordnete, regeln, festlegen, Zustand, Beschluss; w21–w38 for
  20h2: Angabe, zufolge, offenbar, scheinbar, Pressefreiheit, Zensur, Rundfunk, öffentlich-rechtlich,
  recherchieren, Recherche, Impressum, seriös, Faktencheck, beweisen, Beweis, Studie, fälschen,
  bestreiten). Checked by term + part of speech, first meaning and id against every vocab file in German
  A1, A2 and B1 (incl. all r2 files present now) and PRIOR-WORDS.tsv: no clashes. das Gerücht is in
  German A2 r2 (de2-m1), so 20h2 only glosses it.
- `glossary-r2-de3-m4.yaml`: sich lassen, hearsay. (state passive, perfect infinitive and reported
  speech are bolded but already defined in glossary-m4 / glossary-r2-de3-m1 / glossary-m6.)
- `cards-r2-de3-m4.yaml`: 23 cards (12 + 11).

## For the reviewer
- check-module.sh german-b1 de3-m4: build and checker OK, zero problems (an earlier run failed only on
  duplicate words in other writers' A1/A2 honors files, since fixed).
- Other writers' files, not mine: German A2 r2 adds `aktuell` (de2-m6-r2-w16) and `berichten`
  (de2-m6-r2-w05), which B1 already teaches (vocab-m4 `aktuell`, vocab-m1 `berichten`): same term + pos
  across courses. The checker passed now, but please confirm the build treats these as intended.
- Simplified and labelled as such: the law-making flowchart (Bundestag bills skip the Bundesrat comment;
  the objection/overrule path is in the text, not the chart). The extent of the President's review is
  described as debated among lawyers; "refused only a few times since 1949" is deliberately unspecific.
- Contested: the scheinbar/anscheinend distinction (labelled as careful-writing usage); debate about
  public broadcasting cost and balance (labelled as debate; no fee amount given, since it is in dispute).
- 20h1 uses *sich lassen* before lesson 27 teaches *lassen*; it is fully explained and points to 27.
  20h2 previews Konjunktiv I receptively and points to lesson 26.
- Text in the lesson 18 sign "Eltern haften für ihre Kinder" is a common real sign wording (glossed).

## Errors found in existing content
None corrected. Small note: lesson 18 says *sein + zu* "with words like leicht, schwer, kaum, nicht …
usually means can"; with *nicht* on a sign (*Der Rasen ist nicht zu betreten*) it is a ban. I added a
clarifying sentence after the new diagram instead of editing the existing text.

## Sources
- Grundgesetz Art. 76 (wording of Abs. 2 quoted), Art. 82 (entry into force 14 days after the
  Bundesgesetzblatt; electronic Bundesgesetzblatt), Art. 79(2), Art. 5:
  https://www.gesetze-im-internet.de/gg/art_76.html, https://www.gesetze-im-internet.de/gg/art_82.html
- Bundestag, "Materielles Prüfungsrecht des Bundespräsidenten" (Datenhandbuch 10.07):
  https://www.bundestag.de/resource/blob/196210/f8c1a17917a5f8e43c30ceb77cd268ec/Kapitel_10_07_Materielles_Pr__fungsrecht_des_Bundespr__sidenten-data.pdf
- Bundestag size 630 since the 2023 electoral reform (as in lesson 20); Vermittlungsausschuss 16 + 16
  members; Impressum duty for business websites (Digitale-Dienste-Gesetz § 5, formerly TMG § 5);
  Deutscher Presserat, Pressekodex (Ziffer 2 care, Ziffer 3 corrections).
- Duden for genders, plurals (Impressen, Ausschüsse, Beschlüsse), laut + genitive/dative, zufolge + dative.

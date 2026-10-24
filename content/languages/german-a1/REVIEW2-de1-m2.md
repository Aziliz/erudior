# Round 2 review: de1-m2 (People and things)

Reviewed: honors lessons 08h1 (people and gender) and 08h2 (families and names); round 2 additions
to lessons 05–08 (4 pictures, 4 Mermaid diagrams); `questions/r2-de1-m2.yaml` (49 questions, all
worked independently); `vocab-r2-de1-m2.yaml` (27 words); `glossary-r2-de1-m2.yaml` (6 terms);
`cards-r2-de1-m2.yaml` (22 cards); all 6 `images/de1-m2-*` SVGs plus the 4 blank copies with
their label-question markers. All 6 Mermaid diagrams rendered and read. `check-module.sh german-a1
de1-m2`: OK, zero problems.

## Changes

### Answer-key errors (2)
- **de1-m2-r2-q09** (select-all): the "wrong" choice *Das ist euere Mutter.* is not clearly
  wrong: Duden lists *euere* as a rarer variant of *eure* (also Wiktionary "euere"). Replaced it
  with *Das ist euer Mutter.* (missing ending, clearly wrong) and rewrote that part of the
  explanation.
- **de1-m2-r2-q21** (doch): the stem was the rhetorical question *Ist das nicht dein Handy?*,
  where native speakers also answer *Ja, das ist mein Handy* when the question is really
  "that's your phone, isn't it?"; the explanation said *ja* "doesn't fit". Changed the stem to the
  negative statement *Das ist nicht dein Handy.* (lesson 08's third doch example), where only
  *Doch* contradicts; explanation updated.

### Factual fixes (4)
- **"-chen nouns are always neuter"** (08h1 "When the word and the person don't match",
  question h01 choice + explanation, the das-Mädchen card, lesson 05 Mermaid diagram node H and
  its accDescr): false as stated (*der Kuchen*, *der Knochen*, *der Rachen* end in -chen). Now
  "nouns made with the 'little' ending -chen" / "a small-form word in -chen or -lein, like
  Brötchen", with *der Kuchen* named as the non-example. Lesson 05's round 1 table already scopes
  it to "(small things)", so this matches.
- **Lesson 05 diagram node G** "die (feminine)" for -ion/-tät: added "-ion and -tät have a few
  exceptions" (*der Spion*, *das Stadion*), matching the round 1 table, which says "feminine",
  not "always". accDescr updated.
- **Capital I (LehrerInnen)**: the gender-star card said all four signs (incl. capital I) are
  "meant to include everyone" and are read with a break; the glossary entry grouped the capital I
  with the star. The Binnen-I is the older form made to name women and men only. Card, glossary
  entry and one clause in 08h1 ("the older capital I … was made to name women and men") fixed.
- **08h2 Patchworkfamilie** "a word taken from English": it is a German compound built with the
  English word *patchwork*, not an English loan as a whole. Reworded.

### Picture fixes (1)
- **de1-m2-r2-h15** (patchwork label): markers 2 (Markus, x 26.3 → 26.8) and 5 (Lisa, x 49 → 52)
  sat on the box borders; moved inside the boxes. Re-rendered and checked.

### Other fixes (2)
- **de1-m2-r2-h06**: stem "Which of these always include both men and women?" was not true of
  *die Lehrkräfte* (an all-female staff is also *Lehrkräfte*). Now "Which of these can name a mixed
  group of female and male teachers?"; key unchanged ([0, 1, 2]).
- **vocab w12 die Lehrkraft**: `alt: [die Lehrkraefte]` was a plural with ae for a singular term
  that has no umlaut; removed.

## Checked and found right (a reader might doubt)
- Female forms and plurals: Ärztin, Köchin, Kollegin, Kundin, Kauffrau/Kauffrauen,
  Kaufleute, Feuerwehrfrau, Feuerwehrmänner/-leute, Krankenpfleger(in), Polizistin (Duden).
- *Mädchen* < diminutive of *Magd*; textbook pronoun *es*, *sie* common (labeled as varying usage).
- Rat für deutsche Rechtschreibung 2023 (14 Jul / 15 Dec) did not admit gender signs into official
  spelling; Bavaria 2024 ban for state offices/schools (AGO change, in force 1 Apr 2024); Hesse
  school decree Apr 2024. *divers* in civil status since Dec 2018; AGG bars gender-exclusive job
  adverts; Pflegefachfrau/-mann since 1 Jan 2020 (Pflegeberufegesetz).
- Marriage-name reform in force 1 May 2025: double name possible as shared married name, children
  can get a double name from both parents, at most two parts (berlin.de Standesamt; mtrlegal.com).
- Müller is the most common German surname, Schmidt second; Meyer/Meier originally a steward or
  farm manager; Wagner = cartwright.
- Genitive -s on names without apostrophe; apostrophe only after s-sound endings (§96 amtliches
  Regelwerk); *Andrea's*-type apostrophe permitted only to clarify the base name (§97).
- All other questions: one defensible answer each, accept lists complete (ä/ae variants present;
  apostrophe in *Max'* is preserved by the app's normalizer, so it is required), orders unique,
  match/label pairings unambiguous, label markers on the right parts (desk, family tree, colours,
  patchwork re-rendered).
- Vocab: scripted check against every vocab file in German A1, A2 and B1 (incl. other writers'
  vocab-r2 files): no shared id, term+pos or first meaning. Glossary: no term/alias duplicates in
  any A1 glossary file.
- Pictures: all readable, nothing cut off; label colours in the desk picture match genders.
- Mermaid: all six render, accTitle/accDescr describe the whole diagram.

## Left uncertain / for the editor
- **Round 1, lesson 06 (out of scope, not edited)**: says *eure, not ~~euere~~* and lists
  "Saying ~~euere~~" as a mistake. Duden accepts *euere* as a rarer variant; consider softening to
  "the usual form is *eure*".
- Lesson 06 diagram puts "girl" under *ihr*; consistent with the lesson, though grammatically
  *das Mädchen* takes *sein* (08h1 covers the es/sie variation).
- duden.de could not be fetched in this session (permission not granted); Duden points rely on
  standard Duden entries and Wiktionary.
- Overlap: none found with other round 2 lessons in German A1 (no other lesson covers gender-fair
  language, m/w/d, name genitive or patchwork families).

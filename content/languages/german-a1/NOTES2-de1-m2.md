# Round 2 notes: de1-m2 (People and things)

## Honors lessons (honors: true, module de1-m2)
- `lessons/08h1-people-gender.md`, `de1-m2-h-people-gender`: **People and gender: job titles and
  gender-fair German** (about 1,900 words, 45 min). Neuter and feminine nouns for people (das
  Mädchen → es/sie, die Person, der Mensch); all patterns for female job titles (-in, umlaut + -in,
  -e → -in, -mann → -frau) and plurals; generic masculine vs paired forms, neutral words and gender
  star/colon/underscore/Binnen-I, presented as a live debate with the 2023 Rechtschreibrat
  decision and the 2024 Bavaria/Hesse rules; (m/w/d) in job adverts; school-letter reading text;
  3 worked examples.
- `lessons/08h2-family-names.md`, `de1-m2-h-family-names`: **Families and names: Annas Bruder**
  (about 1,750 words, 45 min). Mama/Papa; recognition of Onkel, Tante, Cousin(e), Neffe, Nichte,
  Enkel(in); patchwork-family words; linking s (Zwillingsschwester); Vorname/Nachname/Spitzname;
  surnames from old jobs; German marriage-name rules after the May 2025 reform; name + -s genitive
  (Annas, Max', von + name); a longer reading text (Ben's family); 3 worked examples.

## Core lessons (additions only)
- 05: labeled office-corner picture (gender-coloured labels) + Mermaid "finding the article".
- 06: Lena's family-tree picture + Mermaid "sein or ihr, and the ending".
- 07: Mermaid "aus/in + country with or without article" + sprechen conjugation chart (SVG).
- 08: colour-swatch picture + Mermaid "kein or nicht" (tree, two levels).

## Pictures (images/)
de1-m2-desk(.svg, -blank), de1-m2-family-tree(.svg, -blank), de1-m2-sprechen, de1-m2-colours
(.svg, -blank), de1-m2-job-ad, de1-m2-patchwork(.svg, -blank). All previewed, markers checked.

## Questions (`questions/r2-de1-m2.yaml`, 49)
- Core q01–q21 (21): text 6, match 4, order 4, label 3, select-all 3, choice 1. module_quiz on
  2 per lesson (q01, q03, q06, q09, q11, q17, q20).
- Honors h01–h28 (28, 14 per lesson): text 5, match 2, order 2, label 1, select-all 2, choice 16.
  Two image questions (job advert, patchwork tree).

## Vocabulary, glossary, cards
- `vocab-r2-de1-m2.yaml`: 27 words (w01–w15 for 08h1: das Mädchen, female job forms from lesson 7's
  notes, Kaufmann/Kauffrau, Feuerwehrmann/-frau, Lehrkraft, Krankenpfleger(in), die Dame;
  w16–w27 for 08h2: Mama, Papa, Patchworkfamilie, Stiefvater/-mutter, Halbbruder/-schwester,
  Zwilling, Einzelkind, getrennt, Nachname, Spitzname). Checked against every vocab file in
  German A1, A2 and B1: no shared term+pos, first meaning or id.
- `glossary-r2-de1-m2.yaml`: generic masculine, paired form, gender-fair language, gender star,
  genitive, linking s.
- `cards-r2-de1-m2.yaml`: 22 cards (12 + 10).

## For the reviewer
- Onkel, Tante, Cousin, Neffe, Enkel, Großeltern, Verwandte, der Mensch, die Leute are vocabulary
  items in German B1 (and Kollege/Kunde/Partner in A2), so 08h2/08h1 only gloss them; adding them
  to A1 would break the A2/B1 builds (duplicate carried words). It's odd that B1 owns Onkel/Tante.
- das Mädchen was not in any vocab list although lesson 05 uses it; now in vocab-r2 (w01). If
  another round-2 writer adds it too, one must go.
- `genitive` is a new A1 glossary term; if another A1 writer also adds it the build will fail on
  the duplicate.
- Contested content is labeled as such: es/sie after das Mädchen (usage varies), the
  gender-fair-language debate.
- Fact checks: Rechtschreibrat 14 Jul and 15 Dec 2023; Hesse school decree Apr 2024; Bavaria ban
  for state offices/schools 2024; divers in civil status since Dec 2018; Pflegefachfrau/-mann
  since 2020 (Pflegeberufegesetz); marriage-name reform in force 1 May 2025 (double names for
  both spouses and children; no more than two parts).
- Lesson 08's kein/nicht diagram uses only examples already in the lesson.

## Errors found in existing content
None.

## Sources
- GEW Hessen, "Geschlechtergerechte Schreibweise" info (7 May 2024): Hesse decree of 22 Apr 2024
  and Rechtschreibrat decisions of 14 Jul and 15 Dec 2023.
  https://www.gew-hessen.de/fileadmin/user_upload/5_recht/aktuell/24_05_07_Geschlechtergerechte_Schreibweise_Info.pdf
- Der Standard, "Bayern verbietet Gendern in Behörden" (2024).
  https://www.derstandard.at/story/3000000213600/bayern-verbietet-gendern-in-behoerden
- MTR Legal, "Neues Namensrecht seit 1. Mai 2025". https://www.mtrlegal.com/neues-namensrecht-seit-1-mai-2025/
- Duden (genders, plurals Kaufleute, Feuerwehrmänner/-leute); amtliches Regelwerk §96–97
  (apostrophe after names).

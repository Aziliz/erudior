# Round 2 notes: de1-h1 (Honors: Kultur und Alltag)

Honors module, 4 lessons (files 90–93). A previous writer drafted lessons 90–92 and was stopped
before writing anything else; I kept those lessons, fixed and trimmed them, and wrote lesson 93
and all other files.

## Lessons

| File | Id | Title | Body words* |
|---|---|---|---|
| 90-ankommen.md | de1-h-ankommen | Ankommen: registering, appointments and letters from the Amt | ~2,060 |
| 91-zusammen-wohnen.md | de1-h-zusammen-wohnen | Zusammen wohnen: neighbours, quiet hours and recycling | ~2,230 |
| 92-maerchen.md | de1-h-maerchen | Es war einmal: reading a fairy tale | ~2,220 |
| 93-gemuetlich.md (new) | de1-h-gemuetlich | Gemütlich: Feierabend, the Kleingarten and little words | ~2,100 |

*Front matter and code blocks excluded; tables and English translations of the German texts are
included, which is why 91 and 92 are slightly over 2,200.

- 90: the Anmeldung (Germany, with Austria/Switzerland notes), the first official letters (Steuer-ID,
  Rundfunkbeitrag, health insurance), reading a formal letter from the Bürgeramt, abbreviations
  (z. B., d. h., usw., bzw., ca., ggf., evtl., u. a.), capital Ihr. Mermaid flowchart of the
  registration steps; picture of a building entrance.
- 91: the Hausordnung, infinitive commands, quiet hours and party notices, the bins, Pfand,
  two-way prepositions with Wohin? + accusative (lesson 19 left this for later). Mermaid
  "where does it go?" decision chart; picture of the four bins.
- 92: the Brothers Grimm, the usual shape of a fairy tale (Mermaid), the simple past of weak and
  strong verbs for reading, principal parts, and an original A1 retelling of Die Bremer
  Stadtmusikanten; picture of the four animals.
- 93 (new): Schönen Feierabend / Danke, gleichfalls, Gemütlichkeit, Kneipe and Stammtisch, the
  Kleingarten (Schreber, the federal rules, simplified), and the diminutive (-chen/-lein: umlaut,
  dropping -e, always das, unchanged plural, friendly use, lexicalized words like Mädchen/Märchen/
  Kaninchen/Eichhörnchen, regional -le/-li/-erl). Mermaid "how to make a diminutive"; picture of
  an allotment garden; an original reading text, "Feierabend im Kleingarten". Lesson 92 already
  promised "see the next lesson" for diminutives, so 93 delivers that.

### Changes to the previous writer's lessons
- 90: topic "Compound nouns and linking letters" replaced by "Abbreviations in official German"
  (the lesson never taught compounds; 20h2 already does). Dialogue line "Nummer 104, Herr Brandt?"
  changed to "Herr Brandt?" (104 was the room number in the letter, which made the line confusing).
- 91: trimmed from ~2,400 words (the quiet-hours section now points to the module 4 honors lesson
  instead of repeating it; several passages tightened); quoted the topic containing "?" (YAML).
- 92: trimmed from ~2,280 words; the modal paragraph now points back to 24h1; the rooster
  sentence of the story rewritten in my own words (the old one followed the Grimm sentence shape
  closely). The story is a free A1 retelling, not the Grimms' text; the only fixed formulas quoted
  are "Es war einmal" and the one-line closing formula "… dann leben sie noch heute".
- Alt texts of the bins and musicians pictures updated to match the drawings.

## Questions (questions/r2-de1-h1.yaml): 56, ids de1-h1-r2-h01 … h56

14 per lesson; 18 marked module_quiz (4–5 per lesson). Multiple-choice answers spread 9/8/8/8 over
positions 0–3.

| Type | Count |
|---|---|
| multiple choice | 33 |
| select all | 4 |
| text (typed German) | 7 |
| match | 4 |
| order | 4 |
| label | 4 |

## Pictures (images/)
- de1-h1-entrance.svg + -blank.svg (Hausnummer, Klingel, Briefkasten, Haustür) – lesson 90, label q h08
- de1-h1-bins.svg + -blank.svg (gelbe Tonne, Papiertonne, Biotonne, Restmüll) – lesson 91, label q h19
- de1-h1-musicians.svg + -blank.svg (Esel, Hund, Katze, Hahn) – lesson 92, label q h37
- de1-h1-garden.svg + -blank.svg (Laube, Baum, Zaun, Beet, Blume, Gießkanne) – lesson 93, label q h48
All original, previewed with markers. Diagrams: 4 Mermaid flowcharts (one per lesson).

## Vocabulary (vocab-r2-de1-h1.yaml): 53 words, ids de1-h1-r2-w01 … w53
90: 12, 91: 11, 92: 12, 93: 18. Checked against every vocab file in german-a1, german-a2 and
german-b1 (A2 and B1 carry A1's words, so a duplicate there would break their builds). Many words
the lessons use already belong to A2/B1 (das Amt, die Anmeldung, der Nachbar, das Pfand, die
Hausordnung, das Märchen, der Briefkasten, die Klingel …) and are glossed in the text instead.
I dropped die Hexe and der Baum because the A2 honors writer (vocab-r2-de2-h1.yaml) has just
added them. If any other course adds one of my words later, one of the two must go.

## Glossary (glossary-r2-de1-h1.yaml): 4 terms
abbreviation, infinitive command, principal parts, diminutive (the other bolded terms, simple past,
weak/strong verb and two-way preposition, already exist).

## Cards (cards-r2-de1-h1.yaml): 43
90: 11, 91: 10, 92: 10, 93: 12.

## Check
`content/math/check-module.sh german-a1 h1`: 4 lessons, 56 questions, 43 cards, 53 words: OK.

## For the reviewer
- Kleingarten rules are simplified and labeled as such: max 400 m² and Laube max 24 m² incl.
  covered seating (Bundeskleingartengesetz § 3); "about a third" for fruit and vegetables comes
  from court practice (BGH 2004), not from the text of the law. "About 900,000" gardens is the
  BDG figure. The lesson says you rent from the club; legally it is usually a sub-lease (the club
  leases the land from the town). Question h51 says so in its explanation.
- Schreber: Leipzig doctor (1808–1861); first Schreberverein founded in Leipzig in 1864, starting
  with a playground. I didn't name the founder (Ernst Hauschild) because I couldn't confirm it.
- Etymologies in 93 (Mädchen < Magd, Märchen < Märe, bisschen < Bissen, Müesli < Mues) are the
  standard dictionary ones; worth a glance.
- Pfand amounts (25 ct single-use; 8 or 15 ct Mehrweg) and the 2-week Anmeldung deadline (Austria:
  3 days) were in the earlier draft; I checked them and left them.
- Grimm dates: Jacob 1785–1863, Wilhelm 1786–1859, KHM vol. 1 1812, Bremer Stadtmusikanten in the
  1819 edition, Marcks statue 1953.

## Errors found in existing content
None outside this module.

## Sources
- Bundeskleingartengesetz, § 3 (gesetze-im-internet.de); BDG factsheet on the law ("rund 900.000
  Kleingärten"): https://www.presseportal.de/download/document/642ba0d0270000fd2cd31467-factsheet-bundeskleingartengesetz.pdf
- 150 years of the Schreber movement, Leipziger Internet Zeitung (2014):
  https://www.l-iz.de/kultur/lebensart/2014/06/150-Jahre-Schreberbewegung-Deutsches-Kleingaertnermuseum-55719
- Office International du Coin de Terre et des Jardins Familiaux, Germany page:
  https://jardins-familiaux.org/nations/de/eng/de_e_start.html
- Bundesmeldegesetz § 17 (two weeks); Austrian Meldegesetz (three days); Duden/DWDS for genders,
  plurals and etymologies.

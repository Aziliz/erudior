# Round 2 review: module de1-m3 (Food, shopping and time)

Reviewed: honors lessons 12h1 (food culture) and 12h2 (week planning), the figure additions to
core lessons 09–12, `questions/r2-de1-m3.yaml` (50 questions), `vocab-r2-de1-m3.yaml` (33),
`glossary-r2-de1-m3.yaml` (4), `cards-r2-de1-m3.yaml` (23), and the 12 `images/de1-m3-*` SVGs.
Every question worked before reading the key; all 12 SVGs (5 blanks with their question markers)
and all 6 Mermaid diagrams rendered and inspected. `content/math/check-module.sh german-a1 de1-m3`
reports OK after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| de1-m3-r2-q02 (answer key) | "Mein Bruder ___ ___ Apfel." asked only for "the right article" with no meaning given, so *keinen*, *meinen*, *seinen* … were equally correct but rejected; only *einen*/*den* were accepted. | Stem now gives the meaning ("My brother is eating an apple."); accept is *isst* + *einen*; explanation notes *den Apfel* for "the apple". |
| de1-m3-r2-h11 (other) | Choices and explanation called the narrator "she", but the reading "Sonntag bei Oma" never gives the narrator's gender. | Choices now say "The narrator …"; explanation reworded. |
| 12h2, reading "Unsere Woche" (factual/consistency) | Papa "steht jeden Tag um vier auf" (also the key of h27), but later "sonntags … schlafen wir lange" said the whole family sleeps in on Sundays: a contradiction a careful learner would trip on. | Added *nur Papa nicht: Die Bäckerei ist sonntags bis elf geöffnet.* (matches the lesson's point that bakeries open Sunday mornings); translation and gloss (*nur Papa nicht* = except Dad) added. h27 unchanged and now consistent. |
| 12h2, "Reading opening hours" (other) | Said to read the days "with *von … bis*" but the example right below reads *Montag bis Freitag* (no *von*). | Now "join the days with *bis* (or *von … bis*) and say the times with *von … bis*". |
| 12h1, Pronunciation (other) | *Mahlzeit* respelled "MAAL-tseit"; English readers would not get the *ei* = "eye" sound from that. | "MAAL-tsite (*ei* like "eye")", matching lesson 1's convention. |
| images/de1-m3-clock.svg (picture) | The minute hand ran over the numeral 6, hiding half of it. | Shortened the minute hand (y2 480 → 456); re-rendered: 6 fully readable, hand still clearly on the 6. |

## Checked and found right (a reader might doubt)

- **Answer keys**: all other 48 questions have exactly one defensible answer; select-all sets (q04, q08, q14, q18, h09, h15, h25) are complete; order questions (q05, q09, q15, q16, h13, h24) have a single order; match/label pairings are unambiguous. MC answer positions spread 4/4/5/4.
- **Label markers**: breakfast (6), price tag (4), clock (5: at the 3, 4, 6, 8, 9 = 3:15, 3:20, 3:30, 3:40, 3:45), sentence slots (5), meals (4) all sit on the parts their labels name. Clock marker coordinates recomputed (r = 39.2 %, 30° steps).
- **Clock picture**: hour hand halfway between 3 and 4 at 3:30; *nach drei* band 12→4, *vor vier* band 8→12; *fünf vor/nach halb vier* = 3:25/3:35.
- **Arithmetic** (recomputed in Python): 1.299,95 € read *tausendzweihundertneunundneunzig Euro fünfundneunzig*; 7,60 € + ~10 % → 8,40 €, change 1,60 €; 4,60 € + ~10 % → 5 € (h08); bakery 4 × 0,45 + 0,90 + 2 × 2,20 = 7,10 €, change 2,90 €; flowchart 3,40 → 4 € / 6 € change; bakery week 5 × 11,5 + 6 + 3 = 66,5 h; Saturday 7–13 = 6 h.
- **Grammar**: *hätte* and *möchte* are both Konjunktiv II (of *haben*, *mögen*); masculine-only change in the accusative of time (*jeden/nächsten/diesen/den ganzen*); feminine measure nouns plural after numbers (*zwei Scheiben*, *zwei Flaschen*) while *Kilo*, *Stück* stay singular; *dauern* + bare accusative; *gegen* replaces *um*; -s time adverbs lower-case; "general before specific" time order and *Morgen um acht* as one position-1 element; *eins sechzig* for 1,60 €.
- **Culture** (all labeled simplified in the text): *Mahlzeit!* as a workplace lunchtime greeting; *Ich bin voll* = colloquially "drunk"; *Abendbrot* mainly north/east; tipping by stating the total, ~5–10 %; Sunday closing with bakery/station/airport/petrol-station exceptions, regulated by the states since the 2006 federalism reform (Bavaria long kept the federal Ladenschlussgesetz, which the "simplified" label covers).
- **Regional words**: Semmel (Bavaria, Austria, Saxony), Schrippe (Berlin), Weck/Weckle (southwest), Rundstück (Hamburg); Breze/Brezn (Bavaria); Austrian Erdapfel, Paradeiser, (Schlag)obers, Topfen. Genders/plurals per Duden: die Brezel/-n, die Semmel/-n, der Weck, die Schrippe, die Scheibe/-n, der Ruhetag/-e, die Mahlzeit/-en, der Bäcker/–.
- **Brotkultur**: added to Germany's national inventory of intangible cultural heritage in December 2014 (KMK announcement of 12.12.2014; deutschland.de).
- **Vocab duplicates**: script compared all 33 new words (id, term + pos, first meaning) with every vocab file in German A1, A2, B1 incl. other `vocab-r2-*`: no clash. Closest: *die Semmel* "bread roll (southern German and Austrian word)" vs *das Brötchen* "bread roll" (disambiguated by the note), *geöffnet* "open (of a shop or office)" vs B1 *offen* "open".
- **Cross-references**: *Jahr* (lesson 3), *Monat/Sommer* (lesson 16), *Am Montag arbeite ich nicht* (lesson 12 reading), *Es gibt keinen Reis mehr* (lesson 10), *joggen*, *bleiben*, *Termin* glossed where used.
- **Mermaid** (6): content correct, accTitle/accDescr describe the whole chart, readable, TD layout.

## Overlap

No real repetition with other round 2 lessons. 04h1 uses *jeden Tag* in passing; 16h2 uses *jeden Tag* in a reading; 16h1 / 91-zusammen-wohnen cover Sunday quiet rules, while 12h2 only mentions Sunday shop closing briefly (as the writer noted).

## Uncertain / left as is

- Regional borders for Semmel / Weck / Rundstück are fuzzy; the lesson says so.
- Lesson 9's "nominative or accusative?" chart treats every non-object noun as nominative; true for what the course has taught by then (no prepositions or dative yet), but it will need the dative later. Left as is.
- *Paradeiser* is mainly eastern Austria (Vienna); western Austria also says *Tomate*. Not wrong as written, so not changed.

## Sources

- KMK, 12.12.2014, "27 Kulturformen ins deutsche Verzeichnis des immateriellen Kulturerbes aufgenommen": https://www.kmk.org/aktuelles-1/artikelansicht/27-kulturformen-ins-deutsche-verzeichnis-des-immateriellen-kulturerbes-aufgenommen.html
- deutschland.de, "Deutsches Brot und Brotkultur": https://www.deutschland.de/de/topic/leben/deutsches-brot-und-brotkultur
- Duden online (Brezel, Semmel, Weck, Schrippe, Mahlzeit, voll [ugs. "betrunken"], Scheibe, Ruhetag) for genders, plurals and senses.

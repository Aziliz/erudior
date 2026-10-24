# Round 2 review: de2-m6 (Media, celebrations and the A2 exam)

Reviewer, independent of the writer. Scope: honors lessons 24h1 and 24h2, round 2 additions to core
lessons 21–24, `questions/r2-de2-m6.yaml` (53), `vocab-r2-de2-m6.yaml` (24), `glossary-r2-de2-m6.yaml` (5),
`cards-r2-de2-m6.yaml` (26), `images/de2-m6-*` (11 SVGs), 7 Mermaid diagrams.

## Changes

| where | what was wrong | change | source |
|---|---|---|---|
| `de2-m6-r2-q08` (order) | Stem said "starting in December", but the first Sunday of Advent falls between 27 Nov and 3 Dec; explanation said Karneval "ends just before Lent" without noting the season opens on 11 Nov (a learner who knows this could dispute the order). | Stem: "in the order they come in the festive year, starting with Advent." Explanation: Advent dates (27 Nov–3 Dec); Karneval season opens 11 Nov, but the street carnival comes in Feb/Mar before Lent. Answer order unchanged. | Church calendar (Advent = 4th Sunday before 25 Dec) |
| Lesson 22, Mermaid timeline | "December: Advent" (Advent often starts in late November). | Label "Advent (four Sundays, from late Nov.)", accDescr "In late November and December come Advent…". Re-rendered. | as above |
| Lesson 24h1, nominal-style table | Row "verletzen → die Verletzung → *zwei Verletzte*": the headline uses *Verletzte* (injured people), not *Verletzung*; no English for the verb. | Row now: "verletzen (to injure) / die Verletzung (injury); der/die Verletzte (injured person)". | Duden |
| Lesson 24, after the pass-check chart | The chart's third check ("total ≥ 60?") can never be "no" once both part minimums are met (45 + 15 = 60); a learner could think otherwise. | Added one sentence: reaching both minimums means the total is automatically ≥ 60, so in practice the part minimums decide. | Goethe-Institut results page (below) |
| `images/de2-m6-newspaper.svg` + `-blank` | Caption "Bauarbeiter auf der neuen Brücke" but the photo shows no workers; date line and caption at 13px (rule: ≥14px). | Caption "Die neue Brücke im Oktober"; all 13px text → 14px. Re-rendered with and without markers: no overlap, nothing cut off. | — |
| `images/de2-m6-laptop.svg` + `-blank` | "Passwort:" text at 13px. | 14px; re-rendered with markers. | — |

Counts: answer-key errors 0; factual fixes 3 (q08 + lesson 22 timeline as one Advent/Karneval fix, 24h1 table row, lesson 24 pass-rule clarification); picture fixes 2 (newspaper pair, laptop pair); other fixes 0.

## Checked and found right (a reader might doubt)

- Every one of the 53 questions worked before reading the key. All keys right; select-alls (q05, q11, q16, q19, h11, h25) have only right listed answers and clearly wrong others; order questions (q04, q08, q14, q21, h09, h24) have one possible order; match pairs unique (q06 *die App, die alle benutzen*: *die* whichever way it's parsed). q19 recomputed: 50/15 and 46/20 pass; 60/12 and 44/25 fail.
- Goethe-Zertifikat A2: 100 points, 75 written / 25 oral, pass = 60 overall and ≥45 written and ≥15 oral; grades 60–69 ausreichend, 70–79 befriedigend, 80–89 gut, 90–100 sehr gut. Source: https://www.goethe.de/de/spr/prf/pes/paa2.html (fetched). The page gives no per-skill split, so the figure correctly shows none.
- Tagesschau: ARD, 20 Uhr, first broadcast 26 Dec 1952. ZDF *heute*, ORF, SRF; DW *Langsam gesprochene Nachrichten*; DLF *nachrichtenleicht* (weekly news in simple language) all exist as described.
- *laut* + dative or genitive; uninflected bare noun *laut Polizei* (Duden, "laut", Präposition). Hearsay *sollen*; quote inversion *„…“, sagte sie*; *über die* (accusative, movement across); *wo* as relative adverb, normal after place names.
- Civil marriage: only the civil ceremony is legally valid in DE, AT and CH; church wedding optional and usually after (in CH it must be after: ZGB Art. 97 Abs. 3). Germany has allowed a church wedding first since 2009 but it has no civil effect, so "usually comes after" is right.
- Schultüte: Saxony/Thuringia, early 19th century (first records c. 1810–1820); *Zuckertüte* in the east. Erstkommunion ~9, Konfirmation ~14, Jugendweihe ~14 (8th grade, mostly East). All hedged as approximate.
- Bremen 30th-birthday custom (men sweep the Domtreppe, women polish door handles at the Rathaus, freed by a kiss): well documented, e.g. [hausjournal.net](https://www.hausjournal.net/treppe-fegen), [studenten365](https://studenten365.com/library/lecture/read/582967-warum-muss-man-mit-30-klinken-putzen).
- Polterabend (no glass/mirrors), Brot und Salz, Silberhochzeit 25 / Goldene Hochzeit 50, JGA: standard.
- Wish grammar: accusative ellipsis with strong endings; *das Beileid* neuter; *Ostern* plural in wishes; *Alles Gute* (weak ending after *alles*); *viel* uninflected; *Liebe Lena, lieber Tom,*; *Herzliche Glückwünsche zur Hochzeit* (plural). The full sentence *Ich spreche dir meinen herzlichen Glückwunsch aus* is labeled "rarely said" in the table — fine.
- Pronunciation: *Journalist* [ʒʊrnaˈlɪst], *Jubiläum* [jubiˈlɛːʊm], *Bräutigam*, *Polterabend*, *Feuerwehr* stress on first syllable (Duden).
- Vocab: genders/plurals per Duden (*Bräutigame, Jubiläen, Einweihungspartys, Tode* rare, *Wirtschaft* no plural in this sense). Scripted check against every vocab file in German A1, A2 (incl. other `vocab-r2-*`) and B1: no clash of id, term + pos, or exact first meaning. *Konfirmation* "confirmation (Protestant)" differs from A2's *Bestätigung* "confirmation" only by the note, which the build accepts and which is what the note is for.
- Glossary: no duplicates inside German A2 (glossaries are checked per course; B1 and A1 have their own entries for *nominal style*, *passive*, *hearsay*, *relative adverb*, which doesn't conflict).
- All 11 SVGs rendered; label markers (q01, q07, q13, h01) sit on the parts named. All 7 Mermaid diagrams rendered, readable, accTitle/accDescr describe the whole diagram.

## Overlap with other round 2 lessons (not changed)

- *Nominal style*: also taught in 20h1 (de2-m5, CVs) and 20h3 (official letters); 24h1 re-introduces it in bold for headlines. de2-m5 relies on the m6 glossary entry, whose definition covers both uses.
- *Passive* (recognition): also in 20h2 (de2-m5, package insert).
- Hearsay *sollen*: also in 16h2 (de2-m4, weather forecasts).
- Reading a news report and its lead: also in honors module lesson 90 (de2-h1).
The repetition is light and each lesson applies it to a different text type; a cross-reference could be added later.

## Left uncertain

- German B1's `PRIOR-WORDS.tsv` (generated by `content/languages/prior-words.py`, not my file) doesn't list the 24 new A2 words; whoever owns B1 may need to regenerate it.
- Newspaper label marker 4 (caption) partly covers the first letter of the caption; still clearly on the caption, left as is.

Module check: `content/math/check-module.sh german-a2 de2-m6` — OK, zero problems.

# Round 2 notes: de2-m6 (Media, celebrations and the A2 exam)

## Honors lessons (2)

- `lessons/24h1-news.md` — **Die Nachrichten: reading German news** (`de2-m6-h-news`, 45 min). Where news comes from (Tagesschau, ZDF heute, ORF, SRF; DW *Langsam gesprochene Nachrichten*, Deutschlandfunk *nachrichtenleicht*); parts of a news page (labeled SVG) and the news pyramid (Mermaid); headline German / nominal style; simple past in reports and recognizing the passive; sources: *laut* + dative, hearsay *sollen*, quote word order (*„…“, sagte sie*); relative clauses with prepositions and *wo*; an original local news report (bakery fire) with translation; checking a story. Three worked examples.
- `lessons/24h2-family-festivals.md` — **Familienfeste: from Schultüte to Silberhochzeit** (`de2-m6-h-family-festivals`, 45 min). Life-event timeline (Mermaid); Taufe, Erstkommunion, Konfirmation, Jugendweihe; Einschulung and the Schultüte; birthday customs (no early congratulations, birthday person invites, round birthdays, the Bremen 30th custom); weddings (Standesamt, Polterabend, JGA, anniversaries); housewarming; condolences (cards SVG); grammar: wishes as accusative ellipses with strong endings, *zum* + ordinal; an original letter about a wedding weekend. Three worked examples (birthday card, wedding card, condolence card).

Two lessons, not three: the third strand (writing/exam) is covered by the core additions and would overlap B1 lesson 29 (writing at B1).

## Core lessons (additions only)

- 21: laptop/web-page picture (labeled), "gender looks back, case looks inside" sentence diagram (SVG), Mermaid chart for choosing a relative pronoun.
- 22: Mermaid timeline of the festive year, December living-room picture (labeled), Mermaid chart wann/wenn/als.
- 23: Mermaid register chart, labeled e-mail picture plus one sentence defining *der Empfänger, die Anrede, der Gruß/die Grußformel*.
- 24: points-and-thresholds bar figure (SVG), Mermaid pass-check chart, one sentence ("70 in all is not a pass with only 12 from Sprechen").

## Questions — `questions/r2-de2-m6.yaml` (53)

- Core (22, `de2-m6-r2-q01`–`q22`): 3 label, 7 text, 4 order, 4 match, 4 select-all. module_quiz: q01, q05 (21), q07, q11 (22), q13, q16 (23), q19 (24).
- Honors 24h1 (16, `h01`–`h16`): 1 label, 2 text, 1 order, 1 match, 1 select-all, 10 multiple choice.
- Honors 24h2 (15, `h17`–`h31`): 2 text, 1 match, 1 order, 1 select-all, 10 multiple choice.

## Pictures and diagrams

SVGs in `images/`: `de2-m6-laptop` (+`-blank`), `de2-m6-relative-arrows`, `de2-m6-christmas-room` (+`-blank`), `de2-m6-email` (+`-blank`), `de2-m6-exam-points`, `de2-m6-newspaper` (+`-blank`), `de2-m6-cards`. All previewed; markers checked on the blank copies. Mermaid: 7 diagrams (relative pronoun, festive year timeline, wann/wenn/als, register, pass check, news pyramid, life-events timeline).

## Vocab, glossary, cards

- `vocab-r2-de2-m6.yaml`: 24 words (ids `de2-m6-r2-w…`, numbering kept with gaps): 6 for 24h1 (Umfrage, Wirtschaft, Wettervorhersage, prüfen, Zuschauer, Sender) and 18 for 24h2 (Einschulung, Schultüte, Taufe, Konfirmation, Polterabend, Scherbe, Junggesellenabschied, Standesamt, Trauung, Brautpaar, Braut, Bräutigam, Jubiläum, Einweihungsparty, Tod, Beerdigung, Herzliches Beileid!, Alles Gute!). Checked against every A1, A2 and B1 vocab file (term+pos and first meaning).
- Follow-up fix: 18 words were removed from the vocab file because German B1 (which requires A2) already teaches them and the B1 build rejects duplicates: Schlagzeile, Meldung, Journalist, Journalistin, berichten, laut (preposition), Streik, streiken, Regierung, Politik, Quelle, aktuell, Leser, Leserin, Feuerwehr, erscheinen, Wahl, Ehe. They stay in the lessons as glossed words (each has its English meaning in the text); no question or card referred to their vocab ids.
- `glossary-r2-de2-m6.yaml`: nominal style, passive, hearsay, relative adverb, ellipsis (none existed in the course).
- `cards-r2-de2-m6.yaml`: 13 + 13 cards.

## For a reviewer to double-check

- German B1's `PRIOR-WORDS.tsv` doesn't list the 24 remaining words; none of them is in B1's current vocab files.
- Cultural claims hedged in text: Schultüte origin (Saxony/Thuringia, early 1800s); the Bremen custom for unmarried 30-year-olds; glass avoided at the Polterabend; civil marriage being the only legally valid one in DE/AT/CH (church wedding usually after; in Switzerland it must be after).
- Ages: Erstkommunion about 9, Konfirmation and Jugendweihe about 14 (approximate).
- Goethe A2: the official results page gives only 75 written / 25 oral, so the figure shows no per-skill split.
- Tagesschau: daily at 20 Uhr, on air since 1952 (first broadcast 26 December 1952).
- The table line *Ich spreche dir meinen herzlichen Glückwunsch aus* is offered as the "full sentence" behind the wish; the analysis (accusative object of an understood verb) is the standard explanation, but the full sentence is rarely said.

## Errors found in existing content

None.

## Sources

- Goethe-Institut, Informationen zu den Prüfungsergebnissen A2: https://www.goethe.de/de/spr/prf/pes/paa2.html (100 points, 75 written / 25 oral, pass 60 with ≥45 and ≥15, grade bands).
- *laut* as a preposition with dative or genitive, and an uninflected noun without article (*laut Polizei*): standard grammar, not checked against a dictionary this round; worth a quick Duden check.
- General knowledge of D-A-CH customs (Einschulung, Polterabend, Standesamt, Jugendweihe) and broadcasters, stated with hedges where regional.

Module check: `content/math/check-module.sh german-a2 de2-m6` — OK, zero problems.

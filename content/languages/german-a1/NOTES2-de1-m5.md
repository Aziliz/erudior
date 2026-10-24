# Round 2 notes: de1-m5 (Town, travel and home)

## Honors lessons (2)

- `lessons/20h1-unterwegs.md`, `de1-m5-h-unterwegs`: **Unterwegs: departure boards, tickets and
  announcements** (40 min). Train types (ICE, IC/EC, RE, RB, S, U), reading a departure board
  (Zeit, Zug, Richtung, Gleis, Hinweis; +10, heute Gleis 8, fällt aus), local tickets
  (Fahrkartenautomat, Einzelfahrkarte, Tageskarte, Deutschlandticket, entwerten, inspections and the
  60 € extra fare), Swiss/Austrian words (Billett, Perron, Tram, Bim), station signs, the nominal
  style (Abfahrt, Ankunft, Ausstieg, Einstieg, Eingang, Halt; -fahrt feminine, -stieg/-gang
  masculine), a decoded train announcement, and an original text "Mein erster Tag in Hamburg".
  3 worked examples.
- `lessons/20h2-wohnungssuche.md`, `de1-m5-h-wohnungssuche`: **Eine Wohnung suchen: flat ads, rent
  and long words** (40 min). Reading a flat ad and its abbreviations (Zi., Whg., ZKB, EG/OG/DG, m²,
  EBK, KM, NK, WM, inkl., zzgl., möbl.), Kaltmiete + Nebenkosten = Warmmiete, Kaution limit, rent per
  m², floors from Keller to Dachgeschoss, reading compound nouns in ads from the end, questions to
  ask about a flat (Wie hoch ist/sind …?), and a phone dialogue asking for a viewing. 3 worked
  examples.

I wrote 2, not 3: the obvious third topics were already taken. Two-way prepositions with movement
(Wohin?) is in A2 lesson 13 and in honors lesson 91; dative verbs are A2 lesson 7; health and
emergencies are A2 lesson 20. While I was writing, the de1-h1 writer's honors lessons appeared:
91-zusammen-wohnen covers the Hausordnung, quiet hours, infinitive commands and rubbish, and
90-ankommen covers compound nouns and linking elements. So I cut the Hausordnung from my housing
lesson, shrank my compound-noun section to a short "read from the end" note with no new terms (it
bolds only the existing **compound noun** and **linking s** terms), and replaced it with a
"Questions to ask about a flat" section. I don't bold "infinitive command"; the de1-h1 writer is
defining it.

## Core lessons (additions only)

- 17: town-centre picture (`de1-m5-town.svg`) after the places table; Mermaid chart "How to build
  the du imperative".
- 18: station-scene picture (`de1-m5-station.svg`) after the transport table; Mermaid decision chart
  "nach, zu or in for to".
- 19: flat floor plan (`de1-m5-flat.svg`; one sentence glosses *der Flur*); eight-panel prepositions
  picture (`de1-m5-prepositions.svg`), plus a sentence glossing *der Karton*/*der Ball*.
- 20: labeled body picture (`de1-m5-body.svg`); Mermaid chart "Choosing ich, mich or mir".

## Questions (`questions/r2-de1-m5.yaml`, 50)

- Core, 21 (`de1-m5-r2-q01`–`q21`): 4 text, 3 order, 4 match, 4 select-all, 5 label, 1 multiple
  choice. Lesson 17: 5, lesson 18: 6, lesson 19: 5, lesson 20: 5. Each lesson has 1–2
  `module_quiz: true`.
- Honors 20h1, 15 (`h01`–`h15`): 9 multiple choice (4 read the departure board image), 2 text,
  2 match, 1 select-all, 1 order.
- Honors 20h2, 14 (`h16`–`h29`): 8 multiple choice, 2 text, 1 match, 1 label (building floors),
  1 select-all, 1 order.

## Pictures and diagrams

- SVGs (all original, with blank copies for label questions): `de1-m5-town(-blank)`,
  `de1-m5-station(-blank)`, `de1-m5-flat(-blank)`, `de1-m5-prepositions(-blank)`,
  `de1-m5-body(-blank)`, `de1-m5-h-building(-blank)`, `de1-m5-h-departures` (no blank copy; used
  in multiple-choice questions). Label colours follow the de1-m2 convention: blue for der, pink for
  die, green for das. I previewed all of them, and every marker sits on its part (the prepositions
  question numbers the panels in their corners).
- Mermaid: 3 in core lessons, and 2 in the honors lessons (the trip by local train; how the monthly
  rent is made up). I previewed all of them.

## Vocabulary, glossary, cards

- `vocab-r2-de1-m5.yaml`: 22 words (`de1-m5-r2-w01`–`w22`). 20h1: der Hauptbahnhof, die Richtung,
  der Fahrkartenautomat, entwerten, der Eingang, der Ausgang, der Notausgang, die Linie, die
  Tageskarte, Vorsicht!. 20h2: der Quadratmeter, die Kaltmiete, die Warmmiete, das Dachgeschoss,
  das Obergeschoss, der Flur, die Einbauküche, möbliert, die Besichtigung, ab sofort, niedrig, die
  Abkürzung. I checked them against all of A1, A2 and B1 (term, first meaning and id), because A2
  and B1 carry the A1 words.
- **Reviewer note:** many words the honors lessons only gloss are already vocab items in A2 or B1:
  die Kaution, die Nebenkosten, der Keller, das Erdgeschoss, der Herd, die Anzeige, ausfallen,
  gültig, das Haustier, die Lage, der Bahnsteig. Adding them to A1 would break the A2/B1 builds
  with duplicates, so they stay glosses. If you want them in A1, move them from A2/B1 rather than
  copying them.
- `glossary-r2-de1-m5.yaml`: 1 term, **nominal style** (alias Nominalstil). I checked it against
  every A1 glossary file.
- `cards-r2-de1-m5.yaml`: 25 cards (13 for 20h1, 12 for 20h2).

## Facts to double-check

- Fare dodging: the extra fare is "usually 60 euros in Germany". By regulation it is up to 60 €, or
  double the fare if that is higher (Correctiv fact check, 24 Sep 2026).
- Deutschlandticket: introduced in 2023; valid on buses, trams, U-, S-, RE and RB, not on ICE, IC
  or EC. I left out the price on purpose (63 €/month in 2026, rising in 2027 per test.de). A few IC
  routes are exceptions where it is valid; the lesson doesn't mention them.
- Kaution: at most three months' Kaltmiete, payable in three parts (§ 551 BGB, Germany only; the
  lesson says rules differ in Austria and Switzerland).
- Swiss words: das Billett, der Perron, das Tram. Vienna: die Bim. "Many rental flats come without a
  kitchen" is phrased as "many", not "most".
- The departure board, the ad, Hamburg text details and train numbers are invented and labeled as
  such.

## Errors found in existing content

None. I edited no existing question, card, vocab or glossary entry.

## Check

`content/math/check-module.sh german-a1 m5`: build OK, checker OK (6 lessons, 99 questions,
25 cards, 148 words).

## Sources

- Correctiv fact check on the 60 € extra fare:
  https://correctiv.org/faktencheck/2026/09/24/schwarzfahren-angebliche-erhoehung-auf-220-euro-ist-erfunden/
- Stiftung Warentest on the Deutschlandticket: https://www.test.de/Deutschlandticket-Das-muessen-Sie-wissen-5944873-0/
- § 551 BGB (Begrenzung und Anlage von Mietsicherheiten); Duden for genders and plurals (Perron,
  Billett, Notausgang, Dachgeschoss/Dachgeschoß).

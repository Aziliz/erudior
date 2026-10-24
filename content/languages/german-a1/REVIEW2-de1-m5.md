# Round 2 review: de1-m5 (Town, travel and home)

Reviewed: honors lessons 20h1-unterwegs and 20h2-wohnungssuche, the round 2 additions to core
lessons 17–20 (5 pictures, 3 Mermaid charts), `questions/r2-de1-m5.yaml` (50 questions),
`vocab-r2-de1-m5.yaml` (22 words), `glossary-r2-de1-m5.yaml` (1 term), `cards-r2-de1-m5.yaml`
(25 cards), and all 13 `images/de1-m5-*` files.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| 20h1, Pronunciation, *Ankunft* | Said the *n* before *k* sounds like *ng*. *Ankunft* is *an* + *kunft*; the standard pronunciation is [ˈankʊnft], and [ŋ] is only fast-speech assimilation across the prefix boundary. | Says the *n* stays a plain *n* in careful speech and often slides towards *ng* in fast speech. | Duden pronunciation for *Ankunft*; Wiktionary IPA [ˈanˌkʊnft] |
| 20h1, "Signs in the station" | Said *Eingang*/*Ausgang* come from *eingehen*/*ausgehen*. That is true historically, but today *eingehen* means to shrink, die off or arrive (mail), and *ausgehen* usually means to go out in the evening, so a learner could take *eingehen* to mean "go in". | Added a sentence: the verbs now mostly mean other things (e.g. *ausgehen*, to go out in the evening), but the nouns keep the old sense. | Duden, *eingehen*, *ausgehen* |
| 20h2, "Questions to ask about a flat" | Said to ask *Wie hoch …?*, "not *Wie viel …?*". That is too strong: *Wie viel kostet die Wohnung?* is correct. | *Wie hoch* is now "the usual question", and *Wie viel kostet die Wohnung?* is listed as fine too. | Standard usage (Duden, *hoch*: "Wie hoch ist die Miete?") |
| 18, alt text of the station picture | Said the Fahrplan stands "on a post". The picture shows a board below the platform with no post. | Alt text now describes what is drawn. | — (picture) |
| q19 (order) | *Ich habe seit gestern Fieber* is just as correct as *Seit gestern habe ich Fieber*. Only the capital S on "Seit gestern" ruled it out. | Stem now says "starting with the time phrase". | — |
| h03 (text) | The accept list had '8.22 Uhr' but not '08.22 Uhr'. | Added '08.22 Uhr'. | — |
| vocab w11 *der Quadratmeter* | Duden gives "der, auch: das Quadratmeter". *das Quadratmeter* was not accepted. | Added `alt: [das Quadratmeter]` and a note. | Duden, *Quadratmeter* |

## Checked and found right (things a reader might doubt)

- Every question worked before reading its key. All 50 keys are right, every select-all is right,
  and every distractor explanation names a real mistake. Arithmetic: 590+160=750; 3×640=1920
  (warm 3×830=2490); 690/60=11.50 (690/50=13.80); 820+210=1030; 3×820=2460; 820/78=10.51.
- Order questions q02, q08, h13, h25 each have one correct order. The capitalized first chunk
  fixes the order in the German word-order questions.
- Imperatives: *Lies!*, *Nimm!*, *Fahr!* (a→ä verbs lose the umlaut), *Warte!*, *Sei!*, *Seid!*;
  *Biegen Sie … ab!*.
- Dative-only prepositions (aus, bei, mit, nach, seit, von, zu); *in die Schweiz*; *über dem
  Tisch* for location; *mitm* is non-standard, as the explanation says.
- Deutschlandticket: introduced 1 May 2023, monthly subscription, local and regional transport
  only, not ICE/IC/EC (a few special IC routes are exceptions, which the lesson leaves out on
  purpose). The price is left out on purpose.
- Extra fare (erhöhtes Beförderungsentgelt): up to 60 €, or double the fare if that is higher.
  The lesson's "usually 60 euros" is accurate. Source: the writer's Correctiv citation; it matches
  the EVO/VO-ABB rule in force since 2015.
- Kaution: at most three months' rent without the operating-cost advances (i.e. Kaltmiete),
  payable in three monthly instalments (§ 551 BGB). Nebenkosten are paid as advance payments
  with a yearly statement (§ 556 BGB).
- Swiss *das Billett*, *der Perron*, *das Tram*; Viennese *die Bim*; Austrian *Geschoß* spelling.
- 2. OG = British second floor, American third floor. *Hbf* = Hauptbahnhof. *ICE* is spoken
  letter by letter.
- Vocab: genders and plurals right (Hauptbahnhöfe, Fahrkartenautomaten, Eingänge, Notausgänge,
  Flure, Dachgeschosse, Obergeschosse). A script compared all 22 words with every vocab file in
  A1, A2 and B1, including other writers' `vocab-r2-*` files, by id, term + pos and exact first
  meaning: no duplicates. *die Linie*'s "line (bus, tram or train route)" differs from A2's
  "line (of text)". The build compares full strings, parentheses included.
- Back-references are right: lesson 18 (*Eine Fahrkarte nach Salzburg*, change in München) and
  lesson 19 (Okafor, third floor, 930 Euro warm).
- Pictures: rendered all 7 SVGs and the 6 blank copies with their markers. Every marker sits on
  the part its label names. Text is readable, and nothing overlaps or is cut off. The prepositions
  question numbers the panels in their corners, as the stem says.
- Mermaid: rendered all 5 charts. Content and accTitle/accDescr are right, and all are readable.
- `content/math/check-module.sh german-a1 m5`: OK, zero problems.

## Uncertain / notes

- Prepositions picture, *hinter* panel: the ball is drawn larger than in the others and half
  hidden by the top of the box. It reads as "behind", but some learners may take it for "on". I
  left it unchanged.
- Town picture: the H stop sign stands on the corner of the park rather than clearly on the
  pavement. This is cosmetic.
- Hamburg text: "U-Bahn Richtung Innenstadt" on a display is an invented destination, although
  the lesson teaches that *Richtung* names the last stop. It is harmless in an invented text, so I
  left it.
- Overlap: no overlap within A1 beyond what the writer already handled (90-ankommen covers
  compounds, 91-zusammen-wohnen covers the Hausordnung). Across courses, A2 honors lesson
  `92-hoeren` (de2-h1) has a very similar invented departure board (RE 7 Köln Hbf, S to
  Flughafen, RB to Bonn "fällt aus", a platform change). It works as a listening follow-up, but
  the boards are near-twins. A2 `24h1-news` also teaches the nominal style, for headlines.
  Glossaries are built per course, so no build clash.

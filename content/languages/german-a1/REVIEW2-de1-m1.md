# Round 2 review: module de1-m1 (First steps)

Reviewed independently: 3 honors lessons (04h1, 04h2, 04h3), additions to core lessons 01–04,
`questions/r2-de1-m1.yaml` (62 questions), `vocab-r2-de1-m1.yaml` (30 words),
`glossary-r2-de1-m1.yaml` (16 terms), `cards-r2-de1-m1.yaml` (35 cards), 13 SVGs, 6 Mermaid
diagrams. No drills (language course) and no plot/shape/numberline blocks.
`content/math/check-module.sh german-a1 de1-m1`: zero problems after the fixes.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| de1-m1-r2-h07 (explanation) | Said *mus* "would suggest a z sound"; a final s in German is voiceless (final devoicing), never z. | Now: *mus* would suggest a long u, as in *das Mus*; *mußs* is not a word. | Duden: Mus [muːs] |
| de1-m1-r2-h10 (accept) | Missing the other common German term. | Added *Glottisschlag* (the glossary already lists it as an alias). | Duden: Glottisschlag |
| de1-m1-r2-q11 (label markers + alt) | Markers sat on the words, covering "Lisa", "Krämer", "Lindenstraße", "04107", "Leipzig", so the learner couldn't read the address being labelled. | Markers moved beside the words: before the first part and after the last part of each line (1 before Lisa, 2 after Krämer, and so on); alt text updated. Re-rendered and checked. | preview-figure render |
| 04h3, School grades | "In the last two years of a German Gymnasium, grades are given as points from 0 to 15". The points system covers the *gymnasiale Oberstufe*, which in many states (G9) is three years, including the introductory phase. | "In the upper school years of a German Gymnasium, the Oberstufe, grades are given as points…". | KMK agreement on the gymnasiale Oberstufe (Vereinbarung zur Gestaltung der gymnasialen Oberstufe) |
| 04h2, Standard German and dialects; glossary "dialect" | Low German was presented as simply a dialect of German. Its status is contested: it is recognised as a regional language under the European Charter for Regional or Minority Languages, and many linguists treat it as a separate language. | Added "(Low German is so different that many linguists count it as a language of its own)" to the lesson and a matching note in the glossary entry. | European Charter for Regional or Minority Languages (Germany's ratification lists Niederdeutsch as a regional language) |

Counts: answer-key errors 0; factual fixes 3 (h07 explanation, Oberstufe points, Low German
status); picture fixes 1 (q11 markers); other fixes 1 (h10 accept list).

## Checked and found right (things a reader might doubt)

- Every question worked before reading the key; all 62 keys correct, every select-all has
  exactly the right set, every order question has one order (q08, q15, q17, h13, h27, h40), and
  match/label pairings are unambiguous.
- q02 accepts only ß for Stra___e: right, because the stem asks for the spelling of Germany and the
  question tests exactly the ß/ss choice.
- Minimal pairs (h12): bitte/bitter ([ə]/[ɐ]), Wein/Wien, schon/schön each differ in one sound.
- v as English v in Klavier, Universität, November; f in Vater, vier (Duden pronunciations).
- verreisen [fɛɐ̯ˈʁaɪ̯zn̩] vs vereisen [fɛɐ̯ˈʔaɪ̯zn̩]: without the glottal stop the two would merge,
  so "only the glottal stop tells them apart" is fair. Spiegelei and Mittagessen are stressed on
  the first part, with a glottal stop before -ei / -essen.
- Regional -ig as [ɪk] counts as standard in the south, Austria and Switzerland; China with [k] in
  the south/AT/CH and "Schina" colloquially in central/northern Germany.
- Spelling reform: agreed 1996, compulsory in schools from 1 August 1998, revised 2004 and 2006;
  capital ẞ allowed since the Rat für deutsche Rechtschreibung's 2017 update, with SS still the
  usual choice in practice. Switzerland writes ss.
- Official status: German is the sole official language of Liechtenstein; one of three in
  Luxembourg (with Luxembourgish and French) and Belgium (with Dutch and French); one of four
  national languages in Switzerland; co-official in South Tyrol. The German-speaking Community of
  Belgium has about 79,000–80,000 inhabitants. German is the most widely spoken first language in
  the EU (Special Eurobarometer 386, 2012; still true after Brexit).
- "Hochdeutsch" = high in the geographic sense; DACH = car codes D, A, CH (Confoederatio Helvetica).
- Grade scales: Germany 1–6 (names sehr gut … ungenügend, 4 lowest pass), Austria 1–5 (Sehr gut …
  Nicht genügend, 4 Genügend lowest pass), Switzerland 6 best, 4 pass, half grades common.
- duzen/siezen conjugation (du duzt, du siezt); rechnen/zeichnen/öffnen/regnen e-insertion and
  its absence after l, r and silent h (lernen, wohnen); plus/minus as conjunctions and mal as
  adverb (Duden word classes); number nouns feminine (die Eins, die Einsen).
- Vocab: genders and plurals checked (die Akzente, die Laute, die Spiegeleier, die Zungenbrecher,
  die Muttersprachen, die Finger, die Daumen, die Einsen; Aussprache with no plural in this sense;
  verreisen with sein). No clash with any vocab file in German A1, A2 or B1, including all
  other `vocab-r2-*` files: ids, term + part of speech, first meaning all unique (the first
  meanings that share a head word, such as "hello (northern Germany)", are told apart by their
  notes in brackets).
- Cross-references hold: Mittagessen in Lesson 9, öffnen in Lesson 15, regnen in Lesson 16, decimal
  comma and *Wie viel* in Lesson 10, die Straße in Lesson 17, dative in Lesson 18.
- Arithmetic in 04h3 and its questions (15+27, 81−36, 7·8, 96:4, 8·7, 72:8) all correct.
- All 13 SVGs rendered: text at least 14px, nothing cut off or overlapping. Mouth, greeting-times
  and map label markers sit on the right parts. The map and mouth are schematic and labelled
  as simplified in the lesson or picture.
- All 6 Mermaid diagrams rendered; content right, and accTitle/accDescr describe the whole chart.

## Overlap

- `lessons/24h2-letters.md` (de1-m6) covers regional greetings (Moin, Servus, Grüezi) and the
  duzen/siezen custom again, which 04h2 already teaches. Its notes say it reuses this module's
  vocab rather than adding it again, so there is no clash in the build. The material repeats,
  but 24h2 applies it to letters. I left both as they are (only my own files may be edited).

## Left uncertain

- The mouth diagram places the ach-sound at the soft palate; after *a* it is often further back
  (uvular). The lesson labels the picture as simplified, which is enough at A1.
- "Most Germans" counting from the thumb and "many workplaces use du" are customs. The lessons
  hedge them suitably.
- The origin of *Moin* is presented as debated, which is accurate.

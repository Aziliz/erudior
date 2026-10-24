# Round 2 review: de2-h1, "Honors: Lesen und Hören (reading and listening)"

Reviewer for item 161. Reviewed lessons 90–93, `questions/r2-de2-h1.yaml` (56), `vocab-r2-de2-h1.yaml` (45),
`glossary-r2-de2-h1.yaml` (20), `cards-r2-de2-h1.yaml` (43), the 7 `images/de2-h1-*` SVGs (rendered, label
markers checked) and the 4 Mermaid diagrams (rendered). `content/math/check-module.sh german-a2 h1`: OK, zero
problems after the fixes.

## Changes

### Answer key / questions
- **de2-h1-r2-h12** (order): two steps were swappable. Lesson 90's chart starts with "Skim", while the item put
  "Read the question first" before skimming (lesson 24's exam tip). A learner following lesson 90 could fairly
  order them the other way. Stem now says that, as in lesson 24's exam tip, you start with the question, so
  only one order is correct. (Lesson 90 also gets a sentence; see below.)
- **de2-h1-r2-h55** explanation: "1815 is when it was first printed" was wrong. Now: Goethe published it in his
  collected works in 1815, and an unauthorised printing had appeared in 1800. The answer key was already correct.

### Factual fixes
- **92-hoeren, Common mistakes**: "writing 46 for *sechsundvierzig*". 46 is the right answer, so the line
  said the reverse of what it meant. Changed to "writing 64 for *sechsundvierzig*".
- **93-geschichten, poem history**: "It was first printed in 1815" was wrong. It first appeared without
  Goethe's permission in September 1800 (J. Rückert, "Bemerkungen über Weimar", in *Der Genius der Zeit*, ed.
  A. A. von Hennings). Goethe published it himself in 1815 (Werke, vol. 1, Cotta) as "Ein gleiches". Fixed in
  the lesson text, Key points, the card "Goethe's Wandrers Nachtlied" and h55. The variants sentence now says
  "early copies and printings… follows Goethe's 1815 edition". The hut copies have *Vögel*, Kotzebue 1803
  has *Vöglein*, and 1815 has *Vögelein*. Source: de.wikipedia.org/wiki/Wandrers_Nachtlied (which cites
  the Herder/Göchhausen copies and the 1815 edition); en.wikipedia.org/wiki/Wanderer%27s_Nightsong.
- **93-geschichten, word order in the poem** (Example 3 item 1 and Common mistakes): the lesson said "Poems can
  put the verb first without making a question" and "Poems change word order freely". That is misleading.
  *In allen Wipfeln / Spürest du*, *Über allen Gipfeln / Ist Ruh* and *balde / Ruhest du auch* are ordinary
  verb-second statements: the place or time phrase is in first position and the line break only hides it.
  The example now rewrites the full sentence (*In allen Wipfeln spürst du kaum einen Hauch*) and explains
  verb-second order. The mistake bullet now says to read across the line break. The heading now reads
  "Rewrite lines 3–8".
- **93-geschichten, old-forms table**: "*-lein*, an old form of *-chen*" was wrong. These are two separate
  diminutive suffixes. Now: "an older, more literary diminutive ending beside *-chen*".
- **90-lesestrategien, news report tense**: the lesson said reports use the simple past only for what people
  said and "the present or perfect for the news itself". That contradicted the lesson's own text-type table
  ("the past tense") and lesson 24h1 ("Reports are written in the simple past"). Now: past events mostly in
  the simple past, the first sentence often in the perfect, and anything still true in the present.

### Other fixes (tightening)
- **90-lesestrategien**: added one sentence before the chart: in an exam, read the task first (lesson 24), then
  start the chart. This makes the chart consistent with h12 and the card "The efficient order".
- **93-geschichten**: "the narrator uses the simple past" is now "usually uses" (some stories are in the present).
- **91-woerter-erschliessen**: "A verb loses its *-en*" did not fit the lesson's own example *Wartezimmer*
  (*warte-*), which keeps the -e-. Now "drops its infinitive ending, sometimes keeping an *-e-*". The same fix
  is in the card "Verb as modifier". Also "A noun with an umlaut may have lost it in the singular" is now
  "A plural with an umlaut may have none in the singular".

## Checked and found right
- Every question worked before reading the key. Each multiple-choice item has exactly one defensible answer.
  The select-all items h08, h22, h38 and h51 have clean right and wrong splits. Text accept lists are fine
  (40, 60, 48, erst, die Sonnenbrille, der Baum, bald, schweigen). The order items h26, h37 and h46 each have
  one order. The match items have unambiguous pairs and distractors that match nothing.
- Label markers: board (h03), compound (h17), departures (h33) and poem (h49) each sit on the right part. In
  the departures blank, the "Abfahrt" title is removed, but the stem says "departures board", so the
  "Arrival time" distractor is still clearly wrong.
- SVGs: text is 14px or larger, nothing overlaps or is cut off, and every file is under 6 KB. The notice-board
  dates (Tuesday 14 May, Saturday 18 May) and the departures board match the transcripts. The arithmetic is
  right: 14:12 + 15 min = 14:27, and the cancelled 14:31 train means a 60-minute wait.
- Mermaid: all 4 render, are readable and are top-down. accTitle/accDescr describe the whole diagram.
- Poem: the text matches the 1815 edition, and it has 24 words (counted). The rhyme scheme abab cddc is
  correct. The date (probably the evening of 6 September 1780), the Kickelhahn hut near Ilmenau (in
  pencil, on the wooden wall), the title "Ein gleiches" following the earlier "Wandrers Nachtlied", and
  Schubert D 768 all check out. "More than 240 years ago" holds: 2026 − 1780 = 246. The death reading is
  labelled as an interpretation.
- Grimm, *Kinder- und Hausmärchen* vol. 1, 1812. *Die Sterntaler* as described. The simple past and
  infinitive table is correct (hieß, trug, flog, sang, grub, half, rief, fiel, schlief, hielt, zog, schwieg),
  and so is flog/floh.
- Vocab: genders, plurals and notes are right (Aushänge, Überschriften, Zusammenhänge, Gegenteile, Sauberkeit
  without a plural, Stichworte vs Stichwörter, errätst/errät, liest vor, ist zurückgeblieben, hat notiert,
  schwieg/geschwiegen). I scripted a duplicate check against every vocab file in A1, A2 and B1, including the
  other r2 files: no clashes on id, on term + pos, or on exact first meaning. Basic-looking words such as
  der Vogel, der Baum and der Stern really are not in any earlier vocab file. Glossary: no term or alias
  clashes with any other A2 glossary file.
- Regional claims (halt/eben, ne/gell/oder, net) are worded as tendencies. "Zurückbleiben, bitte!" (Berlin),
  *zwo* on the phone, *halb drei* = 2:30, and the train genders (der ICE/RE, die RB/S-Bahn) are correct.
- Cross-references hold: A1 lesson 5 (-ung/-heit gender), lesson 2 (fairy tale, *wurde*), lesson 16
  (*Müll trennen*), lesson 19 (bike workshop message, Mailbox) and lesson 24 (Lesen/Hören tips).

## Overlap (reported only, not changed)
- Lesson 90 "Reading a news report" (headline, lead, W-questions) repeats part of de2-m6's honors lesson
  24h1-news ("The parts of a news page", Vorspann, W-questions, Example 3). Lesson 90 keeps it short and is
  aimed at true/false reading, but the two lessons overlap.
- The false friends in lesson 91 include *eventuell*, which lesson 15 already covers. This counts as review.
  Fairy-tale basics (*Es war einmal*, simple past) build on lesson 2, as the lesson says.

## Uncertain
- *halt* is "more southern", *eben* is "more northern", and *Vögelchen* is "more common" than *Vögelein*.
  These are reasonable tendencies, but I did not verify them against corpus data.

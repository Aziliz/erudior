# Round 2 review: honors module de3-h1 (Literatur, Geschichte und Gesellschaft)

Reviewer's check: `content/math/check-module.sh german-b1 h1` reports zero problems after the fixes
(4 lessons, 56 questions, 44 cards, 51 words).

## Changes

### Answer keys
- de3-h1-r2-h16 (text, rhyme scheme of Mondnacht stanza 1): added `a b a b` to `accept`
  (spaced letters are a reasonable way to type it; `abab` and `a-b-a-b` were already there).

### Factual fixes / tightening
- 92-erinnerung, memorial days table: "International Holocaust Remembrance Day since 2005" →
  "(declared by the United Nations in 2005)". UN resolution 60/7 was adopted on 1 Nov 2005; the
  first observance was 27 Jan 2006, so "since 2005" was slightly off.
- 92-erinnerung, Stolpersteine: "Demnig laid his first stone in Cologne in 1992" → "in front of
  Cologne's city hall in 1992; stones with individual names followed from the mid-1990s". The 1992
  stone carried the opening of Himmler's Auschwitz decree, not a person's name, while the sentence
  just before says each stone carries one person's name. (Stolpersteine project chronology;
  Wikipedia "Stolperstein".)
- 91-gedichte: "The grammar … is everywhere" / "The whole poem is a comparison with something
  unreal" → "frames the poem" / "The poem opens and closes with a comparison to something unreal".
  Stanza 2 is plain indicative description, so the original overstated it.
- 90-kurzgeschichte, Inhaltsangabe rules: added one sentence: German schools often expect
  Konjunktiv I in the reported speech of an Inhaltsangabe (*Er behauptet, sie komme zu spät*), a form
  learners only need to recognize at B1 (lesson 26), and *dass* + indicative is correct German.
  Without this, a learner taking a German school or exam summary could be surprised.

### Other fixes
- 91-gedichte: the poems (Mondnacht, the two Lore-Ley stanzas, the couplet example) were
  blockquotes with an empty `>` line between every line, so each line rendered as its own paragraph
  and the stanzas of Mondnacht couldn't be seen. The lesson's own definition of a stanza ("separated
  … by an empty line") and Example 1 ("Stanza 1 … Stanza 2 … Stanza 3") depend on seeing them. I used
  Markdown hard line breaks (a trailing `\`) within each stanza and an empty `>` line between
  stanzas. I rendered this with the app's own `protectMath` + `marked` (gfm, breaks: false): the
  output is `<br>` inside a stanza and a new `<p>` per stanza.
- vocab-r2-de3-h1: three `exampleEn` lines had lost their apostrophes (`doesnt`, `daughters`,
  `isnt`). Fixed.
- vocab-r2-de3-h1 w47 *sinken*: first meaning "to fall (go down)" → "to sink (go down)" (with "to
  sink", "to fall", … still accepted). The English → German prompt "to fall (go down)" fits *fallen*
  just as well (B1 vocab-m1 `fallen`, first meaning "to fall"; *Die Preise fallen*), so a learner
  who typed *fallen* would have been marked wrong.

## Checked and found right
- Every question worked before reading the key: one defensible answer each; select-all sets
  (h02, h20, h33, h51) all right and the others clearly wrong; order questions (h05, h21, h37, h44)
  have one order only (story sequence checked against the text; agreements 1955/1961/1963/1968);
  match pairs unambiguous; text accepts complete (besucht; faltet/zusammen; wurde; floh; dass; 4; 20).
- Numbers recomputed: 12→15→20→24 gives +3, +5, +4 points (biggest 2008–2016), 12→24 = +100 %
  (doubling); 20→24 = +4 points = +20 %; 10→12 = +2 points = +20 %. Chart bar heights in
  de3-h1-chart.svg match 12/15/20/24 on the 0–30 axis.
- Mondnacht text checked line by line against the original (1837; modernised geküsst, Dass, müsst');
  Schumann's setting (Liederkreis op. 39) is from 1840. Rhyme analysis right: Himmel/Blütenschimmer
  and spannte/Lande impure, Felder/Wälder pure (both short [ɛ]); abab cdcd efef.
- Lore-Ley: written 1824, *Buch der Lieder* 1827, Silcher's melody 1837, Brentano's ballad 1801 (in
  *Godwi*); the "Dichter unbekannt" story is correctly presented as unproven. Heine 1797–1856, Paris
  from 1831. 1901 orthography (th → t in *tun*), 1996 (daß → dass): right.
- Borchert 1921–1947, *Das Brot* 1946; Böll Nobel Prize 1972.
- Auschwitz trials 1963–65; Weizsäcker 8 May 1985 ("Tag der Befreiung"); Berlin memorial 2005,
  2,711 stelae; 27 Jan as German day of remembrance since 1996; 9 November 1918/1923/1938/1989;
  Kindertransporte about 10,000 children; Stolperstein 10 × 10 cm, last freely chosen address,
  100,000th in Nuremberg in May 2023; Munich ban and Erinnerungszeichen since 2018 (Knobloch);
  Stasi files open since January 1992; Vranitzky's statement in parliament, July 1991.
- Recruitment agreements: Italy 1955, Spain and Greece 1960, Turkey 1961, Morocco 1963, Portugal
  1964, Tunisia 1965, Yugoslavia 1968; Anwerbestopp November 1973; about 14 million came and 11
  million returned (bpb); Rodrigues de Sá, Köln-Deutz, September 1964, a moped; Frisch 1965.
  Citizenship law 2000 (eight years' legal residence of a parent), Zuwanderungsgesetz 2005, 2024
  reform (five years, dual citizenship generally allowed), three-year route repealed 2025.
  Einwanderungsgeschichte 2024: 21.2 million, 25.6 % (Destatis, Mikrozensus first results).
- Grammar: *gedenken* + genitive (*ihrer*, *der Opfer*), mixed principal parts gedachte/gedacht;
  *erinnern an* vs *sich erinnern an*; *steigen/sinken* with *sein*; *Prozent* uninflected after a
  number; *als hätte* = *als ob … hätte*; Konjunktiv I example. All right.
- German vocab: genders and plurals right (die Literaturen, das Mahnmal / die Mahnmale (also
  Mahnmäler), das Prozent / die Prozente, der Anstieg / die Anstiege, der Rückgang / die Rückgänge).
  Re-ran a duplicate check against every vocab file in German A1, A2 and B1 (all r2 files included):
  no id, term + part of speech or first-meaning clash. Near neighbours are disambiguated (seltsam
  "strange (peculiar)" vs komisch "strange (odd)", still "still (silent, motionless)" vs noch "still
  (continuing)").
- Pictures: all 7 SVGs rendered; text readable, nothing cut off or overlapping; label markers
  (h13, h17, h35, h49) sit on the parts named. Mermaid diagrams (4) render cleanly; accTitle/accDescr
  describe the whole diagram.
- Lesson cross-references (lessons 1, 2, 5, 11, 13, 17, 20, 21, 23, 25h2, 26; A2 honors 93) all
  point to content that exists.
- Overlap: none with the other round 2 B1 lessons (25h2 Kafka/Gutenberg is the nearest; no shared
  texts or topics). The writer's note about A2 93 calling Wandrers Nachtlied's rhymes "in pairs" is
  outside this item.

## Uncertain
- The Stolpersteine chronology (1992 decree stone; first name stones laid in Cologne in 1995 and
  Berlin in 1996) is from memory and the project's commonly cited history; I couldn't open a primary
  page during review, so the lesson now says only "from the mid-1990s".
- Whether Heine's 1827 text spells *Mährchen* (the lesson lists only *Daß* and *gethan* as old
  spellings). This doesn't make the lesson wrong, so I left it.

## Sources
- UN General Assembly resolution 60/7 (1 Nov 2005), International Holocaust Remembrance Day.
- Wikipedia (en/de), "Stolperstein"; stolpersteine.eu chronology.
- Writer's sources in NOTES2-de3-h1.md (bpb, Bundestag, epd/Destatis, Sonntagsblatt, Wikipedia
  Die Lore-Ley), cross-checked against standard references for the dates listed above.

# Round 2 notes: honors module de3-h1 (Literatur, Geschichte und Gesellschaft)

`content/math/check-module.sh german-b1 h1`: build and checker report zero problems
(4 lessons, 56 questions, 44 cards, 109 terms, 51 words).

## Added

**Honors lessons** (module de3-h1, all `module: de3-h1`). They are capstone and cross-cutting, and they don't repeat the core lessons or the other honors lessons (A2 93 Wandrers Nachtlied, B1 25h2 Kafka/Gutenberg).
- `lessons/90-kurzgeschichte.md` (de3-h-kurzgeschichte, "Die Kurzgeschichte: reading a modern short story", 45 min, about 2,200 words): origins in Trümmerliteratur after 1945 (Borchert, Böll), the school checklist of features (labelled as a simplification), an original short story "Der Zettel" (simple past and past perfect, open ending, the illness never named), narrator vs author, first- and third-person narrators, and the rules of the Inhaltsangabe. Examples: finding the features; writing an Inhaltsangabe (from the story's past and direct speech to a present-tense summary with reported speech).
- `lessons/91-gedichte.md` (de3-h-gedichte, "Gedichte: reading poems by Eichendorff and Heine", 45 min, about 2,200 words): words for poems (Vers = line, a false friend), Paarreim, Kreuzreim and umarmender Reim, an original couplet example, Eichendorff's *Mondnacht* (1837, full text, public domain, modern spelling) with its Konjunktiv II comparisons, grammatical gender as a love story (der Himmel / die Erde), elision, old forms and impure rhyme, enjambment that splits *spannte … aus*. Then Heine's *Die Lore-Ley* (1824, first and last stanzas), Brentano's 1801 invention of the legend, and the "Dichter unbekannt" story marked as unverified. Examples: the rhyme scheme of Mondnacht; from poetic word order to everyday German.
- `lessons/92-erinnerung.md` (de3-h-erinnerung, "Erinnerungskultur: how Germany remembers", 45 min, about 1,950 words): Erinnerungskultur, Vergangenheitsbewältigung / Aufarbeitung, a simplified timeline (1950s, Auschwitz trials, 1968, Weizsäcker 1985, the Berlin memorial 2005), memorial days (27 Jan, 8 May, 3 Oct, 9 Nov as Schicksalstag), Stolpersteine (Demnig, 1992, the 100,000th in 2023) and the Munich controversy, an original plaque text, remembering the GDR, and a short note on Austria. Examples: decoding a Stolperstein (telegraphic style, so a participle stands for a passive, and the active Flucht/überlebt); the grammar of a memorial text (passive past with von, past perfect in a relative clause, gedenken + genitive). The Stolperstein names and the plaque are invented for this course, and the lesson says so.
- `lessons/93-einwanderung.md` (de3-h-einwanderung, "Ein Einwanderungsland: migration history and describing statistics", 50 min, about 1,650 words): from emigration to immigration, the refugees and expellees, the recruitment agreements 1955–1968, Rodrigues de Sá in 1964, the Anwerbestopp of 1973, Max Frisch's 1965 sentence, GDR contract workers, migration after 1990, the citizenship laws of 2000, 2005 and 2024 (with the 2025 repeal of the three-year route), Ausländer, Migrationshintergrund and Einwanderungsgeschichte (25.6 % in 2024), and describing a chart (phrases; von … auf vs um). Examples: describing an invented Neustadt chart; per cent vs percentage points (numbers checked: 12/15/20/24 give rises of 3, 5 and 4 points, a doubling overall; 20 → 24 is +4 points and +20 %; 10 → 12 is +2 points and +20 %).

**Pictures** (original SVGs, 2–5 KB each, all rendered and looked at; markers checked with --markers):
de3-h1-tension (+ -blank): the tension curve of a short story vs a fairy tale; de3-h1-rhymes (+ -blank): the three rhyme schemes; de3-h1-stolperstein (+ -blank): a house, the pavement and a magnified invented Stolperstein; de3-h1-chart: a bar chart with invented data (used directly in the label question, since the chart itself carries no part names).

**Diagrams** (4 Mermaid, all with accTitle/accDescr): writing an Inhaltsangabe (90), how to read a poem (91), 9 November as Schicksalstag (92), stages of migration since 1945 (93, 10 boxes, TD).

**Questions** (56, `questions/r2-de3-h1.yaml`, ids de3-h1-r2-h01…h56, 14 per lesson). Each lesson has 8 MC, 2 text, 1 select-all, 1 order, 1 match and 1 label. module_quiz: 5 per lesson (20 in all, about a third). The four-choice MC answer positions are 2/2/2/2 in each lesson.

**Vocabulary** (`vocab-r2-de3-h1.yaml`, 51 words, ids de3-h1-r2-w01…w51). 90: die Kurzgeschichte, die Literatur, die Erzählung, der Erzähler, die Erzählerin, die Spannung, spannend, andeuten, die Szene, die Perspektive, falten, seltsam. 91: die Dichterin, die Strophe, sich reimen, still, auswendig, vortragen, die Sage, die Welle, die Seele, die Blüte, rauschen, die Stimmung. 92: gedenken, die Gedenkstätte, das Mahnmal, der Gedenktag, verfolgen, die Verfolgung, deportieren, ermorden, jüdisch, das Verbrechen, die Aufarbeitung, der Nationalsozialismus. 93: einwandern, der Einwanderer, die Einwanderin, die Migration, die Arbeitskraft, die Einbürgerung, der Anteil, die Grafik, das Prozent, steigen, sinken, der Anstieg, der Rückgang, die Statistik, die Vielfalt. I checked every word against all vocab files in German A1, A2 and B1, including every r2 file and PRIOR-WORDS (id, term + part of speech, and exact first meaning), right before finishing. I dropped das Gedicht, der Dichter, der Reim, die Zeile and schweigen, because the A2 honors lesson de2-h-geschichten owns them. I changed seltsam's first meaning to "strange (peculiar)", because "strange (odd)" belongs to komisch.

**Glossary** (`glossary-r2-de3-h1.yaml`, 25 terms, no clashes with any glossary*.yaml in the course): short story, rubble literature, open ending, turning point, narrator, first-person narrator, third-person narrator, Inhaltsangabe, stanza, line of verse, rhyme scheme, couplet rhyme, alternate rhyme, enclosed rhyme, impure rhyme, elision, enjambment, culture of remembrance, Vergangenheitsbewältigung, Stolperstein, telegraphic style, guest worker, recruitment agreement, naturalisation, percentage point.

**Cards** (`cards-r2-de3-h1.yaml`, 44): 12 + 12 + 10 + 10.

## For a reviewer to double-check
- Lesson 91 originally used Goethe's *Wandrers Nachtlied*. I swapped it for Eichendorff's *Mondnacht*, because German A2's honors lesson 93 already teaches the Goethe poem. Please check the *Mondnacht* text (modernised spelling: geküsst, Dass, müsst') and the claims "published 1837, set by Schumann in 1840".
- Rhyme analysis: Himmel / Blütenschimmer and spannte / Lande are called impure rhymes, and Felder / Wälder a pure one.
- Facts to spot-check: the Weizsäcker speech on 8 May 1985; the Berlin memorial (2005, 2,711 stelae); 27 January as a German day of remembrance since 1996 and an international one since 2005; Vranitzky in 1991; the Munich Erinnerungszeichen since 2018; the Stasi files open since 1992; about 10,000 children on the Kindertransporte; about 12 million refugees and expellees after 1945.
- "One reason often given" for choosing 3 October over 9 November is hedged on purpose.
- 93 says the 2024 reform "generally allowed dual citizenship" and that the 3-year route was abolished in October 2025 (Bundestag vote of 8 Oct 2025). The lesson tells learners to check the current rules.
- The Goethe anecdote was removed along with that poem. The Heine "Dichter unbekannt" story is presented as unverified, in line with current research.

## Errors found in existing content
- Not mine to edit: German A2 `lessons/93-geschichten.md` says the lines of Wandrers Nachtlied "rhyme in pairs" (Gipfeln/Wipfeln, Ruh/du …). The rhyme words do come in pairs, but the scheme is abab cddc, not couplet rhyme, so a learner could read it as aabb. I didn't change it.

## Sources
- bpb, "Anwerbeabkommen mit Italien" (dates of all agreements, Anwerbestopp 1973, 14 million came / 11 million returned, Rodrigues de Sá on 10 Sept 1964): https://www.bpb.de/politik/hintergrund-aktuell/324552/anwerbeabkommen-mit-italien
- Planet Wissen, Geschichte der Gastarbeiter: https://www.planet-wissen.de/geschichte/deutsche_geschichte/geschichte_der_gastarbeiter/pwwbgeschichtedergastarbeiter100.html
- Der Freitag, "Alltag: 1965" (Frisch quote, foreword to *Siamo italiani*): https://www.freitag.de/autoren/der-freitag/1965
- Deutscher Bundestag, text archive 2025 KW 41 (abolition of the three-year naturalisation): https://bundestag.de/dokumente/textarchiv/2025/kw41-de-staatsangehoerigkeit-1111756
- epd / evangelisch.de, 22 May 2025 (Mikrozensus 2024: 21.2 million, 25.6 %, definition): https://www.evangelisch.de/inhalte/243585/22-05-2025/jede-vierte-person-deutschland-mit-einwanderungsgeschichte
- Wikipedia, Stolperstein (first stone 1992, size, placement, 100,000th on 26 May 2023 in Nuremberg): https://en.wikipedia.org/wiki/Stolperstein
- Sonntagsblatt/epd, "München feiert fünf Jahre Erinnerungszeichen" (Munich ban reaffirmed in 2015, Erinnerungszeichen since 2018, Knobloch's objection): https://sonntagsblatt.de/artikel/epd/muenchen-feiert-fuenf-jahre-erinnerungszeichen
- Wikipedia (de), Die Lore-Ley (1824, Buch der Lieder 1827, Silcher 1837, Brentano 1801, the "Dichter unbekannt" claim unverified): https://de.wikipedia.org/wiki/Die_Lore-Ley
- Wikipedia (de), Wandrers Nachtlied (checked before the swap).
- Poem texts: Eichendorff, *Mondnacht* (1837) and Heine, *Die Lore-Ley* (1824), both public domain.

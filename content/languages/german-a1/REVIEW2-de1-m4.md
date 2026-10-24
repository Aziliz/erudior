# Round 2 review: de1-m4 (Free time and plans), item 151

Reviewer checked: both honors lessons (16h1 Clubs, quiet hours and favourite things; 16h2 The
German year), the additions to lessons 13–16, all 50 questions in `questions/r2-de1-m4.yaml`,
`glossary-r2-de1-m4.yaml`, `cards-r2-de1-m4.yaml`, `vocab-r2-de1-m4.yaml`, all 13 `images/de1-m4-*`
SVGs (rendered, label markers rendered from the label questions) and all 6 Mermaid diagrams
(rendered). `content/math/check-module.sh german-a1 de1-m4`: OK, zero problems after the fixes.

## Changes

| Where | What was wrong | Change | Source |
|---|---|---|---|
| 16h2, "Customs through the year", Karneval bullet | The German sentence taught "Im Februar tragen viele Leute Kostüme" as the carnival date. Rosenmontag is Easter − 48 days and falls in March in some years (3 Mar 2025, 4 Mar 2030, 8 Mar 2038). It also listed Mainz under *Karneval* and said "the south" uses *Fasching*. Mainz and the Swabian-Alemannic south-west say *Fastnacht*. | Changed to "Im Februar oder März …". Added that the date depends on Easter (usually February, some years early March). Regional words now read: Karneval in Cologne/Düsseldorf; Fasching in Bavaria and Austria; Fastnacht in Mainz and the south-west. | dateutil easter computation; Duden "Fastnacht", "Fasching"; A2 vocab-m6 `karneval` note already says the same |
| 16h2, Pronunciation | *Fasching* was given as "FAH-shing", which suggests a long a. The a is short. | "FASH-ing", with a short a | Duden pronunciation [ˈfaʃɪŋ] |
| 16h1, Favourites | Quote „Lola rennt" closed with a straight " | „Lola rennt“ (matches question h06) | typography |
| cards-r2-de1-m4, "Karneval or Fasching?" | Same regional error (Mainz under Karneval, Fasching "in the south"); no date | Rewritten with the three regional words; added "usually February, some years early March" | as above |
| r2-de1-m4-h26 | The correct choice said "Fasching is the usual word in southern Germany". The south-west mostly says Fastnacht/Fasnet. | "… in Bavaria and Austria; Karneval in the Rhineland." Explanation mentions Fastnacht. | as above |
| vocab w14 der Fasching | `plural: —`, but Duden gives die Faschinge / die Faschings. First meaning said "southern German". The example "Im Februar ist Fasching" stated the date as fixed. | plural die Faschinge (note: also Faschings, rarely used); first meaning 'carnival (Bavarian and Austrian word)'; example "Im Februar ist oft Fasching." / "Carnival is often in February."; note adds Fastnacht | Duden "Fasching" |
| vocab w05 die Halle | First meaning was the bare "hall". B1 has der Saal = "hall (large room)" and A1 m5 r2 has der Flur with meaning "hall", so the English prompt "hall" was ambiguous. | First meaning 'hall (large building, e.g. a sports hall)'; "hall" kept as an accepted answer | build rule in AUTHORING (first meaning must point to one German term) |

## Checked and found right (a reader might doubt these)

- **Club figures.** ZiviZ counted 628,992 registered clubs in March 2026 (ZiviZ, "Vereinssterben
  oder neue Gründungsdynamik?", 2026). DOSB counted "rund 86.000 Sportvereine" and "rund 29,3
  Millionen Mitgliedschaften", reference date 1 Jan 2025 (DOSB press release, 11 Nov 2025).
- **Sunday rest.** Art. 140 GG takes over Art. 139 WRV (1919). Shop-opening rules are set by the
  states. The 32. BImSchV § 7 bans motor lawn mowers in residential areas all day on Sundays and
  public holidays.
- **Mittagsruhe.** It is labeled correctly as a house-rule or local matter, not a national law.
  Nachtruhe "usually 22–6" is correct; the de1-h1 lesson 91 says "22 to 6 or 7", which does not
  contradict it.
- **Public holidays.** The nine nationwide holidays are correct. 3 October is set by the
  Unification Treaty, Art. 2(2). Epiphany is a holiday in BY, BW and ST; Reformation Day in BB,
  MV, SN, ST, TH, HB, HH, NI and SH. Bavaria has 12–14 holidays (13 in most places, 12 where
  Mariä Himmelfahrt doesn't apply, 14 in Augsburg with the Friedensfest). Austria's national day
  is 26 Oct; Switzerland's is 1 Aug.
- **Easter dates.** Easter falls between 22 March and 25 April (checked for 1583–3999). In 2027
  Easter is 28 March, Good Friday 26 March, Easter Monday 29 March, Ascension 6 May (a Thursday,
  Easter + 39) and Whit Monday 17 May (Easter + 50). All recomputed with dateutil.
- **Ordinal endings.** der + -e; am/vom/zum/den + -en. The letter date "Hamburg, den 6. Dezember"
  uses the accusative *den*, and leaving it out is also correct (DIN 5008 style). The rule
  "-ste from 20 up" is right.
- **Pronunciation notes.** Chor [k], Lieblings- with final devoicing b → p, Silvester [z…v…],
  Feiertag final g → k, -ig before st said as [ɪç] in the standard: all correct.
- **Customs.** Sankt Martin lanterns on 11 Nov, shoes put out on the evening of 5 Dec,
  Bescherung on the evening of the 24th, the birthday superstition (labeled as a superstition),
  and the carnival season opening at 11:11 on 11 Nov.
- **All 50 questions.** I worked each one before reading the key. Every key is right and every
  order question has exactly one order. Each select-all list is exactly right. Each text
  question's `accept` covers the reasonable answers (fährt/faehrt; single forms elsewhere). The
  MC answer positions are spread out.
- **Pictures.** All 13 SVGs render cleanly, with no overlapping or cut-off text. The markers for
  q06, q11, q15, q20 and h17 sit on the right parts.
- **Mermaid diagrams.** All 6 render, and each `accDescr` describes the whole diagram.
- **Vocab duplicates.** I checked id, term + part of speech and first meaning (raw and with
  parentheses stripped) against every A1, A2 and B1 vocab file, including other writers' r2
  files. After the Halle fix the only near-overlaps are deliberate:
  - "Frohes neues Jahr! (from 1 January on)" against A2 "Guten Rutsch!" = "Happy New Year! (said before 1 January)".
  - der Fasching (first meaning "carnival (Bavarian and Austrian word)") against A2 der Karneval ("carnival"), which also lists der Fasching as an `alt`.

## Overlap with other round 2 lessons

- de1-h1 lesson 91 (zusammen wohnen) also covers the Hausordnung and quiet hours. It refers back
  to this module's honors lesson, and its details agree (22 to 6/7, 13 to 15, Sundays all day),
  so the two are complementary. I made no change.
- de1-m3 honors 12h2 also mentions Sunday closing and *feiertags*, but only briefly. The facts
  are consistent.

## Left uncertain

- In A2 (which carries A1), der Fasching is both an A1 word (w14) and an `alt` of A2's der
  Karneval. The build does not flag this, and both answers are accepted. Whoever owns A2 may
  want to drop the `alt`.
- The 16h1 "How to say what you like" Mermaid chart has five leaf boxes side by side. It is
  readable on desktop but small on a phone. I left it as it is.

## Counts

Answer-key errors 0 · factual fixes 4 (Karneval date and regions in the lesson, the card, h26, Fasching vocab entry) · picture fixes 0 · other fixes 3 (Fasching pronunciation, Halle first meaning, quote mark)

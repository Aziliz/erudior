# Round 2 review: de2-m4 (Home, travel and wishes)

Reviewer, independent of the writer. Scope: honors lessons 16h1 and 16h2, the round 2 additions to
lessons 13–16, `questions/r2-de2-m4.yaml` (47), `vocab-r2-de2-m4.yaml` (27),
`glossary-r2-de2-m4.yaml` (3), `cards-r2-de2-m4.yaml` (24) and the 12 `images/de2-m4-*` SVGs.
`content/math/check-module.sh german-a2 de2-m4` reports OK after the fixes.

## Changes

### Answer-key / question fixes
- **de2-m4-r2-h05**: the stem asked "Which sentence is correct?", but choice 3 (*Ich bin … an meiner
  alten Wohnung gehangen*) is correct in southern Germany, Austria and Switzerland (Duden: *hängen*,
  intransitive, perfect "hat, südd., österr., schweiz.: ist gehangen"). Stem now says "in standard
  German as used in Germany"; explanation names the regional *ist gehangen*.
- **de2-m4-r2-h09**: "Type the verb: Wo ___ du denn?" also accepts a correct *bist* (not in
  `accept`). Stem now asks for the position verb German uses here.
- **de2-m4-r2-h10**: same problem ("Was ___ in dem Brief?" could take *ist*). Same stem fix.

### Factual fixes / tightening
- **16h1, "The big idea" shortcut, Mermaid chart and Key points**: "time expressions with two-way
  prepositions take the dative" was stated as absolute, and the chart sent every time expression to
  the dative, contradicting the lesson's own *übers Wochenende*. Now "almost always", and the chart
  box and accDescr name the *über* + Akk exception. Re-rendered: readable.
- **16h1, set-phrases paragraph**: "*über* … is the one time expression that takes the accusative"
  overstated (e.g. *die Nacht auf den Montag*, *bis in die Nacht*). Now "the main exception".
- **16h1, Example 1 item 5**: "Wir fahren ___ Wochenende aufs Land" was given as only *am*; *übers*,
  which the lesson teaches, also fits. Added a note.
- **16h1, dialogue commentary**: said only three phrases were real places. It left out *auf der
  Autobahn*. Added.
- **16h1, hängen an**: added that *ist gehangen* is heard in southern Germany, Austria and
  Switzerland (Duden), to match h05.
- **16h1, Common mistakes**: the *über das Wochenende* bullet read as if *über das Wochenende* were
  the mistake. Reworded so the error shown is *über dem Wochenende*.
- **16h2, impersonal verb**: "a verb that only works with this empty es" was wrong for *frieren*,
  which the lesson itself uses with a person (*Ich friere*). Reworded in the lesson and in the
  glossary entry so it describes the use, not the verb.
- **16h2, -ig adjectives**: *regnerisch* was the only exception given. Added *der Sturm → stürmisch*.
  h20 explanation now says "an exception".
- **16h2, Föhn** (lesson, card, h21 explanation): "comes down the north side of the Alps" read as if
  it happened only there. Now "comes down from the Alps", north side for Munich/Innsbruck, and the
  south side when the wind blows the other way.
- **Lesson 13 addition** ("Describe the picture"): *Der Karton steht neben dem Fenster*, but in the
  picture the box is directly below the window. Changed to *unter dem Fenster*.

### Other
- **de2-m4-r2-h22** explanation typo "isnt" → "isn't".

## Checked and found right
- All 47 questions worked before reading the key. Order items q05, q09, q13, q16, h14, h28 each have
  only one valid order. Select-all q04, q08, q14, q19, h12, h27 are right. Match/label pairings are
  unambiguous.
- Temperatures recomputed in Python: 25 °C = 77 °F, 50 °F = 10 °C, −5 °C = 23 °F, 30 °C = 86 °F,
  68 °F = 20 °C, 10 °C = 50 °F, 24–28 °C = 75.2–82.4 °F, 37 °C = 98.6 °F, −10 °C = 14 °F,
  100 °C = 212 °F. h18/h19 distractors match the named mistakes (54, 62; 36, 37.8 ≈ 38).
- Thermometer SVG: the °C and °F ticks line up (0/32, 37/98.6, 100/212, −10/14 at the same heights).
  The "98,6" uses the German decimal comma on purpose.
- All 12 SVGs rendered: no overlap or clipping. Label markers (q01, q15, h13, h26) sit on their
  parts. All 5 Mermaid charts rendered; the accDescr lines cover the whole chart.
- *stehen in* (text), *stehen auf* + Akk (colloquial), *liegen an* + Dat, *liegen bei*,
  *jemandem liegen*, *sitzen* (fit), *Wo steckst du?*, *gesteckt*, *auf jeden Fall* /
  *auf Deutsch* (Akk), *vor Freude* (Dat): checked against Duden/DWDS usage.
- Weather: *es* stays (*Morgen regnet es*), the perfect takes *haben*, *Ich friere* / *Mir ist kalt*,
  hearsay *sollen*, *Es hat 28 Grad* (southern/Austrian), *frieren wie ein Schneider*, *Aprilwetter*
  saying, *Eisheiligen* 11–15 May (Mamertus to Sophie; labeled folk tradition), *Hitzefrei* (labeled
  as varying by state), *Föhn* headache link (labeled unproven), *der Föhn* = hairdryer (Duden spelling).
  *wolkig* as "usually partly cloudy" fits forecasters' usage (about 4/8–6/8 cover, between *heiter*
  and *stark bewölkt*/*bedeckt*; see wetter.net / wetterdienst.de lexicon entries on Bewölkungsgrad).
  It is labeled as a simplification.
- Vocab: genders and plurals are right (*Fröste*, *Möbelwagen*, *Kommas*; *Hagel*, *Donner*, *Luft*
  with no plural in practice). Scripted check against every A1, A2 and B1 vocab file, other writers'
  r2 files included: no shared id, no shared term + POS. The only first-meaning near-matches,
  *wolkig* "cloudy (partly)" vs *bewölkt* "cloudy" and *örtlich* "local (in places)" vs B1
  *Einheimische* "local (person)", are told apart by the parenthesized note, which is how build.py
  wants it. The 3 glossary terms and their aliases don't clash with any A2 glossary.

## Overlap
- The hearsay *sollen* in 16h2 ("Morgen soll es regnen") is also taught as **hearsay** in A2 honors
  `24h1-news.md` (de2-m6) and in B1 `20h2-sources-claims.md`. 16h2 only uses it for weather and
  comes earlier in the course, so the overlap is small. I left it alone.
- No other round 2 lesson in A2 covers figurative position verbs, Celsius/Fahrenheit or weather
  culture.

## Uncertain
- *unter uns* and *auf Deutsch* are labeled dative / accusative. The case is not visible
  (*uns*, article-less *Deutsch*), but this is the usual textbook analysis.

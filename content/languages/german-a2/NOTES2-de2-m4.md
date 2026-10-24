# Round 2 notes: de2-m4 (Home, travel and wishes)

## Honors lessons (2)

- `lessons/16h1-figurative-places.md`, id `de2-m4-h-figurative`: **Beyond the room: stehen, liegen and two-way prepositions in figurative German** (45 min, about 1,800 words of prose). Figurative uses of the position verbs (*stehen in* = be written, *im Stau stehen*, *stehen auf* (colloquial), *liegen an / bei*, *jemandem liegen*, *sitzen* = fit, *hängen an*, *Wo steckst du?*); the rule that in figurative uses the expression, not Wo?/Wohin?, decides the case; time expressions take the dative (exception *übers Wochenende*); set phrases (*vor allem, unter uns, in der Nähe, im Moment, auf dem Land / aufs Land, auf Deutsch, auf jeden Fall, über* = about). Three worked examples, a Mermaid decision chart, a 4-panel picture, a dialogue.
- `lessons/16h2-weather-talk.md`, id `de2-m4-h-wetter`: **Weather talk: forecasts, Celsius and weather sayings** (45 min, about 1,850 words). Impersonal weather verbs (*hageln, donnern, blitzen, nieseln, frieren, tauen*), *es* never dropped, perfect with *haben*; *es gibt* / *es ist*; *-ig* adjectives and the exception *regnerisch*; three ways to talk about tomorrow (present, *werden*, reporting *sollen*); Celsius ↔ Fahrenheit with formulas and worked conversions; culture (*Aprilwetter, Eisheiligen, Föhn, Hitzefrei*, the "kein schlechtes Wetter" saying); idioms; a longer radio forecast for D-A-CH and a short dialogue. Thermometer picture.

Why only two: my first drafts (flat hunting, train announcements, rubbish/Pfand) turned out to duplicate honors lessons other writers had just added (A1 `20h2-wohnungssuche`, `20h1-unterwegs`, `91-zusammen-wohnen`; A2 `91-woerter-erschliessen`, `92-hoeren`). I deleted those drafts and their images and wrote these two instead. I didn't write a Konjunktiv honors lesson because German B1 lessons 21–23 cover that ground.

## Core lessons (additions only)

- 13 two-way prepositions: dot/arrow picture (`de2-m4-dot-arrow.svg`), a Mermaid chart for choosing verb and case, and a labeled living-room scene (`de2-m4-living-room.svg` + blank), with one or two sentences introducing each.
- 14 travel: time-preposition timeline (`de2-m4-time-prepositions.svg`) and a hin/her picture (`de2-m4-hin-her.svg`).
- 15 Konjunktiv: Mermaid "which form?" chart and a Mermaid politeness ladder.
- 16 connectors: sentence-train picture for the memory hook (`de2-m4-sentence-train.svg`), a Mermaid chart for word order after the three groups of linking words, and weather symbols (`de2-m4-weather.svg` + blank).

## Questions (`questions/r2-de2-m4.yaml`, 47)

- Core (19, `de2-m4-r2-q01`–`q19`): 13 → 5, 14 → 5, 15 → 4, 16 → 5. By type: 2 label, 4 text, 4 match, 4 order, 5 select-all. 6 marked `module_quiz` (q01, q04, q06, q11, q14, q15).
- Honors (28, `de2-m4-r2-h01`–`h28`, 14 per lesson): 16 multiple choice, 4 text, 2 match, 2 select-all, 2 label, 2 order (6 new-type questions per lesson).

## Other files

- Vocab `vocab-r2-de2-m4.yaml`: 27 words (6 for 16h1, 21 for 16h2), ids `de2-m4-r2-w01`–`w27`. Checked against all A1, A2 and B1 vocab files, including other writers' r2 files: no clash in id, term + part of speech, or first meaning. B1 words are only glossed in the text: *der Stau* and *der Unfall*. A2/A1 words are reused, not re-added: *die Wettervorhersage* (de2-m6 r2), *in der Nähe*, *auf jeden Fall*, *das Land*.
- Glossary `glossary-r2-de2-m4.yaml`: *figurative meaning*, *fixed expression*, *impersonal verb* (none of these was defined in any A2 glossary file).
- Cards `cards-r2-de2-m4.yaml`: 24 cards (12 per honors lesson).
- Images (all original SVG, previewed): dot-arrow, living-room (+blank), time-prepositions, hin-her, sentence-train, weather (+blank), figurative (+blank), thermometer (+blank).
- Check: `content/math/check-module.sh german-a2 de2-m4` builds and reports OK (99 questions, 24 cards).

## For the reviewer to double-check

- 16h2 culture facts: Föhn (warm, dry wind on the north side of the Alps; the headache link is labeled unproven), Eisheiligen 11–15 May (labeled folk tradition), Hitzefrei (labeled as varying by state). "Es hat 28 Grad" is glossed as southern German/Austrian usage.
- 16h2 conversions checked in Python: 25 °C = 77 °F, 50 °F = 10 °C, −5 °C = 23 °F, 30 °C = 86 °F, 68 °F = 20 °C, 10 °C = 50 °F, 24–28 °C = 75.2–82.4 °F, 37 °C = 98.6 °F.
- 16h1: *stehen auf* is marked colloquial. *Die Hose sitzt* versus *passt* is a simplification (fit/hang versus size). The perfect *hat … gehangen* for *hängen an* follows the being verb.
- q13 and h14 order questions have comma-carrying items (`'hätte,'`, `'daran,'`), so only one order works.
- In 16h2 the *wolkig* gloss is given as "usually partly cloudy" in forecasts, a simplification of the forecasters' scale.

## Errors found in existing content

None. No existing question, card, glossary or vocab entry was edited.

## Sources

- Duden/DWDS for genders, plurals and usage (*regnerisch, schwül, Föhn, stehen auf* colloquial, *liegen an*).
- Celsius/Fahrenheit: standard formulas, recomputed in Python.
- Eisheiligen dates (Mamertus to Sophie, 11–15 May): common calendar tradition.

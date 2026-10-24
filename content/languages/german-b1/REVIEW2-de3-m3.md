# Round 2 review: de3-m3 (Describing in detail)

Reviewer read the brief, AUTHORING files and NOTES2-de3-m3.md. I worked all 53 new questions before looking at the keys, rendered all 7 SVGs (plus 6 blanks with their markers) and all 7 Mermaid diagrams, and checked the vocab against every vocab file in German A1, A2 and B1. `check-module.sh german-b1 de3-m3` reports OK with zero problems after the fixes.

## Changes

### Answer keys and questions (3)
- **de3-m3-r2-q08** (match). The distractor "welches" was not clearly wrong: *das Buch, welches ich gerade lese* is correct, if formal, German. I replaced it with "wer". The item *das Beste, ___ ich in Wien gegessen habe* → "was" was also open to doubt, because "das" (also on offer in the drop-down) shows up after nominalized superlatives when a specific thing is meant. I replaced it with *etwas, ___ ich nicht verstehe* → was and updated the explanation.
- **de3-m3-r2-q16** (text). The first gap ("because of") accepted only "wegen". *Aufgrund des Streiks* is just as correct and is taught in 15h2, so I added "aufgrund" to `accept` and a note to the explanation.
- **de3-m3-r2-q18** (select-all). The wrong choice "innerhalb zwei Wochen" was not clearly wrong. Duden allows the dative after *innerhalb* when the genitive can't be seen, and *Wochen* looks the same in the dative. I replaced it with "innerhalb einem Monat", which is clearly non-standard because *eines Monats* is available, and extended the explanation. The key [0, 1, 3] is unchanged.

### Factual and grammar fixes (2)
- **11-relative-all, Mermaid "Choosing the relative pronoun".** The chart asked "preposition in front?" before "does it mean whose?". A *whose* clause with a preposition (*die Firma, mit deren Hilfe…*) therefore led to "the preposition decides the case: mit der", which is wrong. I put the *whose* question first ("dessen, deren, also after a preposition: mit deren Hilfe") and updated accDescr to match.
- **15h1, Mermaid "Unpacking an extended participle phrase".** The branch "Partizip II of a haben verb → passive" contradicted the lesson's own rule that *haben* verbs without an object have no attributive Partizip II. I changed the label to "Partizip II of a verb with an object" (accDescr: "with an accusative object"), which matches the table and the cards.

### Other fixes (3)
- **15h1, "Back to a relative clause".** The rule "verbs with haben and no object have no Partizip II before a noun" now has a short note that a few lexicalized adjectives such as *ein studierter Mann* are exceptions. This is the "very few exceptions" caveat the writer's notes said was left implicit.
- **15h2, "Above, below, along".** *oberhalb/unterhalb* "mostly for places on a slope or a river" overstated the restriction. It now reads "higher or lower than something, often on a slope or along a river".
- **vocab-r2-de3-m3 w03 der Fund.** The first meaning "find" collides in practice with A1 *finden* "to find", since the leading "to" is ignored. The English→German prompt is now "find (noun, something found)".

### Picture fixes
None needed.

## Checked and found right (a reader might doubt these)
- *mangels Beweisen* with the dative (plural without an article); *dank* with genitive or dative; *laut* with genitive or dative, and no ending on a bare singular noun (*laut Polizei*); *entlang*: placed after the noun it takes the accusative, placed before it the genitive (rarely the dative); *aufgrund/auf Grund* and *mithilfe/mit Hilfe* are both correct spellings. Source: Duden online entries for each word (duden.de/rechtschreibung/mangels, …/dank, …/laut_gemaess, …/entlang, …/aufgrund, …/mithilfe).
- *stoßen auf* takes *sein* in the perfect; *ausgraben* is *grub aus, hat ausgegraben*; *Archäologe* is a weak noun. Source: Duden / DWDS.
- Bastian Sick, *Der Dativ ist dem Genitiv sein Tod*: published 2004 (Kiepenheuer & Witsch), based on his Spiegel Online column "Zwiebelfisch". The debate is presented as two opinions, and the possessive dative is correctly called non-standard.
- 15h1 text: "six extended phrases" is right if the extended adjective *in einer für ihn gefährlichen Zeit* is counted, which the lesson's "adjectives can do it too" section supports. The six are seit Februar laufenden, mit Steinen abgedecktes, sofort informierte, gut erhaltenen, für ihn gefährlichen, and bereits ausgegrabenen + noch zu untersuchenden.
- 15h2 letter: the "ten genitive prepositions" count is right if *während der gesamten Bauzeit* (lesson 14) is counted: bezüglich, aufgrund, infolge, hinsichtlich, laut, während, anlässlich, mithilfe, dank, angesichts. The two uses of *deren* are also correct.
- Cross-references hold: lesson 18 covers *sein + zu* and the modal passive, lesson 27 covers *lassen*, lesson 26 covers *laut*, lesson 25 covers *die Leitung*, lesson 5 covers *Bewohner*, and lesson 11 has *dessen/deren* as receptive.
- All label markers sit on the parts their labels name (relative-parts, altstadt, family-tree, participles, h-bracket, h-letter). The departure board matches q19 and its alt text. The family tree matches lesson 13's text.
- Vocab: no id, term+pos or first-meaning duplicate against A1, A2 or B1, including all r2 files (apart from the *Fund/finden* clash fixed above). The glossary terms are new.

## Overlap
- 15h2 (official letters, *bezüglich/aufgrund*, letter parts) touches the de3-m6 honors lesson 30h2-official-letters (also official letters, lists *bzgl.*, uses *aufgrund*) and core lesson 29 (letter parts *Absender, Empfänger, Betreff, Anrede, Grußformel*). The focus differs: 30h2 covers notices and objections, 15h2 covers genitive prepositions. de3-m6's notes already leave *bezüglich* to this module. No change made.

## Left uncertain
- q21's marker 2 sits on the bed rather than on the child. It's unambiguous because there is one picture per panel, so I left it.
- The *sein*-verb rule in 15h1 (Partizip II of a *sein* verb = active, finished) really holds only for verbs of change (*ankommen, umfallen, steigen*). The lesson's examples are all of that kind, and it already labels the tenses as simplified.

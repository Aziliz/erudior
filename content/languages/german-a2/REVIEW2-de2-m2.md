# Round 2 review: de2-m2 (People and relationships)

Reviewer for item 156. Scope: the honors lessons 08h1 and 08h2, the round 2 additions to core lessons
05–08 (found by diffing them against the pre-round-2 build `samples/languages-drafts/lang-german-a2-m2.json`),
`questions/r2-de2-m2.yaml` (46), `vocab-r2-de2-m2.yaml` (28), `glossary-r2-de2-m2.yaml` (2),
`cards-r2-de2-m2.yaml` (26), and the 9 `images/de2-m2-*` SVGs. `content/math/check-module.sh german-a2 de2-m2`
reports zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| `images/de2-m2-bathroom-blank.svg`, `de2-m2-bathroom.svg`, q01 | The soap (34×14 px) was entirely hidden under label marker 3, so the learner couldn't see what marker 3 pointed at. | Made the soap bigger (56×24 px) in both SVGs. Moved the q01 marker to x 60, y 47.5 (centre of the new soap). |
| `images/de2-m2-bathroom.svg` | The "die Zahnbürste" leader line ended on the cup, not the toothbrush. The "die Seife" leader grazed the basin rim. | Leader dot moved onto the toothbrush handle (279,186). Soap leader now ends on the soap (456,230) and clears the rim. |
| 08h1, "The pattern" | The rule "you use it when the sentence already has an accusative object" was stated without exception. The same lesson later uses dative reflexives with no accusative object (*Wir schreiben uns*, *Sie helfen sich*). | Changed to "mainly when", and added one sentence after the table: dative verbs such as *helfen* take a dative reflexive without a thing (*Ich helfe mir selbst*). |
| `glossary-r2-de2-m2.yaml` "dative reflexive" | Same overstatement as in 08h1. | "used mainly when …"; added the dative-verb exception (*Wir helfen uns*). |
| `cards-r2-de2-m2.yaml`, card 1 | Same overstatement as in 08h1. | Back now adds "(but dative verbs keep the dative: Wir helfen uns)". |
| 08h2, "Das ist mir wichtig" | Said *es* "disappears" when something else comes first. In fact correlative *es* is optional in the middle field, and *Mir ist es wichtig, dass …* is correct and common. | "*es* is usually left out … (*Mir ist es wichtig, dass …* is also correct.)" |
| 08h2 Mermaid (subject in a feeling sentence) | The second decision node asked "Does a thing or person cause the feeling?", which sent *Ich mag dich* (where *dich* does cause the feeling) down the "no" branch. That logic gives the wrong structure for *mögen* and *lieben*. | The node now asks "A dative verb or phrase? (gefallen, fehlen, einfallen, egal sein)". Updated accDescr to match. Previewed. |
| `vocab-r2-de2-m2.yaml` w10 *das Gedächtnis* | The plural was given as "—", but the noun does have a plural, *die Gedächtnisse*, though it is rarely used. | `plural: die Gedächtnisse (rare)`, following the course's style for rare plurals (*die Januare (rare)*). |
| 06-verb-prepositions.md | Formatting: the writer's insertion left a stray leading space before "Two very common phrases". | Space removed. |

## Checked and found right (a reader might doubt these)

- **All 46 questions.** I worked each one before looking at the key, and every key is right.
  - Order items have only one standard order. In h26, *Mir sind nicht die Namen eingefallen* is possible only as contrastive negation, which doesn't match the English prompt.
  - h25: *Ist es dir recht, wenn …* is right. The subject pronoun *es* comes before the dative *dir*.
  - h14: *Ich habe kalt* is not German, and the explanation's "French-style" (*j'ai froid*) is fair.
  - q07: the cases are right. *teilnehmen an* and *Angst haben vor* take the dative.
- **Perfect auxiliaries:**
  - With *sein*: *einfallen, auffallen, vorkommen, leichtfallen, schwerfallen*.
  - With *haben*: *leidtun* (*hat leidgetan*, current Duden spelling) and every reflexive verb.
  - Participles: *ausgedacht* (mixed verb), *überlegt* (no *ge-*).
- **Grammar points that are correct as written:**
  - Two pronouns go accusative first: *Ich sehe ihn mir an*.
  - *sich einander* is wrong or pleonastic, so use *einander* or *sich gegenseitig*.
  - *Ich bin kalt* means a cold person, and *Ich bin heiß* is slang.
  - *einem* is the dative of *man*.
- **Pronunciation notes are right:** *komisch* has a long o, the *h* in *Heimweh* is silent, the *d* in *leidtun* is pronounced like t, and *ch* after *au* is the back sound.
- **Spelling variants:** *lieb haben / liebhaben* and *schwindlig / schwindelig* are both standard.
- **Pictures:** all 9 SVGs rendered and looked at. The label markers in q01, q11 and q16 sit on the right parts. *der Hals* is drawn in the face picture but not numbered, as the explanation says. The reciprocal arrows and the liking-scale order match the text. The lesson labels the scale "a rough guide".
- **Mermaid:** all 6 diagrams previewed. The content and accTitle/accDescr are correct.
- **Vocab duplicates:** I checked against every A1, A2 and B1 vocab file, including the other writers' `vocab-r2-*` files. No term, id or first meaning (with its note in parentheses) is repeated. Close pairs that are separated by their parenthetical notes:
  - *sich merken* "to remember (make a mental note of)" vs A2 *sich erinnern* "to remember"
  - *das Gedächtnis* vs *die Erinnerung*
  - *auffallen* "to strike (be noticed by)" vs B1 *streiken*
  - *brechen* vs *die Pause*

## Overlap

- 16h2 (weather talk) also mentions *Mir ist kalt / Ich bin kalt*. It's brief and consistent with 08h2, and German A1 lesson 20 teaches it too.
- No other round 2 lesson in A2 repeats the dative reflexive or the dative-of-feeling material.
- The writer had already dropped a du/Sie draft because German A1's round 2 honors lessons cover it.

## Left uncertain

- The register labels are judgements, not dictionary facts, though they are reasonable: *Mir ist übel* "a little more formal" and *Mir ist langweilig* "informal".
- *komisch* "strange (odd)" (here) vs B1's *seltsam* "strange (peculiar)" (`vocab-r2-de3-h1.yaml`, another writer's later file): both prompts point to "strange" and differ only by a weak note. That's not my file, so the B1 reviewer should look at it.
- Sources:
  - Duden (from memory; duden.de could not be fetched this session): plural *Gedächtnisse*, *leidtun / leidgetan*, *lieb haben / liebhaben*, *schwindlig / schwindelig*, and *es* as an optional correlate (Duden-Grammatik).
  - Search: https://www.duden.de/suchen/dudenonline/gedächtnis

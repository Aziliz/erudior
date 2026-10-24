# Round 2 review: de3-m2 (Reasons, goals and contrasts)

Reviewer for item 163. I checked all 53 new questions (worked each before the key), both honors lessons, the core-lesson additions, all 12 SVGs (8 rendered plain, 4 label blanks rendered with their markers), the 6 Mermaid diagrams, the 10-je-desto plot, the 31 vocab words, 4 glossary terms and 24 cards. `content/math/check-module.sh german-b1 de3-m2` reports 0 problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| q06 (blank 3) | "Er ist gegangen, ___ sich zu verabschieden" also works with *um* ("he went to say goodbye"), so a learner typing *um* was marked wrong for a correct sentence. | Stem now "Er ist einfach gegangen, …" so only *ohne* fits; explanation says "he simply left". |
| q11 (blank 1) | "___ Sie umgezogen sind, müssen Sie Ihre Adresse ändern" is also correct with *falls* ("if you have moved…"). | Stem adds "using each word once", which leaves *da* (or *weil*) as the only answer. |
| h09 (blank 1) | *wogegen* (a standard synonym of *wohingegen* as a conjunction) was rejected. | Added `wogegen` to accept; explanation mentions it. |
| vocab w02 *hingegen* | Prompt note "by contrast (hingegen)" showed the German answer in the English → German prompt. | Now "by contrast (slightly formal)". |
| vocab w29 *letztlich* | First meaning "in the end" is also the prompt for *schließlich* (B1 m1, "in the end (eventually)") and *zum Schluss* (A1 r2), so the English → German card was ambiguous. | First meaning is now "ultimately" (unique); "in the end" stays as an accepted answer. |
| vocab w23 *das Zahlungsmittel* | "currency" listed as a meaning; currency is *die Währung*. | Removed "currency". |
| 10-je-desto plot | The "Stress" label sat on the dashed line (the app puts curve labels at the right end, just above the curve, and the line rises to the left). | Removed the function label and added a `labels` entry at (8.6, 2.8), just under the dashed line. Re-rendered: no overlap. |
| 10h2, Common mistakes | Said only *egal* and *wie … auch* clauses keep subject-first order, but the lesson's own *wenn … auch* example ("Wenn das Hotel auch teuer war, wir haben es nicht bereut") does too. | Added "and the old split *wenn … auch*". |

Counts: answer-key errors 3 (q06, q11, h09), factual fixes 1 (Zahlungsmittel ≠ currency), picture fixes 1 (plot label), other fixes 3 (two vocab prompts, one lesson consistency note).

## Checked and found right

- **Bundesbank claim**: the press release "Zahlungsverhalten in Deutschland 2023" says "Bargeld bleibt in Deutschland das meistgenutzte Zahlungsmittel an der Ladenkasse" and that the cash share is falling ("während der Anteil der Barzahlungen sinkt"). The essay and h27 match it and give no percentages. https://www.bundesbank.de/de/presse/pressemitteilungen/zahlungsverhalten-in-deutschland-2023-934828
- **Sunday closing**: Sunday rest is constitutionally protected (Art. 140 GG with Art. 139 WRV); shop hours have been a Land matter since the 2006 federalism reform; station, airport and petrol-station shops and (in many Länder) bakeries for a few Sunday hours are the usual exceptions. Austria and Switzerland generally keep shops closed on Sundays too. The lesson keeps this general, which is right.
- *es sei denn*: comma before is required; the second comma is described as this course's habit, not a rule. *sei* is Konjunktiv I. Verb-second after it, verb-last only with *dass*: correct.
- *abwägen*: Duden gives both *abgewogen* and *abgewägt*; *ich wäge ab*. *sich unterscheiden*: unterschied, hat unterschieden. *überwachen* is inseparable. Genders and plurals of all nouns are right.
- *wohingegen* / *hingegen* in position 1 and after the first element, *dagegen* as da-word vs contrast adverb, *allerdings* as a limiting adverb and as an emphatic answer, *im Gegensatz zu* + dative: all correct.
- Cross-references hold: *während* as "whereas" is already in lesson 3; *Ich bin dagegen* is in lesson 19; *lassen* in lesson 27; adjectival nouns in lesson 5; *einerseits … andererseits* / *erstens, zweitens* in lesson 28; Konjunktiv II in module 5; *sonst* in A2 lesson 16.
- Reading counts: Jake's blog has exactly the connectors the note lists (two *allerdings*, one each of the others). The model essay's four paragraphs match h23's order.
- Pictures: podium times match q24, the bakery sign matches h07 (Sunday 8:00–11:00, card from 10 €), the contract timeline matches q12 and the lesson text, and the campus (green H on a yellow sign = German bus stop) and houses match their labels. Every marker sits on the part its label names. Text is readable and nothing is cut off.
- Mermaid diagrams: content correct, `accDescr` describes the whole chart, all readable. The 10h1 chart is wide (four branches) but legible.
- Vocab duplicates: re-ran the term / id / first-meaning check against every vocab file in A1, A2 and B1. After the *letztlich* fix the only first-meaning overlaps are disambiguated by their notes (*allerdings* "however (limiting …)" vs *jedoch* "however"; *andernfalls* "otherwise (formal)" vs *sonst* "otherwise (or else)").
- Glossary: no term or alias clashes with the other german-b1 glossary files.

## Uncertain / not verified

- Stress of the emphatic *Allerdings!* on the last syllable: this matches my knowledge of common usage, and the lesson hedges it ("many speakers"). I couldn't check it against Duden or Wiktionary because those page requests were blocked (duden.de/rechtschreibung/allerdings, de.wiktionary.org/wiki/allerdings).
- Jake's bakery is cash-only "außer wenn man mehr als zehn Euro ausgibt", while Bäckerei Krume's sign says "ab 10 €". These are presented as different shops, so I left it.

## Overlap

I found no overlap with other round-2 lessons in German B1. No other NOTES2 file covers the Erörterung, *es sei denn* / *außer wenn*, *hingegen* or Sunday shopping. Lesson 28 (core) covers *einerseits … andererseits*, and 10h2 points to it rather than repeating it.

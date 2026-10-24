# Round 2 review: German B1, module de3-m1 (Stories and time)

Reviewer for item 162. I checked every new question (55), both honors lessons, the additions to core lessons
01–05, all 10 SVGs (rendered, with label markers on the blanks), all 8 Mermaid diagrams (rendered), the
glossary, cards and vocab files. The checker reports zero problems after the fixes (`check-module.sh german-b1 de3-m1`: OK,
7 lessons, 115 questions, 24 cards).

## Changes

| where | what was wrong | change | source |
|---|---|---|---|
| 05-n-nouns.md, Mermaid "Is it a weak noun?" | Sent der Name / der Gedanke / der Glaube / der Buchstabe (masculine, -e, not people) to "Normal noun", which contradicts the lesson's own Name-group section. Also sent der Planet (in the lesson's own table) to "Normal noun", because the step only asked about foreign words *for people* and left out -et. "only exception: das Herz" implied das Herz is a weak noun. | Added a "Name, Gedanke, Glaube, Buchstabe?" step leading to "Weak, but genitive -ns". The foreign-word step now says "mostly for a person" and includes -et (der Planet). The final box now reads "Almost certainly a normal noun". das Herz is now "a special case". accDescr rewritten to match. Re-rendered (10 boxes). | the lesson's own tables; Duden grammar (n-declension) |
| 05h2, "Building the noun" item 2 | Called der Tod (sterben) and the others "short nouns from the verb stem". Der Tod is not from the stem of sterben. | Now reads "Short nouns that belong to the verb … Most come from the verb's stem …; a few are a different word altogether (*sterben → der Tod*)". This matches the h25 explanation. | — |
| 05h2, after item 3 | Struck through ~~nach dem Ankommen~~ as if it were wrong. It is grammatical, just clumsy in writing. | Now reads "written German prefers *nach der Ankunft* rather than *nach dem Ankommen* (which is possible, but sounds clumsy in writing)". | — |
| 05h2, text notes + card "wurde geboren vs ist geboren" | Said "*ist geboren* for people who are alive" as if *wurde geboren* were wrong for living people. | *wurde geboren* is required for the dead. For the living, *ist geboren* is the everyday form and *wurde geboren* is also correct. Changed in both places. | Duden usage (geboren) |
| 05h1, Common mistakes | Said "he has probably missed", not "he will have missed". This clashed with the lesson's own point that English "will have" can also be a guess ("That'll have been the postman"). | Now: without a future time point it is a guess, not a statement about what will happen. | — |
| glossary-r2 "Futur II" | Said the guess use is "more often" heard in speech, as a fact. The lesson hedges this ("probably"). | Now "probably more often". | — |
| card "Three ways to make the noun" | Listed der Tod as a "short stem noun". | Now "short noun (die Ankunft, der Beginn; sometimes a different word: sterben → der Tod)". | — |
| images/de3-m1-plaque.svg | The footer "A fictional person (invented for this course)." overlapped the inner frame's bottom border. | viewBox and height 420 → 440, both frames made 20px taller, footer moved to y=390. Re-rendered: clear. | render |

No answer-key errors were found.

## Checked and found right (a reader might doubt)
- **Order questions** q05, q15, q19, q24, h11, h27. The English target and the fixed first word leave only one natural order. q05 *Dann rief die Polizei der Zeuge an* is technically possible with marked word order, but it is not a natural rendering of the English. q19 cannot swap the subject and object without changing the meaning.
- **q09** treats *Nachdem er aß, ging er spazieren* as wrong in written German. This matches lesson 2 and standard prescriptive grammar (nachdem + past perfect when the main clause is in the past).
- **q10 order** matches the lesson 2 text: the aunt fled before the Wall (1961), then school, then 9 Nov 1989, then the job loss in 1991.
- **q18**: werden for promises follows lesson 4's rule. Note that *Ich helfe dir* is also common in speech. The question asks for "most natural" and follows the lesson, so I left it.
- **q23**: two items share the answer *Deutschen*. The format allows repeated answers.
- **Tatort**: the first episode was "Taxi nach Leipzig" (NDR), 29 Nov 1970. It runs on Sunday evenings on Das Erste, and ORF and SRF also produce episodes (wissen.de, "Der Tatort feiert Jubiläum"). The claim about Austrian and Swiss teams comes from general knowledge (ORF since 1971, SRF since 1990, with gaps). It is stated loosely enough to be right.
- **einbrechen** with *sein* (*ist eingebrochen*) in the burglary sense: verbformen.com's examples all use *sein* (it also lists a *haben* entry). Fine as given.
- **Clara Brenner dates**: 1933–1949 is sixteen years (*sechzehn Jahre*). Born 1891, so "1919, als sie 28 Jahre alt war" is right if her birthday came before the founding. The text never gives her birthday, so this is fine.
- **Vocab duplicates**: I ran my own script against every vocab file in german-a1, german-a2 and german-b1 (id, term+pos, first meaning). The only near-clashes have distinct parenthetical prompts or a different part of speech: *die Rückkehr* "return (coming back)" vs *Rücksendung* "return (of goods)"; *die Heirat* "marriage (getting married)" vs *die Ehe* "marriage"; *ehe* "before (formal conjunction)" vs *bevor* "before (+ clause)". The checker accepts them.
- **Pronunciation notes**: Alibi (stress on A), Aufenthalt (AUF-), sooft (so-OFT), verdächtig (ich-Laut). All agree with standard dictionary stress as I know it.
- **Cross-references**: lesson 14 (*während* + genitive), lesson 20 (nominal style in the news) and lesson 25 (*scheinen … zu* + perfect infinitive) all exist and say what the honors lessons claim. Futur II and nominalisation are listed as B2 in RESEARCH.md, so "strictly B2" is accurate for this course.
- **All label markers** sit on the parts their labels name (bracket, timeline, time-clause bars, tense timeline).

## Overlap
- 30h2-official-letters (de3-m6, honors) also turns nominal phrases back into clauses (*Nach Prüfung Ihres Antrags → Nachdem wir Ihren Antrag geprüft haben*). That lesson is about officialese and 05h2 is about time phrases, so the overlap is partial and reasonable. 05h2 comes first in the course. I did not edit the other file.
- 20h1 mentions in one line that nominal style hides the doer. That is not real overlap.

## Left uncertain
- *der Verdacht* plural "die Verdachte (rare)". Duden also lists *Verdächte*, as I recall, but I could not open duden.de or Wiktionary in this session (the permission prompt timed out: duden.de/rechtschreibung/Verdacht, /einbrechen, /sooft). I left it unchanged.

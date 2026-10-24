# Round 2 notes: de2-m2 (People and relationships)

`content/math/check-module.sh german-a2 de2-m2` builds and checks with zero problems
(6 lessons, 94 questions, 26 cards, 139 words in the module).

## Honors lessons (2)

1. `lessons/08h1-dative-reflexive.md`, id `de2-m2-h-dative-reflexive`:
   **Imagine, remember, treat yourself: verbs with mir and dir** (45 min). Dative reflexive as
   lesson 5 + lesson 7 combined: optional "for myself" dative (kaufen, machen, nehmen), verbs that
   need it (sich etwas ansehen/anschauen, merken, vorstellen, überlegen, wünschen, leisten,
   ausdenken, gönnen), *sich vorstellen* acc vs dat, two-pronoun order (*Ich sehe ihn mir an*),
   perfect participles, injuries (*Ich habe mir den Arm gebrochen*), reciprocal *einander /
   sich gegenseitig / miteinander*. Two worked examples, reading "Ein Wunsch für Lissabon".
2. `lessons/08h2-dative-feelings.md`, id `de2-m2-h-dative-feelings`:
   **Mir ist kalt, du fehlst mir: feelings with the dative** (45 min). The experiencer in the
   dative: *Mir ist kalt/schlecht/übel/schwindlig/langweilig*; *Das ist mir egal/wichtig/recht/
   unangenehm*, *Es ist mir wichtig, dass …*; dative verbs *leidtun, einfallen, auffallen,
   vorkommen, leichtfallen, schwerfallen* (agreement with the thing, perfect with *sein*);
   the scale *nett finden → mögen → gern haben → lieb haben → verliebt sein → lieben*. Two worked
   examples, reading "Die erste Woche in Kanada" (letter).

A first draft of honors lesson 2 was on du/Sie; I replaced it because German A1's round-2 honors
lessons (04h2, 24h2) now cover duzen/siezen, offering the du, capitals in letters and ihr vs Sie.

## Questions (`questions/r2-de2-m2.yaml`, 46)

- Core (q01–q20, 5 per lesson, 8 marked `module_quiz`): 3 label, 4 text, 4 match, 4 order,
  4 select-all, 1 multiple choice with a picture.
- Honors 1 (h01–h13): 8 multiple choice, 2 select-all, 1 text, 1 order, 1 match.
- Honors 2 (h14–h26): 8 multiple choice, 1 select-all, 1 text, 1 match, 2 order.
- h22 (H2 text) is not case-sensitive; mir/dir need no capitals.

## Pictures and diagrams

- SVGs in `images/`: `de2-m2-bathroom(-blank)`, `de2-m2-face(-blank)`, `de2-m2-gifts(-blank)`
  (label questions q01, q16, q11), `de2-m2-freuen-timeline` (lesson 6 + q09),
  `de2-m2-reciprocal` (H1), `de2-m2-liking-scale` (H2). All previewed; markers checked on blanks.
- Mermaid: lesson 5 (mich or mir?), lesson 6 (asking/answering: wo-/da-word vs preposition +
  wen/pronoun), lesson 7 (order of two objects), lesson 8 (three uses of werden), H1 (vorstellen:
  mich or mir), H2 (who is the subject in a feeling sentence).
- Core lessons: additions only (pictures with a one-line lead-in, diagrams).

## Words, terms, cards

- `vocab-r2-de2-m2.yaml`: 28 words (12 for H1, 16 for H2). Checked against A1 (all vocab files,
  including A1's round-2 files), every A2 vocab file and every B1 vocab file (B1 requires A2).
  Words already owned by B1 are taught in the lesson text only: *sich vorstellen, sich leisten,
  gegenseitig, peinlich, vermissen, einsam*; *überlegen* is A2 m1's.
- `glossary-r2-de2-m2.yaml`: *dative reflexive*, *experiencer* (the only bolded new terms).
- `cards-r2-de2-m2.yaml`: 26 cards (13 per honors lesson).

## For the reviewer

- The du/Sie draft first added *duzen, siezen, der Nachname, der Spitzname, die Dame*; A1's
  round-2 writers added the same words meanwhile, so I removed them. Writers still working on
  B1 round 2 should check `vocab-r2-de2-m2.yaml` before adding words, since B1 carries A2.
- The liking scale in H2 is labelled as a rough guide; the order of *verliebt sein* and
  *lieben* is a matter of usage, so no question tests it.
- *Mir ist übel* "a little more formal" than *schlecht* and *Mir ist langweilig* "informal" are
  register judgements; *leidgetan* follows current Duden spelling.
- The lesson-8 face picture's label distractor *der Hals* is drawn (neck) but not numbered; the
  explanation says so.

## Errors found in existing content

None.

## Sources

Duden online (*du* in letters, *leidtun/leidgetan*, *liebhaben/lieb haben*, *schwindlig/
schwindelig*); Goethe-Institut page on regional forms of address (used for the replaced du/Sie
draft). All texts, examples and pictures are original.

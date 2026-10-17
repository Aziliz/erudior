# Writing a bundled language course

Language courses take a self-study learner (no teacher) to one proficiency level: one course
per level (German A1, German A2, …). Each course has three parts:

1. **Grammar lessons** that teach, with explanations in English and plenty of examples in the
   language.
2. **Vocabulary**: the words a learner needs for the level, taught a few dozen per lesson and
   learned through typed review cards (word → English and English → word) that climb Novice,
   Beginner, Advanced and Expert. Words join a learner's reviews when they finish the lesson.
3. **A reading list** of graded readers and free texts at the level.

Everything is original writing. Don't copy or closely paraphrase any textbook, website, word
list or exam (the Goethe-Institut word lists and model tests are copyrighted): words and
grammar rules are facts, but every explanation, example sentence, dialogue, reading text and
question is yours.

## Files

One folder per course, `content/languages/<folder>/`:

```
course.yaml          id, title, description, language block, modules
lessons/NN-slug.md   one lesson per file
questions/mN.yaml    multiple-choice questions, one file per module
vocab-mN.yaml        vocabulary, one file per module
glossary.yaml        grammar terms (every bolded lesson term)
references/*.md      grammar tables (articles by case, verb endings, numbers, time…)
reading.yaml         reading list
PROGRESS.md          outline and notes
```

Build and check:

```
python3 content/math/build.py german-a1
npx tsx tests/check-course.mts samples/languages-drafts/<course-id>.json
```

Only touch the files you were assigned. Don't edit `src/`, `tests/`, other courses or run git.

## Lessons (`lessons/05-nouns-and-gender.md`)

```markdown
---
id: de1-nouns-gender
module: de1-m2
title: Nouns, gender and articles
minutes: 30
topics: [Articles, Plurals]
refs: [de1-ref-articles]
---
## What this lesson is for
…
```

- Explanations in English, examples in German with an English translation:
  `*Ich komme aus Kanada.* — I'm from Canada.` Put German in *italics*.
- **Bold only grammar terms** the first time they appear (e.g. **accusative**, **separable
  verb**), and give each one a `glossary.yaml` entry. Don't bold German words or example
  sentences (bold turns glossary terms into pop-up links).
- Length 1,000–2,000 words. A structure that works:
  - what the lesson is for and how it connects to the last one;
  - the grammar in `##` sections: the rule, a table of forms where it helps, why it works
    that way or a memory hook, and several examples;
  - at least one short original dialogue or text (6–12 lines) using the lesson's words and
    grammar, with a translation below it;
  - "Pronunciation" notes where a word is tricky (stress, ch, r, ei/ie, umlauts…);
  - "Common mistakes" (what English speakers get wrong);
  - "Key points" at the end.
- Use GitHub Markdown tables for paradigms. No `$` signs (they start math); write "5 Euro"
  or "5 €".
- Use the lesson's new words in the lesson so the learner meets them in context, and
  mention near the end: "The words from this lesson are listed below; they join your
  vocabulary reviews when you complete the lesson."
- Only grammar the course has reached: a lesson may use words and patterns from earlier
  lessons, and anything new must be explained or glossed.

## Vocabulary (`vocab-m2.yaml`)

```yaml
- id: hund
  lesson: de1-family
  term: der Hund
  pos: noun
  plural: die Hunde
  meanings: [dog]
  example: Unser Hund heißt Bello.
  exampleEn: Our dog is called Bello.
- id: gehen
  lesson: de1-present-tense
  term: gehen
  pos: verb
  meanings: [to go (on foot), to go, to walk]
  note: Irregular perfect: ist gegangen.
- id: wie-geht-es-ihnen
  lesson: de1-greetings
  kind: phrase
  term: Wie geht es Ihnen?
  alt: [Wie gehts Ihnen?]
  meanings: [How are you? (formal), how are you]
```

- `id`: unique in the course, lowercase ASCII with hyphens (ä → ae, ß → ss). For words with two
  senses add a suffix (`bank-bench`, `bank-bank`).
- `term`: exactly what the learner must type in the English → German direction.
  - Nouns always with their article: `der Hund`, `die Straße`, `das Kind`. `pos: noun` and a
    `plural` (`die Hunde`; write `—` if there's no plural, `die Eltern (plural only)` for
    plural-only nouns, with term `die Eltern`).
  - Verbs in the infinitive (`fahren`). Add a `note` for stem changes (`du fährst, er fährt`),
    separable prefixes, and a perfect tense that's irregular or uses *sein*.
  - Use `alt` for other spellings a learner may fairly type (Swiss *ss*, informal forms).
- `meanings`: English answers accepted in the German → English direction. **The first meaning
  is the prompt** for English → German, so it must point to exactly one German term: add a
  disambiguating note in parentheses (`you (informal, one person)`, `to go (by vehicle)`,
  `to know (a person)`, `the (feminine)`), which the checker ignores when comparing.
  List every reasonable English answer after it (`[hello, hi]`, `[to drive, to go by car,
  to ride, to travel]`); a learner who types a correct synonym and gets marked wrong loses
  trust in the app. Leading "to", "a", "the" are ignored when checking.
- `pos`: noun, verb, adjective, adverb, pronoun, article, preposition, conjunction, number,
  question word, particle, interjection, phrase.
- `kind: phrase` for set phrases. Keep phrases short; for a long phrase that's unreasonable to
  type from English, set `directions: [meaning]`.
- `example` / `exampleEn`: one short original sentence using the word, at A1 level.
- No two items may share the same term and part of speech, or the same first meaning.

## Questions (`questions/m2.yaml`)

Same format as the math courses:

```yaml
- id: de1-q-0501
  lesson: de1-nouns-gender
  module_quiz: true
  topic: Articles
  stem: 'Which article goes with *Tisch* (table)?'
  choices: ['der', 'die', 'das', 'den']
  answer: 0
  explanation: |-
    *Tisch* is masculine: *der Tisch*. …
```

- 10–14 questions per lesson. Mix: choose the right form (article, ending, verb form,
  pronoun), word order ("Which sentence is correct?"), meaning of a word or sentence, a
  short reading text (2–5 sentences of original German, or a sign/message/ad) with a
  comprehension question, the right response in a mini dialogue, and spotting the mistake.
- 4 choices, one correct; spread the answer index evenly over 0–3. Distractors are the
  mistakes learners actually make (wrong gender, English word order, missing umlaut, wrong
  case). The explanation says why the answer is right and what the tempting wrong one got
  wrong.
- Mark about a third `module_quiz: true` (at least 2 per lesson).
- Ids `de1-q-LLNN` (LL = lesson number).
- Put German in the stem and choices in *italics* only when mixed with English; plain choices
  can be bare German. Use straight single quotes around YAML strings and double any `'`
  inside (`'Wie geht''s?'`).

## Glossary (`glossary.yaml`) and references

```yaml
- term: accusative
  aliases: [accusative case, Akkusativ]
  definition: 'The case of the direct object: the thing or person the verb acts on. …'
  topic: Cases
```

Reference sheets: front matter `id`, `title`, then Markdown tables (the lesson's `refs`
point to them).

## Getting it right

German must be correct and natural, the kind a native speaker would actually say. Check
genders, plurals, stem changes and perfect forms against a dictionary you trust (Duden,
DWDS). Use standard German (Germany) spelling after the 1996/2006 reform (*dass*, *Straße*,
*Fluss*), and mention Austrian/Swiss variants only where useful. Keep the reading texts at
A1: short sentences, present tense (perfect after its lesson), common words.

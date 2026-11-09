# Question bank format

A bank is one UTF-8 JSON file. Import it from the Library screen, or write it in the built-in editor and use **Export** to save a copy.

```json
{
  "format": "examiner-bank",
  "version": 1,
  "id": "my-exam",
  "title": "My certification exam",
  "description": "Optional. Shown on the bank page.",
  "author": "Optional",
  "sections": [
    { "id": "part-1", "name": "Part 1" },
    { "id": "part-2", "name": "Part 2" }
  ],
  "exam": {
    "questionCount": 100,
    "timeLimitMinutes": 120,
    "passingPercent": 75,
    "sectionQuotas": { "part-1": 60, "part-2": 40 }
  },
  "questions": [
    {
      "id": "p1-001",
      "section": "part-1",
      "topic": "Topic name",
      "stem": "Question text. Line breaks are kept.",
      "choices": ["First", "Second", "Third", "Fourth"],
      "answer": [1],
      "explanation": "Optional. Shown in practice mode and in the results review."
    }
  ]
}
```

## Fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Bank name. |
| `id` | no | Letters, numbers, `-`, `_`. Made from the title if missing. Importing a bank with an existing id offers to replace it or keep both. |
| `sections` | no | Groups such as national and state portions. A question's `section` must match a section `id`; unknown ids are added automatically. |
| `exam.questionCount` | no | Questions drawn at random for each timed exam (default 50). Capped at the bank size. |
| `exam.timeLimitMinutes` | no | Default 60. Can be changed before each exam. |
| `exam.passingPercent` | no | Default 75. |
| `exam.sectionQuotas` | no | Fixed number of questions per section in each exam. Sections appear as separate blocks, in this order. Any remainder of `questionCount` is drawn from the whole bank. |
| `questions[].id` | no | Keep ids stable: progress tracking is keyed on them. |
| `questions[].topic` | no | Used for practice filters and weak-topic stats. Defaults to "General". |
| `questions[].stem` | yes | The question. |
| `questions[].choices` | yes | 2 to 8 strings. |
| `questions[].answer` | yes | Zero-based index of the correct choice, e.g. `[0]` for the first. List more than one for "select all that apply" questions, which are scored all-or-nothing. A bare number also works. |
| `questions[].explanation` | no | Why the answer is right. |

Answer choices are shuffled at run time unless the user turns that off, so don't write choices like "Both A and B". Use a multi-answer question instead.

## Other question types

`type` (default `"choice"`) picks how a question is answered. Every type keeps `choices` and `answer` so older readers can still list the questions. All are scored right or wrong as a whole; the review shows which parts were right.

| `type` | Fields | Notes |
|---|---|---|
| `"text"` | `accept`: one list of accepted answers per blank, e.g. `[["mitochondrion", "mitochondria"]]`; optional `caseSensitive: true`. `choices` and `answer` are `[]`. | Fill in the blank. Each `___` (three or more underscores) in the stem is a blank; with none, one answer box goes under the stem. Spacing, capital letters (unless `caseSensitive`), curly quotes, dashes and a final period are ignored; plain numbers compare by value (`0.50` = `.5`). |
| `"match"` | `left`: the items to match; `choices`: the answers (extra ones are distractors); `answer[i]`: the index in `choices` that matches `left[i]` (answers may repeat). | Each left item gets a drop-down, so `choices` are plain text. |
| `"label"` | `image` (required), `markers`: `[{ "x": 30, "y": 45 }, …]` in percent of the image's width and height from the top-left; `choices` and `answer` as for match, one per marker. | The app draws numbered markers on the picture. |
| `"order"` | `choices`: the items in the correct order; `answer`: `[]`. | Shown shuffled; the learner moves items up and down. |
| `"model"` | `model`: a math manipulative and how it starts; `target`: what counts as right. `choices` and `answer` are `[]`. | Answered by changing the model. See [Model questions](#model-questions). |

| `"order"` | `choices`: the items in the correct order; `answer`: `[]`; optional `dates`: one date per item (see Dates in [COURSE_FORMAT.md](COURSE_FORMAT.md#timelines)), oldest first. | Shown shuffled; the learner moves items up and down. With `dates` it's labeled "Put in time order" and the dates show after checking. |
| `"map"` | `map`: the map, written like a lesson's map block (see [Maps](COURSE_FORMAT.md#maps)), e.g. `"base: us"`. Then either `targets`: the place(s) to pick, e.g. `["Colorado"]` (`choices` and `answer` are `[]`), or `marks`: places to number, e.g. `["Brazil", "Peru"]`, with `choices`/`answer` as for label (if `choices` is left out, the marked names are the choices). | **Find** (`targets`): the learner clicks the place(s) on the map, or picks from a list (one place: a drop-down; several: checkboxes). Names never show before checking. Names compare like the map does (`CO` = `Colorado`, `USA` = `United States`). Picking a place that isn't a target makes the answer wrong. **Label** (`marks`): numbered markers on the map with a drop-down for each. |
| `"timeline"` | `slots`: dates, oldest first, e.g. `["44 BCE", "79 CE"]`; `choices`: the events (extra ones are distractors); `answer[i]`: the event that belongs at `slots[i]`; optional `timeline`: periods for context, in timeline block lines (`era: 27 BCE – 476 CE \| Empire`). | A small timeline shows numbered slots at their dates; each slot gets a drop-down of events. |

| `"code"` | `code`: language, starter code, tests, hints, model solution (see [Code exercises](COURSE_FORMAT.md#code-exercises)). `choices` and `answer` are `[]`. | The learner writes Python or JavaScript in an editor and runs the tests; the stem is Markdown. |
| `"build"` | `tiles`: the sentence's word tiles in the correct order; optional `distractors` (extra tiles), `accept` (other correct orders, each a list of tiles), `joiner`, `punctuation`, `prompt`. `choices` and `answer` are `[]`. | Sentence builder: the learner builds the sentence from shuffled tiles. See [Sentence builders](#sentence-builders). |

Any question can have `image`: `{ "src": "data:image/png;base64,…", "alt": "What the picture shows", "caption": "Optional" }`. `alt` is required. Use a `data:` URL (the desktop app doesn't load pictures from the web). The bank editor can add pictures and write every type.

## Sentence builders

The learner builds a sentence from word tiles (for language courses, or any ordering of words).

```json
{
  "id": "ja-build-1",
  "topic": "Sentences",
  "type": "build",
  "stem": "Build the sentence in Japanese.",
  "prompt": "I drink tea every morning.",
  "tiles": ["{私|わたし}は", "{毎朝|まいあさ}", "お{茶|ちゃ}を", "{飲|の}みます"],
  "distractors": ["{水|みず}を"],
  "accept": [["{毎朝|まいあさ}", "{私|わたし}は", "お{茶|ちゃ}を", "{飲|の}みます"]],
  "punctuation": "。",
  "choices": [],
  "answer": []
}
```

| Field | Required | Meaning |
|---|---|---|
| `tiles` | yes | The tiles in the correct order, at least two, with at least two different texts (up to 30). A tile can be several words and can hold furigana markup (`{漢字|かんじ}`). |
| `distractors` | no | Extra tiles that aren't in the sentence (up to 20). |
| `accept` | no | Other correct orders, each a list of tiles. Each must be built from `tiles` and `distractors` (each tile used at most once), so an alternative may leave a tile out or use a distractor. |
| `joiner` | no | What goes between tiles when the sentence is shown: `""` (no spaces) or `" "`. Default: `""` when the course language is Japanese (`ja`), Chinese or another language written without spaces (or the tiles are Japanese/Chinese), else `" "`. |
| `punctuation` | no | A mark added after the last tile, e.g. `"。"`, `"."` or `"?"` (up to 4 characters, no spaces). Don't put it on the last tile too. |
| `prompt` | no | The meaning of the sentence (e.g. the English), shown under the stem. |

- Tiles start in a shuffled bank that never reads as a correct sentence from left to right. The shuffle depends on the question and the session, so a resumed run looks the same. Selecting a tile adds it to the end of the sentence; selecting a placed tile sends it back. With the keyboard, tiles are buttons; in the sentence, Left/Right arrows move the focused tile, Home/End move it to the start or end, and Delete or Backspace sends it back. Tiles can also be dragged. Screen readers hear the sentence after each change.
- Graded all or nothing: the placed tiles must spell `tiles` or one of the `accept` orders. Grading compares the tiles' text (furigana and width differences ignored), so two tiles with the same text (two "die" tiles) are interchangeable. After checking, tiles in the wrong place are marked and the correct sentence is shown (the correct order closest to the learner's).
- The saved answer is the list of placed tiles (indices into `tiles` followed by `distractors`), so runs save and resume.
- Practice, quizzes and timed exams use sentence builders. Live rooms and community courses don't (live rooms use choice questions only; the community editor has no fields for them).
- The course checker reports: fewer than two tiles, an `accept` order that uses a tile not in the pool or repeats `tiles` or another order, a distractor that's also a tile, a tile ending with the `punctuation` mark, so many accepted orders that the tiles can't start out of order, a space `joiner` in a Japanese course, and furigana problems in Japanese courses.

**Capitals at the start.** The sentence's first letter is capitalized for display and ignored in grading, so write tiles in their mid-sentence case (`"die Fenster"`, `"bis Ende Mai"`; nouns and names keep their capitals). Then other correct orders that start with a different tile can be listed in `accept`.

## Model questions

The learner answers by using a math manipulative (the same models as lesson blocks; see "Math manipulatives" in [COURSE_FORMAT.md](COURSE_FORMAT.md#math-manipulatives) for every kind and its starting options).

```json
{
  "id": "mq-coins",
  "topic": "Money",
  "type": "model",
  "stem": "Make 68¢ using the fewest coins.",
  "choices": [],
  "answer": [],
  "model": { "kind": "coins" },
  "target": { "cents": 68, "fewest": true }
}
```

| Model `kind` | `target` | Right when |
|---|---|---|
| `counters` | `count`, or `colors: [red, yellow]` (needs `colors: 2` in the model) | That many counters (anywhere in the frames), or exactly that many of each color. |
| `blocks` | `value`; optional `fewest: true` | The blocks make the number in any way (34 tens and 7 ones is 347); with `fewest`, no place but the biggest may have 10 or more. |
| `numberline` | `at` (a number, or a fraction like `"3/4"`) | The marker is there. It must be a tick on the line. |
| `fractions` | `values`: one fraction per bar, from the first (`["3/4"]`); optional `exact: true` | Each listed bar shows an equal fraction (6/8 for 3/4); with `exact`, the same number of parts too. With `fixed` parts, each value must be possible. |
| `clock` | `time` `"h:mm"` | The hands show that time. The minutes must be a multiple of the model's `step`. |
| `coins` | `cents`; optional `fewest: true` | The coins add up to the amount; with `fewest`, using as few coins as possible from those offered. |

- The model starts as written in `model`; a question isn't answered until the learner changes it. The starting model can't already be right, and the target must be possible (the checker and the importer refuse both).
- `"readout": false` in the model hides the total beside it, so the learner can't just watch the number (good for reading a clock); screen readers then get a description of the pieces (where the hands point) instead of the total.
- After checking, a wrong answer shows the right answer in words and a picture of one right model. The saved answer is the model's state (a short list of numbers), so a run can be saved and resumed.
- The bank editor and community courses write model questions: pick the model, set how it starts, then set the right answer by changing the model.

Any question can have `audio`, which makes it a listening question: `{ "src": "data:audio/mpeg;base64,…", "text": "Was möchten Sie trinken?", "lang": "de-DE" }`. `src` is a recorded clip (mp3, m4a/aac, ogg/opus, wav, webm or flac as a `data:audio/…;base64` URL, up to 400 KB); without it, the device's voice speaks `text` in `lang` (in a course, `lang` defaults to the course language's voice). `text` is what is said: it's shown after the answer is checked (and in results), or straight away when the device can't play the sound, so always give it. The question shows **Listen** and **Listen slowly** buttons. A choice question with audio is "pick what you heard"; a `text` question with audio is dictation ("type what you hear", with the sentence in `accept`). Live rooms leave listening questions out. See COURSE_FORMAT.md for dialogues and speaking practice.

`honors: true` marks a question from an optional honors lesson: full exams leave it out, and practice includes it only when asked.

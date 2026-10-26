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

Any question can have `image`: `{ "src": "data:image/png;base64,…", "alt": "What the picture shows", "caption": "Optional" }`. `alt` is required. Use a `data:` URL (the desktop app doesn't load pictures from the web). The bank editor can add pictures and write every type.

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

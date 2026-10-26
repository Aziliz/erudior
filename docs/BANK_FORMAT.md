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
| `"code"` | `code`: language, starter code, tests, hints, model solution (see [Code exercises](COURSE_FORMAT.md#code-exercises)). `choices` and `answer` are `[]`. | The learner writes Python or JavaScript in an editor and runs the tests; the stem is Markdown. |

Any question can have `image`: `{ "src": "data:image/png;base64,…", "alt": "What the picture shows", "caption": "Optional" }`. `alt` is required. Use a `data:` URL (the desktop app doesn't load pictures from the web). The bank editor can add pictures and write every type.

`honors: true` marks a question from an optional honors lesson: full exams leave it out, and practice includes it only when asked.

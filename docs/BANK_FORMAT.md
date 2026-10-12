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

# Course format

A course is one UTF-8 JSON file holding everything for one subject: lessons, question banks, notecard decks, a glossary, quick-reference sheets and math drill templates. Import it from the Library. Courses never share questions, topics or progress with each other.

```json
{
  "format": "examiner-course",
  "version": 1,
  "id": "my-course",
  "title": "My course",
  "description": "Shown in the Library.",
  "modules": [{ "id": "m1", "title": "Foundations" }],
  "lessons": [],
  "banks": [],
  "decks": [],
  "glossary": [],
  "references": [],
  "drills": []
}
```

Every section is optional except `title`. Ids must use letters, numbers, `-` and `_`. Keep ids stable between versions of a course file, because progress (completed lessons, card schedules, question stats) is keyed on them.

## Lessons

```json
{
  "id": "agency-1",
  "module": "m1",
  "title": "Brokerage relationships",
  "minutes": 20,
  "topics": ["Agency"],
  "quiz": ["q-012", "q-047", "q-103"],
  "body": "## Heading\n\nMarkdown text. [[Transaction broker]] links to the glossary; [[term|shown text]] changes the link text."
}
```

- `body` is Markdown (GitHub-flavored, so tables work). Block quotes render as call-out boxes, which suit exam tips.
- `topics` connects the lesson to question and notecard topics. The lesson page offers "practice questions on this" and "flip related notecards" for them, and the planner uses the topics of lessons you've finished to choose practice questions.
- `quiz` (optional) lists question ids from the course's first bank, in order. The lesson ends with that quiz: answers and explanations show as you go, every question is scored, and getting 70% (rounded up) marks the lesson complete. Lessons with a quiz can't be checked off by hand. Ids that aren't in the bank are skipped.

## Question banks

Same as a standalone bank (see [BANK_FORMAT.md](BANK_FORMAT.md)), placed in the `banks` array. The `format` and `version` fields can be left out inside a course.

## Notecard decks

```json
{
  "id": "agency-cards",
  "title": "Agency",
  "description": "Optional",
  "cards": [{ "id": "c1", "front": "Prompt", "back": "Answer", "topic": "Agency" }]
}
```

Fronts and backs are Markdown and can use `[[glossary]]` links.

## Glossary

```json
{ "term": "Earnest money", "definition": "Deposit made by a buyer…", "aliases": ["EM"], "topic": "Contracts" }
```

## Quick-reference sheets

```json
{ "id": "formulas", "title": "Math formulas", "body": "Markdown, usually tables." }
```

Sheets print cleanly from the app.

## Math drills

A drill is a problem template. Each run picks random inputs, computes the answer, and fills both into the text.

```json
{
  "id": "commission-split",
  "title": "Commission split",
  "topic": "Commission",
  "vars": {
    "price": { "min": 250000, "max": 900000, "step": 5000 },
    "rate": { "choices": [5, 5.5, 6] }
  },
  "calc": {
    "total": "price * rate / 100",
    "half": "round(total / 2, 2)"
  },
  "prompt": "A home sells for {price:money0} at {rate}%, split evenly. What does each brokerage get?",
  "answer": "half",
  "format": "money",
  "tolerance": 0.01,
  "solution": "{price:money0} × {rate}% = {total:money}, so each side gets **{half:money}**."
}
```

- `vars`: `{min, max, step}` for a number in a range, or `{choices: [...]}` to pick one value (numbers or text).
- `calc`: evaluated top to bottom; each can use any var or earlier calc. Operators `+ - * / ^` and parentheses; functions `round(x, digits)`, `floor`, `ceil`, `abs`, `min`, `max`, `sqrt`.
- `answer`: the name of the value the user must type.
- `format`: `money` (to the cent), `money0` (whole dollars), `percent`, `number` or `integer`. Sets the default tolerance: 0.01, 1, 0.01, 0.01, 0.
- Placeholders: `{name}` or `{name:format}` with formats `money`, `money0`, `percent`, `pct1`, `int`, `num1`, `num2`, `num4`.

The course editor validates drills and shows a live sample as you type.

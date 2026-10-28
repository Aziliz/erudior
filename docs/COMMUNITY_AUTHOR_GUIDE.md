# Creating Community Courses in Erudior

Open **Community → Create a course** and sign in. New courses start as private drafts and save automatically. Publish makes a version public and labels it **Not reviewed** until it passes independent review.

## Course setup
In **About**, enter a descriptive title and summary, choose subject, level and Course/Exam prep. Choose the calculator only when the course needs one. In **Modules**, group lessons into teaching units. Open **Lessons**; the **Module** selector appears above the blocks under Lesson settings. Use it to move a lesson. If your course has only one implicit module, the first organization action makes that module explicit.

## Building a lesson
Choose **Add a block**:
- **Heading:** Section or subsection title.
- **Text:** Normal paragraphs using Markdown. For bold use `**bold**`, for italics `*italic*`, for links `[label](https://example.com)`.
- **List:** One item per line, optionally numbered.
- **Image:** Upload PNG, JPEG, WebP or GIF through the image picker. Add meaningful alt text and a caption. Do not publish photos or personal information about students.
- **Question:** Choose multiple choice, free text, matching, ordering, image labeling or math model. Supply the correct answers and an explanation.
- **Worked example / tip / rule / formula:** Use the dedicated blocks.
- **Diagram:** Enter Mermaid source; add an accessible title and description.
- **Math model:** Choose counters, blocks, number line, fraction bars, clock or coins.
- **Advanced lesson source:** Paste official lesson Markdown, including specialized fenced blocks for phonics, maps, timelines, simulations, dialogue, speech, runnable code and assignments. See `docs/COURSE_FORMAT.md` for syntax and support limitations; preview before publishing.

### Table example
In a **Text** block, paste:

```markdown
| Shape | Sides |
|---|---:|
| Triangle | 3 |
| Square | 4 |
```

### More Markdown examples
```markdown
## Counting
**Say the number**, then count the objects.

1. Point to each object.
2. Count aloud.

> **Remember:** Each object gets counted once.
```

### Mathematics
Inline: `$2+3=5$`. Display: `$$a^2+b^2=c^2$$`.

### Advanced feature example (interactive phonics)
Add an **Advanced lesson source** block:
````markdown
```trace
letters: A a B b
```
````

See the official course format guide for other fences and their parameters. Unlike regular text, advanced source is intended for power users and should be checked against the lesson preview.

## Quizzes, reference material and review
Add module-end quizzes from **Modules**. Add notecards in **Cards**, terms in **Glossary**, worksheets in **References**, and generated practice in **Drills**. Preview each lesson, check the answer key and ensure images have alt text. A published community course is **not an official Erudior course** automatically.

## Publishing checklist
- Every module has at least one lesson; at least one lesson is non-honors.
- No empty lesson blocks or broken references.
- Questions have valid answers and feedback.
- Content is accurate and accessible.
- Images, external resources and quotations may legally be published.
- Go to **Publish**, fix validation errors, and publish. Revisions remain draft until you publish a new version.

## Audio and books in the reader
Open **About → Recorded audio and built-in reading texts**. These advanced fields use JSON, with **Apply resource changes** to save valid JSON into your draft. The Publish screen validates the structure.

For spoken overrides or phonics, enter an audio object:
```json
{ "sound:m": "say:mmm", "Good morning": "say:Good morning" }
```
Recorded audio may use embedded `data:audio/mpeg;base64,…` values; the file must be appropriately licensed and within the community course size limits. These fields are not a direct audio-file uploader yet.

For a short reader text:
```json
[
  {
    "id": "story1",
    "title": "A Short Story",
    "kind": "prose",
    "source": "Original text by the author",
    "sections": [{ "id": "part1", "title": "Part One", "body": "Once upon a time…" }]
  }
]
```
Choose `kind` from `prose`, `poem`, `play` or `document`. Poems and plays can use line numbering; source and copyright attribution are important. Do not paste copyrighted books without permission. Every section needs a unique ID and nonempty body. Preview the Reader after publishing and installing the course.

# Creating Community Courses in Erudior

Community authoring takes place in the application. The public discovery website does not offer learner or teacher accounts. New community courses begin as drafts. Publishing produces a version labelled **Not reviewed**, not an official course.

## Organizing a legacy block draft

In **About**, enter the title, summary, subject, level and course type. **Modules** groups lessons into teaching units. A course without explicit modules already has one implicit unit; **Add a module** makes that unit explicit and adds one new unit. Existing lessons retain their original unit.

Use each module's lesson selector, or the visible **Module** selector in **Lessons**, to move a lesson. Up and Down change order without changing stable IDs or membership. **Add lesson to this module** adds one lesson to the selected unit.

**Delete module** first shows an inline confirmation. Its lessons move to the first remaining unit (or the implicit course unit when deleting the last explicit module). The confirmation also tells you how many module quiz questions will be removed. Cancel leaves the draft unchanged. Assessed-work and reader-question dependencies must be moved or unlinked first.

**Delete lesson** also requires inline confirmation. Linked vocabulary, reading questions, assessed-work links and engine activities must be moved or unlinked first. Keep at least one lesson. Draft deletion does not change already published course versions.

## Lesson blocks

- **Heading**, **Text**, and **List** provide structured prose. Text supports Markdown headings, emphasis, tables, links and mathematics.
- **Image** requires meaningful alt text and material you have permission to publish. Do not include students' personal information.
- **Question** supports the question types offered by the editor, with answers and explanations.
- **Worked example**, **Tip/rule**, **Formula**, **Diagram**, and **Math model** provide structured instructional blocks.
- The dedicated reading, assessed-work, spreadsheet, branching, scientific and advanced-assessment editors preserve typed references and apply their own validation.

For a table in a Text block:

```markdown
| Shape | Sides |
|---|---:|
| Triangle | 3 |
| Square | 4 |
```

Use `**bold**`, `*italic*`, `[link](https://example.com)`, inline `$2+3=5$`, or display `$$a^2+b^2=c^2$$` as appropriate. Do not use arbitrary source blocks to bypass typed resource validation.

## Canonical full-course authoring

Canonical drafts have one authoritative full-course payload. Use **Edit full course** for modules, lessons and supported resource editors; question-bank and notecard editors are available separately. Imported source IDs and revisions are retained. The source payload is not replaced by installed community runtime IDs.

The full-course editor blocks module deletion while lessons or assessed work depend on it. Move those items before confirming removal. It also protects lesson-linked engine activities and vocabulary. Save the full course before leaving the editor.

## Save, preview and publish

Wait for **saved** before leaving a legacy draft. A failed save remains visible and can be retried; newer edits cannot be marked saved by an older request. Preview the lesson and resolve validation errors on **Publish**. Publishing a new revision does not replace older immutable published versions or make the course official.

Review content accuracy, accessibility and rights through the appropriate human process. This guide describes the controls; it is not evidence that a course has passed review or that every authoring tool has completed the separate roadmap acceptance suite.

See [course format](COURSE_FORMAT.md) and [community status](COMMUNITY_PARITY_STATUS.md) for supported formats and validation boundaries.

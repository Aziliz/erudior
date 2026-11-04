/** Shared, inert help content. Examples are validated in community-author-guide.test.mts. */
export const AUTHOR_GUIDE_EXAMPLES = {
  table: '| Shape | Sides |\n|---|---:|\n| Triangle | 3 |\n| Square | 4 |',
  formula: 'a^2 + b^2 = c^2',
  diagram: 'flowchart LR\n  A[Observe] --> B[Compare]\n  B --> C[Explain]',
  markdown: '## Compare shapes\n\nA **triangle** has three sides. Explain your reasoning.\n\n| Shape | Sides |\n|---|---:|\n| Triangle | 3 |\n| Square | 4 |\n\nThe total is $3+4=7$.',
} as const;
export type AuthorGuideSection = { id: string; title: string; summary: string; steps: string[]; example?: { label: string; text: string }; caution?: string };
export const AUTHOR_GUIDE_SECTIONS: readonly AuthorGuideSection[] = [
  {id:'start',title:'Start and choose an editor',summary:'Community authoring is in the app. Reading public learning does not require an author account.',steps:[
    'Open Create in the app. Authoring requires the sign-in and adult/terms steps shown there. Read the current terms yourself before accepting; this guide does not accept or change them.',
    'Choose a clear factual subject, audience and learning goal. Enter the course title, description and classifications. Use original material or material you have permission to publish; credit sources.',
    'A legacy draft uses lesson blocks and tabs such as About, Modules and Lessons. A canonical draft says “Canonical community course” and offers Edit full course, question banks and notecard decks.',
    'Opening or searching this guide does not modify, save, migrate or publish your draft. Close it to continue editing.'],caution:'Never include learners’ personal information, identifying photos, addresses or private assessment records in public course content.'},
  {id:'structure',title:'Modules and lessons',summary:'Organize content without breaking stable IDs or linked activities.',steps:[
    'In a legacy draft, Modules → Add a module makes the original implicit unit explicit before adding the new unit. Add lesson to this module targets that unit. Use the lesson’s Module selector to move it.',
    'Up and Down reorder modules or lessons without renaming their IDs. Rename a title, not a referenced ID. Deleting a lesson requires confirmation and at least one lesson must remain.',
    'Legacy Delete module keeps its lessons and moves them to the first remaining unit (or the implicit unit). Its inline confirmation tells you about any module quiz removal. Cancel makes no change.',
    'Canonical Edit full course has module and lesson controls. Module removal is blocked while lessons or assessed work still reference it. Move them first. Linked vocabulary, reading questions or engine activities can also block lesson deletion.',
    'Preview after reorganizing, save, and reopen the draft to confirm order and attachments. Editing a draft does not alter an already published version.']},
  {id:'text',title:'Headings, text and tables',summary:'Use readable structure, Markdown and short worked examples.',steps:[
    'Legacy Lessons → choose a lesson → add Heading. Use Section for a main heading and Subsection for a nested heading. Add Text for paragraphs; a blank line starts a new paragraph.',
    'Text supports **bold**, *italic*, links, Markdown tables, math and [[term]] references to entries you create in Glossary. Do not rely on color alone to explain an answer.',
    'Paste the table below into a Text block, not into a Heading or Formula. Keep the separator row. For narrow screens, keep tables compact and explain the same information in prose.',
    'List takes one item per line and can be numbered. Worked example accepts a title and Markdown problem/solution. Tip or rule box has Tip, Warning and Rule or theorem styles.',
    'Canonical Edit full course → Lessons uses Lesson text (Markdown), with Write and Preview. The same basic Markdown works there. Preview is not a save.'],example:{label:'Text block: Markdown table',text:AUTHOR_GUIDE_EXAMPLES.table}},
  {id:'media',title:'Images and accessible media',summary:'Use permitted assets and descriptions that convey the learning point.',steps:[
    'Legacy Image uses the file picker for PNG, JPEG, WebP or GIF. Wait for upload success before publishing. Add Description for people who can’t see it (alt text); Caption is optional and does not replace alt text.',
    'Describe the relevant information, not merely “image”. For example: “Triangle with three equal sides, each labelled 4 cm.” Do not put the only explanation in an image.',
    'Question images and labelled-picture questions also need descriptions. When the image is needed to answer, provide a meaningful equivalent and test the learner view.',
    'Canonical assets and advanced lesson source must pass the supported asset validator. Use supported uploaded/portable assets; arbitrary URLs, scripts and source formats are not a way around validation.'],caution:'An upload does not grant copyright permission or make student photos appropriate for public publication.'},
  {id:'visuals',title:'Formulas, diagrams and models',summary:'Choose the supported tool and test both its visual and text explanation.',steps:[
    'Formula accepts TeX without surrounding dollar signs. For inline math inside Text, use $...$; for display math in Text, use $$...$$.',
    'Diagram accepts Mermaid source without Markdown fences. Give it a Title and “What it shows, for people who can’t see it”. Use Preview to check rendering; explain the diagram in prose too.',
    'Graph or drawing accepts the supported figure JSON shown by its editor. Invalid JSON/specification displays an error. Follow the course-format reference rather than inventing a new drawing schema.',
    'Math model to play with supports counters, base-ten blocks, number lines, fractions, clocks and US-denomination coins. Choose Model, configure its start and try the learner controls. A lesson model is exploration; use a model Question when you need a checked target.',
    'Do not paste HTML scripts or arbitrary source blocks to bypass the typed editors.'],example:{label:'Diagram source (no fences)',text:AUTHOR_GUIDE_EXAMPLES.diagram}},
  {id:'questions',title:'Questions and module quizzes',summary:'Write an answerable prompt, accepted answers and an explanation.',steps:[
    'Legacy Question offers Multiple choice, Type the answer, Match, Label a picture, Put in order and Math model. Changing type preserves the prompt/explanation but can reset answer-specific fields; recheck them.',
    'For multiple choice, enter each choice and mark every correct answer. For typed answers, define accepted answers for each blank. For matching/labels, verify each pair or marker. Put ordered items in their correct order; learners see them shuffled.',
    'Model questions require a starting model and a valid target. Test a wrong answer and the intended answer. A question’s explanation should teach why the answer works.',
    'Modules can contain end-of-module quiz questions. Their quiz unlocks when the required lessons are complete. Lesson questions and module quizzes are not an instructor’s approval of submitted work.',
    'Canonical drafts use separate Edit question bank and Edit notecard deck controls; save in each editor before Done. Use the offered fields and validators rather than importing runtime review metadata.']},
  {id:'resources',title:'Resources and engine activities',summary:'Create typed resources, then attach them to valid lessons.',steps:[
    'Use Notecards, Glossary, Reference sheets and Drills for their supported resources. Language and reading manages vocabulary; Reading library manages texts/sections and valid question links.',
    'Reading library accepts local UTF-8 TXT/Markdown files with a bounded plain-text preview. Add as a new text or append a new section; existing text and section IDs are not replaced. PDF, Word and HTML conversion is not supported. Record source/rights attribution and cancel a preview to leave the draft unchanged.',
    'Canonical Edit full course → Metadata & audio offers recorded audio upload, a clip selector and explicit preview controls. No recording plays automatically. Save or cancel a pending upload first. Legacy drafts must migrate to the canonical editor to add audio files; their published versions stay unchanged.',
    'Writing prompts and lab introductions accept local TXT/Markdown file previews with explicit replacement. If the destination changes, choose the file again. Preview selected resource is a read-only literal-text overview, not a learner submission or grade.',
    'Writing, labs and activities manages rubrics and assessed work. Create the resource before attaching its link to a lesson. Removing a link is different from removing its resource or learner evidence.',
    'Spreadsheets, Scenarios, Science and Assessment have dedicated editors. Select the intended lesson, set IDs/revisions and complete required fields. Apply or cancel pending activity edits before saving or switching away.',
    'Preview and validate the exact source. Spreadsheet publication approval must match the exact supported source revision; editing it can invalidate the approval. Never invent approval receipts or lower release checks.',
    'Lesson links can open matching local assignments or show an explicit adult handoff. Publishing a course does not silently approve an assignment, authenticate an instructor, create a credential or migrate historical learner evidence.'],caution:'Scientific and regulated-work simulations are educational models, not real equipment control, legal advice, accreditation or professional certification.'},
  {id:'canonical',title:'Canonical source and migration',summary:'Keep authoring source separate from installed runtime copies.',steps:[
    'Migrate to full canonical editor is one-way for that legacy draft after confirmation. Save first. Existing published versions stay unchanged; migration is not an official-course promotion.',
    'Edit full course opens the shared course editor. Use its structured resource tools and lesson Markdown. Save course, then Done. Edit question banks/decks separately and save their changes too.',
    'Download original authoring payload exports the canonical source, including source IDs and revision. Import canonical authoring file expects that validated authoring envelope, not an arbitrary installed course JSON file. Import replaces the current canonical payload after validation; export a saved copy first.',
    'Keep stable IDs and increment revisions where required when changing published resources. Installed community courses use runtime IDs/community version and provenance; they do not replace the original source payload.',
    'Advanced lesson syntax must match the course-format specification. Unknown typed references, invalid assets and unsupported payload fields can block saving/publishing. Do not remove validators to make an import pass.']},
  {id:'save',title:'Save, reopen and recover',summary:'Confirm persistence before leaving or publishing.',steps:[
    'Legacy drafts autosave, but wait for All changes saved or use Save draft. Unsaved changes, Saving… and Not saved are different states. A failed request must not be treated as saved.',
    'If saving fails, keep the editor open, check the error, restore connectivity and retry Save draft. Finish or cancel pending activity changes first. Reopen after a successful save to verify the intended content.',
    'Canonical editors save explicitly. Use Save course or the bank/deck save control, then Done. Done may offer to discard unsaved edits; do not discard work you intend to keep. At the listing screen use Save listing draft for description/classification changes.',
    'Do not close/reload to clear an error before preserving your work. Navigation protection cannot guarantee recovery after a browser/process crash. A canonical authoring download from the listing represents the saved payload, not unsaved text still inside a nested editor.',
    'Publishing has separate validation and a separate server request. A saved draft is not necessarily publishable, and a preview is not a saved or published revision.']},
  {id:'publish',title:'Publish, install and update',summary:'Publication is public and versioned, not official-course approval.',steps:[
    'Preview every lesson, question and activity. On Publish, resolve every reported problem. Check media descriptions, answer keys, linked resource IDs/revisions and rights before submitting.',
    'Legacy Publish saves first, then publishes. Canonical Publish canonical version N validates and saves the listing/source before publication. Wait for the successful version message; repeated clicks are not a recovery strategy.',
    'Every new community version is Not reviewed until the separate review process acts. Community review is distinct from official-course signing and approval; authoring tests prove controls, not content accuracy or learner outcomes.',
    'Open the published community listing in the app and add its course through the offered action. Reopen the installed course and test lesson order, media, questions and activities. Check its community version and review label; the installed copy is separate from your source.',
    'Later edits remain drafts until you publish again. Older published versions are immutable. Unpublish removes discovery, not copies already installed by learners. A taken-down course is read-only until restored by authorized review.']},
  {id:'checklist',title:'End-to-end author checklist',summary:'Follow a small complete lesson before scaling up.',steps:[
    'Create an original draft, set a meaningful description and choose your intended editor. Add a module and a lesson with a clear title.',
    'Add a heading and the table example, explain it in prose, then add a diagram with a title/description and a model with a useful starting state.',
    'Add a question, answer and explanation. Preview the learner experience using the keyboard and a narrow viewport. Check images, math, tables and diagrams without relying only on color.',
    'Save and reopen. Confirm text, IDs, module assignment and resource links survived. Test Cancel before committing a destructive action.',
    'Resolve publication validation. Publish only when you intend public release under the current terms. Check the new version label, install the published course and repeat the learner checks.',
    'For an update, change the draft, satisfy revision/approval requirements, publish a new version and confirm existing historical results are not rewritten. Synthetic acceptance tests are not an independent content review.']},
  {id:'troubleshooting',title:'Troubleshooting and boundaries',summary:'Use the actual error and preserve evidence; never bypass a gate.',steps:[
    'Cannot delete? Move or unlink dependent lessons, vocabulary, reading questions or engine activities first. Read the confirmation: legacy and canonical module deletion intentionally differ.',
    'Cannot save/publish? Read the validation list and check required titles/content, image alt text, question answers, linked IDs, revision rules and document limits. Large assets/content may need reducing.',
    'A diagram/model looks wrong? Verify source in the matching tool, test the learner preview and provide a text explanation. Successful JSON parsing alone does not prove educational correctness.',
    'Publishing/uploading failed? Keep the draft and inspect the error. If the result is uncertain, check the published version before trying again; do not assume the request failed just because a response was lost.',
    'Author/editor permissions, moderation and official publication are separate controls. This guide does not grant access, waive licensing terms, approve source material or switch on disabled institutional services.']},
];
export function searchAuthorGuide(query: string): readonly AuthorGuideSection[] {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return AUTHOR_GUIDE_SECTIONS.filter(section => { const text = [section.title,section.summary,...section.steps,section.example?.text,section.caution].join(' ').toLocaleLowerCase(); return words.every(word => text.includes(word)); });
}
export function authorGuideMarkdown(): string {
  return '# Creating Community Courses in Erudior\n\nThis guide is also available inside both community editors. The current terms and validation controls remain authoritative.\n\n' + AUTHOR_GUIDE_SECTIONS.map(s=>`## ${s.title}\n\n${s.summary}\n\n${s.steps.map((step,i)=>`${i+1}. ${step}`).join('\n\n')}${s.example?`\n\n${s.example.label}:\n\n\`\`\`text\n${s.example.text}\n\`\`\``:''}${s.caution?`\n\n**Important:** ${s.caution}`:''}`).join('\n\n') + '\n\nSee [course format](COURSE_FORMAT.md) and [community status](COMMUNITY_PARITY_STATUS.md) for format and validation details.\n';
}

# Colorado Real Estate Broker course — content spec

You are writing part of a study course for someone starting Colorado real estate broker pre-licensing (the 168-hour program) and preparing for the PSI Colorado broker exam. The content is loaded into a study app ("Examiner"). Accuracy matters more than volume: a wrong fact taught here costs the student points on the real exam.

## The exam (PSI Colorado candidate bulletin)
- National portion: 80 scored questions, 120 minutes, pass = 60 correct (75%).
- State portion: 74 scored questions, 110 minutes, pass = 53 correct.
- National outline weights: Property Ownership 10%, Land Use Controls 5%, Valuation 8%, Financing 9%, Contracts 19%, Agency 13%, Property Disclosures 7%, Property Management 5%, Transfer of Title 6%, Practice of Real Estate 12%, Real Estate Calculations 6%.
- State outline items (of 74): Commission duties/powers 2, Licensing requirements 5, Activities of licensees 11, Additional topics (property mgmt/landlord-tenant, water rights & well ownership change, Colorado taxes, Colorado Fair Housing Act, Foreclosure Protection Act & processes) 7, Colorado forms & contracts 23, Record keeping & trust accounts 5, Closing & settlement 10, Brokerage relationships 11.
- Colorado has a single license level for new licensees: "broker" (associate broker / employing broker are statuses). There are no "salespersons" in Colorado — never use that term for Colorado.

## Accuracy rules
1. Colorado-specific facts (statutes C.R.S. Title 12 Article 10, Colorado Real Estate Commission rules, Commission-approved forms, deadlines, dollar amounts, protected classes, landlord-tenant rules) MUST be checked against a primary or authoritative source with WebSearch/WebFetch (dre.colorado.gov, leg.colorado.gov, Colorado Real Estate Manual, colorado.public.law for C.R.S., Commission-approved forms). If research notes are provided to you in /home/claude/content/research/, use them first. If you cannot verify a Colorado fact, leave it out rather than guess.
2. Avoid volatile numbers that change yearly (property tax assessment rates, FHA MIP percentages, loan limits, current interest rates, fees). Teach the concept instead. Stable rules (e.g. "Colorado uses public trustee foreclosure") are fine.
3. Don't cite Commission rule numbers unless verified (they were renumbered). Citing statutes by section is fine when verified.
4. National content: standard real estate principles as tested on PSI national exams. Where states differ, say "in many states" or give the Colorado rule.
5. Write everything in your own words. Don't copy text from websites, textbooks or prep courses.

## Style
- Plain, direct, exam-focused. Second person is fine ("You'll see…").
- Lessons: Markdown. Use `##` and `###` headings, short paragraphs, bullet lists, tables for comparisons, and `> **Exam tip:** …` call-outs for traps the exam likes. 700–1,600 words per lesson. Link glossary terms with `[[Term]]` (exact glossary term or an alias, case-insensitive) — link a term the first time it appears in a lesson, not every time. Every `[[Term]]` you use MUST exist in your own glossary output (other writers cover other topics; duplicates across writers are merged later, so define any term you link).
- Questions: PSI style. One best answer, four choices (A–D), plausible distractors, no "all of the above"/"none of the above"/"both A and B" (choices get shuffled). Mix recall, application scenarios ("A broker … What should she do?"), and a few calculations where relevant. Every question has a 1–3 sentence explanation that says why the right answer is right and, where useful, why a tempting wrong answer is wrong. Avoid trick wording and negatives; if you use NOT/EXCEPT, capitalize it, and keep those under 10%.
- Notecards: front = a short prompt; back = a crisp answer (1–3 lines). Facts, definitions, numbers, deadlines, distinctions.
- Glossary: term + 1–2 sentence definition in plain language. Aliases for common abbreviations.

## Output format
Write ONE JSON file to the path you're given, UTF-8, valid JSON (no comments, no trailing commas). Shape:

```json
{
  "lessons": [
    { "id": "kebab-id", "module": "<module id given to you>", "title": "…", "minutes": 20, "topics": ["Topic A"], "body": "markdown…" }
  ],
  "questions": [
    { "id": "<prefix>-001", "section": "national|state", "topic": "Topic A", "stem": "…", "choices": ["…","…","…","…"], "answer": [2], "explanation": "…" }
  ],
  "cards": [
    { "id": "<prefix>-c001", "front": "…", "back": "…", "topic": "Topic A" }
  ],
  "glossary": [
    { "term": "…", "definition": "…", "aliases": ["…"] }
  ]
}
```

- `answer` is the zero-based index of the correct choice. Spread correct answers across positions roughly evenly.
- `topics` on lessons and `topic` on questions/cards must use the exact topic names you are assigned, so lessons link to their practice questions.
- Use the id prefix you are given for questions and cards, numbered from 001.
- Before finishing, re-read your file: validate it parses (`python3 -c "import json;json.load(open('PATH'))"`), check the answer index of every question against its explanation, and check that every [[link]] matches a term or alias in your own glossary.

Finish by replying with: counts (lessons, questions, cards, glossary terms), any facts you could not verify and left out, and anything a reviewer should double-check.

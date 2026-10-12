# Reviewer instructions

You are an independent fact-checker and editor for part of a Colorado real estate broker exam course. Another writer produced the file(s) you're given. Read /home/claude/content/SPEC.md for the format and rules. Research notes from the writers are in /home/claude/content/research/ (useful leads, but verify claims yourself; don't trust them blindly).

Do all of the following, editing the JSON file(s) in place (keep every id unchanged, keep valid JSON):

1. **Fact-check.** Check every question (stem, keyed answer, explanation), every notecard, and the factual claims in the lessons. For Colorado-specific claims, verify against primary sources with WebSearch/WebFetch: colorado.public.law or leg.colorado.gov (C.R.S.), law.cornell.edu's copy of 4 CCR 725-1 (Commission rules), dre.colorado.gov (Division pages, position statements, approved forms, Colorado Real Estate Manual). For federal claims use the agency source (hud.gov, consumerfinance.gov / ecfr.gov, epa.gov, fcc.gov/ftc.gov). Fix anything wrong. If something can't be verified and isn't standard textbook knowledge, soften it or remove it. If a question's premise is shaky, rewrite the question.
2. **One best answer.** Make sure each question has exactly one defensible answer and no distractor is arguably also correct under Colorado law.
3. **Remove the length giveaway.** Test-takers learn that the longest choice is usually right. Rewrite choices so the correct answer is the longest choice in at most about 30% of the questions in each file: make distractors similarly specific and similar in length, or tighten the correct answer. Keep distractors plausible but clearly wrong to someone who knows the material. Don't change which index is correct unless needed. Verify with a script afterwards.
4. **Consistency.** Lesson, cards, questions and glossary in your file should agree with each other.
5. Validate: the file parses, answer indices match explanations, every [[link]] in lessons resolves to a term or alias in that file's glossary.

Finish by replying with a concise change log: facts corrected (old → new, with source), items removed or softened, the before/after longest-correct counts, and anything still uncertain that a human should check.

# Round 2 review: de3-m4 (Society and the world)

Reviewer for item 165. Scope: honors lessons 20h1 and 20h2, round 2 additions to lessons 16–20
(identified by diffing against the round 1 build `samples/languages-drafts/lang-german-b1-m4.json`),
`questions/r2-de3-m4.yaml` (53), `vocab-r2-de3-m4.yaml` (38), `glossary-r2-de3-m4.yaml` (2),
`cards-r2-de3-m4.yaml` (23), `images/de3-m4-*` (9 files). No drills (language course).

## Changes

### Answer key
- **de3-m4-r2-q15** (text, -bar adjectives): second blank accepted only `unlesbar`; a learner who
  types the equally correct `nicht lesbar` was marked wrong. Added `nicht lesbar`.
- **de3-m4-r2-h28** (text, "serious" = not joking): accepted only `ernst`; `ernsthaft` is also
  correct (*Meinst du das ernsthaft?*). Added it.
- **de3-m4-r2-h20** (match, certainty adverbs): *offenbar* → "evidently" and *anscheinend* →
  "apparently" were ambiguous, since the lesson itself glosses *offenbar* as "evidently, apparently".
  Answers now read "evidently (the evidence is clear)" and "apparently (it seems so)", matching the
  lesson's table.

### Factual / grammar fixes
- **20h2, Example 1, step 5**: said *wollen* is wrong for the mayor's denial "because he is not
  claiming anything about himself". A denial *is* a claim about oneself, and *Der Bürgermeister will
  kein Geld genommen haben* is exactly the claim-*wollen* the lesson teaches (same pattern as
  *Der Fahrer will das Rotlicht nicht gesehen haben*). Rewrote: report it neutrally with
  *bestreiten*, or with *wollen* + perfect infinitive if you want to signal doubt.
- **20h1, "Four more ways" table**: listed bare *Das Problem ist zu lösen* under "it can be done",
  while the same lesson (and lesson 18) says that without *leicht/schwer/nur/kaum* *sein + zu* means
  "must". Changed to *Das Problem ist (leicht) zu lösen*, as in the lesson's own card, and softened
  "means must" to "usually means must" (*sein + zu* is genuinely ambiguous; context decides, cf.
  lesson 18's *Das ist nicht zu ändern*). Card "Der Antrag ist online zu stellen" softened the same way.
- **20h1, note under the flowchart**: the text describes the Bundesrat's objection before the
  mediation committee. Under Art. 77(2)–(3) GG, for a law that does not need its consent the
  Bundesrat can only lodge an objection after the mediation committee procedure. Added this to the
  "simplified" note. Source: https://www.gesetze-im-internet.de/gg/art_77.html
- **20h1, pointer to lesson 27**: said lesson 27 teaches *lassen* "in its other meaning"; lesson 27
  in fact also teaches *sich lassen* (*Das Fenster lässt sich nicht öffnen*). Now says lesson 27 comes
  back to *sich lassen* and teaches the other meanings.
- **20h2, public broadcasting**: "a fee that every household pays" → "a fee charged per household
  (… some people, for example those on certain benefits, are exempt)". Source:
  Rundfunkbeitragsstaatsvertrag § 2 (per Wohnung) and § 4 (exemptions).
- **Lesson 18 (r2 sentence introducing the signs)**: *Eltern haften für ihre Kinder* was glossed
  "parents are liable for their children" with no comment; the sign overstates the law (BGB § 832:
  liability only for breach of the duty to supervise). Added a short clause saying so. Source:
  https://www.gesetze-im-internet.de/bgb/__832.html

### Other fixes
- **vocab de3-m4-r2-w26 (die Zensur)**: note said the plural *Zensuren* is "an older word for school
  marks"; the singular *die Zensur* also means a school mark. Reworded.

### Pictures
None needed. All 5 pictures and 4 blanks rendered: text readable, nothing cut off or overlapping;
every label marker (q04, q07, q17, q21) sits on the part its label names.

## Checked and found right (a reader might doubt)
- Art. 76(2) GG quoted exactly (*Vorlagen der Bundesregierung sind zunächst dem Bundesrat
  zuzuleiten*), six-week comment period; Art. 82: countersignature before the President's
  *Ausfertigung*, entry into force on the 14th day after the Bundesgesetzblatt issue if no date is set;
  Bundesgesetzblatt electronic-only since 1 January 2023; Art. 79(2) two-thirds in both chambers;
  Art. 5(1) *Eine Zensur findet nicht statt* (four words); Vermittlungsausschuss 16 + 16.
  https://www.gesetze-im-internet.de/gg/art_76.html, …/art_82.html, …/art_79.html, …/art_5.html
- President's refusals to sign: about nine since 1949; "only a few times" is fair, and the debate on
  the scope of review is labelled as such.
- Lesson 20 picture: 630 seats (2023 reform, first used 2025), voting age 18, Bundestag elects the
  Chancellor, President appoints the government, Bundesrat = members of state governments;
  Bundesversammlung = all Bundestag members + an equal number of state delegates. q24's "16 for
  European elections" is correct since 2024.
- Newspaper date "Dienstag, 14. Mai" is a real Tuesday (2024) and fits the Saturday-night fire /
  Monday press conference story.
- *laut* + genitive or dative, bare noun uninflected; *zufolge* postposed + dative; *nach Angaben* +
  genitive; Impressum plural *Impressen*; *der Bundespräsident* weak noun; principal parts of
  *in Kraft treten, beweisen, bestreiten* (Duden).
- *scheinbar* vs *anscheinend*: labelled as careful-writing usage; matches Duden's usage note.
- The ordering of certainty adverbs (*offenbar* above *anscheinend*) is a reasonable teaching
  convention, not a hard rule; the lesson presents it as signals, which is fine.
- All 53 questions worked before reading the key; order questions each have one correct order;
  select-all choices are clearly right or wrong. Mermaid diagrams (9) rendered and readable, with
  accTitle/accDescr describing each whole diagram.
- Vocab: no clash by term + pos, first meaning or id with German A1, A2, B1 (incl. all r2 files);
  checker agrees.

## Overlap and uncertain
- 20h2 overlaps lightly with **30h1** (de3-m6, Konjunktiv I) and **15h2** (de3-m3, *laut*): 20h2 only
  previews Konjunktiv I receptively, and 30h1 explicitly refers back to it; acceptable.
- Writer's flag, not my files: German A2 r2 adds `aktuell` (de2-m6-r2-w16) and `berichten`
  (de2-m6-r2-w05), which B1 also teaches; the checker passes, but whoever owns A2 de2-m6 should confirm.
- `content/math/check-module.sh german-b1 de3-m4`: OK, zero problems after fixes.

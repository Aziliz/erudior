# Round 2 review: de3-m5 (If only: Konjunktiv II and more)

Reviewer, independent of the writer. Scope: honors lessons 25h1 and 25h2, the round 2 additions to
core lessons 21–25 (5 Mermaid diagrams, 5 SVGs and their intro sentences), `questions/r2-de3-m5.yaml`
(53 questions), `vocab-r2-de3-m5.yaml` (27), `glossary-r2-de3-m5.yaml` (3), `cards-r2-de3-m5.yaml`
(22) and `images/de3-m5-*` (11 files). `check-module.sh german-b1 de3-m5`: OK, zero problems after
the fixes.

## Changes

1. **25h2, "The one-word forms of writing"** (factual). The lesson said the recipe "simple past
   stem + umlaut + -e" works for *every* strong verb, while its own table lists *stünde* (from
   *stand*, which by the recipe gives *stände*) and the Kafka example uses *wegwürfe* (from *warf*).
   Changed to "most strong verbs" and added one sentence naming the irregular old forms
   *stehen → stünde* (beside *stände*), *werfen → würfe*, *helfen → hülfe* (beside *hälfe*).
   Key points line now says "(a few irregular, like *stünde*)". Source: Duden entries stehen,
   werfen, helfen (Konjunktiv II forms); lesson 21 itself states the recipe without "every".
2. **de3-m5-r2-h15** explanation (answer key explanation error): "stand → stünde" was presented as
   the regular recipe. Now lists the regular cases and names stünde as irregular (stände also
   exists). Key unchanged.
3. **cards-r2-de3-m5, "Written Konjunktiv II: how to recognize it"**: same error ("stand → stünde"
   under the recipe). Removed it from the regular list and added "A few are irregular: stehen →
   stünde, werfen → würfe."
4. **de3-m5-r2-q14** (answer-key error, two defensible answers). Match left item "Er tut so, als
   ob er alles ___" could take either "wüsste." or "hätte!" ("als ob er alles hätte" is
   grammatical), and answers may repeat. Changed the pair to "Er tut so, als ob er krank" →
   "wäre." (no other ending fits it, and "wäre." fits no other left item); explanation updated.
5. **25h2 table, fahren row**: the translation of "Wenn ich Zeit hätte, führe ich ans Meer." gave
   only the main clause; now "If I had time, I'd drive to the sea."
6. **vocab de3-m5-r2-w04 berechnen**: first meaning "to calculate (work out)" did not separate it
   from A1's *rechnen* ("to calculate"; vocab-r2-de1-m1). Changed the prompt note to "to calculate
   (an amount or cost)".

## Checked and found right (a reader might doubt)

- Kafka, "Wunsch, Indianer zu werden": all seven fragments of the text checked against the
  writer's source (fleursdumal.nl); one sentence, no main clause. Kafka 1883–1924 (public domain);
  *Betrachtung* printed by Rowohlt in December 1912, dated 1913. Interpretation of the change from
  *wäre/erzitterte* to *ließ/gab/wegwarf/sah* is labeled as one reading among others. Konjunktiv II
  forms in h20/h21 and the cards (ließe, wegwürfe, sähe, gäbe) correct.
- *stünde* as the older form: historically from the old preterite plural vowel (MHG *stuonden*);
  Duden lists *stünde* first. Correct.
- Gutenberg: movable metal type in Mainz around 1450 (Bible c. 1454–55); movable type earlier in
  China (Bi Sheng, 11th c.) and Korea (metal type, 13th–14th c.), so "centuries" in h26 is right.
  Luther 1517 theses spreading "within weeks" is the usual account; Luther's influence on written
  German is marked as debated. Lesson 17 (round 1) says the same about Gutenberg: consistent.
- Bell filed the telephone patent application in 1876 (granted 7 March 1876): correct.
- Epistemic scale muss > müsste > dürfte > könnte > kann nicht: labeled a rough guide; h03 leaves
  out müsste, so the order question has one defensible order. *dürfte* = probably vs *Dürfte
  ich …?* = permission: correct. Guess (*müsste … gewusst haben*) vs reproach (*hätte … wissen
  müssen*): correct. "Future with wohl from lesson 4": lesson 04 does teach it.
- sonst/andernfalls: position 1, verb next; indicative for real warnings, Konjunktiv II for
  unrealized alternatives. Example 3 (*nass werden* → perfect with sein → *wäre*) correct.
- Example 2 arithmetic: 30 + half of 10 = 35.
- *dank* + genitive or dative; *hängen an* + dative; *rennend* (lesson 15 = participles), passive
  past (lesson 17), als ob and Wären Sie so nett (lesson 23): all cross-references exist.
- All 53 questions worked before reading keys; besides q14 every key is uniquely correct. Order
  questions (q05, q10, q12, q20, q25, h03, h23) have one order; q12 follows lesson 23's politeness
  table. Text accept lists include ae/oe/ue variants.
- Vocab: genders/plurals per Duden (Saal/Säle, Sporn/Sporen, Heide/Heiden, Zügel/Zügel, Mönch/
  Mönche, Verfahren/Verfahren; verlaufen verläuft–verlief–ist verlaufen; abschreiben schrieb ab).
  Script check against every vocab file in German A1, A2, B1 (incl. all r2 files): no shared id or
  term + part of speech. First meanings differ (other near matches are disambiguated by their
  notes: Tisch/Tabelle, Halle/Saal, kopieren/abschreiben, Prozess/Verfahren).
- Glossary: no clash; *modal particle* and *unreal wish*, bolded in the honors lessons, already
  exist in glossary-m5.
- Pictures: all 7 SVGs and 4 blank versions rendered; text readable, nothing cut off or
  overlapping; markers of q04, q07, q21 and h18 sit on the parts named (h18 marker 2 is on the rein
  just left of the head, outside the head outline). Mermaid diagrams (lessons 21–25, 25h2)
  rendered: correct, readable, accTitle/accDescr describe the whole diagram.
- Overlap: de3-h1's notes say they deliberately avoid the Kafka/Gutenberg material. No other
  round 2 lesson in German B1 repeats this module's honors content.

## Left uncertain / minor

- The two-paths SVG puts "Montag, 7.58 Uhr" in its top box; the story in lesson 22 gives Monday
  but no clock time. Harmless illustration detail; left as is.
- *möglicherweise* ("possibly (formal)") and A2 *eventuell* ("possibly (not eventually)") share the
  word "possibly"; the notes differ, so it passes the rule, but a learner prompted with "possibly
  (formal)" might type *eventuell*.

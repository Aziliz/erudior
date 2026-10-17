# German A2: outline

Target: CEFR A2 / Goethe-Zertifikat A2. The Goethe A2 word list has about 1,300 entries
*including* A1. German A1 (required before this course) taught 717 words, listed in
`A1-WORDS.tsv`; this course adds about 600 new ones (24 lessons × about 25). A1's words are
carried into this course automatically and keep the learner's progress, so:

- **Never re-add an A1 word.** Check `A1-WORDS.tsv` (term and id) before adding anything. You
  may *use* any A1 word freely in lessons, examples and questions.
- A new sense of an A1 word (e.g. *werden* = to become, if A1 only had it as future) is a new
  item only if A1 doesn't have that term with that part of speech; otherwise teach it in the
  lesson text and leave it out of the vocab file.
- Each lesson owns its theme's words below. The listed words are the core; add more from the
  same theme to reach ~25, only if they're common A2 words and not owned by another lesson's
  theme. The build rejects duplicates across the whole course, including A1.

Grammar scope comes from the CEFR A2 descriptors, the Goethe A2 exam, and second-semester
syllabi (Portland CC GER 102, MiraCosta German 102, U. Michigan German 102, ÖIF A2 matrix);
see RESEARCH.md. Points marked *(preview)* are late-A2/early-B1: teach the basic pattern only.

Lesson ids `de2-…`, files `NN-slug.md` with NN = 01–24, question ids `de2-q-LLNN`.

## Module 1 — Telling your story (de2-m1)

01 `de2-perfect-review` **Your life so far: the perfect, extended**
- Grammar: review of the perfect (haben/sein, ge-…-t/-en, separable); inseparable prefixes
  (be-, ver-, er-, ent-, emp-, ge-, zer-: hat bekommen, hat verstanden); -ieren verbs (hat
  studiert); mixed verbs (bringen–gebracht, denken–gedacht, kennen–gekannt, wissen–gewusst,
  nennen, rennen); dates and years in a life story (*1998*, *im Jahr 2010*, *mit 18*).
- Words (life events, biography): geboren, aufwachsen, die Kindheit, die Jugend, der
  Lebenslauf, die Ausbildung, der Abschluss, das Studium, heiraten, die Hochzeit, sich
  trennen? (reflexive is lesson 5 — use as a chunk only), die Rente, das Leben, erleben, das
  Erlebnis, die Erfahrung, der Umzug, gründen, wechseln, die Heimat, der Lebenslauf, erst
  (only), zuerst? (A1? check).

02 `de2-praeteritum` **When I was a child: the simple past**
- Grammar: Präteritum of the modal verbs in full (konnte, musste, wollte, durfte, sollte,
  mochte); recognizing the simple past of common verbs in stories (gab, ging, kam, sagte,
  machte, fand, sah, stand, wusste, dachte) — understand, not produce; when Germans use the
  simple past vs the perfect in speech and writing.
- Words (childhood, school days, the old days): der Kindergarten, die Grundschule, der
  Lehrer? (A1), die Klasse, das Fach, die Note, das Zeugnis, streng, die Pause, der Spielplatz,
  das Spielzeug, die Puppe, klettern, sich erinnern (chunk), die Erinnerung, damals? (A1 has —
  check), früher? (A1), das Märchen, verboten? (A1), erlauben, der Nachbar, die Nachbarin,
  aufpassen, brav, frech.

03 `de2-weil-dass` **Reasons and opinions: weil and dass**
- Grammar: subordinate clauses — verb at the end; weil (reason) vs denn (A1); dass after
  *ich finde / glaube / denke / hoffe / weiß*, *es ist wichtig, dass*; comma rules; separable
  and modal verbs in the subordinate clause (*weil ich früh aufstehe / aufstehen muss*);
  starting with the subordinate clause (verb–comma–verb).
- Words (opinions and feelings): die Meinung, meinen, der Grund, hoffen, finden (A1? check),
  glauben (A1), richtig (A1), wahr, die Wahrheit, sicher (A1? check), der Vorteil, der
  Nachteil, wichtig (A1), egal, froh, traurig, glücklich, zufrieden, enttäuscht, wütend,
  überrascht, stolz, die Angst, die Sorge, das Gefühl, zustimmen, recht haben, unbedingt.

04 `de2-wenn-als-ob` **If, when and whether: wenn, als, ob and indirect questions**
- Grammar: wenn for conditions and for repeated events; als for a single event in the past;
  ob and W-words in indirect questions (*Weißt du, ob …? Kannst du mir sagen, wann …?*);
  word order is the same as weil/dass.
- Words (decisions, problems, plans): entscheiden, die Entscheidung, das Problem (A1),
  die Lösung (A1? check), die Möglichkeit, möglich, unmöglich, planen, vorhaben, die
  Zukunft, sicher (check), der Fall (auf jeden Fall), falls, klappen, schaffen, aufgeben,
  versuchen, der Versuch, die Chance, das Ziel, erreichen, ändern, die Änderung.

## Module 2 — People and relationships (de2-m2)

05 `de2-reflexive` **Reflexive verbs**
- Grammar: accusative reflexive pronouns (mich, dich, sich, uns, euch, sich); common reflexive
  verbs; dative reflexive with a body part or object (*Ich wasche mir die Hände; ich putze mir
  die Zähne*); reflexive in the perfect (*Ich habe mich gefreut*) and with modals.
- Words (daily care and feelings): sich waschen, sich anziehen, sich ausziehen, sich umziehen,
  sich rasieren, sich kämmen, sich schminken, sich beeilen, sich ausruhen, sich setzen? (13
  owns setzen — take sich hinsetzen? no; leave), sich fühlen, sich wohlfühlen, sich freuen,
  sich ärgern, sich langweilen, sich erholen, sich verletzen, sich erkälten, der Spiegel, die
  Zahnbürste, die Seife, das Handtuch, der Kamm, die Creme.

06 `de2-verb-prepositions` **Verbs with prepositions; wo- and da- words**
- Grammar: verbs with fixed prepositions and their case (warten auf + Akk, denken an + Akk,
  sich freuen auf/über, sich interessieren für, sprechen mit/über, Angst haben vor + Dat, sich
  kümmern um, teilnehmen an + Dat, träumen von); questions with wo(r)- for things and
  preposition + wen/wem for people; da(r)- words as answers *(preview)*.
- Words (friendship, love, conflict): die Beziehung, der Partner, die Partnerin, sich
  verlieben, verliebt, die Liebe, lieben, sich streiten, der Streit, sich entschuldigen, die
  Entschuldigung? (A1 has Entschuldigung — check), verzeihen, vertrauen, das Vertrauen, sich
  verabreden, die Verabredung, der Bekannte/die Bekannte, der Kollege? (lesson 17), die
  Freundschaft, träumen, der Traum, sich kümmern um, teilnehmen, sich verstehen (mit),
  gemeinsam.

07 `de2-dative-verbs` **Verbs with the dative and two objects**
- Grammar: verbs that take a dative object (helfen, danken, gefallen, gehören, gratulieren,
  passen, schmecken, stehen (suits), fehlen, antworten (A1 verb), wehtun (A1)); verbs with a
  dative and an accusative (geben, schenken, zeigen, bringen, erklären, leihen, empfehlen):
  order *dem Kind das Buch*, *es dem Kind*, *es ihm*; dative pronouns in full.
- Words (gifts, borrowing, personal things): leihen, borgen, empfehlen, die Empfehlung,
  schicken (A1 — check), der Gutschein, die Überraschung, überraschen, das Paket, das
  Päckchen, die Karte? (check), wünschen, der Wunsch, gratulieren, danken, gefallen,
  gehören, passen, fehlen, das Portemonnaie / der Geldbeutel, der Regenschirm, die Kette, der
  Ring, das Parfüm, die Sonnenbrille.

08 `de2-people-werden` **Describing people; werden; jeder, alle, etwas, niemand**
- Grammar: *werden* = to become (full present: werde, wirst, wird…; perfect *ist geworden*);
  der-words jeder/jede/jedes, alle, dieser/welcher review; indefinite pronouns etwas, nichts,
  jemand, niemand, alles, viele, einige, man *(and their use with adjectives: etwas Neues)*.
- Words (appearance and character): aussehen, das Aussehen, das Gesicht, die Haare, blond,
  dick, dünn, schlank, hübsch, hässlich, freundlich, unfreundlich, nett, lustig, ernst,
  ehrlich, fleißig, faul, höflich, ruhig? (A1 — check), sympathisch, der Charakter, die
  Eigenschaft, ähnlich, werden, jeder, einige, jemand? (A1 — check), niemand? (check).

## Module 3 — Describing things (de2-m3)

09 `de2-adj-indef` **Adjective endings after ein, kein and mein**
- Grammar: the idea of adjective endings (only before a noun); endings after ein/kein/
  possessives in nominative and accusative, then dative; the "signal" rule (if the article
  doesn't show gender/case, the adjective does).
- Words (clothes and fashion): die Kleidung, das Kleid, der Rock, die Hose, die Jeans, das
  Hemd, die Bluse, das T-Shirt, der Pullover, die Jacke, der Mantel, der Anzug, die Schuhe
  (der Schuh), der Stiefel, die Socke, der Hut, die Mütze, der Schal, die Handschuhe, tragen,
  anprobieren, die Größe, eng, weit (A1 has weit = far — new item only if different pos;
  otherwise teach in text), bequem, modisch, gestreift, kariert.

10 `de2-adj-def` **Adjective endings after der, dieser and welcher**
- Grammar: endings after der-words in all three cases (-e/-en pattern); plural; *welcher …?
  – Der blaue.*; adjectives as nouns *(preview: der Kleine, das Neue)*.
- Words (department store, materials, buying and returning): das Kaufhaus, die Abteilung, die
  Rolltreppe, der Aufzug? (A1 m5 glossed only — check), die Umkleidekabine, die Quittung, der
  Kassenzettel, umtauschen, zurückgeben, die Garantie, reklamieren, das Material, die
  Baumwolle, die Wolle, das Leder, das Holz, das Metall, das Plastik, das Glas (check A1),
  der Rabatt, reduziert, günstig, die Marke, der Kunde, die Kundin.

11 `de2-adj-no-article` **Adjectives without an article; food and cooking**
- Grammar: endings with no article (*frischer Fisch, kaltes Wasser, mit warmer Milch*) — the
  adjective takes the der-word ending; *viele/einige/ein paar* + adjective; review of all
  three tables.
- Words (cooking, recipes, the restaurant): das Rezept, die Zutat, braten, backen, schneiden,
  mischen, rühren, schälen, probieren, der Topf, die Pfanne, der Teller, die Tasse, das Glas?
  (check), der Löffel, die Gabel, das Messer, die Speisekarte, die Vorspeise, die Hauptspeise,
  die Nachspeise / der Nachtisch, die Rechnung, das Trinkgeld, bestellen, scharf, süß, sauer,
  salzig, frisch, roh, das Gewürz, das Salz, der Pfeffer, der Zucker, das Öl.

12 `de2-comparison` **Comparing: bigger, the biggest**
- Grammar: comparative (-er) and superlative (am -sten; der/die/das -ste + endings);
  umlaut in short adjectives (alt–älter, groß–größer, jung, kurz, lang, warm, kalt, oft);
  irregular gut–besser–am besten, viel–mehr–am meisten, gern–lieber–am liebsten (A1),
  hoch–höher, nah–näher–am nächsten; *so … wie*, *als*; *immer mehr*.
- Words (city and country, landscape, geography): die Großstadt, das Dorf? (A1 — check), die
  Gegend, die Landschaft, der Wald, die Wiese, das Feld, der Bauernhof, der Hügel, das Tal,
  das Ufer, die Küste, die Grenze, der Norden, der Süden, der Osten, der Westen, die
  Hauptstadt, der Einwohner, die Umgebung, hoch, tief, breit, schmal, flach, gefährlich,
  sauber, schmutzig.

## Module 4 — Home, travel and wishes (de2-m4)

13 `de2-two-way` **Where is it, where does it go? Two-way prepositions**
- Grammar: in, an, auf, über, unter, vor, hinter, neben, zwischen with dative (wo?) and
  accusative (wohin?); the verb pairs stellen/stehen, legen/liegen, setzen/sitzen,
  hängen/hängen, stecken; contractions ins, ans; moving house.
- Words (moving and household): stellen, stehen? (check A1), legen, liegen, setzen, sitzen,
  hängen, stecken, einziehen, ausziehen? (05 owns sich ausziehen — different item; check
  term+pos), der Möbelwagen? no — die Möbel, der Karton, die Kiste, das Bild (A1? check), der
  Teppich, der Vorhang, das Kissen, die Decke, der Herd, die Spülmaschine, die
  Waschmaschine, der Müll, aufräumen? (A1 — check), sauber machen, abwaschen, staubsaugen,
  der Vermieter, die Nebenkosten, die Kaution.

14 `de2-travel` **Planning a trip**
- Grammar: time prepositions vor, seit, ab, bis, in, für + time (*vor einem Jahr, seit zwei
  Wochen, ab Montag, in drei Tagen, für eine Woche*); directional adverbs (hin, her, hinauf,
  rein/raus colloquial), *nach oben/unten, drinnen/draußen*; the future with werden for plans
  and predictions *(preview, alongside present + time word)*.
- Words (travel, hotel, holidays): die Unterkunft, das Doppelzimmer, das Einzelzimmer, die
  Übernachtung, übernachten, buchen, die Buchung, reservieren, die Reservierung, die
  Halbpension, die Rezeption, der Gast, der Reiseführer, die Sehenswürdigkeit, besichtigen,
  der Ausflug? (A1 — check), das Gepäck, packen, der Pass, das Visum, der Zoll, die Reisetasche,
  draußen, drinnen, unterwegs, der Campingplatz, das Zelt.

15 `de2-konjunktiv` **Wishes and polite requests: würde, hätte, wäre, könnte**
- Grammar: Konjunktiv II as set forms — *würde* + infinitive, *hätte (gern)*, *wäre*,
  *könnte*, *sollte*, *dürfte*: polite requests (*Könnten Sie …? Ich hätte gern …*), wishes
  (*Ich wäre gern …, Ich hätte gern mehr Zeit*), suggestions and advice (*Wir könnten … Du
  solltest …*); conditional *wenn ich Zeit hätte, würde ich …* *(preview)*.
- Words (wishes, requests, advice): bitten, die Bitte, der Rat, raten, vorschlagen, der
  Vorschlag, die Lust? (A1 — check), träumen? (06), reich, arm, berühmt, die Weltreise, das
  Abenteuer, freiwillig, irgendwann, irgendwo, sofort, eventuell, lieber? (A1), wünschen? (07
  — check), stattdessen, ausprobieren, die Gelegenheit, nötig, ausnahmsweise.

16 `de2-connectors` **Linking ideas: deshalb, trotzdem, sondern; weather and environment**
- Grammar: adverbs that link sentences and take position 1 (deshalb, trotzdem, dann,
  danach, außerdem, sonst) — verb second; *sondern* after a negative; the three sentence
  types side by side (und/aber/denn — weil/dass/wenn — deshalb/trotzdem); time–manner–place
  order.
- Words (weather and environment): das Klima, die Umwelt, schützen, der Umweltschutz, die
  Energie, der Strom, sparen, verbrauchen, der Abfall/Müll? (13 — check), trennen,
  recyceln, die Temperatur, der Grad, das Gewitter, der Nebel, die Wolke, bewölkt, sonnig,
  windig, nass, trocken, der Himmel, das Eis, frieren, außerdem, trotzdem, deshalb, sonst.

## Module 5 — Work, learning and services (de2-m5)

17 `de2-work` **At work; zu + infinitive**
- Grammar: zu + infinitive after *Lust/Zeit haben, versuchen, vergessen, anfangen, aufhören,
  es ist wichtig/schwer* (*Ich habe keine Zeit, ins Kino zu gehen*), with separable verbs
  (*anzurufen*); phone language at work.
- Words (working life, applying for a job): der Kollege, die Kollegin, der Chef, die Chefin,
  der Mitarbeiter, die Stelle, die Bewerbung, sich bewerben, das Vorstellungsgespräch,
  die Erfahrung? (01 — check), das Gehalt, verdienen, die Besprechung, das Meeting? no, die
  Überstunde, der Urlaub (A1), krankmelden? (sich krankmelden), kündigen, die Kündigung,
  arbeitslos, die Firma? (A1), der Betrieb, erledigen, die Aufgabe? (A1), zuständig, der
  Drucker, drucken, kopieren, der Vertrag.

18 `de2-school-learning` **School, courses and learning; whose is it?**
- Grammar: possession with von + dative and with names (*Annas Buch, das Auto von meinem
  Bruder*); the genitive *(preview: recognize des/der in fixed phrases)*; review of
  separable/inseparable verbs in learning contexts.
- Words (education): die Schule? (A1), das Gymnasium, die Realschule, die Berufsschule, die
  Universität? (A1), das Studium? (01), der Unterricht, unterrichten, das Fach? (02 — check),
  Mathematik, Geschichte? (A1 Geschichte = story — teach as text), Biologie, Erdkunde, Kunst,
  Sport? (A1), die Prüfung? (A1), der Test, durchfallen, bestehen? (A1), die Weiterbildung, der
  Abschluss? (01), das Zertifikat, sich anmelden, die Anmeldung, die Gebühr, der Lehrer? (A1),
  der Kurs? (A1), lernen? (A1), üben? (A1), wiederholen? (A1), verbessern, die Ahnung.

19 `de2-services` **Banks, offices and phone calls**
- Grammar: polite indirect questions review (*Können Sie mir sagen, wo …?*); *lassen*
  (*Ich lasse mein Fahrrad reparieren*) *(preview)*; phone conventions (spelling, numbers,
  *Ich verbinde*), letters of formality.
- Words (services, authorities, money): das Konto, das Girokonto, die Karte? (check A1), die
  Kreditkarte, die EC-Karte, abheben, überweisen, die Überweisung, einzahlen, die Gebühr? (18 —
  check), das Amt, die Behörde, das Bürgeramt, anmelden? (18 — check), der Antrag, beantragen,
  die Bescheinigung, die Versicherung, versichern, die Polizei, melden, verlieren? (A1),
  der Schaden, reparieren, die Werkstatt, die Reparatur, der Anrufbeantworter, besetzt,
  zurückrufen, verbinden, die Nummer? (A1).

20 `de2-health` **Health and the doctor's office**
- Grammar: *seit* + dative for duration up to now (*seit drei Tagen*); advice with *sollte*
  and *müsste*; the imperative review in instructions (*Nehmen Sie … dreimal täglich*);
  *wie oft? täglich, wöchentlich*.
- Words (health, illness, treatment): die Gesundheit, die Krankheit, die Erkältung, der
  Husten, der Schnupfen, die Grippe, die Allergie, die Verletzung, verletzt, bluten, die
  Wunde, das Pflaster, der Verband, die Spritze, das Rezept? (11 owns Rezept as recipe —
  this is a new sense: same term+pos clash → teach in text), die Krankenkasse, die
  Versichertenkarte, der Zahnarzt, untersuchen, die Untersuchung, operieren, die Operation,
  der Notfall, der Krankenwagen, täglich, schwanger, husten, niesen, sich übergeben? no.

## Module 6 — Media, celebrations and the A2 exam (de2-m6)

21 `de2-media-relative` **Media and technology; relative clauses**
- Grammar: relative clauses in the nominative and accusative (*der Mann, der …; das Handy,
  das ich gekauft habe*) — relative pronouns = definite article; verb at the end *(preview of
  the dative forms: dem, der, denen)*.
- Words (media, internet, devices): das Internet, online, die Webseite, herunterladen,
  hochladen, speichern, löschen, das Passwort, sich einloggen, das Netz, das WLAN, der
  Bildschirm, die Tastatur, der Laptop, das Programm, die App, das Fernsehen, die Sendung,
  die Nachrichten (the news), der Artikel, die Zeitschrift, der Bericht, die Werbung, das
  Radio, aufnehmen, das Video, der Kommentar.

22 `de2-celebrations` **Holidays and celebrations**
- Grammar: review of the dative in invitations and congratulations; ordinal dates in
  context; *ein-* forms as pronouns *(einer, eins, keiner, meiner)*; *wann/wenn/als* review in
  stories about holidays.
- Words (festivals in German-speaking countries): der Feiertag, Weihnachten, Ostern, Silvester,
  Neujahr, der Karneval/Fasching, das Oktoberfest? (proper noun — text only), der
  Adventskalender, der Weihnachtsbaum, die Kerze, das Feuerwerk, die Tradition, der Brauch,
  die Hochzeit? (01 — check), der Gast? (14 — check), der Gastgeber, einladen? (A1),
  die Feier, gratulieren? (07), anstoßen, das Prost, die Torte, die Dekoration, schmücken,
  verkleiden.

23 `de2-writing` **Writing SMS and e-mails: asking, apologizing, cancelling**
- Grammar: register (du vs Sie in writing), openings and closings (*Sehr geehrte …, Liebe …,
  Viele Grüße, Mit freundlichen Grüßen*), covering three content points in 20–40 words (the
  format of Goethe A2 Schreiben); linking with weil, deshalb, trotzdem; dates and times in
  messages.
- Words (messages, requests, arrangements): die Mitteilung, mitteilen, bestätigen,
  verschieben, absagen? (A1), sich verspäten, die Verspätung? (A1), Bescheid sagen/geben, die
  Rückmeldung, informieren, die Auskunft, der Betreff, der Anhang, weiterleiten, beilegen?
  no, dringend, rechtzeitig, vorher, nachher, inzwischen, möglichst, Mit freundlichen
  Grüßen, Sehr geehrte Frau …, herzlich.

24 `de2-exam-review` **The Goethe-Zertifikat A2 and review**
- Content: what A2 means (CEFR can-dos in your own words); the four parts of the adult
  Goethe-Zertifikat A2: Lesen 30 min (4 parts), Hören about 30 min (4 parts), Schreiben 30 min
  (an informal SMS of 20–30 words and a semi-formal e-mail of 30–40 words), Sprechen about
  15 min in pairs (questions with word cards; talking about your life; planning an
  appointment together); 100 points, pass with 60 overall, at least 45/75 written and 15/25
  speaking; grades sehr gut 90–100, gut 80–89, befriedigend 70–79, ausreichend 60–69; free
  official practice at the Goethe-Institut; strategies; grammar review pointing to lessons;
  what comes next (B1).
- Words: leftovers and exam language (~20): die Anzeige, das Inserat? (choose one), der
  Kalender, der Zeitpunkt, vereinbaren, passen (07 — check), zusammenfassen, die
  Zusammenfassung, ankreuzen? (A1), die Durchsage, die Ansage, der Hinweis, beachten, das
  Missverständnis, verwechseln, unterschiedlich, der Unterschied, ungefähr, genau, ziemlich?
  (A1).

## Status

- [x] m1 lessons 01–04
- [x] m2 lessons 05–08
- [x] m3 lessons 09–12
- [x] m4 lessons 13–16
- [x] m5 lessons 17–20
- [x] m6 lessons 21–24
- [x] reading.yaml (from RESEARCH.md), refs wiring, dedupe, full build, independent review

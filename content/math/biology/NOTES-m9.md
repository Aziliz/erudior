# Module 9 (bio-m9, The human body): writer notes

## Counts
- Lessons: 3 (35 bio-homeostasis, 36 bio-transport-systems, 37 bio-digestion-immunity), 1,700–1,800 words each (body, excluding figure JSON). Each has 3–4 worked examples.
- Questions: 36 in `questions/m09.yaml` (bio-q-0901…0936): 12 per lesson; 14 marked `module_quiz` (4–5 per lesson, every topic covered). Answer positions 0/1/2/3 = 9/9/9/9.
- Drills: 7 in `drills/m09.yaml`: the outline ids bio-feedback, bio-cardiac-output, bio-bmr-o2 and bio-energy-food, plus bio-nerve-speed (L35, Helmholtz's two-point method), bio-ventilation (L36, minute and alveolar ventilation) and bio-herd-immunity (L37, $1 - 1/R_0$ and coverage given vaccine effectiveness).
- Glossary: 29 terms in `glossary-m9.yaml` (includes BMR as an alias). Cards: 30 in `cards-m9.yaml`.
- Figures: glucose tolerance curves (L35), primary vs secondary antibody response (L37). Both are labeled illustrative.
- `check-module.sh biology m9`: OK, zero problems.

## For the reviewer
- "Homeostasis" is bolded and defined in m1 (lesson 01), so L35 uses it without bold.
- The content is a high school overview and says it isn't medical advice. Diabetes (type 1 autoimmune, type 2 insulin resistance), celiac disease (one question) and HIV are described factually, without treatment advice. Vaccine content covers Jenner, smallpox eradication (WHO 1980), vaccine types, and mRNA vaccines (cytoplasm only, cannot alter DNA, degraded within days).
- Values to spot-check: resting membrane potential about −70 mV; conduction under 1 to over 100 m/s; fasting glucose about 70–100 mg/dL; cardiac output about 5 L/min at rest, 20+ L/min in trained athletes during hard exercise; about 250 million hemoglobin molecules per red blood cell; alveolar surface "very roughly 70 m²" and small-intestine absorptive surface "very roughly 30 m²" (both hedged, since published estimates vary widely); about 180 L/day filtrate and 1.5 L urine; about 20 kJ per liter of O₂; resting VO₂ about 3.5 mL/kg/min; stomach pH about 1.5–3.5; measles $R_0$ 12–18 and two-dose MMR about 97% effective.
- The bio-feedback drill is a simple model in which each 30-minute interval removes a fixed fraction of the glucose excess. The prompt calls it a model, but a reviewer may want to confirm the framing is acceptable.
- The Helmholtz example uses round, illustrative numbers (25 m/s). His measured frog-nerve speed was about 27 m/s.
- Spallanzani's digestion experiments are described in simplified form (perforated tubes and linen bags, gastric juice in vitro, water control).

## Sources consulted
- Hodgkin & Huxley 1952 (J Physiol); Helmholtz 1850 nerve-conduction measurements; Bayliss & Starling 1902 (J Physiol) on secretin; Banting & Best 1922 on insulin; Harvey, De Motu Cordis (1628); Malpighi 1661.
- Standard physiology values (resting VO₂ and MET, oxygen energy equivalent, GFR, cardiac output) checked against general physiology references.
- WHO smallpox eradication (1980); CDC material on vaccine types and how mRNA vaccines work; published measles $R_0$ ranges (Guerra et al. 2017, Lancet Infect Dis).
- Atwater factors (4/4/9 kcal/g; 1 kcal = 4.184 kJ).
- NGSS HS-LS1-2/1-3 (systems, feedback) and Texas TEKS Biology §112.42 (animal systems: regulation, nutrient absorption, defense), as summarized in RESEARCH.md.
- All text, examples and questions are original. No textbook text or images were used.

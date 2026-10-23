# Review of module 9 (bio-m9, The human body)

Reviewer: independent (did not write this module). Date: 2026-10-23.

## What I checked
- All 36 questions in `questions/m09.yaml`. I worked each one before reading the key and checked every numeric answer and distractor in Python (Helmholtz speed, cardiac output, ventilation, O₂ energy, kidney reabsorption, food energy, herd immunity). All keys are correct, no distractor is defensible, and the stems are unambiguous. Answer positions: 9/9/9/9.
- Lessons 35–37, read in full. I re-did every worked example (Helmholtz 25 m/s; Harvey 7,258 L/day; ventilation 6.0/4.2/2.4 L/min; BMR 0.245 L/min → about 7,200 kJ/day; 99.2% reabsorbed; granola 179 kcal, 35.2% from fat; herd immunity 93.3% → 96.2% coverage). I also checked the plotted curves against the text (glucose peaks of 140 and 300, 205 at 3 h, 172 at 4 h; antibody peaks at day 12 = 10 and day 35 ≈ 100).
- All 7 drills (prompts, `where` clauses, solution text), 29 glossary terms and 30 cards.
- Overlap with other lessons: lesson 01 (homeostasis, negative feedback), 03 (blood buffer), 07/31 (viruses, antibiotics, HIV as a retrovirus, pathogens bolded in L31), 25 (recombinant insulin). No contradictions. No duplicate glossary terms across modules.
- Every item in NOTES-m9.md "For the reviewer".

## Changes
| File | Change | Why | Source |
|---|---|---|---|
| lessons/35-homeostasis.md | Resting potential: the pump builds the ion gradients, and K⁺ leaking out through open channels makes the inside negative (was "built up by sodium-potassium pumps"). | The original wording is a common misconception; the pump contributes only a few mV directly. | Standard neurophysiology (Hodgkin & Huxley; OpenStax Biology 2e §35.2) |
| lessons/35-homeostasis.md | Withdrawal reflex now goes "usually through one or more interneurons (in the knee-jerk reflex, directly)". | The hot-stove withdrawal reflex is polysynaptic. Only the stretch reflex is monosynaptic. | Standard physiology |
| lessons/35-homeostasis.md | Starling coined "hormone" in 1905, not in the 1902 secretin paper. | Historical accuracy. | https://hekint.org/2020/06/29/ernest-henry-starling-and-the-birth-of-english-physiology/ |
| lessons/35-homeostasis.md | Type 1 patients "need insulin every day"; type 2 is "about 90–95% of diagnosed cases" (was "much more common"). | Matches CDC wording and gives the figure. | https://www.cdc.gov/diabetes/about/index.html |
| lessons/36-transport-systems.md | Peak cardiac output: about 20 L/min in a healthy young adult and 30 L/min or more in elite endurance athletes. | The original implied 20 L/min needs athletic training. Untrained young adults reach about 20 L/min. | Standard exercise physiology |
| lessons/36-transport-systems.md | Alveolar area of 70 m² is "about a third of a tennis court" (was "a large fraction"). | A singles court is about 196 m² and a doubles court about 261 m². | Arithmetic |
| lessons/36-transport-systems.md | O₂ energy equivalent: "roughly 19 to 21 kJ, depending only a little on fuel" (was "whatever mix of food is being burned"). | The value does vary with fuel, though only by a few percent. | Standard indirect calorimetry values |
| lessons/37-digestion-immunity.md | Small intestine is "several meters long (about 3 m in a living adult; the often-quoted 6 m is its relaxed length after death)" (was "about 6 m"). | In vivo measurements give about 3 m. The same paper is the source of the lesson's 30 m² figure. | Helander & Fändriks 2014, via https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111127 and id=111126 |
| lessons/37-digestion-immunity.md | HIV: helper T-cell loss happens over years and leads to AIDS. Added that antiretroviral therapy can't cure HIV but stops it destroying CD4 cells, so people on it can live long, healthy lives. | The original said "the whole adaptive response fails" without the time course or treatment, which would leave a learner with an outdated picture. | https://hivinfo.nih.gov/understanding-hiv/fact-sheets/hivaids-basics |

Totals: key errors 0, factual errors 5 (resting-potential mechanism, reflex path, "hormone" date, intestine length, peak cardiac output), unclear or misleading text 4 (tennis court, O₂ equivalent, diabetes wording, HIV course and treatment), stems 0.

## Verified without change
- Fasting glucose about 70–100 mg/dL (CDC: normal is under 100). Core temperature about 37 °C.
- Two-dose MMR about 97% effective, one dose 93% (https://www.cdc.gov/measles/hcp/vaccine-considerations/index.html). Measles R₀ "around 12–18" is the commonly cited range (Guerra et al. 2017, Lancet Infect Dis, which also notes much wider published estimates).
- mRNA vaccines never enter the nucleus, don't alter DNA, and the mRNA is broken down (https://www2.cdc.gov/vaccines/ed/covid/2_3.asp). That page gives no timeframe for "within days"; CDC's myths-and-facts material has said "within a few days". Kept.
- WHO declared smallpox eradicated in 1980; the last natural case was in Somalia in 1977 (https://www.who.int/health-topics/smallpox). Jenner 1796.
- Type 1 diabetes is autoimmune and type 2 involves cells not responding well to insulin (CDC, above).
- Bayliss & Starling 1902 secretin; Banting & Best 1921 (first patient treated January 1922); Harvey 1628; Malpighi 1661; Hodgkin & Huxley 1952 (squid giant axon, about 0.5 mm); Helmholtz 1850 (about 27 m/s measured; the lesson's 25 m/s is labeled as a constructed example).
- About 250 million Hb per RBC (often given as 250–270 million); 180 L filtrate and 1.5 L urine per day; resting VO₂ 3.5 mL/kg/min = 1 MET; about 1 million nephrons per kidney; stomach pH 1.5–3.5; small-intestine absorptive area of about 30 m² (Helander & Fändriks 2014).
- Spallanzani's experiments (swallowed linen bags and perforated tubes; in vitro gastric juice with a water control) are a fair simplification.
- bio-feedback drill: framing it as "a simple model" is acceptable. Real glucose clearance isn't a fixed fraction per interval, and the prompt says so.

## Couldn't fully verify
- The exact 97%/93% ranges and Guerra's R₀ figures come from search summaries, not the full papers.
- The "within days" timescale for mRNA breakdown wasn't on the CDC page I could fetch; it's consistent with CDC's earlier public material.

---
id: phys-nuclear
module: phys-m12
title: Nuclear physics and radioactivity
minutes: 40
topics: [Nuclear structure, Radioactive decay]
drills: [phys-half-life, phys-binding-energy, phys-carbon-dating]
refs: [phys-ref-em-modern, phys-ref-constants]
---
## Inside the nucleus

Almost all of an atom's mass is packed into its nucleus, a region about $10^{-15}$ m across, 100 000 times smaller than the atom. Nuclear physics explains why some nuclei are stable and others fall apart, where the Sun's energy comes from, how reactors and medical isotopes work, and how we date ancient objects. This final lesson draws on two ideas from earlier: $E = mc^2$ and exponential decay.

## Nuclear structure

A nucleus contains protons and neutrons, together called **nucleons**. The **atomic number** $Z$ is the number of protons (it fixes the element); the **mass number** $A$ is the total number of nucleons; the neutron number is $N = A - Z$. A nucleus is written $^A_Z\text{X}$, for example $^{12}_{6}\text{C}$ (6 protons, 6 neutrons). **Isotopes** of an element have the same $Z$ but different $N$: carbon-12, carbon-13, carbon-14.

Protons repel each other electrically, so something stronger must hold the nucleus together: the **strong nuclear force**, an attraction between nucleons that is about 100 times stronger than the electric force but acts only over about $10^{-15}$ m. In heavy nuclei the long-range electric repulsion adds up while the short-range strong force doesn't, so heavy nuclei need extra neutrons for stability, and beyond lead ($Z = 82$) no nucleus is fully stable.

Nuclear masses are measured in **atomic mass units**: $1\text{ u} = 1.6605\times10^{-27}$ kg, equivalent to 931.5 MeV of rest energy. A proton is 1.007276 u, a neutron 1.008665 u.

## Binding energy

The mass of a nucleus is *less* than the total mass of its separate protons and neutrons. The difference, the **mass defect** $\Delta m$, corresponds to the **binding energy** $E_B = \Delta m\,c^2$: the energy released when the nucleus forms, or needed to pull it completely apart.

### Example 1

Find the binding energy of helium-4. Its atomic mass is 4.002603 u; use hydrogen-atom mass 1.007825 u (one proton plus one electron, so electron masses cancel) and neutron mass 1.008665 u.

Separate parts: $2(1.007825) + 2(1.008665) = 4.032980$ u.

Mass defect: $4.032980 - 4.002603 = 0.030377$ u.

$E_B = 0.030377(931.5) = 28.3$ MeV, or 7.07 MeV per nucleon. That's millions of times the few eV holding electrons in atoms, which is why nuclear reactions release so much energy.

*Binding energy per nucleon* rises steeply for light nuclei, peaks near iron-56 at about 8.8 MeV, and falls slowly for heavy ones. Energy is released by moving toward the peak:

```plot
{"x": [0, 250], "y": [0, 10], "xLabel": "mass number A", "yLabel": "binding energy per nucleon (MeV)", "segments": [{"from": [2, 1.112], "to": [4, 7.074]}, {"from": [4, 7.074], "to": [6, 5.332]}, {"from": [6, 5.332], "to": [12, 7.680]}, {"from": [12, 7.680], "to": [16, 7.976]}, {"from": [16, 7.976], "to": [56, 8.790]}, {"from": [56, 8.790], "to": [84, 8.717]}, {"from": [84, 8.717], "to": [138, 8.393]}, {"from": [138, 8.393], "to": [208, 7.867]}, {"from": [208, 7.867], "to": [238, 7.570]}], "points": [{"at": [2, 1.112], "label": "H-2"}, {"at": [4, 7.074], "label": "He-4"}, {"at": [6, 5.332]}, {"at": [12, 7.680], "label": "C-12"}, {"at": [16, 7.976]}, {"at": [56, 8.790], "label": "Fe-56"}, {"at": [84, 8.717]}, {"at": [138, 8.393]}, {"at": [208, 7.867]}, {"at": [238, 7.570], "label": "U-238"}], "caption": "Binding energy per nucleon for selected nuclei: fusion climbs the steep left side, fission steps down from the right toward the peak near iron"}
```

- **Fission**: a heavy nucleus such as uranium-235 splits into two medium nuclei (about 200 MeV per fission). Neutrons released can trigger more fissions, a chain reaction, used in reactors and bombs.
- **Fusion**: light nuclei combine, as when hydrogen fuses into helium in the Sun (about 26.7 MeV per helium nucleus formed). It requires extreme temperatures to overcome electric repulsion.

## Radioactive decay

Unstable nuclei decay spontaneously, emitting radiation:

| Decay | Emitted | Change in nucleus | Example |
|---|---|---|---|
| Alpha (α) | helium nucleus $^4_2\text{He}$ | $Z - 2$, $A - 4$ | $^{238}_{92}\text{U} \to {}^{234}_{90}\text{Th} + \alpha$ |
| Beta minus (β⁻) | electron (and antineutrino) | neutron → proton: $Z + 1$, $A$ same | $^{14}_{6}\text{C} \to {}^{14}_{7}\text{N} + e^- + \bar\nu$ |
| Beta plus (β⁺) | positron (and neutrino) | proton → neutron: $Z - 1$ | $^{18}_{9}\text{F} \to {}^{18}_{8}\text{O} + e^+ + \nu$ |
| Gamma (γ) | high-energy photon | no change in $Z$ or $A$; nucleus drops to a lower energy state | follows many α and β decays |

In every nuclear reaction, *charge* (sum of $Z$) and *nucleon number* (sum of $A$) are conserved: the numbers on both sides balance. Alpha particles are stopped by paper, beta particles by a few millimeters of aluminum, gamma rays need thick lead or concrete.

![A radioactive source emits three beams to the right. The alpha beam stops at a sheet of paper; the beta beam passes the paper and stops in an aluminum sheet a few millimeters thick; the gamma beam passes both and is only weakened, not stopped, by a lead block several centimeters thick.](images/phys-m12-penetration.svg)

Which decay an unstable nucleus undergoes depends mostly on what makes it unstable. The chart is a simplified guide (real nuclei sometimes have several possible decays).

```mermaid
flowchart TD
  accTitle: Which decay does an unstable nucleus undergo?
  accDescr: A simplified guide. A nucleus with too many neutrons for its protons decays by beta minus, a neutron becoming a proton so Z goes up by 1. One with too many protons decays by beta plus, a proton becoming a neutron so Z goes down by 1. A very heavy nucleus, beyond about lead, often decays by alpha, so Z goes down by 2 and A by 4. Any of these can leave the daughter nucleus in an excited state, which then emits a gamma ray with no change in Z or A.
  A["Unstable nucleus"] --> B["Too many neutrons"]
  A --> C["Too many protons"]
  A --> D["Very heavy, beyond about lead"]
  B --> E["Beta minus: neutron to proton, Z + 1"]
  C --> F["Beta plus: proton to neutron, Z − 1"]
  D --> G["Alpha: Z − 2, A − 4"]
  E --> H["Daughter often left in an excited state"]
  F --> H
  G --> H
  H --> I["Gamma ray: Z and A unchanged"]
```

## Half-life and the decay law

Decay is random: you can't predict when one nucleus will decay, but a large sample decays at a predictable rate. The number of decays per second, the **activity** $R$, is proportional to the number of nuclei present: $R = \lambda N$, where $\lambda$ is the decay constant. The result is exponential decay:

$$N(t) = N_0e^{-\lambda t} = N_0\left(\tfrac12\right)^{t/T_{1/2}}.$$

The **half-life** $T_{1/2}$ is the time for half the nuclei (and half the activity) to decay:

$$T_{1/2} = \frac{\ln 2}{\lambda} = \frac{0.693}{\lambda}.$$

After one half-life, half remain; after two, a quarter; after ten, about 0.1%. Half-lives range from fractions of a second to billions of years (uranium-238: 4.5 billion years). Activity is measured in becquerels (1 Bq = 1 decay/s).

```plot
{"x": [0, 5.2], "y": [0, 1.1], "xLabel": "time (half-lives)", "yLabel": "fraction remaining", "functions": [{"f": "0.5^x"}], "points": [{"at": [1, 0.5], "label": "1/2"}, {"at": [2, 0.25], "label": "1/4"}, {"at": [3, 0.125], "label": "1/8"}], "caption": "Exponential decay: the amount halves every half-life"}
```

### Example 2

Iodine-131, used to treat thyroid disease, has a half-life of 8.0 days. A sample has activity 400 MBq. What is its activity after 24 days? After 30 days?

24 days is exactly 3 half-lives: $400(\tfrac12)^3 = 50$ MBq.

30 days: $400(\tfrac12)^{30/8.0} = 400(0.5)^{3.75} = 400(0.0743) = 29.7$ MBq.

### Example 3: carbon dating

Living things maintain a constant ratio of carbon-14 to carbon-12 while alive; after death the C-14 decays with half-life 5730 years. A wooden artifact has 35% of the C-14 activity of living wood. How old is it?

$0.35 = (\tfrac12)^{t/5730}$, so $t = 5730\dfrac{\ln 0.35}{\ln 0.5} = 5730(1.515) = 8680$ years.

## Why the decay is exponential

Each nucleus has the same small chance of decaying in any given second, regardless of its age, so in each second the sample loses the same *fraction* of whatever is left. A quantity that loses a fixed fraction per unit time decays exponentially, just like the charge on a discharging capacitor. On the graph above, the slope (the decay rate) is steep at first, when there are many nuclei, and flattens as fewer remain: the activity $R = \lambda N$ is proportional to the number left.

The two forms of the decay law are the same curve. Setting $N = N_0/2$ at $t = T_{1/2}$ in $N = N_0e^{-\lambda t}$ gives $e^{-\lambda T_{1/2}} = \tfrac12$; taking the natural log of both sides, $\lambda T_{1/2} = \ln 2$, which is the half-life formula. To solve for a time, take logs as in Example 3; to find an amount, plug in directly.

### Example 4

A medical sample contains 1.0 μg of iodine-131 (molar mass 131 g/mol, half-life 8.0 days). What is its activity?

Number of nuclei: $N = \dfrac{1.0\times10^{-6}\text{ g}}{131\text{ g/mol}}(6.022\times10^{23}\text{ mol}^{-1}) = 4.6\times10^{15}$.

Decay constant in s⁻¹ (activity is decays per *second*): $T_{1/2} = 8.0(86\,400) = 6.91\times10^5$ s, so $\lambda = \dfrac{0.693}{6.91\times10^5} = 1.0\times10^{-6}$ s⁻¹.

$R = \lambda N = (1.0\times10^{-6})(4.6\times10^{15}) = 4.6\times10^9$ Bq. A millionth of a gram gives billions of decays per second, which is why tiny doses are enough for imaging and treatment.

## Common mistakes

- Thinking all the sample is gone after two half-lives (a quarter remains).
- Using $N_0/2t$ or linear decay instead of exponential.
- Forgetting to balance both $Z$ and $A$ in decay equations.
- Confusing mass number $A$ with atomic mass in kilograms, or binding energy with total rest energy.

## Key points

- $^A_Z\text{X}$: $Z$ protons, $A$ nucleons; isotopes share $Z$.
- Binding energy $E_B = \Delta m\,c^2$; 1 u $\leftrightarrow$ 931.5 MeV; per-nucleon peak near iron.
- α: $Z - 2$, $A - 4$; β⁻: $Z + 1$; β⁺: $Z - 1$; γ: no change.
- $N = N_0(\tfrac12)^{t/T_{1/2}} = N_0e^{-\lambda t}$; $T_{1/2} = 0.693/\lambda$; activity $R = \lambda N$.

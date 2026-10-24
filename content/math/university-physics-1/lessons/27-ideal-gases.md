---
id: phys-gases
module: phys-m7
title: Ideal gases and kinetic theory
minutes: 40
topics: [Ideal gas law, Kinetic theory]
drills: [phys-ideal-gas, phys-combined-gas, phys-vrms]
refs: [phys-ref-waves-thermo, phys-ref-constants]
---
## Why gases are simple

Solids and liquids have complicated forces between tightly packed molecules. In a gas the molecules are far apart and mostly fly freely between collisions, so gases at ordinary conditions obey one simple equation of state. Better yet, we can derive that equation from Newtonian mechanics of molecules, which connects temperature to molecular motion. This lesson covers the ideal gas law and the kinetic theory behind it.

## Amount of substance

A **mole** is $N_A = 6.022\times10^{23}$ particles (**Avogadro's number**). One mole of a substance has a mass in grams equal to its molecular mass in atomic mass units: 1 mol of O₂ is about 32 g, 1 mol of He 4 g. The number of moles is $n = N/N_A = m/M$, where $M$ is the molar mass.

## The ideal gas law

Experiments by Boyle, Charles and Gay-Lussac showed that for a fixed amount of gas, $PV$ is proportional to absolute temperature. Combined:

$$PV = nRT,$$

the **ideal gas law**, with $R = 8.314$ J/(mol·K), the gas constant. Here $P$ is absolute pressure (Pa), $V$ volume (m³), $T$ absolute temperature (K). In terms of molecules, $PV = Nk_BT$, where $k_B = R/N_A = 1.38\times10^{-23}$ J/K is **Boltzmann's constant**.

An **ideal gas** is one whose molecules are point-like and don't interact except in brief elastic collisions. Real gases behave ideally at low pressure and high temperature (far from condensing). Air at room conditions is close.

Special cases for a fixed amount of gas:

- Constant $T$: $P_1V_1 = P_2V_2$ (Boyle's law).
- Constant $P$: $V_1/T_1 = V_2/T_2$ (Charles's law).
- Constant $V$: $P_1/T_1 = P_2/T_2$ (Gay-Lussac's law).
- In general: $\dfrac{P_1V_1}{T_1} = \dfrac{P_2V_2}{T_2}$.

To choose among them, ask what the problem holds fixed:

```mermaid
flowchart TD
  accTitle: Which gas law to use
  accDescr: First ask whether a number of moles is asked for or the amount of gas changes. If so, use P V equals n R T. Otherwise the amount is fixed, so ask what else stays fixed. If temperature is fixed, use Boyle's law, P1 V1 equals P2 V2. If not, and pressure is fixed, use Charles's law, V1 over T1 equals V2 over T2. If not, and volume is fixed, use Gay-Lussac's law, P1 over T1 equals P2 over T2. If nothing else is fixed, use the combined law, P1 V1 over T1 equals P2 V2 over T2. In every case use absolute pressure and kelvins.
  A{"n asked for, or amount of gas changes?"} -- "yes" --> B["PV = nRT"]
  A -- "no" --> C{"T fixed?"}
  C -- "yes" --> D["Boyle: P1V1 = P2V2"]
  C -- "no" --> E{"P fixed?"}
  E -- "yes" --> F["Charles: V1/T1 = V2/T2"]
  E -- "no" --> G{"V fixed?"}
  G -- "yes" --> H["Gay-Lussac: P1/T1 = P2/T2"]
  G -- "no" --> I["Combined: P1V1/T1 = P2V2/T2"]
```

On a PV diagram, each temperature gives a hyperbola $P = nRT/V$, called an isotherm; hotter isotherms lie farther from the axes.

```plot
{"x": [0, 40], "y": [0, 600], "xLabel": "V (L)", "yLabel": "P (kPa)", "functions": [{"f": "8.314*200/x", "from": 3, "to": 40}, {"f": "8.314*300/x", "from": 4, "to": 40}, {"f": "8.314*400/x", "from": 5.6, "to": 40}], "labels": [{"at": [33, 35], "text": "200 K"}, {"at": [33, 95], "text": "300 K"}, {"at": [33, 130], "text": "400 K"}], "caption": "Isotherms of 1 mol of ideal gas: P = nRT/V (1 kPa·L = 1 J)"}
```

At **STP** (0°C, 1 atm), one mole of any ideal gas occupies 22.4 L. This course uses the 1 atm definition, as most physics texts do; IUPAC has defined standard pressure as 1 bar (100 kPa) since 1982, which gives 22.7 L per mole, so check which one a problem or table assumes.

### Example 1

A 50 L scuba tank holds air at 200 atm (absolute) and 20°C. How many moles of air does it contain? What volume would that air occupy at 1 atm and 20°C?

$n = \dfrac{PV}{RT} = \dfrac{(200\times1.013\times10^5)(0.050)}{8.314(293)} = \dfrac{1.013\times10^6}{2436} = 416$ mol.

At 1 atm and the same temperature, Boyle's law gives $V_2 = 200(50) = 10\,000$ L $= 10$ m³. That's why one tank lasts a diver an hour.

### Example 2

A car tire has a gauge pressure of 220 kPa at 10°C. After driving, the air inside is at 45°C. Assuming the volume is unchanged, what is the new gauge pressure?

Use absolute values: $P_1 = 220 + 101 = 321$ kPa, $T_1 = 283$ K, $T_2 = 318$ K.

$P_2 = P_1\dfrac{T_2}{T_1} = 321\left(\dfrac{318}{283}\right) = 361$ kPa absolute, or 260 kPa gauge. Using gauge pressure or Celsius in the ratio would give wrong answers (Celsius would even predict a 4.5-fold increase).

## Kinetic theory

Why should $PV$ be proportional to $T$? Model the gas as $N$ molecules of mass $m$ bouncing elastically in a box. A molecule hitting a wall with velocity component $v_x$ bounces back with $-v_x$, delivering momentum $2mv_x$. It returns to that wall every $2L/v_x$ seconds. The picture shows one such bounce.

![A molecule in a box of length L bounces off the right-hand wall, of area A. Its velocity component toward the wall reverses from plus vₓ to minus vₓ, so each bounce gives the wall momentum 2mvₓ.](images/phys-m7-kinetic-box.svg)

Averaging over all molecules and the three directions (by symmetry $\overline{v_x^2} = \tfrac13\overline{v^2}$), the pressure works out to

$$PV = \tfrac13Nm\overline{v^2} = \tfrac23N\left(\tfrac12m\overline{v^2}\right).$$

Comparing with $PV = Nk_BT$:

$$\overline{K}_{\text{trans}} = \tfrac12m\overline{v^2} = \tfrac32k_BT.$$

This is the deep result: *temperature is a measure of the average translational kinetic energy of molecules*. At absolute zero the classical motion would stop.

The **root-mean-square speed**, the square root of the average of $v^2$, follows:

$$v_{\text{rms}} = \sqrt{\frac{3k_BT}{m}} = \sqrt{\frac{3RT}{M}},$$

with $M$ in kg/mol. Lighter molecules move faster at the same temperature.

### Example 3

Find the rms speed of nitrogen molecules ($M = 0.028$ kg/mol) and helium atoms ($M = 0.004$ kg/mol) at 300 K, and the average translational kinetic energy per molecule.

N₂: $v_{\text{rms}} = \sqrt{\dfrac{3(8.314)(300)}{0.028}} = 517$ m/s. He: $\sqrt{\dfrac{3(8.314)(300)}{0.004}} = 1368$ m/s.

$\overline K = \tfrac32(1.38\times10^{-23})(300) = 6.21\times10^{-21}$ J for both: same temperature, same average kinetic energy, so the lighter atom must move faster. Helium's speed is a sizable fraction of Earth's escape speed, which is part of why Earth's atmosphere has lost almost all its helium.

## Internal energy

For a **monatomic** ideal gas (He, Ne, Ar), all the internal energy is translational kinetic energy:

$$E_{\text{int}} = \tfrac32Nk_BT = \tfrac32nRT.$$

Diatomic molecules (N₂, O₂) can also rotate, adding two more ways to store energy, so near room temperature $E_{\text{int}} = \tfrac52nRT$. This is the **equipartition theorem**: each independent quadratic "degree of freedom" holds $\tfrac12k_BT$ on average. Either way, the internal energy of an ideal gas depends only on temperature, a fact the next lesson relies on.

## The Maxwell–Boltzmann distribution

The molecules in a gas don't all share one speed. Their speeds follow the **Maxwell–Boltzmann distribution**,

$$f(v) = 4\pi\left(\frac{m}{2\pi k_BT}\right)^{3/2}v^2e^{-mv^2/(2k_BT)},$$

where $f(v)\,dv$ is the fraction of molecules with speeds between $v$ and $v + dv$. Averages are integrals: $\overline{v^2} = \int_0^\infty v^2f(v)\,dv = 3k_BT/m$, recovering $v_{\text{rms}}$. Setting $df/dv = 0$ gives the most probable speed, $v_p = \sqrt{2k_BT/m}$, and the mean speed is $\bar v = \sqrt{8k_BT/(\pi m)}$; they're in the ratio $v_p : \bar v : v_{\text{rms}} = 1 : 1.128 : 1.225$. The distribution's long high-speed tail explains evaporation: the fastest molecules escape a liquid's surface, leaving the rest cooler.

```plot
{"x": [0, 1500], "y": [0, 2.3], "xLabel": "speed v (m/s)", "yLabel": "f(v) (10⁻³ s/m)", "functions": [{"f": "1000*4*pi*(0.028/(2*pi*8.314*300))^1.5*x^2*exp(-0.028*x^2/(2*8.314*300))"}], "points": [{"at": [422, 1.97], "label": "most probable"}], "labels": [{"at": [800, 1.6], "text": "N₂ at 300 K"}], "caption": "Maxwell–Boltzmann speed distribution for nitrogen at 300 K"}
```

## Common mistakes

- Using Celsius or gauge pressure in $PV = nRT$.
- Using liters with $R = 8.314$ J/(mol·K) (convert to m³: 1 L $= 10^{-3}$ m³).
- Using grams per mole in $v_{\text{rms}} = \sqrt{3RT/M}$ (convert to kg/mol).
- Thinking all molecules in a gas move at $v_{\text{rms}}$.

## Key points

- $PV = nRT = Nk_BT$ (absolute $P$ and $T$); $R = 8.314$ J/(mol·K), $k_B = 1.38\times10^{-23}$ J/K.
- Fixed gas: $P_1V_1/T_1 = P_2V_2/T_2$.
- $\tfrac12m\overline{v^2} = \tfrac32k_BT$; $v_{\text{rms}} = \sqrt{3RT/M}$.
- Monatomic ideal gas: $E_{\text{int}} = \tfrac32nRT$; depends only on $T$.

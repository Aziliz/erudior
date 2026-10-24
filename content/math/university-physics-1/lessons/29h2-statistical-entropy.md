---
id: phys-m7-h-statistical-entropy
module: phys-m7
title: 'Counting microstates: the statistical meaning of entropy'
minutes: 45
honors: true
topics: [Statistical entropy]
drills: [phys-m7-r2-free-expansion, phys-m7-r2-boltzmann-factor]
refs: [phys-ref-waves-thermo, phys-ref-constants]
---
## From heat over temperature to counting

The second-law lesson defined entropy through heat, $\Delta S = \int dQ_{\text{rev}}/T$, and ended with Boltzmann's formula $S = k_B\ln\Omega$, which ties entropy to the number of microscopic arrangements. This lesson develops that second view. It explains *why* entropy increases (the higher-entropy states are overwhelmingly more numerous), shows that counting reproduces the thermodynamic results you already know, gives temperature a new definition, and derives the Boltzmann factor, the rule behind the Maxwell–Boltzmann speed distribution and the thinning of the atmosphere with height.

## Microstates and macrostates

A **microstate** is a complete description of every particle: which coin shows heads, where each molecule is and how fast it moves. A **macrostate** is what we can actually measure: the number of heads, or the pressure, volume and temperature of a gas. Many microstates usually look the same macroscopically. The number of microstates belonging to a macrostate is its **multiplicity**, $\Omega$.

Toss 4 coins. There are $2^4 = 16$ equally likely microstates (HHTT, HTHT, …). The macrostate "2 heads" has $\Omega = \binom42 = 6$ of them, while "4 heads" has only 1. In general, $n$ heads out of $N$ coins has multiplicity

$$\Omega(n) = \binom Nn = \frac{N!}{n!\,(N - n)!}.$$

```plot
{"x": [-0.7, 4.7], "y": [-1.4, 7.2], "grid": false, "bars": [{"x": 0, "height": 1, "width": 0.8, "label": "0"}, {"x": 1, "height": 4, "width": 0.8, "label": "1"}, {"x": 2, "height": 6, "width": 0.8, "label": "2"}, {"x": 3, "height": 4, "width": 0.8, "label": "3"}, {"x": 4, "height": 1, "width": 0.8, "label": "4"}], "labels": [{"at": [0, 1.45], "text": "1"}, {"at": [1, 4.45], "text": "4"}, {"at": [2, 6.45], "text": "6"}, {"at": [3, 4.45], "text": "4"}, {"at": [4, 1.45], "text": "1"}, {"at": [2, -1.05], "text": "number of heads"}], "caption": "Multiplicity Ω of each macrostate of 4 coins (1, 4, 6, 4, 1 for 0 to 4 heads): 16 microstates in all"}
```

The basic assumption of statistical mechanics, the **fundamental assumption**, is that an isolated system in equilibrium is equally likely to be in any of its accessible microstates. Then a macrostate's probability is its multiplicity divided by the total.

## Large numbers make the second law

With 4 coins, all heads turns up 1 time in 16. With 100 coins the middle macrostate has $\binom{100}{50} = 1.01\times10^{29}$ microstates, while all heads has 1: its probability is $2^{-100} = 7.9\times10^{-31}$. About 73% of all tosses give between 45 and 55 heads. As $N$ grows the distribution gets relatively narrower (its width grows like $\sqrt N$ while the range grows like $N$), and for $N \sim 10^{23}$ molecules a gas is, for all practical purposes, always in its most probable macrostate.

That is the statistical content of the second law. An isolated system wanders among its microstates at random; it ends up in the macrostate with the largest multiplicity simply because almost all microstates belong to it. Entropy "never decreases" because a noticeable decrease is not forbidden but fantastically improbable. In very small systems, such as a few molecules or a microscopic bead in water, short-lived decreases do happen and have been measured. The law is statistical, which matters only when $N$ is small.

## Boltzmann's entropy formula

**Boltzmann's entropy formula**,

$$S = k_B\ln\Omega,$$

connects counting to thermodynamics. (It is engraved on Boltzmann's tombstone in Vienna as $S = k\log W$, in the form later written down by Max Planck.) The logarithm is what makes entropy add: two independent systems have $\Omega = \Omega_A\Omega_B$ microstates together, so $S = S_A + S_B$. The constant $k_B = 1.38\times10^{-23}$ J/K converts the pure number $\ln\Omega$ into thermodynamic units.

### Example 1

One mole of an ideal gas expands freely into a vacuum, doubling its volume at constant temperature. Find $\Delta S$ by counting, and compare with the thermodynamic result.

Each molecule now has twice as much room, so twice as many possible positions; the speeds are unchanged because $T$ is. With $N$ independent molecules the number of microstates is multiplied by $2^N$:

$$\Delta S = k_B\ln\frac{\Omega_f}{\Omega_i} = k_B\ln 2^N = Nk_B\ln 2 = nR\ln 2.$$

For one mole, $\Delta S = 8.314\ln 2 = 5.76$ J/K, exactly the value from $\Delta S = nR\ln(V_2/V_1)$ in the second-law lesson. The counting also says how unlikely the reverse is: the chance that all $6.02\times10^{23}$ molecules are found back in the original half at some instant is $2^{-6.02\times10^{23}} = 10^{-1.8\times10^{23}}$.

## Temperature from entropy

Put two systems A and B in thermal contact, so they can exchange energy but the total $E_A + E_B$ is fixed. Energy flows until the total multiplicity $\Omega_A\Omega_B$, and so the total entropy, is as large as it can be. At that maximum $dS_A/dE_A = dS_B/dE_B$. Since the quantity that becomes equal in thermal equilibrium is temperature, this suggests the **statistical definition of temperature**:

$$\frac1T = \frac{\partial S}{\partial E}\quad(\text{volume and particle number fixed}).$$

This explains which way heat flows. If A gains energy $dE$ from B, the total entropy changes by $dS = \left(\dfrac1{T_A} - \dfrac1{T_B}\right)dE$. The second law needs $dS > 0$, so $dE > 0$ exactly when $T_A < T_B$: energy flows from hot to cold because that direction opens up more microstates.

A simple model makes this concrete. In an **Einstein solid**, each atom is modeled as three independent oscillators (one per direction), and each oscillator can hold only whole units (quanta) of energy. With $N$ oscillators sharing $q$ quanta,

$$\Omega(N, q) = \binom{q + N - 1}{q}.$$

(It is a simplified model of a crystal, but it gets the counting ideas right.)

### Example 2

Two tiny Einstein solids, A and B, each have 3 oscillators and share 6 quanta. How likely is each way of dividing the energy?

Count $\Omega_A\Omega_B$ for each $q_A$, using $\Omega(3, q) = 1, 3, 6, 10, 15, 21, 28$ for $q = 0, \dots, 6$:

| $q_A$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| $\Omega_A\Omega_B$ | 28 | 63 | 90 | 100 | 90 | 63 | 28 |

The total is 462. The even split, $q_A = 3$, is the most likely, with probability $100/462 = 22\%$, but lopsided splits are common: A holds 5 or 6 of the quanta $91/462 = 20\%$ of the time. Scale up and the picture sharpens. With 300 oscillators in A, 200 in B and 100 quanta, a computer count puts the peak at $q_A = 60$, the same energy per oscillator in both solids (equal temperatures), and 95% of all microstates lie between $q_A = 50$ and 70. For $10^{23}$ oscillators the spread is far too small to measure.

```plot
{"x": [-0.7, 6.7], "y": [-22, 118], "grid": false, "bars": [{"x": 0, "height": 28, "width": 0.8, "label": "0"}, {"x": 1, "height": 63, "width": 0.8, "label": "1"}, {"x": 2, "height": 90, "width": 0.8, "label": "2"}, {"x": 3, "height": 100, "width": 0.8, "label": "3"}, {"x": 4, "height": 90, "width": 0.8, "label": "4"}, {"x": 5, "height": 63, "width": 0.8, "label": "5"}, {"x": 6, "height": 28, "width": 0.8, "label": "6"}], "labels": [{"at": [0, 35], "text": "28"}, {"at": [1, 70], "text": "63"}, {"at": [2, 97], "text": "90"}, {"at": [3, 107], "text": "100"}, {"at": [4, 97], "text": "90"}, {"at": [5, 70], "text": "63"}, {"at": [6, 35], "text": "28"}, {"at": [3, -17], "text": "quanta in solid A"}], "caption": "Two 3-oscillator Einstein solids sharing 6 quanta: the number of microstates for each split. The even split has the most."}
```

## The Boltzmann factor

Now let a small system, such as one molecule, exchange energy with a huge reservoir at temperature $T$. If the small system takes energy $E$, the reservoir's entropy drops by $E/T$, so its number of microstates is multiplied by $e^{-E/(k_BT)}$. Each microstate of the small system is therefore weighted by the **Boltzmann factor**:

$$P(\text{state}) \propto e^{-E/(k_BT)}.$$

States whose energy is large compared with $k_BT$ (about 0.026 eV at 300 K) are rarely occupied. The Maxwell–Boltzmann speed distribution of the kinetic-theory lesson is this factor with $E = \tfrac12mv^2$, times $v^2$ to count all the directions a velocity can point.

### Example 3

In an atmosphere at a single temperature $T$, a molecule at height $y$ has potential energy $mgy$. Find how the number of molecules per volume falls with height, compare the result with the fluid-statics lesson, and find the fraction of nitrogen and of helium remaining at 10 km if $T = 300$ K.

By the Boltzmann factor, $n(y) = n_0e^{-mgy/(k_BT)} = n_0e^{-y/H}$, with **scale height**

$$H = \frac{k_BT}{mg} = \frac{RT}{Mg}.$$

For air ($M = 0.029$ kg/mol) at 293 K, $H = \dfrac{8.314(293)}{0.029(9.8)} = 8.6$ km, matching the $P_0/(\rho_0g) \approx 8.6$ km found from $dP/dy = -\rho g$. Two very different arguments, one answer.

At 300 K: N₂ ($M = 0.028$ kg/mol) has $H = 9.09$ km, so $e^{-10/9.09} = 0.33$ remains at 10 km. Helium ($M = 0.004$ kg/mol) has $H = 63.6$ km, so $e^{-10/63.6} = 0.85$ remains. Light gases thin out far more slowly. (This treats each gas separately in a still, single-temperature atmosphere, a simplification. In the real lower atmosphere, up to about 100 km, winds and turbulence keep the gases well mixed, so the composition barely changes with height.)

## The third law

As $T \to 0$, a system settles into its lowest-energy microstates. For a perfect crystal there is just one, so $\Omega = 1$ and $S = k_B\ln 1 = 0$. This is the **third law of thermodynamics**: the entropy of a perfect crystal approaches zero as the temperature approaches absolute zero. (Some solids, such as glasses, keep a little leftover entropy because their atoms are frozen into one of many disordered arrangements.)

## Common mistakes

- Thinking the second law is about one microstate being more likely than another. Every microstate is equally likely; it is the *macrostates* that differ, by their multiplicities.
- Adding multiplicities of independent systems. Multiplicities multiply; entropies add.
- Reading "entropy never decreases" as an absolute law for tiny systems. It is statistical, and fluctuations matter when $N$ is small.
- Using $e^{-E/(k_BT)}$ with $E$ in joules but $k_BT$ in eV (or the reverse). Keep the units the same.
- Treating "disorder" as the definition of entropy. The precise statement is $S = k_B\ln\Omega$.

## Key points

- Microstate: full microscopic description. Macrostate: the measurable description. Multiplicity $\Omega$: microstates per macrostate.
- Fundamental assumption: all accessible microstates of an isolated system are equally likely.
- $S = k_B\ln\Omega$; for large $N$ the most probable macrostate is overwhelmingly likely, which is the second law.
- Free expansion by a factor $V_2/V_1$: $\Delta S = Nk_B\ln(V_2/V_1) = nR\ln(V_2/V_1)$, from counting.
- $1/T = \partial S/\partial E$; energy flows from hot to cold because that increases the total entropy.
- Boltzmann factor $e^{-E/(k_BT)}$; isothermal atmosphere $n \propto e^{-y/H}$, $H = RT/(Mg)$.
- Third law: $S \to 0$ for a perfect crystal as $T \to 0$.

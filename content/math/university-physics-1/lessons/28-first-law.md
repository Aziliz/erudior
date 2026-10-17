---
id: phys-first-law
module: phys-m7
title: The first law of thermodynamics
minutes: 40
topics: [First law of thermodynamics]
drills: [phys-first-law, phys-isobaric-work, phys-isothermal-work]
refs: [phys-ref-waves-thermo]
---
## Energy conservation, thermal edition

A gas in a cylinder can be heated, and it can push a piston. Heat flows in, work flows out, and the gas's internal energy changes. The first law of thermodynamics is the energy-conservation statement that ties these together. It's the foundation for understanding engines, refrigerators and the weather, and it builds directly on the ideal gas model from the last lesson.

## Work done by a gas

When a gas at pressure $P$ pushes a piston of area $A$ out a distance $dx$, it does work $F\,dx = PA\,dx = P\,dV$. Over a finite change at constant pressure,

$$W = P\,\Delta V.$$

When the pressure changes during the process, the work is the area under the curve on a **PV diagram** (pressure vs volume). Expanding gas does positive work on its surroundings; compressed gas has negative work done by it (positive work done on it). The work depends on the path between two states, not just the endpoints: going from state A to state B by different routes encloses different areas.

## The first law

The **internal energy** $E_{\text{int}}$ (often written $U$) of a system is the total energy of its molecules. Energy can enter as heat $Q$ or leave as work $W$ done by the system. The **first law of thermodynamics** states

$$\Delta E_{\text{int}} = Q - W,$$

with the sign convention: $Q > 0$ when heat flows *into* the system, $W > 0$ when the system does work *on* its surroundings. (Some books, especially in chemistry, use $W$ for work done *on* the system and write $\Delta U = Q + W$; the physics is identical.)

Internal energy is a **state variable**: it depends only on the current state (for an ideal gas, only on $T$), not on history. $Q$ and $W$ individually depend on the path, but their difference doesn't.

### Example 1

A gas absorbs 500 J of heat while doing 200 J of work expanding against a piston. What is the change in its internal energy? Then the gas is compressed: 300 J of work is done on it while it releases 100 J of heat. What is the change now?

First process: $\Delta E_{\text{int}} = 500 - 200 = +300$ J.

Second: $W = -300$ J (work done *by* the gas is negative), $Q = -100$ J. $\Delta E_{\text{int}} = -100 - (-300) = +200$ J.

## Four standard processes

For an ideal gas (monatomic, $E_{\text{int}} = \tfrac32nRT$), four idealized processes cover most problems.

| Process | Held fixed | Work by gas $W$ | Key fact |
|---|---|---|---|
| **Isobaric** | $P$ | $P\Delta V$ | $Q = nC_P\Delta T$ |
| **Isochoric** (isovolumetric) | $V$ | 0 | $Q = \Delta E_{\text{int}} = nC_V\Delta T$ |
| **Isothermal** | $T$ | $nRT\ln(V_f/V_i)$ | $\Delta E_{\text{int}} = 0$, so $Q = W$ |
| **Adiabatic** | no heat flow, $Q = 0$ | $-\Delta E_{\text{int}}$ | $PV^\gamma$ = constant |

The **molar specific heats** of an ideal monatomic gas are $C_V = \tfrac32R$ at constant volume and $C_P = C_V + R = \tfrac52R$ at constant pressure. Heating at constant pressure takes more heat for the same temperature rise because some of the energy goes into work as the gas expands. The ratio $\gamma = C_P/C_V$ is $\tfrac53$ for monatomic and about $\tfrac75$ for diatomic gases.

```plot
{"x": [0, 5], "y": [0, 5], "xLabel": "V", "yLabel": "P", "functions": [{"f": "4", "from": 1, "to": 4, "label": "isobaric"}, {"f": "4/x", "from": 1, "to": 4.5, "label": "isothermal", "dashed": true}, {"f": "4/x^(5/3)", "from": 1, "to": 4.5, "label": "adiabatic"}], "segments": [{"from": [1, 0.3], "to": [1, 4]}], "labels": [{"at": [0.55, 2.2], "text": "isochoric"}], "caption": "Processes starting from the same state on a PV diagram; the adiabat falls more steeply than the isotherm"}
```

In an adiabatic expansion the gas does work using its own internal energy, so it cools. That's why air rising in the atmosphere cools and clouds form, and why a spray can gets cold. Adiabatic compression heats a gas: diesel engines ignite fuel this way without spark plugs.

### Example 2

Two moles of a monatomic ideal gas are heated at constant pressure (1.0 atm) from 300 K to 400 K. Find $W$, $\Delta E_{\text{int}}$ and $Q$.

$W = P\Delta V = nR\Delta T = 2(8.314)(100) = 1663$ J.

$\Delta E_{\text{int}} = \tfrac32nR\Delta T = 2494$ J.

$Q = \Delta E_{\text{int}} + W = 4157$ J (check: $nC_P\Delta T = 2(\tfrac52)(8.314)(100) = 4157$ J ✓).

## Cycles

In a **cyclic process** the gas returns to its starting state, so $\Delta E_{\text{int}} = 0$ over the cycle and the net heat absorbed equals the net work done: $Q_{\text{net}} = W_{\text{net}}$. On a PV diagram the net work is the area enclosed by the loop, positive if the loop runs clockwise. Engines run clockwise cycles, turning heat into work; that's the subject of the next lesson.

## Work as an integral

In general the work done by a gas is

$$W = \int_{V_i}^{V_f}P\,dV.$$

*Isothermal ideal gas.* With $P = nRT/V$ and $T$ constant,

$$W = nRT\int_{V_i}^{V_f}\frac{dV}{V} = nRT\ln\frac{V_f}{V_i}.$$

*Adiabatic ideal gas.* With $dQ = 0$, the first law gives $nC_V\,dT = -P\,dV$. Using $PV = nRT$ to eliminate $dT$ and separating variables leads to $\dfrac{dP}{P} = -\gamma\dfrac{dV}{V}$, so $PV^\gamma = \text{constant}$ (equivalently, $TV^{\gamma - 1}$ is constant). The work is $W = \dfrac{P_iV_i - P_fV_f}{\gamma - 1}$.

### Example 3

One mole of an ideal gas expands isothermally at 300 K from 10 L to 30 L. How much work does it do, and how much heat does it absorb?

$W = (1)(8.314)(300)\ln 3 = 2494(1.0986) = 2740$ J. Isothermal means $\Delta E_{\text{int}} = 0$, so $Q = W = 2740$ J: all the heat absorbed is converted to work during this one stroke.

### Example 4

A monatomic gas at 1.0 atm and 300 K is compressed adiabatically to one-eighth of its volume. What are its final pressure and temperature?

$P_f = P_i(V_i/V_f)^\gamma = 1.0(8)^{5/3} = 32$ atm. $T_f = T_i(V_i/V_f)^{\gamma - 1} = 300(8)^{2/3} = 1200$ K. A modest compression heats the gas enormously, the principle behind the diesel engine.

## Common mistakes

- Mixing sign conventions for $W$ (decide whether $W$ is by or on the gas and stick to it).
- Thinking isothermal means no heat flow (it means no temperature change; adiabatic means no heat flow).
- Using $W = P\Delta V$ when the pressure changes.
- Using $\Delta E_{\text{int}} = nC_P\Delta T$; for an ideal gas it's always $nC_V\Delta T$, whatever the process.

## Key points

- $\Delta E_{\text{int}} = Q - W$ ($Q$ into the system, $W$ by the system).
- Work by a gas = area under the PV curve $= \int P\,dV$; path-dependent.
- Isobaric $W = P\Delta V$; isochoric $W = 0$; isothermal $\Delta E_{\text{int}} = 0$, $W = nRT\ln(V_f/V_i)$; adiabatic $Q = 0$, $PV^\gamma$ const.
- Monatomic ideal gas: $C_V = \tfrac32R$, $C_P = \tfrac52R$, $\gamma = \tfrac53$.
- Cycle: $\Delta E_{\text{int}} = 0$, net work = enclosed area.

---
id: phys-fluid-statics
module: phys-m7
title: Pressure and buoyancy
minutes: 40
topics: [Pressure, Buoyancy]
drills: [phys-pressure-depth, phys-buoyancy, phys-hydraulic]
refs: [phys-ref-waves-thermo]
---
## Mechanics for things that flow

Liquids and gases don't keep a shape, so tracking forces on individual pieces is impractical. Instead we describe fluids with two quantities spread over space: density and pressure. This lesson covers fluids at rest: why pressure grows with depth, how hydraulic lifts multiply force, and why ships float. The next lesson sets fluids in motion.

## Density and pressure

**Density** is mass per unit volume, $\rho = m/V$ (kg/m³). Water is 1000 kg/m³ (1 g/cm³), air at sea level about 1.2 kg/m³, mercury 13 600 kg/m³.

**Pressure** is the perpendicular force per unit area a fluid exerts on a surface:

$$P = \frac FA.$$

Its SI unit is the **pascal**, $1\text{ Pa} = 1\text{ N/m}^2$. Atmospheric pressure at sea level is $1\text{ atm} = 1.013\times10^5$ Pa, about 14.7 pounds per square inch. Pressure in a fluid at rest acts equally in all directions at a point and always pushes perpendicular to any surface it touches.

## Pressure increases with depth

Picture a column of fluid of height $h$ and cross-section $A$. The fluid below must support the column's weight, $\rho(Ah)g$, plus the pressure pushing down on top. Dividing by $A$:

$$P = P_0 + \rho g h,$$

where $P_0$ is the pressure at the surface. Every 10 m of water adds about 1 atm, so a diver at 30 m feels about 4 atm in total. The pressure depends only on depth, not on the container's shape or width: water 2 m deep in a narrow tube and in a swimming pool exerts the same pressure at the bottom.

**Gauge pressure** is pressure above atmospheric, $P - P_{\text{atm}}$; tire gauges read it. **Absolute pressure** is the total. A tire "at 32 psi" has an absolute pressure of about 47 psi.

### Example 1

What is the absolute pressure 12 m below the surface of a lake? What net force does it exert on a diver's mask of area 0.020 m² (with air inside at 1 atm)?

$P = 1.013\times10^5 + 1000(9.8)(12) = 1.013\times10^5 + 1.176\times10^5 = 2.19\times10^5$ Pa.

Net force: the gauge pressure times area, $(1.176\times10^5)(0.020) = 2350$ N inward, about the weight of 240 kg. That's why masks must be equalized by breathing into them.

## Barometers and manometers

A mercury **barometer** is a sealed tube inverted in a dish of mercury. The column falls until its weight balances atmospheric pressure: $P_{\text{atm}} = \rho_{\text{Hg}}gh$, giving $h = 760$ mm at sea level. That's why pressure is also quoted in mm Hg (blood pressure of "120/80" is in mm Hg, gauge). A water barometer would need a column over 10 m tall.

## Pascal's principle and hydraulics

A change in pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid. This is **Pascal's principle**. In a hydraulic lift, a small force $F_1$ on a small piston of area $A_1$ creates a pressure $F_1/A_1$, which acts on a large piston of area $A_2$:

$$\frac{F_1}{A_1} = \frac{F_2}{A_2} \quad\Rightarrow\quad F_2 = F_1\frac{A_2}{A_1}.$$

Force is multiplied, but energy isn't created: the volume pushed in equals the volume pushed out, $A_1d_1 = A_2d_2$, so the small piston moves much farther. Work in equals work out, $F_1d_1 = F_2d_2$, just as with pulleys.

![A hydraulic lift: a small force F₁ on a small piston of area A₁ produces a pressure that the fluid passes on to a large piston of area A₂, which pushes up on the load with force F₂ = F₁A₂/A₁.](images/phys-m7-hydraulic.svg)

### Example 2

A car lift has pistons of diameter 2.0 cm and 30 cm. What force on the small piston lifts a 1500 kg car? How far must it move to raise the car 0.10 m?

Area ratio $= (30/2.0)^2 = 225$ (areas scale with diameter squared). $F_1 = \dfrac{1500(9.8)}{225} = 65.3$ N.

Distance: $d_1 = 225(0.10) = 22.5$ m, achieved in practice by many short pump strokes.

## Archimedes' principle and buoyancy

A submerged object has higher pressure on its bottom than its top, because the bottom is deeper. The net upward force is the **buoyant force**. **Archimedes' principle** gives its size:

$$F_B = \rho_{\text{fluid}}\,V_{\text{displaced}}\,g,$$

the weight of the fluid the object displaces. *Why:* imagine replacing the object by fluid of the same shape. That fluid would sit in equilibrium, so the surrounding fluid must push up on it with exactly its weight. The surrounding fluid doesn't know what's inside, so it pushes the same on the object.

The picture shows the pressure forces on a submerged block. The side forces cancel, but the bottom face is deeper than the top, so it is pushed harder: the difference $(P_2 - P_1)A = \rho_{\text{fluid}}g(h_2 - h_1)A = \rho_{\text{fluid}}Vg$ is the buoyant force.

![A block held under water. Short arrows push down on its top face at depth h₁ and longer arrows push up on its bottom face at depth h₂; equal arrows push on the sides. The difference is the upward buoyant force, equal to the weight of displaced fluid.](images/phys-m7-buoyancy.svg)

Compare $F_B$ with the object's weight $\rho_{\text{obj}}Vg$ when fully submerged:

- $\rho_{\text{obj}} > \rho_{\text{fluid}}$: sinks (a rock in water).
- $\rho_{\text{obj}} < \rho_{\text{fluid}}$: rises and floats.
- Equal: neutrally buoyant (a fish adjusting its swim bladder, a submarine).

```mermaid
flowchart TD
  accTitle: Will it sink or float?
  accDescr: Compare the object's average density with the fluid's density. If the object is denser, it sinks and its apparent weight is its weight minus the buoyant force. If it is less dense, it rises and floats with the fraction rho object over rho fluid submerged. If the densities are equal, it is neutrally buoyant and stays wherever it is placed.
  A["Compare average density of the object with the fluid"] --> B{"Which is larger?"}
  B -- "object denser" --> C["Sinks: apparent weight = weight minus buoyant force"]
  B -- "fluid denser" --> D["Rises and floats"]
  D --> E["Submerged fraction = rho object / rho fluid"]
  B -- "equal" --> F["Neutrally buoyant: stays where placed"]
```

A floating object sinks until it displaces its own weight of fluid, so the submerged fraction is

$$\frac{V_{\text{sub}}}{V} = \frac{\rho_{\text{obj}}}{\rho_{\text{fluid}}}.$$

Ice (917 kg/m³) floats in seawater (1025 kg/m³) with $917/1025 = 89\%$ submerged: the tip of the iceberg is about a tenth. A steel ship floats because its hull encloses lots of air, so its average density is below water's.

### Example 3

A 2.0 kg block of aluminum ($\rho = 2700$ kg/m³) hangs from a spring scale, fully submerged in water. What does the scale read?

Volume: $V = 2.0/2700 = 7.41\times10^{-4}$ m³. Buoyant force: $1000(7.41\times10^{-4})(9.8) = 7.26$ N. Weight: 19.6 N. Scale reading (apparent weight): $19.6 - 7.26 = 12.3$ N.

Archimedes is said to have used this idea to test whether a crown was pure gold: compare its weight in air and in water to find its density.

### Example 4

A wooden raft of density 600 kg/m³ is 3.0 m × 2.0 m × 0.20 m. How much additional mass can it carry before its top is level with the water?

Fully submerged, it displaces $1.2$ m³ of water: $F_B = 1000(1.2)(9.8) = 11\,760$ N. The raft weighs $600(1.2)(9.8) = 7056$ N. The difference, 4704 N, supports a load of $4704/9.8 = 480$ kg.

## Pressure as a differential equation

The depth relation is really a differential equation. For a thin horizontal slab of fluid of thickness $dy$ (with $y$ up), balancing forces gives

$$\frac{dP}{dy} = -\rho g.$$

For a liquid, $\rho$ is constant and integrating gives $P = P_0 + \rho gh$. For the atmosphere, density is proportional to pressure (ideal gas, constant temperature): $\rho = \rho_0P/P_0$. Then $\dfrac{dP}{dy} = -\dfrac{\rho_0g}{P_0}P$, so pressure decays exponentially with altitude:

$$P(y) = P_0e^{-y/H}, \qquad H = \frac{P_0}{\rho_0g} \approx 8.6\text{ km}.$$

The total force on a dam also needs an integral, since pressure varies over its face. On a vertical wall of width $w$ holding water of depth $D$ (gauge pressure $\rho g(D - y)$ at height $y$):

$$F = \int_0^D\rho g(D - y)\,w\,dy = \tfrac12\rho gwD^2,$$

which equals the average gauge pressure, $\tfrac12\rho gD$, times the area.

## Common mistakes

- Thinking pressure at depth depends on the container's shape or total volume.
- Mixing gauge and absolute pressure.
- Using the object's density, not the fluid's, in the buoyant force.
- Using the object's full volume for a floating object (only the submerged volume displaces fluid).
- Scaling piston areas with diameter instead of diameter squared.

## Key points

- $\rho = m/V$; $P = F/A$; 1 atm $= 1.013\times10^5$ Pa.
- $P = P_0 + \rho gh$; gauge = absolute − atmospheric.
- Pascal: $F_1/A_1 = F_2/A_2$.
- Archimedes: $F_B = \rho_{\text{fluid}}V_{\text{disp}}g$; floating fraction $= \rho_{\text{obj}}/\rho_{\text{fluid}}$.
- $dP/dy = -\rho g$.

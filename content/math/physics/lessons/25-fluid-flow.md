---
id: phys-fluid-flow
module: phys-m7
title: Fluid flow and Bernoulli's equation
minutes: 35
topics: [Fluid dynamics]
drills: [phys-continuity, phys-bernoulli, phys-torricelli]
refs: [phys-ref-waves-thermo]
---
## Fluids in motion

Water speeds up when you put your thumb over a hose. A shower curtain billows inward when the water runs. Airplane wings, perfume atomizers and chimneys all rely on the same physics. This lesson adds motion to the previous lesson's fluid statics, using two conservation laws: conservation of mass gives the continuity equation, and conservation of energy gives Bernoulli's equation.

## The ideal fluid

Real flows can be turbulent and sticky. We'll use a simplified model, an **ideal fluid**, that captures a great deal:

- incompressible (constant density, good for liquids and for gases at modest speeds);
- nonviscous (no internal friction);
- steady (the velocity at each point doesn't change with time);
- irrotational (no swirling eddies).

In steady flow, fluid moves along **streamlines**, paths that never cross. Where streamlines crowd together, the fluid moves faster.

## The continuity equation

In a pipe whose cross-section changes, the same volume of fluid must pass every point each second; otherwise fluid would pile up or vanish. The **volume flow rate** is $Q = Av$ (m³/s), so

$$A_1v_1 = A_2v_2.$$

This is the **continuity equation**. A narrower section forces faster flow. Squeezing a hose to a quarter of its area quadruples the water's speed.

### Example 1

Water flows at 1.5 m/s through a pipe of diameter 4.0 cm, which narrows to 1.0 cm. How fast does it flow in the narrow section, and what is the flow rate in liters per second?

The diameter shrinks by a factor of 4, so the area shrinks by 16: $v_2 = 16(1.5) = 24$ m/s.

$Q = A_1v_1 = \pi(0.020)^2(1.5) = 1.88\times10^{-3}$ m³/s $= 1.88$ L/s.

## Bernoulli's equation

As fluid speeds up into a narrow section, it gains kinetic energy. Something must do work on it: the pressure behind it must exceed the pressure ahead. Applying the work–energy theorem to a chunk of fluid moving along a streamline (pressure forces do work $P_1A_1\Delta x_1 - P_2A_2\Delta x_2 = (P_1 - P_2)\Delta V$, gravity does $-\rho\Delta V g(y_2 - y_1)$) gives

$$P_1 + \tfrac12\rho v_1^2 + \rho gy_1 = P_2 + \tfrac12\rho v_2^2 + \rho gy_2.$$

This is **Bernoulli's equation**: along a streamline, $P + \tfrac12\rho v^2 + \rho gy$ is constant. Each term is an energy per unit volume. When $v = 0$ everywhere it reduces to $P = P_0 + \rho gh$ from fluid statics.

The headline consequence, the **Bernoulli effect**: at the same height, *faster flow means lower pressure*. That explains:

- the shower curtain (fast-moving air and water inside lower the pressure there);
- a roof lifted off in a storm (fast wind above, still air inside at higher pressure);
- part of an airplane wing's lift (air moves faster over the curved top);
- a Venturi meter, which measures flow speed from the pressure drop at a constriction.

### Example 2

In Example 1's pipe (horizontal), the pressure in the wide section is $2.50\times10^5$ Pa. What is the pressure in the narrow section?

$P_2 = P_1 + \tfrac12\rho(v_1^2 - v_2^2) = 2.50\times10^5 + \tfrac12(1000)(1.5^2 - 24^2)$

$= 2.50\times10^5 + 500(2.25 - 576) = 2.50\times10^5 - 2.87\times10^5 = -3.7\times10^4$ Pa.

A negative absolute pressure is impossible: the answer means this flow can't actually happen. The liquid would cavitate (boil into vapor bubbles) as the pressure dropped toward zero. Bernoulli's equation is telling us the pipe narrows too sharply for this flow rate. With a gentler narrowing, say to 2.0 cm ($v_2 = 6.0$ m/s), $P_2 = 2.50\times10^5 - 500(36 - 2.25) = 2.33\times10^5$ Pa, a sensible drop.

## Torricelli's theorem

Water leaks from a hole a depth $h$ below the open surface of a large tank. At the surface and at the hole the pressure is atmospheric, and the surface barely moves. Bernoulli's equation then gives $\tfrac12\rho v^2 = \rho gh$:

$$v = \sqrt{2gh},$$

**Torricelli's theorem**: the same speed as an object falling from the surface level. Energy conservation per unit volume, in disguise.

### Example 3

A water tower's surface is 25 m above a faucet. Ignoring friction in the pipes, how fast does water leave the open faucet? What is the gauge pressure at a closed faucet?

$v = \sqrt{2(9.8)(25)} = 22.1$ m/s. With the faucet closed, $v = 0$ and the full height becomes pressure: $\rho gh = 1000(9.8)(25) = 2.45\times10^5$ Pa gauge, about 2.4 atm.

## Viscosity, briefly

Real fluids have **viscosity**, internal friction between layers. In a pipe, viscous fluid moves fastest at the center and is still at the walls. For smooth (laminar) flow, the flow rate through a pipe of radius $R$ and length $L$ under pressure difference $\Delta P$ is $Q = \dfrac{\pi R^4\Delta P}{8\eta L}$ (Poiseuille's law), where $\eta$ is the viscosity. The $R^4$ is dramatic: narrowing an artery by 20% cuts the flow by 59% at the same pressure. At high speeds flow becomes turbulent, and Bernoulli's equation only roughly applies.

## Pipes that change height

When a pipe climbs, the fluid gains gravitational energy, and that also has to be paid for out of pressure. All three terms of Bernoulli's equation then come into play. A good routine: use continuity to get any unknown speed first, then Bernoulli for the pressure.

### Example 4

Water enters a building's basement at a speed of 2.0 m/s and a pressure of $3.0\times10^5$ Pa through a pipe of diameter 4.0 cm. A pipe of diameter 2.0 cm carries it to a bathroom 6.0 m higher. Find the speed and pressure there.

Continuity: the diameter halves, so the area is quartered and the speed quadruples, $v_2 = 4(2.0) = 8.0$ m/s.

Bernoulli, with $y_1 = 0$ and $y_2 = 6.0$ m:

$P_2 = P_1 + \tfrac12\rho(v_1^2 - v_2^2) - \rho g(y_2 - y_1)$

$= 3.0\times10^5 + 500(4.0 - 64) - 1000(9.8)(6.0)$

$= 3.0\times10^5 - 3.0\times10^4 - 5.88\times10^4 = 2.11\times10^5$ Pa.

About a third of the pressure drop comes from the speed increase and two-thirds from the climb. Upper floors of tall buildings get low water pressure for this reason, so tall buildings pump water to rooftop tanks.

A draining tank is a related case. By Torricelli's theorem the outflow speed depends on $\sqrt h$, so as the level falls the water comes out more slowly. A tank therefore empties quickly at first and slowly at the end; halving the depth only cuts the outflow speed to $1/\sqrt2 \approx 71\%$ of its starting value.

## Common mistakes

- Scaling speed with diameter instead of diameter squared in the continuity equation.
- Thinking faster flow means *higher* pressure.
- Forgetting the $\rho gy$ term when the pipe changes height.
- Applying Bernoulli's equation across a pump or a strongly viscous section.

## Key points

- Ideal fluid: incompressible, nonviscous, steady, irrotational.
- Continuity: $A_1v_1 = A_2v_2$; flow rate $Q = Av$.
- Bernoulli: $P + \tfrac12\rho v^2 + \rho gy$ = constant along a streamline; faster flow, lower pressure.
- Torricelli: $v = \sqrt{2gh}$ for a hole at depth $h$.

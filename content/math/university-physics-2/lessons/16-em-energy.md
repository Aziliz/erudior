---
id: phys-em-energy
module: phys-m11
title: Energy and momentum in electromagnetic waves
minutes: 40
topics: [Energy in electromagnetic waves]
drills: [phys-em-intensity, phys-radiation-pressure]
refs: [phys-ref-em-modern, phys-ref-constants]
---
## Sunlight is an energy delivery

Every second, sunlight brings each square meter of space near Earth about 1360 joules. It crossed 150 million kilometers of empty space to get here, so the energy must travel with the fields themselves. The previous lesson quoted two results about this: the intensity $I = \tfrac12c\varepsilon_0E_0^2$ and the radiation pressure $I/c$. This lesson derives them from field energy you already know, introduces the vector that tracks where electromagnetic energy flows, and uses it to find the push of light on a sail and the energy flowing into a plain resistor.

## Energy density in a wave

The capacitor lesson gave the energy stored per volume in an electric field, and the inductance lesson did the same for a magnetic field:

$$u_E = \tfrac12\varepsilon_0E^2, \qquad u_B = \frac{B^2}{2\mu_0}.$$

In an electromagnetic wave the fields are tied together by $B = E/c$, and $c^2 = 1/(\mu_0\varepsilon_0)$. Substituting,

$$u_B = \frac{E^2}{2\mu_0c^2} = \frac{\varepsilon_0E^2}{2} = u_E.$$

The energy is shared *equally* between the electric and magnetic fields, even though $B$ looks tiny in SI units (a field of 1000 V/m comes with only 3.3 μT). The total **energy density** at any instant is

$$u = u_E + u_B = \varepsilon_0E^2.$$

As the wave passes a point, $E = E_0\sin(kx - \omega t)$ swings back and forth and $u$ swings between 0 and $\varepsilon_0E_0^2$. The average of $\sin^2$ over a cycle is $\tfrac12$, so the average energy density is $u_{\text{avg}} = \tfrac12\varepsilon_0E_0^2$.

## The Poynting vector

How fast does this energy move? Picture a flat area $A$ facing the oncoming wave. In a time $dt$ the wave advances $c\,dt$, so all the energy in a slab of volume $Ac\,dt$ crosses the area: $dU = uAc\,dt$. The energy crossing per unit time per unit area is therefore

$$S = uc = c\varepsilon_0E^2 = \frac{EB}{\mu_0},$$

where the last form uses $c\varepsilon_0E = E/(c\mu_0) = B/\mu_0$. Energy flows along the direction of travel, which is perpendicular to both fields, so the natural vector is the **Poynting vector**

$$\vec S = \frac{1}{\mu_0}\vec E\times\vec B,$$

measured in W/m². It points the way the energy is going, and its size is the power crossing each square meter at that instant. For a wave with $\vec E$ along $y$ and $\vec B$ along $z$, $\hat\jmath\times\hat k = \hat\imath$: the wave travels in $+x$, as it must.

```plot
{"x": [0, 12.6], "y": [-1.2, 1.4], "functions": [{"f": "sin(x)"}, {"f": "sin(x)^2"}, {"f": "0.5", "dashed": true, "label": "average"}], "labels": [{"at": [5.4, -0.75], "text": "E/E₀"}, {"at": [3.6, 1.2], "text": "S/S_max"}], "xLabel": "phase (rad)", "yLabel": "", "caption": "As the field oscillates, the energy flow S ∝ sin² pulses at twice the frequency and never reverses; its average is half the peak"}
```

## Intensity

The fields oscillate far too fast for any detector to follow (hundreds of trillions of times a second for visible light), so what we measure is the time average of $S$, the **intensity**:

$$I = S_{\text{avg}} = \frac{E_0B_0}{2\mu_0} = \tfrac12c\varepsilon_0E_0^2 = \frac{cB_0^2}{2\mu_0} = cu_{\text{avg}}.$$

In terms of rms fields, $E_{\text{rms}} = E_0/\sqrt2$, it is simply $I = c\varepsilon_0E_{\text{rms}}^2$, just as rms voltages made AC power look like DC power.

A small source radiating power $P$ equally in all directions spreads it over spheres of area $4\pi r^2$, so

$$I = \frac{P}{4\pi r^2},$$

the inverse-square law. Since $I \propto E_0^2$, the field amplitude falls as $1/r$.

### Example 1

Sunlight at Earth's distance has intensity 1360 W/m². Find the peak electric and magnetic fields and the average energy density.

$E_0 = \sqrt{\dfrac{2I}{c\varepsilon_0}} = \sqrt{\dfrac{2(1360)}{(3.00\times10^8)(8.85\times10^{-12})}} = 1.01\times10^3$ V/m.

$B_0 = \dfrac{E_0}{c} = \dfrac{1.01\times10^3}{3.00\times10^8} = 3.37\times10^{-6}$ T, a tenth of Earth's magnetic field.

$u_{\text{avg}} = \dfrac{I}{c} = \dfrac{1360}{3.00\times10^8} = 4.53\times10^{-6}$ J/m³. A cubic meter of sunlight holds only a few microjoules; the power is large because that energy moves at $c$.

### Example 2

A radio station radiates 50 kW, roughly equally in all directions. What are the intensity and peak electric field 10 km away?

$I = \dfrac{P}{4\pi r^2} = \dfrac{5.0\times10^4}{4\pi(1.0\times10^4)^2} = 3.98\times10^{-5}$ W/m².

$E_0 = \sqrt{\dfrac{2I}{c\varepsilon_0}} = \sqrt{\dfrac{2(3.98\times10^{-5})}{(3.00\times10^8)(8.85\times10^{-12})}} = 0.17$ V/m. A receiver detects fields this weak easily; at 20 km the field would be half as large.

## Momentum and radiation pressure

Maxwell's equations show that an electromagnetic wave carrying energy $U$ also carries momentum

$$p = \frac Uc,$$

the same relation as for a photon, which the modern physics module meets. When light is absorbed by a surface, the momentum it delivers per second, per square meter, is $I/c$. Force per area is pressure, so the **radiation pressure** is

- $P_{\text{rad}} = I/c$ on a surface that absorbs the light completely;
- $P_{\text{rad}} = 2I/c$ on one that reflects it straight back, because the light's momentum is reversed, not just stopped.

On an area $A$ facing the light, the force is $IA/c$ or $2IA/c$. These are tiny everyday forces: full sunlight presses on an absorbing surface with $4.5\times10^{-6}$ Pa, less than a ten-billionth of atmospheric pressure. But in space nothing else is pushing. Radiation pressure helps push comet dust into tails that point away from the Sun, and it is the engine of a solar sail. In laboratories, focused laser beams ("optical tweezers") hold and move single cells.

### Example 3

A solar sail is a flat mirror of area 800 m² facing the Sun at Earth's distance (1360 W/m²). Its spacecraft has a total mass of 10 kg. Find the force and the speed gained in 30 days, ignoring gravity.

The sail reflects, so $F = \dfrac{2IA}{c} = \dfrac{2(1360)(800)}{3.00\times10^8} = 7.25\times10^{-3}$ N.

$a = F/m = 7.25\times10^{-4}$ m/s². In 30 days ($2.59\times10^6$ s), $\Delta v = at = 1.9\times10^3$ m/s. The push is feeble but never stops, and it needs no fuel.

## Where the energy enters a resistor

The Poynting vector also says something surprising about ordinary circuits. Take a straight resistor wire of radius $a$ and length $L$ carrying current $I$ with voltage $V$ across it. Inside, the electric field points along the wire with $E = V/L$. At the surface, the current's magnetic field circles the wire with $B = \mu_0I/(2\pi a)$. Then $\vec E\times\vec B$ points radially *inward*, with magnitude

$$S = \frac{EB}{\mu_0} = \frac{V}{L}\cdot\frac{I}{2\pi a}.$$

Multiplying by the wire's surface area $2\pi aL$ gives a total inflow of exactly $VI$, the power the resistor turns into heat. The energy doesn't travel down the inside of the wire with the electrons; it flows in through the surrounding space, carried by the fields, and the wires guide it.

## Common mistakes

- Forgetting the $\tfrac12$ when averaging: $I = \tfrac12c\varepsilon_0E_0^2$ uses the peak field, $I = c\varepsilon_0E_{\text{rms}}^2$ the rms field.
- Assuming the magnetic field carries negligible energy because $B$ is numerically small. It carries exactly half.
- Using $I/c$ for a reflecting surface (it's $2I/c$).
- Treating $I$ as power. Intensity is power per area; multiply by the area to get power or force.
- Taking the field to fall as $1/r^2$ from a point source. The intensity does; the field amplitude falls as $1/r$.

## Key points

- Energy density $u = \tfrac12\varepsilon_0E^2 + \dfrac{B^2}{2\mu_0} = \varepsilon_0E^2$, split equally; average $\tfrac12\varepsilon_0E_0^2$.
- Poynting vector $\vec S = \dfrac{1}{\mu_0}\vec E\times\vec B$: energy flow per area per time, along the direction of travel.
- Intensity $I = \dfrac{E_0B_0}{2\mu_0} = \tfrac12c\varepsilon_0E_0^2 = cu_{\text{avg}}$; point source $I = P/(4\pi r^2)$.
- Momentum $p = U/c$; radiation pressure $I/c$ (absorbed) or $2I/c$ (reflected).

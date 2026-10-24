---
id: phys-m7-h-radiation-balance
module: phys-m7
title: Insulation, radiation, and a planet's temperature
minutes: 45
honors: true
topics: [Insulation and radiation, Planetary energy balance]
drills: [phys-m7-r2-wall, phys-m7-r2-net-radiation, phys-m7-r2-eq-temp]
refs: [phys-ref-waves-thermo, phys-ref-constants]
---
## Heat flow on a larger scale

The heat lesson introduced conduction through a slab, $Q/t = kA\Delta T/L$, and radiation, $P = e\sigma AT^4$. This lesson puts both to work on two practical questions. First: how do layers of insulation combine in the wall of a house? Second, and bigger: what sets the temperature of a whole planet? The answer to the second uses nothing more than the Stefan–Boltzmann law, the inverse-square law and energy balance, and it explains the greenhouse effect in a few lines.

## Layers in series: thermal resistance

Rewrite the conduction formula as heat flow per unit area:

$$\frac{Q/t}{A} = \frac{\Delta T}{L/k}.$$

The quantity $L/k$ measures how strongly a layer resists heat flow. It is the layer's **thermal resistance** per unit area, $R = L/k$, in m²·K/W, and it is what insulation is rated by (the "R-value"). In the United States, R-values are quoted in ft²·°F·h/Btu; one US unit equals 0.176 m²·K/W, so "R-13" fiberglass is about 2.3 m²·K/W.

When heat flows straight through several layers, the same heat flow passes through each one, and the temperature drops across the layers add up to the total $\Delta T$. That makes the resistances add, just like resistors in series:

$$R_{\text{total}} = R_1 + R_2 + \cdots, \qquad \frac{Q}{t} = \frac{A\,\Delta T}{R_{\text{total}}}.$$

Each layer takes a share of the temperature drop in proportion to its resistance.

### Example 1

A 10 m² wall is made of 1.2 cm of drywall ($k = 0.17$ W/(m·K)), 9.0 cm of fiberglass ($k = 0.040$) and 2.0 cm of wood sheathing ($k = 0.12$). Inside is 20°C and outside −5°C. Find the rate of heat loss and the temperature drop across the fiberglass.

$R_{\text{drywall}} = 0.012/0.17 = 0.071$, $R_{\text{fiberglass}} = 0.090/0.040 = 2.25$, $R_{\text{wood}} = 0.020/0.12 = 0.167$, all in m²·K/W. Total: $R = 2.49$ m²·K/W.

$$\frac{Q}{t} = \frac{(10)(25)}{2.49} = 100\text{ W}.$$

The fiberglass takes $\dfrac{2.25}{2.49}(25) = 22.6$ K of the 25 K drop. The thin, conducting layers hardly matter; the insulation does almost all the work. (A real wall also has thin films of still air on each surface, which add a little more resistance, and wooden studs, which conduct heat around the insulation.)

## Radiation in and out

Every surface radiates according to its own temperature, and it also absorbs radiation from its surroundings. A good emitter is also a good absorber: a surface's **emissivity** $e$ (from 0 for a perfect mirror to 1 for a perfect blackbody) also gives the fraction of incoming thermal radiation it absorbs. An object at temperature $T$ in surroundings at $T_s$ therefore loses energy at the net rate

$$P_{\text{net}} = e\sigma A\left(T^4 - T_s^4\right).$$

Because of the fourth powers, you can't subtract the temperatures first: $T^4 - T_s^4$ is not $(T - T_s)^4$.

### Example 2

A person with skin at 33°C and about 1.5 m² of skin facing the room stands unclothed in a 20°C room. Taking $e = 0.97$ for skin in the infrared, what is the net radiation loss? At what wavelength does skin radiate most strongly?

$T = 306$ K and $T_s = 293$ K:

$$P_{\text{net}} = (0.97)(5.67\times10^{-8})(1.5)\left(306^4 - 293^4\right) = 115\text{ W},$$

comparable to a person's resting metabolic power (roughly 100 W), which is why an unclothed person feels cool in a room that seems comfortable when dressed. Wien's displacement law from the modern-physics module gives the peak: $\lambda_{\max} = (2.898\times10^{-3})/306 = 9.5\times10^{-6}$ m, in the infrared. That's what thermal cameras detect. (The 1.5 m² is an estimate: parts of the body, such as the inner arms, face each other and don't radiate to the room.)

## Sunlight and the solar constant

The Sun radiates about $L = 3.83\times10^{26}$ W in all directions. At distance $d$ that power is spread over a sphere of area $4\pi d^2$, so the intensity falls off by the inverse-square law. At Earth's average distance, $1.496\times10^{11}$ m, the **solar constant** is

$$S = \frac{L}{4\pi d^2} = \frac{3.83\times10^{26}}{4\pi(1.496\times10^{11})^2} \approx 1361\text{ W/m}^2,$$

measured on a surface facing the Sun just above the atmosphere. Mars, 1.52 times farther away, gets $1361/1.52^2 \approx 590$ W/m².

## A planet's equilibrium temperature

A planet warms up or cools down until it radiates away energy as fast as it absorbs it. To find that temperature, compare the two rates.

![Parallel rays of sunlight strike a planet from the left; a dashed arrow shows part of the light reflected back into space. The planet blocks a disk-shaped area of sunlight, but wavy infrared arrows leave its whole spherical surface in every direction.](images/phys-m7-energy-balance.svg)

- *Absorbed:* the planet intercepts sunlight over the disk it blocks, area $\pi R^2$. A fraction $a$, the **albedo**, is reflected straight back (clouds, ice, deserts); Earth's is about 0.30. The absorbed power is $(1 - a)S\pi R^2$.
- *Emitted:* the planet radiates infrared from its whole surface, area $4\pi R^2$, day side and night side. Treating it as a blackbody in the infrared ($e = 1$), that is $4\pi R^2\sigma T^4$.

Setting them equal, the radius cancels:

$$(1 - a)S\pi R^2 = 4\pi R^2\sigma T^4 \quad\Rightarrow\quad T_e = \left[\frac{(1 - a)S}{4\sigma}\right]^{1/4}.$$

This $T_e$ is the planet's **equilibrium temperature**. The factor of 4 is the ratio of the sphere's area to the disk's area: on average, each square meter of the planet's surface receives a quarter of the solar constant.

### Example 3

Find Earth's equilibrium temperature, and compare it with the measured average surface temperature, about 288 K (15°C).

$$T_e = \left[\frac{(0.70)(1361)}{4(5.67\times10^{-8})}\right]^{1/4} = \left(4.20\times10^9\right)^{1/4} = 255\text{ K},$$

or −18°C. If this were the surface temperature, the oceans would freeze. The real surface is about 33 K warmer.

### Example 4

Mars has an albedo of about 0.25 and receives $S \approx 590$ W/m². Find its equilibrium temperature.

$$T_e = \left[\frac{(0.75)(590)}{4(5.67\times10^{-8})}\right]^{1/4} = 210\text{ K}.$$

Mars's measured average surface temperature is roughly −60°C, about 210 K. Its thin carbon dioxide atmosphere adds only a few kelvins of warming.

## The greenhouse effect

What makes Earth's surface 33 K warmer than its equilibrium temperature? Sunlight peaks in visible light (around 0.5 µm), and the air lets most of it through. The warm ground radiates in the infrared (around 10 µm), and water vapor, carbon dioxide and a few other **greenhouse gases** absorb much of that infrared and radiate energy back down as well as up. The surface then receives energy from both the Sun and the atmosphere, and it must warm up until it radiates enough to stay in balance. This is the **greenhouse effect**.

A *simplified* model shows the mechanism. Suppose a single layer of atmosphere lets all sunlight through but absorbs all infrared. Let $F = (1 - a)S/4$ be the absorbed sunlight per square meter.

- Seen from space, the planet must still send out $F$, and now it is the layer that radiates to space: $\sigma T_a^4 = F$, so the layer is at $T_e$ = 255 K.
- The layer radiates the same amount, $\sigma T_a^4 = F$, downward too. The surface absorbs the sunlight plus this, $2F$, so $\sigma T_s^4 = 2F$ and

$$T_s = 2^{1/4}T_e = 1.19(255\text{ K}) = 303\text{ K}.$$

The one-layer model overshoots the real 288 K, because the real atmosphere absorbs only part of the infrared and convection also carries heat up from the surface. But it shows how an atmosphere that absorbs infrared makes the surface warmer than the equilibrium temperature, even though the planet as a whole still sends out exactly as much energy as it absorbs. Adding more of a greenhouse gas increases the infrared absorption, which in this picture raises the surface temperature needed to restore the balance.

Venus is the extreme case: its equilibrium temperature is only about 230 K (its thick clouds reflect most sunlight), yet its dense carbon dioxide atmosphere keeps the surface near 735 K.

## Common mistakes

- Adding thermal conductivities, or adding the resistances of layers side by side; resistances add only for layers that the same heat passes through one after another.
- Computing $(T - T_s)^4$ instead of $T^4 - T_s^4$, or using Celsius in either.
- Using $4\pi R^2$ for the absorbed sunlight (the planet blocks a disk, $\pi R^2$) or $\pi R^2$ for the emission (it radiates from the whole sphere).
- Forgetting the albedo, or applying it to the emitted infrared.
- Treating the one-layer greenhouse model as a prediction; it is a teaching model that shows the mechanism.

## Key points

- Thermal resistance per unit area $R = L/k$; layers in series add: $Q/t = A\Delta T/R_{\text{total}}$.
- Net radiation: $P_{\text{net}} = e\sigma A(T^4 - T_s^4)$; good absorbers are good emitters.
- Solar constant at Earth: $S = L/(4\pi d^2) \approx 1361$ W/m²; it falls as $1/d^2$.
- Equilibrium temperature: $T_e = [(1 - a)S/(4\sigma)]^{1/4}$, 255 K for Earth.
- Greenhouse gases absorb the surface's infrared and send part back down, so the surface is warmer than $T_e$ (288 K for Earth).

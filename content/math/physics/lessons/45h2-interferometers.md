---
id: phys-m11-h-interferometry
module: phys-m11
title: 'Honors: Interferometers: measuring with light waves'
minutes: 45
honors: true
topics: [Air wedges and Newton's rings, Interferometers]
drills: [phys-m11-r2-air-wedge, phys-m11-r2-michelson, phys-m11-r2-gas-index]
refs: [phys-ref-em-modern]
---
## A ruler marked in wavelengths

The interference lesson used one rule over and over: where two coherent waves meet, a path difference of a whole number of wavelengths gives a bright fringe, and a half-integer number gives a dark one. Turn that around and it becomes a measuring tool. Each fringe stands for a path change of one wavelength, about half a micrometer for visible light, so counting fringes measures lengths far smaller than any mechanical ruler can. A device built to do this on purpose is an **interferometer**. This lesson starts with two simple ones made from nothing but glass plates, then the Michelson interferometer, and ends with what limits all of them and two famous experiments.

## The air wedge

Lay one flat glass plate on another, touching along one edge, and slip something thin (a hair, a strip of foil) under the far edge at distance $L$. The plates enclose a thin wedge of air whose thickness grows steadily from zero at the touching edge to $D$ at the spacer. At distance $x$ from the touching edge,

$$t = \frac{D}{L}\,x.$$

```shape
{"segments": [{"from": [0, 0], "to": [10, 0]}, {"from": [0, 0], "to": [10, 2.4]}, {"from": [10, 0], "to": [10, 2.4]}, {"from": [6, 0], "to": [6, 1.44], "dashed": true}, {"from": [0, -0.7], "to": [6, -0.7], "label": "x"}, {"from": [0, -1.6], "to": [10, -1.6], "label": "L"}], "labels": [{"at": [8.0, 0.7], "text": "air wedge"}, {"at": [5.65, 0.6], "text": "t"}, {"at": [10.5, 1.2], "text": "D"}], "caption": "An air wedge (thickness greatly exaggerated): the gap t grows in proportion to the distance x from the touching edge, reaching D at the spacer a distance L away"}
```

Light shining down reflects from the bottom of the top plate and from the top of the bottom plate, and the two reflections interfere. Count phase flips as the wave optics lesson taught. The first reflection is from glass into air, toward a lower index: no flip. The second is from air onto glass, a higher index: one flip. With exactly one flip, the reflections cancel when the extra path is a whole number of wavelengths:

$$2t = m\lambda \quad \text{(dark)}, \qquad 2t = \left(m + \tfrac12\right)\lambda \quad \text{(bright)}.$$

(Air has $n = 1$, so the wavelength in the gap is just $\lambda$.) The touching edge, where $t = 0$, is dark, which is a nice confirmation of the flip. From one dark fringe to the next the gap grows by $\lambda/2$, so the fringes are equally spaced, a distance

$$\Delta x = \frac{\lambda}{2}\cdot\frac{L}{D} = \frac{\lambda L}{2D}$$

apart.

### Example 1: measuring a hair

Sodium light (589 nm) shines on an air wedge 8.0 cm long with a hair at the far end. The dark fringes are 0.40 mm apart. How thick is the hair, and how many dark fringes are there?

Solve the spacing formula for $D$:

$$D = \frac{\lambda L}{2\Delta x} = \frac{(589\times10^{-9})(0.080)}{2(0.40\times10^{-3})} = 5.9\times10^{-5}\text{ m} = 59\ \mu\text{m}.$$

The gap grows by $\lambda/2$ per fringe, so there are $D/(\lambda/2) = 2D/\lambda = 200$ fringe spacings across the wedge: 201 dark fringes counting the one at the touching edge. Measuring a 59 μm hair to within a few percent took nothing but a ruler and a lamp.

*Optical flats.* The same arrangement tests flatness. Opticians lay a reference plate polished flat to a small fraction of a wavelength (an **optical flat**) on a lens or mirror surface. If the surface is flat, the fringes are straight, parallel and evenly spaced. Each fringe is a contour line of equal gap, like the lines on a topographic map, with a height step of $\lambda/2$ between neighboring lines. A fringe that bends aside by one full fringe spacing marks a bump or dip of about $\lambda/2 \approx 0.3$ μm.

## Newton's rings

Rest a gently curved lens (radius of curvature $R$) on a flat plate. The gap is now zero at the contact point and grows outward in every direction, so the contours of equal gap are circles: **Newton's rings**. At distance $r$ from the contact point, the geometry of a circle gives $(R - t)^2 + r^2 = R^2$, so $r^2 = 2Rt - t^2$. Since $t$ is tiny compared with $R$, drop $t^2$:

$$t \approx \frac{r^2}{2R}.$$

The phase flips are the same as in the air wedge (one), so the dark rings satisfy $2t = m\lambda$, which gives

$$r_m = \sqrt{m\lambda R}.$$

The center is dark, and the rings crowd closer together farther out, because the gap grows as $r^2$ rather than in proportion to $r$. (Newton studied these rings carefully, but he explained light with particles, not waves; Thomas Young later explained the rings as interference.)

### Example 2: radius of a lens surface

With 589 nm light, the fifth dark ring (not counting the dark center) has a radius of 2.10 mm. Find the radius of curvature of the lens surface.

$$R = \frac{r_m^2}{m\lambda} = \frac{(2.10\times10^{-3})^2}{5(589\times10^{-9})} = \frac{4.41\times10^{-6}}{2.945\times10^{-6}} = 1.50\text{ m}.$$

## The Michelson interferometer

Albert Michelson's design (1880s) separates the two interfering beams so each can be changed on its own.

![A Michelson interferometer: light from a source meets a half-silvered beam splitter at 45 degrees. One beam goes to a movable mirror and back, the other to a fixed mirror and back, and the beam splitter recombines them toward a detector.](images/phys-m11-michelson.svg)

1. Light from the source hits a **beam splitter**, a glass plate with a thin metal coating that reflects half the light and transmits half.
2. One beam travels to a movable mirror and back; the other to a fixed mirror and back.
3. The beam splitter recombines the beams, and they travel together to a screen or detector, where they interfere.

If the two arms differ in length by $d_1 - d_2$, the light paths differ by $2(d_1 - d_2)$, because each beam goes out and back. Moving one mirror a distance $\Delta d$ changes the path difference by $2\Delta d$. Each change of one wavelength moves the pattern by one fringe, so a detector at a fixed spot sees

$$N = \frac{2\,\Delta d}{\lambda}$$

fringes go by. Mirror motion of $\lambda/2$ (about a quarter of a micrometer) makes one fringe pass.

### Example 3: measuring a wavelength

A micrometer screw moves the mirror of a Michelson interferometer exactly 0.1000 mm, and 340 fringes pass the detector. What is the wavelength?

$$\lambda = \frac{2\,\Delta d}{N} = \frac{2(0.1000\times10^{-3})}{340} = 5.88\times10^{-7}\text{ m} = 588\text{ nm},$$

close to sodium's 589 nm yellow line. Counting a few hundred fringes already gives the wavelength to about three significant figures; counting more gives more.

## Measuring an index of refraction

Put a sealed glass cell of inside length $L$ in one arm. Light crosses it twice. Inside a gas of index $n$ the wavelength is $\lambda/n$, so the trip through the cell holds $2Ln/\lambda$ wavelengths instead of $2L/\lambda$ when the cell is empty. As gas slowly fills an evacuated cell, the count of fringes passing the detector is

$$N = \frac{2L(n - 1)}{\lambda}.$$

### Example 4: the index of air

A cell 5.00 cm long is pumped out and then slowly filled with air while 43 fringes of 632.8 nm (helium-neon laser) light pass. Find $n$ for air.

$$n - 1 = \frac{N\lambda}{2L} = \frac{43(632.8\times10^{-9})}{2(0.0500)} = 2.72\times10^{-4},$$

so $n = 1.000272$, matching the accepted value for air near room conditions (about 1.00027). The index of air differs from 1 in the fourth decimal place, which a protractor and Snell's law could never detect; fringe counting does it easily.

## Coherence: why fringes fade

Real light doesn't come as an endless perfect wave. A source emits a jumble of short wave trains, and fringes form only between parts of the *same* train. If the path difference is longer than a train, the two beams arriving together come from unrelated trains, and the fringes wash out. The length over which light stays in step is its **coherence length**; roughly, for light spread over a range of wavelengths $\Delta\lambda$ around $\lambda$,

$$\ell_c \approx \frac{\lambda^2}{\Delta\lambda}.$$

This is an order-of-magnitude estimate, not an exact law. White light ($\lambda \approx 550$ nm, $\Delta\lambda \approx 300$ nm) has $\ell_c \approx 1$ μm, only about two wavelengths. That is why soap films show colors only when they are thinner than about a micrometer, and why a Michelson interferometer with white light shows colored fringes only when the arms are equal to within a micrometer (a handy way to find equal paths). A typical helium-neon laser has $\Delta\lambda \approx 0.002$ nm, giving $\ell_c$ around 20 cm, and stabilized lasers reach kilometers.

## Two famous interferometers

*Michelson and Morley, 1887.* Physicists then believed light was a vibration of an invisible "ether" filling space. Earth moves through the ether at about 30 km/s in its orbit, so light should take slightly different times along arms parallel and perpendicular to that motion. Michelson and Edward Morley built an interferometer whose arms, folded by repeated mirror reflections, were about 11 m long, floated it on mercury and rotated it, expecting the pattern to shift by about 0.4 of a fringe. The shift they saw was at most a few hundredths of a fringe, consistent with none at all. This "null result" was a puzzle for nearly twenty years; special relativity (the next module) explains it: the speed of light is the same for every inertial observer. Michelson received the 1907 Nobel Prize in Physics for his precision optical instruments and measurements.

*LIGO.* The Laser Interferometer Gravitational-Wave Observatory uses Michelson interferometers with arms 4 km long. On 14 September 2015 it detected gravitational waves from two merging black holes, which stretched one arm and squeezed the other by a few times $10^{-18}$ m, hundreds of times smaller than a proton. Detecting that took a powerful, very stable laser, light bouncing back and forth in each arm many times, and isolation from every vibration.

## Common mistakes

- Using $\Delta d = N\lambda$ for a Michelson interferometer. The light crosses the arm twice, so one fringe is a mirror motion of $\lambda/2$.
- Forgetting the phase flip in the air wedge and putting a bright fringe at the touching edge.
- Using $n$ instead of $n - 1$ in the gas-cell formula: only the *extra* wavelengths compared with vacuum shift the fringes.
- Assuming Newton's rings are evenly spaced. Their radii grow as $\sqrt m$, so they crowd together outward.
- Expecting fringes whatever the path difference. Beyond the coherence length they vanish.

## Key points

- An interferometer converts a path change into a fringe count: one fringe per wavelength of path.
- Air wedge (one flip): dark where $2t = m\lambda$; spacing $\Delta x = \lambda L/(2D)$; each fringe is a $\lambda/2$ height step.
- Newton's rings: $t \approx r^2/(2R)$, dark rings at $r_m = \sqrt{m\lambda R}$, dark center.
- Michelson: $N = 2\Delta d/\lambda$; gas cell: $N = 2L(n - 1)/\lambda$.
- Coherence length $\ell_c \approx \lambda^2/\Delta\lambda$: about 1 μm for white light, centimeters to kilometers for lasers.
- Michelson–Morley (1887) found no ether wind; LIGO (2015) measured arm changes of about $10^{-18}$ m.

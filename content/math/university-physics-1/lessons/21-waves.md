---
id: phys-waves
module: phys-m6
title: Waves and superposition
minutes: 40
topics: [Wave properties, Standing waves]
drills: [phys-wave-speed, phys-string-wave]
refs: [phys-ref-waves-thermo]
---
## Energy on the move

Flick one end of a rope and a pulse runs along it; drop a stone in a pond and ripples spread out. In both cases the material itself only jiggles in place, yet energy travels across the whole medium. A **wave** is a disturbance that transfers energy from place to place without transporting matter. This lesson builds on SHM, because a wave is just SHM at every point of a medium, with each point slightly delayed relative to its neighbor.

## Kinds of waves

**Mechanical waves** need a medium (string, water, air, rock). Electromagnetic waves (light, radio) don't; they are covered in University Physics II.

- In a **transverse wave** the medium moves perpendicular to the direction the wave travels: waves on a string, the "wave" in a stadium.
- In a **longitudinal wave** the medium moves parallel to the direction of travel, in compressions and rarefactions: sound in air, a pulse along a stretched Slinky.

Water waves are a mix: water parcels move in small circles.

## Describing periodic waves

If the source oscillates in SHM, the wave is a repeating sinusoid in both space and time.

- **Wavelength** $\lambda$: the distance between adjacent crests (one full repeat in space).
- **Period** $T$ and **frequency** $f = 1/T$: how often a point in the medium completes an oscillation (set by the source).
- **Amplitude** $A$: the maximum displacement of the medium.

In one period the wave advances one wavelength, so its speed is

$$v = \frac{\lambda}{T} = f\lambda.$$

This is the master equation for every kind of wave. The speed depends on the medium, the frequency on the source; the wavelength adjusts to fit. When a wave passes into a new medium, its frequency stays the same and its speed and wavelength change.

```plot
{"x": [0, 4.5], "y": [-1.5, 1.5], "xLabel": "position x (m)", "yLabel": "displacement y", "functions": [{"f": "sin(2*pi*x/2)", "label": "t = 0"}, {"f": "sin(2*pi*(x - 0.4)/2)", "dashed": true, "label": "a moment later"}], "segments": [{"from": [0.5, 1.2], "to": [2.5, 1.2], "arrow": true, "label": "λ = 2 m"}], "caption": "A sinusoidal wave moving right: the whole pattern shifts while each point moves up and down"}
```

### Example 1

A radio station broadcasts at 98.5 MHz. Radio waves travel at $3.00\times10^8$ m/s. What is the wavelength?

$\lambda = v/f = (3.00\times10^8)/(98.5\times10^6) = 3.05$ m.

Sound in air at 20°C travels at 343 m/s. Middle A (440 Hz) has $\lambda = 343/440 = 0.780$ m.

## Waves on a string

The speed of a transverse wave on a string depends on the tension $F_T$ and the **linear mass density** $\mu = m/L$ (kg/m):

$$v = \sqrt{\frac{F_T}{\mu}}.$$

Tighter strings carry waves faster (stronger restoring force); heavier strings slower (more inertia). Guitarists tune by changing tension; the bass strings are thicker to make them slower and lower.

## Superposition and interference

When two waves overlap, the displacement at each point is the sum of the individual displacements. This is the **principle of superposition**. After they pass through each other, each wave continues unchanged.

- Crest meets crest: the displacements add, **constructive interference**.
- Crest meets trough: they cancel, **destructive interference**.

For two waves from sources in step, the result at a point depends on the **path difference** $\Delta r$ from the two sources: constructive if $\Delta r = m\lambda$ ($m = 0, 1, 2, \ldots$), destructive if $\Delta r = (m + \tfrac12)\lambda$. Noise-canceling headphones use destructive interference, producing a sound wave inverted relative to the incoming noise.

## Reflection and standing waves

A pulse reaching the fixed end of a string reflects upside down; at a free end, it reflects right side up. A continuous wave on a string fixed at both ends reflects back and forth, and the incoming and reflected waves superpose. At certain frequencies the result is a **standing wave**: a pattern that oscillates in place without traveling. Points that never move are **nodes**; points of maximum oscillation are **antinodes**. Adjacent nodes are half a wavelength apart.

A string of length $L$ fixed at both ends must have nodes at both ends, so a whole number of half-wavelengths must fit:

$$L = n\frac{\lambda_n}{2} \quad\Rightarrow\quad \lambda_n = \frac{2L}{n}, \qquad f_n = \frac{nv}{2L} = nf_1, \quad n = 1, 2, 3, \ldots$$

These are the string's **harmonics**. The lowest, $f_1 = v/(2L)$, is the **fundamental frequency**; the others are integer multiples. A plucked string vibrates in a mix of harmonics, and the mix gives each instrument its tone quality (timbre).

```plot
{"x": [0, 3], "y": [-1.4, 1.4], "xLabel": "position along string", "yLabel": "displacement", "functions": [{"f": "sin(pi*x)"}, {"f": "-sin(pi*x)", "dashed": true}], "points": [{"at": [0, 0], "label": "N"}, {"at": [1, 0], "label": "N"}, {"at": [2, 0], "label": "N"}, {"at": [3, 0], "label": "N"}, {"at": [0.5, 1], "label": "A"}], "caption": "Third harmonic on a string fixed at both ends: four nodes (N), three antinodes (A), L = 3λ/2"}
```

### Example 2

A 0.65 m guitar string has mass 3.9 g and is under 80 N tension. Find the wave speed, the fundamental frequency, and the third harmonic.

$\mu = 0.0039/0.65 = 0.0060$ kg/m. $v = \sqrt{80/0.0060} = 115.5$ m/s.

$f_1 = \dfrac{v}{2L} = \dfrac{115.5}{1.30} = 88.8$ Hz. $f_3 = 3f_1 = 266$ Hz.

Pressing the string against a fret shortens $L$ and raises the pitch; to raise the fundamental an octave (double $f$), halve the length.

## Energy and intensity

A wave's energy is proportional to the square of its amplitude, and the power it carries is too. Doubling the amplitude quadruples the power. For waves spreading out in three dimensions from a point source, the power spreads over a sphere of area $4\pi r^2$, so the **intensity** (power per area, W/m²) is

$$I = \frac{P}{4\pi r^2}.$$

That's another inverse-square law, which we'll use for sound.

For a sinusoidal wave on a string the average power carried is $P_{\text{avg}} = \tfrac12\mu A^2\omega^2v$: it grows with the square of both the amplitude and the frequency, and with the wave speed.

## The wave function and the wave equation

A sinusoidal wave moving in the $+x$ direction is

$$y(x, t) = A\sin(kx - \omega t),$$

where $k = 2\pi/\lambda$ is the **wave number** and $\omega = 2\pi f$. A point of constant phase moves so that $kx - \omega t$ is constant, i.e. at speed $v = \omega/k = f\lambda$. ($kx + \omega t$ moves in the $-x$ direction.)

Applying Newton's second law to a small piece of string gives the **wave equation**

$$\frac{\partial^2y}{\partial x^2} = \frac{1}{v^2}\frac{\partial^2y}{\partial t^2}, \qquad v = \sqrt{F_T/\mu}.$$

Any function $f(x - vt)$ satisfies it, which is why any pulse shape travels undistorted. The transverse velocity of a point on the string is $\partial y/\partial t = -A\omega\cos(kx - \omega t)$, with maximum $A\omega$, which is not the wave speed $v$.

Adding a right-moving and a left-moving wave of the same amplitude:

$$A\sin(kx - \omega t) + A\sin(kx + \omega t) = 2A\sin(kx)\cos(\omega t),$$

a standing wave: a fixed spatial shape $\sin(kx)$ whose size oscillates in time. Nodes are where $\sin kx = 0$, at $x = 0, \lambda/2, \lambda, \ldots$

## Common mistakes

- Thinking the medium travels with the wave.
- Thinking frequency changes when a wave enters a new medium (speed and wavelength change).
- Confusing the wave speed with the speed of the oscillating medium.
- Forgetting that adjacent nodes are $\lambda/2$ apart, not $\lambda$.
- Using total mass instead of mass per length in $v = \sqrt{F_T/\mu}$.

## Key points

- $v = f\lambda$; speed set by the medium, frequency by the source.
- String: $v = \sqrt{F_T/\mu}$.
- Superposition: displacements add; path difference $m\lambda$ constructive, $(m + \tfrac12)\lambda$ destructive.
- Fixed–fixed string: $\lambda_n = 2L/n$, $f_n = nv/(2L)$.
- $y = A\sin(kx - \omega t)$ with $k = 2\pi/\lambda$, $\omega = 2\pi f$.

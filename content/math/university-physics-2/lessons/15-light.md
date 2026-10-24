---
id: phys-light
module: phys-m11
title: 'Light: electromagnetic waves, reflection, and refraction'
minutes: 45
topics: [Electromagnetic waves, Reflection and refraction]
drills: [phys-snell, phys-critical-angle, phys-malus, phys-brewster]
refs: [phys-ref-em-modern, phys-ref-constants]
---
## Light is an electromagnetic wave

The last module showed that a changing magnetic field creates an electric field (Faraday). James Clerk Maxwell added the reverse: a changing electric field creates a magnetic field. Put together, the two can sustain each other and travel through empty space as a wave. Maxwell calculated the speed of that wave from $\varepsilon_0$ and $\mu_0$ and got the measured speed of light. Light, he concluded, is an electromagnetic wave. This lesson describes those waves and then treats light as rays to understand reflection and refraction.

## Properties of electromagnetic waves

An **electromagnetic wave** consists of oscillating electric and magnetic fields, perpendicular to each other and to the direction of travel (a transverse wave). It needs no medium. In vacuum all EM waves travel at

$$c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = 3.00\times10^8\text{ m/s},$$

and as with any wave $c = f\lambda$. The field magnitudes are linked by $E = cB$.

The picture shows one instant of a wave traveling to the right. The electric field oscillates in one plane and the magnetic field in the perpendicular plane, in step with each other, and $\vec E\times\vec B$ points along the direction of travel.

![A snapshot of an electromagnetic wave traveling to the right along a horizontal axis. The electric field E oscillates up and down in a vertical plane, drawn as a shaded sine wave with vertical hatching. The magnetic field B oscillates in the horizontal plane, drawn in perspective coming toward the viewer, in phase with E. Arrows show E pointing up and B pointing toward the viewer at the first crest, and a bracket marks one wavelength between two neighboring crests of E.](images/phys-m11-em-wave.svg)

EM waves carry energy. Their *intensity* (average power per area) is $I = \tfrac12c\varepsilon_0E_0^2$, where $E_0$ is the peak field (the next lesson derives this and the results below). Sunlight at Earth's distance delivers about 1360 W/m². They also carry momentum, exerting a small radiation pressure: $I/c$ on a surface that absorbs the light and $2I/c$ on one that reflects it straight back, which is why solar sails are mirrors.

*The electromagnetic spectrum.* All EM waves are the same phenomenon, differing only in frequency and wavelength:

| Region | Typical wavelength | Uses / sources |
|---|---|---|
| Radio | > 1 m | broadcasting, MRI |
| Microwave | 1 mm – 1 m | ovens, radar, Wi-Fi |
| Infrared | 700 nm – 1 mm | heat lamps, remote controls |
| Visible | 400 – 700 nm | sight (violet 400, red 700) |
| Ultraviolet | 10 – 400 nm | sunburn, sterilization |
| X-rays | 0.01 – 10 nm | medical imaging |
| Gamma rays | < 0.01 nm | nuclear decay |

## Polarization

In ordinary light from the Sun or a bulb, the electric field points in random directions perpendicular to the beam. A **polarizer** passes only the component of $\vec E$ along its transmission axis. Unpolarized light passing through one polarizer loses half its intensity and emerges **polarized** along the axis. Polarized light of intensity $I_0$ hitting a second polarizer at angle $\theta$ to its polarization emerges with

$$I = I_0\cos^2\theta,$$

**Malus's law**. Crossed polarizers ($\theta = 90^\circ$) block everything. Light reflected from water or roads is partly polarized horizontally, which is why polarized sunglasses (with vertical axes) cut glare. At one angle of incidence, **Brewster's angle**, given by $\tan\theta_B = n_2/n_1$ (about $53^\circ$ for air to water), the reflected light is completely polarized parallel to the surface. At that angle the reflected and refracted rays are exactly perpendicular, so the angle of refraction is $90^\circ - \theta_B$; Snell's law with $\sin\theta_2 = \cos\theta_B$ gives the tangent formula.

## Rays and reflection

When the wavelength is tiny compared with the objects light meets, we can treat light as **rays**: straight lines along which energy travels. That's the domain of geometric optics.

At a smooth surface, light obeys the **law of reflection**: the angle of reflection equals the angle of incidence, $\theta_r = \theta_i$, both measured from the *normal* (the line perpendicular to the surface). Rough surfaces reflect diffusely, scattering light in many directions, which is how we see most objects.

## Refraction and Snell's law

Light travels slower in materials than in vacuum. The **index of refraction** of a material is

$$n = \frac cv,$$

always at least 1: air 1.000 (1.0003), water 1.33, glass about 1.5, diamond 2.42. When light crosses a boundary at an angle, the change of speed bends it. This is **refraction**, governed by **Snell's law**:

$$n_1\sin\theta_1 = n_2\sin\theta_2,$$

with both angles measured from the normal. Going into a slower medium (larger $n$), light bends *toward* the normal; into a faster one, *away* from it. The frequency stays the same across the boundary, so the wavelength shrinks in the denser medium: $\lambda_n = \lambda/n$.

*Why it bends:* think of a marching band crossing from pavement onto mud at an angle. The side that hits the mud first slows first, swinging the whole line around, toward the perpendicular.

```shape
{"segments": [{"from": [-3, 0], "to": [3, 0]}, {"from": [0, -2.6], "to": [0, 2.6], "dashed": true}, {"from": [-1.5, 2.6], "to": [0, 0], "arrow": true, "label": "incident"}, {"from": [0, 0], "to": [1.06, -2.6], "arrow": true, "label": "refracted"}, {"from": [0, 0], "to": [1.5, 2.6], "dashed": true, "label": "reflected"}], "labels": [{"at": [-2.6, 0.3], "text": "air, n = 1.00"}, {"at": [-2.6, -0.4], "text": "water, n = 1.33"}, {"at": [0.15, 2.4], "text": "normal"}], "caption": "Light entering water bends toward the normal: 30° in air becomes 22° in water"}
```

### Example 1

Light in air strikes water at $30^\circ$ from the normal. Find the angle of refraction, and the light's speed and wavelength in water if its vacuum wavelength is 600 nm.

$1.00\sin 30^\circ = 1.33\sin\theta_2$, so $\sin\theta_2 = 0.376$ and $\theta_2 = 22.1^\circ$.

$v = c/n = 3.00\times10^8/1.33 = 2.26\times10^8$ m/s. $\lambda_{\text{water}} = 600/1.33 = 451$ nm.

*Dispersion.* The index of refraction depends slightly on wavelength: violet light bends more than red in glass. A prism therefore spreads white light into a spectrum, and raindrops do the same to make rainbows.

## Total internal reflection

When light goes from a higher to a lower index (glass to air, say), it bends away from the normal. At a large enough angle of incidence, the refracted ray would have to bend past $90^\circ$, which is impossible, so all the light reflects back. This **total internal reflection** begins at the **critical angle** $\theta_c$, where $\theta_2 = 90^\circ$:

$$\sin\theta_c = \frac{n_2}{n_1} \qquad (n_1 > n_2).$$

Optical fibers trap light by total internal reflection along kilometers of glass, carrying the internet's data. Diamonds sparkle because their high index gives a small critical angle (24.4°), so light bounces around inside many times before escaping.

### Example 2

Find the critical angle for light going from glass ($n = 1.52$) into air, and into water ($n = 1.33$).

Into air: $\sin\theta_c = 1/1.52 = 0.658$, so $\theta_c = 41.1^\circ$.

Into water: $\sin\theta_c = 1.33/1.52 = 0.875$, so $\theta_c = 61.0^\circ$. The smaller the index difference, the larger the critical angle.

The chart sums up what can happen when light meets a boundary.

```mermaid
flowchart TD
  accTitle: What happens when light reaches a boundary
  accDescr: Light reaches a boundary between two materials. If it is going into a lower index and its angle of incidence is above the critical angle, all of it reflects: total internal reflection. If it is going into a lower index below the critical angle, part reflects and the rest refracts away from the normal. If it is going into a higher index, part reflects and the rest refracts toward the normal. In either partial case, at Brewster's angle the reflected light is completely polarized.
  A["Light reaches a boundary"] --> B{"Going into a lower index?"}
  B -- yes --> C{"Angle above the critical angle?"}
  C -- yes --> D["Total internal reflection: all of it reflects"]
  C -- no --> E["Part reflects, part refracts away from the normal"]
  B -- no --> F["Part reflects, part refracts toward the normal"]
  E --> G["At Brewster's angle the reflected part is fully polarized"]
  F --> G
```

## The wave equation and Fermat's principle

Maxwell's reverse effect is built into Ampère's law. Around a charging capacitor, a loop's current depends on whether the surface it bounds cuts the wire or passes between the plates, where no charge flows but the electric flux is changing. Maxwell fixed this by adding a **displacement current** $I_d = \varepsilon_0\,d\Phi_E/dt$ to the enclosed current. Between the plates the flux is $\Phi_E = Q/\varepsilon_0$, so $I_d = dQ/dt$: the displacement current in the gap exactly equals the conduction current in the wires, and both surfaces give the same answer. With that term, the four **Maxwell's equations** in integral form are

$$\oint\vec E\cdot d\vec A = \frac{Q_{\text{enc}}}{\varepsilon_0}, \qquad \oint\vec B\cdot d\vec A = 0,$$

$$\oint\vec E\cdot d\vec\ell = -\frac{d\Phi_B}{dt}, \qquad \oint\vec B\cdot d\vec\ell = \mu_0I_{\text{enc}} + \mu_0\varepsilon_0\frac{d\Phi_E}{dt}:$$

Gauss's law, Gauss's law for magnetism (no magnetic monopoles), Faraday's law, and the Ampère–Maxwell law. In empty space they combine to give, for the electric field, the wave equation

$$\frac{\partial^2E}{\partial x^2} = \mu_0\varepsilon_0\frac{\partial^2E}{\partial t^2},$$

whose solutions travel at $1/\sqrt{\mu_0\varepsilon_0}$. A plane wave $E = E_0\sin(kx - \omega t)$, $B = B_0\sin(kx - \omega t)$ satisfies Faraday's law only if $E_0 = cB_0$. The energy density $u = \tfrac12\varepsilon_0E^2 + \tfrac{1}{2\mu_0}B^2$ splits equally between the fields, and averaging $\sin^2$ over a cycle gives $I = \tfrac12c\varepsilon_0E_0^2$.

Snell's law also follows from **Fermat's principle**: light takes the path of least time (strictly, a path whose time is stationary, which for refraction at a flat surface is a minimum). For a ray from a point in medium 1 to a point in medium 2, crossing the boundary at position $x$, the travel time is $t(x) = \dfrac{\sqrt{a^2 + x^2}}{v_1} + \dfrac{\sqrt{b^2 + (d - x)^2}}{v_2}$. Setting $dt/dx = 0$ gives $\dfrac{\sin\theta_1}{v_1} = \dfrac{\sin\theta_2}{v_2}$, which is Snell's law since $v = c/n$.

## Common mistakes

- Measuring angles from the surface instead of the normal.
- Thinking the frequency changes on refraction (speed and wavelength change).
- Looking for total internal reflection when going into a denser medium (it only happens going to lower $n$).
- Forgetting the factor $\tfrac12$ for unpolarized light through the first polarizer.

## Key points

- EM waves: transverse, $c = 3.00\times10^8$ m/s $= 1/\sqrt{\mu_0\varepsilon_0}$, $c = f\lambda$, $E = cB$.
- Malus: $I = I_0\cos^2\theta$; unpolarized light halves through a polarizer.
- Reflection: $\theta_r = \theta_i$. Refraction: $n = c/v$, $n_1\sin\theta_1 = n_2\sin\theta_2$.
- Critical angle $\sin\theta_c = n_2/n_1$ for $n_1 > n_2$. Brewster's angle $\tan\theta_B = n_2/n_1$: reflected light fully polarized.
- Displacement current $I_d = \varepsilon_0\,d\Phi_E/dt$ completes Maxwell's equations.

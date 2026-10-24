---
id: phys-h-gratings-xray
module: phys-m11
title: Grating spectrometers and X-ray diffraction
minutes: 45
honors: true
topics: [Grating spectroscopy, X-ray diffraction]
drills: [phys-m11-r2-resolving-power, phys-m11-r2-bragg]
refs: [phys-ref-em-modern]
---
## From bright lines to measurements

The interference lesson showed that a grating sends each wavelength to its own angle, $d\sin\theta = m\lambda$, and that its maxima are far sharper than a double slit's. A spectrometer built around a grating is how astronomers learn what stars are made of and how chemists identify a sample from its spectral lines. This lesson answers the questions a spectrometer designer has to ask: how far apart two colors land, how sharp each line is, and when two nearly equal wavelengths can be told apart. Then it shrinks the wavelength by a factor of a few thousand and uses the same idea with X-rays, where the "grating" is the regular array of atoms in a crystal.

## How sharp is a principal maximum?

With $N$ slits, neighboring slits send light to the screen with phase difference $\phi = \dfrac{2\pi}{\lambda}d\sin\theta$. The interference lesson quoted the result of adding the $N$ phasors:

$$I \propto \left(\frac{\sin(N\phi/2)}{\sin(\phi/2)}\right)^2.$$

The principal maxima are at $\phi = 2\pi m$, where all $N$ phasors line up and the intensity is $N^2$ times that of one slit. Move away from a maximum and the phasors start to curl. When $\phi$ has changed by $2\pi/N$, the $N$ phasors close into a full polygon and add to zero: that is the first dark point beside the maximum. The more slits, the smaller this change, so the narrower the line.

```plot
{"x": [0.5, 3.75], "y": [0, 1.15], "functions": [{"f": "(sin(2*pi*(x + 0.0001))/(2*sin(pi*(x + 0.0001))))^2", "dashed": true}, {"f": "(sin(8*pi*(x + 0.0001))/(8*sin(pi*(x + 0.0001))))^2"}], "xLabel": "m", "yLabel": "intensity / peak", "caption": "Dashed: two slits (N = 2) give broad fringes. Solid: eight slits (N = 8) with the same spacing put the light into much narrower principal maxima at the same places. Horizontal axis: the phase difference φ divided by 2π, which equals the order m at each principal maximum."}
```

To turn a phase change into an angle, differentiate $\phi$: $\Delta\phi = \dfrac{2\pi}{\lambda}d\cos\theta\,\Delta\theta$. Setting $\Delta\phi = 2\pi/N$ gives the angular half-width of a line,

$$\Delta\theta_{\text{hw}} = \frac{\lambda}{Nd\cos\theta}.$$

$Nd$ is the width of the illuminated part of the grating, so a wide beam on a wide grating makes sharp lines.

## Dispersion: how far apart two colors land

Differentiate the grating equation with respect to $\lambda$ at fixed $m$: $d\cos\theta\,d\theta = m\,d\lambda$. The **angular dispersion** is

$$\frac{d\theta}{d\lambda} = \frac{m}{d\cos\theta}.$$

Finer rulings (smaller $d$) and higher orders spread the spectrum more. For a 600 lines/mm grating in first order near 589 nm, $d = 1.667$ μm and $\theta = 20.7^\circ$, so the dispersion is $6.4\times10^{-4}$ rad per nanometer, about 0.037° per nanometer.

## Resolving power

Two wavelengths $\lambda$ and $\lambda + \Delta\lambda$ are just resolved, by the same Rayleigh idea used for telescopes, when the maximum of one falls on the first dark point beside the other. Their angular separation is (dispersion) × $\Delta\lambda = \dfrac{m\Delta\lambda}{d\cos\theta}$, and this must equal the half-width $\dfrac{\lambda}{Nd\cos\theta}$. The $d\cos\theta$ cancels, leaving the **resolving power**

$$R = \frac{\lambda}{\Delta\lambda} = Nm.$$

It depends only on how many lines are illuminated and which order you use, not on the line spacing. Spacing controls how far the spectrum spreads; the number of lines controls how sharp it is.

### Example 1

Sodium's bright yellow light is a doublet, two lines at 589.00 nm and 589.59 nm. (a) What resolving power is needed to separate them? (b) A 600 lines/mm grating is lit by a beam 2.0 mm wide. Does it resolve them in first order?

(a) $R = \dfrac{\lambda}{\Delta\lambda} = \dfrac{589.3}{0.59} \approx 1.0\times10^3$. In first order you need about 1000 lines; in second order, about 500.

(b) The beam covers $N = (600\text{ mm}^{-1})(2.0\text{ mm}) = 1200$ lines, so in first order $R = 1200 > 1000$: resolved. As a check with angles, the lines are at $20.695^\circ$ and $20.717^\circ$, $3.8\times10^{-4}$ rad apart, while each line's half-width is $\lambda/(Nd\cos\theta) = 3.1\times10^{-4}$ rad. The separation is larger than the half-width, so the two peaks show as separate.

## Overlapping orders

Higher orders give more dispersion and resolution, but they can overlap. A wavelength $\lambda$ in order $m$ lands at the same angle as $\lambda'$ in order $m'$ whenever $m\lambda = m'\lambda'$. For visible light (400–700 nm), the first order ends at $\sin\theta = 700\text{ nm}/d$ and the second begins at $\sin\theta = 800\text{ nm}/d$, so they never overlap. But the second order's red end at 700 nm sits on top of the third order's 467 nm blue. Spectrometers that work in high orders use filters to block the unwanted wavelengths.

### Example 2

A grating has 500 lines/mm. At what angle does 700 nm light appear in second order, and which visible wavelength appears there in third order?

$d = 2.00$ μm. Second order: $\sin\theta = \dfrac{2(700\times10^{-9})}{2.00\times10^{-6}} = 0.700$, $\theta = 44.4^\circ$. Third order at the same angle: $\lambda' = \dfrac{2(700)}{3} = 467$ nm.

## X-rays and crystals

X-rays have wavelengths around 0.01–10 nm. A ruled grating is useless for them: with $d$ thousands of times larger than $\lambda$, every maximum would crowd into a tiny angle around the straight-through beam. But nature supplies gratings of the right size. In a crystal the atoms sit in a regular three-dimensional array, with spacings of a few tenths of a nanometer, comparable to X-ray wavelengths.

Think of the crystal as a stack of parallel planes of atoms a distance $d$ apart. Each plane reflects a small fraction of an X-ray beam, as if it were a weak mirror (angle in equals angle out). The rays reflected by neighboring planes differ in path by two short segments of length $d\sin\theta$, where $\theta$ is the **glancing angle** between the beam and the planes.

![Three horizontal rows of atoms, the planes of a crystal, separated by a distance d. Two parallel X-ray beams come in from the upper left at a glancing angle theta to the planes; one reflects from an atom in the top plane, the other from the atom directly below it in the second plane. Both leave toward the upper right at the same angle. Dashed lines from the top atom drop perpendicular to the lower beam, marking two highlighted segments on the lower beam's path, each d sin theta long, that together make the extra path 2d sin theta.](images/phys-m11-bragg.svg)

The reflections reinforce when the extra path is a whole number of wavelengths. This is **Bragg's law**:

$$2d\sin\theta = m\lambda, \qquad m = 1, 2, 3, \ldots$$

Unlike the grating equation, $\theta$ here is measured from the planes, not from the normal, and the beam is deflected through $2\theta$ in total. A real crystal contains many families of planes with different orientations and spacings; rotating the crystal (or using a powder of tiny crystals in all orientations) brings each family into the Bragg condition in turn.

### Example 3

X-rays of wavelength 0.154 nm (the strong copper "K-alpha" line used in many labs) hit a sodium chloride crystal whose planes are 0.282 nm apart. Find the first- and second-order Bragg angles and the highest order.

First order: $\sin\theta_1 = \dfrac{0.154}{2(0.282)} = 0.273$, so $\theta_1 = 15.8^\circ$ (the beam is deflected $31.7^\circ$).

Second order: $\sin\theta_2 = 0.546$, $\theta_2 = 33.1^\circ$.

Highest order: $m \le 2d/\lambda = 3.66$, so $m = 3$ ($\theta_3 = 55.0^\circ$).

### Example 4

With 0.0710 nm X-rays, a crystal shows a first-order Bragg peak at $\theta = 11.2^\circ$. What is the plane spacing?

$d = \dfrac{\lambda}{2\sin\theta} = \dfrac{0.0710\text{ nm}}{2\sin 11.2^\circ} = 0.183$ nm.

Run backward like this, measured Bragg angles reveal how atoms are arranged. That is **X-ray crystallography**.

## A short history

In 1912 Max von Laue proposed that crystals would diffract X-rays, and Walter Friedrich and Paul Knipping confirmed it. The experiment was strong evidence both that X-rays are waves and that crystals are regular arrays of atoms. Within a year William Henry Bragg and his son William Lawrence Bragg had the simple plane picture above and were working out crystal structures; they shared the 1915 Nobel Prize in Physics, Lawrence at 25. X-ray diffraction later revealed the structures of minerals, metals, vitamins and proteins. Images of DNA fibers made in Rosalind Franklin's laboratory in 1952 were key evidence for the double-helix model published in 1953. The same law works for electrons, whose wavelengths you will meet in the modern physics module.

## Common mistakes

- Measuring the Bragg angle from the normal. In $2d\sin\theta = m\lambda$, $\theta$ is the glancing angle from the planes; the total deflection is $2\theta$.
- Dropping the 2 in Bragg's law: the extra path is $d\sin\theta$ going in plus $d\sin\theta$ coming out.
- Thinking finer rulings improve resolving power. $R = Nm$ depends on the number of lines lit and the order, not on $d$.
- Mixing up dispersion (how far apart colors land) and resolution (whether two close lines can be separated).

## Key points

- Line half-width $\Delta\theta = \lambda/(Nd\cos\theta)$: more lines, sharper lines.
- Angular dispersion $d\theta/d\lambda = m/(d\cos\theta)$.
- Resolving power $R = \lambda/\Delta\lambda = Nm$.
- Orders overlap where $m\lambda = m'\lambda'$; visible first and second orders don't, second and third do.
- Bragg's law $2d\sin\theta = m\lambda$, with $\theta$ the glancing angle; crystals act as gratings for X-rays.

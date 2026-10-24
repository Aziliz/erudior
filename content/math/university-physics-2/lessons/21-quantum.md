---
id: phys-quantum
module: phys-m12
title: Photons, atoms, and matter waves
minutes: 45
topics: [Photons, Atomic structure, Wave–particle duality]
drills: [phys-photon-energy, phys-photoelectric, phys-bohr, phys-de-broglie]
refs: [phys-ref-em-modern, phys-ref-constants]
---
## Energy comes in packets

By 1900 light was firmly established as a wave. Then a series of experiments showed that light's energy arrives in discrete lumps, that atoms emit only certain colors, and that electrons, supposedly particles, produce interference patterns. Explaining all this required quantum physics, the foundation of chemistry, lasers, LEDs, solar cells and transistors. This lesson covers photons, the photoelectric effect, the Bohr model of hydrogen, and wave–particle duality.

## Photons

Max Planck (1900) explained the spectrum of glowing objects by assuming energy is exchanged in multiples of $hf$ (the next lesson tells that story). Einstein (1905) went further: light itself consists of quanta, now called **photons**, each with energy

$$E = hf = \frac{hc}{\lambda},$$

where $h = 6.63\times10^{-34}$ J·s is **Planck's constant**. A handy combination: $hc = 1240$ eV·nm, so a photon of wavelength $\lambda$ (in nm) has energy $1240/\lambda$ eV. Red light (700 nm) photons carry 1.8 eV; violet (400 nm) 3.1 eV; X-rays thousands of eV. Photons also carry momentum $p = h/\lambda$ even though they have no mass; the Compton effect in the next lesson shows that momentum directly.

A beam's brightness tells you how many photons arrive per second; the color tells you how much energy each one has.

### Example 1

A 5.0 mW green laser emits 532 nm light. What is the energy of each photon, and how many photons does it emit per second?

$E = \dfrac{1240\text{ eV·nm}}{532\text{ nm}} = 2.33$ eV $= 2.33(1.602\times10^{-19}) = 3.73\times10^{-19}$ J.

Photons per second: $\dfrac{5.0\times10^{-3}}{3.73\times10^{-19}} = 1.34\times10^{16}$. Individual photons are tiny; even a weak beam contains enormous numbers.

## The photoelectric effect

Light shining on a metal can knock electrons out of it. The wave picture predicts that brighter light of any color should eventually eject electrons, with more energy for brighter light. Experiments showed something else:

- Below a **threshold frequency**, no electrons come out, however bright the light.
- Above it, electrons come out instantly, even in very dim light.
- Their maximum kinetic energy depends on the frequency, not the brightness. Brighter light ejects *more* electrons, not faster ones.

Einstein's photon explanation: each electron absorbs one photon. It must spend a minimum energy, the metal's **work function** $\phi$, to escape; the rest becomes kinetic energy:

$$K_{\max} = hf - \phi.$$

The threshold frequency is $f_0 = \phi/h$. A graph of $K_{\max}$ against $f$ is a straight line with slope $h$ for every metal, which Millikan confirmed in 1916. In the lab, $K_{\max}$ is measured as $eV_{\text{stop}}$, where $V_{\text{stop}}$ is the stopping potential that just halts the fastest electrons.

```plot
{"x": [0, 16], "y": [-5, 5], "xLabel": "frequency f (10¹⁴ Hz)", "yLabel": "K max (eV)", "functions": [{"f": "0.4136*x - 2.28", "from": 5.51, "label": "sodium, φ = 2.28 eV"}, {"f": "0.4136*x - 2.28", "to": 5.51, "dashed": true}, {"f": "0.4136*x - 4.3", "from": 10.40, "label": "φ = 4.3 eV"}, {"f": "0.4136*x - 4.3", "to": 10.40, "dashed": true}], "points": [{"at": [5.51, 0], "label": "f₀ = 5.51"}, {"at": [10.40, 0], "label": "f₀ = 10.4"}, {"at": [0, -2.28], "label": "−φ"}, {"at": [0, -4.3], "label": "−φ"}], "caption": "Maximum kinetic energy against frequency for two metals: parallel lines with slope h = 4.14 × 10⁻¹⁵ eV·s. Each crosses zero at its threshold frequency; extended back (dashed), it meets the vertical axis at −φ. Below threshold no electrons come out"}
```

### Example 2

Sodium has a work function of 2.28 eV. (a) What is its threshold wavelength? (b) Light of 400 nm shines on it; what is the maximum kinetic energy of the ejected electrons and the stopping potential?

(a) $\lambda_0 = \dfrac{hc}{\phi} = \dfrac{1240}{2.28} = 544$ nm. Longer wavelengths (yellow, red) eject nothing.

(b) $hf = 1240/400 = 3.10$ eV. $K_{\max} = 3.10 - 2.28 = 0.82$ eV; stopping potential 0.82 V.

## Atomic spectra and the Bohr model

Heated gases emit light only at specific wavelengths, an **emission spectrum** of bright lines unique to each element (the fingerprints astronomers use to read the composition of stars). Cool gases absorb the same wavelengths.

Niels Bohr (1913) explained hydrogen's lines by proposing that its electron can occupy only certain orbits, with **energy levels**

$$E_n = -\frac{13.6\text{ eV}}{n^2}, \qquad n = 1, 2, 3, \ldots$$

The **ground state** ($n = 1$) has $-13.6$ eV; 13.6 eV is needed to ionize the atom. When the electron drops from a higher level $n_i$ to a lower $n_f$, it emits a photon carrying away the difference:

$$hf = E_i - E_f = 13.6\text{ eV}\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right).$$

Transitions ending at $n = 2$ give the visible Balmer series (red 656 nm from $3\to2$, blue-green 486 nm from $4\to2$); those ending at $n = 1$ are in the ultraviolet. Absorption runs the other way: an atom absorbs only photons whose energy exactly matches a jump up.

The energy-level diagram below draws these levels to scale. Downward arrows are emissions; the longer the arrow, the more energetic the photon. All Lyman lines (ending at $n = 1$) are longer than any Balmer line (ending at $n = 2$), which is why the Lyman series is entirely ultraviolet.

![An energy-level diagram for hydrogen drawn to scale. Horizontal lines mark n = 1 at −13.60 eV (the ground state), n = 2 at −3.40 eV, n = 3 at −1.51 eV, n = 4 at −0.85 eV, and more levels crowding toward 0 eV, the ionization limit, above which the electron is free. Long downward arrows from n = 2 and n = 3 to n = 1 are labeled Lyman (UV); shorter arrows from n = 3 and n = 4 to n = 2 are labeled Balmer (visible). A dashed arrow from n = 1 up to 0 eV is labeled 13.6 eV.](images/phys-m12-hydrogen-levels.svg)

### Example 3

Find the wavelength of the photon emitted when hydrogen's electron drops from $n = 3$ to $n = 2$.

$E_3 = -13.6/9 = -1.511$ eV; $E_2 = -13.6/4 = -3.400$ eV. Photon energy: $1.889$ eV. $\lambda = 1240/1.889 = 656$ nm, red: the brightest line in hydrogen's visible spectrum.

The Bohr model gets hydrogen's energies right but fails for other atoms; the full theory is quantum mechanics, in which electrons occupy probability clouds (orbitals) rather than orbits. The energy levels survive.

## Matter waves and wave–particle duality

Louis de Broglie (1924) proposed that if waves can act like particles, particles can act like waves, with wavelength

$$\lambda = \frac hp = \frac{h}{mv}.$$

This **de Broglie wavelength** was confirmed when electrons fired at crystals produced diffraction patterns (Davisson and Germer, 1927). Today electron microscopes exploit electrons' short wavelengths to resolve atoms. For everyday objects $\lambda$ is absurdly small (a 0.15 kg baseball at 40 m/s has $\lambda \approx 10^{-34}$ m), so wave effects are invisible.

This is **wave–particle duality**: light and matter both show wave behavior (interference, diffraction) and particle behavior (discrete, localized energy and momentum), depending on the experiment. Fire electrons one at a time through two slits and each lands as a single dot, yet the dots build up an interference pattern.

A related principle is Heisenberg's **uncertainty principle**: a particle's position and momentum can't both be known precisely, $\Delta x\,\Delta p \ge \dfrac{h}{4\pi}$. Confining an electron to an atom forces a spread in its momentum, which is why it can't collapse onto the nucleus.

### Example 4

Electrons are accelerated from rest through 100 V. What is their de Broglie wavelength?

$K = 100$ eV $= 1.602\times10^{-17}$ J. $p = \sqrt{2mK} = \sqrt{2(9.11\times10^{-31})(1.602\times10^{-17})} = 5.40\times10^{-24}$ kg·m/s.

$\lambda = \dfrac{6.63\times10^{-34}}{5.40\times10^{-24}} = 1.23\times10^{-10}$ m $= 0.123$ nm, about the spacing of atoms in a crystal, which is why such electrons diffract from crystals.

## Bohr radii and the Schrödinger equation

The Bohr energies come from combining the Coulomb force with quantized angular momentum, $L = mvr = n\hbar$ ($\hbar = h/2\pi$): the allowed radii are $r_n = n^2a_0$ with $a_0 = 0.0529$ nm, and the energy $E = \tfrac12mv^2 - ke^2/r$ works out to $-13.6\text{ eV}/n^2$.

In full quantum mechanics a particle is described by a wave function $\psi(x)$ obeying the Schrödinger equation, $-\dfrac{\hbar^2}{2m}\dfrac{d^2\psi}{dx^2} + U\psi = E\psi$; $|\psi|^2$ is the probability density. For a particle in a box of width $L$ (with $U = 0$ inside), the solutions are $\psi = \sin(n\pi x/L)$, standing waves exactly like a string fixed at both ends, giving quantized energies $E_n = \dfrac{n^2h^2}{8mL^2}$. Quantization is what happens when waves are confined.

## Common mistakes

- Thinking brighter light gives photoelectrons more energy (it gives more of them).
- Mixing eV and J (1 eV $= 1.602\times10^{-19}$ J); use $hc = 1240$ eV·nm with $\lambda$ in nm.
- Forgetting the levels are negative, or writing $1/n_i^2 - 1/n_f^2$ with the wrong sign.
- Using the relativistic or massless formula $E = pc$ for slow electrons (use $p = \sqrt{2mK}$).

## Key points

- Photon: $E = hf = hc/\lambda$, $p = h/\lambda$; $hc = 1240$ eV·nm.
- Photoelectric: $K_{\max} = hf - \phi$; threshold $f_0 = \phi/h$; intensity changes the number, not the energy.
- Hydrogen: $E_n = -13.6\text{ eV}/n^2$; emitted photon energy is the level difference.
- de Broglie: $\lambda = h/p$; wave–particle duality applies to light and matter.

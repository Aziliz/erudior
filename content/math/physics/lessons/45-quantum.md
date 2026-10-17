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

By 1900 light was firmly established as a wave. Then a series of experiments showed that light's energy arrives in discrete lumps, that atoms emit only certain colors, and that electrons, supposedly particles, produce interference patterns. Explaining all this required quantum physics, the foundation of chemistry, lasers, LEDs, solar cells and transistors. This lesson covers photons, the photoelectric effect, blackbody radiation and Compton scattering, the Bohr model of hydrogen, and wave–particle duality.

## Photons

Max Planck (1900) explained the spectrum of glowing objects by assuming energy is exchanged in multiples of $hf$. Einstein (1905) went further: light itself consists of quanta, now called **photons**, each with energy

$$E = hf = \frac{hc}{\lambda},$$

where $h = 6.63\times10^{-34}$ J·s is **Planck's constant**. A handy combination: $hc = 1240$ eV·nm, so a photon of wavelength $\lambda$ (in nm) has energy $1240/\lambda$ eV. Red light (700 nm) photons carry 1.8 eV; violet (400 nm) 3.1 eV; X-rays thousands of eV. Photons also carry momentum $p = h/\lambda$ even though they have no mass.

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

### Example 2

Sodium has a work function of 2.28 eV. (a) What is its threshold wavelength? (b) Light of 400 nm shines on it; what is the maximum kinetic energy of the ejected electrons and the stopping potential?

(a) $\lambda_0 = \dfrac{hc}{\phi} = \dfrac{1240}{2.28} = 544$ nm. Longer wavelengths (yellow, red) eject nothing.

(b) $hf = 1240/400 = 3.10$ eV. $K_{\max} = 3.10 - 2.28 = 0.82$ eV; stopping potential 0.82 V.

## Blackbody radiation and Compton scattering

Two more experiments complete the case for photons.

*Blackbody radiation.* Every object emits electromagnetic radiation because of its temperature. An ideal perfect absorber, called a **blackbody**, is also the best possible emitter, and its spectrum depends only on its temperature. The curve rises to a peak and then falls off toward short wavelengths. As the object gets hotter, the total power rises steeply (as $T^4$, the Stefan–Boltzmann law from the heat lesson) and the peak shifts to shorter wavelengths according to **Wien's displacement law**:

$$\lambda_{\max}T = 2.898\times10^{-3}\text{ m·K},$$

with $T$ in kelvins. That's why a heated poker glows dull red, then orange, then yellow-white. Classical wave theory predicted that the emitted power should keep growing without limit at short wavelengths, which is absurd. Planck's assumption that energy is exchanged only in packets of $hf$ made short-wavelength packets too costly to emit often, which bent the curve back down and matched experiment.

For example, the Sun's surface (about 5800 K) peaks near $2.898\times10^{-3}/5800 = 5.0\times10^{-7}$ m $= 500$ nm, in the middle of the visible range. Your skin (about 310 K) peaks near 9.3 μm, in the infrared, which is what thermal cameras detect.

*Compton scattering.* In 1923 Arthur Compton bounced X-rays off electrons in graphite and found that the scattered X-rays had *longer* wavelengths than the incoming ones, by an amount that depended on the scattering angle. A classical wave would come out at its original wavelength. Photons explain the shift: a photon with momentum $h/\lambda$ collides with a nearly free electron, gives it some energy and momentum, and leaves with less energy, so a longer wavelength. Applying conservation of energy and momentum to this collision gives the shift for **Compton scattering**:

$$\Delta\lambda = \lambda' - \lambda = \frac{h}{m_ec}(1 - \cos\theta),$$

where $\theta$ is the angle through which the photon is scattered and $h/(m_ec) = 2.43\times10^{-12}$ m. The shift is zero for a photon that barely deflects and largest, $2h/(m_ec) = 4.86\times10^{-12}$ m, for one that bounces straight back. A few picometers is a large fraction of an X-ray's wavelength but only about a hundred-thousandth of visible light's, which is why the effect shows up only for X-rays and gamma rays. Compton's result showed that photons carry momentum in collisions just as particles do.

## Atomic spectra and the Bohr model

Heated gases emit light only at specific wavelengths, an **emission spectrum** of bright lines unique to each element (the fingerprints astronomers use to read the composition of stars). Cool gases absorb the same wavelengths.

Niels Bohr (1913) explained hydrogen's lines by proposing that its electron can occupy only certain orbits, with **energy levels**

$$E_n = -\frac{13.6\text{ eV}}{n^2}, \qquad n = 1, 2, 3, \ldots$$

The **ground state** ($n = 1$) has $-13.6$ eV; 13.6 eV is needed to ionize the atom. When the electron drops from a higher level $n_i$ to a lower $n_f$, it emits a photon carrying away the difference:

$$hf = E_i - E_f = 13.6\text{ eV}\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right).$$

Transitions ending at $n = 2$ give the visible Balmer series (red 656 nm from $3\to2$, blue-green 486 nm from $4\to2$); those ending at $n = 1$ are in the ultraviolet. Absorption runs the other way: an atom absorbs only photons whose energy exactly matches a jump up.

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

## Quantization from standing waves

Matter waves explain *why* energies are quantized. A wave confined to a region can only form standing waves that fit, like a guitar string fixed at both ends (the waves lesson).

*Particle in a box.* Trap a particle between two walls a distance $L$ apart. Its wave must have nodes at both walls, so, exactly as for a string, a whole number of half-wavelengths must fit: $L = n\dfrac{\lambda}{2}$, or $\lambda_n = \dfrac{2L}{n}$. De Broglie's relation gives the momentum, $p = h/\lambda = \dfrac{nh}{2L}$, and the kinetic energy is

$$E_n = \frac{p^2}{2m} = \frac{n^2h^2}{8mL^2}, \qquad n = 1, 2, 3, \ldots$$

Only these energies are allowed, and the lowest is not zero: a confined particle can never be completely at rest. A smaller box means shorter wavelengths and higher energies ($E \propto 1/L^2$), which is why electrons squeezed into tiny "quantum dots" emit bluer light as the dots get smaller.

*The Bohr atom.* De Broglie's idea also explains Bohr's orbits: an orbit is allowed only if a whole number of electron wavelengths fits around its circumference, $2\pi r = n\lambda$. Combining that condition with the Coulomb attraction providing the centripetal force gives allowed radii $r_n = n^2(0.0529\text{ nm})$ and exactly the energies $-13.6\text{ eV}/n^2$. The modern theory (quantum mechanics) replaces orbits with standing-wave "clouds", but the idea that quantization comes from fitting waves survives.

### Example 5

An electron is confined to a region 0.50 nm wide. Find its two lowest energies and the wavelength of the photon emitted when it drops from $n = 2$ to $n = 1$.

$E_1 = \dfrac{h^2}{8mL^2} = \dfrac{(6.63\times10^{-34})^2}{8(9.11\times10^{-31})(0.50\times10^{-9})^2} = 2.41\times10^{-19}$ J $= 1.51$ eV.

$E_2 = 2^2E_1 = 6.02$ eV, so the photon carries $E_2 - E_1 = 3E_1 = 4.52$ eV and has $\lambda = 1240/4.52 = 274$ nm (ultraviolet).

## Common mistakes

- Thinking brighter light gives photoelectrons more energy (it gives more of them).
- Mixing eV and J (1 eV $= 1.602\times10^{-19}$ J); use $hc = 1240$ eV·nm with $\lambda$ in nm.
- Forgetting the levels are negative, or writing $1/n_i^2 - 1/n_f^2$ with the wrong sign.
- Using the relativistic or massless formula $E = pc$ for slow electrons (use $p = \sqrt{2mK}$).

## Key points

- Photon: $E = hf = hc/\lambda$, $p = h/\lambda$; $hc = 1240$ eV·nm.
- Photoelectric: $K_{\max} = hf - \phi$; threshold $f_0 = \phi/h$; intensity changes the number, not the energy.
- Blackbody peak (Wien): $\lambda_{\max}T = 2.898\times10^{-3}$ m·K. Compton shift: $\Delta\lambda = \dfrac{h}{m_ec}(1 - \cos\theta)$.
- Hydrogen: $E_n = -13.6\text{ eV}/n^2$; emitted photon energy is the level difference.
- de Broglie: $\lambda = h/p$; wave–particle duality applies to light and matter.

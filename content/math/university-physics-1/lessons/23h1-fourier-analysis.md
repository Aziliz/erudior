---
id: phys-m6-h-fourier
module: phys-m6
title: 'Fourier analysis: harmonics and spectra'
minutes: 45
honors: true
topics: [Fourier analysis]
drills: [phys-m6-r2-square-harmonics, phys-m6-r2-plucked-string]
refs: [phys-ref-waves-thermo]
---
## Why a violin and a flute sound different

The waves lesson ended with a claim: a plucked string vibrates in a *mix* of harmonics, and the mix gives each instrument its tone. The sound lesson added that a pipe closed at one end has only odd harmonics. A violin and a flute playing the same note (the same fundamental frequency) sound different because they put different amounts of energy into the harmonics above it.

This lesson makes that precise. A French mathematician, Joseph Fourier, studying how heat spreads through solids (his memoir of 1807 and his book of 1822), claimed that any periodic function can be built by adding sines and cosines whose frequencies are whole-number multiples of one base frequency. The tool that grew from this, **Fourier analysis**, is now used everywhere waves and signals appear: in music, in phone calls, in MRI scanners and in earthquake records. Here you'll learn to find the ingredients of a periodic signal, to read a spectrum, and to predict which harmonics a plucked string will have.

## Fourier's theorem

Let $y(t)$ repeat with period $T$, and let $\omega_1 = 2\pi/T$ be its fundamental angular frequency. **Fourier's theorem** says that $y(t)$ can be written as a **Fourier series**:

$$y(t) = a_0 + \sum_{n=1}^{\infty}\left[a_n\cos(n\omega_1t) + b_n\sin(n\omega_1t)\right].$$

The numbers $a_0$, $a_n$ and $b_n$ are the **Fourier coefficients**. The term with $n = 1$ is the fundamental; the term with frequency $n\omega_1$ is the $n$th harmonic. The amplitude of the $n$th harmonic is $c_n = \sqrt{a_n^2 + b_n^2}$, because a cosine and a sine of the same frequency add up to a single sinusoid of that frequency.

The claim holds for every periodic signal met in physics, including ones with jumps and corners. (Mathematicians state exact conditions; this lesson simplifies by assuming the signal is piecewise smooth, which covers every example here.) At a jump, the series converges to the midpoint of the jump.

### Finding the coefficients

The key fact is that different harmonics are **orthogonal**: over one full period, the product of two of them averages to zero unless they are the same harmonic.

$$\int_0^T \sin(n\omega_1t)\sin(m\omega_1t)\,dt = \begin{cases} T/2 & n = m \\ 0 & n \ne m\end{cases}$$

The same holds for two cosines, and the integral of $\sin(n\omega_1t)\cos(m\omega_1t)$ over a period is always zero. (Each follows from the product-to-sum identities: the product becomes a sum of sinusoids with whole numbers of cycles in $T$, each integrating to zero, except for the constant term $\tfrac12$ when $n = m$.)

So to pull out $b_m$, multiply the whole series by $\sin(m\omega_1t)$ and integrate over one period. Every term vanishes except $b_m(T/2)$:

$$a_0 = \frac1T\int_0^T y\,dt, \qquad a_n = \frac2T\int_0^T y\cos(n\omega_1t)\,dt, \qquad b_n = \frac2T\int_0^T y\sin(n\omega_1t)\,dt.$$

$a_0$ is just the average value of the signal. Each other coefficient measures how much the signal "looks like" that harmonic. You can integrate over any interval one period long, such as $-T/2$ to $T/2$.

**Symmetry shortcuts.** If $y$ is an odd function of $t$ ($y(-t) = -y(t)$), every $a_n$ and $a_0$ is zero: only sines. If $y$ is even, only cosines (and possibly $a_0$). If the second half of each cycle is the first half turned upside down ($y(t + T/2) = -y(t)$), the even harmonics vanish and only odd ones remain.

### Example 1

Find the Fourier series of a square wave that equals $+A$ for $0 < t < T/2$ and $-A$ for $T/2 < t < T$.

The average is zero, so $a_0 = 0$. The wave is odd about $t = 0$ (it is $-A$ just before $t = 0$ and $+A$ just after), so every $a_n = 0$.

For the sines, use the symmetry: the two halves contribute equally, so

$$b_n = \frac2T\cdot 2\int_0^{T/2}A\sin(n\omega_1t)\,dt = \frac{4A}{T}\cdot\frac{1 - \cos(n\pi)}{n\omega_1} = \frac{2A}{n\pi}\left(1 - \cos n\pi\right).$$

For even $n$, $\cos n\pi = 1$ and $b_n = 0$. For odd $n$, $\cos n\pi = -1$ and $b_n = 4A/(n\pi)$:

$$y(t) = \frac{4A}{\pi}\left[\sin\omega_1t + \frac13\sin3\omega_1t + \frac15\sin5\omega_1t + \cdots\right].$$

Only odd harmonics appear, as the half-wave symmetry predicted, and their amplitudes fall off as $1/n$. For a 200 Hz square wave of amplitude 5.0 V, the harmonics are 6.37 V at 200 Hz, 2.12 V at 600 Hz, 1.27 V at 1000 Hz, and so on. Notice that the fundamental's amplitude, $4A/\pi = 1.27A$, is *larger* than the square wave's own height.

The graph shows how the partial sums close in on the square wave.

```plot
{"x": [0, 2], "y": [-1.6, 1.6], "xLabel": "t / T", "yLabel": "y / A", "functions": [{"f": "4/pi*sin(2*pi*x)", "dashed": true}, {"f": "4/pi*(sin(2*pi*x) + sin(6*pi*x)/3 + sin(10*pi*x)/5)"}, {"f": "4/pi*(sin(2*pi*x) + sin(6*pi*x)/3 + sin(10*pi*x)/5 + sin(14*pi*x)/7 + sin(18*pi*x)/9 + sin(22*pi*x)/11 + sin(26*pi*x)/13 + sin(30*pi*x)/15 + sin(34*pi*x)/17 + sin(38*pi*x)/19)"}], "labels": [{"at": [0.62, 1.42], "text": "1 term"}, {"at": [1.25, 1.42], "text": "10 terms"}], "caption": "Square wave of height A: the fundamental alone (dashed), the first 3 odd harmonics, and the first 10"}
```

More terms sharpen the corners, but right beside each jump the sum always overshoots, by about 9% of the jump, no matter how many terms you add; the overshoot just gets narrower. This is the **Gibbs phenomenon**, and it's why a sharp edge needs very high harmonics to reproduce well.

## The spectrum

A graph of harmonic amplitude $c_n$ against frequency is the signal's **spectrum**. It throws away the timing details and keeps the recipe: which frequencies are present and how strongly. Two signals with the same spectrum but different phases between harmonics can look quite different on an oscilloscope, yet to the ear they usually sound almost the same, because hearing is mostly sensitive to the amplitudes and not to the relative phases (a useful approximation, not an exact law).

```plot
{"x": [0, 10], "y": [0, 1.4], "xLabel": "harmonic number n", "yLabel": "amplitude c_n / A", "bars": [{"x": 1, "height": 1.273, "width": 0.5}, {"x": 3, "height": 0.424, "width": 0.5}, {"x": 5, "height": 0.255, "width": 0.5}, {"x": 7, "height": 0.182, "width": 0.5}, {"x": 9, "height": 0.141, "width": 0.5}], "caption": "Spectrum of a square wave: odd harmonics only, with amplitudes 4/(nπ) times A"}
```

**Energy in each harmonic.** The power a wave carries is proportional to its amplitude squared, and orthogonality makes the harmonics' contributions add separately. The average of $y^2$ over a period is

$$\overline{y^2} = a_0^2 + \tfrac12\sum_{n=1}^{\infty}c_n^2,$$

a result called **Parseval's theorem**. For the square wave, $\overline{y^2} = A^2$, and the fundamental alone contributes $\tfrac12(4A/\pi)^2 = (8/\pi^2)A^2 = 0.81A^2$. So 81% of the power is in the fundamental, and the first three odd harmonics together hold 93%. Most of the energy sits in a few low harmonics; the high ones matter for the shape of sharp edges and for the brightness of the tone.

A sawtooth wave (rising steadily and then dropping back at once) has *every* harmonic, with $c_n = 2A/(n\pi)$ for a sawtooth that runs from $-A$ to $+A$. Compared with a square wave, it adds all the even harmonics. That is roughly the difference you hear between a closed pipe, whose resonances are odd harmonics only, and an open pipe or a string, which can have them all. Real instruments are more complicated (a clarinet's spectrum is dominated by odd harmonics only in its lower register), but the pattern is a good first guide.

## The plucked string

A string of length $L$ fixed at both ends, pulled aside at one point and released, starts from a triangle shape. Its later motion is a sum of the standing-wave harmonics from the waves lesson, $\sin(n\pi x/L)$, each oscillating at its own frequency $f_n = nf_1$. Fourier analysis in *space* (the same integrals with $x$ in place of $t$) gives the starting amplitude of each one. Pluck it at distance $d$ from one end, with the pluck point pulled aside a distance $h$, and the $n$th harmonic's amplitude is

$$B_n = \frac{2hL^2}{\pi^2 n^2 d(L - d)}\sin\frac{n\pi d}{L}.$$

Two features matter. The $1/n^2$ makes the harmonics fade faster than for a square wave (a triangle has corners, not jumps, so it needs less high-frequency content). And the factor $\sin(n\pi d/L)$ is zero whenever the pluck point is a node of the $n$th harmonic: **a harmonic with a node at the pluck point is missing**. Plucked at the middle, every even harmonic is missing; plucked at one fifth of the length, the 5th, 10th, 15th… are.

### Example 2

A guitar string is plucked one quarter of the way along ($d = L/4$). Find the amplitudes of harmonics 2, 3 and 4 relative to the fundamental.

The ratio is $\dfrac{B_n}{B_1} = \dfrac{\sin(n\pi/4)}{n^2\sin(\pi/4)}$.

- $n = 2$: $\dfrac{\sin(\pi/2)}{4\sin(\pi/4)} = \dfrac{1}{4(0.7071)} = 0.354$.
- $n = 3$: $\dfrac{\sin(3\pi/4)}{9\sin(\pi/4)} = \dfrac19 = 0.111$.
- $n = 4$: $\sin\pi = 0$, so the 4th harmonic is missing (as are the 8th, 12th…), because $x = L/4$ is a node of the 4th harmonic.

Plucking close to the bridge (small $d$) makes $\sin(n\pi d/L)$ grow with $n$ for the first several harmonics, so the higher harmonics are stronger relative to the fundamental and the tone is brighter; plucking near the middle gives a rounder, mellower sound. Guitarists use exactly this.

## Pulses and the bandwidth of a signal

A single pulse is not periodic, but you can treat it as a periodic signal with a very long period. As $T$ grows, the harmonics $n/T$ crowd together into a continuous range of frequencies, and the Fourier series becomes the Fourier transform. The main result to remember is a trade-off: a signal lasting about $\Delta t$ contains frequencies spread over a range of about

$$\Delta f \sim \frac{1}{\Delta t}.$$

(The exact number in front depends on how "duration" and "spread" are defined, so treat this as an order-of-magnitude rule.) A short click contains a wide band of frequencies; a pure tone must last many cycles. This is the same trade-off you met with resonance: a high-$Q$ oscillator has a narrow bandwidth $\Delta\omega$ and takes a long time, about $1/\Delta\omega$, to ring up or die down. In practice, spectra are computed from sampled data by the fast Fourier transform, an algorithm published by Cooley and Tukey in 1965 that made the calculation fast enough for everyday use.

## Common mistakes

- Forgetting the factor of 2 in $a_n$ and $b_n$ (it is $\tfrac2T$, but $\tfrac1T$ for $a_0$).
- Expecting every harmonic to be present. Symmetry removes some (odd harmonics only for half-wave symmetry), and a pluck at a node of a harmonic removes that harmonic.
- Thinking the Gibbs overshoot shrinks to zero with more terms. It gets narrower but stays about 9% of the jump.
- Adding harmonic amplitudes to find total power. Power adds as amplitudes *squared* (Parseval).
- Confusing the harmonic number with frequency: the $n$th harmonic has frequency $nf_1$.

## Key points

- Any periodic signal with period $T$ is a sum of a constant and harmonics at $n\omega_1$, with $\omega_1 = 2\pi/T$.
- Coefficients by orthogonality: $a_0$ is the average; $a_n, b_n = \tfrac2T\int y\cos$ or $\sin(n\omega_1t)\,dt$.
- Square wave: $\dfrac{4A}{\pi}\left(\sin\omega_1t + \tfrac13\sin3\omega_1t + \cdots\right)$, odd harmonics only. Sawtooth: all harmonics, $2A/(n\pi)$.
- The spectrum shows amplitude against frequency; power in each harmonic is proportional to $c_n^2$.
- Plucked string: amplitudes fall as $1/n^2$, and harmonics with a node at the pluck point are missing.
- A signal lasting $\Delta t$ spans about $\Delta f \sim 1/\Delta t$.

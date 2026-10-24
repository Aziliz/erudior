---
id: phys-m6-h-harmonics-music
module: phys-m6
title: Harmonics, timbre, and musical scales
minutes: 45
honors: true
topics: [Fourier analysis, Musical acoustics]
drills: [phys-m6-r2-equal-temperament, phys-m6-r2-cents, phys-m6-r2-harmonic-beats]
refs: [phys-ref-waves-thermo]
---
## Why a violin doesn't sound like a flute

The waves lesson said that a plucked string vibrates in a mix of harmonics and that the mix gives each instrument its tone quality; the sound lesson showed that a pipe closed at one end has only odd harmonics. Play the same note, say A at 440 Hz, on a violin, a flute and a clarinet, and you hear three different sounds with the same pitch. This lesson explains why, using one of the most useful ideas in all of physics (Fourier's theorem), and then uses harmonics and beats to explain why some pairs of notes sound smooth together, and why a modern piano is, by design, slightly out of tune.

## Fourier's theorem

In his work on heat flow (published in 1822), Joseph Fourier claimed that any repeating pattern can be built from sine waves. In the form used for sound:

> **Fourier's theorem.** Any periodic wave with period $T$ (frequency $f_1 = 1/T$) can be written as a sum of sine waves with frequencies $f_1$, $2f_1$, $3f_1$, $\ldots$, each with its own amplitude and phase.

(Mathematicians later had to make "any" precise, but every wave a musician will meet qualifies.) The sine waves are exactly the harmonics: a repeating wave can contain *only* whole-number multiples of its repetition frequency. Breaking a wave into its harmonics is called **Fourier analysis**, and a graph of each harmonic's amplitude against its frequency is the wave's **spectrum**. Building a wave by adding harmonics is Fourier synthesis.

A clean example is the square wave, which jumps between $+1$ and $-1$ every half period. It contains only odd harmonics, with amplitudes falling as $1/n$:

$$\text{square wave} = \frac{4}{\pi}\left[\sin(2\pi f_1t) + \tfrac13\sin(2\pi\cdot3f_1t) + \tfrac15\sin(2\pi\cdot5f_1t) + \cdots\right]$$

```plot
{"x": [0, 2.3], "y": [-1.6, 1.6], "xLabel": "t / T", "yLabel": "displacement", "functions": [{"f": "(4/pi)*sin(2*pi*x)", "dashed": true, "to": 2}, {"f": "(4/pi)*(sin(2*pi*x) + sin(6*pi*x)/3 + sin(10*pi*x)/5 + sin(14*pi*x)/7 + sin(18*pi*x)/9)", "to": 2}], "caption": "Adding odd harmonics with amplitudes 1, 1/3, 1/5, … builds a square wave: dashed, the 1st harmonic alone; solid, the sum of the first five odd harmonics (time in periods)"}
```

A sawtooth wave (rising steadily, then dropping) contains *all* harmonics with amplitudes $1/n$. The two waves have the same period and so the same pitch; they differ only in their spectra.

```plot
{"x": [0, 11.5], "y": [0, 1.15], "xLabel": "harmonic n", "yLabel": "amplitude (fundamental = 1)", "bars": [{"x": 1, "height": 1, "width": 0.6}, {"x": 3, "height": 0.3333, "width": 0.6}, {"x": 5, "height": 0.2, "width": 0.6}, {"x": 7, "height": 0.1429, "width": 0.6}, {"x": 9, "height": 0.1111, "width": 0.6}], "caption": "Spectrum of a square wave: odd harmonics only, amplitude 1/n"}
```

## Timbre

**Timbre** (pronounced "TAM-ber") is the quality that tells two sounds of the same pitch and loudness apart. Its main ingredient is the spectrum: which harmonics are present and how strong. Roughly:

- A flute's tone is close to a pure sine, with weak upper harmonics.
- A clarinet, a pipe effectively closed at one end, has strong odd harmonics and weak even ones in its low register. (Simplified: real clarinets do produce some even harmonics, and the pattern changes in the upper register.)
- A bowed violin string has a rich spectrum with many strong harmonics, close to a sawtooth.

How a sound starts and dies away also matters (a piano note played backward sounds like a different instrument), so the spectrum is the main part of timbre, not all of it.

**Pitch from the pattern.** We hear the pitch of a complex tone at its repetition frequency $f_1$, even if that harmonic is weak or missing. If a sound has components at 600, 800 and 1000 Hz, it repeats 200 times a second (all three are multiples of 200 Hz), and most listeners hear a 200 Hz pitch. This "missing fundamental" effect is why a small phone speaker that can't produce 100 Hz still lets you recognize a deep voice.

### Example 1

A complex tone contains components at 450, 750 and 1050 Hz. (a) What pitch do you expect to hear? (b) Which harmonics are these? (c) Could this tone come from an ideal pipe closed at one end?

(a) The wave repeats at the greatest frequency that divides all three: 450 = 3(150), 750 = 5(150), 1050 = 7(150), so $f_1 = 150$ Hz. (No larger frequency works: 300 Hz, for instance, doesn't divide 450.) The pitch is 150 Hz, even though nothing is present at 150 Hz.

(b) The 3rd, 5th and 7th harmonics.

(c) Yes: all are odd harmonics, which fits a closed pipe (with its fundamental unusually weak).

## Where you pluck matters

For an ideal string, harmonic $n$ has nodes at $L/n$, $2L/n$, …. Plucking (or striking) a point gives that point a large displacement, so harmonics with a node there are not excited at all. Pluck a string exactly in the middle and every even harmonic, which has a node at $L/2$, is missing: the tone is hollow, like a clarinet's. Pluck near the end (as at a guitar's bridge) and many harmonics are present: a bright, twangy tone. This is one reason guitarists move their picking hand to change the sound. (Real strings are stiff and pluck points are not exact, so a "missing" harmonic is in practice just much weaker.)

### Example 2

A string is plucked one-third of the way along. Which of the first nine harmonics are missing?

Harmonic $n$ has a node at $L/3$ if $L/3$ is a whole multiple of $L/n$, which happens when $n$ is a multiple of 3. So harmonics 3, 6 and 9 are missing; 1, 2, 4, 5, 7 and 8 are present.

## Consonance and beats between harmonics

Two notes sound smooth together (consonant) when their frequencies are in a simple whole-number ratio. The main **musical intervals**:

| Interval | Ratio | Example from A3 = 220 Hz |
|---|---|---|
| Octave | 2 : 1 | 440 Hz |
| Perfect fifth | 3 : 2 | 330 Hz |
| Perfect fourth | 4 : 3 | 293.3 Hz |
| Major third | 5 : 4 | 275 Hz |

One explanation, proposed by Hermann von Helmholtz in the 1860s, uses harmonics. With a simple ratio, many harmonics of the two notes *coincide*: in a 3 : 2 fifth, the 3rd harmonic of the lower note equals the 2nd of the upper. When the ratio is slightly off, those near-coinciding harmonics produce beats, heard as roughness. This is one of the main accounts of the physical side, but the question is not settled: a rival account says listeners prefer combinations whose harmonics together still fit a single harmonic series, and musical training and culture also shape what sounds pleasant.

```plot
{"x": [0, 1600], "y": [0, 1.3], "xLabel": "f (Hz)", "yLabel": "harmonics", "segments": [{"from": [220, 0], "to": [220, 1]}, {"from": [440, 0], "to": [440, 1]}, {"from": [660, 0], "to": [660, 1]}, {"from": [880, 0], "to": [880, 1]}, {"from": [1100, 0], "to": [1100, 1]}, {"from": [1320, 0], "to": [1320, 1]}, {"from": [330, 0], "to": [330, 0.7], "dashed": true}, {"from": [660, 0], "to": [660, 0.7], "dashed": true}, {"from": [990, 0], "to": [990, 0.7], "dashed": true}, {"from": [1320, 0], "to": [1320, 0.7], "dashed": true}], "labels": [{"at": [660, 1.15], "text": "coincide"}, {"at": [1320, 1.15], "text": "coincide"}], "caption": "Harmonics of 220 Hz (solid) and 330 Hz (dashed): in a perfect fifth every 2nd harmonic of the upper note lands on a harmonic of the lower"}
```

Piano tuners use exactly this. To tune a fifth, they listen to the beat between the two nearly coinciding harmonics, which is much easier to hear than the fifth itself.

### Example 3

An A at 220 Hz and an E are played together. (a) If the E is exactly 330 Hz, what is the beat rate between the A's 3rd harmonic and the E's 2nd? (b) If the E is 331 Hz?

(a) $3(220) = 660$ Hz and $2(330) = 660$ Hz: no beats; the fifth is "pure."

(b) $2(331) = 662$ Hz, so $f_{\text{beat}} = 662 - 660 = 2$ Hz. A 1 Hz mistuning of the E shows up as 2 beats per second, because the 2nd harmonic is off by twice as much.

## Equal temperament and cents

A keyboard has 12 notes per octave. If every fifth were a pure 3 : 2, twelve fifths would have to equal seven octaves, but $(3/2)^{12} = 129.7$ while $2^7 = 128$. The small mismatch, about 1.4%, is called the Pythagorean comma, and no fixed tuning can make every interval pure.

The modern compromise is **equal temperament**: the octave is split into 12 equal frequency *ratios*, called **semitones**, each

$$r = 2^{1/12} = 1.059\,46.$$

A note $n$ semitones above (or, with $n$ negative, below) a reference has frequency $f = f_{\text{ref}}\cdot 2^{n/12}$. The standard reference is A4 = 440 Hz.

Small pitch differences are measured in **cents**: 100 cents per equal-tempered semitone, 1200 per octave. For two frequencies,

$$\text{cents} = 1200\log_2\frac{f_2}{f_1}.$$

An equal-tempered fifth is exactly 700 cents, while a pure 3 : 2 fifth is $1200\log_2 1.5 = 702.0$ cents: the tempered fifth is 2 cents narrow, which almost nobody notices. The tempered major third (400 cents) is about 14 cents wider than a pure 5 : 4 (386.3 cents), which is audible as a gentle beating in sustained chords. Equal temperament spreads the error so that every key sounds equally (slightly) impure.

### Example 4

(a) Find middle C (C4), 9 semitones below A4 = 440 Hz. (b) An equal-tempered fifth is played from A3 = 220 Hz. How fast do the A's 3rd harmonic and the E's 2nd harmonic beat?

(a) $f = 440 \cdot 2^{-9/12} = 440(0.5946) = 261.6$ Hz.

(b) The E is 7 semitones up: $220 \cdot 2^{7/12} = 329.63$ Hz. Its 2nd harmonic is 659.26 Hz; the A's 3rd is 660 Hz. Beat rate $= 660 - 659.26 = 0.74$ Hz, a slow wavering about once every 1.3 s. That slow beat is what a tuner listens for when setting tempered fifths.

## Common mistakes

- Thinking the pitch is set by the strongest harmonic. Pitch follows the repetition rate $f_1$, even when that component is missing.
- Expecting a periodic wave to contain frequencies that are not whole multiples of $f_1$. (Real stiff strings, like a piano's, have overtones slightly above exact multiples, so they are only approximately periodic.)
- Adding semitones by adding hertz. Intervals are ratios: each semitone *multiplies* by $2^{1/12}$.
- Forgetting that the $n$th harmonic magnifies a mistuning $n$ times when counting beats between harmonics.
- Using $\log_{10}$ instead of $\log_2$ in the cents formula (or forgetting the 1200).

## Key points

- Fourier: a periodic wave of frequency $f_1$ is a sum of harmonics $nf_1$; the amplitudes form its spectrum.
- Square wave: odd harmonics, amplitudes $1/n$. Sawtooth: all harmonics, $1/n$.
- Timbre is mainly the spectrum (plus how the sound starts and decays); pitch follows $f_1$.
- Plucking at a point removes harmonics that have a node there.
- Simple ratios (2:1, 3:2, 4:3, 5:4) are consonant; near-misses beat between harmonics.
- Equal temperament: semitone ratio $2^{1/12}$, $f = 440\cdot2^{n/12}$; cents $= 1200\log_2(f_2/f_1)$; tempered fifth 700 vs pure 702 cents.

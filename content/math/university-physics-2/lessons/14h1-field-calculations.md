---
id: phys-m10-h-field-calculations
module: phys-m10
title: 'Field calculations: loops, coils and magnetic dipoles'
minutes: 45
topics: [Magnetic field calculations]
drills: [phys-m10-r2-loop-axis, phys-m10-r2-helmholtz, phys-m10-r2-wire-segment]
refs: [phys-ref-em-modern, phys-ref-constants]
honors: true
---
## Beyond the textbook shapes

The sources lesson found three fields: an infinite straight wire, the center of a circular loop, and the inside of an infinitely long solenoid. Each was picked because it is easy, either because every current element contributes in the same direction (the loop center) or because the symmetry is so high that Ampère's law does the work (the wire and the solenoid). Real coils are not infinite, and the points where we want the field are rarely at the center. This honors lesson uses the Biot–Savart law to go further: the field everywhere along the axis of a loop, the field of a straight wire of finite length, the nearly uniform field of a Helmholtz pair, and the far field of any small loop, which turns out to have the same shape as the field of a bar magnet or of the whole Earth.

The method is always the same: write $d\vec B$ for one current element, use symmetry to decide which components cancel, and integrate only the component that survives.

## The field on the axis of a loop

Take a circular loop of radius $R$ carrying current $I$, and a point $P$ on its axis a distance $z$ from the center. Every element $d\vec\ell$ of the loop is the same distance $r = \sqrt{R^2 + z^2}$ from $P$, and every element is perpendicular to the line joining it to $P$. So each element contributes

$$dB = \frac{\mu_0}{4\pi}\frac{I\,d\ell}{R^2 + z^2},$$

directed perpendicular to that line.

![A current loop seen edge-on, with the line from one current element to the point P on the axis and that element's contribution dB, which tilts away from the axis](images/phys-m10-loop-axis.svg)

Each $d\vec B$ has a part along the axis and a part sideways. The element on the opposite side of the loop produces the same sideways part pointing the other way, so all the sideways parts cancel. Only the axial parts survive. Call $\alpha$ the angle at $P$ between the axis and the line to the element, so $\sin\alpha = R/r$. Because $d\vec B$ is perpendicular to that line, it makes an angle $90^\circ - \alpha$ with the axis, and its axial part is $dB\sin\alpha$, a fraction $R/r$ of it:

$$dB_z = \frac{\mu_0}{4\pi}\frac{I\,d\ell}{r^2}\cdot\frac Rr.$$

Everything except $d\ell$ is constant around the loop, and $\oint d\ell = 2\pi R$, so

$$B_z = \frac{\mu_0IR^2}{2(R^2 + z^2)^{3/2}}.$$

At $z = 0$ this is $\mu_0I/(2R)$, the loop-center field from the core lesson. For a flat coil of $N$ turns, multiply by $N$.

### Example 1

A flat coil of 50 turns, radius 5.0 cm, carries 3.0 A. Find the field at its center and 12 cm along its axis.

Center: $B = \dfrac{N\mu_0I}{2R} = \dfrac{50(4\pi\times10^{-7})(3.0)}{2(0.050)} = 1.88\times10^{-3}$ T.

At $z = 0.12$ m: $R^2 + z^2 = 0.0025 + 0.0144 = 0.0169$ m², and $(0.0169)^{3/2} = 2.197\times10^{-3}$ m³ (that is $0.13^3$, since $r = 13$ cm). Then

$$B = \frac{50(4\pi\times10^{-7})(3.0)(0.0025)}{2(2.197\times10^{-3})} = 1.07\times10^{-4}\text{ T},$$

less than 6% of the center value. The field falls off quickly once you are a couple of radii away.

## Small loops are magnetic dipoles

Far along the axis, $z \gg R$, the denominator becomes $2z^3$:

$$B_z \approx \frac{\mu_0IR^2}{2z^3} = \frac{\mu_0}{2\pi}\frac{\mu}{z^3}, \qquad \mu = I\pi R^2.$$

The radius and current appear only through the **magnetic dipole moment** $\mu = IA$ from the magnetic-force lesson. A square loop, or any other small flat loop with the same $IA$, gives the same far field. Compare the electric dipole on its axis, $E = \dfrac{1}{4\pi\varepsilon_0}\dfrac{2p}{z^3}$: the same $1/z^3$ fall-off and the same factor of 2. The match is complete off the axis too: far from any small current loop, the field has exactly the shape of an electric dipole's field, with $\mu_0/(4\pi)$ in place of $1/(4\pi\varepsilon_0)$ and $\mu$ in place of $p$. In the loop's own plane (the "equator"), it is half as strong as on the axis at the same distance and points opposite to $\vec\mu$:

$$B_{\text{equator}} = \frac{\mu_0}{4\pi}\frac{\mu}{r^3}.$$

This is why a bar magnet's field, made by the aligned atomic current loops inside it, looks like the field of one big loop when seen from a distance.

How far is "far"? In Example 1, $z = 2.4R$, and the dipole formula gives $1.36\times10^{-4}$ T against the exact $1.07\times10^{-4}$ T, about 27% too high. The approximation is good only when $z$ is several times $R$.

### Example 2: Earth as a dipole

Treat Earth's field as the field of a dipole at its center (a simplification: the real field is tilted about 10° from the rotation axis and has smaller non-dipole parts). The field at the magnetic equator is about $3.0\times10^{-5}$ T at Earth's radius $R_E = 6.37\times10^6$ m. Estimate Earth's dipole moment.

From the equator formula, $\mu = \dfrac{4\pi r^3B}{\mu_0} = \dfrac{4\pi(6.37\times10^6)^3(3.0\times10^{-5})}{4\pi\times10^{-7}} = 7.8\times10^{22}$ A·m².

The accepted value is a little under $8\times10^{22}$ A·m², so the dipole model works well. It also predicts a field at the magnetic poles twice the equatorial value, about $6\times10^{-5}$ T, which is roughly what is measured.

## A straight wire of finite length

Most circuits are made of straight pieces, not infinite wires. For a straight segment and a point at perpendicular distance $a$ from the line of the wire, measure positions along the wire by the angle $\theta$ from the perpendicular, so that $x = a\tan\theta$ and $dx = a\sec^2\theta\,d\theta$. The integrand from the core derivation,

$$dB = \frac{\mu_0I}{4\pi}\frac{a\,dx}{(x^2 + a^2)^{3/2}},$$

becomes $\dfrac{\mu_0I}{4\pi a}\cos\theta\,d\theta$, which integrates to

$$B = \frac{\mu_0I}{4\pi a}\left(\sin\theta_2 - \sin\theta_1\right),$$

where $\theta_1$ and $\theta_2$ are the angles to the two ends (negative on one side of the perpendicular, positive on the other). An infinite wire has $\theta_1 = -90^\circ$ and $\theta_2 = 90^\circ$, which gives back $\mu_0I/(2\pi a)$. A semi-infinite wire seen from a point opposite its end gets exactly half of that.

### Example 3: the center of a square loop

A square loop of side 10 cm carries 5.0 A. Find the field at its center and compare with a circular loop that just fits inside the square.

Each side is at distance $a = s/2 = 0.050$ m from the center, and its ends are at $\pm45^\circ$. One side gives

$$B_1 = \frac{\mu_0I}{4\pi a}(2\sin45^\circ) = \frac{(10^{-7})(5.0)(1.414)}{0.050} = 1.41\times10^{-5}\text{ T}.$$

All four sides point the same way at the center (the right-hand rule gives the same direction for each), so $B = 4B_1 = 5.66\times10^{-5}$ T. In general $B = \dfrac{2\sqrt2\,\mu_0I}{\pi s}$.

The inscribed circle (radius 5.0 cm) gives $\mu_0I/(2R) = 6.28\times10^{-5}$ T. The square, whose corners lie farther away, has about 90% of the circle's field ($2\sqrt2/\pi = 0.900$).

## Helmholtz coils: a uniform field you can reach

A long solenoid makes a uniform field, but only inside, where it is hard to put an experiment. **Helmholtz coils** are two identical flat coils of radius $R$ on a common axis, carrying the same current in the same direction, separated by exactly $R$. The space between them is open, and near the midpoint the field is remarkably uniform.

The reason is in the shape of one coil's axial field, $B(z) \propto (R^2 + z^2)^{-3/2}$. Its second derivative is proportional to $4z^2 - R^2$, so the curve has inflection points at $z = \pm R/2$. Put the midpoint of the pair at that distance from each coil. By symmetry the slopes of the two coils' fields cancel there (one rising, one falling), and because each coil is at its inflection point, their curvatures are both zero. The first non-constant term in the total field is then of fourth order in the distance from the midpoint, so the field barely changes nearby: within $\pm0.1R$ along the axis it varies by about 0.01%, and within $\pm0.2R$ by under 0.2%.

```plot
{"x": [-2, 2], "y": [0, 0.8], "functions": [{"f": "0.5/(1+(x+0.5)^2)^1.5", "dashed": true, "label": "coil at z = −R/2"}, {"f": "0.5/(1+(x-0.5)^2)^1.5", "dashed": true}, {"f": "0.5/(1+(x+0.5)^2)^1.5 + 0.5/(1+(x-0.5)^2)^1.5", "label": "total"}], "xLabel": "z / R", "yLabel": "B in units of μ₀NI/R", "caption": "Axial field of two Helmholtz coils (dashed: each coil alone). The total is flat across the middle"}
```

Each coil is a distance $R/2$ from the midpoint, so each contributes $\dfrac{N\mu_0IR^2}{2(R^2 + R^2/4)^{3/2}}$, and the total is

$$B = 2\cdot\frac{N\mu_0I}{2R}\left(\frac54\right)^{-3/2} = \left(\frac45\right)^{3/2}\frac{\mu_0NI}{R} \approx 0.716\,\frac{\mu_0NI}{R}.$$

Helmholtz pairs are used to cancel Earth's field around a sensitive experiment, to calibrate Hall probes and magnetometers, and in the classic charge-to-mass ratio experiment, where an electron beam circles in the coils' field.

### Example 4

A Helmholtz pair has coils of radius 15 cm with 100 turns each, carrying 2.0 A. Find the field at the midpoint.

$B = 0.7155\,\dfrac{(4\pi\times10^{-7})(100)(2.0)}{0.15} = 1.20\times10^{-3}$ T, about 24 times Earth's field.

## A note on the toroid

Ampère's law still works whenever symmetry fixes the field's direction and size along a path. A **toroid** is a solenoid bent into a ring: $N$ turns wound on a doughnut. By symmetry the field inside the windings circles around the ring with the same size at each radius $r$, so a circular path gives $B(2\pi r) = \mu_0NI$, or

$$B = \frac{\mu_0NI}{2\pi r}.$$

A circle outside the doughnut (or in the hole) encloses zero net current, so the field there is zero: the toroid traps its whole field inside, which is why toroidal cores are used in transformers and inductors that must not disturb nearby parts. Unlike a solenoid's field, a toroid's field is not uniform: it is stronger at the inner radius than at the outer one.

## Common mistakes

- Adding the magnitudes of all the $d\vec B$ contributions on the axis. The sideways parts cancel; only the axial part, a fraction $R/r$ of each, adds up.
- Using the dipole formula close to the loop. It overestimates the field badly unless $z$ is several times $R$.
- Using the infinite-wire formula for a short segment, or measuring the angles in the segment formula from the wire instead of from the perpendicular.
- Spacing Helmholtz coils by their diameter. The separation equals the radius.

## Key points

- Loop axis: $B = \dfrac{\mu_0IR^2}{2(R^2 + z^2)^{3/2}}$ (times $N$ for a coil); $\mu_0I/(2R)$ at the center.
- Far field of any small loop: a dipole field set by $\mu = IA$; on the axis $\dfrac{\mu_0}{2\pi}\dfrac{\mu}{z^3}$, on the equator $\dfrac{\mu_0}{4\pi}\dfrac{\mu}{r^3}$, the same shape as an electric dipole's field.
- Finite segment: $B = \dfrac{\mu_0I}{4\pi a}(\sin\theta_2 - \sin\theta_1)$; square loop center $\dfrac{2\sqrt2\,\mu_0I}{\pi s}$.
- Helmholtz coils (separation $R$): $B = (4/5)^{3/2}\mu_0NI/R$, uniform near the midpoint because the curvature cancels.
- Toroid: $B = \mu_0NI/(2\pi r)$ inside, zero outside.

---
id: phys-m10-h-particles
module: phys-m10
title: 'Honors: Charged particles at work: helices, cyclotrons, e/m and the Hall effect'
minutes: 45
honors: true
topics: [Particle motion in fields, The Hall effect]
drills: [phys-m10-r2-helix, phys-m10-r2-cyclotron, phys-m10-r2-hall]
refs: [phys-ref-em-modern, phys-ref-constants]
---
## One force law, four machines

The magnetic force lesson found that a charge moving across a uniform field goes in a circle of radius $r = mv/(|q|B)$, with a period $T = 2\pi m/(|q|B)$ that doesn't depend on speed. That lesson stopped at the circle. This one follows the same force law into four places where it does real work: particles spiraling along field lines (the aurora and plasma traps), the cyclotron accelerator, the experiment that discovered the electron's charge-to-mass ratio, and the Hall effect, which tells you what sign the charge carriers in a material have and is used in billions of sensors.

Throughout, $e = 1.6\times10^{-19}$ C, $m_e = 9.11\times10^{-31}$ kg and $m_p = 1.67\times10^{-27}$ kg.

## Helical motion

Split the velocity into a part along the field, $v_\parallel = v\cos\theta$, and a part across it, $v_\perp = v\sin\theta$, where $\theta$ is the angle between $\vec v$ and $\vec B$. The force $|q|vB\sin\theta = |q|v_\perp B$ depends only on the perpendicular part and points perpendicular to the field, so:

- along the field, nothing acts: $v_\parallel$ stays constant;
- across the field, the particle circles with radius $r = \dfrac{mv_\perp}{|q|B}$ and the usual period $T = \dfrac{2\pi m}{|q|B}$.

Together these make a helix, like a stretched spring wrapped around a field line. The distance the particle moves along the field during one turn is the helix's pitch,

$$p = v_\parallel T = \frac{2\pi m v_\parallel}{|q|B}.$$

### Example 1

An electron moves at $2.0\times10^6$ m/s at $30^\circ$ to a $1.0\times10^{-3}$ T field. Find the radius and pitch of its helix.

Components: $v_\perp = v\sin30^\circ = 1.0\times10^6$ m/s, $v_\parallel = v\cos30^\circ = 1.73\times10^6$ m/s.

Radius: $r = \dfrac{(9.11\times10^{-31})(1.0\times10^6)}{(1.6\times10^{-19})(1.0\times10^{-3})} = 5.7\times10^{-3}$ m $= 5.7$ mm.

Period: $T = \dfrac{2\pi(9.11\times10^{-31})}{(1.6\times10^{-19})(1.0\times10^{-3})} = 3.58\times10^{-8}$ s.

Pitch: $p = v_\parallel T = (1.73\times10^6)(3.58\times10^{-8}) = 0.062$ m $= 6.2$ cm, about eleven times the radius: a long, stretched helix, because most of the velocity is along the field.

*Magnetic bottles (a simplified picture).* Where field lines crowd together, the field is stronger, and a spiraling particle feels a small force component pushing it back toward the weaker region. If the field grows enough (how much is enough depends on the angle at which the particle spirals), the particle's motion along the field stops and reverses, so it bounces. A field that is weak in the middle and strong at both ends, a **magnetic mirror**, can trap particles bouncing back and forth. Earth's field is shaped like this, strong near both poles, and it traps charged particles in the Van Allen radiation belts. Separately, charged particles guided down the field lines at high latitudes (mostly electrons from farther out in the magnetosphere, not the belt particles themselves) collide with the upper atmosphere and make the aurora. (The full theory involves the particle's magnetic moment and is beyond this course; the point here is only that spiraling particles follow field lines.)

## The cyclotron

The speed-independent period is the key idea behind the **cyclotron**, invented by Ernest Lawrence in the early 1930s. Two hollow D-shaped metal electrodes, called **dees**, sit back to back with a narrow gap between them, inside a vacuum chamber in a strong uniform field. An alternating voltage across the gap reverses every half period of the ions' circular motion.

![Top view of a cyclotron: two D-shaped electrodes side by side with a narrow vertical gap between them, an ion source at the center, a red spiral path of growing semicircles, an alternating voltage source connected across the gap, and a beam leaving at the top right. The field points out of the page.](images/phys-m10-cyclotron.svg)

Here is what happens, step by step. An ion released at the center is pulled across the gap into one dee. Inside the hollow metal dee there is no electric field, only the magnetic field, so the ion follows a semicircle. By the time it comes back to the gap, half a period later, the voltage has reversed, and it is accelerated again, into the other dee. Each crossing adds energy $|q|\Delta V$; each semicircle is a little wider because the ion is faster ($r \propto v$); but each semicircle takes the same time, so one fixed frequency, the cyclotron frequency $f = |q|B/(2\pi m)$, keeps it in step all the way out.

The ion leaves when its orbit reaches the dee radius $R$. Setting $r = R$ in $r = mv/(|q|B)$ gives the exit speed $v = |q|BR/m$, so the maximum kinetic energy is

$$K_{\max} = \frac12mv^2 = \frac{q^2B^2R^2}{2m}.$$

Notice what isn't in this formula: the gap voltage. A smaller voltage just means more turns to reach the same final energy.

### Example 2

A proton cyclotron has a 1.5 T field and dees of radius 0.50 m. Find the oscillator frequency, the exit energy, and the number of turns if the gap voltage is 50 kV.

Frequency: $f = \dfrac{(1.6\times10^{-19})(1.5)}{2\pi(1.67\times10^{-27})} = 2.29\times10^7$ Hz $= 22.9$ MHz, a radio frequency.

Energy: $K = \dfrac{(1.6\times10^{-19})^2(1.5)^2(0.50)^2}{2(1.67\times10^{-27})} = 4.31\times10^{-12}$ J. In MeV ($1\text{ MeV} = 1.6\times10^{-13}$ J): $K = 27$ MeV.

Turns: each turn crosses the gap twice, gaining $2(50\text{ keV}) = 0.10$ MeV, so about $27/0.10 \approx 270$ turns.

The exit speed is $v = eBR/m = 7.2\times10^7$ m/s, about 24% of the speed of light. That is close to where the simple cyclotron stops working. *Beyond this course:* as a particle approaches light speed, its period in a magnetic field gets longer (special relativity), so it falls out of step with a fixed-frequency oscillator. Higher-energy machines (synchrocyclotrons and synchrotrons) change the frequency or the field as the particles speed up. Medical cyclotrons that make short-lived isotopes for PET scans typically run in roughly the 10–20 MeV range.

## Measuring e/m: crossed fields, then a circle

In 1897 J. J. Thomson showed that cathode rays were made of particles much lighter than any atom by measuring their **charge-to-mass ratio**, $e/m$. His apparatus measured deflections in electric and magnetic fields; a common classroom version uses the same two ideas in a slightly different arrangement.

1. *Select the speed.* Crossed electric and magnetic fields pass only particles with $v = E/B$ (the velocity selector).
2. *Bend the beam.* Switch off the electric field. The beam now circles in the magnetic field alone with $r = mv/(eB)$.

Combining, $\dfrac em = \dfrac{v}{Br} = \dfrac{E}{B^2r}$. Every quantity on the right is measured in the lab. Neither $e$ nor $m$ can be found separately this way; Millikan's oil-drop experiment (1909 onward) measured $e$, and the two results together gave the electron's mass.

### Example 3

With $E = 2.0\times10^4$ V/m and $B = 1.0\times10^{-3}$ T, a beam of electrons goes straight. With $E$ switched off, the beam circles with radius 11.4 cm. Find $e/m$.

Speed: $v = E/B = 2.0\times10^7$ m/s.

Ratio: $\dfrac em = \dfrac{E}{B^2r} = \dfrac{2.0\times10^4}{(1.0\times10^{-3})^2(0.114)} = 1.75\times10^{11}$ C/kg, within 1% of the accepted $1.76\times10^{11}$ C/kg. For comparison, a hydrogen ion's ratio is about 1800 times smaller. A larger $e/m$ could mean a larger charge or a smaller mass; Thomson argued, and his later charge measurements supported, that the charge was about the same as a hydrogen ion's, so these particles had to be far lighter than atoms.

## The Hall effect

In 1879 Edwin Hall asked what happens to the charges *inside* a current-carrying conductor in a magnetic field. The force law answers it. Take a flat strip of width $w$ and thickness $t$, carrying current $I$ along its length, with a field $B$ perpendicular to its face.

![A flat conducting strip carrying current I to the right, in a magnetic field into the page. Electrons drift to the left, and a force arrow F on an electron points up. Negative charge has built up along the top edge and positive charge along the bottom edge; a Hall voltage is measured across the width w. The thickness t is into the page.](images/phys-m10-hall.svg)

The moving carriers feel a sideways magnetic force and pile up on one edge, leaving the opposite charge on the other edge. That charge separation makes a transverse electric field $E_H$ that pushes back. The pile-up stops when the two forces balance: $qE_H = qv_dB$, where $v_d$ is the carriers' drift speed. The voltage across the width is the **Hall voltage**, $V_H = E_Hw = v_dBw$.

The drift speed comes from the current: $I = nqv_dA$ with cross-section $A = wt$, where $n$ is the **charge carrier density**, the number of mobile charges per cubic meter. So $v_d = I/(nqwt)$, and the width cancels:

$$V_H = \frac{IB}{nqt}.$$

This result, the **Hall effect**, is useful three ways:

- *Sign of the carriers.* Positive carriers moving with the current and negative carriers moving against it are pushed to the *same* edge, so the sign of $V_H$ reveals the sign of the carriers. In most metals it shows electrons. In p-type semiconductors (and a few metals) it shows positive carriers, the "holes" of semiconductor physics.
- *Number of carriers.* Measuring $V_H$ gives $n$.
- *Measuring fields.* With $n$ and $t$ known, $V_H$ measures $B$. Hall sensors in cars (wheel speed, crankshaft position), in laptops and phone cases (detecting a closed lid) and in many electronic compasses work this way.

### Example 4

A copper strip 0.10 mm thick carries 10 A in a 1.0 T field perpendicular to its face. Copper has $n = 8.5\times10^{28}$ free electrons per m³. Find the Hall voltage.

$V_H = \dfrac{IB}{nqt} = \dfrac{(10)(1.0)}{(8.5\times10^{28})(1.6\times10^{-19})(1.0\times10^{-4})} = 7.4\times10^{-6}$ V, only 7.4 μV.

So many electrons share the current that each drifts very slowly, and the Hall voltage is tiny. A doped silicon sensor might have $n \approx 10^{22}$ m⁻³, millions of times fewer carriers. With $I = 1.0$ mA, $B = 0.10$ T and the same thickness, $V_H = \dfrac{(1.0\times10^{-3})(0.10)}{(10^{22})(1.6\times10^{-19})(1.0\times10^{-4})} = 6.3\times10^{-4}$ V, about 85 times larger with $\tfrac{1}{10\,000}$ of the current. That's why practical Hall sensors are semiconductors.

## Common mistakes

- Using the full speed $v$ instead of $v_\perp$ for the helix radius, or instead of $v_\parallel$ for the pitch.
- Thinking a cyclotron's frequency must rise as ions speed up (below relativistic speeds, the period is independent of speed).
- Expecting the cyclotron's final energy to depend on the gap voltage (it depends on $B$, $R$, $q$ and $m$).
- Using the strip's width instead of its thickness (the dimension along $B$) in $V_H = IB/(nqt)$.
- Thinking positive and negative carriers pile up on opposite edges: positive carriers moving with the current and negative carriers moving against it are pushed to the *same* edge, so the sign of $V_H$ depends on the carriers' sign.

## Key points

- Helix: $r = mv_\perp/(|q|B)$, pitch $p = v_\parallel(2\pi m/|q|B)$.
- Cyclotron: fixed frequency $f = |q|B/(2\pi m)$; $K_{\max} = q^2B^2R^2/(2m)$; works until particles approach light speed.
- Crossed fields then a circle: $e/m = E/(B^2r)$.
- Hall voltage $V_H = IB/(nqt)$; its sign gives the carriers' sign, its size gives $n$ or $B$.

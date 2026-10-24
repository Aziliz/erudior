---
id: phys-efield
module: phys-m8
title: The electric field
minutes: 40
topics: [Electric field]
drills: [phys-efield-point, phys-efield-accel, phys-efield-two]
refs: [phys-ref-em-modern]
---
## Force at a distance, made local

Coulomb's law tells us the force between charges, but it raises a puzzle: how does one charge "know" about another across empty space? The field idea answers it. Each charge fills the space around it with an electric field, and other charges respond to the field where they are. Fields turn out to be real physical things (they carry energy, and changing fields make light), and they make calculations far easier: work out the field once, then find the force on any charge placed in it.

## Definition of the electric field

Place a small positive **test charge** $q_0$ at a point. The **electric field** there is the force per unit charge:

$$\vec E = \frac{\vec F}{q_0},$$

measured in N/C (equivalently V/m, as we'll see). Then the force on any charge $q$ at that point is

$$\vec F = q\vec E.$$

A positive charge is pushed along $\vec E$, a negative charge opposite to it.

## Field of a point charge

From Coulomb's law, a point charge $q$ produces a field of magnitude

$$E = k\frac{|q|}{r^2}$$

at distance $r$, pointing radially away from a positive charge and toward a negative one. The field exists whether or not a test charge is there.

### Example 1

What is the electric field 0.20 m from a $+5.0$ nC charge? What force would an electron feel there?

$E = (8.99\times10^9)\dfrac{5.0\times10^{-9}}{(0.20)^2} = 1124$ N/C, pointing away from the charge.

Electron: $F = eE = (1.602\times10^{-19})(1124) = 1.80\times10^{-16}$ N, directed toward the charge (opposite to $\vec E$).

## Superposition of fields

The field from several charges is the vector sum of their individual fields. For two charges, compute each field at the point of interest, find components, and add. Points where the fields cancel can exist: between two equal positive charges, the field is zero at the midpoint.

### Example 2

A $+2.0$ μC charge is at the origin and a $-2.0$ μC charge at $x = 0.10$ m (an **electric dipole**, the subject of a lesson of its own after electric potential). Find the field at the midpoint, $x = 0.050$ m.

Positive charge's field at the midpoint points away from it, in $+x$: $E_1 = (8.99\times10^9)\dfrac{2.0\times10^{-6}}{(0.050)^2} = 7.19\times10^6$ N/C.

Negative charge's field points toward it, also $+x$, with the same magnitude.

Total: $1.44\times10^7$ N/C in the $+x$ direction (from the positive toward the negative charge).

## Field lines

**Electric field lines** picture the field: they're drawn tangent to $\vec E$ at every point, with density proportional to the field's strength. Rules:

- Lines start on positive charges and end on negative charges (or at infinity).
- The number of lines leaving or entering a charge is proportional to its magnitude.
- Lines never cross (the field has one direction at each point).

```plot
{"x": [-3, 3], "y": [-2.2, 2.2], "equal": true, "vectorField": {"u": "((x+1)/((x+1)^2+y^2)^1.5 - (x-1)/((x-1)^2+y^2)^1.5)/(((x+1)/((x+1)^2+y^2)^1.5 - (x-1)/((x-1)^2+y^2)^1.5)^2+(y/((x+1)^2+y^2)^1.5 - y/((x-1)^2+y^2)^1.5)^2)^0.4", "v": "(y/((x+1)^2+y^2)^1.5 - y/((x-1)^2+y^2)^1.5)/(((x+1)/((x+1)^2+y^2)^1.5 - (x-1)/((x-1)^2+y^2)^1.5)^2+(y/((x+1)^2+y^2)^1.5 - y/((x-1)^2+y^2)^1.5)^2)^0.4", "step": 0.5}, "points": [{"at": [-1, 0], "label": "+q"}, {"at": [1, 0], "label": "−q"}], "caption": "Field of a dipole: arrows point away from +q and toward −q (arrow lengths are compressed so weak regions stay visible)"}
```

## Uniform fields and charged particles

Two large parallel plates with equal and opposite charges produce a nearly **uniform field** between them: the same magnitude and direction everywhere (pointing from the positive plate to the negative). A charged particle there feels a constant force $qE$ and so has constant acceleration

$$a = \frac{qE}{m}.$$

All the constant-acceleration kinematics from mechanics applies. An electron fired sideways between deflection plates follows a parabola, exactly like a projectile, which is how old cathode-ray tubes steered their beams. (Gravity on an electron is negligible: even in a weak field of 100 N/C, the electric force $eE$ is about $2\times10^{12}$ times its weight $m_eg$.)

![An electron gun at the left fires a beam to the right between two horizontal deflection plates, the top one positive and the bottom one negative. Arrows between the plates show a uniform field pointing down from the positive plate to the negative one. Between the plates the electron's path curves upward toward the positive plate in a parabola; after leaving the plates it travels in a straight line and hits a screen at the right above the center.](images/phys-m8-deflection.svg)

The electron curves *toward* the positive plate, against the field arrows, because its charge is negative. Once it leaves the plates the force stops and it coasts in a straight line, so the spot on the screen moves in proportion to the plate voltage.

### Example 3

An electron starts from rest in a uniform field of $2.0\times10^4$ N/C. (a) What is its acceleration? (b) How fast is it moving after traveling 1.0 cm?

(a) $a = \dfrac{eE}{m_e} = \dfrac{(1.602\times10^{-19})(2.0\times10^4)}{9.11\times10^{-31}} = 3.52\times10^{15}$ m/s².

(b) $v = \sqrt{2ad} = \sqrt{2(3.52\times10^{15})(0.010)} = 8.4\times10^6$ m/s, about 3% of the speed of light, in a centimeter.

## Conductors in electrostatic equilibrium

When charges in a conductor have stopped moving (**electrostatic equilibrium**):

- The field inside the conductor's material is zero (otherwise free charges would still move).
- Any excess charge sits on the outer surface.
- Just outside, the field is perpendicular to the surface.
- Charge concentrates where the surface curves most sharply, which is why lightning rods are pointed.

A hollow metal box shields its interior from outside fields: a **Faraday cage**. That's why you're safe in a car during a lightning storm and why your phone loses signal in an elevator.

## Continuous charge distributions

For a continuous charge distribution, add up the fields of tiny elements $dq$:

$$\vec E = \int k\frac{dq}{r^2}\,\hat r.$$

Use symmetry to see which components cancel before integrating.

*Field on the axis of a ring.* A ring of radius $a$ carries charge $Q$ (see the figure). At distance $x$ along its axis, each element is at distance $\sqrt{x^2 + a^2}$. Perpendicular components cancel by symmetry; the axial component of each element's field is $dE\cos\theta$, with $\cos\theta = x/\sqrt{x^2 + a^2}$. Every element has the same geometry, so the distance and angle come out of the integral and $\int dq = Q$:

$$E_x = \int\frac{k\,dq}{x^2 + a^2}\cdot\frac{x}{\sqrt{x^2 + a^2}} = \frac{kx}{(x^2 + a^2)^{3/2}}\int dq = \frac{kQx}{(x^2 + a^2)^{3/2}}.$$

At the center ($x = 0$) it's zero; far away ($x \gg a$) it becomes $kQ/x^2$, a point charge.

```plot
{"x": [-1, 4.6], "y": [-1.5, 1.5], "equal": true, "grid": false, "curves": [{"x": "0.35cos(t)", "y": "sin(t)", "t": [0, "2pi"]}], "segments": [{"from": [0, 0], "to": [3, 0], "dashed": true, "label": "x"}, {"from": [0, 0], "to": [0, 1], "label": "a"}, {"from": [0, 1], "to": [3, 0]}, {"from": [3, 0], "to": [4.14, -0.38], "arrow": true}, {"from": [3, 0], "to": [4.14, 0], "arrow": true, "dashed": true}], "points": [{"at": [0, 1], "label": "dq"}, {"at": [3, 0], "label": "P"}], "labels": [{"at": [4.3, -0.55], "text": "dE"}, {"at": [3.75, 0.25], "text": "dE cos θ"}, {"at": [1.5, 0.85], "text": "√(x² + a²)"}], "caption": "Each element dq of a ring is the same distance from P; only the axial parts dE cos θ survive (θ is the angle between dE and the axis)"}
```

*Infinite line charge.* With linear density $\lambda$, the field at perpendicular distance $r$ is $E = \dfrac{2k\lambda}{r} = \dfrac{\lambda}{2\pi\varepsilon_0r}$, falling as $1/r$ rather than $1/r^2$. (Gauss's law in the next lesson gets this in one line.)

*Infinite sheet.* With surface density $\sigma$, $E = \dfrac{\sigma}{2\varepsilon_0}$, independent of distance: that's why parallel plates give a uniform field. Between oppositely charged plates the two sheets' fields add, giving $E = \sigma/\varepsilon_0$; outside they cancel.

## Common mistakes

- Confusing the field (a property of a location) with the force (on a particular charge).
- Pointing the force on a negative charge along $\vec E$.
- Adding field magnitudes instead of vectors.
- Using the charge that feels the field when computing the field it feels.

## Key points

- $\vec E = \vec F/q_0$; $\vec F = q\vec E$. Units N/C = V/m.
- Point charge: $E = k|q|/r^2$, away from $+$, toward $-$.
- Superpose fields as vectors; field lines run from $+$ to $-$ and never cross.
- Uniform field: constant acceleration $a = qE/m$.
- $\vec E = \int k\,dq\,\hat r/r^2$; ring axis $kQx/(x^2 + a^2)^{3/2}$; line $2k\lambda/r$; sheet $\sigma/(2\varepsilon_0)$.

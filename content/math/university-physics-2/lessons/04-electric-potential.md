---
id: phys-potential
module: phys-m8
title: Electric potential and potential energy
minutes: 40
topics: [Electric potential]
drills: [phys-potential-point, phys-accel-voltage, phys-uniform-field-v]
refs: [phys-ref-em-modern]
---
## Energy methods for electricity

In mechanics, energy conservation often beat force calculations. The same is true for electricity. The electric force is conservative, so it has a potential energy, and dividing by charge gives the electric potential, the quantity better known as voltage. Batteries, wall outlets and nerve cells are all described in volts. Potential is also a scalar, so adding up contributions from many charges is easier than adding field vectors.

## Electric potential energy

Moving a charge against an electric force stores energy, just as lifting a mass stores gravitational energy. For two point charges separated by $r$, the **electric potential energy** is

$$U = k\frac{q_1q_2}{r},$$

with $U = 0$ at infinite separation. Note the signs are kept: like charges have positive $U$ (you had to push them together; let go and they fly apart), unlike charges negative $U$ (they're bound). For a group of charges, add $U$ for every pair.

## Electric potential

The **electric potential** $V$ at a point is the potential energy per unit charge a test charge would have there:

$$V = \frac{U}{q}.$$

Its unit is the **volt**: $1\text{ V} = 1\text{ J/C}$. What matters physically is the **potential difference** (voltage) between two points, $\Delta V = V_B - V_A$. When a charge $q$ moves through a potential difference $\Delta V$, its potential energy changes by

$$\Delta U = q\,\Delta V,$$

and if only electric forces act, its kinetic energy changes by $-q\Delta V$. Positive charges naturally move toward lower potential ("downhill"), negative charges toward higher potential.

For a point charge, $V = k\dfrac{q}{r}$ (zero at infinity), positive near positive charges and negative near negative ones. For several charges, potentials add as plain numbers:

$$V = k\sum\frac{q_i}{r_i}.$$

### Example 1

Charges of $+3.0$ nC and $-5.0$ nC sit 0.40 m apart. Find the potential at the midpoint, and the work needed to bring a $+2.0$ nC charge there from far away.

Each charge is 0.20 m from the midpoint: $V = (8.99\times10^9)\dfrac{3.0\times10^{-9} - 5.0\times10^{-9}}{0.20} = -89.9$ V.

Work $= q\Delta V = (2.0\times10^{-9})(-89.9 - 0) = -1.8\times10^{-7}$ J. It's negative: the field pulls the charge in, so you'd have to hold it back.

## The electron volt

Accelerating a particle of charge $e$ through 1 V gives it $1.602\times10^{-19}$ J of kinetic energy. This amount is the **electron volt**: $1\text{ eV} = 1.602\times10^{-19}$ J. It's the natural energy unit for atoms (eV), nuclei (MeV) and particle accelerators (GeV, TeV).

### Example 2

An electron starts from rest and is accelerated through a potential difference of 500 V. What is its final speed?

It gains $K = e\Delta V = 500$ eV $= 8.01\times10^{-17}$ J. Then $v = \sqrt{\dfrac{2K}{m_e}} = \sqrt{\dfrac{2(8.01\times10^{-17})}{9.11\times10^{-31}}} = 1.33\times10^7$ m/s. (The electron moves toward higher potential, since it's negative.)

## Potential in a uniform field

Between parallel plates with a uniform field $E$, moving a distance $d$ along the field drops the potential by

$$\Delta V = Ed, \qquad E = \frac{\Delta V}{d}.$$

This shows why field is measured in volts per meter: 1 N/C = 1 V/m. A 12 V battery connected across plates 2.0 mm apart makes a field of 6000 V/m.

## Equipotentials

An **equipotential surface** is a surface on which $V$ is constant. No work is done moving a charge along one. Equipotentials are always perpendicular to field lines, and the field points from high potential toward low, strongest where equipotentials are closely spaced (like contour lines on a steep hillside). Around a point charge they're concentric spheres; between parallel plates they're parallel planes. A conductor in electrostatic equilibrium is an equipotential throughout.

```plot
{"x": [-2.5, 2.5], "y": [-2.5, 2.5], "equal": true, "grid": false, "curves": [{"x": "0.5cos(t)", "y": "0.5sin(t)", "t": [0, "2pi"], "dashed": true}, {"x": "1cos(t)", "y": "1sin(t)", "t": [0, "2pi"], "dashed": true}, {"x": "2cos(t)", "y": "2sin(t)", "t": [0, "2pi"], "dashed": true}], "segments": [{"from": [0.2, 0], "to": [2.4, 0], "arrow": true}, {"from": [-0.2, 0], "to": [-2.4, 0], "arrow": true}, {"from": [0, 0.2], "to": [0, 2.4], "arrow": true}, {"from": [0, -0.2], "to": [0, -2.4], "arrow": true}, {"from": [0.14, 0.14], "to": [1.7, 1.7], "arrow": true}, {"from": [-0.14, -0.14], "to": [-1.7, -1.7], "arrow": true}, {"from": [-0.14, 0.14], "to": [-1.7, 1.7], "arrow": true}, {"from": [0.14, -0.14], "to": [1.7, -1.7], "arrow": true}], "points": [{"at": [0, 0], "label": "+q"}], "caption": "Equipotentials (dashed circles) are perpendicular to the field lines of a point charge"}
```

## Potential from the field, and the field from the potential

Potential difference is the line integral of the field:

$$\Delta V = V_B - V_A = -\int_A^B\vec E\cdot d\vec\ell,$$

and because the electric force is conservative the result doesn't depend on the path. For a point charge, integrating $E = kq/r^2$ inward from infinity gives $V = kq/r$.

Going the other way, the field is the negative gradient of the potential:

$$E_x = -\frac{\partial V}{\partial x}, \quad E_y = -\frac{\partial V}{\partial y}, \quad E_z = -\frac{\partial V}{\partial z}; \qquad \vec E = -\nabla V.$$

The field points in the direction of steepest decrease of $V$. Because $V$ is a scalar, finding $V$ by integration and then differentiating is often easier than computing $\vec E$ directly.

### Example 3

The potential in a region is $V(x, y) = 3x^2y - 2y^3$ volts ($x, y$ in meters). Find the electric field at $(1, 2)$.

$E_x = -\dfrac{\partial V}{\partial x} = -6xy = -12$ V/m. $E_y = -\dfrac{\partial V}{\partial y} = -(3x^2 - 6y^2) = -(3 - 24) = 21$ V/m. So $\vec E = (-12\hat\imath + 21\hat\jmath)$ V/m, magnitude 24.2 V/m.

*Ring on its axis.* Every element of a ring of charge $Q$ and radius $a$ is the same distance $\sqrt{x^2 + a^2}$ from an axial point, so $V = \dfrac{kQ}{\sqrt{x^2 + a^2}}$ immediately (no vector components needed). Then $E_x = -\dfrac{dV}{dx} = \dfrac{kQx}{(x^2 + a^2)^{3/2}}$, matching the field we found by direct integration two lessons ago, with far less work.

## Common mistakes

- Dropping the signs of charges in $U = kq_1q_2/r$ or $V = kq/r$ (unlike for force magnitudes, signs matter here).
- Using $1/r^2$ for potential (it's $1/r$).
- Adding potentials as vectors (they're scalars).
- Confusing potential (J/C, a property of a point) with potential energy (J, a property of a charge at that point).
- Getting the direction wrong: positive charges accelerate toward lower $V$, electrons toward higher $V$.

## Key points

- $U = kq_1q_2/r$; $V = U/q$; point charge $V = kq/r$; potentials add as scalars.
- $\Delta U = q\Delta V$; energy gained from rest $= |q\Delta V|$; 1 eV $= 1.602\times10^{-19}$ J.
- Uniform field: $\Delta V = Ed$; 1 V/m = 1 N/C.
- Equipotentials are perpendicular to field lines.
- $\Delta V = -\int\vec E\cdot d\vec\ell$; $\vec E = -\nabla V$.

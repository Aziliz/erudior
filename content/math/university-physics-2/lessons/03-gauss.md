---
id: phys-gauss
module: phys-m8
title: Gauss's law
minutes: 40
topics: [Gauss's law]
drills: [phys-gauss-sphere, phys-gauss-line]
refs: [phys-ref-em-modern]
---
## A shortcut built on symmetry

Integrating Coulomb's law over a charge distribution works, but it's laborious. For distributions with high symmetry (spheres, long cylinders, flat sheets) there's a far quicker route: Gauss's law, which relates the field crossing a closed surface to the charge inside. It's also one of Maxwell's four equations, the complete laws of electromagnetism. Its key results (the fields of spheres, lines and sheets) are used throughout the rest of the course.

## Electric flux

Think of field lines as a flow. The **electric flux** $\Phi_E$ through a surface measures how much field passes through it. For a flat area $A$ in a uniform field,

$$\Phi_E = EA\cos\theta,$$

where $\theta$ is the angle between $\vec E$ and the **area vector** (a vector perpendicular to the surface, with magnitude $A$). Flux is largest when the field crosses the surface head-on and zero when the field skims along it. Units: N·m²/C.

For a closed surface, the area vector points outward by convention, so field lines leaving give positive flux and lines entering give negative flux.

## Gauss's law

**Gauss's law** says that the total electric flux out of any closed surface equals the enclosed charge divided by $\varepsilon_0$:

$$\Phi_E = \oint\vec E\cdot d\vec A = \frac{Q_{\text{enc}}}{\varepsilon_0}.$$

The closed surface, called a **Gaussian surface**, is imaginary: you choose it. Charges outside it contribute zero net flux (every field line from them that enters also leaves), though they do affect the field at individual points.

*Why it works:* for a point charge $q$ at the center of a sphere of radius $r$, the field is $kq/r^2$ everywhere on the sphere and perpendicular to it, so the flux is $\dfrac{kq}{r^2}\cdot4\pi r^2 = 4\pi kq = q/\varepsilon_0$, independent of $r$. The same number of field lines crosses any sphere, and any closed surface around the charge. That's a consequence of the inverse-square law.

### Example 1

A $+3.0$ μC charge sits inside a closed cube of side 0.40 m, and a $-1.0$ μC charge sits outside it. What is the net flux through the cube?

Only the enclosed charge counts: $\Phi_E = \dfrac{3.0\times10^{-6}}{8.85\times10^{-12}} = 3.39\times10^5$ N·m²/C. The cube's size and the outside charge don't matter.

## Using Gauss's law to find fields

Gauss's law always holds, but it gives $E$ directly only when you can choose a surface on which $E$ is constant in magnitude and either perpendicular or parallel to the surface. Then the integral collapses to $E \times (\text{area})$. Three symmetries make this possible.

*Spherical symmetry.* For a charge $Q$ spread with spherical symmetry (a point charge, a charged shell, a uniform ball), use a concentric sphere of radius $r$. Outside the charge:

$$E(4\pi r^2) = \frac{Q}{\varepsilon_0} \quad\Rightarrow\quad E = \frac{Q}{4\pi\varepsilon_0r^2} = \frac{kQ}{r^2}.$$

A spherical distribution looks like a point charge from outside. Inside a thin charged shell, a Gaussian sphere encloses nothing, so $E = 0$. Inside a uniformly charged solid ball of radius $R$, the enclosed charge is $Q(r/R)^3$, giving

$$E = \frac{kQr}{R^3} \quad (r < R),$$

rising linearly from zero at the center to the surface value $kQ/R^2$.

```plot
{"x": [0, 4], "y": [0, 1.15], "xLabel": "r / R", "yLabel": "E / (kQ/R²)", "functions": [{"f": "x", "from": 0, "to": 1, "label": "inside: ∝ r"}, {"f": "1/x^2", "from": 1, "to": 4}], "labels": [{"at": [2.6, 0.32], "text": "outside: ∝ 1/r²"}], "caption": "Field of a uniformly charged solid sphere"}
```

*Cylindrical symmetry.* For an infinitely long line (or cylinder) with charge $\lambda$ per meter, use a coaxial cylinder of radius $r$ and length $L$. The field is radial, so there's no flux through the end caps; through the curved side, $E(2\pi rL) = \lambda L/\varepsilon_0$:

$$E = \frac{\lambda}{2\pi\varepsilon_0r} = \frac{2k\lambda}{r}.$$

*Planar symmetry.* For an infinite sheet with charge $\sigma$ per square meter, use a "pillbox" cylinder piercing the sheet, with end caps of area $A$ on both sides. The field is perpendicular to the sheet, so flux passes only through the two caps: $2EA = \sigma A/\varepsilon_0$:

$$E = \frac{\sigma}{2\varepsilon_0}.$$

### Example 2

A long straight wire carries $5.0$ nC per meter. What is the field 2.0 cm from it?

$E = \dfrac{2k\lambda}{r} = \dfrac{2(8.99\times10^9)(5.0\times10^{-9})}{0.020} = 4.5\times10^3$ N/C, pointing radially outward.

### Example 3

A solid insulating sphere of radius 10 cm carries $+8.0$ nC spread uniformly through its volume. Find the field at $r = 5.0$ cm and at $r = 20$ cm.

Inside: $E = \dfrac{kQr}{R^3} = \dfrac{(8.99\times10^9)(8.0\times10^{-9})(0.050)}{(0.10)^3} = 3.60\times10^3$ N/C.

Outside: $E = \dfrac{kQ}{r^2} = \dfrac{(8.99\times10^9)(8.0\times10^{-9})}{(0.20)^2} = 1.80\times10^3$ N/C.

## Gauss's law and conductors

Gauss's law explains the conductor facts from last lesson. In electrostatic equilibrium $E = 0$ inside the metal, so a Gaussian surface just inside the surface encloses zero net charge: any excess charge must be on the surface. Applying a pillbox at the surface gives the field just outside a conductor:

$$E = \frac{\sigma}{\varepsilon_0},$$

twice the isolated-sheet value, because no field lines leave through the inner cap.

And if a conductor has a cavity with a charge $q$ inside it, the cavity's wall must carry $-q$ (so that a surface within the metal encloses zero), and the outer surface carries the rest.

## Nonuniform charge and the differential form

In general, the flux integral is $\oint\vec E\cdot d\vec A$ over a closed surface, which can be hard to evaluate; Gauss's law is a tool for *finding* $E$ only with symmetry. For a nonuniform charge density, the enclosed charge itself is an integral. For example, a sphere with $\rho(r) = \rho_0 r/R$ encloses

$$Q_{\text{enc}}(r) = \int_0^r\rho_0\frac{r'}{R}4\pi r'^2\,dr' = \frac{\pi\rho_0r^4}{R},$$

so inside, $E = \dfrac{Q_{\text{enc}}}{4\pi\varepsilon_0r^2} = \dfrac{\rho_0r^2}{4\varepsilon_0R}$.

The differential form, $\nabla\cdot\vec E = \rho/\varepsilon_0$, says field lines diverge from positive charge density; it follows from the integral form via the divergence theorem.

## Common mistakes

- Counting charges outside the Gaussian surface as enclosed.
- Using Gauss's law to "find $E$" for a shape without enough symmetry (it's still true, just not useful).
- Thinking $E = 0$ on a Gaussian surface whenever $Q_{\text{enc}} = 0$ (zero net flux doesn't mean zero field everywhere).
- Using the total charge instead of the enclosed fraction inside a solid sphere.

## Key points

- Flux $\Phi_E = \oint\vec E\cdot d\vec A$; through a flat area in a uniform field, $EA\cos\theta$.
- Gauss's law: $\Phi_E = Q_{\text{enc}}/\varepsilon_0$, for any closed surface.
- Sphere (outside): $kQ/r^2$; thin shell (inside): 0; uniform ball (inside): $kQr/R^3$.
- Line: $2k\lambda/r$. Sheet: $\sigma/(2\varepsilon_0)$. Just outside a conductor: $\sigma/\varepsilon_0$.

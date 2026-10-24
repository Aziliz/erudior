---
id: phys-m7-h-real-fluids
module: phys-m7
title: 'Real fluids: viscosity, drag, and surface tension'
minutes: 45
honors: true
topics: [Viscosity and drag, Surface tension]
drills: [phys-m7-r2-poiseuille, phys-m7-r2-stokes, phys-m7-r2-capillary]
refs: [phys-ref-waves-thermo]
---
## Beyond the ideal fluid

Bernoulli's equation in the fluid-flow lesson assumed an *ideal* fluid: no internal friction, no eddies, nothing happening at the surface. That model explains a lot, but it can't explain why honey pours slowly, why blood pressure drops along an artery, why fog hangs in the air for hours, or why water climbs up a paper towel. This lesson adds the two effects the ideal model leaves out: **viscosity**, friction inside a moving fluid, and surface tension, the extra energy of a liquid's surface. The fluid-flow lesson mentioned Poiseuille's law in passing; here we see where it comes from and use it.

## Viscosity: friction between layers

Put a thin layer of oil between two flat plates and slide the top plate along. The oil touching each plate moves with that plate (fluids "stick" to surfaces), so the oil is sheared: each layer slides a little faster than the one below it. Keeping the top plate moving at speed $v$ takes a steady force, and experiments show that for many fluids

$$F = \eta\,\frac{Av}{d},$$

where $A$ is the plate area, $d$ the thickness of the layer and $\eta$ (Greek eta) the fluid's viscosity, in pascal-seconds (Pa·s). The force grows with area and speed, and a thinner film needs a larger force because the layers have to slide past each other faster.

| Fluid (about 20°C) | Viscosity (Pa·s), approximate |
|---|---|
| Air | $1.8\times10^{-5}$ |
| Water | $1.0\times10^{-3}$ |
| Blood (at 37°C) | $3\times10^{-3}$ to $4\times10^{-3}$ |
| Olive oil | $0.08$ |
| Honey | 2 to 10 |

Viscosity depends strongly on temperature. Liquids get *less* viscous when warmed (warm syrup pours easily), because their molecules escape their neighbors more easily. Gases get slightly *more* viscous, because faster molecules carry momentum between layers more often.

### Example 1

A block with a flat base of area 0.20 m² slides at 0.40 m/s on a 0.50 mm film of oil with $\eta = 0.30$ Pa·s. What force keeps it moving?

Convert the film thickness: $d = 0.50\text{ mm} = 5.0\times10^{-4}$ m. Then

$$F = \eta\frac{Av}{d} = \frac{(0.30)(0.20)(0.40)}{5.0\times10^{-4}} = 48\text{ N}.$$

Forgetting to convert millimeters gives 0.048 N, a thousand times too small.

## Poiseuille's law: flow through a pipe

In a pipe, the fluid at the wall is at rest and the fluid at the center moves fastest. For smooth flow the speed profile is a parabola:

```plot
{"x": [0, 2.7], "y": [0, 1.4], "xLabel": "across pipe", "yLabel": "speed (fraction of center speed)", "functions": [{"f": "2*x - x^2", "from": 0, "to": 2}, {"f": "0.5", "from": 0, "to": 2, "dashed": true}], "segments": [{"from": [2, 0], "to": [2, 1.25]}], "labels": [{"at": [1, 1.08], "text": "parabolic profile"}, {"at": [1, 0.38], "text": "average speed"}], "caption": "Laminar flow in a pipe, plotted across the pipe in units of the radius (walls at 0 and 2): zero speed at the walls, fastest at the center, and an average speed (dashed) of half the center speed"}
```

The flow rate through a pipe of radius $R$ and length $L$ with a pressure difference $\Delta P$ between its ends is **Poiseuille's law**:

$$Q = \frac{\pi R^4\,\Delta P}{8\eta L}.$$

*Where the $R^4$ comes from:* the average speed of a parabolic profile is proportional to $R^2$ (a wider pipe has its center farther from the slowing walls), and the cross-section area is $\pi R^2$. Flow rate is area times average speed, so $Q \propto R^2 \cdot R^2 = R^4$. Halving a pipe's radius cuts the flow to $1/16$ at the same pressure difference.

It helps to write Poiseuille's law like Ohm's law for circuits, $\Delta P = Q\,R_{\text{flow}}$, with a flow resistance

$$R_{\text{flow}} = \frac{8\eta L}{\pi R^4}.$$

Pipes one after another add their resistances, just as resistors in series do. Your circulatory system controls blood flow mostly by changing the radius of small arteries: because of the fourth power, a small change in radius makes a big change in flow.

### Example 2

A nurse pushes a water-like medicine ($\eta = 1.0\times10^{-3}$ Pa·s) through a needle 2.5 cm long with an inner radius of 0.15 mm at 0.20 mL/s. What pressure difference is needed? If the syringe plunger has a radius of 5.0 mm, about what force is needed?

Flow resistance:

$$R_{\text{flow}} = \frac{8(1.0\times10^{-3})(0.025)}{\pi(1.5\times10^{-4})^4} = 1.26\times10^{11}\text{ Pa·s/m}^3.$$

With $Q = 0.20\text{ mL/s} = 2.0\times10^{-7}$ m³/s, $\Delta P = QR_{\text{flow}} = 2.5\times10^4$ Pa, about a quarter of an atmosphere. The plunger's area is $\pi(0.0050)^2 = 7.9\times10^{-5}$ m², so the force is about $(2.5\times10^4)(7.9\times10^{-5}) = 2.0$ N. Nearly all the resistance is in the narrow needle; the wide syringe barrel adds almost none. (This is an estimate: it ignores the extra pressure needed to speed the liquid up as it enters the needle.)

## Laminar or turbulent: the Reynolds number

Poiseuille's law holds only for **laminar flow**, in which the fluid slides along in smooth layers. Speed it up enough and the flow becomes **turbulent**: it breaks into swirling eddies, mixes, and needs a much larger pressure difference for the same flow rate. Which one happens is predicted by a single dimensionless number, the **Reynolds number**:

$$\text{Re} = \frac{\rho vD}{\eta},$$

where $v$ is the average speed and $D$ the pipe diameter. Roughly, it compares the fluid's tendency to keep moving (its inertia, $\rho v$) with the viscous friction that smooths the flow. Experiments show that pipe flow is usually laminar when Re is below about 2000 and turbulent above about 4000, with an unsettled range between. (These boundaries are approximate; very smooth, undisturbed pipes can stay laminar at higher Re.)

### Example 3

Water flows at 1.0 m/s through a household pipe 2.0 cm across. Is the flow laminar? How slow would it have to be to stay laminar?

$$\text{Re} = \frac{(1000)(1.0)(0.020)}{1.0\times10^{-3}} = 20\,000,$$

far into the turbulent range. For $\text{Re} < 2000$ the speed would have to be below $\dfrac{2000(1.0\times10^{-3})}{1000(0.020)} = 0.10$ m/s. Ordinary plumbing flow is turbulent, so Poiseuille's law doesn't apply to it; the narrow needle in Example 2 has $\text{Re} \approx 850$, so it does.

## Drag at low speed: Stokes's law

The friction lesson in the forces module noted that drag grows roughly as $v^2$ for fast, large objects such as skydivers, but roughly in proportion to $v$ for slow motion through a thick fluid. For a very small or very slow sphere, where the Reynolds number based on its diameter is less than about 1, the flow around it stays smooth and the drag is exactly of that second kind. **Stokes's law** gives it for a sphere of radius $r$:

$$F_D = 6\pi\eta rv.$$

A small sphere falling through a fluid reaches terminal speed when its weight equals the buoyant force plus the drag:

$$\tfrac43\pi r^3\rho_s g = \tfrac43\pi r^3\rho_f g + 6\pi\eta rv_T \quad\Rightarrow\quad v_T = \frac{2r^2(\rho_s - \rho_f)g}{9\eta}.$$

The terminal speed grows as $r^2$: a droplet ten times smaller falls a hundred times more slowly.

### Example 4

Fog is made of water droplets about 10 µm in radius. How fast do they settle in air ($\eta = 1.8\times10^{-5}$ Pa·s, $\rho = 1.2$ kg/m³)?

$$v_T = \frac{2(1.0\times10^{-5})^2(1000 - 1.2)(9.8)}{9(1.8\times10^{-5})} = 1.2\times10^{-2}\text{ m/s},$$

about a centimeter per second. Any slight updraft can hold the droplets up, so fog lingers. Check: $\text{Re} = \dfrac{(1.2)(0.012)(2.0\times10^{-5})}{1.8\times10^{-5}} \approx 0.016$, well below 1, so Stokes's law applies.

## Surface tension

A molecule deep inside a liquid is pulled equally in all directions by its neighbors. A molecule at the surface has neighbors only on one side, so it is pulled inward, and bringing molecules to the surface costs energy. The liquid therefore acts as though covered by a stretched film. **Surface tension** $\gamma$ (gamma) is the force per unit length that this film exerts along any line drawn in the surface, in N/m; equivalently, it is the energy per unit area of surface, in J/m². Clean water at 20°C has $\gamma \approx 0.073$ N/m; soap lowers it to roughly 0.025 N/m; mercury's is about 0.49 N/m.

Surface tension lets a water strider stand on a pond and a carefully placed paper clip float, and it pulls a small drop into a sphere, the shape with the least surface for its volume. Because the curved surface squeezes inward, the pressure inside a drop of radius $r$ is higher than outside by $2\gamma/r$; a soap bubble, which has two surfaces (inside and outside), has $4\gamma/r$. Smaller drops and bubbles have higher internal pressure.

## Capillary action

Dip a narrow glass tube in water and the water climbs up inside it; dip it in mercury and the mercury inside sits *lower* than outside. This is **capillary action**. The curved liquid surface in the tube is a **meniscus**, and the angle at which the liquid surface meets the wall is the **contact angle** $\theta$. Water wets clean glass (its molecules are attracted to glass more than to each other), so $\theta$ is close to 0° and the meniscus is concave. Mercury does not wet glass, $\theta$ is about 140°, and its meniscus is convex.

![Two glass tubes standing in liquids. In water the liquid rises a height h inside the narrow tube and its surface curves down in the middle (concave meniscus). In mercury the liquid inside the tube sits below the outside level (a depression) and its surface bulges up (convex meniscus).](images/phys-m7-capillary.svg)

*Why the liquid rises:* surface tension pulls along the whole circle where the liquid meets the tube, a length $2\pi r$, with an upward component $\gamma\cos\theta$ per unit length. That force holds up a column of height $h$ and weight $\rho(\pi r^2h)g$:

$$2\pi r\gamma\cos\theta = \rho\pi r^2hg \quad\Rightarrow\quad h = \frac{2\gamma\cos\theta}{\rho gr}.$$

If $\theta > 90°$, $\cos\theta$ is negative and $h$ is negative: a depression.

### Example 5

How high does water rise in a clean glass tube of inner radius 0.10 mm?

With $\theta = 0$: $h = \dfrac{2(0.073)(1)}{(1000)(9.8)(1.0\times10^{-4})} = 0.15$ m, a remarkable 15 cm. Halve the radius and the rise doubles. Capillary action wicks water through paper towels, soil and cloth. In tall trees it plays only a small part: most of the lift comes from water evaporating at the leaves and pulling up the continuous, cohesive water column below it.

## Common mistakes

- Forgetting to convert millimeters or micrometers to meters ($r^4$ and $r^2$ magnify the error).
- Using Poiseuille's law for turbulent flow; check the Reynolds number first.
- Using radius where the formula has diameter, or the reverse: Re uses diameter $D$; Poiseuille, Stokes and capillary rise use radius.
- Applying Stokes's law to large, fast objects such as a falling person (drag $\propto v^2$ there).
- Forgetting that a soap film or bubble has two surfaces.

## Key points

- Viscous force between layers: $F = \eta Av/d$; viscosity $\eta$ in Pa·s.
- Poiseuille (laminar): $Q = \pi R^4\Delta P/(8\eta L)$; flow resistance $8\eta L/(\pi R^4)$ adds in series.
- Reynolds number $\text{Re} = \rho vD/\eta$: pipe flow laminar below about 2000, turbulent above about 4000.
- Stokes's law $F_D = 6\pi\eta rv$ for small, slow spheres; terminal speed $v_T = 2r^2(\rho_s - \rho_f)g/(9\eta)$.
- Surface tension $\gamma$ is force per length (energy per area); capillary rise $h = 2\gamma\cos\theta/(\rho gr)$.

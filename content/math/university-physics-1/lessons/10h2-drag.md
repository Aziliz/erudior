---
id: phys-m3-h-drag
module: phys-m3
title: 'Drag: linear, quadratic and the Reynolds number'
minutes: 45
honors: true
topics: [Drag]
drills: [phys-m3-r2-quad-drag, phys-m3-r2-coast]
refs: [phys-ref-mechanics]
---
## Motion through air and water

The friction lesson ended with a short look at drag: a falling object with drag $bv$ approaches a terminal velocity $mg/b$ exponentially, and fast objects in air feel a drag closer to $\tfrac12 C\rho Av^2$. This lesson takes the quadratic law seriously. It solves Newton's second law exactly for an object coasting, falling and thrown upward against quadratic drag, and uses the solutions to see how much drag changes the motion. The method, separating variables in $m\,dv/dt = F(v)$, works for any force that depends only on velocity.

## Two drag laws

Drag is the force a fluid (air, water, oil) exerts on an object moving through it, opposite to the object's velocity relative to the fluid. Two simple laws cover most cases.

**Linear drag**, $F_D = bv$, applies to small or slow objects in a viscous fluid: dust and droplets in air, bacteria and silt in water, a ball bearing sinking in honey. The fluid flows smoothly around the object, and the drag comes from the fluid's viscosity. For a sphere of radius $R$ in a fluid of viscosity $\eta$, Stokes's law gives $b = 6\pi\eta R$ (the viscous-flow honors lesson in the fluids module explains where this comes from).

**Quadratic drag**, $F_D = \tfrac12 C\rho A v^2$, applies to larger, faster objects: balls, cars, people, raindrops a few millimeters across. The object has to shove fluid out of its way and leaves a turbulent wake behind it, so the drag depends on the fluid's density $\rho$ rather than its viscosity. $A$ is the object's cross-sectional area facing the flow, and the **drag coefficient** $C$ is a dimensionless number that depends on shape: roughly 0.5 for a smooth sphere, about 1 for a person falling flat, about 0.3 for a streamlined car. These values are approximate; $C$ is measured, not derived, and it changes somewhat with speed.

It's convenient to write the quadratic law as $F_D = cv^2$ with $c = \tfrac12 C\rho A$ (units kg/m).

Which law applies is decided by the Reynolds number $Re = \rho vD/\eta$, where $D$ is the object's size. As a rough guide for a sphere, drag is linear when $Re$ is much less than 1 and close to quadratic, with a nearly constant $C$, for $Re$ from about $10^3$ to $2\times10^5$; in between, neither simple law is accurate. For air, $Re \approx 7\times10^4\,vD$ in SI units, so a 10 cm ball at 10 m/s has $Re \approx 7\times10^4$: quadratic. Nearly everything big enough to see, moving fast enough to notice, is in the quadratic range in air.

## A method for velocity-dependent forces

When the net force depends only on the velocity, Newton's second law is a first-order differential equation you can solve by separating variables. Which form you separate depends on what you want:

```mermaid
flowchart TD
  accTitle: Solving a problem with a velocity-dependent force
  accDescr: Write m dv/dt equals the net force F of v. If you want velocity as a function of time, separate it as m dv over F of v equals dt and integrate. If you want velocity as a function of position, use the chain rule dv/dt equals v dv/dx, separate as m v dv over F of v equals dx and integrate. Either way, apply the initial condition, then check the limits: early on the motion should match the no-drag answer, and late it should approach terminal velocity or rest.
  A["Write m dv/dt = F(v)"] --> B{"What do you want?"}
  B -- "v as a function of time" --> C["Separate: m dv / F(v) = dt"]
  B -- "v as a function of position" --> D["Use dv/dt = v dv/dx, then m v dv / F(v) = dx"]
  C --> E["Integrate and apply the initial condition"]
  D --> E
  E --> F["Check limits: no-drag behavior early, terminal speed or rest late"]
```

## Coasting to a stop

The simplest case is an object coasting horizontally with only quadratic drag acting along its motion: a boat after its engine cuts out, a skater gliding. Then $m\,dv/dt = -cv^2$. Separating, $-\dfrac{dv}{v^2} = \dfrac{c}{m}dt$, and integrating from $v_0$ at $t = 0$:

$$\frac1v - \frac1{v_0} = \frac{c}{m}t \quad\Longrightarrow\quad v(t) = \frac{v_0}{1 + cv_0t/m}.$$

The position form is even neater. With $dv/dt = v\,dv/dx$, the equation becomes $mv\,dv/dx = -cv^2$, so $dv/v = -(c/m)\,dx$ and

$$v(x) = v_0\,e^{-cx/m}.$$

The speed decays *exponentially with distance*: every $(m/c)\ln 2$ meters, it halves. Notice that this model never quite stops the object. That is a limitation of the model, not of nature: at low speed, real drag becomes closer to linear, and other friction finishes the job.

### Example 1: a coasting boat

A 500 kg motorboat moving at 10 m/s cuts its engine. Water drag is $cv^2$ with $c = 25$ kg/m. How long does it take to slow to 5.0 m/s, how far does it go in that time, and how fast is it moving after 50 m?

Halving the speed means $1 + cv_0t/m = 2$, so $t = \dfrac{m}{cv_0} = \dfrac{500}{25(10)} = 2.0$ s.

Distance: $v = v_0/2$ when $e^{-cx/m} = \tfrac12$, so $x = \dfrac{m}{c}\ln 2 = 20(0.693) = 13.9$ m.

After 50 m: $v = 10e^{-25(50)/500} = 10e^{-2.5} = 0.82$ m/s. The second halving (5.0 to 2.5 m/s) takes another 13.9 m but 4.0 s, because the boat is moving more slowly: each halving takes the same distance but twice the time of the one before.

## Falling with quadratic drag

Take down as positive. Newton's second law for an object falling from rest with quadratic drag is

$$m\frac{dv}{dt} = mg - cv^2.$$

The acceleration is zero when $cv^2 = mg$, so the terminal velocity is $v_T = \sqrt{mg/c} = \sqrt{2mg/(C\rho A)}$. Writing $mg - cv^2 = c(v_T^2 - v^2)$ and separating variables,

$$\int_0^v \frac{dv}{v_T^2 - v^2} = \frac{c}{m}\int_0^t dt = \frac{g}{v_T^2}\,t.$$

The integral on the left is $\dfrac{1}{v_T}\tanh^{-1}\!\left(\dfrac{v}{v_T}\right)$, so

$$v(t) = v_T\tanh\!\left(\frac{gt}{v_T}\right).$$

The natural time scale is $\tau = v_T/g$, the time free fall would take to reach $v_T$. Integrating once more gives the distance fallen, $y(t) = \dfrac{v_T^2}{g}\ln\cosh\!\left(\dfrac{gt}{v_T}\right)$.

Early on, $\tanh u \approx u$, so $v \approx gt$: drag is negligible while the object is slow. Late, $\tanh u \to 1$ and $v \to v_T$. Compared with linear drag, $v_T(1 - e^{-t/\tau})$ with the same $v_T$ and $\tau$, the quadratic curve stays close to free fall longer and then levels off more sharply, because quadratic drag is weak at low speed and strong at high speed.

```plot
{"x": [0, 20], "y": [0, 80], "xLabel": "t (s)", "yLabel": "v (m/s)", "functions": [{"f": "9.8*x", "dashed": true}, {"f": "51.6*tanh(x/5.27)"}, {"f": "51.6*(1 - exp(-x/5.27))"}, {"f": "51.6", "dashed": true}], "labels": [{"at": [4, 62], "text": "no drag"}, {"at": [14, 26], "text": "upper solid curve: quadratic drag"}, {"at": [14, 18], "text": "lower solid curve: linear drag"}, {"at": [16, 56], "text": "v_T = 51.6 m/s"}], "caption": "Speed of the skydiver in Example 2 with quadratic drag, compared with free fall (no drag) and with a linear drag law giving the same terminal speed"}
```

### Example 2: a skydiver

An 80 kg skydiver falls belly-down with $C = 0.70$ and $A = 0.70$ m² in air of density 1.2 kg/m³. Find her terminal speed, the time to reach 90% of it, and how far she falls in that time.

$c = \tfrac12(0.70)(1.2)(0.70) = 0.294$ kg/m, so

$$v_T = \sqrt{\frac{mg}{c}} = \sqrt{\frac{80(9.8)}{0.294}} = 51.6\text{ m/s} \approx 186\text{ km/h}.$$

Time constant: $\tau = v_T/g = 5.27$ s. Ninety percent of $v_T$ needs $\tanh(t/\tau) = 0.90$, so $t = \tau\tanh^{-1}(0.90) = 5.27(1.472) = 7.76$ s.

Distance: $y = \dfrac{v_T^2}{g}\ln\cosh(1.472) = 272(0.830) = 226$ m.

Without drag, 7.76 s of free fall would give 76 m/s and 295 m. Drag has taken off a third of her speed already, and from then on she gains almost nothing: the rest of a long jump is at a steady speed near 52 m/s. (These numbers are for illustration; real skydivers change $C$ and $A$ a lot just by changing posture.)

## Thrown upward

On the way up, gravity and drag both point down. With up positive,

$$m\frac{dv}{dt} = -mg - cv^2 = -\frac{mg}{v_T^2}\left(v_T^2 + v^2\right),$$

using the same $v_T = \sqrt{mg/c}$. Separating, $\int \dfrac{dv}{v_T^2 + v^2} = \dfrac{1}{v_T}\tan^{-1}\dfrac{v}{v_T}$, and the time to reach the top from launch speed $v_0$ is

$$t_{\text{up}} = \frac{v_T}{g}\tan^{-1}\!\left(\frac{v_0}{v_T}\right).$$

For the height, use the chain rule $\dfrac{dv}{dt} = v\dfrac{dv}{dy}$, which turns the equation into one for $v$ as a function of height:

$$v\frac{dv}{dy} = -\frac{g}{v_T^2}\left(v_T^2 + v^2\right) \quad\Longrightarrow\quad h = \frac{v_T^2}{2g}\ln\!\left(1 + \frac{v_0^2}{v_T^2}\right).$$

The same trick on the way down gives the speed after falling a height $h$ from rest: $v^2 = v_T^2\left(1 - e^{-2gh/v_T^2}\right)$.

### Example 3: a ball thrown straight up

A ball is thrown straight up at 30 m/s. Its terminal speed is about 35 m/s (a rough figure for a baseball). Compare the flight with and without drag.

$\tau = v_T/g = 35/9.8 = 3.57$ s.

Time up: $t_{\text{up}} = 3.57\tan^{-1}(30/35) = 3.57(0.709) = 2.53$ s, versus $30/9.8 = 3.06$ s without drag.

Height: $h = \dfrac{35^2}{2(9.8)}\ln\!\left(1 + \dfrac{900}{1225}\right) = 62.5(0.551) = 34.4$ m, versus $\dfrac{30^2}{2(9.8)} = 45.9$ m without drag.

Return speed: $v^2 = v_T^2(1 - e^{-2gh/v_T^2})$. Since $e^{2gh/v_T^2} = 1 + v_0^2/v_T^2$, this simplifies to $v = \dfrac{v_0v_T}{\sqrt{v_0^2 + v_T^2}} = \dfrac{30(35)}{\sqrt{2125}} = 22.8$ m/s, not 30 m/s. The fall back takes $\tau\tanh^{-1}(22.8/35) = 2.77$ s, longer than the 2.53 s trip up: with drag, the descent is slower than the ascent, and the ball lands with less speed than it was thrown with. Drag has turned mechanical energy into heat in the air.

## Common mistakes

- Using quadratic drag for tiny particles, or linear drag for a ball or a person: check the Reynolds number.
- Expecting a coasting object with quadratic drag to stop after a definite time or distance; in this model the speed halves over equal distances and never reaches zero.
- Forgetting that drag acts opposite the *velocity*: down on the way up, up on the way down. The sign of the $cv^2$ term changes between the two halves of a throw.
- Treating $C$ as a universal constant. It depends on shape, and its quoted values are approximate.
- Assuming the time constant is the time to reach terminal velocity; the speed only approaches $v_T$, reaching 76% of it at $t = \tau$ for quadratic drag ($\tanh 1 = 0.76$) and 63% for linear drag.
- Assuming the up and down trips take equal times, as they do without drag.

## Key points

- Linear drag $bv$ for small, slow objects ($Re \ll 1$); quadratic drag $\tfrac12C\rho Av^2 = cv^2$ for most everyday objects in air ($Re$ of about $10^3$ to $2\times10^5$).
- Velocity-dependent forces: separate $m\,dv/F(v) = dt$ for $v(t)$, or use $v\,dv/dx$ for $v(x)$.
- Coasting with quadratic drag: $v = v_0/(1 + cv_0t/m)$ and $v = v_0e^{-cx/m}$.
- Quadratic drag, falling from rest: $v_T = \sqrt{2mg/(C\rho A)}$, $v = v_T\tanh(gt/v_T)$, $y = (v_T^2/g)\ln\cosh(gt/v_T)$.
- Thrown up: $t_{\text{up}} = (v_T/g)\tan^{-1}(v_0/v_T)$ and $h = \dfrac{v_T^2}{2g}\ln(1 + v_0^2/v_T^2)$.
- With drag, the trip down is slower than the trip up, and the landing speed is less than the launch speed.

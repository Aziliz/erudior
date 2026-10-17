---
id: mv-stokes
module: mv-m8
title: Stokes' theorem
minutes: 40
topics: [Stokes' theorem]
drills: [mv-d-stokes-disk]
refs: [mv-ref-vector-calculus]
---
## Green's theorem, lifted into space

Green's theorem says the circulation of a field around a closed curve in the plane equals the
total rotation $Q_x - P_y$ inside. **Stokes' theorem** says the same thing for a curve in
space: the circulation around the curve equals the total curl passing through *any* surface
that the curve bounds. Picture a butterfly net: the rim is the curve, the net is the surface,
and the theorem holds no matter how the net bulges.

## Orientation of the boundary

Let $S$ be an oriented surface with unit normal $\mathbf n$, whose boundary is a simple closed
curve $C$. The **positive orientation** of $C$ (the induced orientation) follows the
**right-hand rule**: if your right thumb points along $\mathbf n$, your fingers curl in the
direction of $C$. Equivalently, walking along $C$ with your head pointing in the direction of
$\mathbf n$, the surface is on your left. For a flat region in the $xy$-plane with $\mathbf n = \mathbf k$
this is counterclockwise, as in Green's theorem.

## The theorem

**Stokes' theorem.** Let $S$ be an oriented, piecewise-smooth surface bounded by a simple,
closed, piecewise-smooth curve $C$ with positive orientation, and let $\mathbf F$ have
continuous partial derivatives on an open region containing $S$. Then

$$\oint_C\mathbf F\cdot d\mathbf r = \iint_S\operatorname{curl}\mathbf F\cdot d\mathbf S.$$

*Why it is true (the idea).* Cut $S$ into many tiny, nearly flat patches. On each, Green's
theorem in the patch's own plane says: circulation around the patch $\approx$
$(\operatorname{curl}\mathbf F\cdot\mathbf n)\,\Delta S$. Add over all patches. Interior edges
are shared by two patches, traversed in opposite directions, and cancel. What remains is the
circulation around the outer boundary $C$.

**Interpretation of curl.** Running the same reasoning on a single small disk of radius
$\epsilon$ centered at $P$ with normal $\mathbf n$ gives

$$\operatorname{curl}\mathbf F(P)\cdot\mathbf n = \lim_{\epsilon\to0}\frac{1}{\pi\epsilon^2}\oint_{C_\epsilon}\mathbf F\cdot d\mathbf r:$$

the component of curl in direction $\mathbf n$ is the circulation per unit area around $\mathbf n$.
That is the precise meaning of "the paddle wheel spins fastest when aligned with the curl."

Special case: if $S$ is a flat region in the $xy$-plane with upward normal, then
$\operatorname{curl}\mathbf F\cdot\mathbf k = Q_x - P_y$ and Stokes' theorem becomes Green's
theorem.

### Example 1: a line integral via Stokes

Evaluate $\oint_C\mathbf F\cdot d\mathbf r$ for $\mathbf F = \langle -y^3,\; x^3,\; z\rangle$, where $C$
is the circle $x^2 + y^2 = 4$ in the plane $z = 3$, counterclockwise as seen from above.

1. Choose the simplest surface with boundary $C$: the flat disk $x^2 + y^2 \le 4$ at height 3, with $\mathbf n = \mathbf k$ (upward, matching counterclockwise from above).
2. $\operatorname{curl}\mathbf F = \langle 0 - 0,\; 0 - 0,\; 3x^2 + 3y^2\rangle$, so $\operatorname{curl}\mathbf F\cdot\mathbf k = 3r^2$.
3. $\displaystyle\iint_S\operatorname{curl}\mathbf F\cdot d\mathbf S = \int_0^{2\pi}\int_0^2 3r^2\cdot r\,dr\,d\theta = 2\pi\cdot3\cdot4 = 24\pi.$

**Check directly.** With $\mathbf r = \langle 2\cos t, 2\sin t, 3\rangle$:
$\mathbf F\cdot\mathbf r' = (-8\sin^3t)(-2\sin t) + (8\cos^3t)(2\cos t) + 3\cdot0 = 16(\sin^4t + \cos^4t)$.
Since $\int_0^{2\pi}\sin^4t\,dt = \int_0^{2\pi}\cos^4t\,dt = \tfrac{3\pi}{4}$, the integral is
$16\cdot\tfrac{3\pi}{2} = 24\pi$. ✓

### Example 2: a surface integral via Stokes

Evaluate $\iint_S\operatorname{curl}\mathbf F\cdot d\mathbf S$ for $\mathbf F = \langle -y,\; x,\; e^{xyz}\rangle$
over the upper hemisphere $x^2 + y^2 + z^2 = 1$, $z \ge 0$, oriented outward (upward).

Computing the curl and parametrizing the hemisphere would be messy. Instead, the boundary is
the unit circle in the $xy$-plane, counterclockwise (right-hand rule with upward normals). On
it, $z = 0$ and $dz = 0$, so the $e^{xyz}$ component never matters:

$$\oint_C\mathbf F\cdot d\mathbf r = \int_0^{2\pi}\langle -\sin t, \cos t, 1\rangle\cdot\langle -\sin t, \cos t, 0\rangle\,dt = \int_0^{2\pi}1\,dt = 2\pi.$$

## Surface independence

Example 2 illustrates a powerful consequence: if two oriented surfaces $S_1$ and $S_2$ have the
same boundary curve $C$ (with the same induced orientation), then

$$\iint_{S_1}\operatorname{curl}\mathbf F\cdot d\mathbf S = \iint_{S_2}\operatorname{curl}\mathbf F\cdot d\mathbf S,$$

because both equal $\oint_C\mathbf F\cdot d\mathbf r$. So you may replace a curved surface by a
flat disk with the same rim. For the hemisphere above, the flat unit disk with upward normal
gives $\iint\operatorname{curl}\mathbf F\cdot\mathbf k\,dA$, where
$\operatorname{curl}\mathbf F\cdot\mathbf k = 1 - (-1) = 2$, so $2\pi$ again. ✓

```plot
{"x": [-1.6, 1.6], "y": [-0.4, 1.4], "equal": true, "curves": [{"x": "cos(t)", "y": "sin(t)", "t": [0, "pi"]}], "segments": [{"from": [-1, 0], "to": [1, 0]}, {"from": [0.4, 0], "to": [0.4, 0.5], "arrow": true, "dashed": true, "label": "n"}, {"from": [0.7071, 0.7071], "to": [1.06, 1.06], "arrow": true, "label": "n"}], "labels": [{"at": [-0.95, 0.85], "text": "hemisphere S₁"}, {"at": [-0.55, 0.1], "text": "disk S₂"}], "yLabel": "z", "caption": "Side view: the hemisphere and the flat disk share the boundary circle, so they carry the same flux of curl F"}
```

## Consequences

- If $\operatorname{curl}\mathbf F = \mathbf 0$ on a simply connected region, then
  $\oint_C\mathbf F\cdot d\mathbf r = 0$ for every closed curve there (span any surface across $C$):
  $\mathbf F$ is conservative. This proves the 3D test from Lesson 33.
- For a closed surface (no boundary), $\iint_S\operatorname{curl}\mathbf F\cdot d\mathbf S = 0$.
- In electromagnetism, Stokes' theorem converts Faraday's law and Ampère's law between their
  integral and differential forms (Lesson 38).

## Common mistakes

- Mismatching orientations: the curve's direction and the normal must obey the right-hand rule.
- Using $\mathbf F$ instead of $\operatorname{curl}\mathbf F$ in the surface integral.
- Forgetting that the surface must have $C$ as its *entire* boundary.
- Evaluating the line integral when a flat surface makes the surface integral trivial (or vice versa).

## Key points

- $\oint_C\mathbf F\cdot d\mathbf r = \iint_S\operatorname{curl}\mathbf F\cdot d\mathbf S$, with $C$ oriented by the right-hand rule.
- Any surface with the same boundary gives the same flux of curl: choose the easiest.
- Green's theorem is the flat special case; curl $\cdot\,\mathbf n$ is circulation per unit area.

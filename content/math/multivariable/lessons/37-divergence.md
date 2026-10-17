---
id: mv-divergence
module: mv-m8
title: The Divergence theorem
minutes: 40
topics: [Divergence theorem]
drills: [mv-d-div-thm-box, mv-d-div-thm-ball]
refs: [mv-ref-vector-calculus]
---
## What flows out equals what is produced inside

Imagine a region of space filled with a moving gas. The net amount of gas leaving through the
boundary each second must equal the amount being produced (by expansion or by sources) inside.
The **Divergence theorem** (also called **Gauss's theorem**) makes this precise: the outward
flux of a vector field through a closed surface equals the integral of its divergence over the
solid inside. It is the last of the big theorems, and the one physicists use most.

## The theorem

**Divergence theorem.** Let $E$ be a simple solid region whose boundary surface $S$ is
oriented outward, and let $\mathbf F$ have continuous partial derivatives on an open region
containing $E$. Then

$$\iint_S\mathbf F\cdot d\mathbf S = \iiint_E\operatorname{div}\mathbf F\,dV.$$

(The double integral sign with a circle, $\displaystyle\oiint$, is sometimes used for flux
through a closed surface; we write $\iint_S$ and say "closed.")

*Why it is true (the idea).* Divergence was defined as outflow per unit volume (Lesson 33).
Cut $E$ into tiny boxes. For each box, outward flux $\approx\operatorname{div}\mathbf F\,\Delta V$
(one can check this face by face, just as for Green's theorem). Add over all boxes: wherever two
boxes share a face, the flux out of one is the flux into the other, and they cancel. Only the
faces on the outer surface $S$ survive.

The pattern of all four fundamental theorems is now complete:

| Theorem | Integral of a derivative over a region | equals | boundary term |
|---|---|---|---|
| FTC | $\int_a^bF'(x)\,dx$ | $=$ | $F(b) - F(a)$ |
| Line integrals | $\int_C\nabla f\cdot d\mathbf r$ | $=$ | $f(\text{end}) - f(\text{start})$ |
| Green / Stokes | $\iint_S\operatorname{curl}\mathbf F\cdot d\mathbf S$ | $=$ | $\oint_C\mathbf F\cdot d\mathbf r$ |
| Divergence | $\iiint_E\operatorname{div}\mathbf F\,dV$ | $=$ | $\iint_S\mathbf F\cdot d\mathbf S$ |

### Example 1: radial field, revisited

For $\mathbf F = \langle x, y, z\rangle$ and the ball of radius $a$: $\operatorname{div}\mathbf F = 3$, so
the flux is $3\cdot\tfrac43\pi a^3 = 4\pi a^3$. This matches the direct computation in Lesson 35.

### Example 2

Find the outward flux of $\mathbf F = \langle x^3,\, y^3,\, z^3\rangle$ through the unit sphere.

1. $\operatorname{div}\mathbf F = 3x^2 + 3y^2 + 3z^2 = 3\rho^2$.
2. $\displaystyle\iiint_E 3\rho^2\,dV = \int_0^\pi\int_0^{2\pi}\int_0^1 3\rho^2\cdot\rho^2\sin\phi\,d\rho\,d\theta\,d\phi = 3\cdot\frac15\cdot2\pi\cdot2 = \frac{12\pi}{5}.$

Computing this flux directly would require integrating $\mathbf F\cdot\mathbf n$ over the sphere,
which is much messier.

### Example 3: a cube

Find the outward flux of $\mathbf F = \langle xy,\, yz,\, zx\rangle$ through the surface of the cube $[0, 1]^3$.

$\operatorname{div}\mathbf F = y + z + x$, and $\iiint_{[0,1]^3}(x + y + z)\,dV = \tfrac12 + \tfrac12 + \tfrac12 = \tfrac32$.
One triple integral instead of six surface integrals, one per face.

## Open surfaces: close them up

The theorem needs a *closed* surface. To find the flux through an open surface, add a simple
"lid" to close it, apply the theorem, and subtract the lid's flux.

### Example 4

Find the upward flux of $\mathbf F = \langle x, y, z\rangle$ through the paraboloid $z = 4 - x^2 - y^2$, $z \ge 0$.

1. Close the solid with the disk $D$: $x^2 + y^2 \le 4$, $z = 0$, oriented downward (outward from the solid).
2. Total outward flux $= \iiint_E 3\,dV = 3\cdot V(E)$. The volume under the paraboloid is $8\pi$ (Lesson 23), so the total is $24\pi$.
3. Flux through the lid: $\mathbf n = -\mathbf k$ and $\mathbf F\cdot\mathbf n = -z = 0$ on $z = 0$. So the lid contributes nothing.
4. Flux through the paraboloid $= 24\pi - 0 = 24\pi$.

```plot
{"x": [-2.6, 2.6], "y": [-1, 4.6], "equal": true, "functions": [{"f": "4-x^2", "from": -2, "to": 2, "label": "paraboloid"}], "segments": [{"from": [-2, 0], "to": [2, 0], "label": "lid z = 0"}, {"from": [1.3, 0], "to": [1.3, -0.7], "arrow": true, "label": "n = −k"}, {"from": [1, 3], "to": [1.6, 3.3], "arrow": true, "label": "n"}], "shade": [{"f": "4-x^2", "from": -2, "to": 2}], "yLabel": "z", "caption": "Closing the paraboloid with a flat lid; both normals point out of the solid"}
```

## Sources, sinks, and regions with holes

If $\operatorname{div}\mathbf F = 0$ in a region between two closed surfaces (one inside the other),
then the theorem applied to the shell between them shows the outward flux through both is the
same. This is how one shows that the flux of the inverse-square field
$\mathbf F = \dfrac{\mathbf x}{|\mathbf x|^3}$ is $4\pi$ through *every* closed surface enclosing the
origin: its divergence is 0 away from the origin, and through a small sphere around the origin
the flux is easily computed to be $4\pi$. That is **Gauss's law**, the subject of the next lesson.

## Common mistakes

- Applying the theorem to a surface that is not closed, without adding and subtracting a lid.
- Using an inward normal; the theorem is stated for outward orientation.
- Applying it when $\mathbf F$ is undefined somewhere inside $E$ (like $\mathbf x/|\mathbf x|^3$ at the origin).
- Forgetting the Jacobian ($\rho^2\sin\phi$ or $r$) when evaluating the triple integral.

## Key points

- Closed surface, outward normal: $\iint_S\mathbf F\cdot d\mathbf S = \iiint_E\operatorname{div}\mathbf F\,dV$.
- Turns six (or infinitely many) surface pieces into one triple integral.
- For open surfaces, close with a lid and subtract its flux.
- All four fundamental theorems say: integrating a derivative inside equals evaluating on the boundary.

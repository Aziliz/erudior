---
id: mv-cylindrical
module: mv-m6
title: Cylindrical coordinates
minutes: 35
topics: [Cylindrical coordinates]
drills: [mv-d-cyl-convert, mv-d-cyl-integral]
refs: [mv-ref-integrals]
---
## Polar coordinates with a height

Polar coordinates made disks easy in the plane. Solids with an axis of symmetry, such as
cylinders, cones around the $z$-axis, paraboloids $z = x^2 + y^2$, pipes and tanks, call
for the same trick in space: use polar coordinates for $(x, y)$ and keep $z$ as it is. The
result is **cylindrical coordinates** $(r, \theta, z)$.

## The coordinate system

A point $P$ has cylindrical coordinates $(r, \theta, z)$, where $(r, \theta)$ are the polar
coordinates of its shadow on the $xy$-plane and $z$ is its height:

$$x = r\cos\theta,\quad y = r\sin\theta,\quad z = z;\qquad r^2 = x^2 + y^2,\quad \tan\theta = \frac yx.$$

The name comes from the surface $r = c$: all points at distance $c$ from the $z$-axis, a
circular cylinder. The surface $\theta = c$ is a vertical half-plane, and $z = c$ is a
horizontal plane.

### Example 1: converting points

1. Cylindrical $\left(2, \tfrac{2\pi}{3}, 1\right)$ to rectangular: $x = 2\cos\tfrac{2\pi}{3} = -1$, $y = 2\sin\tfrac{2\pi}{3} = \sqrt3$, $z = 1$. So $(-1, \sqrt3, 1)$.
2. Rectangular $(3, -3, -7)$ to cylindrical: $r = \sqrt{9 + 9} = 3\sqrt2$; $\tan\theta = -1$ with the point in quadrant IV, so $\theta = \tfrac{7\pi}{4}$ (or $-\tfrac\pi4$); $z = -7$.

As with polar coordinates, check the quadrant when using $\arctan$: $\tan\theta = -1$ is also
satisfied by $\tfrac{3\pi}{4}$, which points the wrong way.

### Surfaces in cylindrical form

| Rectangular | Cylindrical | Surface |
|---|---|---|
| $x^2 + y^2 = 9$ | $r = 3$ | cylinder |
| $z = x^2 + y^2$ | $z = r^2$ | paraboloid |
| $z = \sqrt{x^2 + y^2}$ | $z = r$ | cone (upper half) |
| $x^2 + y^2 + z^2 = 4$ | $r^2 + z^2 = 4$ | sphere |

## The volume element

A small cylindrical "box" with sides $\Delta r$, $\Delta\theta$, $\Delta z$ is a polar
rectangle of area about $r\,\Delta r\,\Delta\theta$, stretched up by $\Delta z$. Hence

$$dV = r\,dz\,dr\,d\theta.$$

For a solid $E$ lying between $z = u_1(x, y)$ and $z = u_2(x, y)$ over a region $D$ that is
described in polar coordinates by $\alpha \le \theta \le \beta$, $h_1(\theta) \le r \le h_2(\theta)$:

$$\iiint_E f\,dV = \int_\alpha^\beta\int_{h_1(\theta)}^{h_2(\theta)}\int_{u_1(r\cos\theta,\,r\sin\theta)}^{u_2(r\cos\theta,\,r\sin\theta)} f(r\cos\theta, r\sin\theta, z)\,r\,dz\,dr\,d\theta.$$

In words: do $z$ first (bottom surface to top surface), then the shadow in polar form, and
never forget the $r$.

### Example 2: a volume

Find the volume of the solid inside the cylinder $x^2 + y^2 = 1$, above $z = 0$ and below $z = 4 - x^2 - y^2$.

1. Bottom $z = 0$, top $z = 4 - r^2$; shadow $0 \le r \le 1$, $0 \le \theta \le 2\pi$.
2. $V = \displaystyle\int_0^{2\pi}\int_0^1\int_0^{4 - r^2} r\,dz\,dr\,d\theta = 2\pi\int_0^1(4r - r^3)\,dr = 2\pi\left(2 - \tfrac14\right) = \tfrac{7\pi}{2}.$

### Example 3: inside a cone

Evaluate $\iiint_E (x^2 + y^2)\,dV$, where $E$ is the solid between the cone $z = \sqrt{x^2 + y^2}$ and the plane $z = 2$.

```plot
{"x": [-0.3, 2.6], "y": [-0.3, 2.6], "equal": true, "functions": [{"f": "x", "from": 0, "to": 2, "label": "cone z = r"}, {"f": "2", "from": 0, "to": 2, "label": "plane z = 2"}], "shade": [{"f": "2", "g": "x", "from": 0, "to": 2}], "segments": [{"from": [1, 1], "to": [1, 2], "arrow": true}], "xLabel": "r", "yLabel": "z", "caption": "Cross-section in the (r, z) half-plane: for each r, z runs from r up to 2"}
```

1. In cylindrical form the cone is $z = r$, and it meets $z = 2$ at $r = 2$. So: $0 \le \theta \le 2\pi$, $0 \le r \le 2$, $r \le z \le 2$.
2. The integrand $x^2 + y^2 = r^2$.
3. $\displaystyle\int_0^{2\pi}\int_0^2\int_r^2 r^2\cdot r\,dz\,dr\,d\theta = 2\pi\int_0^2 r^3(2 - r)\,dr = 2\pi\left(8 - \tfrac{32}{5}\right) = \tfrac{16\pi}{5}.$

### Example 4: variable density

A solid cylinder of radius $a$ and height $h$ has density proportional to the distance from
its axis, $\rho = kr$. Its mass is

$$m = \int_0^{2\pi}\int_0^a\int_0^h kr\cdot r\,dz\,dr\,d\theta = 2\pi kh\frac{a^3}{3} = \frac{2\pi kha^3}{3}.$$

## When to use cylindrical coordinates

Choose them when the solid is symmetric about an axis (usually the $z$-axis) or when the
integrand contains $x^2 + y^2$. If the symmetry is about another axis, say the $y$-axis (as
in $x^2 + z^2 \le 4$), use polar coordinates in the $xz$-plane instead and let $y$ play the
role of height.

### Example 5: recognizing a cylindrical integral

Evaluate $\displaystyle\int_{-2}^{2}\int_{-\sqrt{4-x^2}}^{\sqrt{4-x^2}}\int_{\sqrt{x^2+y^2}}^{2}(x^2 + y^2)\,dz\,dy\,dx$.

Read the region from the limits: $z$ runs from the cone $z = \sqrt{x^2+y^2}$ up to $z = 2$, over the disk $x^2 + y^2 \le 4$. That is exactly the solid of Example 3, with the same integrand, so the value is $\tfrac{16\pi}{5}$. In rectangular form it is a hard integral; in cylindrical form it is three easy ones.

## Common mistakes

- Forgetting the factor $r$ in $dV = r\,dz\,dr\,d\theta$.
- Taking $\theta = \arctan(y/x)$ without checking the quadrant.
- Writing the cone $z = \sqrt{x^2 + y^2}$ as $z = r^2$; it is $z = r$.
- Using cylindrical coordinates for a region with no circular symmetry, which only complicates the limits.

## Key points

- $x = r\cos\theta$, $y = r\sin\theta$, $z = z$; $dV = r\,dz\,dr\,d\theta$.
- $r = c$ is a cylinder, $z = r$ a cone, $z = r^2$ a paraboloid.
- Integrate $z$ from bottom to top surface, then the shadow in polar coordinates.

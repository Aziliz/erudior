---
id: pc-parabolas
module: pc-m7
title: Parabolas
minutes: 30
topics: [Parabolas]
drills: [pc-parabola-focus, pc-parabola-vertex-form]
refs: [pc-ref-conics-polar]
---
## The conic sections

Slice a double cone with a plane and the edge of the slice is one of four curves: a circle, an ellipse, a parabola or a hyperbola. These **conic sections** describe planetary orbits, the shape of satellite dishes and headlight reflectors, the paths of comets and the design of navigation systems. Each conic can be defined by distances to special points and lines, and each has a standard equation that you can read like the transformation forms of Module 2. We start with the parabola, which you already know as the graph of a quadratic, but now with a geometric definition that explains why it reflects light to a single point.

## Definition

A **parabola** is the set of all points in a plane that are the same distance from a fixed point, the **focus**, and a fixed line, the **directrix**. The point halfway between the focus and the directrix is the **vertex**, and the line through the focus perpendicular to the directrix is the **axis of symmetry**.

## Deriving the equation

Put the vertex at the origin and the focus at $(0, p)$, so the directrix is $y = -p$. A point $(x, y)$ is on the parabola when its distance to the focus equals its distance to the directrix:

$$\sqrt{x^2 + (y - p)^2} = |y + p|.$$

Square both sides: $x^2 + y^2 - 2py + p^2 = y^2 + 2py + p^2$. Everything cancels except

$$x^2 = 4py.$$

The number $p$ is the directed distance from the vertex to the focus. If $p > 0$ the parabola opens up (toward the focus); if $p < 0$ it opens down. Swapping the roles of $x$ and $y$ gives $y^2 = 4px$, which opens right ($p > 0$) or left ($p < 0$).

## Standard forms

Shifting the vertex to $(h, k)$:

| Equation | Opens | Focus | Directrix |
|---|---|---|---|
| $(x - h)^2 = 4p(y - k)$ | up if $p > 0$, down if $p < 0$ | $(h, k + p)$ | $y = k - p$ |
| $(y - k)^2 = 4p(x - h)$ | right if $p > 0$, left if $p < 0$ | $(h + p, k)$ | $x = h - p$ |

The squared variable tells you the axis of symmetry is parallel to the *other* axis: $x$ squared means the parabola opens up or down. The **focal width** (the length of the chord through the focus parallel to the directrix, also called the latus rectum) is $|4p|$, which gives two more points for sketching: they are $2|p|$ on either side of the focus.

### Example 1

Find the focus and directrix of $x^2 = 12y$, and sketch it.

$4p = 12$, so $p = 3$. Vertex $(0, 0)$, opens up, focus $(0, 3)$, directrix $y = -3$. The focal width is 12, so the points $(\pm 6, 3)$ are on the parabola.

```plot
{"x": [-9, 9], "y": [-5, 9], "equal": true, "functions": [{"f": "x^2/12", "label": "x² = 12y"}, {"f": "-3", "dashed": true, "label": "directrix y = −3"}], "points": [{"at": [0, 3], "label": "focus (0, 3)"}, {"at": [6, 3], "label": "(6, 3)"}, {"at": [-6, 3], "label": "(−6, 3)"}, {"at": [0, 0]}], "segments": [{"from": [6, 3], "to": [0, 3], "dashed": true}, {"from": [6, 3], "to": [6, -3], "dashed": true}], "caption": "(6, 3) is 6 units from the focus and 6 units above the directrix."}
```

Check the definition at $(6, 3)$: distance to the focus is 6, distance to $y = -3$ is 6. ✓

### Example 2

Describe $(y - 2)^2 = -8(x - 1)$.

$y$ is squared, so it opens left or right; $4p = -8$ gives $p = -2$, so it opens left. Vertex $(1, 2)$. Focus $(1 + p, 2) = (-1, 2)$. Directrix $x = 1 - p = 3$.

## Completing the square

An equation like $y^2 + 6y - 4x + 1 = 0$ is a parabola in disguise: one variable is squared and the other isn't. Complete the square on the squared variable to reach standard form.

### Example 3

Write $y^2 + 6y - 4x + 1 = 0$ in standard form; find the vertex, focus and directrix.

1. Keep the $y$ terms on the left: $y^2 + 6y = 4x - 1$.
2. Add $\left(\tfrac62\right)^2 = 9$ to both sides: $(y + 3)^2 = 4x + 8$.
3. Factor the right side to show $x - h$: $(y + 3)^2 = 4(x + 2)$.

So $h = -2$, $k = -3$, $4p = 4$, $p = 1$: it opens right, vertex $(-2, -3)$, focus $(-1, -3)$, directrix $x = -3$.

```plot
{"x": [-5, 6], "y": [-9, 3], "equal": true, "curves": [{"x": "t^2/4 - 2", "y": "t - 3", "t": [-6, 6]}], "segments": [{"from": [-3, -9], "to": [-3, 3], "dashed": true}], "points": [{"at": [-2, -3]}, {"at": [-1, -3], "label": "focus"}], "caption": "(y + 3)² = 4(x + 2): a parabola opening right, with vertex (−2, −3), focus (−1, −3) and directrix x = −3."}
```

## The reflective property

A ray traveling parallel to the axis of symmetry reflects off a parabola straight through the focus, and rays leaving the focus reflect out parallel to the axis. That's why satellite dishes put the receiver at the focus and flashlights put the bulb there.

### Example 4

A satellite dish is a parabola in cross-section, 4 feet across and 1 foot deep. Where should the receiver go?

Put the vertex at the origin, opening up: $x^2 = 4py$. The rim is at $(2, 1)$: $4 = 4p(1)$, so $p = 1$. The receiver goes at the focus, 1 foot above the vertex.

## Common mistakes

- *Using $4p$ as the focal distance.* The focus is $p$ from the vertex; $4p$ is the coefficient.
- *Opening the wrong way.* $x^2$ means up/down; $y^2$ means left/right; the sign of $p$ picks which.
- *Putting the directrix on the same side as the focus.* They are on opposite sides of the vertex.
- *Completing the square on both variables.* Only the squared variable needs it.
- *Forgetting to factor the coefficient* on the non-squared side: $4x + 8 = 4(x + 2)$, so $h = -2$.

## Key points

- Parabola: points equidistant from a focus and a directrix.
- $(x - h)^2 = 4p(y - k)$ opens up/down; $(y - k)^2 = 4p(x - h)$ opens right/left.
- Vertex $(h, k)$; the focus is $p$ units from the vertex in the opening direction; the directrix is $p$ units the other way.
- Focal width $|4p|$ gives two quick sketch points.
- Rays parallel to the axis reflect through the focus.

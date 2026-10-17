---
id: phys-equilibrium
module: phys-m5
title: Static equilibrium
minutes: 35
topics: [Static equilibrium]
drills: [phys-seesaw, phys-beam-supports]
refs: [phys-ref-mechanics]
---
## Structures that stay put

Bridges, shelves, ladders and your own skeleton are designed not to move. Engineers need to know the forces in each support and cable to make sure nothing breaks or tips over. For a point particle, staying at rest just needs zero net force. An extended object can have zero net force and still start spinning (think of two equal, opposite forces at opposite ends of a ruler), so it needs a second condition. This lesson puts torque to work on objects that don't move at all.

## The two conditions

A rigid object is in **static equilibrium** when it is at rest and stays at rest. That requires

$$\sum\vec F = 0 \qquad\text{and}\qquad \sum\tau = 0 \text{ about any axis}.$$

The first prevents translation, the second rotation. In two dimensions this gives three equations: $\sum F_x = 0$, $\sum F_y = 0$, $\sum\tau = 0$. So you can solve for up to three unknown forces or distances.

*Freedom to choose the axis.* If the net force is zero, the net torque is the same about every point. So you may compute torques about whatever point is most convenient. The best choice is a point where an unknown force acts: that force then has zero lever arm and drops out of the torque equation, leaving fewer unknowns.

## Center of gravity

Gravity acts on every bit of an object, but for torque purposes its total effect is as if the whole weight $Mg$ acted at one point, the **center of gravity**. In a uniform gravitational field (any object on Earth smaller than a mountain), the center of gravity is the center of mass. A uniform beam's weight acts at its midpoint.

This explains tipping. An object resting on a base is stable as long as its center of gravity lies above the base. Lean it until the center of gravity passes beyond the edge of the base, and gravity's torque about that edge tips it over. Wide bases and low centers of gravity make objects harder to tip, which is why racing cars are low and wide.

## Solving equilibrium problems

1. Draw a free-body diagram of the object, showing each force *at the point where it acts*.
2. Choose a pivot point for torques, ideally where an unknown force acts.
3. Write $\sum\tau = 0$ about that point (counterclockwise positive).
4. Write $\sum F_x = 0$ and $\sum F_y = 0$.
5. Solve. If a force comes out negative, it points opposite to the way you drew it.

### Example 1: a seesaw

A 30 kg child sits 1.8 m from the pivot of a seesaw. Where must a 45 kg child sit on the other side to balance it? (The seesaw is uniform and pivoted at its center.)

Torques about the pivot (the pivot's force and the board's weight act there, so they contribute nothing):

$$30g(1.8) = 45g\,x \quad\Rightarrow\quad x = \frac{30(1.8)}{45} = 1.2\text{ m}.$$

The heavier child sits closer. Balance is about equal torques, not equal weights.

### Example 2: a beam on two supports

A uniform 6.0 m plank of mass 20 kg rests on supports at its two ends, A (left) and B (right). A 60 kg painter stands 1.5 m from end A. Find the force each support exerts.

Weights: plank $20(9.8) = 196$ N at 3.0 m from A; painter $60(9.8) = 588$ N at 1.5 m from A.

Torques about A (eliminates $F_A$):

$$F_B(6.0) - 196(3.0) - 588(1.5) = 0 \quad\Rightarrow\quad F_B = \frac{588 + 882}{6.0} = 245\text{ N}.$$

Vertical forces: $F_A + F_B = 196 + 588 = 784$ N, so $F_A = 539$ N.

Check with torques about B: $-F_A(6.0) + 196(3.0) + 588(4.5) = -3234 + 588 + 2646 = 0$ ✓. The support nearer the painter carries more of the load.

```shape
{"polygons": [{"points": [[0, 0], [6, 0], [6, 0.2], [0, 0.2]]}, {"points": [[-0.2, -0.6], [0.2, -0.6], [0, 0]]}, {"points": [[5.8, -0.6], [6.2, -0.6], [6, 0]]}], "segments": [{"from": [0, -1.6], "to": [0, -0.7], "arrow": true, "label": "F_A"}, {"from": [6, -1.6], "to": [6, -0.7], "arrow": true, "label": "F_B"}, {"from": [3, 0.1], "to": [3, -0.9], "arrow": true, "label": "196 N"}, {"from": [1.5, 1.4], "to": [1.5, 0.25], "arrow": true, "label": "588 N"}], "caption": "Plank on two supports with a painter 1.5 m from the left end"}
```

### Example 3: a hinged beam held by a cable

A uniform 4.0 m horizontal beam of mass 25 kg is hinged to a wall at its left end. A cable from its right end to the wall makes $30^\circ$ with the beam. A 40 kg sign hangs from the right end. Find the cable tension and the hinge force.

Weights: beam 245 N at 2.0 m; sign 392 N at 4.0 m.

Torques about the hinge (removes both unknown hinge components). The cable's perpendicular component is $T\sin 30^\circ$ at 4.0 m:

$$T\sin 30^\circ(4.0) - 245(2.0) - 392(4.0) = 0 \quad\Rightarrow\quad T = \frac{490 + 1568}{2.0} = 1029\text{ N}.$$

Horizontal: hinge pushes outward, $H = T\cos 30^\circ = 891$ N. Vertical: $V + T\sin 30^\circ = 245 + 392$, so $V = 637 - 514.5 = 122.5$ N upward. A shallow cable angle makes the tension much larger than the weights it holds, a recurring theme.

## Ladders

A ladder leaning on a smooth wall is held by the floor's normal force, floor friction, the wall's normal force, and gravity. Taking torques about the foot of the ladder eliminates the two floor forces and gives the wall force; horizontal balance then gives the friction needed. If friction would need to exceed $\mu_s n$, the ladder slips. Steeper ladders need less friction, which is why the usual safety rule is a 4:1 ratio of height to base distance (about $76^\circ$).

## Spread-out loads and stability

Not every load sits at one point: sand piled along a beam, or snow on a roof. A spread-out load is described by how many newtons it puts on each meter of beam, and drawn as a graph of load per meter against position. The total load is the area under that graph, and for torque purposes it acts at the center of that area (the "center of gravity" of the load).

- A *uniform* load of $w$ N/m over length $L$ is a rectangle: total $wL$, acting at the middle.
- A load that *increases steadily* from 0 to $w_0$ N/m is a triangle: total $\tfrac12w_0L$, acting at the triangle's centroid, two-thirds of the way from the zero end toward the heavy end.

Replace the spread-out load by that single force and proceed as before.

Equilibrium can also be stable or unstable, which ties back to potential energy: an object resting where its gravitational $U = Mgy_{\text{cg}}$ is at a minimum (any small tilt raises its center of gravity) is stable; at a maximum, unstable. A box sitting flat is stable; the same box balanced on one edge is unstable.

## Common mistakes

- Taking torques about a point but then including forces acting at that point (they have zero lever arm).
- Placing a beam's weight at its end instead of its center of gravity.
- Using the distance along the beam instead of the perpendicular lever arm for a slanted force.
- Forgetting that a hinge can exert both horizontal and vertical components.

## Key points

- Static equilibrium: $\sum\vec F = 0$ and $\sum\tau = 0$.
- Choose the torque pivot where an unknown force acts.
- A uniform object's weight acts at its center (center of gravity).
- An object tips when its center of gravity moves outside its base.

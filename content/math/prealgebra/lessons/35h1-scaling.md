---
id: pre-m8-h-scaling
module: pre-m8
title: 'Scaling: how area and volume grow'
minutes: 40
honors: true
topics: [Scaling]
drills: [pre-m8-r2-scale-area, pre-m8-r2-scale-volume, pre-m8-r2-scale-find-k]
refs: [pre-ref-geometry]
---
## Bigger is not just bigger

Lesson 16 showed that when a figure is enlarged or shrunk by a scale factor $k$, every length is multiplied by $k$. Along the way this module has dropped three hints that areas and volumes behave differently: 1 yd² is 9 ft², not 3 (Lesson 30); doubling a circle's radius multiplies its area by 4 (Lesson 33); and 1 yd³ is 27 ft³ (Lesson 34). This lesson turns those hints into one rule, explains why it's true, and uses it to answer questions such as "Why is a large pizza such good value?", "How much paint does a model need compared with the real thing?" and "Why can't a spider be the size of a horse?"

Throughout, "scaled by $k$" means every length of the figure is multiplied by the same number $k$, so the new figure is similar to the old one.

## Lengths scale by k

Every length in the figure is multiplied by $k$: sides, heights, radii, diagonals, and therefore perimeters too. If a triangle with perimeter 12 cm is scaled by 3, each side triples, so the perimeter becomes 36 cm. Angles do not change at all; that's what "same shape" means.

## Areas scale by k²

Take a rectangle 3 units by 2 units, with area 6, and scale it by 2. The new rectangle is 6 by 4, with area 24: four times the area, not twice.

```shape
{"polygons": [{"points": [[0, 0], [3, 0], [3, 2], [0, 2]], "fill": true}, {"points": [[5, 0], [11, 0], [11, 4], [5, 4]]}], "segments": [{"from": [1, 0], "to": [1, 2]}, {"from": [2, 0], "to": [2, 2]}, {"from": [0, 1], "to": [3, 1]}, {"from": [8, 0], "to": [8, 4], "dashed": true}, {"from": [5, 2], "to": [11, 2], "dashed": true}, {"from": [0, -0.5], "to": [3, -0.5], "label": "3"}, {"from": [5, -0.5], "to": [11, -0.5], "label": "6"}], "labels": [{"at": [6.5, 1], "text": "6"}, {"at": [9.5, 1], "text": "6"}, {"at": [6.5, 3], "text": "6"}, {"at": [9.5, 3], "text": "6"}], "caption": "Scaling a 3 by 2 rectangle by 2 gives a 6 by 4 rectangle: four copies of the original, area 6 × 4 = 24"}
```

Here is why the rule is $k^2$ for every shape. Area is a count of unit squares. When you scale by $k$, each little square of side 1 becomes a square of side $k$, and its area becomes $k \times k = k^2$. Every piece of the shape grows by the same factor $k^2$, so the whole area does too:

$$\text{new area} = k^2 \times \text{old area}.$$

(For curved shapes like circles, picture the shape covered by smaller and smaller squares; the argument is the same. A full proof belongs to a geometry course, but the idea is exactly this.)

The rule covers every kind of area: the area of a flat figure, the surface area of a solid, the amount of paint on a model, the cloth in a scaled-up flag.

### Example 1

A 10-inch pizza costs \$9 and a 15-inch pizza costs \$16. Which is the better deal per square inch?

The scale factor from the small to the large pizza is $k = \tfrac{15}{10} = 1.5$, so the large one has $1.5^2 = 2.25$ times as much pizza. It costs $\tfrac{16}{9} \approx 1.78$ times as much. More than twice the pizza for less than twice the price: the large one is the better deal.

Check with areas: the small pizza is $\pi(5)^2 = 25\pi \approx 78.5$ in², about 11.5 cents per square inch; the large is $\pi(7.5)^2 = 56.25\pi \approx 176.7$ in², about 9.1 cents per square inch. The ratio $56.25 \div 25 = 2.25$ matches $k^2$.

### Example 2

A photo 4 in by 6 in is enlarged to 10 in by 15 in. The original used 0.6 mL of ink. About how much ink does the enlargement need, if the ink is spread just as thickly?

$k = \tfrac{10}{4} = 2.5$ (check: $\tfrac{15}{6} = 2.5$ as well, so the enlargement really is similar). Ink covers area, so it scales by $k^2 = 6.25$: about $0.6 \times 6.25 = 3.75$ mL.

## Volumes scale by k³

Scale a 1 by 1 by 1 cube by 2. Its edges become 2, and it is now built from $2 \times 2 \times 2 = 8$ of the original cubes. Each face, meanwhile, is made of 4 of the original faces, so the surface area grew by 4.

![Left: a single cube with edge 1, surface area 6 and volume 1. Right: a cube with edge 2 built from eight of the small cubes; its surface area is 24, four times as much, and its volume is 8, eight times as much.](images/pre-m8-h-scaled-cubes.svg)

The same reasoning works for any solid: each unit cube becomes a $k$ by $k$ by $k$ cube, holding $k^3$ unit cubes. So

$$\text{new volume} = k^3 \times \text{old volume}.$$

Anything that depends on volume scales the same way: the capacity of a container, and the weight of an object made of the same material all the way through.

### Example 3

A model car is built at a scale of 1 : 24. The model's body holds 0.5 liters of air inside it. How much does the real car's body hold, if the model is an exact copy?

From model to real car, $k = 24$, so volumes multiply by $24^3 = 13{,}824$. The real body holds about $0.5 \times 13{,}824 = 6{,}912$ liters. Notice how different this is from the length factor of 24.

### Example 4

A chocolate company sells a solid chocolate cube 3 cm on a side for \$2. It plans a "giant" cube 6 cm on a side. What price keeps the cost per gram of chocolate the same?

The giant cube is the small one scaled by $k = 2$, so it has $2^3 = 8$ times as much chocolate. To keep the cost per gram the same, it should cost $8 \times 2 = 16$ dollars. Pricing it at \$4 because it's "twice as big" would sell it at a quarter of the price per gram.

## Working backward: finding k

If you know how two similar figures' areas or volumes compare, undo the square or the cube.

- Area ratio $R$: $k = \sqrt{R}$.
- Volume ratio $R$: $k = \sqrt[3]{R}$.

Once you know $k$, you can find any other ratio.

### Example 5

Two similar jars have volumes of 54 mL and 250 mL. The small jar's label covers 18 cm². How much label does the large jar need, if its label is a similar copy?

Volume ratio: $\tfrac{250}{54} = \tfrac{125}{27}$. So $k = \sqrt[3]{\tfrac{125}{27}} = \tfrac{5}{3}$, since $5^3 = 125$ and $3^3 = 27$. Areas scale by $k^2 = \tfrac{25}{9}$, so the large label is $18 \times \tfrac{25}{9} = 50$ cm².

## The square–cube law

Put the two rules side by side. Scale an object by $k$ and its surface area is multiplied by $k^2$ while its volume is multiplied by $k^3$. Volume wins: it grows faster than surface area. This fact is called the **square–cube law**. Galileo described it in 1638 in his book *Two New Sciences*, using it to explain why large animals need disproportionately thick bones.

A handy way to measure the effect is the **surface-area-to-volume ratio**, $\tfrac{SA}{V}$. For a cube with edge $s$,

$$\frac{SA}{V} = \frac{6s^2}{s^3} = \frac{6}{s}.$$

A 1 cm cube has $\tfrac{6}{1} = 6$ cm² of surface for each cm³ of volume; a 10 cm cube has only $\tfrac{6}{10} = 0.6$. Scaling up by $k$ divides the ratio by $k$. Big objects have little surface for their size; small objects have a lot.

### Example 6

A cube of ice 4 cm on a side is crushed into 1 cm cubes. How do the total volume and the total surface area change?

The volume doesn't change: $4^3 = 64$ cm³, now in 64 small cubes. The surface area was $6 \times 4^2 = 96$ cm²; now it is $64 \times 6 \times 1^2 = 384$ cm², four times as much. Melting happens at the surface, so crushed ice melts much faster. (Check with the ratio: $\tfrac{SA}{V}$ went from $\tfrac64 = 1.5$ to $\tfrac61 = 6$, four times bigger.)

### Example 7: why giants are impossible (a simplified model)

Imagine scaling a person up by $k = 2$ in every direction. Their weight (which depends on volume) is multiplied by $2^3 = 8$. The strength of a bone depends roughly on the area of its cross-section, which is multiplied by only $2^2 = 4$. So each square centimeter of bone carries $\tfrac84 = 2$ times the load. Scale by 10 and the load on each square centimeter of bone is 10 times as great. That is why a horse's legs are proportionally much thicker than a spider's, and why, in this model, a spider scaled up to the size of a horse would be crushed by its own weight.

This is a simplified model: real bodies are not exact scale copies, and bone strength depends on more than area. But the square–cube law is the main reason large animals look built differently from small ones. The same law, run the other way, explains why small animals lose body heat quickly (lots of skin for their volume) and why many small mammals have to eat a large share of their body weight every day.

## Units are scaling too

The unit conversions from Lesson 30 are the same law in disguise. Changing from yards to feet is "scaling by 3" in the sense that each yard is 3 feet:

$$1 \text{ yd} = 3 \text{ ft}, \qquad 1 \text{ yd}^2 = 3^2 = 9 \text{ ft}^2, \qquad 1 \text{ yd}^3 = 3^3 = 27 \text{ ft}^3.$$

And in the metric system, $1 \text{ m} = 100 \text{ cm}$ gives $1 \text{ m}^2 = 10{,}000 \text{ cm}^2$ and $1 \text{ m}^3 = 1{,}000{,}000 \text{ cm}^3$.

## Common mistakes

- *Using $k$ for areas or volumes.* Doubling every length doubles the perimeter, but multiplies the area by 4 and the volume by 8.
- *Applying the rules to shapes that aren't similar.* If a box gets twice as long but keeps its width and height, its volume only doubles. The $k^2$ and $k^3$ rules need *every* length scaled by the same $k$.
- *Taking the wrong root when working backward.* From an area ratio take the square root; from a volume ratio take the cube root.
- *Getting the direction backward.* Decide which figure is "old" and which is "new" before computing $k$; from small to large, $k$ is greater than 1.
- *Forgetting that angles don't scale.* A scaled triangle has the same angles as the original.

## Key points

- Scale every length by $k$: lengths and perimeters $\times k$, areas and surface areas $\times k^2$, volumes (and weights of the same material) $\times k^3$. Angles stay the same.
- Working backward: $k = \sqrt{\text{area ratio}} = \sqrt[3]{\text{volume ratio}}$.
- Square–cube law: volume grows faster than surface area, so the surface-area-to-volume ratio is divided by $k$. For a cube, $\tfrac{SA}{V} = \tfrac{6}{s}$.
- Unit conversions for square and cubic units follow the same rule.

---
id: calc-m5-h-optimization-models
module: calc-m5
title: 'Optimization models: light, inventory and corners'
minutes: 45
honors: true
topics: [Optimization models]
drills: [calc-m5-r2-lifeguard, calc-m5-r2-eoq, calc-m5-r2-ladder]
refs: [calc-ref-derivatives]
---
## When the answer is a law, not a number

Lesson 20 solved optimization problems with numbers in them: a 12-inch sheet, 600 m of fence, a 1000 cm³ can. This honors lesson keeps the letters as letters. Then the answer is not a number but a *rule*, one that holds for every version of the problem, and some of those rules turn out to be laws of nature or of business. Three classic models: the path of a light ray, the best order size for a warehouse, and the longest ladder that can be carried around a corner. Each uses the procedure from Lesson 20; the new skill is reading meaning into the condition $f' = 0$.

## The lifeguard problem

A lifeguard at point $A$ on the beach, a distance $a$ from the straight shoreline, sees a swimmer in trouble at point $B$, a distance $b$ out in the water. Along the shore, $B$ is a distance $d$ beyond $A$. She runs on sand at speed $v_1$ and swims at a slower speed $v_2$. Where should she enter the water?

![A beach diagram. The sand is above a horizontal shoreline and the water below. The lifeguard at A is a distance a above the shoreline; the swimmer at B is a distance b below it. A path runs straight from A to a point P on the shoreline, then straight from P to B. P is a horizontal distance x from A, and B is a further distance d minus x along the shore. A dashed line through P perpendicular to the shoreline is the normal. The angle between the normal and the sand path is θ₁; the angle between the normal and the water path is θ₂.](images/calc-m5-lifeguard.svg)

Let $P$ be the entry point, a distance $x$ along the shore from the point nearest $A$, with $0 \le x \le d$. Each leg is a straight line (the fastest path within one medium), so the total time is

$$T(x) = \frac{\sqrt{a^2 + x^2}}{v_1} + \frac{\sqrt{b^2 + (d - x)^2}}{v_2}.$$

Differentiate with the chain rule:

$$T'(x) = \frac{x}{v_1\sqrt{a^2 + x^2}} - \frac{d - x}{v_2\sqrt{b^2 + (d - x)^2}}.$$

Now look at the picture. Measure angles from the **normal**, the line through $P$ perpendicular to the shore. In the right triangle on the sand, $\frac{x}{\sqrt{a^2 + x^2}} = \sin\theta_1$; in the water, $\frac{d - x}{\sqrt{b^2 + (d - x)^2}} = \sin\theta_2$. So

$$T'(x) = \frac{\sin\theta_1}{v_1} - \frac{\sin\theta_2}{v_2},$$

and the critical point satisfies

$$\frac{\sin\theta_1}{v_1} = \frac{\sin\theta_2}{v_2}.$$

*Is it the minimum?* $T'(0) < 0$ (there $\theta_1 = 0$) and $T'(d) > 0$ (there $\theta_2 = 0$). Moreover,

$$T''(x) = \frac{a^2}{v_1(a^2 + x^2)^{3/2}} + \frac{b^2}{v_2\big(b^2 + (d - x)^2\big)^{3/2}} > 0,$$

so $T'$ is increasing, crosses zero exactly once, and that critical point is the absolute minimum. The rule says: the faster you are in a medium, the larger the angle you can afford there. The best path bends at the shoreline, running a longer stretch on the fast sand.

### Example 1

Take $a = 20$ m, $b = 40$ m, $d = 60$ m, $v_1 = 6$ m/s and $v_2 = 2$ m/s.

The condition $T'(x) = 0$ leads to a fourth-degree equation, so solve it numerically: Newton's method (Lesson 15) or a graphing tool gives $x \approx 47.1$ m. Then $\theta_1 \approx 67.0°$ and $\theta_2 \approx 17.9°$, and indeed $\frac{\sin 67.0°}{6} \approx 0.153 \approx \frac{\sin 17.9°}{2}$. The time is $T(47.1) \approx 29.5$ s.

Compare: the straight line from $A$ to $B$ crosses the shore at $x = 20$ and takes $T(20) \approx 33.0$ s; running all the way to the point opposite the swimmer ($x = 60$) takes about $30.5$ s. The optimum lies between those two instincts, much closer to the second.

## Fermat's principle and Snell's law

Light does the same thing. When a ray passes from air into water, it bends toward the normal. In the 1600s Pierre de Fermat proposed **Fermat's principle**: light travels between two points along the path that takes the least time. Light is slower in water than in air, so by the lifeguard computation the ray must satisfy

$$\frac{\sin\theta_1}{v_1} = \frac{\sin\theta_2}{v_2}.$$

Physicists describe a medium by its **index of refraction** $n = \frac{c}{v}$, where $c$ is the speed of light in a vacuum and $v$ the speed in the medium (about 1.00 for air and 1.33 for water). Dividing by $c$ turns the rule into **Snell's law**:

$$n_1\sin\theta_1 = n_2\sin\theta_2.$$

The law was found from measurements before anyone derived it this way: the Persian scholar Ibn Sahl described it around 984, Willebrord Snellius rediscovered it in 1621, and René Descartes published it in 1637. Fermat's derivation from least time came in 1662. (Simplified: the modern form of Fermat's principle says the travel time is *stationary*, meaning its derivative is zero. For refraction at a flat surface that stationary time is the minimum, as we just proved, but for some mirror reflections it isn't.)

### Example 2

A light ray in air hits a still pond at $50°$ from the normal. At what angle does it travel in the water?

$1.00\sin 50° = 1.33\sin\theta_2$, so $\sin\theta_2 = \frac{0.766}{1.33} \approx 0.576$ and $\theta_2 \approx 35.2°$. The ray bends toward the normal, as the lifeguard swims at a steeper angle.

## The inventory model

A store sells $D$ units of a product per year at a steady rate. Each time it places an order it pays a fixed **ordering cost** $K$ (paperwork, delivery fee), and keeping one unit in stock for a year costs a **holding cost** $h$ (storage, insurance, money tied up). Ordering $Q$ units at a time:

- It places $\frac{D}{Q}$ orders a year, costing $\frac{KD}{Q}$.
- Stock falls steadily from $Q$ to 0, then a new order arrives, so the average stock is $\frac{Q}{2}$, costing $\frac{hQ}{2}$.

Big orders mean few order fees but a full warehouse; small orders the reverse. The yearly cost (leaving out the price of the goods themselves, which is the same whatever $Q$ is) is

$$C(Q) = \frac{KD}{Q} + \frac{hQ}{2}, \qquad Q > 0.$$

$C'(Q) = -\frac{KD}{Q^2} + \frac{h}{2} = 0$ gives the **economic order quantity**

$$Q^* = \sqrt{\frac{2KD}{h}}.$$

Since $C''(Q) = \frac{2KD}{Q^3} > 0$, $C$ is concave up on the open domain and $Q^*$ is the absolute minimum. Notice what happens at $Q^*$: $\frac{KD}{Q^*} = \frac{hQ^*}{2}$. *At the optimum, the yearly ordering cost equals the yearly holding cost.* The formula is usually credited to the engineer Ford W. Harris, who published it in 1913. It is a simplified model: it assumes steady demand, instant delivery and no shortages.

### Example 3

A bike shop sells 4800 inner tubes a year. Each order costs \$75 to place, and holding a tube for a year costs \$2. Find the best order size and the yearly cost.

$Q^* = \sqrt{\frac{2(75)(4800)}{2}} = \sqrt{360{,}000} = 600$ tubes, so $\frac{4800}{600} = 8$ orders a year. Ordering cost $\frac{75\cdot4800}{600} = 600$ dollars; holding cost $\frac{2\cdot600}{2} = 600$ dollars; total **1200 dollars a year**.

```plot
{"x": [0, 1600], "y": [0, 3000], "xLabel": "order size Q", "yLabel": "dollars per year", "functions": [{"f": "360000/x + x", "from": 120, "label": "total C(Q)"}, {"f": "360000/x", "from": 120, "dashed": true}, {"f": "x", "dashed": true}], "points": [{"at": [600, 1200], "label": "Q* = 600"}], "labels": [{"at": [1250, 520], "text": "ordering cost"}, {"at": [1430, 1150], "text": "holding cost"}], "caption": "Ordering cost falls and holding cost rises with Q; their sum is lowest where they are equal"}
```

Two practical lessons hide in the formula. First, the square root damps change: if demand doubles, $Q^*$ grows by a factor of only $\sqrt2 \approx 1.41$. Second, the cost curve is very flat near its bottom. Substituting $Q = kQ^*$ gives $\frac{C(kQ^*)}{C(Q^*)} = \frac12\left(k + \frac1k\right)$, so ordering 20% too many ($k = 1.2$) costs only about 1.7% extra. Rough estimates of $K$ and $h$ still give nearly the best cost.

## The longest ladder around a corner

A hallway 4 ft wide meets a hallway 6 ft wide at a right angle. What is the longest ladder that can be carried horizontally around the corner?

The key idea is to flip the question. As the ladder turns the corner, at some moment it touches the inside corner with its ends against the two outer walls. A ladder fits only if it is no longer than *every* such segment. So the longest ladder that fits equals the *shortest* segment that touches the inner corner and reaches both outer walls: a maximum problem becomes a minimum problem.

```shape
{"segments": [{"from": [0, 0], "to": [13, 0]}, {"from": [0, 0], "to": [0, 12]}, {"from": [6, 12], "to": [6, 4]}, {"from": [6, 4], "to": [13, 4]}, {"from": [0, 9.2415], "to": [10.5789, 0], "label": "L"}, {"from": [12, 0], "to": [12, 4], "dashed": true, "label": "4"}, {"from": [0, 11], "to": [6, 11], "dashed": true, "label": "6"}], "points": [{"at": [6, 4]}], "labels": [{"at": [7.3, 4.6], "text": "inner corner"}, {"at": [9.2, 0.45], "text": "θ"}], "caption": "A segment touching the inner corner, at angle θ to the 4-ft hallway's walls"}
```

Let $\theta$ be the angle between the segment and the walls of the 4-ft hallway, $0 < \theta < \frac{\pi}{2}$. The part crossing the 4-ft hallway has length $\frac{4}{\sin\theta}$, and the part crossing the 6-ft hallway has length $\frac{6}{\cos\theta}$:

$$L(\theta) = \frac{4}{\sin\theta} + \frac{6}{\cos\theta}.$$

$L'(\theta) = -\frac{4\cos\theta}{\sin^2\theta} + \frac{6\sin\theta}{\cos^2\theta} = 0$ gives $6\sin^3\theta = 4\cos^3\theta$, so $\tan^3\theta = \frac46$ and $\tan\theta = \sqrt[3]{2/3} \approx 0.874$, $\theta \approx 41.1°$. Since $L \to \infty$ at both ends of the open interval and this is the only critical number, it is the absolute minimum (Lesson 20). Then $L \approx \frac{4}{\sin 41.1°} + \frac{6}{\cos 41.1°} \approx 14.05$ ft.

In general, with widths $a$ and $b$, the same steps give $\tan\theta = \sqrt[3]{a/b}$ and a minimum length of

$$L_{\min} = \left(a^{2/3} + b^{2/3}\right)^{3/2}.$$

Check: $(4^{2/3} + 6^{2/3})^{3/2} \approx (2.520 + 3.302)^{3/2} \approx 14.05$. (Simplified: a real ladder has thickness and could be tilted, which lets a slightly longer one through.)

### Example 4

Two hallways, 8 ft and 27 ft wide, meet at a right angle. The formula gives $L_{\min} = (8^{2/3} + 27^{2/3})^{3/2} = (4 + 9)^{3/2} = 13\sqrt{13} \approx 46.9$ ft, with $\tan\theta = \sqrt[3]{8/27} = \frac23$ measured from the walls of the 8-ft hallway.

## Common mistakes

- *Measuring angles from the surface instead of the normal.* Snell's law uses angles from the normal; from the surface you'd get cosines.
- *Assuming the straight line is fastest.* Straight is shortest, not quickest, when speeds differ.
- *Counting the whole order as stock.* Average inventory is $\frac{Q}{2}$, not $Q$.
- *Answering the ladder problem with a maximum of $L$.* $L(\theta)$ has no maximum (it blows up at the ends); the longest ladder is the minimum of $L$.
- *Forgetting the model's assumptions.* Each answer is only as good as its simplifications: flat shoreline, steady demand, a ladder with no thickness.

## Key points

- Lifeguard / refraction: minimizing travel time gives $\frac{\sin\theta_1}{v_1} = \frac{\sin\theta_2}{v_2}$, angles from the normal.
- Fermat's principle (least time) gives Snell's law $n_1\sin\theta_1 = n_2\sin\theta_2$ with $n = \frac{c}{v}$.
- Inventory: $C(Q) = \frac{KD}{Q} + \frac{hQ}{2}$ is minimized at $Q^* = \sqrt{2KD/h}$, where ordering and holding costs are equal; the cost is flat near $Q^*$.
- Longest ladder around a corner = shortest segment through the inner corner: $\left(a^{2/3} + b^{2/3}\right)^{3/2}$.
- With letters kept as letters, the condition $f' = 0$ becomes a general law.

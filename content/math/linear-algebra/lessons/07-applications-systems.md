---
id: la-applications-systems
module: la-m2
title: 'Applications: networks, chemistry and curve fitting'
minutes: 30
topics: [Applications of linear systems]
drills: [la-network, la-chem, la-interp]
---
## Why so many problems are linear

You now have a complete method for any linear system: write the augmented matrix,
row-reduce, read off the general solution. This lesson shows where such systems come from.
The common thread is a *conservation* or *matching* rule: what flows in equals what flows
out, atoms on the left equal atoms on the right, a curve must pass through given points.
Each rule is linear in the unknowns, so one row reduction handles the whole problem.
Pay attention to the final step in each example: interpreting the general solution in
context (nonnegative flows, whole-number coefficients).

## Network flow

A **network** is a set of points called **nodes** (or junctions) joined by branches that
carry a flow: cars on streets, water in pipes, current in wires. The basic rule is
**flow conservation**: at each node, the total flow in equals the total flow out. Writing
that rule at every node gives one linear equation per node.

### Example 1

Four one-way streets form a loop around a city block, with intersections $A$, $B$, $C$, $D$.
Unknown flows (cars per hour) are $x_1$ on $A \to B$, $x_2$ on $B \to C$, $x_3$ on $C \to D$,
$x_4$ on $D \to A$. Outside streets bring 400 cars into $A$; 200 into and 300 out of $B$; 100
into and 500 out of $C$; 300 into and 200 out of $D$.

```shape
{"polygons": [{"points": [[0, 0], [4, 0], [4, 4], [0, 4]]}], "segments": [{"from": [0, 4], "to": [4, 4], "arrow": true, "label": "x₁"}, {"from": [4, 4], "to": [4, 0], "arrow": true, "label": "x₂"}, {"from": [4, 0], "to": [0, 0], "arrow": true, "label": "x₃"}, {"from": [0, 0], "to": [0, 4], "arrow": true, "label": "x₄"}, {"from": [-1.5, 5], "to": [0, 4], "arrow": true, "label": "400"}, {"from": [5.5, 5], "to": [4, 4], "arrow": true, "label": "200"}, {"from": [4, 4], "to": [4, 5.5], "arrow": true, "label": "300"}, {"from": [5.5, -1], "to": [4, 0], "arrow": true, "label": "100"}, {"from": [4, 0], "to": [4, -1.5], "arrow": true, "label": "500"}, {"from": [-1.5, -1], "to": [0, 0], "arrow": true, "label": "300"}, {"from": [0, 0], "to": [-1.5, 0], "arrow": true, "label": "200"}], "labels": [{"at": [-0.4, 4.3], "text": "A"}, {"at": [4.4, 4.3], "text": "B"}, {"at": [4.4, -0.3], "text": "C"}, {"at": [-0.4, -0.3], "text": "D"}], "caption": "Traffic around a block: flow in = flow out at each intersection"}
```

1. Conservation at each node (in = out):
   - $A$: $400 + x_4 = x_1$
   - $B$: $x_1 + 200 = x_2 + 300$
   - $C$: $x_2 + 100 = x_3 + 500$
   - $D$: $x_3 + 300 = x_4 + 200$
2. Rearranged: $x_1 - x_4 = 400$, $x_1 - x_2 = 100$, $x_2 - x_3 = 400$, $x_3 - x_4 = -100$.
3. Row-reducing the augmented matrix leaves one zero row (the four equations are dependent, because the total flow into the network equals the total flow out) and $x_4$ free:
$$x_1 = 400 + x_4, \quad x_2 = 300 + x_4, \quad x_3 = -100 + x_4, \quad x_4 \text{ free}.$$
4. Interpret: flows on one-way streets can't be negative, so $x_3 \ge 0$ forces $x_4 \ge 100$. The smallest possible flow on $D \to A$ is 100 cars per hour, and then $x_1 = 500$, $x_2 = 400$, $x_3 = 0$.

The free variable is real information: traffic can circle the block any number of times
without changing what enters or leaves, so the outside counts can't pin down $x_4$.

## Balancing chemical equations

A chemical equation is **balanced** when each element has the same number of atoms on both
sides. Put an unknown coefficient on each compound and count each element.

### Example 2

Balance the combustion of propane: $x_1\,\text{C}_3\text{H}_8 + x_2\,\text{O}_2 \to x_3\,\text{CO}_2 + x_4\,\text{H}_2\text{O}$.

1. Record each compound as a vector of (carbon, hydrogen, oxygen) counts:
$$\text{C}_3\text{H}_8: \begin{bmatrix} 3 \\ 8 \\ 0\end{bmatrix},\quad \text{O}_2: \begin{bmatrix} 0 \\ 0 \\ 2\end{bmatrix},\quad \text{CO}_2: \begin{bmatrix} 1 \\ 0 \\ 2\end{bmatrix},\quad \text{H}_2\text{O}: \begin{bmatrix} 0 \\ 2 \\ 1\end{bmatrix}.$$
2. Balance means $x_1\begin{bmatrix} 3 \\ 8 \\ 0\end{bmatrix} + x_2\begin{bmatrix} 0 \\ 0 \\ 2\end{bmatrix} - x_3\begin{bmatrix} 1 \\ 0 \\ 2\end{bmatrix} - x_4\begin{bmatrix} 0 \\ 2 \\ 1\end{bmatrix} = \mathbf{0}$: three homogeneous equations in four unknowns.
3. Row-reduce $\begin{bmatrix} 3 & 0 & -1 & 0 \\ 8 & 0 & 0 & -2 \\ 0 & 2 & -2 & -1\end{bmatrix}$. The RREF is $\begin{bmatrix} 1 & 0 & 0 & -1/4 \\ 0 & 1 & 0 & -5/4 \\ 0 & 0 & 1 & -3/4\end{bmatrix}$, so $x_1 = \tfrac14 x_4$, $x_2 = \tfrac54 x_4$, $x_3 = \tfrac34 x_4$, with $x_4$ free.
4. Chemists want the smallest whole numbers, so take $x_4 = 4$: $x_1 = 1$, $x_2 = 5$, $x_3 = 3$.

$$\text{C}_3\text{H}_8 + 5\,\text{O}_2 \to 3\,\text{CO}_2 + 4\,\text{H}_2\text{O}.$$

Check: carbon $3 = 3$, hydrogen $8 = 8$, oxygen $10 = 6 + 4$. ✓ There's always a free
variable here, since doubling every coefficient keeps an equation balanced.

## Polynomial interpolation

Given $n$ points with different $x$-values, there is exactly one polynomial of degree at most
$n - 1$ through them, the **interpolating polynomial**. Its coefficients solve a linear
system: the unknowns are the coefficients, and each point gives one equation.

### Example 3

Find the parabola $y = a_0 + a_1x + a_2x^2$ through $(1, 4)$, $(2, 3)$ and $(3, 6)$.

1. Each point gives an equation: $a_0 + a_1 + a_2 = 4$, $a_0 + 2a_1 + 4a_2 = 3$, $a_0 + 3a_1 + 9a_2 = 6$.
2. Subtract the first from the second and third: $a_1 + 3a_2 = -1$ and $2a_1 + 8a_2 = 2$, i.e. $a_1 + 4a_2 = 1$.
3. Subtract: $a_2 = 2$. Then $a_1 = -1 - 6 = -7$ and $a_0 = 4 + 7 - 2 = 9$.
4. The parabola is $y = 9 - 7x + 2x^2$. Check $(2, 3)$: $9 - 14 + 8 = 3$. ✓

```plot
{"x": [0, 4], "y": [0, 10], "functions": [{"f": "9 - 7x + 2x^2", "label": "y = 9 - 7x + 2x²"}], "points": [{"at": [1, 4], "label": "(1, 4)"}, {"at": [2, 3], "label": "(2, 3)"}, {"at": [3, 6], "label": "(3, 6)"}], "caption": "The unique parabola through three points"}
```

The coefficient matrix here, with rows $(1, x_i, x_i^2)$, is called a **Vandermonde matrix**; it always has a pivot in every column when the $x_i$ are different, which is why
the interpolating polynomial is unique.

## Common mistakes

- *Sign conventions in networks.* Write every node equation as "in = out" before rearranging, or you'll mix up signs.
- *Forgetting physical constraints.* Negative traffic flow or a negative number of molecules is not allowed; use the constraints to narrow the free variable.
- *Moving products to the other side inconsistently.* In chemistry, products get a minus sign when everything is moved to one side.
- *Fractional coefficients in a final chemical equation.* Scale by the least common denominator.
- *Wrong row for each point in interpolation.* Each point $(x_i, y_i)$ gives $a_0 + a_1x_i + a_2x_i^2 = y_i$.

## Key points

- Flow conservation at each node of a network gives one linear equation per node.
- Balancing a reaction is a homogeneous system; choose the free variable to make all coefficients small whole numbers.
- $n$ points with distinct $x$-values determine a unique polynomial of degree at most $n - 1$, found by solving for its coefficients.
- Free variables in applications often have a real meaning; physical constraints limit their range.

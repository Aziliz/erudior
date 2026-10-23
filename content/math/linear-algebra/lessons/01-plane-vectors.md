---
id: la-plane-vectors
module: la-m1
title: Vectors in the plane
minutes: 25
topics: [Plane vectors]
drills: [la-vec-comb, la-vec-mag]
refs: [la-ref-row]
---
## Where linear algebra starts

Linear algebra is the mathematics of things you can *add* and *scale*. The first and
most concrete example is the arrow you met in physics or precalculus: a quantity with a
size and a direction, like a displacement of 3 blocks east and 4 blocks north. This lesson
reviews those arrows carefully, because every idea later in the course (linear
combinations, span, transformations, eigenvectors) is first pictured with them.

## Vectors and components

A **vector** in the plane is an ordered pair of numbers written as a column,

$$\mathbf{v} = \begin{bmatrix} 3 \\ 4 \end{bmatrix},$$

or in a row as $\langle 3, 4\rangle$. The numbers 3 and 4 are its **components**. We draw
$\mathbf{v}$ as an arrow that moves 3 units right and 4 units up. Where the arrow starts
doesn't matter: an arrow from $(1, 1)$ to $(4, 5)$ is the same vector as one from the
origin to $(3, 4)$, because it describes the same movement. When the tail is at the
origin, the head lands on the point $(3, 4)$, and we call it the **position vector** of
that point. That is why linear algebra freely identifies the point $(3, 4)$ with the
vector $\begin{bmatrix} 3 \\ 4\end{bmatrix}$.

The picture names the parts of an arrow. The components are the horizontal and vertical
legs of a right triangle, the arrow itself is the hypotenuse, and the angle $\theta$ is measured
from the positive $x$-direction.

![An arrow from a tail point to a head point, 4 units right and 3 units up. A dashed horizontal leg is labeled horizontal component v1 = 4, a dashed vertical leg is labeled vertical component v2 = 3, the arrow is labeled length 5, and the angle theta at the tail is marked.](images/la-m1-vector-parts.svg)

To find the vector from point $P = (p_1, p_2)$ to point $Q = (q_1, q_2)$, subtract tail
from head: $\overrightarrow{PQ} = \begin{bmatrix} q_1 - p_1 \\ q_2 - p_2 \end{bmatrix}$.

The set of all such vectors is written $\mathbb{R}^2$ ("R-two"): ordered pairs of real
numbers. The vector with both components zero is the **zero vector** $\mathbf{0}$; it
has no direction and length 0.

## Adding vectors

**Vector addition** is done component by component:

$$\begin{bmatrix} u_1 \\ u_2 \end{bmatrix} + \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} u_1 + v_1 \\ u_2 + v_2 \end{bmatrix}.$$

Why this rule? If $\mathbf{u}$ is the trip "3 right, 1 up" and $\mathbf{v}$ is "1 right,
2 up", doing one trip after the other moves you 4 right and 3 up. Geometrically, put the
tail of $\mathbf{v}$ at the head of $\mathbf{u}$ (tip-to-tail); the sum runs from the
start of $\mathbf{u}$ to the end of $\mathbf{v}$. Equivalently, draw both from the
origin and complete the parallelogram: the sum is its diagonal. This is the
**parallelogram rule**.

```plot
{"x": [-1, 5], "y": [-1, 4], "equal": true, "segments": [{"from": [0, 0], "to": [3, 1], "arrow": true, "label": "u"}, {"from": [0, 0], "to": [1, 2], "arrow": true, "label": "v"}, {"from": [3, 1], "to": [4, 3], "arrow": true, "dashed": true}, {"from": [1, 2], "to": [4, 3], "arrow": true, "dashed": true}, {"from": [0, 0], "to": [4, 3], "arrow": true, "label": "u + v"}], "caption": "The parallelogram rule: u + v is the diagonal"}
```

Because ordinary addition of numbers is commutative and associative, so is vector
addition: $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$, and grouping doesn't
matter. Subtraction works the same way: $\mathbf{u} - \mathbf{v}$ subtracts components,
and geometrically it is the arrow from the head of $\mathbf{v}$ to the head of
$\mathbf{u}$.

## Scaling vectors

A **scalar** is just a real number. **Scalar multiplication** multiplies every
component: $c\begin{bmatrix} v_1 \\ v_2\end{bmatrix} = \begin{bmatrix} cv_1 \\ cv_2\end{bmatrix}$.
Geometrically, $c\mathbf{v}$ points the same way as $\mathbf{v}$ when $c > 0$, the
opposite way when $c < 0$, and its length is $|c|$ times as long. So $2\mathbf{v}$ is
twice as long, $-\mathbf{v}$ is flipped, and $0\mathbf{v} = \mathbf{0}$.

The plot draws several multiples of $\mathbf{v} = \begin{bmatrix} 2 \\ 1\end{bmatrix}$ with their
tails in different places (position doesn't matter): all of them are parallel to $\mathbf{v}$.

```plot
{"x": [-1, 7], "y": [-3, 4], "equal": true, "segments": [{"from": [0, 0], "to": [2, 1], "arrow": true, "label": "v"}, {"from": [0, -2], "to": [4, 0], "arrow": true, "label": "2v"}, {"from": [4, 3], "to": [2, 2], "arrow": true, "label": "−v"}, {"from": [5, -1], "to": [6, -0.5], "arrow": true, "label": "0.5v"}], "caption": "Multiples of v = (2, 1): all parallel to v; −v points the opposite way"}
```

Put the two operations together and you get the central object of the whole course, a
combination like $2\mathbf{u} - 3\mathbf{v}$: scale some vectors, then add. (In Module 3
this will be called a linear combination.)

## Length and direction

The **magnitude** (or length, or norm) of $\mathbf{v}$ is written $\|\mathbf{v}\|$.
The components are the legs of a right triangle and the arrow is its hypotenuse, so by
the Pythagorean theorem

$$\|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2}.$$

For $\mathbf{v} = \begin{bmatrix} 3 \\ 4\end{bmatrix}$, $\|\mathbf{v}\| = \sqrt{9 + 16} = 5$.
Scaling a vector scales its length: $\|c\mathbf{v}\| = |c|\,\|\mathbf{v}\|$, because
$\sqrt{(cv_1)^2 + (cv_2)^2} = |c|\sqrt{v_1^2 + v_2^2}$.

A **unit vector** has length 1. To get the unit vector pointing the same way as a nonzero
$\mathbf{v}$, divide by its length: $\mathbf{u} = \dfrac{1}{\|\mathbf{v}\|}\mathbf{v}$.
For $\begin{bmatrix} 3 \\ 4\end{bmatrix}$ that is $\begin{bmatrix} 3/5 \\ 4/5\end{bmatrix}$.
Two unit vectors deserve names, the **standard basis vectors**

$$\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0\end{bmatrix}, \qquad \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1\end{bmatrix}$$

(often written $\mathbf{i}$ and $\mathbf{j}$ in physics). Every vector is a combination of
them: $\begin{bmatrix} a \\ b\end{bmatrix} = a\mathbf{e}_1 + b\mathbf{e}_2$. This simple
fact is the seed of the idea of a basis.

A vector can also be described by its length $r$ and the angle $\theta$ it makes with the
positive $x$-axis: $\mathbf{v} = \begin{bmatrix} r\cos\theta \\ r\sin\theta\end{bmatrix}$.

### Example 1

Let $\mathbf{u} = \begin{bmatrix} 2 \\ -1\end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} -1 \\ 3\end{bmatrix}$.
Find $3\mathbf{u} + 2\mathbf{v}$ and its length.

1. Scale first: $3\mathbf{u} = \begin{bmatrix} 6 \\ -3\end{bmatrix}$ and $2\mathbf{v} = \begin{bmatrix} -2 \\ 6\end{bmatrix}$.
2. Add components: $\begin{bmatrix} 6 + (-2) \\ -3 + 6\end{bmatrix} = \begin{bmatrix} 4 \\ 3\end{bmatrix}$.
3. Length: $\sqrt{4^2 + 3^2} = \sqrt{25} = 5$.

```plot
{"x": [-3, 7], "y": [-4, 7], "equal": true, "segments": [{"from": [0, 0], "to": [6, -3], "arrow": true, "label": "3u"}, {"from": [6, -3], "to": [4, 3], "arrow": true, "label": "2v"}, {"from": [0, 0], "to": [4, 3], "arrow": true, "label": "3u + 2v"}], "caption": "Tip-to-tail: 3u followed by 2v ends at (4, 3)"}
```

### Example 2

A drone flies from $P = (1, 5)$ to $Q = (7, -3)$. Find the displacement vector, the
distance flown, and the unit vector in the direction of travel.

1. Head minus tail: $\overrightarrow{PQ} = \begin{bmatrix} 7 - 1 \\ -3 - 5\end{bmatrix} = \begin{bmatrix} 6 \\ -8\end{bmatrix}$.
2. Distance is the length: $\sqrt{36 + 64} = \sqrt{100} = 10$.
3. Unit vector: divide by 10 to get $\begin{bmatrix} 0.6 \\ -0.8\end{bmatrix}$. Check: $0.36 + 0.64 = 1$.

## Common mistakes

- *Tail minus head.* $\overrightarrow{PQ}$ is $Q - P$, not $P - Q$; the reverse gives the
  opposite vector.
- *Adding lengths.* $\|\mathbf{u} + \mathbf{v}\|$ is usually *not*
  $\|\mathbf{u}\| + \|\mathbf{v}\|$. In Example 1, $\|3\mathbf{u}\| = \sqrt{45}$ and
  $\|2\mathbf{v}\| = \sqrt{40}$, but the sum has length 5. (The triangle inequality says
  $\|\mathbf{u}+\mathbf{v}\| \le \|\mathbf{u}\| + \|\mathbf{v}\|$.)
- *Forgetting to square negatives.* $\|\langle -3, 4\rangle\| = \sqrt{9 + 16}$, not $\sqrt{-9 + 16}$.
- *Scaling only one component.* $2\langle 1, 5\rangle = \langle 2, 10\rangle$, not $\langle 2, 5\rangle$.

## Key points

- A vector in $\mathbb{R}^2$ is an ordered pair, drawn as an arrow; position doesn't matter, only the movement.
- Add and scale component by component; addition is tip-to-tail or the parallelogram diagonal.
- $\|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2}$ and $\|c\mathbf{v}\| = |c|\,\|\mathbf{v}\|$.
- Divide a nonzero vector by its length to get a unit vector.
- Every vector is $a\mathbf{e}_1 + b\mathbf{e}_2$: the first hint of bases and coordinates.

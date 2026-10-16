---
id: trig-verifying
module: trig-m6
title: Verifying identities
minutes: 40
topics: [Verifying identities]
drills: [trig-d-simplify-2]
refs: [trig-ref-identities]
---
## Proving, not solving

To **verify** an identity is to show that two expressions are equal for every allowed
input. It's a short proof, and it builds the skill that the rest of this module depends
on: seeing which identity turns one form into another. Unlike solving an equation, you are
not looking for $x$. You transform one side, step by step, using known identities and
algebra, until it becomes the other side.

## The ground rule

Work on one side at a time, and don't move terms across the equals sign. If you start
with $A = B$ and square both sides or multiply both sides by something, you are assuming
what you want to prove, and the argument can "verify" false statements. For example,
$-1 = 1$ becomes $1 = 1$ after squaring. Keep the two sides separate: transform the left
side into the right side, or the right side into the left side, or (a valid variant)
transform each side separately into the *same* third expression.

## Strategies

1. **Start with the more complicated side.** There's more to simplify.
2. **Rewrite in sines and cosines** when stuck. It always works eventually, though not
   always fastest.
3. **Look for Pythagorean patterns**: $1 - \cos^2 x$, $\sec^2 x - 1$, and so on.
4. **Combine fractions** over a common denominator, or **split** one fraction into two.
5. **Factor** (common factors, difference of squares, trinomials).
6. **Multiply by a conjugate.** For a denominator like $1 - \sin x$, multiply top and bottom
   by its **conjugate** $1 + \sin x$; the denominator becomes $1 - \sin^2 x = \cos^2 x$.
7. **Keep an eye on the target.** If the other side has only $\tan$ and $\sec$, steer that way.

### Example 1

Verify $\sec x - \cos x = \sin x\tan x$.

Start with the left side and rewrite in sines and cosines:
$$\sec x - \cos x = \frac{1}{\cos x} - \cos x = \frac{1 - \cos^2 x}{\cos x} = \frac{\sin^2 x}{\cos x} = \sin x\cdot\frac{\sin x}{\cos x} = \sin x\tan x. \;\checkmark$$

Each step uses one fact: reciprocal identity, common denominator, Pythagorean identity,
splitting off a factor, quotient identity.

### Example 2

Verify $\dfrac{\cos x}{1 - \sin x} = \dfrac{1 + \sin x}{\cos x}$.

Multiply the left side's top and bottom by the conjugate $1 + \sin x$:
$$\frac{\cos x}{1 - \sin x}\cdot\frac{1 + \sin x}{1 + \sin x} = \frac{\cos x(1 + \sin x)}{1 - \sin^2 x} = \frac{\cos x(1 + \sin x)}{\cos^2 x} = \frac{1 + \sin x}{\cos x}. \;\checkmark$$

Multiplying by $\tfrac{1 + \sin x}{1 + \sin x}$ is multiplying by 1, which is allowed on one side.

### Example 3

Verify $(1 + \cot^2 x)(1 - \cos^2 x) = 1$.

Both factors are Pythagorean patterns:
$$(1 + \cot^2 x)(1 - \cos^2 x) = \csc^2 x\cdot\sin^2 x = \frac{1}{\sin^2 x}\cdot\sin^2 x = 1. \;\checkmark$$

### Example 4

Verify $\dfrac{\sin x}{1 + \cos x} + \dfrac{1 + \cos x}{\sin x} = 2\csc x$.

Combine the left side over the common denominator $\sin x(1 + \cos x)$:
$$\frac{\sin^2 x + (1 + \cos x)^2}{\sin x(1 + \cos x)} = \frac{\sin^2 x + 1 + 2\cos x + \cos^2 x}{\sin x(1 + \cos x)}.$$
Since $\sin^2 x + \cos^2 x = 1$, the numerator is $2 + 2\cos x = 2(1 + \cos x)$:
$$\frac{2(1 + \cos x)}{\sin x(1 + \cos x)} = \frac{2}{\sin x} = 2\csc x. \;\checkmark$$

### Example 5: factoring a Pythagorean pattern

Verify $\dfrac{\tan^2 x}{\sec x + 1} = \sec x - 1$.

The left side has the pattern $\tan^2 x = \sec^2 x - 1$, which factors:
$$\frac{\sec^2 x - 1}{\sec x + 1} = \frac{(\sec x - 1)(\sec x + 1)}{\sec x + 1} = \sec x - 1. \;\checkmark$$

Not every identity needs both sides; here one side did all the work. If both sides look
messy, simplify each to a common form and stop when they match.

## Spotting a non-identity

To show an equation is *not* an identity, one counterexample is enough. Is
$\sin x + \cos x = 1$ an identity? At $x = \tfrac{\pi}{4}$, the left side is $\tfrac{\sqrt2}{2} + \tfrac{\sqrt2}{2} = \sqrt2 \ne 1$. Not an
identity. (It is true at $x = 0$, which shows why checking one value can't *prove* an
identity.)

```plot
{"x": [-3.2, 3.2], "y": [-2.5, 2.5], "functions": [{"f": "1/cos(x) - cos(x)", "label": "sec x − cos x"}, {"f": "sin(x)tan(x)", "dashed": true, "label": "sin x tan x"}], "caption": "The two sides of Example 1 have identical graphs"}
```

Graphing both sides is another good check: an identity gives the same graph.

### Example 6

Verify $\csc x - \sin x = \cos x\cot x$.

Left side, common denominator:
$$\csc x - \sin x = \frac{1}{\sin x} - \sin x = \frac{1 - \sin^2 x}{\sin x} = \frac{\cos^2 x}{\sin x} = \cos x\cdot\frac{\cos x}{\sin x} = \cos x\cot x. \;\checkmark$$
Notice how closely this mirrors Example 1: the same three moves (reciprocal identity,
common denominator, Pythagorean identity) solve many textbook identities.

## Common mistakes

- **Doing the same thing to both sides** (cross-multiplying, squaring, adding a term). That
  treats the identity as already true.
- **Skipping the reason for a step.** Each step should follow from a named identity or a
  rule of algebra.
- **Algebra slips with fractions**: $\tfrac{1}{\sin x + \cos x} \ne \tfrac{1}{\sin x} + \tfrac{1}{\cos x}$.
- **Expanding $(1 + \cos x)^2$ as $1 + \cos^2 x$.** It's $1 + 2\cos x + \cos^2 x$.

## Key points

- Transform one side into the other; never operate on both sides at once.
- Start with the complicated side; convert to $\sin$ and $\cos$ if stuck.
- Use Pythagorean substitutions, common denominators, factoring and conjugates.
- One counterexample disproves an identity; matching at a few points proves nothing.

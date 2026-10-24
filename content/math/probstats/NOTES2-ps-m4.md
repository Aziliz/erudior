# Round 2 notes: ps-m4 (Joint distributions)

`content/math/check-module.sh probstats ps-m4`: OK, zero problems (8 lessons, 134 questions, 24 drills).

## Honors lessons (new)

| File | id | Title | Words |
|---|---|---|---|
| lessons/20h1-covariance-matrices-multivariate-normal.md | ps-m4-h-multivariate-normal | Covariance matrices and the multivariate normal distribution | ~1,950 |
| lessons/20h2-ranges-and-spacings.md | ps-m4-h-ranges-spacings | Joint order statistics: ranges and spacings | ~1,550 |

- 20h1: random vectors, mean vector, covariance matrix, $\operatorname{Cov}(A\mathbf X + \mathbf b) = A\Sigma A^\top$ (derived), positive
  semidefiniteness and impossible correlation sets (incl. the bound $\rho \ge -1/(n-1)$), $N_n(\boldsymbol\mu, \Sigma)$ built as $\boldsymbol\mu + A\mathbf Z$,
  density derived by change of variables, properties (linear maps, marginals, uncorrelated means independent,
  conditional formula *stated without proof* and reduced to lesson 20), Cholesky factor (2×2 by hand), Mahalanobis
  distance and $Q \sim \chi^2_n$. 4 worked examples, Mermaid diagram, plot of Q = 1, 4, 9 ellipses. Topics: Covariance matrices; Multivariate normal.
- 20h2: joint density of all order statistics ($n!$ argument), of two order statistics, min/max via one event,
  range of a uniform sample (Beta(n−1, 2), derived), Rényi representation of exponential spacings (memoryless and
  Jacobian proofs), mean/variance of $X_{(k)}$, k-out-of-n systems, exponential range = max of $n-1$. 4 worked
  examples, SVG picture. Topic: Ranges and spacings.

## Core lessons (additions only)

| Lesson | Added |
|---|---|
| 15 | Mermaid "five steps for a continuous probability"; SVG ps-m4-joint-region (support, x + y = 1, event, strip) |
| 16 | Mermaid decision chart "are X and Y independent?" |
| 17 | SVG ps-m4-cov-quadrants (signs of products of deviations) with an introducing paragraph |
| 18 | Plot: the line x + y = z in the unit square (why the uniform sum is triangular); Mermaid "which method for a sum" |
| 19 | Mermaid within/between split (supplier example); plot of the mixture density 0.7 A + 0.3 B (normal shapes assumed, labeled) |
| 20 | SVG ps-m4-bvn-lines (ellipse, SD line, both regression lines) with a paragraph; Mermaid series vs parallel |

## Questions (`questions/r2-ps-m4.yaml`, 58)

- Core ps-m4-r2-q01–q30, 5 per lesson, 2 `module_quiz` per lesson (12 total).
- Honors ps-m4-r2-h01–h14 (20h1) and h15–h28 (20h2).
- By type: text 15, multiple choice 15, select-all 9, match 8, order 7, label 4. MC answer positions 4/4/4/3.
- Label questions use the `-blank.svg` copies (joint-region, cov-quadrants, bvn-lines, h-spacings); markers checked on previews.

## Drills (`drills/r2-ps-m4.yaml`, 6, all linked from the honors lessons)

ps-m4-r2-quadform, -cholesky, -mahalanobis (20h1); -uniform-range, -exp-order-mean, -exp-range (20h2).
Each generated 500 times; every target matched an independent Python computation (numpy quadratic forms/eigenvalue
PD check, numpy Cholesky, scipy chi2 and beta cdfs, direct sums); every displayed answer accepted; shown inputs equal
the values used; rounding routes checked (Q to 2 dp, sums to 4 dp stay within tolerance). Monte Carlo spot checks of
the Rényi mean/SD and the exponential-range formula agreed.

## Glossary and cards

- `glossary-r2-ps-m4.yaml` (12): random vector, mean vector, covariance matrix, correlation matrix, positive
  semidefinite, multivariate normal distribution, Cholesky factorization, Mahalanobis distance, sample range,
  spacings, Rényi representation, k-out-of-n system. No clashes with glossary-a/b/c/d or r2-ps-m1/m2/m3 at time of
  writing ("series system"/"parallel system" exist elsewhere and are not bolded by me).
- `cards-r2-ps-m4.yaml` (20): 12 for 20h1, 8 for 20h2.

## For a reviewer

- 20h1 states the multivariate normal conditional formula and "every symmetric PSD matrix is a covariance matrix"
  without full proof (labeled). The n-variable change of variables is used as a direct extension of lesson 18's 2-variable Jacobian.
- 20h1 Example 4: the point (85, 60) has Q ≈ 9.47, only just outside the Q = 9 ellipse; the text says "just outside".
- Possible overlap to watch: if the ps-h1 or ps-m8 honors writers introduce covariance matrices for multiple
  regression, they can link to these glossary terms instead of redefining them.
- Pictures are original SVGs; plots rendered with the app CSS and inspected.

## Errors found in existing content

None.

## Sources

Standard results (Casella & Berger-level material: covariance of linear maps, multivariate normal density,
Cholesky, Mahalanobis/chi-square, order-statistic densities, Rényi 1953 representation of exponential spacings),
all re-derived in the lessons; every number recomputed in Python.

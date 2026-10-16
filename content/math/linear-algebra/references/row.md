---
id: la-ref-row
title: Row reduction, solutions and subspaces
---
## Row reduction

| Item | Rule |
|---|---|
| Row operations | replacement $R_i \leftarrow R_i + cR_j$; interchange $R_i \leftrightarrow R_j$; scaling $R_i \leftarrow cR_i$ ($c \ne 0$) |
| Echelon form | zero rows at bottom; leading entries step right; zeros below them |
| RREF | echelon + leading 1s + zeros above and below each leading 1 (unique) |
| Forward phase | clear below each pivot, left to right (Gaussian elimination) |
| Backward phase | clear above each pivot, right to left; scale pivots to 1 (Gauss–Jordan) |
| Max pivots | $\min(m, n)$ for an $m \times n$ matrix |

## Solutions of $A\mathbf{x} = \mathbf{b}$

| Question | Answer |
|---|---|
| Consistent? | yes ⟺ last column of $[\,A \;\; \mathbf{b}\,]$ is not a pivot column |
| Unique (if consistent)? | yes ⟺ no free variables |
| Solvable for every $\mathbf{b}$? | ⟺ pivot in every row of $A$ |
| Nontrivial solution of $A\mathbf{x} = \mathbf{0}$? | ⟺ at least one free variable |
| Structure | all solutions $= \mathbf{p} + (\text{solutions of } A\mathbf{x} = \mathbf{0})$ |
| Parametric vector form | $\mathbf{x} = \mathbf{p} + s\mathbf{u} + t\mathbf{v} + \cdots$ (one vector per free variable) |

## Span and independence

| Question | Test |
|---|---|
| Is $\mathbf{b}$ in $\operatorname{Span}\{\mathbf{a}_1, \dots, \mathbf{a}_n\}$? | $[\,\mathbf{a}_1 \cdots \mathbf{a}_n \;\; \mathbf{b}\,]$ consistent |
| Do $\mathbf{a}_1, \dots, \mathbf{a}_n$ span $\mathbb{R}^m$? | pivot in every row |
| Are $\mathbf{v}_1, \dots, \mathbf{v}_p$ independent? | pivot in every column of $[\,\mathbf{v}_1 \cdots \mathbf{v}_p\,]$ |
| Automatic dependence | $\mathbf{0}$ in the set, or $p > n$ vectors in $\mathbb{R}^n$ |

## Subspaces of an $m \times n$ matrix

| Subspace | Lives in | Basis | Dimension |
|---|---|---|---|
| $\operatorname{Col} A$ | $\mathbb{R}^m$ | pivot columns **of $A$** | rank $A$ |
| $\operatorname{Row} A$ | $\mathbb{R}^n$ | nonzero rows of an echelon form | rank $A$ |
| $\operatorname{Nul} A$ | $\mathbb{R}^n$ | vectors from the parametric form of $A\mathbf{x} = \mathbf{0}$ | number of free variables |
| $\operatorname{Nul} A^T$ | $\mathbb{R}^m$ | same method on $A^T$ | $m - \operatorname{rank} A$ |

**Rank theorem:** $\operatorname{rank} A + \dim\operatorname{Nul} A = n$. Also $(\operatorname{Row} A)^\perp = \operatorname{Nul} A$ and $(\operatorname{Col} A)^\perp = \operatorname{Nul} A^T$.

## Coordinates and dimension

| Item | Formula |
|---|---|
| Coordinates in $\mathbb{R}^n$ | $\mathbf{x} = P_{\mathcal{B}}[\mathbf{x}]_{\mathcal{B}}$, $P_{\mathcal{B}} = [\,\mathbf{b}_1 \cdots \mathbf{b}_n\,]$ |
| Change of basis | $[\mathbf{x}]_{\mathcal{C}} = P_{\mathcal{C} \leftarrow \mathcal{B}}[\mathbf{x}]_{\mathcal{B}}$; $[\,\mathcal{C} \;|\; \mathcal{B}\,] \sim [\,I \;|\; P_{\mathcal{C} \leftarrow \mathcal{B}}\,]$ |
| Dimensions | $\dim\mathbb{R}^n = n$, $\dim\mathbb{P}_n = n + 1$, $\dim M_{m \times n} = mn$ |
| Basis theorem | in dimension $p$: $p$ independent vectors, or $p$ spanning vectors, form a basis |

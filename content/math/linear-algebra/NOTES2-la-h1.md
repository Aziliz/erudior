# NOTES2-la-h1: Honors module la-h1, "Linear algebra at work"

`content/math/check-module.sh linear-algebra h1`: build and checker report **zero problems** (4 lessons, 56 questions, 12 drills, 35 cards).

## What was added

**Lessons** (module `la-h1`; capstone applications that each draw on several core modules):

| File | Id | Title | Min | Words (prose, math = 1 word) | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| 90-graphs-networks.md | la-h1-graphs | Graphs, networks and the incidence matrix | 45 | ~2,100 | 3 (four subspaces and loop test; matrix-tree count = 8; 1-ohm bridge circuit) | la-h1-graph.svg; Mermaid (potentials → A^TCA x = s) | edge-diffs, laplacian-energy, circuit |
| 91-pagerank-power-method.md | la-h1-pagerank | Ranking web pages: PageRank and the power method | 45 | ~1,750 | 3 (4-page web, α = 0.85; power method on [[4,1],[2,3]]; dangling page → (2/11, 3/11, 6/11)) | la-h1-web.svg; Mermaid power-method loop; error-vs-step plot | google-step, power-step, power-iters |
| 92-principal-components.md | la-h1-pca | Finding structure in data with principal components | 50 | ~1,900 | 3 (leaf data, S = [[5,2],[2,2]], 85.7%; PC line vs regression line; covariance vs correlation PCA) | la-h1-pca.svg; Mermaid PCA steps; plot of both lines | covariance, explained, pc-direction |
| 93-positioning-gps.md | la-h1-gps | Where am I? Trilateration, least squares and GPS | 50 | ~1,550 | 3 (three beacons → (3, 4); four noisy beacons, least squares (3.08, 3.98); DOP = √2/sin θ) | circle-intersection plot; la-h1-gps.svg; Mermaid Gauss–Newton loop | trilaterate, position-ls, dop |

Ties: 90 uses rank–nullity, (Col A)^⊥ = Nul A^T, positive semidefinite matrices, determinants; 91 uses Markov chains and eigenvector expansions; 92 uses symmetric matrices, quadratic forms, SVD and least squares; 93 uses linear systems, least squares/normal equations, conditioning and trace.

**Questions** (`questions/r2-la-h1.yaml`, la-h1-r2-h01 … h56): 14 per lesson.
- 36 four-choice MC (answer positions 9/9/9/9); 4 select-all (one per lesson).
- 16 other types: 5 text, 4 match, 4 order, 3 label (graph edges → incidence rows; PCA picture; GPS geometry). New types total 20/56 (36%).
- `module_quiz: true` on 20 (5 per lesson), covering every lesson topic.

**Pictures** (original SVG, each under 10 KB, previewed with markers): la-h1-graph.svg + -blank, la-h1-web.svg, la-h1-pca.svg + -blank, la-h1-gps.svg + -blank. **Mermaid**: 4 (one per lesson, accTitle/accDescr). **Plots**: 3.

**Drills** (`drills/r2-la-h1.yaml`, 12): la-h1-r2-edge-diffs, -laplacian-energy, -circuit, -google-step, -power-step, -power-iters, -covariance, -explained, -pc-direction, -trilaterate, -position-ls, -dop. Each generated 400 times and every answer recomputed independently with numpy (4,800 instances, 0 mismatches). Decimal answers asked "to 2/3 decimal places" have tolerance 0.006 / 0.0006; percent to 1 decimal has 0.06.

**Glossary** (`glossary-r2-la-h1.yaml`): 28 terms (graph, directed graph, incidence matrix, connected graph, Kirchhoff's voltage/current law, spanning tree, graph Laplacian, degree of a node, adjacency matrix, matrix-tree theorem, PageRank, link matrix, dangling node, damping factor, Google matrix, power method, dominant eigenvalue, Rayleigh quotient, principal component analysis, mean-deviation form, covariance matrix, total variance, principal components, trilateration, pseudorange, Gauss–Newton method, dilution of precision). Checked against every glossary*.yaml in the course (m1–m9 r2 files included): no duplicate terms or aliases.

**Cards** (`cards-r2-la-h1.yaml`): 35 (10 / 8 / 8 / 9 by lesson).

## Overlap avoided (for the reviewer)

My first drafts of lessons 92 and 93 covered low-rank approximation/Eckart–Young and the Hamming code. The m9 writer's 40h3 (pseudoinverse and low-rank approximation) and the m3 writer's 11h2 (mod 2, Hamming code) already teach these, so I rewrote 92 as PCA only (it now points to the low-rank results rather than repeating them) and replaced 93 with positioning/GPS. The Perron–Frobenius theorem is mentioned in 91 unbolded, pointing to the m8 honors lesson (32h3). Lesson 92's 2×2 example deliberately reuses the quadratic-forms lesson's matrix [[5,2],[2,2]] (and says so).

## Things to double-check

- 90: the matrix-tree theorem is stated without proof (Kirchhoff 1847). Incidence convention: −1 at the tail, +1 at the head; Ohm's law written as current = c(x_tail − x_head), giving A^TCA x = s with s = injected currents.
- 91: "every eigenvalue of G other than 1 is α times an eigenvalue of S other than 1" (S column-stochastic) is stated without proof; |λ₂| ≤ α attributed to Haveliwala and Kamvar (2003). α = 0.85 from Brin and Page (1998). The lesson says modern search uses many signals and PageRank as shown is simplified. Example 1 PageRank ≈ (0.380, 0.199, 0.384, 0.0375) computed exactly with sympy.
- 92: PCA history (Pearson 1901, Hotelling 1933), Turk and Pentland "eigenfaces" (1991), Novembre et al. 2008 (about 1,400 Europeans analyzed after filtering, from ~3,000 sampled; checked against the paper). The interest-rate application is stated in general terms. Rules for choosing k (80–95%, scree) are labeled conventions.
- 93: GPS facts: ~300 m per microsecond, at least 4 satellites because of the clock offset, relativity effect ≈ 38 µs/day, iterative linearized least squares from a starting guess. Position covariance σ²(J^TJ)^{-1} is stated as a fact from statistics without proof. Example 3 treats a 2D, no-clock case; real GDOP/PDOP include the clock column.
- Question h44 notes two beacons leave y = ±3; only x is asked.

## Errors found in existing content

None. (I read lessons 07, 15, 27, 31, 33, 36, 38, 39, 40 and the other writers' honors lessons for overlap; nothing edited outside my files.)

## Sources

- Strang, *Introduction to Linear Algebra* (graphs and networks; A^TCA framework), used for conventions only; examples are original.
- Brin S., Page L. (1998), The anatomy of a large-scale hypertextual Web search engine; Haveliwala T., Kamvar S. (2003), The second eigenvalue of the Google matrix (Stanford tech report); Langville A., Meyer C., *Google's PageRank and Beyond* (2006).
- Pearson K. (1901), On lines and planes of closest fit; Hotelling H. (1933); Turk M., Pentland A. (1991), Eigenfaces for recognition; Novembre J. et al. (2008), Genes mirror geography within Europe, *Nature* 456:98–101.
- GPS: U.S. GPS.gov system overview (constellation, clocks); standard pseudorange least-squares formulation (e.g. Misra and Enge, *Global Positioning System*); relativity correction ≈ 38 µs/day (Ashby, *Living Reviews in Relativity*, 2003).

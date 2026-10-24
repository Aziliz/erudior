# Round 3 notes for mv-m8: vector potentials and the Helmholtz decomposition

## What I added

- **Lesson** `lessons/38h3-vector-potentials.md` (id `mv-m8-h-vector-potentials`, honors, 50 min, about 2,150 words of prose). Sections: the two identities and the converse questions; topology (vortex field on space minus a line vs inverse-square field on space minus a point, with a table and a picture); the Poincaré lemma for solenoidal fields on star-shaped regions; Method 1 (component equations with $A_3 = 0$, derived, with the step that uses $\nabla\cdot\mathbf F = 0$ shown); Method 2 (the radial integral formula, stated without proof); gauge freedom and the Coulomb gauge; the Helmholtz decomposition (statement, integral formulas, a derivation sketch via the vector Poisson equation and the curl-of-curl identity, a uniqueness proof via the maximum principle, the constant-field counterexample, bounded regions via the Neumann problem); the magnetic vector potential; history. Four worked examples: $\langle y^2, z^2, x^2\rangle$ by Method 1; the uniform field two ways, whose difference is $\nabla(xy/2)$; moving Example 1's potential to the Coulomb gauge with $\chi = \tfrac13(x^3y + yz^3)$; the vector potential $-\tfrac{\mu_0I}{2\pi}\ln r\,\mathbf k$ of a straight wire.
- **Figures:** `images/mv-m8-potential-holes.svg` and `-blank.svg` (space minus a line with a loop; space minus a point with a sphere); two ```plot vector fields (the swirl $\tfrac12\langle -y, x\rangle$ and the shear $\langle -y, 0\rangle$, both with curl $\mathbf k$); one Mermaid decision chart (which potential exists).
- **Questions** `questions/r3-mv-m8.yaml`: 16 (`mv-m8-r3-h01`–`h16`). 8 multiple choice (correct indices 0, 1, 2, 3 twice each), 2 select-all, 3 text, 1 match, 1 order, 1 label. No `module_quiz` (honors lesson in a core module).
- **Drills** `drills/r3-mv-m8.yaml`: `mv-m8-r3-component-potential` (Method 1, two expression answers), `mv-m8-r3-uniform-field` ($\tfrac12\mathbf B\times\mathbf x$ at a point), `mv-m8-r3-coulomb-gauge` ($\chi(x)$ and the new first component).
- **Glossary** `glossary-r3-mv-m8.yaml`: 8 terms (scalar potential, vector potential, solenoidal, star-shaped, Poincaré lemma, gauge transformation, Coulomb gauge, Helmholtz decomposition). Checked against every glossary*.yaml in the course: no term or alias duplicates.
- **Cards** `cards-r3-mv-m8.yaml`: 13, topics "Vector potentials" and "Helmholtz decomposition".

## Checks

- Every curl, divergence, potential and gauge function in the lesson, questions and drills was recomputed with sympy: Examples 1 to 4, the radial formula on $\langle y^2, z^2, x^2\rangle$ (gives $\tfrac14\langle z^3 - x^2y, x^3 - y^2z, y^3 - xz^2\rangle$, which differs from Example 1's answer by $\nabla(x^3y/4 + y^3z/4 - xz^3/12)$), each distractor in h05, h07, h10 and h15, and the match pairs in h08.
- `content/math/check-module.sh multivariable mv-m8`: OK, zero problems.
- All figures previewed (plots, both SVGs with markers, the Mermaid chart).

## For a reviewer to double-check

- **Topology table.** "Space minus a line: every solenoidal field is a curl" is true (its second de Rham cohomology is zero), but the lesson only proves the star-shaped case. The lesson says plainly that the exact condition needs algebraic topology and that it sticks to star-shaped regions; the table row is stated without proof, and Example 4 shows it for the vortex field.
- **Helmholtz decay conditions** are stated loosely ("dies off fast enough, for instance zero outside a ball"), and labeled as a simplification. Textbooks differ on the exact rate.
- **Bounded regions:** I state only the curl-free plus divergence-free split, with the divergence-free part tangent to the boundary (the Neumann construction). I avoid claiming that part is always a curl on regions with cavities.
- **Method 2** (radial formula) is stated without proof.
- **History:** Helmholtz 1858 (Crelle's journal, vol. 55, on vortex motion) and Stokes 1849 ("On the dynamical theory of diffraction", read in 1849, printed in Trans. Camb. Phil. Soc. vol. 9). Aharonov–Bohm 1959 is mentioned in one sentence. The reason given for the name "Coulomb gauge" (in it $V$ is the instantaneous Coulomb integral of $\rho$) is the usual textbook explanation.
- Cross-references name honors lessons by subject ("the honors lesson on Green's identities", "on harmonic functions", "on gravity"), not by number.

## Errors found in existing content

None.

## Sources

- Wikipedia, "Helmholtz decomposition" (history: Stokes 1849, Helmholtz 1858; conditions), consulted 2026-10-24.
- Standard vector-calculus and electromagnetism treatments: Griffiths, *Introduction to Electrodynamics*, Appendix B (Helmholtz theorem) and ch. 5 (magnetic vector potential, Coulomb gauge); Marsden and Tromba, *Vector Calculus* (Poincaré lemma for vector fields in space).

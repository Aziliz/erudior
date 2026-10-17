# Probability and Statistics: verification against .edu / open-textbook sources (2026-10-17)

Fixes: 8 (3 facts/conditions, 1 convention, 4 coverage). 92 questions recomputed with scipy; 13 drills × 30 instances checked; worked examples in 13 lessons rechecked. No key errors.

## Sources
Penn State STAT 414 (home, Lesson 28) and STAT 415 (26.1 Neyman–Pearson, 26.2 UMP tests, 24.2 factorization, section 5 outline); MIT OCW 18.05 (Spring 2022) syllabus and calendar; LibreTexts (Siegrist, UAH) 11.2 binomial; CUNY CSI MTH 410 lecture 16; University of Florida STA 4322 and University of South Carolina STAT 512 syllabi (Wackerly).

## Fixes
1–2. Binomial and Poisson modes: ties when (n+1)p or λ is a whole number (lesson 06, glossary, card).
3. Monotone likelihood ratio for exponential families requires a monotone natural parameter (lesson 30, glossary).
4. Normal approximation np ≥ 10 kept; many texts use 5 (lesson 12, reference).
5. Lesson 25: sufficient statistics and the factorization theorem (+ Rao–Blackwell sentence); glossary, card, reference.
6. Lesson 25: delta method; glossary, card, reference.
7. Lesson 31: multinomial distribution; glossary, card, reference.
8. Lesson 18: two-variable change of variables with the Jacobian; reference.

## Conventions kept
Geometric counts trials; exponential rate λ; Gamma(α, θ) scale; N(μ, σ²); counts ≥ 10 for large-sample proportion procedures; upper-α critical values; NP ratio L(θ0)/L(θ1) ≤ k; doubled two-sided p-values; Mann–Whitney U definition; no continuity correction in rank-test approximations.

## Coverage gaps
- Common: Rao–Blackwell, MVUE and completeness (one sentence only); bootstrap and resampling; Bayesian predictive probabilities (thin).
- Optional: multiple regression; Kolmogorov–Smirnov, run test, percentile CIs; score test, Slutsky; generating/characteristic functions and multivariate normal.
- New sections (sufficiency, delta method, Jacobian, multinomial) have no questions/drills yet.

## Couldn't verify
STAT 414 page 28.1 (robots.txt; used Lesson 28); MIT 18.05 class notes not read.

import type { ProgramCourse } from "./studyPrograms";

/** Published catalog courses reused by programs; modules follow each course's core outline. */
const published = (courseId: string, title: string, modules: string[], outcomes: string[], assignment: string, recommendedBefore: string[] = []): ProgramCourse =>
  ({ courseId, title, recommendedBefore, modules, outcomes, assignment });

export const CALCULUS = published("math-calculus", "Calculus",
  ["Limits and continuity", "The derivative", "Differentiation rules", "Rates and approximation", "Analyzing functions with derivatives", "Integrals and the Fundamental Theorem", "Applications of integration", "Techniques of integration", "Differential equations", "Sequences and series", "Parametric equations and polar coordinates"],
  ["Differentiate and integrate functions and apply both to rates, optimization and accumulation.", "Prepares for the CLEP Calculus exam."],
  "Model a real system with derivatives and integrals and present the analysis.");
export const MULTIVARIABLE = published("math-multivariable", "Multivariable Calculus",
  ["Vectors and the geometry of space", "Vector functions and motion", "Partial derivatives", "Optimization", "Double integrals", "Triple integrals and change of variables", "Vector fields and line integrals", "Surface integrals and the big theorems"],
  ["Work with functions of several variables, vector fields and multiple integrals.", "Apply Green's, Stokes' and the divergence theorems."],
  "Analyze a physical field, such as flow or electric flux, with the course's vector calculus.", ["math-calculus"]);
export const DIFFERENTIAL_EQUATIONS = published("math-diffeq", "Differential Equations",
  ["Classification and first-order methods", "Modeling with first-order equations", "Autonomous equations and numerical methods", "Second-order linear equations", "Nonhomogeneous equations and applications", "Laplace transforms", "Systems of differential equations", "Series solutions, Fourier series and PDEs"],
  ["Solve ordinary differential equations analytically and numerically.", "Model mechanical and electrical systems with differential equations."],
  "Model and solve a circuit or mechanical system and compare the analytic and numerical solutions.", ["math-calculus"]);
export const LINEAR_ALGEBRA = published("math-linear-algebra", "Linear Algebra",
  ["Systems of linear equations", "Vector equations and linear independence", "Linear transformations", "Matrix algebra", "Determinants", "Vector spaces", "Eigenvalues and eigenvectors", "Orthogonality, least squares and symmetric matrices"],
  ["Solve linear systems and reason about vector spaces and transformations.", "Use eigenvalues and least squares in applications."],
  "Apply least squares or eigenvalues to a real data set or system and explain the results.");
export const PROBABILITY_STATISTICS = published("math-probstats", "Probability and Statistics",
  ["Probability foundations", "Discrete random variables", "Continuous random variables", "Joint distributions", "Limit theorems", "Estimation", "Hypothesis testing", "Regression, ANOVA and nonparametric methods"],
  ["Model uncertainty with probability distributions.", "Estimate, test and fit models to data."],
  "Design and analyze a statistical study, reporting estimates, tests and limitations.", ["math-calculus"]);
export const PHYSICS = published("science-physics", "Physics",
  ["Measurement and vectors", "Kinematics", "Forces and Newton's laws", "Energy and momentum", "Rotation and gravitation", "Oscillations, waves, and sound", "Fluids and thermodynamics", "Electrostatics", "Electric circuits", "Magnetism and induction", "Light and optics", "Modern physics"],
  ["Solve algebra-based mechanics, waves, electricity and optics problems.", "Design and analyze simple physics investigations."],
  "Design, run and report an investigation with uncertainty analysis.");
export const UNIVERSITY_PHYSICS_1 = published("science-uphys1", "University Physics I",
  ["Measurement and vectors", "Kinematics", "Forces and Newton's laws", "Energy and momentum", "Rotation and gravitation", "Oscillations, waves, and sound", "Fluids and thermodynamics"],
  ["Solve calculus-based mechanics, waves and thermodynamics problems.", "Connect physical models to calculus."],
  "Model and analyze a mechanical system with calculus and a simulation.", ["math-calculus"]);
export const UNIVERSITY_PHYSICS_2 = published("science-uphys2", "University Physics II",
  ["Electrostatics", "Electric circuits", "Magnetism and induction", "Light and optics", "Modern physics"],
  ["Solve calculus-based electricity, magnetism and optics problems.", "Explain the experimental basis of modern physics."],
  "Analyze an electromagnetic device, such as a motor or transformer, from first principles.", ["science-uphys1"]);

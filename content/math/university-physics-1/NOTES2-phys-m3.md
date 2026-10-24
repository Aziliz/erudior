# Round 2 notes: phys-m3 (Forces and Newton's laws)

`content/math/check-module.sh university-physics-1 phys-m3`: build and checker report zero problems
(7 lessons, 102 questions, 19 drills, 48 cards).

## Added

**Honors lessons** (3, `honors: true`, `module: phys-m3`, 45 min each)
- `lessons/10h1-friction-systems.md` (phys-m3-h-friction-systems), "Friction in systems: stacked blocks,
  best angles and the capstan", about 1,990 words. Friction that pushes forward (load on a truck,
  $a_{\max} = \mu_s g$); the stacked-block method (assume together, check against $\mu_s n$, else
  kinetic friction with separate accelerations); the best rope angle by calculus ($\tan\theta = \mu$,
  $F_{\min} = \mu mg/\sqrt{1+\mu^2}$, angle of friction); the capstan equation derived from a rope
  element ($dT = \mu T\,d\theta$, $T_{\text{load}} = T_{\text{hold}}e^{\mu\theta}$), labeled as an
  idealized model. Examples: largest pull on a board (31.4 N); slipping case (2.94 and 7.35 m/s²,
  book slides 0.50 m in 0.48 s); 40 kg crate (196 N horizontal vs 175 N at 26.6°); three turns on a
  bollard (×286, 100 N holds 28.6 kN).
- `lessons/10h2-drag.md` (phys-m3-h-drag), "Drag: linear, quadratic and the Reynolds number", about
  1,830 words. Linear vs quadratic drag, drag coefficient (values labeled approximate), a short
  Reynolds-number guide; a general method for velocity-dependent forces ($dt$ vs $v\,dv/dx$
  separation); coasting ($v = v_0/(1 + cv_0t/m)$, $v = v_0e^{-cx/m}$); falling
  ($v = v_T\tanh(gt/v_T)$, $y = (v_T^2/g)\ln\cosh$); thrown up ($t_{\text{up}}$, $h$, return speed).
  Examples: coasting boat (2.0 s, 13.9 m, 0.82 m/s after 50 m); skydiver (51.6 m/s, 7.76 s to 90%,
  226 m); ball thrown up at 30 m/s with $v_T \approx 35$ m/s (2.53 s up, 34.4 m, returns at
  22.8 m/s after 2.77 s down).
- `lessons/10h3-noninertial-frames.md` (phys-m3-h-noninertial), "Accelerating frames and fictitious
  forces", about 1,790 words. $-m\vec A$ and effective gravity; elevator revisited; no agent / no
  third-law partner; rotating frames with the full equation stated (derivation not given, said so);
  centrifugal and Coriolis forces; Earth (0.034 m/s² at the equator, measured g 9.78 vs 9.83 m/s²,
  hurricanes, 2 cm eastward drop from a 100 m tower, Foucault pendulum, sink-draining myth).
  Examples: pendulum in a van at 3.0 m/s² (17.0°, 10.2 m/s²); frictionless wedge ($A = g\tan\theta$
  = 3.57 m/s²); space station of radius 100 m (0.313 rad/s, 20.1 s, about 3 rpm; Coriolis 0.94 m/s²
  for a 1.5 m/s run, checked against the inertial-frame calculation).

**Core lessons 07–10** (additions only; a sentence or two introduces each picture):
- 07: third-law picture (book, table, Earth; solid = gravity pair, dashed = contact pair); Mermaid
  free-body-diagram method with an "every arrow has an agent" check loop.
- 08: Mermaid "static or kinetic?" decision chart; `plot` of friction vs applied push for Example 1
  (rises to 122.5 N, drops to 85.75 N).
- 09: Mermaid "whole system or separate FBDs?" chart; labeled table-and-hanging-mass picture with
  both free-body diagrams.
- 10: Mermaid circular-motion procedure; banked-curve picture with $n\cos\theta$ and $n\sin\theta$.

**Pictures** (10 SVGs in `images/`, original, 1.4–2.6 KB each, all rendered and looked at, blank
versions checked with their markers): phys-m3-third-law(+blank), phys-m3-incline-blank,
phys-m3-table-pulley(+blank), phys-m3-banked-curve(+blank), phys-m3-capstan(+blank),
phys-m3-accel-van(+blank). Marker positions were computed from the SVG geometry.

**Diagrams**: 7 Mermaid (4 core, 3 honors: stacked-block decision, velocity-dependent-force
method, which fictitious forces), 3 figures (friction graph, stacked-block `shape`, drag `plot`).

**Questions** (59 in `questions/r2-phys-m3.yaml`)
- Core, phys-m3-r2-q01…q20 (5 per lesson): label 4 (q01, q06, q11, q16), text 4 (q02, q07, q12,
  q18), match 3 (q03, q13, q17), order 1 (q08), select-all 4 (q04, q09, q14, q19), MC 4 (q05, q10,
  q15, q20). module_quiz: q01, q04, q06, q10, q11, q15, q16, q20.
- Honors, phys-m3-r2-h01…h39 (13 per lesson, 5 of each 13 new types): h01–h13 friction systems
  (text h09, h10; select-all h11; label h12; order h13), h14–h26 drag (text h21, h22; match h23;
  select-all h24; order h25), h27–h39 non-inertial frames (text h34, h35; match h36; select-all h37;
  label h38). No module_quiz (core-module honors).
- Correct positions of the 28 four-choice MC questions: 0: 7, 1: 8, 2: 7, 3: 6.

**Drills** (7 in `drills/r2-phys-m3.yaml`, all for honors lessons): phys-m3-r2-stacked,
phys-m3-r2-best-angle, phys-m3-r2-capstan (friction systems); phys-m3-r2-quad-drag,
phys-m3-r2-coast (drag); phys-m3-r2-accel-pendulum, phys-m3-r2-space-station (frames). Each prompt states 3 significant figures and answers use 1% relative tolerance (0.2° for
angles, 0.5% for $g_{\text{eff}}$). Sample instances generated and recomputed by hand.

**Glossary** (13 in `glossary-r2-phys-m3.yaml`, checked against every glossary*.yaml): relative
acceleration, angle of friction, capstan equation, wrap angle, linear drag, quadratic drag, drag
coefficient, fictitious force, non-inertial frame, effective gravity, centrifugal force, Coriolis
force, Foucault pendulum.

**Cards** (28 in `cards-r2-phys-m3.yaml`): 9 Friction in systems, 9 Drag, 10 Non-inertial frames.

## For a reviewer
- Overlap with phys-m7's honors lesson 29h3 (viscous flow, Stokes' law, Reynolds number): I kept
  Stokes's law and $Re$ to a short, unbolded paragraph in 10h2 that points to that lesson, dropped a
  droplet example and a Stokes drill, and added no glossary terms for them (29h3 bolds them). One
  question (h23, match objects to drag law) still relies on the rough $Re$ guide.
- Non-inertial frames might touch the phys-h1 honors module; 92-kepler-problem only uses the
  "centrifugal barrier" in the effective potential, which doesn't conflict.
- Approximate or simplified values, all labeled in the text: drag coefficients (0.5 sphere, ~1 person,
  ~0.3 car), $v_T \approx 35$ m/s for a baseball (an estimate; published values range roughly 33–42
  m/s), $Re$ boundaries, the ideal capstan model.
- Drill bold values use `sig3`, which drops trailing zeros (e.g. 34 for 33.95); the answer boxes accept
  3 s.f. at 1%, same as the course's existing drills.
- Stale files in `/tmp/r2-phys-m3/` dated before this session (svg.py, h1.mmd and four .mmd files)
  are not mine; I left them.

## Errors found in existing content
None. Every existing worked example in lessons 07–10 was re-read; nothing was edited apart from the
additions above.

## Sources
OpenStax *University Physics* Vol. 1, ch. 6 (friction, drag force and terminal speed) for the
drag-law forms and typical coefficients; standard results for the capstan (Euler–Eytelwein) equation,
quadratic-drag solutions and the rotating-frame equation of motion (any intermediate mechanics text,
e.g. Taylor, *Classical Mechanics*, ch. 2 and 9); Stokes (1851) for linear drag on a sphere; Foucault's
1851 Paris demonstration; normal gravity at the equator and poles (WGS 84: 9.780 and 9.832 m/s²);
Earth's sidereal rotation (23.93 h, $\omega = 7.29\times10^{-5}$ rad/s). All numbers recomputed in Python.

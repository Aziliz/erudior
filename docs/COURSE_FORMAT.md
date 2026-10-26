# Course format

A course is one UTF-8 JSON file holding everything for one subject: lessons, question banks, notecard decks, a glossary, quick-reference sheets and math drill templates. Import it from the Library. Courses never share questions, topics or progress with each other.

```json
{
  "format": "examiner-course",
  "version": 1,
  "id": "my-course",
  "title": "My course",
  "description": "Shown in the Library.",
  "modules": [{ "id": "m1", "title": "Foundations" }],
  "lessons": [],
  "banks": [],
  "decks": [],
  "glossary": [],
  "references": [],
  "drills": []
}
```

Every section is optional except `title`. Ids must use letters, numbers, `-` and `_`. Keep ids stable between versions of a course file, because progress (completed lessons, card schedules, question stats) is keyed on them.

## Lessons

```json
{
  "id": "agency-1",
  "module": "m1",
  "title": "Brokerage relationships",
  "minutes": 20,
  "topics": ["Agency"],
  "quiz": ["q-012", "q-047", "q-103"],
  "body": "## Heading\n\nMarkdown text. [[Transaction broker]] links to the glossary; [[term|shown text]] changes the link text."
}
```

- `body` is Markdown (GitHub-flavored, so tables work). Block quotes render as call-out boxes, which suit exam tips.
- `topics` connects the lesson to question and notecard topics. The lesson page offers "practice questions on this" and "flip related notecards" for them, and the planner uses the topics of lessons you've finished to choose practice questions.
- `quiz` (optional) lists question ids from the course's first bank, in order. The lesson ends with that quiz: answers and explanations show as you go, every question is scored, and getting 70% (rounded up) marks the lesson complete. Lessons with a quiz can't be checked off by hand. Ids that aren't in the bank are skipped. There's no fixed size: include just enough questions to cover what the lesson teaches.
- `drills` and `refs` (optional) list math drill ids and quick-reference sheet ids. The lesson's Study tools box links them, along with the notecards for the lesson's topics.
- `honors: true` (optional) makes it an honors lesson: optional extra depth. It isn't needed to finish its module or the course, its quiz doesn't count toward grades, and full exams skip its questions; study time on it still counts. A module with `honors: true` is an honors module: all its lessons are honors lessons, and it has its own module quiz.
- Lesson bodies (and quick-reference sheets) can show pictures (`![alt text](data:image/svg+xml;base64,…)`; bundled courses keep them in `images/` and the build embeds them) and Mermaid diagrams in a ```` ```mermaid ```` block. Each diagram needs `accTitle:` and `accDescr:` lines; it's drawn in the app's colors and redrawn when the theme changes.
- Lesson bodies (and quick-reference sheets) can hold **worked examples with fading** in an ```` ```example ```` block; see [Worked examples](#worked-examples) below.
- Lesson bodies can hold interactive **maps** (```` ```map ````), **timelines** (```` ```timeline ````) and **science simulations** (```` ```sim ````); see [Maps](#maps), [Timelines](#timelines) and [Simulations](#simulations) below. Question banks have matching `map` and `timeline` question types ([BANK_FORMAT.md](BANK_FORMAT.md#other-question-types)). `samples/demo-maps-timelines-sims.json` (built by `scripts/build-demo-widgets.py`) shows all of them.
- A **module** can also have a `quiz` (`{ "id": "m1", "title": "Foundations", "quiz": ["q-1", "q-9"] }`). It appears at the end of the module in the Lessons tab, unlocks once every lesson in the module is complete, works like a lesson quiz, and passing it at 70% marks the module complete.

## Question banks

Same as a standalone bank (see [BANK_FORMAT.md](BANK_FORMAT.md)), placed in the `banks` array. The `format` and `version` fields can be left out inside a course.

## Notecard decks

```json
{
  "id": "agency-cards",
  "title": "Agency",
  "description": "Optional",
  "cards": [{ "id": "c1", "front": "Prompt", "back": "Answer", "topic": "Agency" }]
}
```

Fronts and backs are Markdown and can use `[[glossary]]` links, math and pictures. A picture works exactly as in lessons: `![alt text](data:image/svg+xml;base64,…)` in the course file (bundled courses write `![alt text](images/name.svg)` and the build embeds the file), alt text required. On the card it's scaled to fit: never wider than the card, and at most about 40% of the screen height, so the answer and the rating buttons stay in view. Keep card pictures simple; a detailed figure belongs in the lesson.

## Worked examples

A worked example shows every step of a solution. Fading turns it into practice: the last steps are left for the learner, who works each one out and then reveals it to check. A typical lesson runs the same kind of problem three times: fully worked, then with the last step faded, then with most steps faded.

````markdown
```example fade=1
title: Prorating property taxes
problem: Annual taxes are $3,650 and the seller owns the home for 120 days of the year. How much of the tax does the seller owe?
step: Daily rate = $3,650 ÷ 365 = $10 per day
step: Seller's days = 120
step: Seller owes 120 × $10 = $1,200
answer: $1,200
```
````

- Each line starting with `title:`, `problem:`, `step:` or `answer:` (any case) starts a field; any other line continues the field above, so a step can be several lines, a list, a table or display math (`$$…$$`). Every field is Markdown with math, glossary links and pictures, rendered like the lesson text. The block must start at the beginning of a line (not indented, not inside a list).
- `problem:` and at least one `step:` are required; `title:` and `answer:` are optional; steps are numbered in order.
- `fade=N` hides the last N steps. Each hidden step shows "Your turn: work out this step." with a **Show step** button; only the next hidden step can be revealed, so they come out in order. The answer stays hidden until every step is shown, then **Show answer** reveals it. Revealed text gets keyboard focus, so screen readers read it. Without `fade` (or `fade=0`) the example is fully worked and nothing is hidden. If N is the number of steps, the block is labeled a practice problem.
- Printing shows every step and the answer. Revealing is per page view; nothing is saved.
- The course checker reports a block with no steps, no problem, `fade` larger than the number of steps (it's treated as "all steps"), a `fade` that isn't a whole number, unknown options, text before the first field, a repeated title/problem/answer, empty fields and unclosed blocks. Math in the fields is checked like any lesson math.
- A `### Example …` heading's colored box ends where an example block starts; the block has its own panel, so it doesn't need the heading.

## Maps

A map block draws an interactive map: shaded regions, labeled points, routes with arrows and a key. Learners can zoom (+ / − buttons or keys), drag to pan when zoomed in, and point at a place (or Tab to the map and move with the arrow keys) to see its name. The title, the key (each group with its places) and the caption are plain text in the page, so the map reads without the picture, in print and to screen readers.

````markdown
```map
base: us
title: The Louisiana Purchase (1803)
view: fit
region: Arkansas, Missouri, Iowa | All of the state
region: Montana, Wyoming, Colorado | Part of the state
point: St. Louis | 38.63, -90.20
route: Lewis and Clark | 38.63, -90.20; 47.30, -101.03; 46.13, -123.88 | Lewis and Clark's route
caption: The United States bought this land from France.
```
````

One setting per line (`key: value`; parts separated by `|`); lines starting with `#` are ignored. The block must start at the beginning of a line.

| Line | Meaning |
|---|---|
| `base:` | `world` (countries, Natural Earth 1:110m; Antarctica only when the map names it), `us` (the 50 states and DC; Alaska and Hawaii as insets) or `none` with your own `geojson:` or `svg:`. Default `world`. |
| `title:`, `caption:` | Shown above and below; Markdown with math. A caption can run over several lines. |
| `region: names \| group` | Shades places (comma-separated). Regions, points and routes with the same group share a color and a line in the key (up to 6 groups); without a group they're shaded in the accent color. |
| `point: name \| lat, lon \| group` | A dot with its name. Positions are latitude, longitude in degrees (south and west negative), or `39.74N, 104.99W`. |
| `route: name \| lat, lon; lat, lon; … \| group` | A line with an arrow at the end (long routes follow the curve of the Earth). `line:` is the same without the arrow, dashed (borders, fronts). |
| `label: text \| lat, lon` | Free text on the map (oceans, deserts). |
| `view:` | What the map opens on: `fit` (everything marked), place names (`view: France, Spain`) or two corners (`view: 30, -15 to 55, 20`). Default: the whole base map. |
| `labels:` | `on` writes the names of shaded regions on the map; `all` writes every region's name. Points are always labeled. |
| `projection:` | `equal-earth` (world default), `albers-usa` (us default), `mercator` (default for GeoJSON) or `plain`. |
| `geojson:` | Your own shapes: a GeoJSON FeatureCollection (on the following lines, or a `data:` URL). Each feature's `properties.name` is its place name. With `projection: plain` coordinates are x, y in your own units. |
| `svg:` | Your own drawing (on the following lines, or a `data:` URL): every `path`, `polygon`, `rect`, `circle` and `ellipse` with an `id`, `data-name`, `aria-label` or `<title>` becomes a named place; unnamed shapes are drawn as background. Only the shapes are read (no styles, scripts or text), and positions for points and routes are x, y in the SVG's units. Transforms aren't applied. |

- Place names match without regard to capital letters, accents or a leading "the". US states also match their two-letter abbreviations (`CO`); countries match common names (`USA`, `UK`, `Ivory Coast`, `Burma`, `Czech Republic`, `DR Congo`). The world map's names: `United States`, `Democratic Republic of the Congo`, `Republic of the Congo`, `Bosnia and Herzegovina`, `North Macedonia`, `Eswatini`, `South Sudan` and so on (Natural Earth's short forms are spelled out).
- The shapes load only when a map is shown (about 40 KB compressed for each base map).
- The course checker reports unknown lines, bad positions, names that aren't on the map, points outside it and unclosed blocks.

## Timelines

````markdown
```timeline
title: Ancient Rome
era: 509–27 BCE | Republic
era: 27 BCE – 476 CE | Empire
event: c. 753 BCE | Rome is founded (the traditional date) | Rome
event: 264–146 BCE | The Punic Wars | Wars
event: March 15, 44 BCE | Julius Caesar is killed | Rome
caption: There was no year 0: 1 BCE is followed by 1 CE.
```
````

- `event: date | text | category` and `era: range | name | category` (category optional; up to 6 get their own colors and a key). Eras are periods drawn as bands above the line. Text is Markdown with math. `title:` and `caption:` as for maps.
- **Dates:** `1776`, `July 4, 1776`, `4 July 1776`, `July 1776`, `1776-07-04`, `44 BCE` (or BC; `CE`/`AD` optional), `AD 476`, `c. 3000 BCE` (or ca., circa, about), `1960s`, `15th century`, `5th century BCE`, `65 million years ago`, `3.5 billion years ago`, `10,000 years ago`. **Ranges:** `1861–1865`, `1861-1865`, `1914 to 1918`, `27 BCE – 14 CE`; `753–509 BCE` makes both ends BCE. The date is shown exactly as written.
- Events are listed oldest first whatever order they're written in. On screens at least 520 px wide the timeline runs across the page with + / − / Fit zoom buttons and sideways scrolling (labels are stacked so they never overlap); on narrower screens, in print and to screen readers it's an ordered list.
- The course checker reports dates it can't read, ranges that end before they start, eras without a range, missing text and unclosed blocks.

## Simulations

````markdown
```sim projectile
title: How far does it go?
speed: 20
angle: 30 [5, 85]
fixed: gravity
caption: Find the angle that sends the ball farthest.
```
````

The word after ```` ```sim ```` is the kind. Each line sets a setting's starting value, optionally with a narrower slider range in `[min, max]`; `fixed:` hides settings the learner shouldn't change; `title:` (default: the kind's name) and `caption:` as above. Every simulation has sliders, live readouts, a picture and a graph; nothing moves until Play. Play/Pause, Step and Reset are real buttons, sliders work with the arrow keys, and screen readers hear a one-sentence summary when a run ends, pauses or steps, or a setting changes. With the system's "reduce motion" setting, Play becomes Run (jumps ahead and draws the graph at once) and the circuit and gas pictures stay still.

| Kind | Settings (default, range) | Shows |
|---|---|---|
| `projectile` | `speed` m/s (20, 1–50), `angle` ° (45, 0–90), `height` m (0, 0–50), `gravity` m/s² (9.8, 1–25) | The path as height against distance; time, distance, height, speed, highest point, landing distance. |
| `pendulum` | `length` m (1, 0.1–5), `angle` ° (20, 1–170), `gravity`, `damping` per s (0, 0–1) | The swing (solved exactly, not with the small-angle shortcut) and angle against time; the period from 2π√(L/g) and as measured. |
| `circuit` | `voltage` V (9, 1–24), `r1`, `r2` Ω (10, 20; 1–100), `r3` Ω (0 = none), `layout`: `series` or `parallel` | The circuit with moving charges (Show the motion), total resistance, current, each resistor's current and voltage, power; current against voltage. |
| `gas` | `temperature` K (300, 50–1000), `volume` L (25, 1–50), `amount` mol (1, 0.1–3), `graph`: `volume` or `temperature` | Particles in a box; pressure from PV = nRT in kPa and atm; pressure against volume (Boyle) or temperature (Gay-Lussac). |
| `population` | `model`: `predator-prey` (rabbits and foxes: `prey` 40, `predators` 9, `birth` 0.6, `catch` 0.025, `gain` 0.01, `death` 0.5) or `logistic` (`start` 10, `rate` 0.5, `capacity` 500) | Numbers over time (Lotka–Volterra or logistic growth). |

The course checker reports unknown kinds and settings, values outside their range and bad choices.

## Glossary

```json
{ "term": "Earnest money", "definition": "Deposit made by a buyer…", "aliases": ["EM"], "topic": "Contracts" }
```

## Quick-reference sheets

```json
{ "id": "formulas", "title": "Math formulas", "body": "Markdown, usually tables." }
```

Sheets print cleanly from the app.

## Math drills

A drill is a problem template. Each run picks random inputs, computes the answer, and fills both into the text.

```json
{
  "id": "commission-split",
  "title": "Commission split",
  "topic": "Commission",
  "vars": {
    "price": { "min": 250000, "max": 900000, "step": 5000 },
    "rate": { "choices": [5, 5.5, 6] }
  },
  "calc": {
    "total": "price * rate / 100",
    "half": "round(total / 2, 2)"
  },
  "prompt": "A home sells for {price:money0} at {rate}%, split evenly. What does each brokerage get?",
  "answer": "half",
  "format": "money",
  "tolerance": 0.01,
  "solution": "{price:money0} × {rate}% = {total:money}, so each side gets **{half:money}**."
}
```

- `vars`: `{min, max, step}` for a number in a range, or `{choices: [...]}` to pick one value (numbers, text, or `{label, value}` where the label is shown and the value is used in math).
- `calc`: evaluated top to bottom; each can use any var or earlier calc.
- `where` (optional): conditions every problem must meet, e.g. `["b^2 - 4*a*c > 0", "root == round(root)"]`. Inputs are re-rolled (up to 500 times) until all hold, so you can ask for whole-number roots, nonzero coefficients, valid triangles and so on.
- `funcs` (optional): functions the drill can use, e.g. `{"f(x)": "a*x^3 + b*x"}`. They can use the drill's values and each other.
- `answer` / `format` / `tolerance`: the classic single number answer (see below for more answer types).
- `prompt` and `solution`: Markdown with `{name}` or `{name:format}` placeholders and math (see Math notation). Careful: any `{name}` that matches a value is filled, even inside TeX, so with a value named `g`, `\dfrac{v^2}{g}` shows 9.8 in place of g. Pick value names that don't clash with letters you write alone in TeX braces.

### Expressions

Operators `+ - * / ^` (`^` is right-associative; `-2^2 = -4`), parentheses, `!` (factorial), `|x|` (absolute value), comparisons `< <= > >= == !=`, and `and`, `or`, `not` (true is 1, false is 0). Constants `pi`, `e`, `tau`. Numbers can use scientific notation (`6.02e23`).

| Group | Functions |
|---|---|
| Rounding | `round(x, digits)`, `floor`, `ceil`, `trunc`, `abs`, `sign`, `min`, `max`, `clamp(x, lo, hi)`, `mod(a, b)` |
| Powers and logs | `sqrt`, `cbrt`, `root(x, n)`, `exp`, `ln`, `log(x)` (base 10), `log(x, b)`, `log2`, `log10` |
| Trig (radians) | `sin`, `cos`, `tan`, `sec`, `csc`, `cot`, `asin`, `acos`, `atan`, `atan2(y, x)`, `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh` |
| Trig (degrees) | `sind`, `cosd`, `tand`, `secd`, `cscd`, `cotd`, `asind`, `acosd`, `atand`, `atan2d`, plus `deg(r)` and `rad(d)` |
| Counting | `fact(n)`, `nCr(n, r)`, `nPr(n, r)`, `gcd`, `lcm` |
| Other | `hypot(a, b, …)`, `if(cond, a, b)`, `isprime(n)`, `gamma`, `lgamma`, `erf` |
| Statistics of a list | `mean(…)`, `median(…)`, `variance(…)` / `stdev(…)` (sample, n − 1), `pvariance(…)` / `pstdev(…)` (population), `total(…)`, `quartile(k, …)` (k = 0–4, median-of-halves) |
| Distributions | `normpdf(x, μ, σ)`, `normcdf(x, μ, σ)` (μ, σ default 0, 1), `invnorm(p, μ, σ)`, `tpdf(t, df)`, `tcdf(t, df)`, `invt(p, df)`, `chi2pdf`, `chi2cdf(x, df)`, `invchi2(p, df)`, `fcdf(x, d1, d2)`, `binompdf(n, p, k)`, `binomcdf(n, p, k)`, `poissonpdf(λ, k)`, `poissoncdf(λ, k)`, `geompdf(p, k)`, `geomcdf(p, k)` |
| Calculus (on a drill function) | `deriv(f, x)` and `deriv(f, x, 2)`, `integ(f, a, b)`, `solve(f, lo, hi)` (a root between lo and hi), `limit(f, a)` (or one side: `limit(f, a, 1)` / `limit(f, a, -1)`), `extremum(f, lo, hi, 1)` (x of the max; `-1` for the min), `sum(f, from, to)`, `prod(f, from, to)` |

The calculus functions are numerical (accurate to about 6 significant figures) and also accept built-ins, e.g. `integ(sin, 0, pi)`.

### Answers

Single number: `answer` names the value, `format` sets how it's shown and the default tolerance (`money` 0.01, `money0` 1, `integer` 0, others 0.01), and `tolerance` overrides it.

For anything else, give `answers`, a list of answer boxes:

```json
"answers": [
  { "name": "x", "label": "$x =$" },
  { "name": "y", "label": "$y =$", "kind": "fraction", "lowestTerms": true },
  { "name": "F", "label": "Force", "format": "sci", "sigfigs": 3, "units": { "N": 1, "kN": 1000 } },
  { "kind": "expression", "expression": "3*a*x^2 + 2*b*x", "variables": ["x"], "label": "$f'(x) =$" },
  { "kind": "expression", "expression": "a*x^(n+1)/(n+1)", "plusC": true }
]
```

- **number** (default): any equivalent value. People can type math: `3/4`, `1 3/4`, `sqrt(3)/2`, `2pi`, `6.02e23`, `$1,250`. Options: `tolerance` (absolute), `relTolerance` (e.g. `0.01` = 1%), `sigfigs` (accept anything that matches at that many significant figures).
- **fraction**: must be typed as a whole number or fraction (`-7/4`, `1 3/4`), no decimals; `lowestTerms` requires it reduced.
- **expression**: an algebraic answer, checked by plugging values into both. `expression` is the correct one, written with the drill's values and functions (e.g. `deriv(f, x)` works); `variables` lists the letters allowed (default `x`); `plusC` accepts answers that differ by a constant (antiderivatives); `show` sets how the correct answer is displayed (otherwise it's generated).
- `units` (number kinds): accepted units and their factor to the answer's unit; the first is shown. People can type `25 km/h` and it's converted. With no unit typed, the first unit is assumed.
- `label`: text beside the box (math allowed).

The answer is right only when every box is right. A live preview shows how typed math reads.

### Placeholders

`{name}` inserts a value (or a choice's label); `{name:format}` formats it:

| Format | Shows |
|---|---|
| `money`, `money0` | $1,234.56 / $1,235 |
| `percent`, `pct1` | 6.5% |
| `int`, `num1`, `num2`, `num4`, `dp3` (fixed decimals), `sig3` (significant figures) | numbers |
| `month` | a month name from 1–12 |
| `frac` / `texfrac` | 3/4 / `\frac{3}{4}` for math |
| `sci` / `texsci` | 2.02 × 10^2 / `2.02 \times 10^{2}` for math |
| `deg` | 45° |
| `coef` | a coefficient before a variable: 1 → nothing, -1 → `-`, 3 → `3` |
| `signed`, `signedcoef` | a following term: `+ 3` / `- 3`; `signedcoef` also drops a 1 |

So `"$x^2 {b:signedcoef}x {c:signed} = 0$"` shows $x^2 - 5x + 6 = 0$.

## Math notation

Anywhere text is shown (lessons, questions and choices, explanations, notecards, glossary definitions, drills), TeX math renders with KaTeX: inline `$…$` or `\(…\)`, and display `$$…$$` or `\[…\]`. Dollar amounts stay text: an inline `$` only starts math when it's followed by a non-space, and only ends it when it's preceded by a non-space and not followed by a digit. Write `\$` for a literal dollar sign.

## Figures

Drills can have a `figure` (or a list of them); lessons can include them as fenced blocks: ` ```plot `, ` ```shape ` or ` ```figure ` followed by the JSON. Any number can be an expression using the drill's values and functions.

```json
{
  "type": "plot",
  "x": [-5, 5], "y": [-4, 12],
  "functions": ["f", { "f": "2x + 1", "label": "g", "dashed": true }],
  "tangents": [{ "f": "f", "at": "p" }],
  "shade": [{ "f": "f", "from": 0, "to": "b" }],
  "points": [[0, 1], { "at": ["p", "f(p)"], "label": "P", "open": false }],
  "caption": "f and its tangent at P"
}
```

- `type`: `plot` (grid, axes and ticks), `shape` (a plain diagram with true proportions; the view fits the shapes when `x`/`y` are left out), or `numberline` (one horizontal line over the `x` range; put points and segments at y = 0, e.g. an open point and an arrow for $x > 2$). Lessons use ` ```numberline ` blocks for these.
- `xLabel`, `yLabel`: axis titles for plots (default x and y). `equal: true` gives a plot the same scale on both axes so circles look round. `"yAxisAt": "left"` and `"xAxisAt": "bottom"` move an axis and its numbers to the edge (useful when numbers at x = 0 would sit on the data); `"grid": false` hides grid and axes.
- `curves`: parametric curves `{ "x": "3cos(t)", "y": "2sin(t)", "t": [0, "2pi"] }`; polar curves as `r(t)cos(t)`, `r(t)sin(t)`.
- `slopeField`: `{ "f": "x - y", "step": 0.5 }` draws the slope field of dy/dx = f(x, y).
- `vectorField`: `{ "u": "-y", "v": "x", "step": 1 }` draws arrows scaled to fit; when a few arrows near a singularity are far longer than the rest, they are capped so the others stay visible.
- `bars`: `[{ "x": 1, "height": 4, "width": 1, "label": "A" }, …]` for histograms and bar charts. When bars have labels, the x-axis numbers are left out so the two don't overlap.
- `functions`: a drill function name or an expression in `x`; optional `label`, `color`, `dashed`, `from`, `to`. Curves break at asymptotes and are clipped to the view.
- `tangents`, `shade` (between `f` and the x-axis, or `g`), `points`, `segments` (`from`, `to`, `label`, `arrow`, `dashed`), `polygons`, `circles` (`center`, `r`), `labels` (`at`, `text`), `rightAngles` (`[vertex, a, b]`), `width`, `caption`. Text fields can use `{placeholders}`. Curve, point and segment labels are placed automatically where they cover the fewest lines and other text (try the usual spot first, then nearby ones); `labels` stay exactly where you put them.

The bundled `samples/math-sampler-course.json` (built by `content/math-sampler/build.py`) shows all of this: algebra, geometry, trig, physics, calculus and graphing.

The course editor validates drills and shows a live sample (with its figure and answer) as you type.

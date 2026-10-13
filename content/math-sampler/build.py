"""Build samples/math-sampler-course.json: a small course that exercises the math engine
(functions, answer types, notation and figures). Run: python3 content/math-sampler/build.py"""
import json, pathlib

ROOT = pathlib.Path(__file__).parent
OUT = ROOT.parent.parent / "samples" / "math-sampler-course.json"

D = []
def drill(**kw):
    kw.setdefault("format", "number")
    kw.setdefault("answer", "")
    D.append(kw)

# --- Algebra -------------------------------------------------------------------
drill(id="alg-linear", title="Solve a linear equation", topic="Algebra",
      vars={"a": {"min": 2, "max": 9}, "x": {"min": -12, "max": 12}, "b": {"min": -20, "max": 20}},
      calc={"c": "a*x + b"}, where=["b != 0"],
      prompt="Solve for $x$: $\\;{a}x {b:signed} = {c}$", answer="x", format="number",
      answers=[{"name": "x", "label": "$x =$"}],
      solution="Subtract {b} from both sides: ${a}x = {c} - ({b})$. Divide by {a}: $x =$ **{x}**.")
drill(id="alg-fraction", title="Solve with a fraction answer", topic="Algebra",
      vars={"a": {"min": 2, "max": 9}, "b": {"min": 1, "max": 20}, "c": {"min": 1, "max": 9}},
      calc={"x": "(b - c) / a"}, where=["x != round(x)"],
      prompt="Solve for $x$ and give an exact fraction: $\\;{a}x + {c} = {b}$",
      answers=[{"name": "x", "label": "$x =$", "kind": "fraction", "lowestTerms": True}],
      solution="${a}x = {b} - {c}$, so $x = \\dfrac{{b} - {c}}{{a}} = {x:texfrac}$ in lowest terms.")
drill(id="alg-quadratic", title="Roots of a quadratic", topic="Algebra",
      vars={"r1": {"min": -9, "max": 9}, "r2": {"min": -9, "max": 9}},
      calc={"b": "-(r1 + r2)", "c": "r1 * r2", "lo": "min(r1, r2)", "hi": "max(r1, r2)"},
      where=["r1 < r2"],
      prompt="Find both roots of $x^2 {b:signedcoef}x {c:signed} = 0$. Smaller root first.",
      answers=[{"name": "lo", "label": "Smaller root"}, {"name": "hi", "label": "Larger root"}],
      solution="Factor: $(x - ({lo}))(x - ({hi})) = 0$, so $x =$ **{lo}** or $x =$ **{hi}**.")
drill(id="alg-system", title="Solve a 2×2 system", topic="Algebra",
      vars={"x": {"min": -6, "max": 6}, "y": {"min": -6, "max": 6}, "a": {"min": 1, "max": 5}, "b": {"min": -5, "max": 5}, "c": {"min": 1, "max": 5}, "d": {"min": -5, "max": 5}},
      calc={"e": "a*x + b*y", "f": "c*x + d*y", "det": "a*d - b*c"}, where=["det != 0", "b != 0", "d != 0"],
      prompt="Solve the system:\n\n$$\\begin{cases} {a:coef}x {b:signedcoef}y = {e} \\\\ {c:coef}x {d:signedcoef}y = {f} \\end{cases}$$",
      answers=[{"name": "x", "label": "$x =$"}, {"name": "y", "label": "$y =$"}],
      solution="Determinant ${a}\\cdot{d} - ({b})({c}) = {det}$. Cramer's rule gives $x =$ **{x}**, $y =$ **{y}**.")
drill(id="alg-simplify", title="Expand a product", topic="Algebra",
      vars={"a": {"min": 1, "max": 6}, "b": {"min": -9, "max": 9}, "c": {"min": 1, "max": 6}, "d": {"min": -9, "max": 9}},
      where=["b != 0", "d != 0"],
      prompt="Expand and simplify: $({a:coef}x {b:signed})({c:coef}x {d:signed})$",
      answers=[{"kind": "expression", "expression": "(a*x + b)*(c*x + d)", "variables": ["x"], "label": "Expanded form"}],
      solution="FOIL: ${a}\\cdot{c}\\,x^2 + ({a}\\cdot{d} + {b}\\cdot{c})x + ({b})({d})$.")

# --- Geometry --------------------------------------------------------------------
drill(id="geo-hyp", title="Hypotenuse", topic="Geometry",
      vars={"a": {"min": 3, "max": 15}, "b": {"min": 3, "max": 15}},
      calc={"c": "hypot(a, b)", "s": "a^2 + b^2"},
      prompt="A right triangle has legs {a} and {b}. How long is the hypotenuse? (Exact or to 2 decimals.)",
      answers=[{"name": "c", "label": "$c =$"}],
      figure={"type": "shape", "polygons": [{"points": [[0, 0], ["a", 0], [0, "b"]]}], "rightAngles": [[[0, 0], ["a", 0], [0, "b"]]],
              "segments": [{"from": [0, 0], "to": ["a", 0], "label": "{a}"}, {"from": [0, "b"], "to": [0, 0], "label": "{b}"}, {"from": ["a", 0], "to": [0, "b"], "label": "c"}]},
      solution="$c = \\sqrt{{a}^2 + {b}^2} = \\sqrt{{s}} \\approx$ **{c:num2}**.")
drill(id="geo-circle", title="Circle area", topic="Geometry",
      vars={"r": {"min": 2, "max": 12}},
      calc={"A": "pi * r^2"},
      prompt="What's the area of a circle with radius {r}? Give an exact answer like 49pi, or a decimal.",
      answers=[{"name": "A", "label": "Area", "relTolerance": 0.001}],
      figure={"type": "shape", "circles": [{"center": [0, 0], "r": "r"}], "segments": [{"from": [0, 0], "to": ["r", 0], "label": "r = {r}"}], "points": [[0, 0]]},
      solution="$A = \\pi r^2 = {r}^2\\pi =$ **{A:num2}** (exactly ${r}^2\\pi$).")

# --- Trigonometry ----------------------------------------------------------------
drill(id="trig-side", title="Find a side with SOH CAH TOA", topic="Trigonometry",
      vars={"h": {"min": 5, "max": 30}, "t": {"choices": [20, 25, 30, 35, 40, 50, 55, 60]}},
      calc={"opp": "h * sind(t)"},
      prompt="A right triangle has hypotenuse {h} and an angle of {t}°. How long is the side opposite that angle? (2 decimals)",
      answers=[{"name": "opp", "label": "Opposite"}],
      figure={"type": "shape", "polygons": [{"points": [[0, 0], ["h*cosd(t)", 0], ["h*cosd(t)", "h*sind(t)"]]}],
              "rightAngles": [[["h*cosd(t)", 0], [0, 0], ["h*cosd(t)", "h*sind(t)"]]],
              "segments": [{"from": [0, 0], "to": ["h*cosd(t)", "h*sind(t)"], "label": "{h}"}],
              "labels": [{"at": ["0.18*h*cosd(t)", "0.07*h"], "text": "{t}°"}, {"at": ["1.06*h*cosd(t)", "0.5*h*sind(t)"], "text": "?"}]},
      solution="$\\sin {t}^\\circ = \\dfrac{\\text{opp}}{{h}}$, so opp $= {h}\\sin {t}^\\circ \\approx$ **{opp:num2}**.")
drill(id="trig-exact", title="Exact trig values", topic="Trigonometry",
      vars={"t": {"choices": [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]}, "fn": {"choices": [{"label": "\\sin", "value": 0}, {"label": "\\cos", "value": 1}]}},
      calc={"v": "if(fn == 0, sind(t), cosd(t))"},
      prompt="Give the exact value of ${fn}({t}^\\circ)$. Type it like sqrt(3)/2 or -1/2.",
      answers=[{"name": "v", "label": "Value", "tolerance": 0.0005}],
      solution="Use the reference angle and the quadrant's sign: ${fn}({t}^\\circ) \\approx$ **{v:num4}**.")
drill(id="trig-angle", title="Find an angle", topic="Trigonometry",
      vars={"a": {"min": 3, "max": 20}, "b": {"min": 3, "max": 20}},
      calc={"t": "atand(a / b)"},
      prompt="In a right triangle the side opposite angle θ is {a} and the adjacent side is {b}. Find θ in degrees (1 decimal).",
      answers=[{"name": "t", "label": "θ", "tolerance": 0.05, "units": {"°": 1, "deg": 1}}],
      solution="$\\theta = \\tan^{-1}\\!\\left(\\dfrac{{a}}{{b}}\\right) \\approx$ **{t:num1}°**.")

# --- Physics ---------------------------------------------------------------------
drill(id="phys-fall", title="Free fall", topic="Physics",
      vars={"t": {"min": 1, "max": 6, "step": 0.5}},
      calc={"d": "0.5 * 9.8 * t^2", "v": "9.8 * t"},
      prompt="A ball is dropped from rest. Ignoring air resistance ($g = 9.8\\,\\text{m/s}^2$), how far has it fallen and how fast is it going after {t} s?",
      answers=[{"name": "d", "label": "Distance", "relTolerance": 0.005, "units": {"m": 1, "cm": 0.01, "km": 1000}},
               {"name": "v", "label": "Speed", "relTolerance": 0.005, "units": {"m/s": 1, "km/h": 0.277778}}],
      solution="$d = \\tfrac12 g t^2 = \\tfrac12(9.8)({t})^2 =$ **{d:num2} m**; $v = gt =$ **{v:num2} m/s**.")
drill(id="phys-coulomb", title="Coulomb's law (scientific notation)", topic="Physics",
      vars={"q": {"min": 1, "max": 9}, "r": {"choices": [0.01, 0.02, 0.05, 0.1, 0.2]}},
      calc={"F": "8.99e9 * (q*1e-6)^2 / r^2"},
      prompt="Two charges of {q} μC each sit {r} m apart. Find the force between them ($k = 8.99 \\times 10^9$). Answer to 3 significant figures; you can type 1.23e4.",
      answers=[{"name": "F", "label": "Force", "format": "sci", "sigfigs": 3, "units": {"N": 1}}],
      solution="$F = k\\dfrac{q^2}{r^2} = 8.99\\times10^9 \\cdot \\dfrac{({q}\\times10^{-6})^2}{({r})^2} \\approx \\mathbf{{F:texsci}}\\,\\text{N}$.")
drill(id="phys-projectile", title="Projectile range", topic="Physics",
      vars={"v": {"min": 10, "max": 40}, "t": {"choices": [15, 30, 45, 60, 75]}},
      calc={"R": "v^2 * sind(2*t) / 9.8", "t2": "2*t"},
      funcs={"y(x)": "x*tand(t) - 9.8*x^2 / (2*v^2*cosd(t)^2)"},
      prompt="A projectile is launched at {v} m/s, {t}° above level ground. How far away does it land?",
      answers=[{"name": "R", "label": "Range", "relTolerance": 0.005, "units": {"m": 1}}],
      figure={"type": "plot", "x": [0, "R*1.1"], "y": [0, "max(1, R*0.6)"], "functions": [{"f": "y", "from": 0, "to": "R", "label": "path"}], "points": [{"at": ["R", 0], "label": "lands"}]},
      solution="$R = \\dfrac{v^2\\sin 2\\theta}{g} = \\dfrac{{v}^2 \\sin {t2}^\\circ}{9.8} \\approx$ **{R:num1} m**.")

# --- Calculus --------------------------------------------------------------------
drill(id="calc-deriv-poly", title="Derivative of a polynomial", topic="Calculus",
      vars={"a": {"min": 1, "max": 6}, "b": {"min": -9, "max": 9}, "c": {"min": -9, "max": 9}},
      funcs={"f(x)": "a*x^3 + b*x^2 + c*x"}, where=["b != 0", "c != 0"],
      prompt="Find $f'(x)$ for $f(x) = {a:coef}x^3 {b:signedcoef}x^2 {c:signedcoef}x$.",
      answers=[{"kind": "expression", "expression": "3*a*x^2 + 2*b*x + c", "variables": ["x"], "label": "$f'(x) =$"}],
      solution="Power rule term by term: $f'(x) = 3({a})x^2 + 2({b})x + ({c})$.")
drill(id="calc-slope", title="Slope of a tangent line", topic="Calculus",
      vars={"a": {"min": 1, "max": 4}, "p": {"min": -3, "max": 3}},
      funcs={"f(x)": "a*sin(x) + x^2/2"},
      calc={"m": "deriv(f, p)"},
      prompt="$f(x) = {a:coef}\\sin x + \\dfrac{x^2}{2}$. What's the slope of the tangent line at $x = {p}$? (3 decimals)",
      answers=[{"name": "m", "label": "Slope", "tolerance": 0.001}],
      figure={"type": "plot", "x": [-5, 5], "y": [-6, 14], "functions": [{"f": "f", "label": "f"}], "tangents": [{"f": "f", "at": "p"}], "points": [{"at": ["p", "f(p)"]}]},
      solution="$f'(x) = {a}\\cos x + x$, so $f'({p}) = {a}\\cos({p}) + ({p}) \\approx$ **{m:num4}**.")
drill(id="calc-integral", title="Area under a curve", topic="Calculus",
      vars={"a": {"min": 1, "max": 3}, "b": {"min": 1, "max": 4}},
      funcs={"f(x)": "a*x^2 + 1"},
      calc={"A": "integ(f, 0, b)"},
      prompt="Find $\\displaystyle\\int_0^{{b}} \\left({a:coef}x^2 + 1\\right)dx$. Exact fractions are fine.",
      answers=[{"name": "A", "label": "Area", "tolerance": 0.001}],
      figure={"type": "plot", "x": [-1, "b+1"], "y": [-2, "a*(b+1)^2 + 2"], "functions": ["f"], "shade": [{"f": "f", "from": 0, "to": "b"}]},
      solution="$\\left[\\dfrac{{a:coef}x^3}{3} + x\\right]_0^{{b}} = \\dfrac{{a}\\cdot{b}^3}{3} + {b} =$ **{A:num4}**.")
drill(id="calc-antideriv", title="Antiderivative", topic="Calculus",
      vars={"a": {"min": 2, "max": 9}, "n": {"min": 2, "max": 5}},
      prompt="Find an antiderivative: $\\displaystyle\\int {a}x^{{n}}\\,dx$ (leave off $+C$).",
      answers=[{"kind": "expression", "expression": "a*x^(n+1)/(n+1)", "variables": ["x"], "plusC": True, "label": "$F(x) =$"}],
      solution="Power rule for integrals: $\\dfrac{{a}}{{n}+1}x^{{n}+1} + C$.")
drill(id="calc-limit", title="Limit of a removable discontinuity", topic="Calculus",
      vars={"a": {"min": -6, "max": 6}, "b": {"min": -6, "max": 6}},
      funcs={"g(x)": "(x^2 - (a+b)*x + a*b)/(x - a)"}, where=["a != b", "a != 0"],
      calc={"s": "-(a+b)", "pr": "a*b", "na": "-a", "L": "limit(g, a)"},
      prompt="Find $\\displaystyle\\lim_{x\\to {a}} \\frac{x^2 {s:signedcoef}x {pr:signed}}{x {na:signed}}$.",
      answers=[{"name": "L", "label": "Limit", "tolerance": 0.001}],
      solution="Factor the top as $(x - ({a}))(x - ({b}))$, cancel $(x - ({a}))$, and plug in: ${a} - ({b}) =$ **{L}**.")
drill(id="calc-optimize", title="Optimization", topic="Calculus",
      vars={"P": {"min": 20, "max": 200, "step": 4}},
      funcs={"area(w)": "w * (P/2 - w)"},
      calc={"w": "extremum(area, 0, P/2, 1)", "A": "area(w)"},
      prompt="You have {P} m of fence for a rectangular pen. What's the largest area you can enclose?",
      answers=[{"name": "A", "label": "Max area", "relTolerance": 0.001, "units": {"m^2": 1, "m²": 1}}],
      figure={"type": "plot", "x": [0, "P/2"], "y": [0, "A*1.2"], "functions": [{"f": "area", "label": "area(w)"}], "points": [{"at": ["w", "A"], "label": "max"}]},
      solution="Area $= w\\left(\\tfrac{{P}}{2} - w\\right)$ peaks at $w = \\tfrac{{P}}{4} = {w}$ (a square), giving **{A} m²**.")

# --- Graphing ---------------------------------------------------------------------
drill(id="graph-line", title="Read a line's equation from its graph", topic="Graphing",
      vars={"m": {"choices": [-3, -2, -1, -0.5, 0.5, 1, 2, 3]}, "b": {"min": -5, "max": 5}},
      prompt="Write the equation of the line in the graph, as $y = \\ldots$ in terms of $x$.",
      answers=[{"kind": "expression", "expression": "m*x + b", "variables": ["x"], "label": "$y =$"}],
      figure={"type": "plot", "x": [-8, 8], "y": [-8, 8], "functions": ["m*x + b"], "points": [[0, "b"], [2, "2*m + b"]]},
      solution="The y-intercept is {b} and the slope is rise over run between the marked points: ${m}$. So $y = {m:coef}x {b:signed}$.")
drill(id="graph-vertex", title="Vertex of a parabola", topic="Graphing",
      vars={"h": {"min": -5, "max": 5}, "k": {"min": -6, "max": 6}, "a": {"choices": [-2, -1, -0.5, 0.5, 1, 2]}},
      funcs={"f(x)": "a*(x - h)^2 + k"}, calc={"nh": "-h"}, where=["h != 0", "k != 0"],
      prompt="Find the vertex of $f(x) = {a:coef}(x {nh:signed})^2 {k:signed}$.",
      answers=[{"name": "h", "label": "Vertex $x$"}, {"name": "k", "label": "Vertex $y$"}],
      figure={"type": "plot", "x": [-10, 10], "y": [-10, 10], "functions": ["f"]},
      solution="In vertex form $a(x - h)^2 + k$ the vertex is $(h, k)$, here **({h}, {k})**.")

course = {
    "format": "examiner-course",
    "version": 1,
    "id": "math-sampler",
    "title": "Math sampler",
    "description": "Try-out course for Examiner's math tools: equations and exact fractions, multi-part answers, algebraic answers, units and significant figures, trig, physics, calculus, and graphs. Each drill makes new numbers every time.",
    "author": "Examiner",
    "revision": 1,
    "modules": [{"id": "m-math", "title": "Math tools"}],
    "lessons": [json.loads((ROOT / "lesson.json").read_text())],
    "banks": [{
        "id": "math-bank",
        "title": "Math sampler questions",
        "sections": [],
        "exam": {"questionCount": 5, "timeLimitMinutes": 15, "passingPercent": 70},
        "questions": json.loads((ROOT / "questions.json").read_text()),
    }],
    "decks": [{"id": "math-cards", "title": "Formulas", "cards": json.loads((ROOT / "cards.json").read_text())}],
    "glossary": [],
    "references": [],
    "drills": D,
}
OUT.write_text(json.dumps(course, indent=1, ensure_ascii=False))
print(f"{len(D)} drills -> {OUT}")

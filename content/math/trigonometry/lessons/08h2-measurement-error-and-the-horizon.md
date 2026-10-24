---
id: trig-m2-h-measurement-error
module: trig-m2
title: 'Indirect measurement: error, the best angle and the size of the Earth'
minutes: 45
honors: true
topics: [Measurement error, Horizon and Earth's radius]
drills: [trig-m2-r2-height-range, trig-m2-r2-horizon, trig-m2-r2-earth-radius]
refs: [trig-ref-unit-circle]
---
## Real angles are never exact

In the lesson on elevation, depression and bearings, every angle was given as if it were
perfect: "the angle of elevation is $38^\circ$". A real instrument, whether a phone
inclinometer, a surveyor's theodolite or a sextant, reads an angle only to within some
**uncertainty**, written like $38^\circ \pm 0.5^\circ$. Engineers and scientists always ask a
second question after "what is the answer?": *how far off could it be?* This lesson
answers that question for right-triangle measurements, finds the angle at which a
measurement is least sensitive to error, and then uses the same right-triangle reasoning to
estimate the size of the Earth from the top of a hill.

## From an angle range to a height range

The simplest honest method is to compute the answer at both ends of the range.

### Example 1: the tree, with an uncertainty

From 50 m away on level ground, the angle of elevation to the top of a tree (measured at
eye level) is $38^\circ \pm 0.5^\circ$. How much of the tree is above eye level?

$$h = 50\tan 38^\circ \approx 39.06 \text{ m}, \qquad 50\tan 37.5^\circ \approx 38.37 \text{ m}, \qquad 50\tan 38.5^\circ \approx 39.77 \text{ m}.$$
So $h \approx 39.1 \pm 0.7$ m. The **absolute error** is about 0.7 m, the size of the
possible miss in the answer's own units. The **relative error** is the absolute error divided
by the value, $\tfrac{0.70}{39.06} \approx 0.018$, or about 1.8%. Relative error is the fairer way
to compare: being 0.7 m off on a 39 m tree is much better than being 0.7 m off on a 3 m shed.

## How sensitive is the height to the angle?

Computing both ends works for one problem, but it hides the pattern. Here is a picture
argument that shows the pattern, using radian measure from Module 1. It is an approximation
that is very accurate when the angle error is small.

Let the horizontal distance be $d$ and the angle of elevation $\theta$. The line of sight has
length $L = \tfrac{d}{\cos\theta}$. If the angle is off by a small amount $\Delta\theta$
(in radians), the far end of the line of sight swings along a tiny arc of length about
$L\,\Delta\theta$, at right angles to the line of sight. But that end has to stay on the
vertical trunk. A vertical shift $\Delta h$ has a component of only $\Delta h\cos\theta$ across
the line of sight, so
$$\Delta h\cos\theta \approx L\,\Delta\theta \quad\Longrightarrow\quad \Delta h \approx \frac{d\,\Delta\theta}{\cos^2\theta}.$$
Divide by $h = d\tan\theta$ to get the relative error:
$$\frac{\Delta h}{h} \approx \frac{\Delta\theta}{\cos^2\theta\,\tan\theta} = \frac{\Delta\theta}{\sin\theta\cos\theta}.$$

For the tree, $\Delta\theta = 0.5^\circ \approx 0.008727$ rad, and
$\tfrac{50(0.008727)}{\cos^2 38^\circ} \approx 0.70$ m, matching Example 1.

```plot
{"x": [0, 90], "y": [0, 12], "xLabel": "angle of elevation θ (degrees)", "yLabel": "relative error in h (%)", "functions": [{"f": "100*(pi/360)/(sind(x)*cosd(x))", "label": "error ±0.5°", "from": 4.8, "to": 85.2}], "points": [{"at": [45, 1.745], "label": "45°: 1.75%"}], "caption": "Relative error in a height from a ±0.5° angle error: smallest at 45°, large at very low or very steep angles"}
```

### The best angle is 45°

The relative error is smallest when $\sin\theta\cos\theta$ is largest. Since
$(\sin\theta - \cos\theta)^2 \ge 0$, expanding gives $\sin^2\theta + \cos^2\theta - 2\sin\theta\cos\theta \ge 0$.
In a right triangle $\sin^2\theta + \cos^2\theta = \tfrac{\text{opp}^2 + \text{adj}^2}{\text{hyp}^2} = 1$
by the Pythagorean theorem, so $\sin\theta\cos\theta \le \tfrac12$, with equality only when
$\sin\theta = \cos\theta$, that is, at $\theta = 45^\circ$. At that angle
$\tfrac{\Delta h}{h} \approx 2\,\Delta\theta$. Notice also that $\theta$ and $90^\circ - \theta$ give the
same value of $\sin\theta\cos\theta$, so $10^\circ$ and $80^\circ$ are equally bad.

### Example 2: choosing where to stand

A tower is about 100 m tall and your inclinometer reads to $\pm 0.5^\circ$. Compare standing
where the angle of elevation is $45^\circ$ with standing where it is $80^\circ$.

- At $45^\circ$: $d = \tfrac{100}{\tan 45^\circ} = 100$ m, and
  $\Delta h \approx \tfrac{100(0.008727)}{\cos^2 45^\circ} \approx 1.75$ m.
- At $80^\circ$: $d = \tfrac{100}{\tan 80^\circ} \approx 17.63$ m, and
  $\Delta h \approx \tfrac{17.63(0.008727)}{\cos^2 80^\circ} \approx 5.1$ m.

Standing close makes the error about three times worse. Computing both ends at $80^\circ$
gives $+5.4$ m and $-4.9$ m: at steep angles the error is lopsided, which is a reminder that
the formula is an approximation. The practical rule surveyors use: when you can choose,
set up so the angle is moderate, near $45^\circ$, rather than very steep or very shallow.

Errors in the distance matter too. Because $h = d\tan\theta$ is proportional to $d$, a 1%
error in $d$ makes a 1% error in $h$. In the worst case the two relative errors roughly add
(a simplification that is good when both are small).

## The distance to the horizon

Now a bigger triangle. Stand at a point $P$ at height $h$ above the sea and look at the
horizon. Your line of sight just grazes the Earth at the horizon point $T$, so it is
tangent to the Earth there, and a tangent line is perpendicular to the radius $OT$. That
gives a right triangle $OTP$ with the right angle at $T$, legs $R$ and $d$, and hypotenuse
$R + h$.

![A large circle for the Earth with center O. Point P is directly above the circle at height h. A line from P touches the circle at T, where the radius OT meets it at a right angle. The line PT is labeled d, both radii are labeled R, and the angle α appears twice: at P between the dashed horizontal and the line PT, and at O between OP and OT. The drawing is not to scale.](images/trig-m2-horizon.svg)

By the Pythagorean theorem,
$$d = \sqrt{(R + h)^2 - R^2} = \sqrt{2Rh + h^2} \approx \sqrt{2Rh},$$
since $h$ is tiny compared with $R$. With $R \approx 6371$ km and $h$ in meters this becomes the
handy rule $d \approx 3.57\sqrt{h}$ km.

### Example 3

How far is the horizon for a person whose eyes are 1.7 m above the sea, and from a 100 m cliff?

$d = \sqrt{2(6\,371\,000)(1.7)} \approx 4654$ m, about 4.7 km. From 100 m:
$\sqrt{2(6\,371\,000)(100)} \approx 35\,700$ m, about 36 km. Climbing 59 times higher only
multiplies the distance by $\sqrt{59} \approx 7.7$, because $d$ grows like $\sqrt h$.

This is a simplified model. The air bends light slightly around the curve of the Earth
(**atmospheric refraction**), so the horizon you actually see is usually a few percent
farther than this geometric value.

## Measuring the Earth from a hilltop

At $P$ the horizontal is perpendicular to $OP$. The angle between the horizontal and the
line of sight to the horizon is called the **dip of the horizon**, $\alpha$. Because the
horizontal is perpendicular to $OP$ and $PT$ is perpendicular to $OT$, the angle at the center,
$\angle TOP$, equals $\alpha$ too. Cosine in triangle $OTP$ gives
$$\cos\alpha = \frac{R}{R + h} \quad\Longrightarrow\quad R = \frac{h\cos\alpha}{1 - \cos\alpha}.$$
Measure $h$ and $\alpha$, and you have the radius of the Earth. The Persian scholar al-Biruni
described this method in the early eleventh century and carried it out from a mountain near
Nandana, in present-day Pakistan; his answer was close to the modern value, although
historians note that a dip of well under a degree is very hard to measure that precisely.

### Example 4

From a hilltop 500 m above sea level, the dip of the horizon is measured as $0.718^\circ$.
Estimate the Earth's radius, and see what an error of $\tfrac{1}{60}$ of a degree
(one minute of arc) would do.

$\cos 0.718^\circ \approx 0.99992148$, so
$$R = \frac{500(0.99992148)}{1 - 0.99992148} \approx 6.37 \times 10^6 \text{ m} \approx 6370 \text{ km}.$$
With $\alpha = 0.718^\circ \pm \tfrac{1}{60}^\circ$, the same formula gives about 6080 km to 6670 km, roughly
5% either way. A one-minute error is only about 2.3% of the 43-minute dip, but the
radius depends roughly on $\tfrac{1}{\alpha^2}$, which doubles the relative error.

Notice the precision trap: if you round $\cos 0.718^\circ$ to $0.9999$, the formula gives
$R \approx 5000$ km, off by more than 20%. When a formula subtracts two nearly equal numbers,
like $1 - \cos\alpha$, keep every digit until the end.

## Common mistakes

- **Using degrees in $\Delta h \approx d\,\Delta\theta / \cos^2\theta$.** The arc-length step needs
  $\Delta\theta$ in radians: $0.5^\circ \approx 0.008727$.
- **Comparing absolute errors across very different sizes.** Use relative error to judge which
  measurement is better.
- **Thinking closer is always better.** Very steep angles make height measurements more
  sensitive, not less.
- **Putting the right angle at $P$ in the horizon triangle.** The right angle is at the
  horizon point $T$, where the line of sight is tangent.
- **Rounding $\cos\alpha$ early** when $\alpha$ is tiny.

## Key points

- Report a measured result with its uncertainty; check it by computing both ends of the range.
- For $h = d\tan\theta$: $\Delta h \approx \tfrac{d\,\Delta\theta}{\cos^2\theta}$ and
  $\tfrac{\Delta h}{h} \approx \tfrac{\Delta\theta}{\sin\theta\cos\theta}$ ($\Delta\theta$ in radians), smallest at $45^\circ$.
- Distance to the horizon: $d = \sqrt{2Rh + h^2} \approx \sqrt{2Rh}$, about $3.57\sqrt{h}$ km for
  $h$ in meters.
- Dip of the horizon: $\cos\alpha = \tfrac{R}{R + h}$, so $R = \tfrac{h\cos\alpha}{1 - \cos\alpha}$.

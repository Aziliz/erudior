---
id: trig-m1-h-earth-sky
module: trig-m1
title: Measuring the Earth and the sky with arcs
minutes: 45
honors: true
topics: [Measuring the Earth, Small angles]
drills: [trig-m1-r2-meridian-distance, trig-m1-r2-angular-size, trig-m1-r2-parallax]
refs: [trig-ref-unit-circle]
---
## The arc formula, read three ways

Lesson 3 gave you $s = r\theta$ and used it in one direction: know the radius and the angle,
find the arc. But the formula ties three quantities together, and any two give the third. That
simple fact let people measure the size of the Earth more than two thousand years ago, lets a
ship's navigator turn latitude into distance, and lets astronomers find distances to stars they
will never visit. This lesson works through all three, in that order:

- **Know $s$ and $\theta$, find $r$:** the size of the Earth.
- **Know $r$ and $\theta$, find $s$:** distances on the Earth's surface, and the nautical mile.
- **Know $s$ and $r$, find $\theta$** (and its reverse, know $\theta$ and $s$, find $r$): how big
  things look in the sky, and how far away the stars are.

All of it uses the radian, and all of it is only as simple as it looks *because* the angle is in
radians.

## How Eratosthenes measured the Earth

Eratosthenes of Cyrene (about 276–194 BC) was the head of the great library at Alexandria in
Egypt. The story of his measurement reaches us mainly through a later Greek writer, Cleomedes,
so some details are uncertain, but the method is clear and it is a beautiful use of angles.

He had heard that at noon on the summer solstice, the Sun at Syene (modern Aswan, south of
Alexandria) shone straight down a deep well: it was directly overhead. At the same time in
Alexandria, a vertical stick, called a **gnomon**, cast a short shadow. The angle between the
gnomon and the Sun's rays was about $\tfrac{1}{50}$ of a full circle, which is $7.2^\circ$.

![The Sun's rays arrive parallel. At Syene they go straight down a well; at Alexandria they make an angle theta with a vertical stick. Extending the stick and the well down to the Earth's center makes a central angle theta between the two cities, cut off by the arc s along the surface.](images/trig-m1-eratosthenes.svg)

Two facts turn that shadow into the size of the planet.

1. **The Sun is so far away that its rays arrive parallel.** Every ray in the picture points
   the same way.
2. **A vertical stick points at the Earth's center.** So does the well at Syene. Extend both
   lines down and they meet at the center.

Now the ray hitting the top of the gnomon and the ray going down the well are parallel lines,
and the line from the gnomon to the center crosses both. The shadow angle and the central angle
are alternate interior angles, so they are equal. The central angle between Alexandria and
Syene is therefore $7.2^\circ$, one fiftieth of a full turn.

The distance between the cities was taken to be 5000 *stadia* (a Greek unit of length). Since
the arc between them is $\tfrac{1}{50}$ of the full circle, the whole circumference is
$$50 \times 5000 = 250{,}000 \text{ stadia}.$$

In the language of this course: $\theta = 7.2^\circ = \tfrac{\pi}{25}$ rad and $s = 5000$, so
$r = \tfrac{s}{\theta} = \tfrac{5000 \cdot 25}{\pi} \approx 39{,}789$ stadia.

**How accurate was it?** That is genuinely debated, and it depends mostly on a question nobody
can settle: how long was the stadion Eratosthenes used? Proposed values run from about 157.5 m to
about 185 m. With 157.5 m the circumference comes out near 39,400 km, within about 2% of the
modern pole-to-pole value of about 40,008 km; with 185 m it is near 46,250 km, about 16% too
large. Some of his inputs were also off: Aswan lies about 3° east of Alexandria, not due south,
and the two cities' latitudes differ by about $7.1^\circ$, not $7.2^\circ$. Either way, the
*method* is sound, and it was the first measurement of the Earth based on geometry that we know of.

### Example 1: Eratosthenes with modern numbers

Two observers stand on the same north–south line, 500 km apart. At the same moment, the Sun's
rays make an angle of $4.5^\circ$ with a vertical stick at the northern site and come straight
down at the southern one. Find the Earth's circumference and radius.

**Step 1: the central angle.** By the parallel-ray argument, the central angle is $4.5^\circ$.

**Step 2: circumference by proportion.** $4.5^\circ$ is $\tfrac{4.5}{360} = \tfrac{1}{80}$ of a
turn, so the circumference is $80 \times 500 = 40{,}000$ km.

**Step 3: radius from $r = s/\theta$.** $4.5^\circ = \tfrac{4.5\pi}{180} = \tfrac{\pi}{40}$ rad, so
$$r = \frac{500}{\pi/40} = \frac{20{,}000}{\pi} \approx 6366 \text{ km}.$$

**Check:** $2\pi r = 2\pi \cdot \tfrac{20{,}000}{\pi} = 40{,}000$. ✓ The modern mean radius is
about 6371 km.

The observers don't really need the Sun to be overhead at one site: if the rays make angles
$\alpha$ and $\beta$ with the vertical at the two sites (on the same side), the central angle is
$\beta - \alpha$.

## Latitude, great circles and the nautical mile

The **latitude** of a place is the central angle between it and the equator, measured north or
south along the place's **meridian**, the north–south circle through both poles. Since latitude is
a central angle, the distance between two places on the same meridian is just an arc:
$s = R\,\Delta\theta$, where $\Delta\theta$ is the difference in latitude in radians and $R$ is
the Earth's radius. (Lesson 3 did one of these; places on opposite sides of the equator are
handled by adding their latitudes.)

A meridian is a **great circle**: a circle on a sphere whose center is the center of the sphere.
Great circles matter because the shortest path between two points along a sphere's surface is
always an arc of a great circle. The equator is a great circle too, but the other circles of
latitude are not: they get smaller toward the poles, and a degree of longitude along them is
shorter than a degree along the equator. (Lesson 5's cosine is what measures how much shorter.)

With $R \approx 6371$ km, one degree of latitude spans
$$6371 \cdot \frac{\pi}{180} \approx 111.2 \text{ km},$$
and one minute of latitude spans about $1.853$ km. Navigators made that the unit: the
**nautical mile** was originally one minute of arc along a meridian. Because the Earth is not a
perfect sphere, that length varies slightly with latitude, so since 1929 the international
nautical mile has been *defined* as exactly 1852 m. A speed of one nautical mile per hour is a
**knot**, still the unit of speed at sea and in the air.

The payoff is that on a meridian, or on the equator, **the distance in nautical miles is the
angle in minutes.** No $\pi$, no radius: the unit has $s = r\theta$ built in.

### Example 2: sailing due north

A ship sails due north from latitude $12^\circ 40'$ S to $3^\circ 25'$ N. How far does it go, in
nautical miles and in kilometers? How long does it take at 15 knots?

**Step 1: the angle.** The two places are on opposite sides of the equator, so add:
$12^\circ 40' + 3^\circ 25' = 15^\circ 65' = 16^\circ 05'$.

**Step 2: convert to minutes.** $16 \times 60 + 5 = 965'$, so the distance is **965 nautical
miles**.

**Step 3: kilometers.** $965 \times 1.852 \approx 1787.2$ km.

**Step 4: time.** At 15 knots, $\tfrac{965}{15} \approx 64.3$ hours, a little under three days.

The Earth is not quite a sphere (it bulges at the equator), so "1 nautical mile = 1 minute of
latitude" is an approximation good to well under 1%, which is plenty for this kind of planning.

## Small angles: how big things look

Hold a coin at arm's length and it can cover the Moon. What matters is not an object's size but
its **angular size**: the angle it covers as seen from where you are. For an object of width $D$
at distance $d$, picture a circle of radius $d$ centered on your eye. If $d$ is much larger than
$D$, the object is very nearly a short arc of that circle, so by $s = r\theta$,

$$\theta \approx \frac{D}{d} \qquad (\theta \text{ in radians}).$$

This is the **small-angle approximation**. It treats a straight object as if it were bent to fit
the circle, and the error is tiny when the angle is small: the straight chord and the arc differ
by about 0.13% at $10^\circ$ and about 0.001% at $1^\circ$. (Lesson 3 already noticed that a short
arc looks straight; this is the same fact used on purpose.) Astronomers use it constantly, because
almost everything in the sky is a very small angle.

```shape
{"segments": [{"from": [0, 0], "to": [10, 2]}, {"from": [0, 0], "to": [10, -2]}, {"from": [10, -2], "to": [10, 2], "label": "D"}, {"from": [0, 0], "to": [10, 0], "dashed": true, "label": "d"}], "curves": [{"x": "10.198cos(t)", "y": "10.198sin(t)", "t": [-0.1974, 0.1974], "dashed": true}, {"x": "2.5cos(t)", "y": "2.5sin(t)", "t": [-0.1974, 0.1974]}], "points": [[0, 0]], "labels": [{"at": [-0.3, -0.7], "text": "eye"}, {"at": [3.1, 0.3], "text": "θ"}], "caption": "An object of width D at distance d is almost an arc of a circle of radius d (dashed), so θ ≈ D/d"}
```

Small angles need small units. Recall from Lesson 1 that a degree is 60 minutes and a minute is
60 seconds; when these measure angles in the sky they are usually called arcminutes and
**arcseconds** to avoid confusion with time. Two conversions are worth remembering:

$$1 \text{ rad} = \frac{180 \cdot 60}{\pi}' \approx 3438' , \qquad 1 \text{ rad} = \frac{180 \cdot 3600}{\pi}'' \approx 206{,}265''.$$

A sharp human eye can separate details about $1'$ apart (a common rule of thumb, not a fixed
limit).

Soldiers, surveyors and long-range shooters use the **milliradian** (mrad), one thousandth of a
radian, for the same reason: the small-angle rule becomes mental arithmetic. An object that
spans 1 mrad is $\tfrac{1}{1000}$ of its distance across, so 1 m at 1 km, or 10 cm at 100 m.

### Example 3: the Sun and the Moon

The Moon's diameter is about 3475 km, and its average distance is about 384,400 km. The Sun's
diameter is about 1,392,700 km, at an average distance of about 149,600,000 km. Compare their
angular sizes.

**Moon:** $\theta \approx \tfrac{3475}{384{,}400} \approx 0.00904$ rad. In degrees,
$0.00904 \cdot \tfrac{180}{\pi} \approx 0.518^\circ$, or about $31'$.

**Sun:** $\theta \approx \tfrac{1{,}392{,}700}{149{,}600{,}000} \approx 0.00931$ rad
$\approx 0.533^\circ$, or about $32'$.

The Sun is about 400 times wider than the Moon but also about 390 times farther away, so the two
look almost exactly the same size, about half a degree. That coincidence is why the Moon can just
cover the Sun in a total solar eclipse. (Both distances vary through the year and the month, so
sometimes the Moon looks slightly smaller and an eclipse is "annular", leaving a ring of Sun.)

## Parallax and the parsec

Hold a finger in front of your face and close each eye in turn: the finger jumps against the
background. That shift is **parallax**, and the closer the finger, the bigger the jump.
Astronomers use the Earth's orbit the same way. As the Earth moves around the Sun, a nearby
star seems to shift slightly against much more distant stars.

The baseline is the **astronomical unit** (au), the average Earth–Sun distance, defined since
2012 as exactly 149,597,870.7 km. The star's **parallax angle** $p$ is the angle that 1 au
subtends as seen from the star. By the small-angle approximation, with $s = 1$ au,

$$d = \frac{1 \text{ au}}{p \text{ (in radians)}}.$$

This suggests a natural unit. A **parsec** (pc, short for "parallax arcsecond") is the distance at
which 1 au subtends exactly $1''$:

$$1 \text{ pc} = \frac{1 \text{ au}}{1''\text{ in radians}} = \frac{648{,}000}{\pi} \text{ au} \approx 206{,}265 \text{ au} \approx 3.086 \times 10^{13} \text{ km} \approx 3.26 \text{ light-years}.$$

Since 2015 the International Astronomical Union has *defined* the parsec as exactly
$\tfrac{648{,}000}{\pi}$ au, which is the small-angle formula written as a definition. With $p$ in
arcseconds, the distance in parsecs is simply

$$d \text{ (pc)} = \frac{1}{p \text{ (arcseconds)}}.$$

(Strictly, parallax geometry uses the tangent function from a later lesson, but for angles this
small the difference from $s = r\theta$ is far smaller than any measurement error.)

### Example 4: the nearest star

Proxima Centauri has a parallax of about $0.768''$. How far away is it?

**Step 1:** $d = \tfrac{1}{0.768} \approx 1.30$ pc.

**Step 2:** in light-years, $1.30 \times 3.26 \approx 4.25$ ly.

**Step 3 (sense check):** even the *nearest* star has a parallax under one arcsecond, about the
angular width of a coin seen from 4 km away. That is why stellar parallax was first measured only
in 1838, by Friedrich Bessel, and why its absence had been an argument against the Earth moving.

## Common mistakes

- **Using degrees in $\theta \approx D/d$.** The ratio $D/d$ is in radians. Convert to degrees,
  minutes or seconds afterward.
- **Mixing units of length.** $D$ and $d$ must be in the same unit before dividing: a 30 m
  object 2 km away has $\theta \approx \tfrac{30}{2000}$, not $\tfrac{30}{2}$.
- **Subtracting latitudes across the equator.** $12^\circ$ S to $3^\circ$ N is $15^\circ$ of
  latitude, not $9^\circ$. Treat south as negative and subtract, or just add the two.
- **Treating the minutes in DMS as decimals** when turning latitude into nautical miles:
  $16^\circ 05'$ is $965'$, not $1605'$ or $16.05 \times 60$.
- **Using the small-angle rule for big angles.** At $30^\circ$ the chord is already about 1%
  shorter than the arc; at $60^\circ$ it is about 4.5% shorter.
- **Thinking a parsec is a unit of time or angle.** It is a distance, about 3.26 light-years.

## Key points

- Eratosthenes found the Earth's size from $r = s/\theta$: parallel sun rays make the shadow
  angle equal to the central angle between two cities. His accuracy is debated because the
  length of his stadion is uncertain.
- Latitude is a central angle. On a meridian or the equator, distance $= R\,\Delta\theta$.
- One nautical mile (exactly 1852 m) is about one minute of latitude; a knot is one nautical mile
  per hour.
- Small-angle approximation: an object of width $D$ at distance $d$ has angular size
  $\theta \approx D/d$ radians.
- $1 \text{ rad} \approx 3438' \approx 206{,}265''$; 1 mrad covers 1 m at 1 km.
- A star with parallax $p$ arcseconds is $1/p$ parsecs away; 1 pc $\approx 3.26$ light-years.

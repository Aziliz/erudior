---
id: pre-m8-h-measurement-error
module: pre-m8
title: Precision and measurement error
minutes: 40
honors: true
topics: [Measurement error]
drills: [pre-m8-r2-bounds, pre-m8-r2-area-bounds, pre-m8-r2-percent-error]
refs: [pre-ref-geometry]
---
## Every measurement is rounded

In this module's lessons, a fish tank was "30 in" long and a can was "11 cm" tall, and we computed with those numbers as if they were exact. Real measurements never are. A ruler marked in centimeters can't tell 7 cm from 7.2 cm; a bathroom scale that shows whole pounds can't tell 150 lb from 150.4 lb. This lesson shows how to say exactly how uncertain a measurement is, how to compare that uncertainty with the size of the measurement, and what happens to it when measurements are multiplied to find areas and volumes. Scientists and engineers deal with these questions every day; the ideas here are their starting point.

## Precision and greatest possible error

The **precision** of a measurement is the size of the unit it was rounded to. "7 cm, measured to the nearest centimeter" has a precision of 1 cm; "7.2 cm, to the nearest tenth of a centimeter" has a precision of 0.1 cm, which is more precise.

When you round to the nearest unit, the true value can be off by up to half a unit in either direction. That half-unit is called the **greatest possible error** (GPE):

$$\text{greatest possible error} = \tfrac12 \times \text{precision}.$$

![A ruler marked from 0 to 10 cm with half-centimeter ticks. A bar above it ends a little past 7, so measured to the nearest centimeter it reads 7 cm. A shaded box over the ruler from 6.5 to 7.5 cm shows every true length that would also be read as 7 cm.](images/pre-m8-h-ruler.svg)

So "7 cm to the nearest cm" means the true length is at least 6.5 cm and less than 7.5 cm. These two values are the **lower bound** and the **upper bound** of the measurement. With the rounding rule this course uses (ties round up), a true length of exactly 6.5 cm would read as 7 cm, but exactly 7.5 cm would read as 8 cm, so

$$6.5 \le L < 7.5.$$

```numberline
{"x": [6, 8], "points": [{"at": [6.5, 0], "label": "6.5"}, {"at": [7.5, 0], "open": true, "label": "7.5"}, {"at": [7, 0], "label": "7"}], "segments": [{"from": [6.5, 0], "to": [7.5, 0]}], "caption": "Every length from 6.5 up to (not including) 7.5 rounds to 7"}
```

In practice the difference between "less than 7.5" and "at most 7.5" rarely matters, and many books simply write $7 \pm 0.5$ cm. The bounds are what matter.

### Example 1

Find the greatest possible error and the bounds for each measurement.

| Measurement | Precision | GPE | Bounds |
|---|---|---|---|
| 3.2 kg, to the nearest 0.1 kg | 0.1 kg | 0.05 kg | 3.15 kg to 3.25 kg |
| 4,300 m, to the nearest 100 m | 100 m | 50 m | 4,250 m to 4,350 m |
| $5\tfrac12$ in, to the nearest $\tfrac14$ in | $\tfrac14$ in | $\tfrac18$ in | $5\tfrac38$ in to $5\tfrac58$ in |
| 12.00 s, to the nearest hundredth | 0.01 s | 0.005 s | 11.995 s to 12.005 s |

The last row shows why trailing zeros matter in measurements: "12.00 s" says more than "12 s". It claims precision to the hundredth of a second, so its bounds are 11.995 and 12.005, not 11.5 and 12.5.

## Precision is not accuracy

**Accuracy** is how close a measurement is to the true value. Precision is how finely it's reported. They are different things. A kitchen scale that reads to 0.1 g but was never zeroed (it shows 3.0 g with nothing on it) is precise but not accurate: every reading is about 3 g too high. A rough estimate of "about 200 m" for a 205 m path is accurate but not very precise.

(In science you will also see "precision" used for how close *repeated* measurements are to each other. Both meanings are about fineness and consistency, not about closeness to the truth.)

## Relative error

An error of 0.5 cm is huge when measuring a 2 cm beetle and tiny when measuring a 250 cm doorway. To compare, divide the error by the size of the measurement. The **relative error** of a measurement is

$$\text{relative error} = \frac{\text{greatest possible error}}{\text{measurement}},$$

often written as a percent.

### Example 2

Compare the relative errors of 7 cm and 250 cm, both measured to the nearest centimeter.

Both have GPE 0.5 cm. $\tfrac{0.5}{7} \approx 0.071 = 7.1\%$ and $\tfrac{0.5}{250} = 0.002 = 0.2\%$. The doorway measurement is far better, relative to its size, even though the ruler was the same.

When the true value is known (from a better instrument, or a definition), you can measure how far off a particular measurement actually was. The **percent error** is

$$\text{percent error} = \frac{|\text{measured} - \text{true}|}{\text{true}} \times 100\%.$$

### Example 3

A student measures a 50.0 cm board as 48.5 cm. What is the percent error?

$\dfrac{|48.5 - 50.0|}{50.0} \times 100\% = \dfrac{1.5}{50} \times 100\% = 3\%$.

## Errors grow in calculations

When you compute with measured values, their uncertainties carry into the answer, and multiplication makes them grow. The safe way to see how much is to compute with the bounds: the smallest possible answer from the lower bounds, the largest from the upper bounds.

### Example 4

A rectangle is measured as 8 cm by 5 cm, each to the nearest centimeter. Between what values does its true area lie? Its perimeter?

The length is between 7.5 and 8.5 cm; the width between 4.5 and 5.5 cm.

- Smallest area: $7.5 \times 4.5 = 33.75$ cm². Largest: $8.5 \times 5.5 = 46.75$ cm² (actually just under it).
- The calculated area, $8 \times 5 = 40$ cm², could be off by more than 6 cm²: about 16%, even though each side's relative error is only about 6% to 10%.
- Perimeter: from $2(7.5) + 2(4.5) = 24$ cm to $2(8.5) + 2(5.5) = 28$ cm, so $26 \pm 2$ cm.

The relative errors of the two sides roughly *add* when they are multiplied: $\tfrac{0.5}{8} \approx 6\%$ and $\tfrac{0.5}{5} = 10\%$, and the area's error is about $6\% + 10\% = 16\%$. (That shortcut is an approximation that works well when the errors are small.)

### Example 5

A cube's edge is measured as 10 cm to the nearest centimeter. Find the bounds on its volume.

Edge between 9.5 and 10.5 cm. Volume between $9.5^3 = 857.375$ and $10.5^3 = 1{,}157.625$ cm³. The calculated 1,000 cm³ could be off by about 15%: three factors each with a 5% relative error.

Volume multiplies three lengths together, so a small relative error in the length grows about three times over.

## Don't report more than you know

A calculator happily turns uncertain measurements into many digits. Reporting them all claims a precision you don't have.

### Example 6

A circular table's radius is measured as 4.2 ft, to the nearest tenth of a foot. Find its area and report it sensibly.

$A = \pi(4.2)^2 \approx 55.4177$ ft². The radius could be anywhere from 4.15 to 4.25 ft, so the area could be anywhere from $\pi(4.15)^2 \approx 54.1$ to $\pi(4.25)^2 \approx 56.7$ ft². Writing "55.4177 ft²" claims the area is known to a ten-thousandth of a square foot, when even the ones digit is uncertain by about 1. "About 55 ft²" is honest.

The significant-figures rule from the Module 6 honors lesson on significant figures (round a product or quotient to as many significant figures as the least precise measurement) gives the same answer here: 4.2 has two significant figures, so 55 ft². That rule is a quick shortcut; computing the bounds, as above, is the reliable check of how much an answer can be trusted.

## Common mistakes

- *Using the full precision as the error.* To the nearest centimeter, the GPE is 0.5 cm, not 1 cm.
- *Ignoring trailing zeros.* 12.00 s and 12 s are different measurements.
- *Mixing the bounds.* The smallest area comes from multiplying the two lower bounds, the largest from the two upper bounds.
- *Dividing by the wrong number in percent error.* Divide by the true value, not the measured one.
- *Reporting every calculator digit.* An answer can't be more precise than the measurements behind it.
- *Confusing precise with accurate.* A finely marked tool can still give wrong readings.

## Key points

- Precision: the unit a measurement was rounded to. Greatest possible error: half of it.
- A measurement $m$ with GPE $e$ lies between the lower bound $m - e$ and the upper bound $m + e$.
- Accuracy is closeness to the true value; precision is how finely the value is measured.
- Relative error $= \tfrac{\text{GPE}}{\text{measurement}}$; percent error $= \tfrac{|\text{measured} - \text{true}|}{\text{true}} \times 100\%$.
- Find bounds on an area or volume by computing with the lower bounds and with the upper bounds. Errors grow when measurements are multiplied.
- Round answers so they don't claim more precision than the measurements support.

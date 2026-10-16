---
id: pre-dec-basics
module: pre-m4
title: 'Decimals: place value, rounding and converting'
minutes: 25
topics: [Decimal place value, Fractions and decimals]
drills: [pre-dec-round, pre-frac-to-dec]
refs: [pre-ref-arithmetic]
---
## Fractions in disguise

Decimals are fractions whose denominators are 10, 100, 1,000 and so on, written using place value instead of a fraction bar. Prices, measurements and calculator results all come as decimals, so being able to read them, round them and switch between decimals and fractions is essential. This lesson extends the place value chart from Lesson 1 to the right of the ones place.

## Decimal place value

Each place to the right of the **decimal point** is worth one tenth of the place to its left, continuing the pattern from whole numbers:

| Hundreds | Tens | Ones | . | Tenths | Hundredths | Thousandths |
|---|---|---|---|---|---|---|
| 3 | 4 | 7 | . | 2 | 0 | 5 |

So 347.205 means $300 + 40 + 7 + \dfrac{2}{10} + \dfrac{0}{100} + \dfrac{5}{1000}$. The place names end in "-ths" to signal a fraction: tenths, hundredths, thousandths. A number written with a decimal point is a **decimal**.

*Reading decimals.* Read the whole part, say "and" for the point, then read the digits after the point as a whole number followed by the name of the last place. 347.205 is "three hundred forty-seven and two hundred five thousandths." 0.06 is "six hundredths." Reading this way tells you the fraction directly: 0.06 is $\tfrac{6}{100}$.

*Zeros.* Zeros at the end of a decimal don't change its value: $0.5 = 0.50 = 0.500$, because $\tfrac{5}{10} = \tfrac{50}{100} = \tfrac{500}{1000}$. Zeros between the point and other digits do matter: 0.05 is ten times smaller than 0.5. A zero in front of the point, as in 0.5, is just there to make the point visible.

## Comparing decimals

Line up the decimal points and compare place by place from the left, just as with whole numbers. Writing extra zeros at the end so both have the same number of decimal places helps.

### Example 1

Order 0.7, 0.069, 0.71 and 0.0709 from least to greatest.

Pad to four decimal places: 0.7000, 0.0690, 0.7100, 0.0709. Now compare as whole numbers of ten-thousandths: 690 < 709 < 7000 < 7100. So the order is 0.069, 0.0709, 0.7, 0.71.

A common trap is thinking 0.069 is bigger than 0.7 "because 69 is bigger than 7." Place value, not the count of digits, decides.

## Rounding decimals

Rounding works exactly as in Lesson 1: find the rounding digit, look one place to the right, round up on 5 or more, and then *drop* the digits after the rounding place (there's no need to replace them with zeros after a decimal point).

### Example 2

Round 14.3862 to the nearest hundredth.

The hundredths digit is 8. The next digit is 6, so round up: 14.39.

To the nearest tenth: the tenths digit is 3, the next digit 8, so 14.4. To the nearest whole number: the ones digit is 4, the next digit 3, so 14.

Money is usually rounded to the nearest cent, which is the nearest hundredth of a dollar.

## Decimals to fractions

Read the decimal, write it as a fraction with the matching power of ten as the denominator, then simplify.

- $0.6 = \dfrac{6}{10} = \dfrac35$
- $0.45 = \dfrac{45}{100} = \dfrac{9}{20}$
- $2.125 = 2\dfrac{125}{1000} = 2\dfrac18$

The number of decimal places equals the number of zeros in the denominator.

## Fractions to decimals

Since $\tfrac ab = a \div b$, divide the numerator by the denominator. Put a decimal point after the numerator, add zeros as needed, and do long division.

### Example 3

Write $\dfrac{3}{8}$ as a decimal.

$3 \div 8$: 8 doesn't go into 3, so write 3.000. 8 into 30 is 3 (24, remainder 6); 8 into 60 is 7 (56, remainder 4); 8 into 40 is 5 (exactly). So $\tfrac38 = 0.375$. The division stops, so this is a **terminating decimal**.

### Example 4

Write $\dfrac{5}{11}$ as a decimal.

$5.0000 \div 11$: 11 into 50 is 4 (44, remainder 6); 11 into 60 is 5 (55, remainder 5); 11 into 50 is 4 again… The remainders cycle 6, 5, 6, 5, so the digits 4 and 5 repeat forever: $\tfrac5{11} = 0.454545\ldots$. This is a **repeating decimal**, written with a bar over the repeating block: $0.\overline{45}$.

Why must a fraction's decimal either stop or repeat? When you divide by $b$, the only possible remainders are $0, 1, \ldots, b - 1$. If you ever get remainder 0 the decimal stops. If not, within $b$ steps some remainder must come back, and from then on the digits repeat.

A fraction in simplest form terminates exactly when its denominator has no prime factors other than 2 and 5 (the primes in 10). So $\tfrac{3}{8}$, $\tfrac{7}{20}$ and $\tfrac{9}{25}$ terminate, while $\tfrac13$, $\tfrac{5}{6}$ and $\tfrac{2}{7}$ repeat.

### Fractions worth memorizing

| Fraction | Decimal | Fraction | Decimal |
|---|---|---|---|
| $\tfrac12$ | 0.5 | $\tfrac15$ | 0.2 |
| $\tfrac14$ | 0.25 | $\tfrac18$ | 0.125 |
| $\tfrac34$ | 0.75 | $\tfrac1{10}$ | 0.1 |
| $\tfrac13$ | $0.\overline{3}$ | $\tfrac23$ | $0.\overline{6}$ |
| $\tfrac16$ | $0.1\overline{6}$ | $\tfrac19$ | $0.\overline{1}$ |

## Decimals on the number line

Decimals fill in the spaces between integers. To place 2.37, note it is between 2.3 and 2.4, a bit closer to 2.4.

```numberline
{"x": [2.2, 2.5], "points": [{"at": [2.3, 0], "label": "2.3"}, {"at": [2.37, 0], "label": "2.37"}, {"at": [2.4, 0], "label": "2.4"}], "caption": "2.37 lies between 2.3 and 2.4"}
```

Negative decimals follow the integer rules: $-2.37$ is to the left of $-2.3$, so $-2.37 < -2.3$.

## Common mistakes

- *Judging size by number of digits:* $0.45 > 0.375$ even though 375 > 45.
- *Reading the wrong place:* 0.07 is seven hundredths, $\tfrac{7}{100}$, not $\tfrac{7}{10}$.
- *Replacing dropped decimal digits with zeros when rounding:* 3.1416 to the nearest hundredth is 3.14, not 3.1400 (that's equal to 3.14 but suggests more precision than you have).
- *Dividing the wrong way:* $\tfrac38$ is $3 \div 8 = 0.375$, not $8 \div 3$.
- *Treating a repeating decimal as exact after a few digits:* $0.33$ is not $\tfrac13$; $0.\overline{3}$ is.

## Key points

- Places after the point: tenths, hundredths, thousandths; each is $\tfrac{1}{10}$ of the one before.
- Compare decimals by lining up points and padding with zeros.
- Round as with whole numbers, then drop digits past the rounding place.
- Decimal → fraction: write over a power of 10 and simplify. Fraction → decimal: divide.
- A simplified fraction terminates if its denominator's only prime factors are 2 and 5; otherwise it repeats.

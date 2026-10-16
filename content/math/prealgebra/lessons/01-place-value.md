---
id: pre-place-value
module: pre-m1
title: Place value, rounding and estimation
minutes: 20
topics: [Place value, Rounding]
drills: [pre-digit-value, pre-round-whole]
refs: [pre-ref-arithmetic]
---
## Where we start

Everything in this course rests on one idea: the way we write numbers. Before you can add fractions, solve equations or convert units, you need to read a number like 4,072,315 and know exactly what each digit is worth. This lesson covers place value, how to write numbers in different forms, how to compare them, and how to round and estimate. Rounding and estimation come back in every later module as a way to check whether an answer is reasonable.

## Digits and place value

Our number system uses ten **digits**: 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9. With only ten symbols we can write any number, because the *position* of a digit tells you what it is worth. This is **place value**. Each place is worth ten times the place to its right:

| Millions | Hundred thousands | Ten thousands | Thousands | Hundreds | Tens | Ones |
|---|---|---|---|---|---|---|
| 4 | 0 | 7 | 2 | 3 | 1 | 5 |

So in 4,072,315 the 7 is in the ten thousands place, and its **value** is 7 × 10,000 = 70,000. The 2 is worth 2,000, and the 5 is worth just 5. The same digit can be worth wildly different amounts depending on where it sits.

Why ten? Because we group by tens. Ten ones make a ten, ten tens make a hundred, ten hundreds make a thousand. When a place fills up past 9 we carry into the next place; that is exactly what "carrying" in addition is.

The **whole numbers** are 0, 1, 2, 3, and so on with no end. The commas in large numbers split the digits into groups of three, called periods (ones, thousands, millions, billions), which makes them easier to read aloud. 4,072,315 is read "four million, seventy-two thousand, three hundred fifteen." Notice that we never say "and" for a whole number; in careful usage "and" marks a decimal point.

A zero in a number is a **placeholder**. In 4,072,315 the 0 in the hundred thousands place says "there are no hundred thousands here," and it keeps the 4 in the millions place. Without it you would have 472,315, a completely different number.

## Standard form and expanded form

A number written with digits in the usual way, like 4,072,315, is in **standard form**. Writing it as the sum of the values of its digits gives **expanded form**:

$$4{,}072{,}315 = 4{,}000{,}000 + 70{,}000 + 2{,}000 + 300 + 10 + 5$$

Expanded form makes place value visible, and it is the hidden reason the usual methods for adding and multiplying work: you are really working with each place separately.

### Example 1

What is the value of the digit 6 in 3,816,904, and how would you write the number in expanded form?

Count places from the right: 4 is ones, 0 is tens, 9 is hundreds, 6 is thousands. So the 6 is worth 6 × 1,000 = 6,000.

Expanded form, one term per nonzero digit: 3,000,000 + 800,000 + 10,000 + 6,000 + 900 + 4. The zero in the tens place contributes nothing, so it has no term.

## Comparing whole numbers

To compare two whole numbers, first count digits: a number with more digits is larger (as long as there are no leading zeros). If they have the same number of digits, compare place by place from the left, and the first place where they differ decides. We write the result with the symbols $<$ ("is less than") and $>$ ("is greater than"). The symbol always opens toward the larger number: $58{,}312 > 58{,}231$ because the two numbers agree in the ten thousands and thousands places, and in the hundreds place 3 beats 2.

On a **number line**, larger numbers sit farther to the right, so "greater than" means "to the right of."

```numberline
{"x": [0, 10], "points": [{"at": [3, 0], "label": "3"}, {"at": [7, 0], "label": "7"}], "caption": "7 is to the right of 3, so 7 > 3"}
```

## Rounding

Rounding replaces a number with a nearby "friendlier" number that has zeros in the lower places. To **round** to a given place:

1. Find the digit in the place you are rounding to (the *rounding digit*).
2. Look at the digit just to its right.
3. If that digit is 5 or more, add 1 to the rounding digit. If it is 4 or less, leave the rounding digit alone.
4. Replace every digit to the right of the rounding place with 0.

Why does this work? Rounding 3,846 to the nearest hundred asks: is 3,846 closer to 3,800 or to 3,900? The halfway point is 3,850. Anything below 3,850 is closer to 3,800 and anything at or above it goes to 3,900. The digit to the right of the hundreds place, here 4, tells you which side of halfway you are on. The rule that exactly 5 rounds up is a convention so everyone gets the same answer.

```numberline
{"x": [3795, 3905], "points": [{"at": [3800, 0], "label": "3,800"}, {"at": [3850, 0], "open": true}, {"at": [3846, 0], "label": "3,846"}, {"at": [3900, 0], "label": "3,900"}], "caption": "The open dot is the halfway point 3,850; 3,846 is just left of it, so it rounds down to 3,800"}
```

### Example 2

Round 7,962,581 to the nearest ten thousand.

The ten thousands digit is 6 (in 7,962,581 the places from the right are ones 1, tens 8, hundreds 5, thousands 2, ten thousands 6). The digit to its right is 2, which is less than 5, so the 6 stays. Replace everything to its right with zeros: 7,960,000.

### Example 3

Round 49,973 to the nearest hundred.

The hundreds digit is 9; the digit to its right is 7, so we round up. Adding 1 to 9 makes 10, so we write 0 in the hundreds place and carry 1 into the thousands place: 49,973 becomes 50,000. Rounding can ripple to the left just like carrying in addition. Check with the halfway idea: 49,973 lies between 49,900 and 50,000, and it is past the halfway point 49,950, so 50,000 is right.

## Estimation

To **estimate** is to find an approximate answer, usually by rounding each number first so the arithmetic is easy. Estimating is how you catch mistakes: if you calculate 412 × 19 and get 78,280, a quick estimate of 400 × 20 = 8,000 tells you something went wrong (the real answer is 7,828).

A common habit is *front-end rounding*: round each number to its largest place, so 412 becomes 400 and 19 becomes 20. Estimates are not exact, so use the word "about" or the symbol $\approx$ ("is approximately equal to").

### Example 4

A school buys 38 laptops at $589 each. About how much is that?

Round 38 to 40 and 589 to 600: 40 × 600 = 24,000, so about $24,000. (The exact cost is $22,382. The estimate is a bit high because both numbers were rounded up.)

## Common mistakes

- *Counting places from the left.* Place names are counted from the right, starting at ones. In 52,817 the hundreds digit is 8 (ones 7, tens 1, hundreds 8).
- *Looking at the wrong digit to decide.* When rounding to the nearest thousand, only the hundreds digit decides; the digits further right don't matter. 6,499 rounds to 6,000, not 7,000, even though "the 9s push it up" feels tempting.
- *Forgetting the zeros.* Rounding 3,846 to the nearest hundred gives 3,800, not 38.
- *Dropping a placeholder zero* when writing a number from words. "Five million, forty thousand, seven" is 5,040,007.
- *Not carrying when the rounding digit is 9.* 49,973 to the nearest hundred is 50,000, not 49,1000.

## Key points

- Each place is worth ten times the place to its right; a digit's value is the digit times its place.
- Expanded form writes a number as the sum of its digits' values.
- Compare numbers by digit count, then place by place from the left.
- To round, look one place to the right of the rounding place: 5 or more rounds up, 4 or less stays.
- Estimate by rounding first; use estimates to check exact answers.

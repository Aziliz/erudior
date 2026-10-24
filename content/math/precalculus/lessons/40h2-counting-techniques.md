---
id: pc-m9-h-counting
module: pc-m9
title: 'Counting techniques: repetition, overlaps and pigeons'
minutes: 45
honors: true
topics: [Advanced counting]
drills: [pc-m9-r2-multiset, pc-m9-r2-stars-bars, pc-m9-r2-incl-excl]
refs: [pc-ref-matrices-series]
---
## When the basic formulas don't fit

Lesson 40 counted ordered arrangements with $_nP_r$ and unordered selections with $\binom nr$. Both assume the objects are all different and each is used at most once. Real counting problems break these assumptions all the time: the letters of a word repeat, scoops of ice cream can be the same flavor, and the things being counted overlap. This lesson adds four tools that handle those cases: arrangements with repeated objects, "stars and bars", the inclusion–exclusion principle, and the pigeonhole principle. Each comes with a reason, not just a formula, because in counting the reasoning is what keeps you from counting something twice or not at all.

## Arrangements with repeated objects

How many different strings can be made by rearranging the letters of BOOK? If the two O's were different (say $\text{O}_1$ and $\text{O}_2$), there would be $4! = 24$ arrangements. But swapping $\text{O}_1$ and $\text{O}_2$ doesn't change the string, so the 24 arrangements come in pairs that look the same. The answer is $\frac{24}{2!} = 12$.

The same "divide out the duplicates" idea gives the general rule. If $n$ objects consist of $n_1$ identical objects of one kind, $n_2$ of a second kind, …, $n_k$ of a $k$th kind (with $n_1 + \dots + n_k = n$), the number of distinct arrangements in a row is

$$\frac{n!}{n_1!\,n_2!\cdots n_k!}.$$

This is a **multinomial coefficient**. With only two kinds it is the binomial coefficient $\binom{n}{n_1} = \frac{n!}{n_1!\,n_2!}$: arranging $n_1$ A's and $n_2$ B's is the same as choosing which $n_1$ of the $n$ positions get an A.

### Example 1

How many distinct arrangements of the letters of MISSISSIPPI are there?

There are 11 letters: one M, four I's, four S's and two P's. So

$$\frac{11!}{1!\,4!\,4!\,2!} = \frac{39{,}916{,}800}{1 \cdot 24 \cdot 24 \cdot 2} = 34{,}650.$$

### Example 2: paths on a grid

A taxi drives on a street grid from corner $A$ to corner $B$, which is 5 blocks east and 3 blocks north, always moving east (E) or north (N). How many shortest routes are there?

Every shortest route is a string of 5 E's and 3 N's, such as EENENNEE, and every such string is a route. So the count is $\frac{8!}{5!\,3!} = \binom83 = 56$.

```shape
{"segments": [{"from": [0, 0], "to": [5, 0]}, {"from": [0, 1], "to": [5, 1]}, {"from": [0, 2], "to": [5, 2]}, {"from": [0, 3], "to": [5, 3]}, {"from": [0, 0], "to": [0, 3]}, {"from": [1, 0], "to": [1, 3]}, {"from": [2, 0], "to": [2, 3]}, {"from": [3, 0], "to": [3, 3]}, {"from": [4, 0], "to": [4, 3]}, {"from": [5, 0], "to": [5, 3]}, {"from": [0, 0], "to": [2, 0], "arrow": true}, {"from": [2, 0], "to": [2, 1], "arrow": true}, {"from": [2, 1], "to": [3, 1], "arrow": true}, {"from": [3, 1], "to": [3, 3], "arrow": true}, {"from": [3, 3], "to": [5, 3], "arrow": true}], "points": [{"at": [0, 0], "label": "A"}, {"at": [5, 3], "label": "B"}], "caption": "One of the 56 shortest routes: E E N E N N E E."}
```

How many of those routes pass through the corner 2 east and 1 north? Count in two stages: $\binom31 = 3$ routes to that corner, then $\binom52 = 10$ routes from it to $B$ (3 E's and 2 N's), so $3 \cdot 10 = 30$ routes. The other $56 - 30 = 26$ avoid it.

## Stars and bars

A bakery has 4 kinds of cookies. How many ways can you buy a box of 10 cookies? Only the *number* of each kind matters, and kinds can repeat, so neither $_nP_r$ nor $\binom nr$ applies directly.

Here is the trick. Draw the 10 cookies as stars and separate the four kinds with 3 bars:

![Ten stars split by three bars into groups of 3, 0, 5 and 2. The groups count the cookies of kinds 1, 2, 3 and 4; two bars side by side mean kind 2 gets none.](images/pc-m9-stars-bars.svg)

The picture $\star\star\star\,|\,|\,\star\star\star\star\star\,|\,\star\star$ means 3 of kind 1, none of kind 2, 5 of kind 3 and 2 of kind 4. Every box matches exactly one row of 10 stars and 3 bars, and every such row matches one box. A row has 13 positions, and choosing which 3 hold the bars settles everything, so there are $\binom{13}{3} = 286$ boxes.

In general, the number of ways to place $n$ identical objects into $k$ different groups (empty groups allowed) is the **stars and bars** count

$$\binom{n + k - 1}{k - 1}.$$

Equivalently, it is the number of solutions of $x_1 + x_2 + \dots + x_k = n$ in nonnegative integers.

### Example 3

How many ways can 10 identical cookies be given to 4 children if every child gets at least one?

Give each child one cookie first. That leaves 6 cookies to place freely among 4 children: $\binom{6 + 3}{3} = \binom93 = 84$ ways.

## Inclusion–exclusion

Lesson 40's addition rule, $|A \cup B| = |A| + |B| - |A \cap B|$, subtracts the overlap that was counted twice. With three sets the corrections alternate:

$$|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|.$$

Why add the triple overlap back? Follow one element that lies in all three sets. The first three terms count it 3 times, the three pair terms subtract it 3 times, so without the last term it would be counted 0 times. Adding $|A \cap B \cap C|$ counts it exactly once. (Elements in exactly one or exactly two sets are also counted once; check them yourself.) The general rule for any number of sets, adding and subtracting the overlaps in turn, is the **inclusion–exclusion principle**.

![A Venn diagram of three overlapping circles labeled divisible by 2, divisible by 3 and divisible by 5 inside a rectangle of the numbers 1 to 1000. The seven regions hold 267, 134, 67, 133, 67, 33 and 33 numbers, and 266 numbers lie outside all circles.](images/pc-m9-venn3.svg)

### Example 4

How many of the integers from 1 to 1000 are divisible by 2, 3 or 5?

Let $A$, $B$, $C$ be the multiples of 2, 3 and 5. The number of multiples of $m$ up to 1000 is $\lfloor 1000/m \rfloor$ (round down), and a number divisible by both 2 and 3 is a multiple of 6:

- $|A| = 500$, $|B| = 333$, $|C| = 200$;
- $|A \cap B| = 166$ (multiples of 6), $|A \cap C| = 100$ (of 10), $|B \cap C| = 66$ (of 15);
- $|A \cap B \cap C| = 33$ (multiples of 30).

So $|A \cup B \cup C| = 1033 - 332 + 33 = 734$, and the other $1000 - 734 = 266$ numbers are divisible by none of them.

### Example 5: nobody gets their own hat

Four people check their hats, and the hats are handed back at random. In how many of the $4! = 24$ orders does nobody get their own hat?

An arrangement in which no object stays in its own place is a **derangement**. Count the "bad" orders, where at least one person gets their own hat, by inclusion–exclusion. Orders in which one particular person gets their hat: $3!$, and there are $\binom41$ choices of person. Orders fixing two particular people: $2!$, with $\binom42$ choices of the pair. And so on:

$$\binom41 3! - \binom42 2! + \binom43 1! - \binom44 0! = 24 - 12 + 4 - 1 = 15.$$

So $24 - 15 = 9$ orders are derangements. The same reasoning for $n$ people gives

$$D_n = n!\left(1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \dots + \frac{(-1)^n}{n!}\right),$$

so $D_5 = 44$ and $D_6 = 265$. The bracket approaches $\frac1e \approx 0.368$ as $n$ grows (a fact from calculus), so for any sizable group the chance that nobody gets their own hat is about 37%, almost the same for 10 people as for 1000.

## The pigeonhole principle

If more than $k$ pigeons fly into $k$ holes, some hole gets at least two pigeons. Stated with numbers, the **pigeonhole principle** says: if $N$ objects go into $k$ boxes, some box holds at least $\lceil N/k \rceil$ objects (the round-up of $N/k$). It counts nothing exactly, yet it proves that something *must* happen.

- Among any 13 people, two were born in the same month (13 people, 12 months).
- Among any 367 people, two share a birthday (counting February 29, there are 366 possible birthdays).
- If 50 students take a test graded A to F (5 grades), some grade is earned by at least $\lceil 50/5 \rceil = 10$ students.

### Example 6

Prove that if you choose any 6 different numbers from 1 to 10, two of them add up to 11.

Make 5 boxes from the pairs that add to 11: $\{1, 10\}$, $\{2, 9\}$, $\{3, 8\}$, $\{4, 7\}$, $\{5, 6\}$. Every number from 1 to 10 is in exactly one box. Six numbers in 5 boxes means some box holds two of the chosen numbers, and those two add to 11. (With only 5 numbers it can fail: $1, 2, 3, 4, 5$.) The hard part of a pigeonhole proof is choosing the boxes.

## Common mistakes

- *Dividing by the wrong factorials.* In $\frac{n!}{n_1!\cdots n_k!}$ every kind gets a factorial, including those with count 1 (which contribute $1! = 1$), and the counts must add to $n$.
- *Swapping the stars-and-bars numbers.* With $n$ objects and $k$ groups there are $k - 1$ bars: $\binom{n + k - 1}{k - 1}$, not $\binom{n + k}{k}$.
- *Using stars and bars for different objects.* It counts identical objects; 10 *different* books into 4 boxes is $4^{10}$.
- *Stopping inclusion–exclusion too early.* With three sets, forgetting to add back $|A \cap B \cap C|$ undercounts.
- *Using the wrong overlap.* Multiples of both 4 and 6 are multiples of 12 (the least common multiple), not of 24.
- *Expecting pigeonhole to count.* It shows that some box is crowded, not which one.

## Key points

- Arrangements of $n$ objects with $n_1, \dots, n_k$ identical copies: $\frac{n!}{n_1!\cdots n_k!}$. Grid paths are arrangements of E's and N's.
- $n$ identical objects into $k$ groups: $\binom{n + k - 1}{k - 1}$ (stars and bars).
- Inclusion–exclusion: add the single sets, subtract the pairwise overlaps, add the triple overlap, and so on.
- A derangement leaves nothing in its place; $D_4 = 9$, and $D_n / n! \to \frac1e$.
- Pigeonhole: $N$ objects in $k$ boxes put at least $\lceil N/k \rceil$ in some box.

---
id: bio-chromosomes
module: bio-m5
title: Chromosomes, karyotypes, and chi-square
minutes: 40
topics: [Chromosomal disorders, Chi-square test]
drills: [bio-chi-square, bio-chi-square-121, bio-chi-square-multi]
refs: [bio-ref-genetics]
---
Lesson 20 linked a gene to a chromosome. This lesson zooms out to whole chromosomes: how biologists look at a full set, what happens when a cell ends up with too many or too few, and what that means for health. It closes the module with a tool you will need whenever you test a genetic prediction against real data: the chi-square test, which tells you whether a difference between observed and expected counts is small enough to be chance.

## Karyotypes

A **karyotype** is an organized picture of all the chromosomes in one cell, arranged in pairs by size, centromere position and banding pattern. To make one, a lab grows cells (often white blood cells), adds a chemical that stops division in metaphase, when chromosomes are most condensed, then spreads, stains and photographs them. The stain gives each chromosome a characteristic pattern of light and dark bands, so each pair can be identified.

A typical human karyotype has 46 chromosomes: 22 pairs of autosomes, numbered 1 to 22 from roughly largest to smallest, and the sex chromosomes, XX or XY. It is written as 46,XX or 46,XY. Karyotypes can reveal an extra or missing chromosome and large structural changes such as a missing or moved piece; small changes inside a single gene need DNA methods (module 6).

## Nondisjunction and aneuploidy

In meiosis, homologous chromosomes separate in anaphase I and sister chromatids separate in anaphase II. Occasionally a pair fails to separate. This failure is **nondisjunction**. Both copies then go to one daughter cell and none to the other.

- Nondisjunction in meiosis I: all four gametes are abnormal. Two have an extra chromosome (n + 1 = 24 in humans) and two lack one (n − 1 = 22).
- Nondisjunction in meiosis II: two gametes are normal, one is n + 1 and one is n − 1.

If an abnormal gamete is fertilized by a normal one, the zygote has 47 or 45 chromosomes. Having an abnormal number of one or more chromosomes is **aneuploidy**. Three copies of a chromosome is a trisomy; one copy (where there should be two) is a monosomy.

Most aneuploidies of autosomes are not compatible with development and end in early miscarriage. A few are seen in people:

| Karyotype | Condition | About how common |
|---|---|---|
| 47,+21 (trisomy 21) | Down syndrome: intellectual disability of varying degree, characteristic facial features, higher risk of heart defects | about 1 in 700 births |
| 47,+18 or 47,+13 | Trisomy 18 (Edwards) or 13 (Patau): severe developmental effects; most affected infants live less than a year | rare |
| 45,X | Turner syndrome: short stature, ovaries that don't develop typically | about 1 in 2,500 female births |
| 47,XXY | Klinefelter syndrome: often taller, reduced fertility; many people are never diagnosed | about 1 in 500 to 1,000 male births |

The risk of trisomy 21 rises with the age of the egg-producing parent, because human egg cells stay paused partway through meiosis I from before birth until ovulation, sometimes for 40 years or more. Sex-chromosome aneuploidies tend to have milder effects than autosomal ones; in females one X is largely inactivated in each cell, which buffers changes in X number, and the Y carries few genes.

Not every case of Down syndrome is a simple trisomy. In a few percent of cases, extra chromosome 21 material is attached to another chromosome (a translocation).

### Example 1

A sperm cell formed after nondisjunction of the sex chromosomes in meiosis I fertilizes a normal egg (23,X). What karyotypes can the zygote have?

In meiosis I the X and Y fail to separate, so the gametes are either 24,XY (both sex chromosomes) or 22 with no sex chromosome.

- 24,XY sperm + 23,X egg → 47,XXY (Klinefelter syndrome).
- 22 sperm (no sex chromosome) + 23,X egg → 45,X (Turner syndrome).

If nondisjunction happened instead in meiosis II of a sperm cell carrying the X, gametes 24,XX and 22 would form, giving 47,XXX or 45,X.

## Changes in chromosome structure and number of sets

Pieces of chromosomes can also break and rejoin wrongly:

- deletion: a segment is lost (for example, cri-du-chat syndrome, a deletion on chromosome 5);
- duplication: a segment is repeated;
- inversion: a segment is flipped end to end;
- translocation: a segment moves to a different, non-homologous chromosome.

Some organisms have whole extra sets of chromosomes, called polyploidy. It is usually lethal in animals but common in plants: bread wheat has six sets (hexaploid), and many cultivated strawberries have eight. Polyploid plants are often larger, and polyploidy has produced many new plant species.

## Testing a prediction: the chi-square test

Back to counting offspring. Mendel's F2 for seed shape was 5474 round : 1850 wrinkled, not exactly 3 : 1. Is that close enough? Chance alone always produces some deviation, as with coin flips. The **chi-square test** measures how far observed counts are from the counts a hypothesis predicts and tells you whether that gap is reasonably explained by chance.

The steps:

1. State the hypothesis being tested (the null hypothesis), for example "the offspring follow a 3 : 1 ratio." It always predicts specific numbers.
2. Compute the expected count $E$ for each category: total × predicted fraction.
3. For each category compute $\dfrac{(O - E)^2}{E}$, where $O$ is the observed count, and add them:
$$\chi^2 = \sum \frac{(O - E)^2}{E}$$
4. Find the degrees of freedom: number of categories − 1.
5. Compare $\chi^2$ with the critical value for that number of degrees of freedom at $p = 0.05$.

| Degrees of freedom | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Critical value ($p = 0.05$) | 3.84 | 5.99 | 7.81 | 9.49 |

- If $\chi^2$ is less than the critical value, the deviation is small enough to be chance. We fail to reject the hypothesis: the data are consistent with it.
- If $\chi^2$ is greater than or equal to the critical value, a deviation this large would happen by chance less than 5% of the time if the hypothesis were true. We reject the hypothesis and look for another explanation.

Why square the differences? So that positive and negative deviations both count, and big ones count more. Why divide by $E$? A difference of 10 is huge if you expected 20, trivial if you expected 2000. And always use counts, never percentages: the test depends on sample size.

```plot
{"x": [0, 14], "y": [0, 0.27], "xLabel": "chi-square value", "yLabel": "probability density", "functions": [{"f": "chi2pdf(x, 3)", "label": "df = 3"}], "shade": [{"f": "chi2pdf(x, 3)", "from": 7.81, "to": 14}], "segments": [{"from": [7.81, 0], "to": [7.81, 0.2], "dashed": true}], "labels": [{"at": [9.5, 0.05], "text": "5% of area"}], "caption": "If the hypothesis is true, chi-square values beyond 7.81 (df = 3) happen only 5% of the time"}
```

### Example 2

Test Mendel's seed-shape data (5474 round, 1850 wrinkled) against a 3 : 1 ratio.

Total: 7324. Expected: round $\tfrac34 \times 7324 = 5493$; wrinkled $\tfrac14 \times 7324 = 1831$.

| | O | E | O − E | (O − E)² / E |
|---|---|---|---|---|
| Round | 5474 | 5493 | −19 | 0.066 |
| Wrinkled | 1850 | 1831 | 19 | 0.197 |

$\chi^2 = 0.066 + 0.197 = 0.26$. There are 2 categories, so df = 1 and the critical value is 3.84. Since $0.26 < 3.84$, we fail to reject: the data fit 3 : 1 well.

### Example 3

Test Mendel's dihybrid data (315, 108, 101, 32) against 9 : 3 : 3 : 1.

Total: 556. Expected: $\tfrac{9}{16} \times 556 = 312.75$, $\tfrac{3}{16} \times 556 = 104.25$ (twice), $\tfrac{1}{16} \times 556 = 34.75$.

$$\chi^2 = \frac{2.25^2}{312.75} + \frac{3.75^2}{104.25} + \frac{(-3.25)^2}{104.25} + \frac{(-2.75)^2}{34.75} = 0.016 + 0.135 + 0.101 + 0.218 = 0.47$$

Four categories, df = 3, critical value 7.81. $0.47 < 7.81$: fail to reject. The data are consistent with independent assortment.

### Example 4

A student test-crosses a heterozygous fruit fly and expects 1 : 1. Of 200 offspring, 128 show the dominant trait and 72 the recessive trait. Is this consistent with 1 : 1?

Expected: 100 and 100. $\chi^2 = \dfrac{28^2}{100} + \dfrac{(-28)^2}{100} = 7.84 + 7.84 = 15.68$. With df = 1, the critical value is 3.84, and $15.68 > 3.84$, so we reject the 1 : 1 hypothesis. Something besides chance is going on: perhaps flies with the recessive phenotype survive less well, or the parent was not the genotype assumed. The test says that the data don't fit the hypothesis; it doesn't say why.

## Common mistakes

- Running chi-square on percentages or ratios instead of raw counts.
- Using the number of categories as the degrees of freedom; it is categories − 1.
- Dividing by $O$ instead of $E$.
- Saying the test "proves" a hypothesis. Failing to reject means the data are consistent with it, not that it is certainly true.
- Confusing nondisjunction in meiosis I (all four gametes abnormal) with meiosis II (half of them normal).
- Thinking a karyotype can detect any genetic condition. It shows chromosome number and large structural changes, not single-gene alleles such as the one for cystic fibrosis.

## Key points

- A karyotype shows a cell's chromosomes in pairs; typical humans are 46,XX or 46,XY.
- Nondisjunction makes gametes with n + 1 or n − 1 chromosomes; the zygote is aneuploid (trisomy 21, 45,X, 47,XXY).
- Structural changes: deletion, duplication, inversion, translocation. Polyploidy (extra full sets) is common in plants.
- $\chi^2 = \sum (O - E)^2/E$ on counts; df = categories − 1.
- Critical values at $p = 0.05$: 3.84, 5.99, 7.81, 9.49 for df 1–4. Below: fail to reject; at or above: reject.

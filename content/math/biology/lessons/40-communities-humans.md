---
id: bio-communities-humans
module: bio-m10
title: Communities, biomes, biodiversity, and human impact
minutes: 40
topics: [Community ecology, Biomes, Biodiversity, Human impact]
drills: [bio-diversity-index]
refs: [bio-ref-evolution-ecology]
---
## From one population to many

The last lesson treated each population on its own, growing until limiting factors held it near carrying capacity. But many of those limiting factors are other species: the predator that eats you, the competitor that takes your food, the parasite inside you. This lesson looks at how species in a community interact, how communities change over time, how they are spread across Earth's biomes, how biologists measure their diversity, and how human activity is changing all of it.

## Niches and competition

A species' **niche** is its role in the community: what it eats, where and when it feeds, the temperatures and moisture it tolerates, what eats it. If the habitat is a species' address, the niche is its job.

When two species need the same limited resource, they compete, and both are harmed. In the 1930s G. F. Gause grew two *Paramecium* species separately; each thrived. Grown together on the same food, one always drove the other out. This led to the competitive exclusion principle: two species cannot share exactly the same niche in the same place indefinitely. One will outcompete the other, or the two will evolve to use resources differently.

Robert MacArthur's 1958 study of five warbler species in New England spruce forests showed the second outcome. All five eat insects in the same trees, but each feeds mostly in a different zone: treetops, outer branches, inner branches, lower trunk. Dividing a resource this way is called resource partitioning.

## Predation, herbivory, and symbiosis

In **predation**, one organism (the predator) kills and eats another (the prey). Herbivory, an animal eating plants, is similar. Predator and prey populations often rise and fall in linked cycles. Fur-trading records of the Hudson's Bay Company, kept for about a century, show snowshoe hare and lynx numbers peaking roughly every 10 years, lynx peaks trailing hare peaks. More hares feed more lynx; more lynx (and over-browsed winter food) then drive hares down; with fewer hares, lynx starve and decline, and the cycle repeats. Field experiments in Yukon later showed that food supply and predators together drive the hare cycle.

```plot
{"x": [0, 30], "y": [0, 120], "xLabel": "time (years)", "yLabel": "relative abundance", "functions": [{"f": "60 + 45*sin(2*pi*x/10)", "label": "prey (hares)"}, {"f": "35 + 20*sin(2*pi*(x - 2)/10)", "label": "predators (lynx)", "dashed": true}], "caption": "Idealized predator–prey cycles: predator peaks lag about 2 years behind prey peaks"}
```

Predators and prey also drive each other's evolution: camouflage, speed, toxins and mimicry are products of this arms race.

Long-term close relationships between species are called symbiosis. There are three main types, classified by who benefits:

| Interaction | Species A | Species B | Example |
|---|---|---|---|
| **Mutualism** | + | + | Rhizobium bacteria fix nitrogen for legumes and get sugar; bees get nectar and pollinate flowers |
| **Commensalism** | + | 0 | Barnacles riding on a whale get transport to food; the whale is basically unaffected |
| **Parasitism** | + | − | Tapeworms, ticks and the malaria parasite feed on a host, usually without killing it quickly |
| Competition | − | − | Lions and hyenas competing for the same prey |
| Predation | + | − | A heron eating a frog |

A parasite usually lives on or in its host and feeds on it over a long time; a predator kills its prey outright.

## Keystone species

Some species matter far more than their numbers suggest. In the 1960s Robert Paine repeatedly removed the predatory sea star *Pisaster* from a stretch of rocky shore in Washington State and left a neighboring stretch alone. Without the sea star, mussels it normally ate took over the rock, crowding out other organisms; the number of species in his plot fell from 15 to 8 within a few years. A species like *Pisaster*, whose removal causes a large change in the community, is a **keystone species**, named after the top stone that holds an arch together. Sea otters, which keep sea urchins from destroying kelp forests, are another well-studied example.

## Ecological succession

Communities change over time in fairly predictable ways after a disturbance. **Ecological succession** is that gradual replacement of species.

- Primary succession begins where there is no soil: bare rock after a lava flow, or ground exposed by a retreating glacier. Pioneer species such as lichens and mosses colonize first; they break down rock and add organic matter, slowly forming soil that grasses, then shrubs, then trees can use.
- Secondary succession follows a disturbance that leaves soil in place: a wildfire, a hurricane, or an abandoned farm field. It is much faster, because seeds, roots and soil organisms survive. An abandoned field in the eastern United States can pass from weeds to grasses and shrubs to young forest within a few decades.

Older textbooks described succession ending in a fixed "climax community." Ecologists now see mature communities as dynamic: small disturbances (a fallen tree, a patch fire) keep resetting parts of them.

## Biomes

A **biome** is a large region with a characteristic climate and the community of organisms adapted to it. Temperature and precipitation are the main factors that decide which biome develops.

| Biome | Climate | Typical life |
|---|---|---|
| Tropical rainforest | Hot all year; over about 200 cm of rain | Tall broadleaf evergreens; the most species of any land biome |
| Savanna | Warm; long dry season | Grasses with scattered trees; large grazers |
| Desert | Under about 25 cm of rain per year | Cacti and other succulents; nocturnal animals |
| Temperate grassland | Cold winters, hot summers; moderate rain; fires | Grasses with deep roots; bison, prairie dogs |
| Temperate deciduous forest | Four seasons; rain spread through the year | Trees that drop leaves in fall (oak, maple) |
| Boreal forest (taiga) | Long, cold winters; short summers | Conifers (spruce, fir); moose, lynx |
| Tundra | Very cold; permafrost; little precipitation | Mosses, lichens, low shrubs; no trees |

Aquatic systems are classified by salinity, depth and light instead: freshwater lakes and rivers, wetlands, estuaries where rivers meet the sea, coral reefs, and the open ocean.

## Measuring biodiversity

**Biodiversity** is the variety of life at three levels: genetic diversity within species, species diversity within communities, and ecosystem diversity across a region. Species diversity has two parts. Richness is the number of species. Evenness is how equally the individuals are spread among them. A forest with five tree species in equal numbers feels more diverse than one that is 96% one species, even though both have five species.

**Simpson's diversity index** combines both. If a sample has $N$ individuals in total and $n$ of them belong to a given species:

$$D = 1 - \frac{\sum n(n-1)}{N(N-1)}$$

The fraction is the probability that two individuals picked at random (without replacement) are the same species. So $D$ is the probability that they are *different* species. $D$ ranges from 0 (one species only) toward 1 (many, evenly spread species).

### Example 1

Two ponds each contain 30 snails of three species. Pond A has 10, 10 and 10. Pond B has 26, 2 and 2. Compare their diversity.

Both: $N(N-1) = 30 \times 29 = 870$.

1. Pond A: $\sum n(n-1) = 3 \times (10 \times 9) = 270$. $D = 1 - \tfrac{270}{870} = 0.69$.
2. Pond B: $\sum n(n-1) = 26 \times 25 + 2 \times 1 + 2 \times 1 = 654$. $D = 1 - \tfrac{654}{870} = 0.25$.

Same richness, very different diversity: Pond B is dominated by one species, so it scores much lower.

### Example 2

A researcher removes an introduced fish from three lakes and leaves three similar lakes alone. After two years, native frog numbers have risen in the removal lakes and stayed low in the others. The fish eat tadpoles. Which interaction is this, and what does the control show?

1. The fish benefits and the frog is harmed, and the fish kills and eats its victims: predation (+/−).
2. The untouched lakes rule out other explanations, such as a good year for frogs everywhere. Only removing the predator changed frog numbers.

## Human impact

A 2019 global assessment by IPBES (the Intergovernmental Science-Policy Platform on Biodiversity and Ecosystem Services) estimated that about 1 million plant and animal species are at risk of extinction. The IUCN Red List (2025) classifies more than 45,000 of roughly 170,000 assessed species as threatened. The main drivers:

- *Habitat loss* is the largest. Clearing forests, draining wetlands and converting land to farms and cities removes the places species live and splits what remains into isolated fragments. About 6.7 million hectares of tropical primary forest were lost in 2024, a record year driven largely by fires.
- *Climate change.* Rising greenhouse gases (lesson 39) have warmed Earth: 2024 was the warmest year on record, about 1.5 °C above the late-1800s average. Species ranges are shifting toward the poles and up mountains, spring events are happening earlier, and warmer, more acidic oceans are bleaching coral reefs.
- **Invasive species**: species introduced to a new region, where they spread and cause harm, often because their natural predators and competitors are missing. Examples include zebra mussels in the Great Lakes, the brown tree snake that wiped out most of Guam's forest birds, and Burmese pythons in the Florida Everglades. A 2023 IPBES report found invasive species played a part in about 60% of recorded extinctions.
- *Pollution and overexploitation.* Some pollutants build up in organisms. Because each predator eats many prey and stores the toxin in its fat, the concentration rises at each trophic level, which is called biomagnification. DDT thinned the eggshells of bald eagles and other birds of prey; after the United States banned it in 1972, eagles recovered and were removed from the endangered list in 2007. Overfishing removes individuals faster than populations can replace them.

Conservation works on the same causes: protected areas and wildlife corridors connecting habitat fragments, restoration of damaged ecosystems, control of invasive species, cleaner energy, and laws such as the US Endangered Species Act (1973).

## Common mistakes

- Swapping commensalism (+/0) and mutualism (+/+). Ask whether the second species gains anything.
- Thinking a keystone species must be common or large. Keystone means large effect, not large numbers.
- Confusing primary and secondary succession. The difference is whether soil is present at the start.
- Treating species richness as the whole of diversity. Evenness matters too, which is what Simpson's index measures.
- Thinking biomagnification means a toxin becomes more toxic. It becomes more concentrated.

## Key points

- Competition (−/−), predation and parasitism (+/−), mutualism (+/+), commensalism (+/0).
- Two species cannot occupy the same niche indefinitely; resource partitioning lets similar species coexist.
- Keystone species have effects far out of proportion to their abundance.
- Primary succession starts without soil; secondary succession starts with soil.
- Climate (temperature and precipitation) determines biomes.
- Simpson's index $D = 1 - \sum n(n-1)/[N(N-1)]$ measures richness and evenness together.
- Habitat loss, climate change, invasive species, pollution and overexploitation are the main threats to biodiversity.

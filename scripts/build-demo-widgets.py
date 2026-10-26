#!/usr/bin/env python3
"""Writes samples/demo-maps-timelines-sims.json: a small course that shows every map, timeline
and simulation feature (lesson blocks and question kinds). Import it from the Library to try
them. Run: python3 scripts/build-demo-widgets.py"""

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

US_MAP = """```map
base: us
title: The Louisiana Purchase (1803)
view: fit
region: Arkansas, Missouri, Iowa, Oklahoma, Kansas, Nebraska | All of the state
region: Minnesota, North Dakota, South Dakota, Montana, Wyoming, Colorado, New Mexico, Texas, Louisiana | Part of the state
point: St. Louis | 38.63, -90.20
point: New Orleans | 29.95, -90.07
route: Lewis and Clark | 38.63, -90.20; 41.26, -95.93; 47.30, -101.03; 47.50, -111.30; 45.92, -111.51; 44.97, -113.44; 46.40, -117.00; 46.13, -123.88 | Lewis and Clark's route west
caption: The United States bought this land from France for $15 million. Today's state borders are drawn for reference.
```"""

WORLD_MAP = """```map
base: world
title: The Silk Road
view: fit
region: China | Start of the route
region: Turkey | End of the route
point: Xi'an | 34.34, 108.94
point: Dunhuang | 40.14, 94.66
point: Kashgar | 39.47, 75.99
point: Samarkand | 39.65, 66.96
point: Baghdad | 33.31, 44.36
point: Constantinople | 41.01, 28.98
route: Silk Road | 34.34, 108.94; 40.14, 94.66; 39.47, 75.99; 39.65, 66.96; 37.66, 62.19; 33.31, 44.36; 36.20, 36.16; 41.01, 28.98
label: Taklamakan Desert | 38.3, 83.5
caption: Traders carried silk, spices, paper and ideas along these routes for more than a thousand years.
```"""

SVG_MAP = """```map
title: Our school (a map drawn in an SVG)
svg: <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
  <rect id="library" data-name="Library" x="10" y="10" width="150" height="90"/>
  <rect data-name="Gym" x="170" y="10" width="220" height="120"/>
  <rect data-name="Office" x="10" y="110" width="90" height="100"/>
  <rect data-name="Cafeteria" x="110" y="140" width="280" height="70"/>
</svg>
region: Library | Quiet places
point: Main door | 105, 215
labels: all
caption: Course authors can draw their own maps: any shape with a name becomes a place.
```"""

GEOJSON = {
    "type": "FeatureCollection",
    "features": [
        {"type": "Feature", "properties": {"name": "Colorado"}, "geometry": {"type": "Polygon", "coordinates": [[[-109.05, 37], [-102.04, 37], [-102.04, 41], [-109.05, 41], [-109.05, 37]]]}},
        {"type": "Feature", "properties": {"name": "Wyoming"}, "geometry": {"type": "Polygon", "coordinates": [[[-111.05, 41], [-104.05, 41], [-104.05, 45], [-111.05, 45], [-111.05, 41]]]}},
    ],
}
GEOJSON_MAP = f"""```map
title: Two rectangle states (a map from GeoJSON)
geojson: {json.dumps(GEOJSON)}
region: Colorado | Colorado
region: Wyoming | Wyoming
point: Denver | 39.74, -104.99
point: Cheyenne | 41.14, -104.82
caption: Colorado and Wyoming are both close to rectangles. (Their real borders follow lines of latitude and longitude, which curve a little on a globe.)
```"""

ROME = """```timeline
title: Ancient Rome
era: 753–509 BCE | Kingdom
era: 509–27 BCE | Republic
era: 27 BCE – 476 CE | Empire (in the west)
event: c. 753 BCE | Rome is founded (the traditional date) | Rome
event: 264–146 BCE | The Punic Wars against Carthage | Wars
event: March 15, 44 BCE | Julius Caesar is killed | Rome
event: 27 BCE | Augustus becomes the first emperor | Rome
event: 79 CE | Mount Vesuvius buries Pompeii | Rome
event: 117 CE | The empire is at its largest, under Trajan | Rome
event: 395 CE | The empire splits for good into east and west | Rome
event: 476 CE | The last emperor in the west is removed | Rome
caption: Dates before the year 1 count down: 44 BCE is 44 years before year 1 CE. There was no year 0.
```"""

SPACE = """```timeline
title: The space race
event: October 4, 1957 | Sputnik 1, the first satellite | Soviet Union
event: April 12, 1961 | Yuri Gagarin is the first person in space | Soviet Union
event: May 5, 1961 | Alan Shepard is the first American in space | United States
event: February 20, 1962 | John Glenn orbits Earth | United States
event: June 16, 1963 | Valentina Tereshkova is the first woman in space | Soviet Union
event: March 18, 1965 | Alexei Leonov makes the first spacewalk | Soviet Union
event: July 20, 1969 | Apollo 11 lands on the Moon | United States
```"""

DEEP_TIME = """```timeline
title: Life on Earth
event: 4.54 billion years ago | Earth forms
event: c. 3.5 billion years ago | The oldest signs of life
event: 538.8 million years ago | The Cambrian explosion begins
event: 66 million years ago | The dinosaurs (except birds) die out
event: 300,000 years ago | The first modern humans
caption: Very old dates count back from today.
```"""

PROJECTILE = """```sim projectile
title: How far does it go?
speed: 20
angle: 30 [5, 85]
fixed: gravity
caption: Try 30° and 60° at the same speed. What do you notice? Then find the angle that sends the ball farthest.
```"""

PENDULUM = """```sim pendulum
title: What sets a pendulum's beat?
length: 1
angle: 15
caption: Change the angle a little, then the length. Which one changes the period? (For big angles the measured period is a bit longer than the formula says.)
```"""

CIRCUIT = """```sim circuit
voltage: 9
r1: 10
r2: 20
caption: In series the current is the same everywhere and the voltages add up to the battery's. In parallel every resistor gets the full voltage and the currents add up.
```"""

GAS = """```sim gas
temperature: 300
volume: 25
amount: 1
caption: Halve the volume: what happens to the pressure? Then switch the graph and heat the gas.
```"""

POP = """```sim population
caption: Rabbits and foxes rise and fall in turn. Why do the foxes peak after the rabbits?
```"""

LOGISTIC = """```sim population
title: Growth with limited food
model: logistic
fixed: model
```"""

lessons = [
    {
        "id": "maps",
        "module": "m1",
        "title": "Maps",
        "minutes": 10,
        "topics": ["Maps"],
        "quiz": ["map-colorado", "map-iberia", "map-south-america", "map-st-louis"],
        "body": "Maps in lessons can shade places, mark points and draw routes. Point at a place (or move with the arrow keys) to see its name; zoom with + and −.\n\n"
        + US_MAP + "\n\n" + WORLD_MAP + "\n\n## Your own maps\n\n" + SVG_MAP + "\n\n" + GEOJSON_MAP + "\n",
    },
    {
        "id": "timelines",
        "module": "m1",
        "title": "Timelines",
        "minutes": 10,
        "topics": ["Timelines"],
        "quiz": ["tl-rome", "tl-space"],
        "body": "On a wide screen a timeline runs across the page: zoom in with +, and scroll sideways. On a phone (and in print) it's a list, oldest first.\n\n"
        + ROME + "\n\n" + SPACE + "\n\n" + DEEP_TIME + "\n",
    },
    {
        "id": "motion",
        "module": "m2",
        "title": "Simulations: motion",
        "minutes": 15,
        "topics": ["Motion"],
        "body": "Press **Play** to run a simulation, **Step** to move a little at a time and **Reset** to start again. The numbers update as it runs.\n\n" + PROJECTILE + "\n\n" + PENDULUM + "\n",
    },
    {
        "id": "systems",
        "module": "m2",
        "title": "Simulations: circuits, gases and populations",
        "minutes": 15,
        "topics": ["Circuits", "Gases", "Populations"],
        "body": "## Electric circuits\n\n" + CIRCUIT + "\n\n## Gas laws\n\n" + GAS + "\n\n## Populations\n\n" + POP + "\n\n" + LOGISTIC + "\n",
    },
]

questions = [
    {
        "id": "map-colorado",
        "topic": "Maps",
        "type": "map",
        "stem": "Click Colorado.",
        "map": "base: us",
        "targets": ["Colorado"],
        "explanation": "Colorado is the rectangle in the middle of the western states, south of Wyoming.",
    },
    {
        "id": "map-iberia",
        "topic": "Maps",
        "type": "map",
        "stem": "Pick the two countries on the Iberian Peninsula.",
        "map": "base: world\nview: 30, -15 to 55, 20",
        "targets": ["Spain", "Portugal"],
        "explanation": "Spain and Portugal share the Iberian Peninsula in southwestern Europe.",
    },
    {
        "id": "map-south-america",
        "topic": "Maps",
        "type": "map",
        "stem": "Name each numbered country.",
        "map": "base: world\nview: Brazil, Argentina, Peru, Chile",
        "marks": ["Brazil", "Argentina", "Peru"],
        "choices": ["Brazil", "Argentina", "Peru", "Chile"],
        "answer": [0, 1, 2],
        "explanation": "Brazil is the largest country in South America; Argentina is to its south and Peru is on the Pacific coast.",
    },
    {
        "id": "map-st-louis",
        "topic": "Maps",
        "type": "map",
        "stem": "Which dot is St. Louis, where the Missouri River meets the Mississippi?",
        "map": "base: us\nview: Missouri, Illinois, Louisiana, Colorado\npoint: St. Louis | 38.63, -90.20\npoint: Denver | 39.74, -104.99\npoint: Chicago | 41.88, -87.63\npoint: New Orleans | 29.95, -90.07",
        "targets": ["St. Louis"],
        "explanation": "St. Louis is on the Mississippi River in eastern Missouri.",
    },
    {
        "id": "tl-rome",
        "topic": "Timelines",
        "type": "timeline",
        "stem": "Place each event on the timeline.",
        "slots": ["44 BCE", "79 CE", "476 CE"],
        "choices": ["Julius Caesar is killed", "Mount Vesuvius buries Pompeii", "The last emperor in the west is removed", "Rome is founded (the traditional date)"],
        "answer": [0, 1, 2],
        "timeline": "era: 509–27 BCE | Republic\nera: 27 BCE – 476 CE | Empire",
        "explanation": "Caesar was killed in 44 BCE, near the end of the Republic; Pompeii was buried in 79 CE; the western empire ended in 476 CE. Rome's traditional founding date is 753 BCE.",
    },
    {
        "id": "tl-space",
        "topic": "Timelines",
        "type": "order",
        "stem": "Put these space firsts in time order, earliest first.",
        "choices": ["Sputnik 1, the first satellite", "Yuri Gagarin is the first person in space", "John Glenn orbits Earth", "Apollo 11 lands on the Moon"],
        "dates": ["October 4, 1957", "April 12, 1961", "February 20, 1962", "July 20, 1969"],
        "explanation": "The Soviet Union led the early firsts; the United States landed people on the Moon in 1969.",
    },
]

course = {
    "format": "examiner-course",
    "version": 1,
    "id": "demo-maps-timelines-sims",
    "title": "Demo: maps, timelines and simulations",
    "description": "A short sampler of interactive maps, timelines and science simulations in lessons, with map and timeline questions.",
    "author": "Erudior",
    "revision": 1,
    "modules": [{"id": "m1", "title": "Maps and timelines"}, {"id": "m2", "title": "Simulations"}],
    "lessons": lessons,
    "banks": [
        {
            "id": "questions",
            "title": "Questions",
            "exam": {"questionCount": 6, "timeLimitMinutes": 10, "passingPercent": 70},
            "questions": questions,
        }
    ],
}

out = ROOT / "samples" / "demo-maps-timelines-sims.json"
out.write_text(json.dumps(course, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"wrote {out.relative_to(ROOT)}")

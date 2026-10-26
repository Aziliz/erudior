// Place names for the built-in base maps, kept apart from the map shapes so grading a map
// question (and checking a course) never has to load geometry.
//
// The world map is Natural Earth 1:110m (via the world-atlas package), whose names are
// abbreviated ("Dem. Rep. Congo", "Bosnia and Herz."); WORLD_RENAME gives the full names
// students see. Aliases let authors write common short forms ("USA", "UK", "CO").

export type BaseMap = "world" | "us" | "none";

/** Natural Earth 110m name → the name shown to students. */
export const WORLD_RENAME: Record<string, string> = {
  "W. Sahara": "Western Sahara",
  "United States of America": "United States",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  Congo: "Republic of the Congo",
  "Dominican Rep.": "Dominican Republic",
  "Falkland Is.": "Falkland Islands",
  "Fr. S. Antarctic Lands": "French Southern and Antarctic Lands",
  "Central African Rep.": "Central African Republic",
  "Eq. Guinea": "Equatorial Guinea",
  eSwatini: "Eswatini",
  "Solomon Is.": "Solomon Islands",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  Macedonia: "North Macedonia",
  "S. Sudan": "South Sudan",
  "N. Cyprus": "Northern Cyprus",
};

/** Other names authors (or students picking from a list) may use, by normalized key. */
const WORLD_ALIASES: Record<string, string> = {
  "united states of america": "United States",
  usa: "United States",
  us: "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  america: "United States",
  "dr congo": "Democratic Republic of the Congo",
  drc: "Democratic Republic of the Congo",
  "congo-kinshasa": "Democratic Republic of the Congo",
  "congo kinshasa": "Democratic Republic of the Congo",
  zaire: "Democratic Republic of the Congo",
  congo: "Republic of the Congo",
  "congo-brazzaville": "Republic of the Congo",
  "congo brazzaville": "Republic of the Congo",
  swaziland: "Eswatini",
  macedonia: "North Macedonia",
  "czech republic": "Czechia",
  "ivory coast": "Côte d'Ivoire",
  "east timor": "Timor-Leste",
  burma: "Myanmar",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  britain: "United Kingdom",
  "great britain": "United Kingdom",
  "russian federation": "Russia",
  turkiye: "Turkey",
  "viet nam": "Vietnam",
  "south korea": "South Korea",
  "republic of korea": "South Korea",
  "north korea": "North Korea",
  persia: "Iran",
  holland: "Netherlands",
  "the netherlands": "Netherlands",
  "the bahamas": "Bahamas",
  "the gambia": "Gambia",
  uae: "United Arab Emirates",
  "western sahara": "Western Sahara",
  "bosnia": "Bosnia and Herzegovina",
};

/** USPS abbreviation → state name (50 states and DC; territories aren't on the US base map). */
export const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const US_ALIASES: Record<string, string> = {
  "washington dc": "District of Columbia",
  "washington, dc": "District of Columbia",
  "washington d.c.": "District of Columbia",
  "washington, d.c.": "District of Columbia",
  "d.c.": "District of Columbia",
  "washington state": "Washington",
  "new york state": "New York",
};

/** A comparison key: case, accents, curly quotes, extra spaces and a leading "the" don't matter. */
export function placeKey(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’ʼ`]/g, "'")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^the /, "");
}

/** The canonical name for a place on a base map ("CO" → "Colorado", "USA" → "United States"). */
export function canonicalPlace(base: BaseMap | string, name: string): string {
  const t = name.trim();
  const k = placeKey(t);
  if (base === "us") {
    const abbr = US_STATES[t.toUpperCase().replace(/\./g, "")];
    if (abbr && t.replace(/\./g, "").length === 2) return abbr;
    if (US_ALIASES[k]) return US_ALIASES[k];
    const hit = Object.values(US_STATES).find((s) => placeKey(s) === k);
    return hit ?? t;
  }
  if (base === "world") {
    if (WORLD_ALIASES[k]) return WORLD_ALIASES[k];
    const renamed = Object.entries(WORLD_RENAME).find(([from]) => placeKey(from) === k);
    if (renamed) return renamed[1];
  }
  return t;
}

/** Do two names mean the same place on this base map? */
export function samePlace(base: BaseMap | string, a: string, b: string): boolean {
  return placeKey(canonicalPlace(base, a)) === placeKey(canonicalPlace(base, b));
}

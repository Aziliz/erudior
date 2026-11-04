// Worker-safe canonical reading-library schema. No DOM, storage, or runtime imports.
export interface GlossaryEntry {
    term: string;
    definition: string;
    aliases?: string[];
    topic?: string;
}
/** A book, poem, play or document in the course's library, read in the app's reader. */
export interface ReaderText {
    id: string;
    title: string;
    author?: string;
    /** When it was written or first published, shown as given ("1862", "c. 1600"). */
    date?: string;
    /** prose (default) and document are Markdown; poem and play are line by line, with line numbers. */
    kind?: "prose" | "poem" | "play" | "document";
    /** Language of the text (BCP-47, e.g. "de-DE"); default: the course's language, else English. */
    lang?: string;
    /** Subject for the homeschool reading log (default: English language arts, or World languages). */
    subject?: string;
    /** Short Markdown introduction shown in the library and above the text. */
    about?: string;
    /** Edition or source, and its copyright status. */
    source?: string;
    /** Poems and plays: number every Nth line (default 5; 0 = no numbers). */
    lineNumbers?: number;
    /** Words explained for this text; [[term]] links look here first, then in the course glossary. */
    glossary?: GlossaryEntry[];
    sections: ReaderSection[];
}
/** A chapter, scene, poem or part of a text. */
export interface ReaderSection {
    id: string;
    title: string;
    /** Markdown (poems and plays: one line of the text per line). Footnotes: [^1] … [^1]: note. */
    body: string;
    /** Reading questions: ids of questions in the course's first bank. */
    questions?: string[];
}
export const READER_LIMITS = { texts: 100, sections: 500, body: 500000, short: 1000, about: 50000, glossary: 2000, aliases: 50, questions: 300, bytes: 8 * 1024 * 1024 } as const;
export interface ReaderValidationOptions {
    /** Publishing requires nonempty text/section titles and bodies. Drafts may be incomplete. */
    strict?: boolean;
    /** Explicit compatibility: missing titles are given existing legacy defaults; no entries/IDs are dropped or repaired. */
    legacy?: boolean;
    /** Only questions in the course's FIRST bank are available to the reader. */
    questionIds?: readonly string[];
}
const forbidden = new Set(["__proto__", "constructor", "prototype"]);
const idOK = (value: unknown): value is string => typeof value === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(value) && !forbidden.has(value);
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v) && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
/** Validate RAW content before normalization. Never coerces, mutates or drops fields. */
export function validateReaderTexts(raw: unknown, options: ReaderValidationOptions = {}): string[] {
    if (raw === undefined)
        return [];
    const errors: string[] = [], strict = options.strict !== false;
    const add = (path: string, message: string) => { if (errors.length < 100)
        errors.push(`${path}: ${message}`); };
    // Bound arbitrary raw JSON before traversing structured content, and reject prototype keys.
    const seen = new Set<object>();
    let nodes = 0;
    const inspect = (v: unknown, path: string, depth: number): boolean => {
        if (++nodes > 150000 || depth > 12) {
            add(path, "content exceeds structural bounds");
            return false;
        }
        if (v === null || typeof v === "boolean" || typeof v === "string" || typeof v === "number" && Number.isFinite(v))
            return true;
        if (!v || typeof v !== "object" || !Array.isArray(v) && !object(v)) {
            add(path, "must contain plain JSON values");
            return false;
        }
        if (seen.has(v)) {
            add(path, "cyclic or shared object");
            return false;
        }
        seen.add(v);
        for (const [key, value] of Object.entries(v)) {
            if (forbidden.has(key)) {
                add(path, "reserved property");
                return false;
            }
            if (!inspect(value, `${path}.${key}`, depth + 1))
                return false;
        }
        seen.delete(v);
        return true;
    };
    if (!inspect(raw, "texts", 0))
        return errors;
    if (new TextEncoder().encode(JSON.stringify(raw)).length > READER_LIMITS.bytes)
        return ["texts: library exceeds byte limit"];
    const shape = (v: unknown, keys: string[], path: string): v is Record<string, unknown> => {
        if (!object(v)) {
            add(path, "must be an object");
            return false;
        }
        for (const key of Object.keys(v))
            if (!keys.includes(key))
                add(`${path}.${key}`, "unsupported field");
        return true;
    };
    const text = (v: unknown, path: string, max: number = READER_LIMITS.short, required = false) => {
        if (typeof v !== "string" || v.length > max || required && strict && !v.trim())
            add(path, `must be ${required && strict ? "nonempty " : ""}text, at most ${max} characters`);
    };
    const optional = (v: Record<string, unknown>, key: string, path: string, max: number = READER_LIMITS.short) => { if (v[key] !== undefined)
        text(v[key], `${path}.${key}`, max); };
    const list = (v: unknown, path: string, max: number): v is unknown[] => { if (!Array.isArray(v) || v.length > max) {
        add(path, `must be an array of at most ${max}`);
        return false;
    } return true; };
    const uniqueId = (v: unknown, path: string, ids: Set<string>) => { if (!idOK(v))
        add(path, "invalid stable ID");
    else {
        if (ids.has(v))
            add(path, "Duplicate ID");
        ids.add(v);
    } };
    if (!list(raw, "texts", READER_LIMITS.texts))
        return errors;
    const ids = new Set<string>();
    raw.forEach((t, i) => {
        const p = `texts[${i}]`;
        if (!shape(t, ["id", "title", "author", "date", "kind", "lang", "subject", "about", "source", "lineNumbers", "glossary", "sections"], p))
            return;
        uniqueId(t.id, `${p}.id`, ids);
        if (!(options.legacy && t.title === undefined))
            text(t.title, `${p}.title`, READER_LIMITS.short, true);
        for (const key of ["author", "date", "subject", "source"])
            optional(t, key, p);
        optional(t, "about", p, READER_LIMITS.about);
        if (t.kind !== undefined && !["prose", "poem", "play", "document"].includes(t.kind as string))
            add(`${p}.kind`, "unknown reading kind");
        if (t.lang !== undefined && (typeof t.lang !== "string" || t.lang.length > 100 || !/^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/.test(t.lang)))
            add(`${p}.lang`, "invalid language tag");
        if (t.lineNumbers !== undefined && (typeof t.lineNumbers !== "number" || !Number.isInteger(t.lineNumbers) || t.lineNumbers < 0 || t.lineNumbers > 1000))
            add(`${p}.lineNumbers`, "must be an integer from 0 to 1000");
        if (t.glossary !== undefined && list(t.glossary, `${p}.glossary`, READER_LIMITS.glossary)) {
            const terms = new Set<string>();
            t.glossary.forEach((g, j) => {
                const q = `${p}.glossary[${j}]`;
                if (!shape(g, ["term", "definition", "aliases", "topic"], q))
                    return;
                text(g.term, `${q}.term`, READER_LIMITS.short, true);
                text(g.definition, `${q}.definition`, READER_LIMITS.about, true);
                optional(g, "topic", q);
                if (typeof g.term === "string" && g.term.trim()) {
                    const key = g.term.trim().toLocaleLowerCase("en-US");
                    if (terms.has(key))
                        add(q, "duplicate glossary term");
                    terms.add(key);
                }
                if (g.aliases !== undefined && list(g.aliases, `${q}.aliases`, READER_LIMITS.aliases))
                    g.aliases.forEach((a, k) => text(a, `${q}.aliases[${k}]`, READER_LIMITS.short, true));
            });
        }
        if (!list(t.sections, `${p}.sections`, READER_LIMITS.sections))
            return;
        if (strict && !t.sections.length)
            add(`${p}.sections`, "at least one section required");
        const sectionIds = new Set<string>();
        t.sections.forEach((s, j) => {
            const q = `${p}.sections[${j}]`;
            if (!shape(s, ["id", "title", "body", "questions"], q))
                return;
            uniqueId(s.id, `${q}.id`, sectionIds);
            if (!(options.legacy && s.title === undefined))
                text(s.title, `${q}.title`, READER_LIMITS.short, true);
            text(s.body, `${q}.body`, READER_LIMITS.body, true);
            if (s.questions !== undefined && list(s.questions, `${q}.questions`, READER_LIMITS.questions)) {
                const qids = new Set<string>();
                s.questions.forEach((id, k) => { uniqueId(id, `${q}.questions[${k}]`, qids); if (idOK(id) && options.questionIds && !options.questionIds.includes(id))
                    add(`${q}.questions[${k}]`, "question not found in first bank"); });
            }
            if (strict && typeof s.body === "string") {
                const defs = [...s.body.matchAll(/^\[\^([A-Za-z0-9_-]{1,20})\]:/gm)].map(m => m[1]);
                const refs = new Set([...s.body.replace(/^\[\^[^\]]*\]:/gm, "").matchAll(/\[\^([A-Za-z0-9_-]{1,20})\]/g)].map(m => m[1]));
                for (const id of refs)
                    if (!defs.includes(id))
                        add(`${q}.body`, `missing footnote ${id}`);
                for (const [k, id] of defs.entries()) {
                    if (defs.indexOf(id) !== k)
                        add(`${q}.body`, `duplicate footnote ${id}`);
                    if (!refs.has(id))
                        add(`${q}.body`, `unused footnote ${id}`);
                }
            }
        });
    });
    return errors;
}
export function normalizeValidatedReaderTexts(raw: unknown, options: ReaderValidationOptions = {}): ReaderText[] {
    const errors = validateReaderTexts(raw, options);
    if (errors.length)
        throw Error(`Invalid reading library: ${errors.join("; ")}`);
    const result: ReaderText[] = raw === undefined ? [] : JSON.parse(JSON.stringify(raw));
    if (options.legacy)
        for (const [index, t] of result.entries()) {
            if (t.title === undefined)
                t.title = `Text ${index + 1}`;
            t.sections.forEach((s, i) => { if (s.title === undefined)
                s.title = `Part ${i + 1}`; });
        }
    return result;
}
/** Published reading identities cannot disappear or move to another section/text. */
export function readerRevisionProblems(previous: readonly ReaderText[], next: readonly ReaderText[]): string[] {
    const errors: string[] = [];
    for (const t of previous) {
        const current = next.find(n => n.id === t.id);
        if (!current) {
            errors.push(`text ${t.id}: published ID removed`);
            continue;
        }
        for (const s of t.sections) {
            const section = current.sections.find(n => n.id === s.id);
            if (!section) {
                errors.push(`text ${t.id} section ${s.id}: published ID removed or reassigned`);
                continue;
            }
            for (const id of s.questions ?? [])
                if (!section.questions?.includes(id))
                    errors.push(`text ${t.id} section ${s.id}: published question ${id} removed or reassigned`);
        }
    }
    return errors;
}

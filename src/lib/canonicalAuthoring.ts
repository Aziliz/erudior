import { validateReaderMarkdownAssets, readerMarkdownParts } from './readerMarkdownAssets';
import { validateImageAsset } from "./imageAssets";
import { validateLessonSource, validateInteractiveQuestion, validateFigureSpec } from "./lessonSource";
import { validateCourseAudioFields, validateQuestionAudioFields, validateVocabAudioFields } from "./courseAudio";
import type { Drill } from "./exerciseTypes";
/** Versioned, lossless authored course envelope. Never grants publication authority. */
import type { Course, Bank } from "./courseContentTypes";
import { courseWorkRevisionProblems, courseWorkLessonRevisionProblems, normalizeValidatedCourseWork, validateCourseWork } from "./courseWork";
import { readerRevisionProblems, normalizeValidatedReaderTexts, validateReaderTexts } from "./readerContent";
import { branchingCourseProblems, branchingRevisionProblems } from "./branchingCoursePackage";
import { scientificCourseProblems, scientificRevisionProblems } from "./scientificCoursePackage";
import { advancedAssessmentCourseProblems, advancedAssessmentRevisionProblems } from "./advancedAssessmentCoursePackage";
import { validateAssignment } from "./spreadsheetAssignments";
import { drillError } from "./drills";
export type PortableAuthoredBank = Omit<Bank, "courseId">;
export type PortableAuthoredCourse = Omit<Course, "community" | "banks"> & {
    banks: PortableAuthoredBank[];
};
export interface CanonicalAuthoringPayload {
    format: "erudior-canonical-authoring";
    version: 1;
    course: PortableAuthoredCourse;
}
export interface CanonicalValidationContext {
    strict: boolean;
    course: PortableAuthoredCourse;
    mode?: "source" | "publication";
    /** Trusted deployment configuration only; never read from an authored payload. */
    communityImageOrigin?: string;
}
export interface CanonicalValidationOptions {
    strict?: boolean;
    maxBytes?: number;
    /** Local source validation may retain safe relative assets; publication requires embedded assets. */
    mode?: "source" | "publication";
    /** Trusted deployment configuration only; never read from an authored payload. */
    communityImageOrigin?: string;
}
export const CANONICAL_LIMITS = { bytes: 900 * 1024, nodes: 200000, items: 10000, text: 500000, short: 2000 } as const;
const RESERVED = new Set(["__proto__", "prototype", "constructor"]);
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v) && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
const validId = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(v) && !RESERVED.has(v);
const label = (value: unknown) => typeof value === 'string' ? value : '(invalid ID)';
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
/** Exact supported-field validation, not a permissive course normalizer. */
export function validateCanonicalAuthoring(raw: unknown, options: CanonicalValidationOptions = {}): string[] {
    const errors: string[] = [];
    const strict = options.strict !== false;
    const add = (path: string, message: string) => { if (errors.length < 150)
        errors.push(`${path}: ${message}`); };
    const checked = (path: string, validate: () => string[]) => { try {
        for (const e of validate())
            add(path, e);
    }
    catch {
        add(path, 'malformed content could not be validated');
    } };
    let nodes = 0;
    const ancestors = new Set<object>();
    function json(v: unknown, path: string, depth: number): boolean {
        if (++nodes > CANONICAL_LIMITS.nodes || depth > 24) {
            add(path, 'structural limit exceeded');
            return false;
        }
        if (v === null || typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number' && Number.isFinite(v))
            return true;
        if (!v || typeof v !== 'object' || !Array.isArray(v) && !isObject(v)) {
            add(path, 'plain JSON required');
            return false;
        }
        if (ancestors.has(v)) {
            add(path, 'cyclic content');
            return false;
        }
        ancestors.add(v);
        if (Array.isArray(v) && Object.keys(v).length !== v.length) {
            add(path, 'sparse or decorated array');
            return false;
        }
        for (const [k, x] of Object.entries(v)) {
            if (RESERVED.has(k)) {
                add(path, 'reserved key');
                return false;
            }
            if (!json(x, `${path}.${k}`, depth + 1))
                return false;
        }
        ancestors.delete(v);
        return true;
    }
    if (!json(raw, 'payload', 0))
        return errors;
    if (new TextEncoder().encode(JSON.stringify(raw)).length > (options.maxBytes ?? CANONICAL_LIMITS.bytes))
        return ['payload: byte limit exceeded'];
    function shape(v: unknown, keys: string[], path: string): v is Record<string, unknown> { if (!isObject(v)) {
        add(path, 'object required');
        return false;
    } for (const k of Object.keys(v))
        if (!keys.includes(k))
            add(`${path}.${k}`, 'unsupported or authority/runtime field'); return true; }
    function str(v: unknown, path: string, required = false, max: number = CANONICAL_LIMITS.text) { if (typeof v !== 'string' || v.length > max || strict && required && !v.trim())
        add(path, 'invalid text'); }
    function optionalStr(o: Record<string, unknown>, keys: string[], path: string) { for (const k of keys)
        if (o[k] !== undefined)
            str(o[k], `${path}.${k}`); }
    function boolean(o: Record<string, unknown>, keys: string[], path: string) { for (const k of keys)
        if (o[k] !== undefined && typeof o[k] !== 'boolean')
            add(`${path}.${k}`, 'boolean required'); }
    function integer(v: unknown, path: string, min = 0, max = 100000) { if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max)
        add(path, 'bounded integer required'); }
    function array(v: unknown, path: string, max = CANONICAL_LIMITS.items): v is unknown[] { if (!Array.isArray(v) || v.length > max) {
        add(path, 'bounded array required');
        return false;
    } return true; }
    function strings(v: unknown, path: string, ids = false) { if (!array(v, path))
        return; const seen = new Set<string>(); v.forEach((x, i) => { str(x, `${path}[${i}]`, true); if (ids) {
        if (!validId(x))
            add(path, 'invalid ID');
        else {
            if (seen.has(x))
                add(path, 'duplicate ID');
            seen.add(x);
        }
    } }); }
    function identity(v: unknown, path: string, ids: Set<string>) { if (!validId(v))
        add(path, 'invalid stable ID');
    else {
        if (ids.has(v))
            add(path, 'duplicate ID');
        ids.add(v);
    } }
    function objects(v: unknown, path: string, keys: string[], visit: (o: Record<string, unknown>, path: string) => void) { if (!array(v, path))
        return; const ids = new Set<string>(); v.forEach((x, i) => { const p = `${path}[${i}]`; if (!shape(x, keys, p))
        return; if (keys.includes('id'))
        identity(x.id, `${p}.id`, ids); visit(x, p); }); }
    function glossary(v: unknown, path: string) { objects(v, path, ['term', 'definition', 'aliases', 'topic'], (g, p) => { str(g.term, p + '.term', true); str(g.definition, p + '.definition', true); optionalStr(g, ['topic'], p); if (g.aliases !== undefined)
        strings(g.aliases, p + '.aliases'); }); }
    const top = ['format', 'version', 'id', 'title', 'description', 'author', 'updated', 'revision', 'changelog', 'disclaimer', 'requires', 'modules', 'lessons', 'banks', 'decks', 'glossary', 'references', 'drills', 'language', 'vocab', 'readingList', 'texts', 'calculator', 'readAloud', 'audio', 'rubrics', 'writing', 'labs', 'activityLog', 'spreadsheetAssignments', 'branchingScenarios', 'scientificWorkspaces', 'advancedAssessments'];
    if (!shape(raw, ['format', 'version', 'course'], 'payload'))
        return errors;
    if (raw.format !== 'erudior-canonical-authoring' || raw.version !== 1)
        add('payload', 'unsupported schema');
    if (!shape(raw.course, top, 'course'))
        return errors;
    const c = raw.course;
    if (c.format !== 'examiner-course' || c.version !== 1)
        add('course', 'unsupported course schema');
    identity(c.id, 'course.id', new Set());
    str(c.title, 'course.title', true);
    optionalStr(c, ['description', 'author', 'updated', 'changelog', 'disclaimer'], 'course');
    if (c.requires !== undefined) strings(c.requires,'course.requires',true);
    if (c.revision !== undefined)
        integer(c.revision, 'course.revision', 1);
    if (c.calculator !== undefined && !['basic', 'scientific', 'graphing', 'none'].includes(c.calculator as string))
        add('course.calculator', 'unknown calculator');
    boolean(c, ['readAloud'], 'course');
    const moduleIds = new Set<string>();
    const lessonIds = new Set<string>();
    const firstQuestions = new Set<string>();
    objects(c.modules, 'modules', ['id', 'title', 'honors', 'quiz'], (m, p) => { if (validId(m.id))
        moduleIds.add(m.id); str(m.title, p + '.title', true); boolean(m, ['honors'], p); if (m.quiz !== undefined)
        strings(m.quiz, p + '.quiz', true); });
    objects(c.lessons, 'lessons', ['id', 'module', 'title', 'honors', 'topics', 'minutes', 'body', 'drills', 'refs', 'quiz'], (l, p) => { if (validId(l.id))
        lessonIds.add(l.id); str(l.title, p + '.title', true); str(l.body, p + '.body'); if (!moduleIds.has(l.module as string))
        add(p + '.module', 'unknown module'); boolean(l, ['honors'], p); if (l.minutes !== undefined)
        integer(l.minutes, p + '.minutes', 0, 100000); for (const k of ['drills', 'refs', 'quiz'])
        if (l[k] !== undefined)
            strings(l[k], p + '.' + k, true); if (l.topics !== undefined)
        strings(l.topics, p + '.topics'); });
    if (strict) {
        const nonempty = (value:unknown) => Array.isArray(value) && value.length > 0;
        const hasContent = nonempty(c.lessons) || nonempty(c.drills) || nonempty(c.writing) || nonempty(c.labs) || nonempty(c.texts) || nonempty(c.references) || nonempty(c.glossary) || isObject(c.activityLog)
            || Array.isArray(c.banks) && c.banks.some(bank => isObject(bank) && nonempty(bank.questions))
            || Array.isArray(c.decks) && c.decks.some(deck => isObject(deck) && nonempty(deck.cards));
        if (!hasContent) add('course','publication requires learner content');
        if (Array.isArray(c.lessons)) for (const lesson of c.lessons) if (isObject(lesson) && !(typeof lesson.body === 'string' && lesson.body.trim()) && !nonempty(lesson.quiz)
            && !(Array.isArray(c.spreadsheetAssignments) && c.spreadsheetAssignments.some(a => isObject(a) && a.lessonId === lesson.id)) && !(Array.isArray(c.branchingScenarios) && c.branchingScenarios.some(a => isObject(a) && a.lessonId === lesson.id)) && !(Array.isArray(c.scientificWorkspaces) && c.scientificWorkspaces.some(a => isObject(a) && a.lessonId === lesson.id)) && !(Array.isArray(c.advancedAssessments) && c.advancedAssessments.some(a => isObject(a) && a.lessonId === lesson.id))) add('lesson '+label(lesson.id),'publication requires lesson content, questions, or a linked workbook');
    }
    const context: CanonicalValidationContext = { strict, course: c as unknown as PortableAuthoredCourse, mode: options.mode, communityImageOrigin: options.communityImageOrigin };
    const questionKeys = ['id', 'section', 'topic', 'type', 'stem', 'image', 'choices', 'answer', 'left', 'markers', 'accept', 'caseSensitive', 'lowestTerms', 'dates', 'map', 'targets', 'marks', 'slots', 'timeline', 'code', 'honors', 'model', 'target', 'explanation', 'listen', 'blend', 'audio'];
    let bankIndex = 0;
    objects(c.banks, 'banks', ['format', 'version', 'id', 'title', 'description', 'author', 'updated', 'sections', 'exam', 'questions'], (b, p) => {
        const index = bankIndex++;
        if (b.format !== 'examiner-bank' || b.version !== 1)
            add(p, 'unsupported bank schema');
        str(b.title, p + '.title', true);
        optionalStr(b, ['description', 'author', 'updated'], p);
        const sectionIds = new Set<string>();
        objects(b.sections, p + '.sections', ['id', 'name'], (s, q) => { if (validId(s.id))
            sectionIds.add(s.id); str(s.name, q + '.name', true); });
        if (shape(b.exam, ['questionCount', 'timeLimitMinutes', 'passingPercent', 'sectionQuotas', 'sectionPassing', 'sectionTimeLimits'], p + '.exam')) {
            integer(b.exam.questionCount, p + '.exam.questionCount', 1);
            integer(b.exam.timeLimitMinutes, p + '.exam.timeLimitMinutes', 1);
            if (typeof b.exam.passingPercent !== 'number' || b.exam.passingPercent <= 0 || b.exam.passingPercent > 100)
                add(p + '.exam.passingPercent', 'passing percent must be >0 and <=100');
            for (const k of ['sectionQuotas', 'sectionPassing', 'sectionTimeLimits'])
                if (b.exam[k] !== undefined) {
                    if (!isObject(b.exam[k]))
                        add(p + '.exam.' + k, 'object required');
                    else
                        for (const [id, value] of Object.entries(b.exam[k])) {
                            if (!sectionIds.has(id))
                                add(p + '.exam.' + k, 'unknown section');
                            if (k === 'sectionPassing') {
                                if (typeof value !== 'number' || value < 0 || value > 100)
                                    add(p + '.exam.' + k + '.' + id, 'percent must be 0–100');
                            }
                            else
                                integer(value, p + '.exam.' + k + '.' + id, 0, 100000);
                        }
                }
        }
        objects(b.questions, p + '.questions', questionKeys, (q, path) => {
            if (index === 0 && validId(q.id))
                firstQuestions.add(q.id);
            str(q.topic, path + '.topic');
            str(q.stem, path + '.stem', true);
            optionalStr(q, ['explanation', 'listen', 'map', 'timeline'], path);
            boolean(q, ['caseSensitive', 'lowestTerms', 'honors'], path);
            if (q.section !== undefined && !sectionIds.has(q.section as string))
                add(path + '.section', 'unknown bank section');
            if (q.type !== undefined && !['choice', 'text', 'match', 'label', 'order', 'model', 'map', 'timeline', 'code'].includes(q.type as string))
                add(path + '.type', 'unsupported question type');
            strings(q.choices, path + '.choices');
            if (array(q.answer, path + '.answer'))
                q.answer.forEach((a, i) => integer(a, `${path}.answer[${i}]`, 0, 10000));
            for (const k of ['left', 'dates', 'targets', 'marks', 'slots', 'blend'])
                if (q[k] !== undefined)
                    strings(q[k], path + '.' + k);
            if (q.accept !== undefined && array(q.accept, path + '.accept'))
                q.accept.forEach((a, i) => strings(a, `${path}.accept[${i}]`));
            if (q.markers !== undefined)
                objects(q.markers, path + '.markers', ['x', 'y'], (m, mp) => { for (const k of ['x', 'y'])
                    if (typeof m[k] !== 'number' || m[k] < 0 || m[k] > 100)
                        add(mp + '.' + k, 'position must be 0–100'); });
            if (q.image !== undefined && shape(q.image, ['src', 'alt', 'caption'], path + '.image')) {
                str(q.image.src, path + '.image.src', true);
                str(q.image.alt, path + '.image.alt', true);
                optionalStr(q.image, ['caption'], path + '.image');
                for (const e of typeof q.image.src==='string'?validateImageAsset(q.image.src, {mode:options.mode,communityImageOrigin:options.communityImageOrigin}):[]) add(path + '.image.src',e);
            }
            const kind = q.type ?? 'choice';
            const choices = Array.isArray(q.choices) ? q.choices : [];
            const answers = Array.isArray(q.answer) ? q.answer : [];
            if (kind === 'choice' && new Set(answers).size !== answers.length)
                add(path + '.answer', 'duplicate answer');
            if (['choice', 'match', 'label', 'timeline'].includes(kind as string) && answers.some(a => typeof a !== 'number' || a < 0 || a >= choices.length))
                add(path + '.answer', 'answer outside choices');
            if (strict && kind === 'choice' && (choices.length < 2 || !answers.length))
                add(path, 'choice needs two choices and an answer');
            if (strict && kind === 'order' && choices.length < 2)
                add(path, 'order needs two items');
            if (['text', 'model', 'code'].includes(kind as string) && answers.length)
                add(path + '.answer', 'must be empty for question type');
            if (['text', 'model', 'code'].includes(kind as string) && choices.length)
                add(path + '.choices', 'must be empty for question type');
            if(kind==='order'&&answers.length&&(answers.length!==choices.length||answers.some((a,i)=>a!==i)))add(path+'.answer','legacy order answers must be the identity sequence');
            if (kind === 'text' && strict) {
                const accept = Array.isArray(q.accept) ? q.accept : [];
                const blanks = typeof q.stem === 'string' ? (q.stem.match(/_{3,}/g)?.length ?? 0) : 0;
                if (!accept.length || accept.length !== (blanks || 1) || accept.some(a => !Array.isArray(a) || !a.length))
                    add(path + '.accept', 'accepted answers must cover every blank');
            }
            if (kind === 'match' && strict && (!Array.isArray(q.left) || !q.left.length || answers.length !== q.left.length))
                add(path, 'match answers must cover every left item');
            if (kind === 'label' && strict && (!q.image || !Array.isArray(q.markers) || !q.markers.length || answers.length !== q.markers.length))
                add(path, 'label needs image and an answer per marker');
            checked(path, () => validateInteractiveQuestion(q, context));
        });
    });
    const refs = (list: unknown, allowed: Set<string>, path: string) => { if (Array.isArray(list))
        for (const id of list)
            if (!allowed.has(id as string))
                add(path, `unresolved reference ${label(id)}`); };
    if (Array.isArray(c.modules))
        for (const m of c.modules)
            if (isObject(m))
                refs(m.quiz, firstQuestions, `module ${label(m.id)} quiz`);
    const drillIds = new Set<string>(), refIds = new Set<string>();
    objects(c.references, 'references', ['id', 'title', 'body'], (r, p) => { if (validId(r.id))
        refIds.add(r.id); str(r.title, p + '.title', true); str(r.body, p + '.body'); });
    const formats = ['money','money0','percent','number','integer','fraction','sci','num1','num2','num4','pct1','int','month','frac','texfrac','texsci','deg','coef','signed','signedcoef'];
    const numberFormat=(value:unknown)=>typeof value==='string'&&(formats.includes(value)||/^(?:dp[0-9]|sig[1-9])$/.test(value));
    const finite = (v: unknown, path: string, min = -Number.MAX_VALUE) => { if (typeof v !== 'number' || !Number.isFinite(v) || v < min)
        add(path, 'finite bounded number required'); };
    const stringMap = (v: unknown, path: string) => { if (!isObject(v))
        add(path, 'object required');
    else
        for (const [key, value] of Object.entries(v)) {
            if (!key.trim())
                add(path, 'empty key');
            str(value, path + '.' + key, true);
        } };
    objects(c.drills, 'drills', ['id', 'title', 'topic', 'vars', 'funcs', 'calc', 'where', 'prompt', 'answer', 'format', 'tolerance', 'answers', 'figure', 'solution'], (d, p) => {
        if (validId(d.id))
            drillIds.add(d.id);
        for (const key of ['title', 'prompt', 'answer', 'solution'])
            str(d[key], p + '.' + key, key !== 'answer');
        optionalStr(d, ['topic'], p);
        if (!numberFormat(d.format))
            add(p + '.format', 'unknown number format');
        if (d.tolerance !== undefined)
            finite(d.tolerance, p + '.tolerance', 0);
        if (!isObject(d.vars))
            add(p + '.vars', 'object required');
        else
            for (const [key, v] of Object.entries(d.vars)) {
                const q = p + '.vars.' + key;
                if (!validId(key))
                    add(q, 'invalid variable name');
                if (!isObject(v)) {
                    add(q, 'object required');
                    continue;
                }
                if ('choices' in v) {
                    shape(v, ['choices'], q);
                    if (array(v.choices, q + '.choices')) {
                        if (strict && !v.choices.length)
                            add(q, 'choices required');
                        for (const choice of v.choices) {
                            if (typeof choice === 'string')
                                str(choice, q, true);
                            else if (typeof choice === 'number')
                                finite(choice, q);
                            else if (shape(choice, ['label', 'value'], q)) {
                                str(choice.label, q + '.label');
                                finite(choice.value, q + '.value');
                            }
                        }
                    }
                }
                else {
                    shape(v, ['min', 'max', 'step'], q);
                    finite(v.min, q + '.min');
                    finite(v.max, q + '.max');
                    if (typeof v.min === 'number' && typeof v.max === 'number' && v.min > v.max)
                        add(q, 'min exceeds max');
                    if (v.step !== undefined && (typeof v.step !== 'number' || v.step <= 0))
                        add(q + '.step', 'positive step required');
                }
            }
        for (const key of ['funcs', 'calc'])
            if (d[key] !== undefined)
                stringMap(d[key], p + '.' + key);
        if (d.where !== undefined)
            strings(d.where, p + '.where');
        if (d.answers !== undefined)
            objects(d.answers, p + '.answers', ['name', 'label', 'kind', 'format', 'tolerance', 'relTolerance', 'sigfigs', 'lowestTerms', 'units', 'expression', 'variables', 'plusC', 'show'], (a, q) => {
                optionalStr(a, ['name', 'label', 'expression', 'show'], q);
                boolean(a, ['lowestTerms', 'plusC'], q);
                if (a.kind !== undefined && !['number', 'fraction', 'expression'].includes(a.kind as string))
                    add(q + '.kind', 'unknown answer kind');
                if (a.format !== undefined && !numberFormat(a.format))
                    add(q + '.format', 'unknown number format');
                for (const k of ['tolerance', 'relTolerance'])
                    if (a[k] !== undefined)
                        finite(a[k], q + '.' + k, 0);
                if (a.sigfigs !== undefined)
                    integer(a.sigfigs, q + '.sigfigs', 1, 100);
                if (a.variables !== undefined)
                    strings(a.variables, q + '.variables', true);
                if (a.units !== undefined) {
                    if (!isObject(a.units))
                        add(q + '.units', 'object required');
                    else
                        for (const [key, value] of Object.entries(a.units))
                            {
                            // Existing portable courses encode scientific conversion factors as numeric strings.
                            // Preserve their exact spelling while rejecting coercible objects and expressions.
                            const numeric = typeof value === 'string' && /^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/.test(value) ? Number(value) : value;
                            finite(numeric, q + '.units.' + key, 0);
                        }
                }
            });
        if (d.figure !== undefined)
            for (const figure of Array.isArray(d.figure) ? d.figure : [d.figure])
                for (const e of validateFigureSpec(figure, { variables: [...Object.keys(isObject(d.vars) ? d.vars : {}), ...Object.keys(isObject(d.calc) ? d.calc : {})], functions: Object.keys(isObject(d.funcs) ? d.funcs : {}).map(k => k.split('(')[0]) }))
                    add(p + '.figure', e);
        if (strict) {
            const e = drillError(d as unknown as Drill);
            if (e)
                add(p, e);
        }
    });
    if (Array.isArray(c.lessons))
        for (const l of c.lessons)
            if (isObject(l)) {
                refs(l.quiz, firstQuestions, `lesson ${label(l.id)} quiz`);
                refs(l.drills, drillIds, `lesson ${label(l.id)} drills`);
                refs(l.refs, refIds, `lesson ${label(l.id)} refs`);
            }
    objects(c.decks, 'decks', ['id', 'title', 'description', 'cards'], (d, p) => { str(d.title, p + '.title', true); optionalStr(d, ['description'], p); objects(d.cards, p + '.cards', ['id', 'front', 'back', 'topic'], (card, q) => { str(card.front, q + '.front', true); str(card.back, q + '.back', true); optionalStr(card, ['topic'], q); }); });
    glossary(c.glossary, 'glossary');
    if (c.language !== undefined && shape(c.language, ['code', 'name', 'tts', 'keys', 'ime', 'level', 'vocabTarget', 'vocabSource'], 'language')) {
        str(c.language.code, 'language.code', true);
        str(c.language.name, 'language.name', true);
        optionalStr(c.language, ['tts', 'ime', 'level', 'vocabSource'], 'language');
        if (c.language.keys !== undefined)
            strings(c.language.keys, 'language.keys');
        if (c.language.vocabTarget !== undefined)
            integer(c.language.vocabTarget, 'language.vocabTarget');
    }
    if (c.vocab !== undefined)
        objects(c.vocab, 'vocab', ['id', 'from', 'lesson', 'kind', 'term', 'alt', 'meanings', 'reading', 'pos', 'plural', 'example', 'exampleEn', 'note', 'audio', 'directions'], (v, p) => { str(v.term, p + '.term', true); strings(v.meanings, p + '.meanings'); if (strict && Array.isArray(v.meanings) && !v.meanings.length) add(p + '.meanings', 'at least one accepted meaning required'); if (!validId(v.lesson)) add(p+'.lesson','invalid stable lesson ID');
        else if (!lessonIds.has(v.lesson) && !(validId(v.from) && v.from !== c.id)) add(p+'.lesson','unknown local lesson');
        if(v.from!==undefined&&!validId(v.from))add(p+'.from','invalid source course ID'); optionalStr(v, ['from', 'reading', 'pos', 'plural', 'example', 'exampleEn', 'note', 'audio'], p); if (v.kind !== undefined && !['word', 'phrase', 'char'].includes(v.kind as string))
            add(p + '.kind', 'unknown vocabulary kind'); if (v.alt !== undefined)
            strings(v.alt, p + '.alt'); if (v.directions !== undefined && array(v.directions, p + '.directions'))
            for (const d of v.directions)
                if (!['meaning', 'recall'].includes(d as string))
                    add(p + '.directions', 'unknown direction'); });
    if (c.readingList !== undefined)
        objects(c.readingList, 'readingList', ['title', 'author', 'publisher', 'level', 'url', 'isbn', 'free', 'note'], (r, p) => { str(r.title, p + '.title', true); optionalStr(r, ['author', 'publisher', 'level', 'url', 'isbn', 'note'], p); boolean(r, ['free'], p); if (r.url !== undefined && (typeof r.url !== 'string' || !/^https?:\/\//i.test(r.url)))
            add(p + '.url', 'HTTP(S) URL required'); });
    for (const e of validateCourseWork(c, { strict, moduleIds: [...moduleIds] }))
        add('work', e);
    for (const e of validateReaderTexts(c.texts, { strict, questionIds: [...firstQuestions] }))
        add('texts', e);
    for (const issue of branchingCourseProblems(c.branchingScenarios, new Set(Array.isArray(c.lessons) ? c.lessons.filter(isObject).map(l=>String(l.id)) : []))) add('branchingScenarios',issue);
    for (const issue of scientificCourseProblems(c.scientificWorkspaces, new Set(Array.isArray(c.lessons) ? c.lessons.filter(isObject).map(l=>String(l.id)) : []))) add('scientificWorkspaces',issue);
    for (const issue of advancedAssessmentCourseProblems(c.advancedAssessments, new Set(Array.isArray(c.lessons) ? c.lessons.filter(isObject).map(l=>String(l.id)) : []))) add('advancedAssessments',issue);
    if (c.spreadsheetAssignments !== undefined && array(c.spreadsheetAssignments, 'spreadsheetAssignments')) {
        const seen = new Set<string>();
        for (const a of c.spreadsheetAssignments) {
            for (const e of validateAssignment(a))
                add('spreadsheetAssignments', e);
            if (isObject(a)) {
                shape(a, ['id', 'title', 'starter', 'protectedCells', 'answers', 'tolerance', 'lessonId'], 'spreadsheetAssignments');
                if (isObject(a.starter))
                    shape(a.starter, ['sheets'], 'spreadsheetAssignments.starter');
                identity(a.id, 'spreadsheetAssignments.id', seen);
                if (!lessonIds.has(a.lessonId as string))
                    add('spreadsheetAssignments.lessonId', 'unknown lesson');
            }
        }
    }
    for (const e of validateCourseAudioFields(c, 'course', { mode: options.mode }))
        add('audio', e);
    if (Array.isArray(c.banks))
        for (const b of c.banks)
            if (isObject(b) && Array.isArray(b.questions))
                for (const q of b.questions)
                    for (const e of validateQuestionAudioFields(q, 'question', { mode: options.mode }))
                        add('question audio', e);
    if (Array.isArray(c.vocab))
        for (const v of c.vocab)
            for (const e of validateVocabAudioFields(v, 'vocabulary', { mode: options.mode }))
                add('vocab audio', e);
    const markdown: string[] = [];
    if (Array.isArray(c.lessons))
        for (const l of c.lessons)
            if (isObject(l) && typeof l.body === 'string')
                markdown.push(l.body);
    const collect = (items: unknown, keys: string[]) => { if (Array.isArray(items))
        for (const item of items)
            if (isObject(item))
                for (const key of keys)
                    if (typeof item[key] === 'string')
                        markdown.push(item[key]); };
    // Only code prompts/hints use Markdown. Other question prose uses MathText;
    // code starter/solution and map/timeline question labels are likewise inert.
    if (Array.isArray(c.banks))
        for (const bank of c.banks)
            if (isObject(bank) && Array.isArray(bank.questions))
                for (const question of bank.questions)
                    if (isObject(question) && question.type === 'code') {
                        if (typeof question.stem === 'string') markdown.push(question.stem);
                        if (isObject(question.code) && Array.isArray(question.code.hints))
                            for (const hint of question.code.hints)
                                if (typeof hint === 'string') markdown.push(hint);
                    }
    collect(c.references, ['body']);
    collect(c.writing, ['prompt']);
    collect(c.drills, ['prompt', 'solution']);
    if (Array.isArray(c.decks))
        for (const deck of c.decks)
            if (isObject(deck))
                collect(deck.cards, ['front', 'back']);
    if (Array.isArray(c.texts))
        for (const t of c.texts)
            if (isObject(t)) {
                if (typeof t.about === 'string')
                    markdown.push(t.about);
                if (Array.isArray(t.sections))
                    for (const section of t.sections)
                        if (isObject(section) && typeof section.body === 'string') {
                            const kind = typeof t.kind === 'string' ? t.kind : undefined;
                            if (kind === 'poem' || kind === 'play')
                                checked('reader media', () => validateReaderMarkdownAssets(section.body as string, { ...context, kind }));
                            else for (const part of readerMarkdownParts(section.body)) markdown.push(part.source);
                        }
            }
    if (Array.isArray(c.labs))
        for (const lab of c.labs)
            if (isObject(lab)) {
                for (const key of ['intro', 'photoPrompt'])
                    if (typeof lab[key] === 'string')
                        markdown.push(lab[key]);
                collect(lab.steps, ['text']);
                collect(lab.questions, ['prompt']);
            }
    if (isObject(c.activityLog) && typeof c.activityLog.prompt === 'string')
        markdown.push(c.activityLog.prompt);
    for (const body of markdown)
        checked('lesson source', () => validateLessonSource(body, context));
    return errors;
}
export function courseFromCanonicalAuthoring(raw: unknown, options: CanonicalValidationOptions = {}): PortableAuthoredCourse { const errors = validateCanonicalAuthoring(raw, options); if (errors.length)
    throw Error(errors.join('; ')); return clone((raw as CanonicalAuthoringPayload).course); }
/** Already portable source only: no runtime/authority data accepted or silently removed. */
export function canonicalAuthoringFromCourse(course: unknown, options: CanonicalValidationOptions = {}): CanonicalAuthoringPayload { const payload = { format: 'erudior-canonical-authoring', version: 1, course }; const errors = validateCanonicalAuthoring(payload, options); if (errors.length)
    throw Error(errors.join('; ')); return clone(payload as CanonicalAuthoringPayload); }
/** Explicit runtime demotion. Reports removed provenance; callers must present it, never treat it as approval. */
export function demoteRuntimeCourse(course: Course, options: CanonicalValidationOptions = {}): {
    payload: CanonicalAuthoringPayload;
    removedCommunity: Course['community'];
} {
    const { community, ...authored } = clone(course);
    const banks = authored.banks.map(bank => { const { courseId, ...portable } = bank; if (courseId !== undefined) {
        if (courseId !== course.id || !bank.id.startsWith(course.id + '__'))
            throw Error('Inconsistent runtime bank namespace');
        portable.id = bank.id.slice(course.id.length + 2);
    } return portable; });
    return { payload: canonicalAuthoringFromCourse({ ...authored, banks }, options), removedCommunity: community };
}
/** Explicit runtime namespace adaptation; original payload remains the recovery/export source. */
export function runtimeCourseFromCanonicalAuthoring(raw: unknown, namespace: {
    id: string;
    revision: number;
    community?: Course['community'];
}, options: CanonicalValidationOptions = {}): Course {
    if (!validId(namespace.id) || !Number.isSafeInteger(namespace.revision) || namespace.revision < 1)
        throw Error('Invalid runtime namespace');
    if (namespace.community !== undefined) {
        const meta = namespace.community;
        if (!isObject(meta) || Object.keys(meta).some(key => !['id','version','review','author'].includes(key)) || !validId(meta.id) || meta.version !== namespace.revision || namespace.id !== `community-${meta.id}` || !['reviewed','not_reviewed'].includes(meta.review) || typeof meta.author !== 'string')
            throw Error('Inconsistent community runtime provenance');
    }
    const source = courseFromCanonicalAuthoring(raw, options);
    return { ...source, id: namespace.id, revision: namespace.revision, banks: source.banks.map(b => ({ ...b, id: `${namespace.id}__${b.id}`, courseId: namespace.id })), ...(namespace.community ? { community: clone(namespace.community) } : {}) };
}
/** Identity continuity for immutable community snapshots. Caller validates both payloads first. */
export function canonicalRevisionProblems(previous: CanonicalAuthoringPayload, next: CanonicalAuthoringPayload): string[] {
    const a = previous.course, b = next.course, errors: string[] = [];
    if (a.id !== b.id)
        errors.push('authored course ID cannot change');
    if ((b.revision ?? 1) < (a.revision ?? 1))
        errors.push('authored revision cannot decrease');
    function retain<T extends {
        id: string;
    }>(old: readonly T[], current: readonly T[], path: string) { for (const item of old)
        if (!current.some(n => n.id === item.id))
            errors.push(`${path}: published ID ${item.id} removed`); }
    function refs(old: readonly string[] | undefined, current: readonly string[] | undefined, path: string) { for (const id of old ?? [])
        if (!current?.includes(id))
            errors.push(`${path}: published reference ${id} removed or reassigned`); }
    retain(a.modules, b.modules, 'modules');
    retain(a.lessons, b.lessons, 'lessons');
    retain(a.banks, b.banks, 'banks');
    retain(a.decks, b.decks, 'decks');
    retain(a.references, b.references, 'references');
    retain(a.drills, b.drills, 'drills');
    retain(a.vocab ?? [], b.vocab ?? [], 'vocab');
    errors.push(...branchingRevisionProblems(a.branchingScenarios ?? [], b.branchingScenarios ?? []));
    errors.push(...scientificRevisionProblems(a.scientificWorkspaces ?? [], b.scientificWorkspaces ?? []));
    errors.push(...advancedAssessmentRevisionProblems(a.advancedAssessments ?? [], b.advancedAssessments ?? []));
    for(const old of a.branchingScenarios ?? []) { const next=b.branchingScenarios?.find(n=>n.id===old.id); if(next && next.lessonId!==old.lessonId) errors.push('branchingScenarios: published lesson reference changed'); }
    for(const old of a.scientificWorkspaces ?? []) { const next=b.scientificWorkspaces?.find(n=>n.id===old.id); if(next && next.lessonId!==old.lessonId) errors.push('scientificWorkspaces: published lesson reference changed'); }
    for(const old of a.advancedAssessments ?? []) { const next=b.advancedAssessments?.find(n=>n.id===old.id); if(next && next.lessonId!==old.lessonId) errors.push('advancedAssessments: published lesson reference changed'); }
    retain(a.spreadsheetAssignments ?? [], b.spreadsheetAssignments ?? [], 'spreadsheetAssignments');
    for (const old of a.modules) {
        const current = b.modules.find(n => n.id === old.id);
        if (current)
            refs(old.quiz, current.quiz, `module ${old.id} quiz`);
    }
    for (const old of a.lessons) {
        const current = b.lessons.find(n => n.id === old.id);
        if (current) {
            if (old.module !== current.module)
                errors.push(`lesson ${old.id}: module reassigned`);
            refs(old.quiz, current.quiz, `lesson ${old.id} quiz`);
            refs(old.drills, current.drills, `lesson ${old.id} drills`);
            refs(old.refs, current.refs, `lesson ${old.id} refs`);
        }
    }
    for (const old of a.banks) {
        const current = b.banks.find(n => n.id === old.id);
        if (current) {
            retain(old.sections, current.sections, `bank ${old.id} sections`);
            retain(old.questions, current.questions, `bank ${old.id} questions`);
            for (const q of old.questions) {
                const n = current.questions.find(n => n.id === q.id);
                if (n && ((q.type ?? 'choice') !== (n.type ?? 'choice') || q.section !== n.section))
                    errors.push(`question ${old.id}/${q.id}: kind or section reassigned`);
            }
        }
    }
    if (a.banks[0] && b.banks[0]?.id !== a.banks[0].id)
        errors.push('first question bank identity cannot change');
    for (const old of a.decks) {
        const current = b.decks.find(n => n.id === old.id);
        if (current)
            retain(old.cards, current.cards, `deck ${old.id}`);
    }
    for (const old of a.vocab ?? []) {
        const current = b.vocab?.find(n => n.id === old.id);
        if (current && old.lesson !== current.lesson)
            errors.push(`vocab ${old.id}: lesson reassigned`);
    }
    for (const old of a.spreadsheetAssignments ?? []) {
        const current = b.spreadsheetAssignments?.find(n => n.id === old.id);
        if (current && old.lessonId !== current.lessonId)
            errors.push(`spreadsheet ${old.id}: lesson reassigned`);
    }
    errors.push(...courseWorkRevisionProblems(a, b), ...courseWorkLessonRevisionProblems(a.lessons, b.lessons), ...readerRevisionProblems(a.texts ?? [], b.texts ?? []));
    return errors;
}

export interface CanonicalMigration { payload:CanonicalAuthoringPayload; transformations:{path:string;reason:string}[] }
/** Explicit migration of documented version-1 shorthand. No permissive normalizer,
 * generated identities, field filtering, asset fetching, or authority adoption. */
export function migrateLegacyCourseToCanonical(raw:unknown,options:CanonicalValidationOptions={}):CanonicalMigration {
 if(!isObject(raw)||raw.format!=='examiner-course'||raw.version!==1)throw Error('Expected legacy examiner-course version 1');
 // Inspect the original object before JSON cloning could omit unsupported values.
 const preflight=validateCanonicalAuthoring({format:'erudior-canonical-authoring',version:1,course:raw},{...options,strict:false});
 if(preflight.some(e=>/plain JSON|cyclic content|structural limit|reserved key|byte limit|sparse or decorated/.test(e)))throw Error(preflight.join('; '));
 const c=clone(raw),transformations:CanonicalMigration['transformations']=[];
 const note=(path:string,reason:string)=>transformations.push({path,reason});
 const missing=(object:Record<string,unknown>,key:string,value:unknown,path:string)=>{if(object[key]===undefined){object[key]=value;note(path+'.'+key,'Added documented omitted default');}};
 for(const key of ['modules','lessons','banks','decks','glossary','references','drills'])missing(c,key,[], 'course');
 if(Array.isArray(c.banks))c.banks.forEach((b,index)=>{if(!isObject(b))return;const p=`course.banks[${index}]`;missing(b,'format','examiner-bank',p);missing(b,'version',1,p);missing(b,'sections',[],p);missing(b,'exam',{},p);
  if(isObject(b.exam)){missing(b.exam,'questionCount',50,p+'.exam');missing(b.exam,'timeLimitMinutes',60,p+'.exam');missing(b.exam,'passingPercent',75,p+'.exam');}
  if(Array.isArray(b.questions))b.questions.forEach((q,i)=>{if(!isObject(q))return;const path=`${p}.questions[${i}]`;missing(q,'topic','General',path);missing(q,'choices',[],path);missing(q,'answer',[],path);
   if(typeof q.answer==='number'&&Number.isInteger(q.answer)){q.answer=[q.answer];note(path+'.answer','Wrapped documented scalar answer index');}
   if(Array.isArray(q.accept)&&q.accept.every(a=>Array.isArray(a)||typeof a==='string')){const nested=q.accept.map(a=>typeof a==='string'?[a]:a);if(JSON.stringify(nested)!==JSON.stringify(q.accept)){q.accept=nested;note(path+'.accept','Expanded documented accepted-answer shorthand');}}
   if(isObject(q.code)&&Array.isArray(q.code.tests))q.code.tests.forEach((test,j)=>{if(isObject(test)&&Array.isArray(test.stdin)&&test.stdin.every(line=>typeof line==='string')){test.stdin=test.stdin.join('\n')+'\n';note(`${path}.code.tests[${j}].stdin`,'Converted documented input lines to equivalent input stream');}});
   if(typeof q.blend==='string'){q.blend=q.blend.trim().split(/\s+/);note(path+'.blend','Expanded documented sound-unit shorthand');}
  });
 });
 const work=normalizeValidatedCourseWork(c,{strict:options.strict,legacy:true,moduleIds:Array.isArray(c.modules)?c.modules.filter(isObject).map(m=>m.id).filter((id):id is string=>typeof id==='string'):[]});
 for(const key of ['rubrics','writing','labs','activityLog'] as const)if(work[key]!==undefined){if(JSON.stringify(c[key])!==JSON.stringify(work[key]))note('course.'+key,'Expanded validated legacy assessed-work shorthand');c[key]=work[key];}
 if(c.texts!==undefined){const texts=normalizeValidatedReaderTexts(c.texts,{strict:options.strict,legacy:true});if(JSON.stringify(texts)!==JSON.stringify(c.texts))note('course.texts','Added validated legacy reader defaults');c.texts=texts;}
 return {payload:canonicalAuthoringFromCourse(c,options),transformations};
}

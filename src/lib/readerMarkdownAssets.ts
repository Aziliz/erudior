/** Match Reader's footnote extraction while retaining exact authored source offsets. */
import { markdownImageAssets, type MarkdownImageAsset } from './markdownAssets';
import { validateMarkdownAssets } from './lessonSource';
export function readerMarkdownParts(source: string, kind?: string): Array<{ source: string; positions: number[] }> {
  const definitions = new Map<string, { source: string; positions: number[] }>();
  let main = '', mainPositions: number[] = [], current: string | undefined;
  for (const line of source.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)) {
    if (!line[0].length) continue;
    const raw = line[0].replace(/[\r\n]+$/, ''), start = line.index!;
    const match = /^\[\^([A-Za-z0-9_-]{1,20})\]:[ \t]?(.*)$/.exec(raw);
    if (match) {
      current = match[1]; const offset = raw.length - match[2].length;
      definitions.set(current, { source: match[2], positions: Array.from({ length: match[2].length }, (_, i) => start + offset + i) });
    } else if (current && /^( {2,}|\t)\S/.test(raw)) {
      const note = definitions.get(current)!; const trimmed = raw.trim(), offset = raw.length - raw.trimStart().length;
      note.source += ' ' + trimmed;
      note.positions.push(start); for (let i = 0; i < trimmed.length; i++) note.positions.push(start + offset + i);
    } else {
      current = undefined;
      if (main) { main += '\n'; mainPositions.push(start - 1); }
      main += raw; for (let i = 0; i < raw.length; i++) mainPositions.push(start + i);
    }
  }
  const referenced = new Set([...main.matchAll(/\[\^([A-Za-z0-9_-]{1,20})\]/g)].map(match => match[1]));
  const prose = { source: main, positions: mainPositions };
  const bodyParts = kind === 'poem' || kind === 'play' ? verseMarkdownParts(prose, kind) : [prose];
  return [...bodyParts, ...[...definitions].filter(([id]) => referenced.has(id)).map(([, part]) => part)];
}
function verseMarkdownParts(part: { source: string; positions: number[] }, kind: string): Array<{ source: string; positions: number[] }> {
  const result: Array<{ source: string; positions: number[] }> = [];
  for (const match of part.source.matchAll(/[^\n]+/g)) {
    let text = match[0].replace(/\s+$/, ''), positions = part.positions.slice(match.index!, match.index! + text.length);
    if (!text.trim()) continue;
    if (/^#{1,4}\s/.test(text)) { const prefix = /^#+\s*/.exec(text)![0].length; text = text.slice(prefix); positions = positions.slice(prefix); }
    else if (kind === 'play' && /^[\p{Lu}][\p{Lu}\s.'’-]*\.$/u.test(text.trim()) && text.trim().length <= 40) continue;
    else if (kind === 'play' && (/^\s*\*[^*].*\*\s*$/.test(text) || /^\s*\[.*\]\s*$/.test(text))) {
      const prefix = text.length - text.trimStart().length; text = text.trim(); positions = positions.slice(prefix, prefix + text.length);
      text = text.slice(1, -1); positions = positions.slice(1, -1);
    } else {
      const leading = /^\s+/.exec(text)?.[0] ?? ''; const mapped: number[] = [];
      for (let i = 0; i < leading.length; i++) { mapped.push(positions[i]); if (leading[i] === '\t') mapped.push(positions[i]); }
      text = '\u00a0'.repeat(mapped.length) + text.slice(leading.length); positions = [...mapped, ...positions.slice(leading.length)];
    }
    result.push({ source: text, positions });
  }
  return result;
}
export function readerMarkdownImageAssets(source: string, kind?: string): { assets: MarkdownImageAsset[]; errors: string[] } {
  const assets: MarkdownImageAsset[] = [], errors: string[] = [];
  for (const part of readerMarkdownParts(source, kind)) {
    const parsed = markdownImageAssets(part.source); errors.push(...parsed.errors);
    for (const asset of parsed.assets) {
      const start = part.positions[asset.start] ?? (asset.start === part.positions.length && part.positions.length ? part.positions[part.positions.length - 1] + 1 : undefined), end = part.positions[asset.end - 1];
      if (start === undefined || end === undefined) errors.push('Reader image syntax cannot be mapped losslessly');
      else assets.push({ ...asset, start, end: end + 1 });
    }
  }
  return { assets, errors };
}
export function validateReaderMarkdownAssets(source: string, options: { communityImageOrigin?: string; mode?: 'source' | 'publication'; kind?: string } = {}): string[] {
  return [...new Set(readerMarkdownParts(source, options.kind).flatMap(part => validateMarkdownAssets(part.source, options)))];
}
export function transformReaderMarkdownImages(source: string, transform: (source: string) => string, beforeReplace?: (previous: string, next: string) => void, kind?: string): string {
  const { assets, errors } = readerMarkdownImageAssets(source, kind);
  if (errors.length) throw Error(errors.join('; '));
  let result = source;
  for (const asset of assets.sort((a, b) => b.start - a.start)) {
    const next = transform(asset.src); if (next === asset.src) continue;
    const replacement = asset.replace(next); beforeReplace?.(source.slice(asset.start, asset.end), replacement);
    result = result.slice(0, asset.start) + replacement + result.slice(asset.end);
  }
  return result;
}

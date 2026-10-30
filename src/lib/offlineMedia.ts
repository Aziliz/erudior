/** Bounded transport checks, not a decoder or a guarantee that media will play. */
import { validateImageAsset } from './imageAssets';
import { validateEmbeddedAudio } from './courseAudio';

export function validateOfflineMedia(src: string, kind: 'image' | 'audio'): string[] {
  if (typeof src !== 'string') return ['Media must be an embedded data URL.'];
  const errors = kind === 'image' ? validateImageAsset(src) : validateEmbeddedAudio(src);
  if (errors.length) return errors;
  const match = /^data:([^;]+);base64,(.*)$/.exec(src);
  if (!match) return ['Media must be an embedded data URL.'];
  // The existing validators bound decoded size and canonicalize base64 before decoding.
  const data = atob(match[2]);
  const at = (offset: number, value: string) => data.slice(offset, offset + value.length) === value;
  const byte = (offset: number) => data.charCodeAt(offset);
  const riff = (type: string) => data.length >= 12 && at(0, 'RIFF') && at(8, type);
  const mp4 = () => data.length >= 16 && at(4, 'ftyp');
  const ogg = () => data.length >= 27 && at(0, 'OggS') && byte(4) === 0;
  const mpeg = () => data.length >= 10 && at(0, 'ID3') && byte(3) >= 2 && byte(3) <= 4
    || data.length >= 4 && byte(0) === 0xff && (byte(1) & 0xe0) === 0xe0 && (byte(1) & 6) !== 0 && (byte(1) & 0x18) !== 8;
  let valid = false;
  switch (match[1]) {
    case 'image/svg+xml': return []; // Fully parsed by validateImageAsset, including active-content restrictions.
    case 'image/png': valid = data.length >= 24 && at(0, '\x89PNG\r\n\x1a\n') && at(12, 'IHDR'); break;
    case 'image/jpeg': valid = data.length >= 4 && at(0, '\xff\xd8\xff'); break;
    case 'image/gif': valid = data.length >= 13 && (at(0, 'GIF87a') || at(0, 'GIF89a')); break;
    case 'image/webp': valid = data.length >= 16 && riff('WEBP') && (at(12, 'VP8 ') || at(12, 'VP8L') || at(12, 'VP8X')); break;
    case 'audio/mpeg': case 'audio/mp3': valid = mpeg(); break;
    case 'audio/mp4': case 'audio/x-m4a': valid = mp4(); break;
    case 'audio/aac': valid = data.length >= 7 && byte(0) === 0xff && (byte(1) & 0xf6) === 0xf0 || data.length >= 4 && at(0, 'ADIF'); break;
    case 'audio/ogg': valid = ogg(); break;
    case 'audio/opus': valid = ogg() && data.includes('OpusHead', 27); break;
    case 'audio/wav': case 'audio/x-wav': case 'audio/wave': valid = riff('WAVE'); break;
    case 'audio/webm': valid = data.length >= 8 && at(0, '\x1a\x45\xdf\xa3'); break;
    case 'audio/flac': valid = data.length >= 8 && at(0, 'fLaC'); break;
  }
  return valid ? [] : ['Media bytes do not match the declared MIME type or have a truncated header.'];
}

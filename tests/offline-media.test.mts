import assert from 'node:assert/strict';
import { validateOfflineMedia } from '../src/lib/offlineMedia.ts';
const url = (mime: string, data: string) => `data:${mime};base64,${Buffer.from(data, 'latin1').toString('base64')}`;
const good: [string, string][] = [
  ['image/png', '\x89PNG\r\n\x1a\n\0\0\0\rIHDR' + '\0'.repeat(8)],
  ['image/jpeg', '\xff\xd8\xff\xe0'], ['image/gif', 'GIF89a' + '\0'.repeat(7)],
  ['image/webp', 'RIFF\0\0\0\0WEBPVP8 '],
  ['image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg"/>'],
  ['audio/mpeg', 'ID3\x04\0\0\0\0\0\0'], ['audio/mp3', '\xff\xfb\x90\0'],
  ['audio/mp4', '\0\0\0\x10ftypM4A \0\0\0\0'], ['audio/x-m4a', '\0\0\0\x10ftypM4A \0\0\0\0'],
  ['audio/aac', '\xff\xf1\x50\x80\0\xff\xfc'], ['audio/ogg', 'OggS' + '\0'.repeat(23)],
  ['audio/opus', 'OggS' + '\0'.repeat(23) + 'OpusHead'],
  ['audio/wav', 'RIFF\0\0\0\0WAVE'], ['audio/x-wav', 'RIFF\0\0\0\0WAVE'], ['audio/wave', 'RIFF\0\0\0\0WAVE'],
  ['audio/webm', '\x1a\x45\xdf\xa3\0\0\0\0'], ['audio/flac', 'fLaC\0\0\0\0']
];
for (const [mime, data] of good) {
  const kind = mime.startsWith('image/') ? 'image' : 'audio';
  assert.deepEqual(validateOfflineMedia(url(mime, data), kind), [], mime);
  assert.ok(validateOfflineMedia(url(mime, '<html>not media</html>'), kind).length, mime);
  assert.ok(validateOfflineMedia(url(mime, data.slice(0, 2)), kind).length, `truncated ${mime}`);
}
assert.ok(validateOfflineMedia(url('audio/wav', 'RIFFxxxxWEBPVP8 '), 'audio').length);
assert.ok(validateOfflineMedia(url('audio/opus', 'OggS' + '\0'.repeat(23)), 'audio').length);
assert.ok(validateOfflineMedia(url('image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>'), 'image').length);
assert.ok(validateOfflineMedia('https://example.test/media.png', 'image').length);
assert.ok(validateOfflineMedia(url('text/html', '<b>x</b>'), 'image').length);
assert.ok(validateOfflineMedia('data:image/png;base64,AB==', 'image').length);
assert.ok(validateOfflineMedia(url('image/png', 'x'.repeat(2 * 1024 * 1024 + 1)), 'image').length);
assert.ok(validateOfflineMedia(url('audio/wav', 'x'.repeat(400001)), 'audio').length);
console.log('offline media header checks passed (headers are not decoder validation)');

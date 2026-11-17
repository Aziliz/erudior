# Tagged upstream notices omitted from npm packages

`saxes-6.0.0-LICENSE.txt` is the exact upstream license for the locked saxes6.0.0 dependency, retrieved from https://raw.githubusercontent.com/lddubeau/saxes/v6.0.0/LICENSE on2026-10-28. The npm archive has an ISC package label but omits this notice. The license generator includes this original notice; it does not adopt or amend Erudior licensing terms.

# Data notices

`*-NOTICE.txt` files describe bundled data that isn't an npm package; the license generator writes each into a DATA section, followed by the matching `*-COPYING.txt` license text. `kanjivg-NOTICE.txt` covers the kanji stroke data adapted from KanjiVG (CC BY-SA 3.0, © Ulrich Apel) by `scripts/build-kanji-strokes.mjs`; `kanjivg-r20260714-COPYING.txt` is KanjiVG's own `COPYING` file from release tag r20260714 (commit d95a97627fd9fe5b2c8d06ca81e38149609c0c1e), unchanged.

`makemeahanzi-NOTICE.txt` covers the hanzi stroke data modified from Make Me a Hanzi's `graphics.txt` (Arphic Public License) by `scripts/build-hanzi-strokes.mjs`, with the notice of modification the licence asks for; `makemeahanzi-ARPHICPL-COPYING.txt` is the licence file `APL/english/ARPHICPL.TXT` from Make Me a Hanzi commit bddc96d41bef78427ed0e034e9f7e31d71fd1b92, unaltered (it is byte-identical to hanzi-writer-data's `ARPHICPL.TXT` apart from a final newline).

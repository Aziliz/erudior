import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
import path from 'node:path';
const root=process.cwd(),seen=new Set<string>();
function visit(file:string){file=path.resolve(file);if(seen.has(file)||!existsSync(file))return;seen.add(file);const source=readFileSync(file,'utf8');for(const match of source.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)){let target=path.resolve(path.dirname(file),match[1]);if(!path.extname(target))target+='.ts';visit(target);}}
visit('worker/src/index.ts');
for(const lane of ['community','courses']){
 const source=readFileSync(`.github/workflows/${lane}.yml`,'utf8');
 const patterns=[...source.matchAll(/^\s+- "([^"]+)"$/gm)].map(m=>new RegExp('^'+m[1].replace(/[.+?^${}()|[\]\\]/g,'\\$&').replaceAll('**','\u0000').replaceAll('*','[^/]*').replaceAll('\u0000','.*')+'$'));
 for(const file of [...seen].map(f=>path.relative(root,f)).filter(f=>f.startsWith('src/'))){assert(patterns.some(p=>p.test(file)),`${lane} must track shared validator ${file}`);}
 for(const file of ['package.json','package-lock.json'])assert(patterns.some(p=>p.test(file)),`${lane} shared dependency changes`);
}
const api=readFileSync('.github/workflows/community.yml','utf8');assert(api.includes('Install shared canonical validator dependencies'));assert(api.includes('working-directory: .\n        run: npm ci'));
console.log('canonical release lanes track shared worker validators/dependencies without combining deployments');

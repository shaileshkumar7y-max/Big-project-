import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(here, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(here, 'app.js'), 'utf8');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique');
for (const view of ['home', 'shop', 'play', 'art', 'more']) {
  assert.match(html, new RegExp(`data-view-panel="${view}"`), `Missing ${view} view`);
  assert.match(html, new RegExp(`data-view="${view}"`), `Missing ${view} navigation item`);
}
for (const feature of ['vampire', 'chemistry', 'wheel', 'masquerade', 'date', 'outfit']) {
  assert.ok(js.includes(`case '${feature}'`) || js.includes(`data-feature="${feature}"`) || js.includes(`'${feature}'`), `Missing ${feature} feature handler or definition`);
}
assert.match(html, /id="ageGate"/, 'Adult self-attestation gate is required');
assert.match(html, /id="modalLayer"/, 'Accessible modal container is required');
assert.match(html, /id="profileForm"/, 'Local profile form is required');
assert.match(css, /prefers-reduced-motion/, 'Reduced-motion support is required');
assert.match(css, /env\(safe-area-inset-bottom\)/, 'Mobile safe-area spacing is required');
assert.match(js, /localStorage\.setItem\(STORAGE_KEY/, 'Local state persistence is required');
assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|WebSocket\s*\(/, 'Phase 2 shell must not make remote API calls');
const imagePaths = [...html.matchAll(/src="\.\.\/([^"?#]+)"/g)].map(match => match[1]);
assert.ok(imagePaths.length >= 8, 'Expected the shell to reuse the existing image library');
assert.equal(new Set(imagePaths).size, imagePaths.length, 'Image source list should not repeat the same path');
console.log(`PASS: ${ids.length} unique IDs, ${imagePaths.length} unique root image references, 5 navigation views, 6 Halloween mini-features, local-only state and responsive accessibility hooks.`);

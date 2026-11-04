#!/usr/bin/env node
/* Static release verifier for the cumulative Phases 1–7 patch. Run from the repo root. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const fail = (message) => checks.push({ status: 'FAIL', message });
const pass = (message) => checks.push({ status: 'PASS', message });

try {
  const html = read('index.html');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  duplicateIds.length ? fail(`Duplicate HTML IDs: ${duplicateIds.join(', ')}`) : pass(`HTML IDs unique (${ids.length} IDs)`);
  const idSet = new Set(ids);

  const navTargets = [...html.matchAll(/data-target=["']([^"']+)["']/g)].map(match => match[1]);
  const scrollTargets = [...html.matchAll(/data-scroll=["']([^"']+)["']/g)].map(match => match[1]);
  const seasonalTargets = [...html.matchAll(/data-hw-scroll=["']([^"']+)["']/g)].map(match => match[1]);
  const missingTargets = [...new Set([...navTargets, ...scrollTargets, ...seasonalTargets])].filter(id => !idSet.has(id));
  missingTargets.length ? fail(`Missing navigation/scroll targets: ${missingTargets.join(', ')}`) : pass('All navigation and scroll targets exist');

  const localAssets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1])
    .filter(value => value && !/^(?:https?:|data:|blob:|#|mailto:|tel:|javascript:)/i.test(value));
  const baseRepoFiles = new Set(['styles.css','app.js','creator.js','artflip-figure-index.js','collections.js','brand-voice.js','pwa.js','app-192.png','app-512.png','SOURCES_AND_LICENCES.md']);
  const missingAssets = [...new Set(localAssets.filter(value => {
    const clean = value.split(/[?#]/)[0].replace(/^\.\//, '');
    return clean && /\.(?:css|js|webmanifest|png|svg)$/i.test(clean) && !fs.existsSync(path.join(root, clean)) && !baseRepoFiles.has(clean);
  }))];
  missingAssets.length ? fail(`Missing local HTML-linked assets: ${missingAssets.join(', ')}`) : pass('All local HTML-linked CSS/JS/manifest/icon references exist');

  const scripts = ['halloween.js','innerwear.js','archive-merge.js','studio-enhancements.js','asset-path-fix.js','library-art.js','sw.js'];
  for (const file of scripts) {
    if (!fs.existsSync(path.join(root, file))) { fail(`${file} is missing`); continue; }
    const result = await import('node:child_process').then(({ execFileSync }) => {
      try { execFileSync(process.execPath, ['--check', file], { cwd: root, stdio: 'pipe' }); return true; }
      catch (error) { return error.stderr?.toString() || error.stdout?.toString() || String(error); }
    });
    result === true ? pass(`${file} syntax`) : fail(`${file} syntax: ${result}`);
  }

  if (fs.existsSync(path.join(root,'app.js')) && fs.existsSync(path.join(root,'creator.js'))) {
    const baseApp = read('app.js');
    const baseCreator = read('creator.js');
    const selectorIds = new Set([
      ...[...baseApp.matchAll(/\$\(["']#?([A-Za-z][\w-]*)["']\)/g)].map(match => match[1]),
      ...[...baseCreator.matchAll(/\$\(["']#?([A-Za-z][\w-]*)["']\)/g)].map(match => match[1]),
      ...[...baseApp.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(match => match[1]),
      ...[...baseCreator.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(match => match[1])
    ]);
    const missingBaseSelectors = [...selectorIds].filter(id => !idSet.has(id));
    missingBaseSelectors.length ? fail(`Base application/Creator selectors missing from index: ${missingBaseSelectors.join(', ')}`) : pass(`Existing base app/Creator selectors preserved (${selectorIds.size} checked)`);
  } else {
    checks.push({ status: 'SKIP', message: 'Base app.js/creator.js selector preservation is checked after this patch is uploaded to the existing repository root' });
  }

  const productJs = read('innerwear.js');
  const archiveJs = read('archive-merge.js');
  const artRows = [...archiveJs.matchAll(/^\s*\['/gm)].length;
  const campaignRows = [...productJs.matchAll(/\{id:'[^']+'/g)].length;
  artRows === 47 ? pass('Art Archive declares 47 records') : fail(`Expected 47 Art Archive records, found ${artRows}`);
  campaignRows === 14 ? pass('Innerwear gallery declares 14 campaign references') : fail(`Expected 14 campaign references, found ${campaignRows}`);
  const runwayOptions = [...html.matchAll(/data-runway-vote=/g)].length;
  runwayOptions === 3 ? pass('Innerwear local runway vote has 3 campaign choices') : fail(`Expected 3 runway vote choices, found ${runwayOptions}`);
  productJs.includes('bp-innerwear-runway-vote-v1') ? pass('Runway vote is device-local and namespaced') : fail('Runway vote storage key missing');

  const manifest = JSON.parse(read('manifest.webmanifest'));
  manifest.name?.includes('BLACKED PUSSY') ? pass('PWA manifest brand name') : fail('PWA manifest brand name is missing');
  const sw = read('sw.js');
  sw.includes('naked-canvas-shell-v9') ? pass('Service worker cache version v9') : fail('Service worker is not cache v9');
  for (const file of ['innerwear.css','innerwear.js','archive-merge.css','archive-merge.js','studio-enhancements.css','studio-enhancements.js']) {
    sw.includes(`./${file}`) ? pass(`Service worker precache includes ${file}`) : fail(`Service worker precache missing ${file}`);
  }
} catch (error) {
  fail(error?.stack || String(error));
}

for (const item of checks) console.log(`${item.status.padEnd(4)} ${item.message}`);
const failed = checks.filter(item => item.status === 'FAIL').length;
const passed = checks.filter(item => item.status === 'PASS').length;
const skipped = checks.filter(item => item.status === 'SKIP').length;
console.log(`\n${passed}/${checks.length} checks passed · ${skipped} skipped (requires existing repo root)`);
if (failed) process.exitCode = 1;

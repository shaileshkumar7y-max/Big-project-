#!/usr/bin/env node
/* Dependency-free behavioural smoke test for image-health.js. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class FakeElement {
  querySelectorAll() { return []; }
}
class FakeImage extends FakeElement {
  constructor(src, alt = '') {
    super(); this._src = src; this.alt = alt; this.dataset = {};
    this.attrs = new Set(['src']); this.classNames = new Set(); this.isConnected = true;
    this.classList = { add: name => this.classNames.add(name), remove: name => this.classNames.delete(name) };
  }
  get src() { return this._src; }
  set src(value) { this._src = String(value); this.attrs.add('src'); }
  getAttribute(name) { return name === 'src' ? this._src : null; }
  hasAttribute(name) { return this.attrs.has(name); }
  setAttribute(name, value) { if (name === 'src') this.src = value; this.attrs.add(name); }
  removeAttribute(name) { this.attrs.delete(name); if (name === 'src') this._src = ''; }
}

const image = new FakeImage('./remote-campaign.webp');
const handlers = {document:{}, window:{}};
const document = {
  baseURI: 'https://example.test/brand/',
  documentElement: new FakeElement(),
  querySelectorAll: selector => selector === 'img' ? [image] : [],
  addEventListener: (name, callback) => { handlers.document[name] = callback; }
};
class FakeObserver { observe() {} }
const window = { addEventListener: (name, callback) => { handlers.window[name] = callback; } };
const context = {
  document, window, Element: FakeElement, HTMLImageElement: FakeImage,
  MutationObserver: FakeObserver, URL, Set, String, Number
};
vm.runInNewContext(fs.readFileSync(new URL('./image-health.js', import.meta.url), 'utf8'), context);

const original = 'https://example.test/brand/remote-campaign.webp';
assert.equal(image.dataset.bpOriginalSrc, original, 'original source is retained');
assert.equal(image.loading, 'lazy', 'non-priority image is lazy loaded');
assert.equal(image.decoding, 'async', 'image decode is asynchronous');

handlers.document.error({target:image});
assert.match(image.src, /^data:image\/svg\+xml/, 'failed image receives a branded fallback');
assert.equal(image.dataset.bpFallbackActive, 'true');
assert.equal(image.alt, 'Image unavailable. Reconnect to try again.', 'empty alt text becomes accessible');
assert.ok(image.classNames.has('bp-image-fallback'));

handlers.window.online();
assert.equal(image.src, original, 'first reconnect retries original URL');
handlers.document.error({target:image});
handlers.window.online();
assert.equal(image.src, original, 'second reconnect retry is allowed');
handlers.document.error({target:image});
const fallback = image.src;
handlers.window.online();
assert.equal(image.src, fallback, 'retry limit prevents endless requests');

image.dataset.bpFallbackActive = 'false';
image.src = original;
handlers.document.load({target:image});
assert.ok(!image.classNames.has('bp-image-fallback'), 'successful image removes fallback styling');
assert.equal(image.dataset.bpRetryCount, '0', 'successful load resets retry count');
console.log('PASS image-health behavioural smoke test: fallback, accessible alt, reconnect retry cap and recovery');

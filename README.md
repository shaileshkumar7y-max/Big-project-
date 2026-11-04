# BLACKED PUSSY INNERWEAR — Mega Merge V1 / Phase 1–2 Stability Release

A mobile-first static brand experience built incrementally on `Art-v2-`. This cumulative update integrates the earlier Halloween, Innerwear, Art Archive and Creative Studio work, while adding shared image-failure handling and small-text readability fixes.

## Included features

- Existing Gallery, museum/open-access Collections, Pose Atlas, AI Creator, My Studio shelf, Saved Shelf, PWA install and Halloween experience.
- Innerwear campaign gallery with 14 image references, search, filters, campaign viewer, device-local saved looks and a device-local three-choice runway vote.
- Separate 47-work / 9-group Art Archive with search, filters, sorting, grid/list view, load-more, viewer, favourites and recently viewed.
- Six Creator prompt directions, local prompt drafts and a local shelf for trusted Pollinations result links.
- Image failure fallback, reconnect retry and 10px minimum for audited compact labels in the new/updated styles.

## Phase 1–2 stability changes

- Current branch comparison found the previous Phase 4–6 module files were not yet present in the inspected `main` branch. This update includes them and wires them into `index.html`.
- All original 118 IDs found in the base `main` HTML remain in the cumulative 173-ID HTML; duplicate IDs: zero.
- The shared image layer stores original image URLs, displays a designed fallback if a remote image fails, supplies fallback alt text when necessary, and retries failed images up to two times after reconnect. Its dependency-free behavioural smoke test is `test-image-health.mjs`.
- Service-worker cache is advanced to `naked-canvas-shell-v10`.
- The service worker only caches same-origin assets. Campaign, Art archive, museum and pose images from third-party hosts remain network-dependent by design.

## Source image inventory

- Local base repository inventory: 41 image/icon files.
- `New-product-`: 14/14 Innerwear filenames verified in the source tree; 6/6 homepage image filenames verified.
- `Art-`: 47/47 numbered artwork filenames verified in the source tree.
- Existing My Studio local WebP references: 19/19 present.
- Pose Atlas source filenames: 32/32 present in the Shisei tree.
- Existing ArtFlip sample image filenames: 8/8 present in its source tree.

These are source-tree filename checks, not a guarantee that every remote URL will load at all times in a live browser. No image binaries are copied into this patch. The source repositories must remain public and referenced filenames must not change.

## Navigation

Halloween · Innerwear · Art Archive · Artworks · Collections · Pose Atlas · AI Creator · Saved.

The navigation stays horizontally scrollable on small screens. Existing application modules and browser storage are preserved; `app.js`, `creator.js`, `styles.css`, `pwa.js`, `collections.js`, `artflip-figure-index.js` and `brand-voice.js` remain base-repository files and are not replaced by this patch.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Pollinations OAuth is intended for the published HTTPS Pages URL with the exact redirect URL registered in the user's App Key.

## Upload and verification

Follow `UPLOAD-INSTRUCTIONS.md`. After upload, open the site twice on Android Chrome so service-worker v10 can activate. From the repository root run:

```bash
node verify-merge.mjs
node test-image-health.mjs
node --check app.js
node --check creator.js
python -m json.tool manifest.webmanifest >/dev/null
```

Static checks do not replace Android Chrome acceptance testing. Live remote-image rendering, museum APIs, Pollinations OAuth/generation, offline restart, touch actions and final GitHub Pages deployment still require a real device/network check.

## Important limitations

- No backend, online checkout, verified stock/prices, customer accounts, cloud sync, admin analytics, shared voting or public leaderboard.
- Product prices, size charts, SKUs and stock must come from a verified product feed before commerce or exact size recommendations can be enabled.
- The 18+ entry screen is self-attestation only; it does not verify age or identity.
- Pollinations generation requires the user's own authorised key and approved budget; generation is not guaranteed free.
- The Art- archive is derived from the supplied repository's user library. It is not automatically public-domain licensed; confirm individual image rights before commercial use.

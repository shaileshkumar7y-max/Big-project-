# Android upload guide — BLACKED PUSSY INNERWEAR Mega Merge V1 (Phases 1–7)

This is a **cumulative incremental patch**. It contains changed/new files for Phases 1–7, not the whole website. Upload the extracted contents into the root of the existing `Art-v2-` repository. Do not delete any unlisted file.

## 1. Before upload

1. Open `https://github.com/shaileshkumar7y-max/Art-v2-`.
2. Confirm `New-product-` and `Art-` remain public, because new campaign and archive images load from those repositories.
3. Download and extract this ZIP on Android.
4. In GitHub, select **Add file → Upload files**.

## 2. Replace these existing files

Upload at the repository root and allow GitHub to replace the existing versions:

- `index.html`
- `sw.js`
- `manifest.webmanifest`
- `library-art.js`
- `README.md`

`UPLOAD-INSTRUCTIONS.md` is also included as an updated guide; add it or replace an older copy if present.

## 3. Add these new code files at the repository root

- `halloween.css`
- `halloween.js`
- `asset-path-fix.js`
- `innerwear.css`
- `innerwear.js`
- `archive-merge.css`
- `archive-merge.js`
- `studio-enhancements.css`
- `studio-enhancements.js`
- `verify-merge.mjs`

## 4. Add these reports/documentation files at the repository root

- `PHASE_1_AUDIT.md`
- `PHASE_2_BRAND_GUIDE.md`
- `PHASE_3_HALLOWEEN_QA.md`
- `PHASE_4_INNERWEAR_QA.md`
- `PHASE_5_ART_ARCHIVE_QA.md`
- `PHASE_6_CREATIVE_STUDIO_QA.md`
- `PHASE_7_FINAL_QA_SECURITY.md`
- `PHASE_4_7_ASSET_SOURCES.md`
- `PHASES_1_3_CHANGELOG.md`
- `PHASES_4_7_CHANGELOG.md`

## 5. Keep these existing files unchanged

Do not delete, replace or rename:

- `app.js`, `creator.js`, `styles.css`, `pwa.js`
- `artflip-figure-index.js`, `collections.js`, `brand-voice.js`
- `.nojekyll`, root-level art images, PWA icons and all other unlisted files
- Existing original/Studio artwork and pose source images

The 14 campaign files in `New-product-` and all 47 `artwork-01.webp` … `artwork-47.webp` files in `Art-` are linked remotely and are not copied into this ZIP.

## 6. Commit

Suggested commit message:

`Halloween Mega Merge V1: phases 1-7 innerwear, art archive and studio`

## 7. GitHub Pages settings

Open **Settings → Pages → Build and deployment**. Keep **Deploy from a branch**, branch `main`, folder `/(root)`. Wait for Pages to publish, then open the site twice on Android Chrome so service-worker v9 can activate.

## 8. Verify after upload

Run from the existing repository root if Node.js is available:

```bash
node verify-merge.mjs
```

Then manually test on Android Chrome:

- Brand header/navigation, Halloween countdown and Mystery Mood Wheel.
- Innerwear campaign images, filters, detail viewer, saved looks, runway vote and fit guide.
- 47-art archive search, all nine filters, sort, grid/list, load more, viewer, save/recent/share.
- Existing starter gallery, museum Collections, My Studio artwork shelf and Pose Atlas.
- AI Creator prompt builder, six quick directions, saved drafts and trusted Pollinations output links.
- Light/dark theme, EN/Hinglish switch, existing Saved Shelf and two reloads after the cache update.

## Known constraints

Remote product and Art- images need internet. No verified product catalogue, price, inventory or item-specific sizing feed was present in the supplied repos, so checkout and exact size recommendations are not included. Runway votes are local to the browser and not a shared poll. Pollinations OAuth/generation needs HTTPS and the user's own approved key/budget. The 18+ gate is self-attestation only.

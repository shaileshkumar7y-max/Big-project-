# Android upload guide — BLACKED PUSSY INNERWEAR Phase 1–2 Stability Release

This is a cumulative incremental patch. It completes the previous Phases 1–7 integration and adds Phase 2 image-failure handling/readability improvements. It is **not** a full copy of the repository. Upload the extracted files into the root of the existing `Art-v2-` repository; do not delete unlisted files.

## 1. Before upload

1. Open `https://github.com/shaileshkumar7y-max/Art-v2-`.
2. Confirm `New-product-` and `Art-` remain public, because campaign and archive artwork uses their public image URLs.
3. Download and extract this ZIP on Android.
4. In GitHub, open the target repository and select **Add file → Upload files**.

## 2. Replace these existing files

Upload at repository root and allow replacement:

- `index.html`
- `sw.js`
- `manifest.webmanifest`
- `library-art.js`
- `halloween.css`
- `halloween.js`
- `asset-path-fix.js`
- `README.md`
- `UPLOAD-INSTRUCTIONS.md`
- `verify-merge.mjs` (replace if one is already present)
- The included Phase 1–7 and Phase 1–2 QA/report Markdown files, if an older copy exists.

## 3. Add these new code/style files at repository root

- `innerwear.css`
- `innerwear.js`
- `archive-merge.css`
- `archive-merge.js`
- `studio-enhancements.css`
- `studio-enhancements.js`
- `image-health.css`
- `image-health.js`
- `test-image-health.mjs`
- `base-selector-contract.json`
- `stability-polish.css`

## 4. Add the reports

- `PHASE_1_2_COMPLETION.md`
- `PHASE_2_IMAGE_BUG_AUDIT.md`
- `PHASE_3_NEXT_FEATURE_IDEAS.md`
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

## 5. Keep these existing base files and assets unchanged

Do not delete or replace these unlisted base files:

- `app.js`, `creator.js`, `styles.css`, `pwa.js`
- `artflip-figure-index.js`, `collections.js`, `brand-voice.js`
- `.nojekyll`, all existing root-level artwork WebP files and the `app-192.png` / `app-512.png` icons
- Any other unlisted source files or images

The patch intentionally contains no replacement for the base Gallery/Creator application files and no image binaries. It links 14 campaign references in `New-product-` and 47 archive artworks in `Art-`; keep those source repositories public and preserve their referenced filenames.

## 6. Commit and publish

Suggested commit message:

`Phase 1-2 stability: integrate innerwear archive and image fallback`

In **Settings → Pages → Build and deployment**, retain **Deploy from a branch**, branch `main`, folder `/(root)`.

## 7. Verify

From the repository root, run:

```bash
node verify-merge.mjs
node test-image-health.mjs
node --check app.js
node --check creator.js
python -m json.tool manifest.webmanifest >/dev/null
```

After upload, open the site twice on Android Chrome so service-worker v10 can activate. Then test the homepage, every section, search/filter controls, image viewers, saved looks, local vote, 47-work archive, Creator prompts, saved outputs, Gallery, Collections, Pose Atlas, theme/language switches and Saved Shelf. Test once online, once with network disabled, and once after reconnecting.

## Important limits

Remote artwork needs internet; the image fallback displays when a remote image fails and retries after reconnecting, but it does not make remote images available offline. Runway votes and saved items stay on the current device. There is no backend, checkout, verified inventory, cloud account or server-side age verification. The 18+ screen is self-attestation only. Pollinations requires the user's own approved key and budget.

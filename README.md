# BLACKED PUSSY INNERWEAR — Halloween Mega Merge V1

A mobile-first static brand experience built incrementally on the user's `Art-v2-` repository. It combines the existing art gallery, museum/open-access Collections, Pose Atlas, My Studio artwork shelf and AI Creator with a seasonal Halloween edit, an innerwear campaign hub, and a 47-work art archive.

## What's included in the cumulative Phase 1–7 release

### Phase 1 — repository baseline and asset audit
- `Art-v2-` is the application base.
- `New-product-` supplies selected innerwear/campaign imagery and Creator feature references.
- `Art-` supplies the separate 47-work / 9-collection archive.
- Root-level asset path mismatches in the existing base build were documented and repaired in this release.

### Phase 2 — brand identity
- Main public brand name: **BLACKED PUSSY INNERWEAR**.
- Existing charcoal/wine/ivory/gold styling retained and extended with seasonal burgundy, purple and pumpkin accents.
- Existing art gallery, Creator and saved-shelf flows are retained.

### Phase 3 — Halloween 2027 experience
- Halloween landing section and 31 October 2027 countdown (India time).
- Midnight Lace, Velvet Shadow and Ember Rose creative directions.
- Campaign wall, six-outcome Mystery Mood Wheel and mobile-responsive layout.

### Phase 4 — innerwear campaign hub
- Fourteen campaign/editorial image references from `New-product-`.
- Search, filters, campaign detail modal, local saved-look shelf and a device-local three-look runway vote.
- Generic measurement and comfort guide.
- There is no verified product/stock/price feed in the source, so campaign cards are not advertised as live purchasable inventory. No invented prices, SKUs or universal size conversions are shown.

### Phase 5 — 47-work Art Archive
- Forty-seven artwork records from `Art-` in nine themed collection groups.
- Search, category filters, A–Z/Z–A sorting, grid/list view, load more, detail viewer, previous/next, save, share and original-image links.
- Saved and recently viewed art shelves are local to this browser.

### Phase 6 — Creative Studio improvements
- Six quick art-direction presets for Halloween Noir, Black Lace Editorial, Velvet Shadow Portrait, Classical Art Study, Together Campaign and Ember Rose Editorial.
- Local saved prompt drafts (maximum 12).
- Local My Studio output-link shelf (maximum 12 HTTPS Pollinations links).
- Temporary blob/data outputs must be downloaded; they are not persisted as links. Quick prompts are text presets only and do not send source images to the model.

### Phase 7 — final hardening and QA
- Service worker cache version v9 includes the new app modules.
- New storage keys are namespaced and bounded.
- Remote GitHub image repositories are deliberately outside the service-worker cache.
- Phase reports, image source notes, QA/security notes and Android upload instructions are included.

## Navigation

Halloween · Innerwear · Art Archive · Artworks · Collections · Pose Atlas · AI Creator · Saved.

The nav remains horizontally scrollable on smaller screens rather than squeezing text into tiny labels.

## Image delivery

No image binaries are duplicated in this update. Innerwear campaign assets load from the public `New-product-` repository; the 47 artworks load from the public `Art-` repository. The source repositories must remain public/readable and referenced filenames must remain unchanged. Remote images require an internet connection.

## Important limitations

- This is a static GitHub Pages-compatible frontend. It has no backend, online cart/checkout, live inventory, shared customer account, admin analytics, online voting, public leaderboard or cloud sync.
- Product prices, size charts, SKU values and stock availability must come from a verified product feed before checkout or exact size recommendations can be enabled.
- The 18+ entry screen remains self-attestation only, not age/identity verification.
- Pollinations image generation requires the user's own authorised key and approved budget. It is not guaranteed free.
- Art- is a user-library-derived image archive, not a public-domain licence declaration. Confirm individual image rights before commercial use.
- The separate New-product- `show-house.html` game-show project is not merged wholesale into the main brand navigation. Only relevant campaign and creative concepts were selected.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Pollinations OAuth is intended for the published HTTPS Pages URL with the exact redirect URL registered in the user's App Key.

## Upload and test

Follow `UPLOAD-INSTRUCTIONS.md`. After the GitHub Pages upload, reload twice on Android Chrome so service-worker v9 can activate. Run `node verify-merge.mjs` from the repository root for static checks. Live browser, Android, museum API, remote image and Pollinations tests remain manual acceptance items documented in `PHASE_7_FINAL_QA_SECURITY.md`.

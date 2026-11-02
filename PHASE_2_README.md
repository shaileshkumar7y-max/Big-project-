# After Dark — Phase 2 Halloween Foundation

This is an additive Phase 2 package for `shaileshkumar7y-max/Game-`. It creates a new route at `/Game-/halloween/` and does not replace or delete the existing main page, game engine, show page, product assets or art repositories.

## Included

- Mobile-first Halloween design foundation: soot black, oxblood, deep plum, warm ivory and restrained antique gold.
- Five primary destinations: Home, Shop, Play, Art and More.
- Adult self-attestation entry screen, non-explicit copy, consent-first game language and skip/pass controls.
- Local-only profile name, XP counter, accent preference and reset action.
- Six working Halloween interactions: Vampire Match quiz, Midnight Chemistry two-player quiz, Haunting Dare Wheel (Flirty/Bold/Spooky), Masquerade Reveal, Haunted Date Oracle and Night Outfit Oracle.
- Existing Game repository campaign images reused by relative path. No image binaries are duplicated in this package.
- No backend, external API, analytics, payment, cloud profile or remote storage.

## Install on GitHub (Android-friendly)

1. Open the `Game-` repository and choose **Add file → Upload files**.
2. Upload the complete `halloween/` folder, keeping the directory name and its four files.
3. Commit to a new branch first, then preview the changed files before merging into `main`.
4. After merging, open `https://shaileshkumar7y-max.github.io/Game-/halloween/`.

If GitHub's mobile UI does not retain the folder structure, create the `halloween` directory first and upload the files into it. Do not upload these files over the root `index.html`, `games-v7.js`, `games-v7.css` or root images.

## Local verification

From the repository root after placing this folder:

```bash
node --check halloween/app.js
node halloween/phase2-smoke-test.mjs
```

The smoke test validates document IDs, navigation views, module handlers, mobile safe-area styles, reduced-motion support, local-only persistence and image-reference shape. Existing image names were checked against the source repository's root asset inventory during Phase 1. A physical Android Chrome visual pass is still required after deployment.

## Deliberate Phase 2 boundaries

- Shop, art and profile sections are the unified navigation shell; full product checkout/catalogue, full art library/creator, complete game catalogue, RIZZVERSE chat/RPG and cross-device account features belong to later phases.
- The current art destination links to the existing Art-v2 site until Phase 3 migrates the gallery into this unified route.
- The 18+ screen is a self-attestation only, not formal age verification.
- Flirty prompts are non-explicit, optional and designed for adults. Passing is always allowed. No nudity, sexual acts, coercion, forced contact, recording or private-media exchange is required or described.
- The package uses existing root-level WebP files from `Game-`; do not move them into a new assets directory.

## Change policy

This Phase 2 package is new files only. Existing repositories and their source data are not modified by this archive. It is intended to be reviewed, tested and merged additively.

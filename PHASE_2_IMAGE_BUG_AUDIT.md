# Phase 2 — bug and image audit

Audit date: 4 November 2026

## Findings and repairs

| Finding in inspected `main` | Impact | Phase 1–2 action |
|---|---|---|
| Previous Phase 4–6 module files were absent (GitHub file lookup returned 404). | Innerwear, 47-work archive and Creator enhancement code in the previous ZIP was not part of the current repository. | Included and wired the missing module files in this cumulative patch. |
| Service worker was still `naked-canvas-shell-v8`. | Old clients could keep stale app files after a release. | New cache key v10; adds current modules and image-health assets to the required shell. |
| Remote image failures had no shared, accessible fallback layer. | Browser broken-image placeholders could appear if raw GitHub/museum hosts timed out or were unavailable. | Added a central image error handler and branded fallback, including useful alternate text when an image had an empty alt attribute. Failed external URLs retry when the browser comes online, with a maximum of two retries per image. A dependency-free Node smoke test covers fallback, reconnect and retry-limit behaviour. |
| Seasonal/brand micro-labels included 6–9px text. | Small labels are hard to read on Android phones. | New/updated release styles set audited labels to at least 10px. |
| External images are not in the same-origin service-worker cache. | External gallery/campaign/pose artwork does not work offline. | Kept this boundary intentionally; failure fallback is displayed and images can retry after reconnect. We do not claim remote assets are offline-ready. |

## Filename inventory results

- Local target images/icons: 41 files; none were zero-byte in the tree response.
- Innerwear campaign references: 14/14 filenames found in `New-product-`.
- Art Archive references: 47/47 numbered artwork filenames found in `Art-`.
- My Studio: 19/19 local WebP paths found in the target repository root.
- Pose Atlas: 32/32 referenced image filenames found in the Shisei source tree.
- Existing ArtFlip sample: 8/8 referenced WebP/JPG filenames found in the ArtFlip source tree.
- Homepage campaign strip: 6/6 referenced filenames found in `New-product-`.

## Limitations and remaining live checks

An asset existing in GitHub's tree does not prove that the public raw URL will successfully deliver it at every moment. Public-repository access, rate limiting, CORS, host availability, file decoding and the final Pages site's CSP/network conditions must still be tested in a browser.

The shared image fallback handles `<img>` elements, including images inserted dynamically by the app. It does not rewrite CSS background-image URLs. CSS background images are not covered by this handler. Existing local art remains in the target repo and is not re-downloaded by this patch.

Live checks still required after upload: Android Chrome, every image card/detail viewer, image failure and reconnect behaviour, Pollinations output, museum APIs, offline restart, theme toggle, language toggle, saved shelf, modal actions and service-worker v10 activation.

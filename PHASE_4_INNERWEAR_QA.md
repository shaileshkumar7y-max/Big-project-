# Phase 4 — Innerwear integration QA

## Included
- 14 campaign/editorial cards sourced from the New-product- repository.
- Search and six filter modes: all, black, lace, after dark, couples and comfort/editorial.
- Campaign detail viewer with original image link.
- Saved-look shelf stored locally under `bp-innerwear-saved-looks-v1` (maximum 30 records).
- A three-look runway preference vote stored locally under `bp-innerwear-runway-vote-v1`; it is explicitly not a public poll.
- Generic measure/comfort guide.

## Source checks
The 14 filenames referenced by `innerwear.js` were checked against the `New-product-` main tree on 02 November 2026. No missing filename was found.

## Data honesty / scope
The source contains campaign and editorial visuals, not a verified product feed with SKU, size chart, price, inventory or checkout endpoints. This phase therefore displays them as campaign references and does not claim stock or selling details. The fit guide tells customers to use the per-garment manufacturer's measurements instead of inventing a universal S/M/L conversion.

## Static acceptance
- [x] Namespaced script and CSS
- [x] Accessible filter buttons and search field
- [x] Local save/remove interactions
- [x] Image error fallback state
- [x] Detail overlay and escape-to-close
- [ ] Live remote image render on Android Chrome
- [ ] Physical touch/scroll acceptance after upload

# Phase 6 — Creative Studio enhancement QA

## Included
- Six quick direction presets which set existing Creator form values and invoke the existing prompt builder.
- Saved prompt drafts on this device (maximum 12).
- My Studio generated-image link shelf on this device (maximum 12).
- Delete/load actions for saved drafts and remove/open actions for saved output links.

## Security and behaviour
- Existing Pollinations BYOP/OAuth and token-handling code is not replaced by this phase.
- Saved generated output links are accepted only for HTTPS `pollinations.ai` or its subdomains.
- Temporary `blob:` and `data:` image URLs are not persisted. Download them from the existing Creator action row instead.
- The new quick presets prefill text fields only. They do not transmit a source image as model input.
- Saved prompts and links remain in localStorage on this device. There is no cloud sync or app backend.

## Static acceptance
- [x] Quick presets use only existing option values
- [x] Prompt storage is bounded to 12 entries
- [x] Output-link storage is bounded to 12 entries
- [x] Provider-host allow-list checked before persistence
- [ ] Live Pollinations OAuth, model availability, CORS and generation require HTTPS browser testing

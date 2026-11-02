# Ishara Studio redesign

The reference was https://www.xovaar.com/. The adopted direction is a dark storefront with a crimson accent, a large photographic campaign slider, interactive collection cards, product rails and a moving typography strip. Ishara has its own photography concepts, type treatment, layout and copy.

## Implemented

- Charcoal / crimson / warm ivory theme across the storefront, including cart and checkout.
- Two campaign slides with previous/next, pause, hover/focus pause and reduced-motion support.
- Three photographic collection cards with image zoom and arrow transitions.
- Filterable product rail with automatic scrolling, manual controls and pause.
- A scrolling brand strip and a separate beauty editorial section.
- Four original product concepts, added without changing existing products. They have zero inventory, explicit Studio preview labels and illustrative prices. They cannot be ordered.
- Mobile category swiping, responsive product grids, accessible navigation/search and existing working checkout preserved.

The original six catalog products remain available. The four new concepts are Ivory Bloom Embroidered Dress, Noir Muse Satin Dress, Rose Veil Satin Lipstick and Dewdrop Glow Serum. Real specifications, inventory and prices should be supplied before changing these concepts into saleable products.

## Assets and generation prompts

Mode: built-in `image_gen` tool. Project assets are optimized WebP copies in `public/images/editorial/`. Original PNG generations are retained in the Codex generated-images folder. No stock images from the reference website were copied.

| Project asset | Prompt |
| --- | --- |
| `campaign-hero.webp` | Ultra-wide cinematic photorealistic editorial for a Bangladesh womenswear and beauty boutique. Adult South Asian woman in a modest black satin maxi dress, gold earrings and ivory handbag on the right third; sculptural cherry-red fabric against a near-black/oxblood architectural studio. Warm side light, real skin and textile texture. Left half empty for HTML typography. No text, logos or watermarks. |
| `ivory-dress.webp` | Portrait 4:5 photorealistic fashion catalog. Adult South Asian woman, full body with head, in an ivory embroidered modest maxi dress with long sleeves and tonal floral embroidery. Champagne studio wall, limestone floor, warm daylight, editorial pose and realistic fabric. No text, logos or watermarks. |
| `noir-dress.webp` | Portrait 4:5 photorealistic catalog. Adult South Asian woman, full body with head, in a black satin modest maxi dress with full long sleeves, flowing silhouette and gold earrings. Black sculptural studio, oxblood fabric, dramatic warm lighting and realistic textile. No text, logos or watermarks. |
| `rose-lip.webp` | Portrait 4:5 premium cosmetics still life. Rose-nude lipstick, oxblood lacquer case and champagne gold accents, cap beside it, subtle unlettered circular emblem. Warm travertine pedestal, a red rose petal and dark red satin. Fine macro texture and beautiful shadows. No text, existing brand marks or watermark. |
| `glow-serum.webp` | Portrait 4:5 premium skincare still life. Frosted blush serum bottle, champagne dropper cap, subtle unlettered emblem, creamy sculptural stone, a gel drop and botanical leaf. Warm ivory background, natural shadows and fine product detail. No text, existing brand marks or watermark. |
| `beauty-campaign.webp` | Landscape 3:2 luxury beauty editorial. Oxblood lipstick, frosted blush serum, champagne cream jar and blush compact on sculptural travertine with flowing burgundy satin. Warm directional lighting, deep oxblood backdrop, soft reflections. Products on right, left third empty for HTML copy. No text, logos or watermarks. |

Technical styling lives in `src/app/studio.css`; reusable carousel components are in `src/components/home/`. The catalog insertion script is `src/scripts/add-studio-collection.ts` and uses insert-only operations so reruns preserve existing records.

## Verification

Production build, TypeScript, ESLint and the full business-rule/API regression suite passed. Browser checks covered 390px mobile and 1440px desktop layouts with no horizontal overflow, working collection filters, carousel movement, pause controls, mobile navigation and concept product details. The final browser console reported no errors.

## Reference layout refinement

Aligned the compact header and persistent search with the supplied home screenshot. Added side arrows and slide indicators, a boxed service strip, and shared red/black intro panels for Shop, About, Contact, tracking and saved products. Catalog controls now span the page above the sidebar/grid. Product details use an open two-column gallery/purchase layout, and secondary pages have a compact footer.

Added a device-local wishlist with save/remove controls and refresh persistence. Contact messages are explicitly prepared for the visitor's email app; the form does not claim that an unsent message was received. No email service or account-login backend is implied by this design.

Checks passed: TypeScript, ESLint, production build and the existing business/API regression suite. Browser checks verified wishlist persistence/removal, email preparation without sending, desktop layouts, mobile navigation, single-column mobile contact layout, and no horizontal overflow or browser console errors.

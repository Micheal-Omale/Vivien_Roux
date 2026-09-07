# Image Prompt Pack — Vivien Roux Portfolio

> **Studio Directive:** Generate every image in this pack against your Gemini subscription in **one single continuous thread**. Pasting the Style Spine first anchors the medium, lighting, and palette so Gemini does not drift into glossy 3D renders or generic vector graphics. Save all files directly into the `images/` directory using the exact filenames specified below.

---

## 0. What Was Excluded — Cut the List First

These layers live **outside** the artwork and stay procedural. Never ask the model for them:

- **Paper Grain & Dust:** an animated SVG `<feTurbulence>` overlay (`#grain`) sits above the whole viewport, on top of every image. Generating grain into the art double-doses it.
- **Torn Page Transitions:** the ragged edges *between sections* are GSAP-driven clip polygons (`tornPolygon()`, `tornBottomPolygon()`) on the sections themselves, not on any image.
- **Typography & Captions:** 100% HTML/CSS (`.c-tag`, `.hero-title`, `.section-title`). Never ask the model for text, letters or numerals.

**These layers, however, MUST be generated into the artwork.** The in-card textures are currently CSS stand-ins (`.c-halftone`, `.c-wave`, `.c-zag`, `.c-diamonds`), and the wiring guide in §4 *replaces the entire contents* of each `.collage` with a single `<img>` — so those spans are deleted the moment real art lands. If the image does not carry them, the texture is simply gone:

- Halftone dot screens
- Screenprint stripes and diagonal bands
- Harlequin diamond grids
- Torn edges *within* a piece of artwork

**Generate the physical cut-paper collage artwork (textures included) and the transparent assembly scraps.**

---

## 1. The Style Spine

> **Copy and paste this paragraph into your Gemini thread FIRST before issuing any image prompts. This establishes the physical world and visual constraints for all subsequent outputs:**

```text
Visual Style Specification — Physical Paper Collage & Risograph Print:
Every artwork is an authentic, hand-made analogue paper collage physically snipped with scissors and tailor's shears from heavy-weight uncoated coloured art paper. Visible raw torn edges, scissor cutting facets, natural paper tooth, and subtle contact relief where paper shapes physically overlap. Spot-colour screenprint and Risograph separation aesthetic featuring authentic 1–2mm mechanical misregistration between ink layers, slight ink starvation, and matte paper absorption. Strictly flat spot colours with zero digital gradients, zero 3D rendering, zero photographic lens flares, and zero glossy lighting. Scanned on an optical flatbed scanner at 1200dpi showing minute paper fibres and subtle microscopic dust. Every composition is slightly off-square (1° to 3° tilt), tactile, organic, and imperfect. Human subjects are depicted exclusively as solid flat silhouettes or high-contrast duotone cut-outs—never photorealistic faces. Absolutely no typography, letters, words, numerals, or watermarks.

Master Palette (strictly adhere to these exact hex values):
- Deep Indigo: #2A19B0
- Acid Lime: #D8F63D
- Warm Paper Off-White: #F4F1E8
- Hot Pink: #F0369A
- Teal: #2CC7CC
- Bright Yellow: #FFD400
- Coral Red: #FF6B4A
- Soft Blush: #FF9DB0
- Tangerine Orange: #FF8A2B
- Ultramarine Blue: #2D4BE0
- Silhouette Ink Black: #17161B
```

---

## 2. Gemini Workflow Instructions

1. **Open a new Gemini conversation.**
2. **Send Prompt 0 (Style Spine)** alone to establish the aesthetic baseline.
3. **Generate all 13 images sequentially** within that same conversation.
4. If Gemini begins introducing 3D lighting or realistic human faces, remind it: *"Return to flat physical cut-paper collage with solid silhouette figures and spot colours."*
5. Save each image with the exact filename indicated in its header directly into `c:\Users\LENOVO\Desktop\test\images\`.

---

## 3. Individual Image Blocks

---

### `hero-portrait.png`
- **Slot / Placement:** Hero card (`.hero-card.collage[data-prompt="hero-portrait"]`), centered on desktop, overlapping the fold between the indigo hero section and acid lime marquee band. Rotated −1.5deg in CSS. Caption `Fig. 01 — self, torn` sits pinned to the bottom-left corner in HTML.
- **Aspect Ratio:** `3:4.4` (vertical portrait, approximately 9:13 or 3:4)
- **Prompt:**
  ```text
  Analogue cut-paper collage portrait card in 3:4.4 vertical aspect ratio. Upper two-thirds background is soft blush #FF9DB0 with a hand-torn warm off-white #F4F1E8 paper cloud shape floating near the top. Lower third is a solid teal #2CC7CC cut paper band angled upward at a 3-degree slant. In the center, rising from the bottom edge, a human head and shoulders cut out as a clean, solid ink-black #17161B paper silhouette. In the upper-left quadrant, a single bright yellow #FFD400 cut paper circle. Across the lower-left corner, a vigorous hand-drawn hot pink #F0369A marker squiggle. Scissor-cut edges with subtle paper thickness and shadow, Risograph halftone separation texture, slightly tilted composition.
  ```
- **AVOID:** Realistic human face, facial features, skin tones, eyes, mouth, photorealism, glossy 3D render, smooth airbrush gradients, digital drop shadows, text, letters, numerals, borders.

---

### `studio-bench.png`
- **Slot / Placement:** Studio card (`.studio-card.collage[data-prompt="studio-bench"]`), positioned in columns 2–5 of the Studio grid on acid lime ground. Rotated +1.2deg in CSS. Caption `Fig. 02 — at the bench` sits at bottom-left in HTML.
- **Aspect Ratio:** `4:3.6` (landscape / slightly squat rectangular, approximately 4:3 or 1:1)
- **Prompt:**
  ```text
  Analogue cut-paper collage in 4:3.6 landscape aspect ratio depicting an artisan at a studio work table. The figure is rendered as a solid flat black #17161B paper silhouette in profile, hands engaged in cutting and placing paper pieces. Background is a vibrant teal #2CC7CC paper field featuring fine diagonal screenprint stripes. A large tangerine orange #FF8A2B cut paper disc overlaps the lower-left corner, sitting partially behind the silhouette figure. The top edge of the teal background paper is roughly hand-torn with visible raw white paper core fibres. Subtle cast shadows beneath paper layers, authentic flatbed scan texture.
  ```
- **AVOID:** Realistic human face, modern computers or digital tablets, messy photorealism, volumetric 3D lighting, gradients, typography, watermarks, frame borders.

---

### `work-1.png`
- **Slot / Placement:** Work Index row 01 (*Saltmarsh Editions* — Identity). Appears in the cursor-lagged preview window (`.preview`) on hover.
- **Aspect Ratio:** `3:4` (vertical portrait)
- **Prompt:**
  ```text
  Analogue physical paper collage card in 3:4 vertical aspect ratio. Vibrant hot pink #F0369A paper ground with a coarse diagonal screenprint overprint pattern. Centered is a stylized human bust in profile as a solid black #17161B paper cut-out. In the upper-right corner, a single punched-out bright yellow #FFD400 paper circle. Tactile scissor-cut edges, subtle paper relief, Risograph ink texture, flat spot colours without gradients.
  ```
- **AVOID:** Real human faces, corporate logos, text, lettering, numbers, gradients, CGI render.

---

### `work-2.png`
- **Slot / Placement:** Work Index row 02 (*Ottolinger Archive* — Art Direction). Appears in the cursor-lagged preview window (`.preview`) on hover.
- **Aspect Ratio:** `3:4` (vertical portrait)
- **Prompt:**
  ```text
  Analogue cut-paper collage in 3:4 vertical aspect ratio. Background of deep teal #2CC7CC paper covered in fine diagonal screenprint lines. In the center, a human bust silhouette cut from solid ink-black #17161B paper. The entire top edge of the teal backing sheet is violently hand-torn with visible ragged paper fibres and white deckle edge. Matte paper scan texture, flat spot colours, authentic scissor edges.
  ```
- **AVOID:** Realistic facial features, digital gradients, glossy 3D surfaces, typography, logos.

---

### `work-3.png`
- **Slot / Placement:** Work Index row 03 (*Verdigris Press* — Print & Web). Appears in the cursor-lagged preview window (`.preview`) on hover.
- **Aspect Ratio:** `3:4` (vertical portrait)
- **Prompt:**
  ```text
  Analogue paper collage in 3:4 vertical aspect ratio. Rich ultramarine blue #2D4BE0 paper base. A vivid yellow #FFD400 cut paper strip slices diagonally across the middle at a minus 6-degree angle. Rising from the bottom, a human silhouette bust cut from warm off-white #F4F1E8 heavy rag paper. High contrast, tactile paper edges with subtle physical lift off the backing sheet, Risograph misregistration texture.
  ```
- **AVOID:** Dark silhouettes on dark background, photographic lighting, smooth computer vector lines, text, numerals.

---

### `work-4.png`
- **Slot / Placement:** Work Index row 04 (*Nocturne Radio* — Brand & Motion). Appears in the cursor-lagged preview window (`.preview`) on hover.
- **Aspect Ratio:** `3:4` (vertical portrait)
- **Prompt:**
  ```text
  Analogue cut-paper collage in 3:4 vertical aspect ratio. Warm coral red #FF6B4A paper background overlaid with a geometric harlequin diamond grid in bright yellow #FFD400. In front sits a solid black #17161B paper silhouette bust with pronounced coarse Risograph halftone screen dots. Hand-cut paper imperfections, tactile edges, flat spot colours.
  ```
- **AVOID:** Radio towers, headphones, musical notes, text, photographic faces, 3D shading.

---

### `work-5.png`
- **Slot / Placement:** Work Index row 05 (*Hollow Bones* — Editorial). Appears in the cursor-lagged preview window (`.preview`) on hover.
- **Aspect Ratio:** `3:4` (vertical portrait)
- **Prompt:**
  ```text
  Analogue cut-paper collage in 3:4 vertical aspect ratio. Background of soft blush #FF9DB0 paper. A torn scrap of warm off-white #F4F1E8 paper floats at the top. Across the bottom base is a sharp teal #2CC7CC horizontal cut strip. Centered solid black #17161B paper silhouette bust with an energetic hand-drawn hot pink #F0369A oil-pastel squiggle marking across the lower edge. Visible paper cuts, grain, and physical layering.
  ```
- **AVOID:** Literal skeleton/bone imagery, medical drawings, text, photorealism, glossy render.

---

### `work-6.png`
- **Slot / Placement:** Work Index row 06 (*Papier Mâché* — Packaging). Appears in the cursor-lagged preview window (`.preview`) on hover.
- **Aspect Ratio:** `3:4` (vertical portrait)
- **Prompt:**
  ```text
  Analogue paper collage in 3:4 vertical aspect ratio. Ultramarine blue #2D4BE0 paper backing with subtle diagonal print stripes. A silhouette bust cut from warm off-white #F4F1E8 textured paper. In the lower-left quadrant, an overlapping vibrant tangerine orange #FF8A2B cut paper circle. Clear scissor facets, tactile paper relief, flat spot ink aesthetic.
  ```
- **AVOID:** Packaging boxes, product mockups, typography, 3D renders, smooth digital gradients.

---

### `method-cut.png`
- **Slot / Placement:** Process card 01 (`01 — Cut`, `.card figure.collage.sm[data-prompt="method-cut"]`). Tilted −0.8deg in CSS.
- **Aspect Ratio:** `4:3.2` (landscape)
- **Prompt:**
  ```text
  Analogue paper collage in 4:3.2 landscape aspect ratio illustrating the cutting craft. Background of vibrant hot pink #F0369A paper with coarse diagonal screenprint lines. A solid black #17161B paper silhouette bust is cut in half or flanked by cut off-cuts. A pair of vintage heavy metal tailor's shears rests physically on the paper collage, casting a soft, authentic contact shadow. Heavy paper texture, 1200dpi flatbed scan look, flat spot colours.
  ```
- **AVOID:** Plastic stationery scissors, cartoon shears, photorealistic human hands/face, text, 3D rendering.

---

### `method-arrange.png`
- **Slot / Placement:** Process card 02 (`02 — Arrange`, `.card figure.collage.sm[data-prompt="method-arrange"]`). Tilted +0.5deg and shifted vertically in CSS.
- **Aspect Ratio:** `4:3.2` (landscape)
- **Prompt:**
  ```text
  Analogue paper collage in 4:3.2 landscape aspect ratio illustrating the arranging phase. Deep ultramarine blue #2D4BE0 ground with a bright yellow #FFD400 paper band cut at minus 6 degrees. A silhouette bust cut from warm paper #F4F1E8 rests in the center, surrounded by loose, scattered small geometric paper scraps and off-cuts in acid lime #D8F63D, hot pink #F0369A, and teal #2CC7CC loosely placed around the edges. High tactile realism, flat spot ink, zero digital artifacts.
  ```
- **AVOID:** Tidy computer screens, office desk items, coffee cups, text, letters, smooth 3D lighting.

---

### `method-press.png`
- **Slot / Placement:** Process card 03 (`03 — Press`, `.card figure.collage.sm[data-prompt="method-press"]`). Tilted −0.3deg in CSS.
- **Aspect Ratio:** `4:3.2` (landscape)
- **Prompt:**
  ```text
  Analogue paper collage in 4:3.2 landscape aspect ratio illustrating the print and press phase. Coral red #FF6B4A paper background with a bold yellow #FFD400 diamond print pattern and black #17161B silhouette bust. An authentic printmaker's rubber brayer roller with dark ink residue lays angled across one corner as if pressing the sheet down. Heavy Risograph ink misregistration, paper tooth, matte scanned appearance.
  ```
- **AVOID:** Giant industrial machinery, modern digital printers, text, letters, photographic human figures.

---

### `scrap-acid.png`
- **Slot / Placement:** Signature Assembly piece (`#asmPieces`, piece 2, top center). Flies down from top on scroll progress and locks above the central headline.
- **Aspect Ratio:** `5:1` (elongated horizontal strip)
- **Transparency:** **Must be exported as a transparent PNG (alpha channel)** with NO background color.
- **Prompt:**
  ```text
  A single elongated horizontal strip of heavy acid lime #D8F63D art paper on an isolated, completely transparent background. All four edges are violently hand-torn, showing raw, ragged paper fibres and white deckle core. Slight paper surface grain and subtle ink flecks. High resolution, isolated paper scrap cut-out, transparent alpha channel PNG.
  ```
- **AVOID:** Solid white background, black background, straight scissor cuts, drop shadow baked into the transparent file, gradients.

---

### `scrap-pink.png`
- **Slot / Placement:** Signature Assembly piece (`#asmPieces`, piece 8, mid-left). Flies in from the left on scroll progress.
- **Aspect Ratio:** `1:1` (square scrap)
- **Transparency:** **Must be exported as a transparent PNG (alpha channel)** with NO background color.
- **Prompt:**
  ```text
  A roughly square scrap of heavy hot pink #F0369A construction paper isolated on a completely transparent background. All edges are hand-torn and ragged with visible white paper fibres along the tear. Faint surface texture and paper dust. High resolution isolated paper object, transparent alpha channel PNG.
  ```
- **AVOID:** Solid white or colored background, round shapes, scissor straight edges, pre-baked drop shadows, gradients.

---

### `scrap-paper.png`
- **Slot / Placement:** Signature Assembly piece (`#asmPieces`, piece 9, mid-left). Flies in from the left on scroll progress.
- **Aspect Ratio:** `1.6:1` (rectangular scrap)
- **Transparency:** **Must be exported as a transparent PNG (alpha channel)** with NO background color.
- **Prompt:**
  ```text
  A small rectangular scrap of warm off-white #F4F1E8 heavy cotton rag paper isolated on a transparent background. Hand-torn deckle edges on all sides revealing natural cotton paper fibres. Faint microscopic dust and paper tooth. High resolution isolated paper piece, transparent alpha channel PNG.
  ```
- **AVOID:** Pure stark #FFFFFF white, solid background, laser straight edges, artificial drop shadows, gradients.

---

### `scrap-band.png`
- **Slot / Placement:** Signature Assembly piece (`#asmPieces`, piece 6, lower-right). Flies up from the bottom on scroll progress. This slot is authored at 3:1 in `PIECES`; it previously borrowed the 3:4 `work-3.png`, which `object-fit: cover` cropped to a headless slice.
- **Aspect Ratio:** `3:1` (wide horizontal band)
- **Transparency:** Opaque is fine — this piece keeps its card treatment.
- **Prompt:**
  ```text
  Analogue cut-paper collage in a wide 3:1 horizontal banner aspect ratio. Rich ultramarine blue #2D4BE0 heavy art paper ground. A bold bright yellow #FFD400 cut paper strip runs across it at a slight minus 3-degree angle, and a torn warm off-white #F4F1E8 rag paper rectangle overlaps the centre. Visible scissor facets, hand-torn deckle on the off-white shape, Risograph misregistration between the blue and yellow layers, flat spot colours, matte 1200dpi flatbed scan texture.
  ```
- **AVOID:** Any human figure or silhouette (this slot is too short to hold one), text, letters, numerals, gradients, 3D rendering, drop shadows.

---

## 4. Code Wiring Guide

Once you have generated and saved the image files into `images/`, follow these exact steps to complete the upgrade:

### In `script.js`
Replace the SVG/CSS placeholder strings in `ART` and `SCRAP` with standard `<img>` tags:

```javascript
const ART = {
  1: `<img src="images/work-1.png" alt="Saltmarsh Editions">`,
  2: `<img src="images/work-2.png" alt="Ottolinger Archive">`,
  3: `<img src="images/work-3.png" alt="Verdigris Press">`,
  4: `<img src="images/work-4.png" alt="Nocturne Radio">`,
  5: `<img src="images/work-5.png" alt="Hollow Bones">`,
  6: `<img src="images/work-6.png" alt="Papier Mâché">`,
};

const SCRAP = {
  yellowBar: `<span class="c-bg" style="background:var(--yellow)"></span>`,
  pinkBar:   `<img src="images/scrap-pink.png" alt="">`,
  paper:     `<img src="images/scrap-paper.png" alt="">`,
  acid:      `<img src="images/scrap-acid.png" alt="">`,
  zag:       `<span class="c-bg coral"></span><span class="c-zag"></span>`,
  diamond:   `<span class="c-bg" style="background:var(--teal)"></span><span class="c-diamonds"></span>`,
  band:      `<img src="images/scrap-band.png" alt="">`,
};
```

**No inline styles are needed.** `styles.css` already carries the rules that place and fit these:

```css
.collage img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.piece img[src*="scrap-"]{ object-fit: contain; }            /* never crop a torn edge */
.piece:has(img[src*="scrap-"]){ box-shadow:none; border-radius:0; overflow:visible; }
.piece:has(img[src*="scrap-"]) .collage{ background:transparent; overflow:visible; }
```

That last pair matters: `.collage` paints a `--paper` plate and `.piece` clips to a rounded rect with a drop shadow. Without those rules a transparent scrap lands on an off-white card with a rectangular shadow and the deckle edge you generated is invisible. They key off the `scrap-` filename, so **keep that prefix**.

### In `index.html`
Replace the inner placeholder spans and SVGs inside the four static figure elements with the corresponding `<img>` tags, **retaining the `<figcaption class="c-tag">` tags**:

1. **Hero Card:**
   ```html
   <figure class="hero-card collage" data-prompt="hero-portrait">
     <img src="images/hero-portrait.png" alt="Vivien Roux self-portrait collage">
     <figcaption class="c-tag">Fig. 01 — self, torn</figcaption>
   </figure>
   ```

2. **Studio Card:**
   ```html
   <figure class="studio-card collage" data-prompt="studio-bench">
     <img src="images/studio-bench.png" alt="Vivien Roux at the studio work bench">
     <figcaption class="c-tag">Fig. 02 — at the bench</figcaption>
   </figure>
   ```

3. **Method Cards:**
   ```html
   <figure class="collage sm" data-prompt="method-cut">
     <img src="images/method-cut.png" alt="01 Cut method">
   </figure>

   <figure class="collage sm" data-prompt="method-arrange">
     <img src="images/method-arrange.png" alt="02 Arrange method">
   </figure>

   <figure class="collage sm" data-prompt="method-press">
     <img src="images/method-press.png" alt="03 Press method">
   </figure>
   ```

### One tween to check

`revealHero()` parallaxes the figure inside the hero card. It targets
`.hero-card .c-bust, .hero-card img` ([script.js](../script.js)), so it keeps working
after the swap — the `.c-bust` half simply stops matching once the SVG is replaced.
If you rename the hero image element, update that selector or the parallax silently
becomes a no-op.

The `.collage` containers already carry `overflow: hidden`, `border-radius` and
`isolation: isolate`, so opaque artwork drops straight in.

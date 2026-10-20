---
name: design-skill
description: "Create stunning visuals, banners, thumbnails, icons, logos, illustrations, and brand assets with AI. Use when designing brand identities, generating marketing graphics, building cohesive visual styles (minimal, 3D, anime, pixel art, glassmorphism), or iterating on images using AI image generation."
---

# Design Skill - Visual Asset & Brand Creation

Create stunning visuals, banners, icons, and brand assets using AI image generation and cohesive design systems.

---

## Capabilities

### 1. Generate Visuals
Generate production-ready digital assets from structured natural language prompts:
- **Banners**: Social media headers (Twitter/X, YouTube, LinkedIn), website hero banners, display advertisements.
- **Thumbnails**: High-CTR YouTube thumbnails, blog feature graphics, article covers.
- **Icons**: Minimalist line art, 3D glossy icons, isometric app icons, flat vector symbols.
- **Logos & Badges**: Modern tech emblems, wordmarks, brand mascots, product badges.
- **Illustrations**: Editorial illustrations, conceptual artwork, onboarding graphics.

### 2. Consistent Brand Style
Maintain visual harmony across an entire application or project:
- Define a **Brand Identity Token Set**: Primary color, accent glow, surface finish, typography mood, and lighting angle.
- Lock visual themes across multiple asset generations so all screens and graphics feel like part of the same product.

### 3. Multiple Aesthetic Styles
Master distinct artistic directions:
- **Minimal & Modern**: Generous negative space, Swiss-style layout, monochrome + single electric accent.
- **3D Render / Claymorphism**: Soft ambient lighting, rounded geometry, subsurface scattering, tactile matte finish.
- **Glassmorphism / Frosted**: Translucent backdrop blur, subtle inner borders, refraction, chromatic aberration.
- **Cyberpunk / Dark Neon**: Deep slate/charcoal backgrounds, vivid cyan and magenta edge highlights.
- **Pixel Art**: Crisp grid alignment, nostalgic color palettes, isometric perspective.
- **Anime / Manga Aesthetic**: Expressive line work, vibrant cell shading, cinematic dynamic camera angles.

### 4. Edit & Iterate
Refine and evolve generated assets:
- Use reference image paths (`ImagePaths`) to produce stylistic variants or variations.
- Adjust framing, aspect ratios (`16:9`, `1:1`, `3:2`, `9:16`, `4:3`), and lighting without losing character or brand consistency.

---

## Asset Prompt Engineering Formulas

### 1. Hero Banners (`AspectRatio: '16:9'`)
```text
"Modern [industry/product] hero banner, [style, e.g. sleek dark glassmorphism], vibrant [accent color] glowing ambient lighting, subtle geometric flow, copy space on the [left/right], ultra-clean rendering, high resolution, no text artifacts"
```

### 2. Click-Through Thumbnails (`AspectRatio: '16:9'`)
```text
"High-contrast YouTube thumbnail for [topic], expressive focal element [subject/device], dramatic studio lighting with rim light, bold color separation [e.g. deep purple and electric lime], clean negative space, 8k render"
```

### 3. App Icons (`AspectRatio: '1:1'`)
```text
"Sleek mobile app icon for [function/app name], [style, e.g. 3D smooth frosted glass and metallic accent], rounded squircle silhouette, isolated on clean solid dark background, centered, professional UI design"
```

### 4. Logos & Badges (`AspectRatio: '1:1'`)
```text
"Minimalist vector logo for [brand name], representing [concept/metaphor], balanced geometric composition, two-tone color palette [e.g. indigo and coral], white/transparent background, sharp vector edges"
```

### 5. Marketing Illustrations (`AspectRatio: '3:2'` or `'16:9'`)
```text
"Clean tech illustration of [concept/workflow], [style, e.g. isometric 3D clay or modern corporate editorial], warm harmonious palette, soft drop shadows, modern tech aesthetic"
```

---

## Tool Execution in Antigravity

When running within Antigravity, invoke the native `generate_image` tool:
- **Prompt**: Follow the structured formulas above.
- **AspectRatio**: Select from `'1:1'`, `'16:9'`, `'9:16'`, `'3:2'`, `'4:3'`, `'2:3'`, `'3:4'`.
- **ImageName**: Concise snake_case identifier (e.g. `hero_banner_dark`, `app_icon_v1`).
- **ImagePaths**: (Optional) pass up to 3 existing image paths for editing, upscaling, or style transfer.

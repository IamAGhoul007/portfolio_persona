# Workspace Agent Guidelines & Learned Capabilities

This workspace is powered by 4 specialized agent skills and developer frameworks installed locally in `D:\ai-agent-skills\` and registered in `.agents/`:

---

## 1. Skill 01 / 04: UI-UX Pro Max (`ui-ux-pro-max`)
*Installed in: `.agents/skills/ui-ux-pro-max/`*

### Principles & Rules
- **No Generic AI Interfaces**: Every interface must have a distinct visual direction, intentional typography, harmonious color palette, and micro-interactions.
- **Searchable Design Intelligence**: Use the local search tool to extract validated palettes, font pairings, and UX rules:
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
  ```
- **Design System Generation**: When starting a new project or page, generate a cohesive design system first:
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry>" --design-system
  ```
- **Accessibility & Touch First**: Minimum 44x44px touch targets, 4.5:1 text contrast ratio, keyboard navigation, and explicit accessible labels.

---

## 2. Skill 02 / 04: Stitch MCP (`stitch-mcp`)
*Installed in: `.agents/skills/stitch-mcp/` & `.agents/plugins/`*

### Principles & Rules
- **Design to Code**: Turn Figma designs, screenshots, and wireframes into clean, production-ready React, Next.js, Tailwind, and HTML components.
- **Local Dev Server**: Preview all Stitch screens locally on a Vite server:
  ```bash
  npx @_davideast/stitch-mcp serve -p <project-id>
  ```
- **Astro / Next.js Site Generation**: Map design screens directly into deployable routes:
  ```bash
  npx @_davideast/stitch-mcp site -p <project-id>
  ```
- **Stitch Plugins Available**:
  - `stitch-design`: screen generation, prompt enhancement, and design system extraction.
  - `stitch-build`: React component recipes, React Native, and shadcn/ui patterns.
  - `stitch-utilities`: design-to-markdown and iterative prompt looping.

---

## 3. Skill 03 / 04: Design Skill (`design-skill`)
*Installed in: `.agents/skills/design-skill/`*

### Principles & Rules
- **Brand Consistency**: Define and preserve unified brand tokens (color accents, surface textures, lighting, typography).
- **Asset Formulas**: Use Antigravity's `generate_image` tool with structured formulas for:
  - **Banners** (`16:9`): Hero sections, social headers, feature banners.
  - **Thumbnails** (`16:9`): High-contrast, expressive focal point, rim lighting.
  - **Icons** (`1:1`): Modern app icons, 3D glossy squircles, flat vector glyphs.
  - **Logos & Badges** (`1:1`): Minimal geometric emblems and clean vector branding.
- **Style Mastery**: Support Minimalist, 3D Clay, Glassmorphism, Cyberpunk Neon, Retro Pixel Art, and Anime styles.

---

## 4. Skill 04 / 04: Debug Skill (`debug-skill`)
*Installed in: `.agents/skills/debug-skill/`*

### Principles & Rules
- **Evidence-Based Debugging**: NEVER guess or "patch and pray". Diagnosis must cite verifiable facts (stack traces, variable values, reproduced logs).
- **4-Phase Structured Protocol**:
  1. **Setup**: Identify project type, install/verify runtime tracing or debugger setup.
  2. **Analyze**: Reproduce the issue with a sidecar test (`test_reproduce_issue.*`), isolate the exact failing line and state.
  3. **Summary**: Document root cause, affected files, fix rationale, and regression prevention.
  4. **Teardown**: Clean up temporary scripts, run full test suite to guarantee zero side effects.
- **Bug Categorization**:
  - **CRASH**: Trigger exact exception, capture full traceback.
  - **BEHAVIOR**: Compare expected vs actual output using assertions.
  - **PERFORMANCE**: Measure timing benchmarks and query counts before and after fix.

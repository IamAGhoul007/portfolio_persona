---
name: stitch-mcp
description: "Turn designs into real code using Google Stitch MCP. Use when turning Figma designs, UI mockups, images, or text prompts into clean production code (React, Next.js, Tailwind, HTML), serving project screens locally, or bridging Google Stitch design tools with AI coding agents."
---

# Stitch MCP - Design to Real Code

Turn designs into real code using Google Stitch and the Stitch Model Context Protocol (MCP) server.

## Overview

Stitch MCP bridges Google's Stitch UI generation platform into your local development workflow. It allows you to:
1. **Generate UI**: Turn Figma designs, screenshots, sketches, or prompts into production-ready UI components.
2. **Modern Stack Support**: Generate code for React, Next.js, Tailwind CSS, shadcn/ui, Vue, Svelte, or vanilla HTML/CSS.
3. **Local Preview**: Serve all project screens on a local dev server (`Vite`) to inspect layouts and responsive states.
4. **Direct Coding Agent Integration**: Expose Stitch tools via MCP so agents can fetch screens, design DNA, and generate pixel-perfect code automatically.

---

## Quick Setup & CLI Commands

### 1. Initialize Authentication and Client Config
```bash
npx @_davideast/stitch-mcp init
```
This launches an interactive wizard that configures credentials and outputs the MCP configuration.

### 2. Preview Designs Locally
Serve all screens from a Stitch project on a local Vite development server:
```bash
npx @_davideast/stitch-mcp serve -p <project-id>
```

### 3. Build a Project from Screens
Generate a deployable site (such as Astro or Next.js) mapping Stitch screens directly to routes:
```bash
npx @_davideast/stitch-mcp site -p <project-id>
```

---

## MCP Server Configuration

Configure the MCP server in your workspace (`.agents/mcp_config.json`):

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_API_KEY": "${STITCH_API_KEY}"
      }
    }
  }
}
```

### Remote / Direct Connection Option
If connecting directly over HTTP/SSE:
```json
{
  "mcpServers": {
    "stitch-direct": {
      "serverUrl": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${STITCH_API_KEY}"
      }
    }
  }
}
```

---

## Agent Workflow: From Design to Production Code

### Phase 1: Ingest Design Specs
1. Fetch project screens or list designs using Stitch MCP tools (`list_projects`, `list_screens`).
2. Extract design tokens and styling tokens using `plugins/stitch-design` (`extract-design-md` or `manage-design-system`).

### Phase 2: Generate Components
1. Choose the target stack (React + Tailwind, Next.js, etc.).
2. Use the component recipes from `plugins/stitch-build` (e.g. `react-components` or `shadcn-ui`).
3. Ensure responsiveness, accessibility (WCAG AA), and tokenized styling.

### Phase 3: Preview & Iterate
1. Launch local preview with `npx @_davideast/stitch-mcp serve -p <project-id>`.
2. Inspect responsive breakpoints and interactive states.
3. Apply refinements directly using natural language instructions.

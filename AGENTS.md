# AGENTS.md

Long-term project rules for Codex agents working in this repository.

## Scope

- This is a Next.js AI Companion template with configurable themes, avatar, chat, moments, memory, and profile pages.
- Preserve the existing information architecture, routes, API handlers, state management, and data structures unless the user explicitly asks for functional changes.
- UI work should be scoped to styling, assets, and theme configuration unless otherwise requested.

## Design Rules

- The active local visual direction is the Jiang Yan / Yanyun night theme: moonlit bamboo forest, traditional Chinese atmosphere, quiet blue-green palette, xuan paper cards, and restrained dark cinnabar seal accents.
- Prioritize readability over decoration. Card, panel, and chat surfaces should remain calm, opaque enough for text, and usable on mobile.
- Avoid cyberpunk, neon, bright gradients, glassmorphism, cute styling, excessive animation, and gold-luxury treatment.
- Do not replace the current information structure with a landing page or marketing page.

## Navigation Icons

- Bottom navigation icons must use the final PNG assets in `public/assets/icons/navigation/`.
- Do not regenerate, redraw, reinterpret, optimize, or replace these icons with SVGs or icon libraries.
- Required mapping:
  - Home: `home-seal.png`
  - Chat: `chat-seal.png`
  - Moments: `moments-seal.png`
  - Memory: `memory-seal.png`
  - Profile: `profile-seal.png`
- Keep icon styling simple: transparent background, consistent size, inactive opacity, active opacity, and subtle hover scale only.

## Workflow

- Inspect the current repository state before editing.
- Treat the worktree as potentially dirty. Do not revert or delete user or prior-agent changes unless the user explicitly asks.
- Prefer focused edits and preserve existing component boundaries.
- Run type checks and a build when changes affect code:
  - `npm run typecheck`
  - `npm run build`
- If bundled tools are needed in this Codex environment, direct equivalents used successfully are:
  - `node_modules\typescript\bin\tsc --noEmit`
  - `node_modules\next\dist\bin\next build`

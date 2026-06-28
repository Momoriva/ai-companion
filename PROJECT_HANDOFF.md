# PROJECT_HANDOFF.md

Generated on 2026-06-28 from the current repository state.

## 1. Current Project Goal

The project is a Next.js AI Companion local website. The current active design direction is a Jiang Yan / Yanyun night theme with:

- Moonlit bamboo forest and old-house atmosphere.
- Quiet blue-green ancient Chinese visual style.
- Xuan paper / letter-paper cards and chat surfaces.
- Dark cinnabar seal-style bottom navigation icons.
- Existing routes and product functionality preserved.

The latest user instruction says not to continue implementation beyond this handoff, and future icon work must use the provided final PNG assets directly.

## 2. Completed Modifications

Based on the current code and Git status, these changes are present in the working tree:

- Added a `yanyunNight` theme and wired it into the theme registry.
- Switched `config/site.json` to use `yanyunNight` and the generated Jiang Yan avatar asset.
- Added a preview theme page and preview assets under `public/theme-preview/` and `src/preview/`.
- Applied moonlit bamboo / old-house background styling to the active local site.
- Adjusted card and panel styling toward opaque xuan paper surfaces.
- Reduced modern rounded-card feel in shared card styles.
- Added paper-note styles for chat panel, chat bubbles, and chat composer.
- Improved Moments page readability by using a more opaque paper panel.
- Replaced bottom navigation icon-library icons with final PNG assets in `public/assets/icons/navigation/`.
- Processed the five uploaded final PNG navigation icons to remove white background while preserving the user-provided red seal artwork.
- Verified the five navigation routes returned `200` after restarting the dev server:
  - `/`
  - `/chat`
  - `/moments`
  - `/memory`
  - `/profile`
- Verified code with:
  - TypeScript check: passed.
  - Next production build: passed.

## 3. Unfinished Tasks, By Priority

1. Visual QA of the final PNG navigation icons in the browser.
   - Confirm that the white background removal is visually acceptable at 32px.
   - Confirm the route-to-icon mapping:
     - Home: bamboo old house.
     - Chat: letter and brush.
     - Moments: wooden horse.
     - Memory: bamboo, sword, sword tassel.
     - Profile: returning swallows.

2. Review whether older generated SVG navigation assets should remain.
   - `public/theme-preview/icons/nav-*.svg` still exist as preview artifacts.
   - Do not delete them without user approval, because the worktree is dirty and they may be useful historical preview assets.

3. Review whether temporary screenshot and reference folders should be cleaned.
   - Current untracked folders include `.tmp-chrome-shot/`, `.tmp-chrome-shot-mobile/`, `tmp/`, and `public/theme-preview/`.
   - Do not delete without user approval.

4. Review text encoding in `config/site.json`.
   - The file displays mojibake in PowerShell output for several Chinese strings.
   - The app builds successfully, but user-facing copy may need an explicit content pass later.

5. Decide whether to keep the theme-preview route.
   - `src/pages/theme-preview.tsx` and `src/preview/` are untracked in Git status.
   - They are useful for visual review but are not part of the core app flow.

## 4. Files Involved And Purpose

Current modified tracked files from `git status --short`:

- `.gitignore`
  - Modified before this handoff. Exact intent should be reviewed from diff before committing.
- `config/site.json`
  - Active site config. Currently sets avatar to `/theme-preview/yanyun-scholar-avatar.png` and theme to `yanyunNight`.
- `next.config.ts`
  - Modified before this handoff. Review diff before committing.
- `src/components/AppLayout.tsx`
  - Adds theme data attribute and root class used by global theme styling.
- `src/components/BottomNav.tsx`
  - Uses final PNG navigation assets from `/assets/icons/navigation/`.
- `src/components/CompanionAvatar.tsx`
  - Uses regular `img` loading for local avatar asset.
- `src/components/GlassCard.tsx`
  - Shared card wrapper. Rounded corners reduced from large modern radius to paper-card radius.
- `src/components/PageHeader.tsx`
  - Adds class for theme-specific header styling.
- `src/lib/theme.ts`
  - Exposes theme CSS variables and font variable.
- `src/pages/chat.tsx`
  - Adds classes for paper-note chat panel, chat bubbles, and composer styling.
- `src/pages/moments.tsx`
  - Adds Moments-specific paper panel class and direct avatar image usage.
- `src/styles/globals.css`
  - Main theme styling for background, xuan paper cards, Moments panel, chat paper notes, nav icon states, and Jiang Yan theme overrides.
- `src/themes/blue.ts`, `src/themes/minimal.ts`, `src/themes/pink.ts`
  - Modified before this handoff. Review exact diff before committing.
- `src/themes/index.ts`
  - Registers `yanyunNight`.
- `src/themes/types.ts`
  - Theme token type updated.
- `src/types/site.ts`
  - Adds `yanyunNight` to `ThemeName`.
- `tailwind.config.ts`
  - Modified before this handoff. Review exact diff before committing.

Current untracked project files and folders relevant to this design work:

- `AGENTS.md`
  - Long-term project rules created for future agents.
- `PROJECT_HANDOFF.md`
  - This handoff file.
- `public/assets/icons/navigation/home-seal.png`
  - Final PNG Home icon: bamboo old house.
- `public/assets/icons/navigation/chat-seal.png`
  - Final PNG Chat icon: letter and brush.
- `public/assets/icons/navigation/moments-seal.png`
  - Final PNG Moments icon: wooden horse.
- `public/assets/icons/navigation/memory-seal.png`
  - Final PNG Memory icon: bamboo, sword, sword tassel.
- `public/assets/icons/navigation/profile-seal.png`
  - Final PNG Profile icon: returning swallows.
- `public/theme-preview/`
  - Preview assets, screenshots, generated avatar/background, and older preview icon artifacts.
- `src/pages/theme-preview.tsx`
  - Preview page route.
- `src/preview/`
  - Preview theme components and CSS module.
- `src/themes/bubblegum.ts`
  - Theme file currently untracked.
- `src/themes/yanyunNight.ts`
  - Active Jiang Yan / Yanyun theme token file.
- `themes/bubblegum.json`
  - Theme JSON currently untracked.
- `tmp/`
  - Reference files and dev logs.

## 5. Confirmed Design Requirements And Forbidden Changes

Confirmed requirements:

- Keep the Jiang Yan / Yanyun theme: moonlit bamboo forest, old house, quiet blue-green palette, ancient Chinese atmosphere.
- Use calm, premium, readable UI. Avoid visual noise.
- Cards and chat surfaces should feel like xuan paper, book pages, or letter paper.
- Moments page must be readable with opaque or low-transparency paper cards.
- Bottom navigation must use the five final PNG icons supplied by the user.
- The final PNG assets must live in `public/assets/icons/navigation/` with these names:
  - `home-seal.png`
  - `chat-seal.png`
  - `moments-seal.png`
  - `memory-seal.png`
  - `profile-seal.png`
- Navigation icon inactive opacity should be around `0.72`; active state should be `1`.
- Hover may use only subtle scale, currently `scale(1.04)`.

Forbidden unless the user explicitly changes direction:

- Do not redesign, regenerate, redraw, reinterpret, or optimize the final navigation icons.
- Do not use Lucide, React Icons, or any icon library for the bottom navigation icons.
- Do not replace the five PNGs with SVGs.
- Do not add white circular or square icon backgrounds.
- Do not add neon, modern glow, or flashy animation to the nav icons.
- Do not change business logic, APIs, routes, state management, or data structures for visual-only tasks.
- Do not delete untracked preview or temp assets without explicit user approval.

## 6. Current Issues, Temporary Workarounds, And Risks

- The working tree is dirty and contains both tracked modifications and many untracked assets. Review diffs before committing.
- Some modified tracked files appear unrelated to the latest PNG icon task, such as `.gitignore`, `next.config.ts`, base theme files, and `tailwind.config.ts`. They predate this handoff; inspect before staging.
- `config/site.json` displays mojibake in PowerShell output for Chinese text. The build passes, but visible copy may need a later cleanup pass.
- `public/theme-preview/icons/nav-*.svg` are older generated icon previews and are no longer used by `BottomNav.tsx`. They remain in the repo as untracked preview assets.
- The PNG white-background removal was performed mechanically using alpha thresholding. It preserves the provided artwork and removes white background, but small white negative-space details may also become transparent. This matches the requirement to avoid white icon backgrounds, but visual QA at actual nav size is still recommended.
- Local dev server management in this Codex environment can be inconsistent when launched in background. A successful workaround is to launch with `cmd.exe /k` and bind Next to `127.0.0.1`.
- Chrome command-line screenshots sometimes captured connection-refused pages unless the dev server was started and screenshot in the same command. Use route status checks before trusting screenshots.
- `pnpm build` previously attempted dependency install and failed under restricted network. Direct local Next build via Node succeeded.

## 7. Startup, Build, And Check Commands

Package scripts from `package.json`:

```powershell
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

Commands that succeeded in this Codex environment:

```powershell
& 'C:\Users\puxit\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules\typescript\bin\tsc --noEmit
& 'C:\Users\puxit\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules\next\dist\bin\next build
```

Dev server command that returned `200` for all five main routes:

```powershell
Start-Process -FilePath 'cmd.exe' -ArgumentList @('/k', 'cd /d "D:\my project\ai-companion-white-template" && "C:\Users\puxit\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules\next\dist\bin\next dev -H 127.0.0.1') -WindowStyle Hidden
```

Route check:

```powershell
$paths = @('/', '/chat', '/moments', '/memory', '/profile')
foreach ($path in $paths) {
  (Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000$path").StatusCode
}
```

## 8. Specific Next Steps For The Next Codex

1. Do not change implementation immediately. First inspect current Git status and diffs.
2. Open the live site at `http://127.0.0.1:3000/` and visually QA the final PNG nav icons.
3. Confirm each icon appears on the correct route and no white square/circle background is visible:
   - Home: bamboo old house.
   - Chat: letter and brush.
   - Moments: wooden horse.
   - Memory: bamboo, sword, sword tassel.
   - Profile: returning swallows.
4. If the icons show white residue, only adjust the existing PNG transparency processing or CSS display. Do not redraw or replace the icons.
5. Review `git diff` for files not directly related to the latest requested task before staging or committing anything.
6. Ask the user before deleting old preview SVG icons, screenshots, temporary folders, or generated preview routes.
7. If asked to continue UI work, preserve business logic and focus on styling only.

## 9. Basis Of This Handoff

This handoff is based on:

- Current file tree from `rg --files`.
- Current Git status from `git status --short`.
- Current code in `BottomNav.tsx`, `yanyunNight.ts`, `config/site.json`, and `package.json`.
- Recent successful checks:
  - `tsc --noEmit`: passed.
  - `next build`: passed.
  - Route checks for `/`, `/chat`, `/moments`, `/memory`, `/profile`: all returned `200` after a dev server restart.

No assumptions from older conversation history are required to continue; use this file plus the current repository state.

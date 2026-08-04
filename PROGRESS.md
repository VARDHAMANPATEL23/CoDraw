# PROGRESS.md — CoDraw
> **Agents: Update this file after every completed task. This is your memory across sessions.**
> Format: check off `[x]` tasks, add a checkpoint entry, note any blockers or decisions.

---

## Current Status

| Field | Value |
|---|---|
| **Current Phase** | Phase 5 — Polish & Release (in progress) |
| **Last Completed Task** | 5.0-hotfix — URL routing, logout cleanup, advanced styling, zoom fix, bun migration |
| **Next Task** | 5.1 — Component grouping, user isolation, ZIP import, Blender-style UI redesign |
| **Blockers** | None |
| **Human Decisions Pending** | D1, D2, D3, D4, D5 (see AGENTS.md §12) |

---

## Phase Status Overview

| Phase | Name | Status |
|---|---|---|
| Phase 1 | Foundation | Completed |
| Phase 2 | Core Editor | Completed |
| Phase 3 | Export Engine | Completed |
| Phase 4 | Auth & Cloud Sync | Completed |
| Phase 5 | Polish & Release | In Progress |

---

## Phase 1 — Foundation

### Task Checklist
- [x] 1.1 — Init monorepo (`/client` CRA + `/server` Express)
- [x] 1.2 — Install client dependencies
- [x] 1.3 — Install server dependencies
- [x] 1.4 — Basic 3-panel layout (Left / Canvas / Right)
- [x] 1.5 — Canvas area (1440px, grid overlay, drop zone)
- [x] 1.6 — Zustand store (`useCanvasStore`)
- [x] 1.7 — Drag from left panel → drop onto canvas (dnd-kit)
- [x] 1.8 — First 5 component definitions (`Navbar`, `HeroSection`, `Button`, `Paragraph`, `Footer`)
- [x] 1.9 — Canvas → JSON → IndexedDB save/load (Dexie.js)
- [x] 1.10 — New Project modal (name, language JS/TS, styling system)
- [x] 1.11 — Project Dashboard (list, open, duplicate, delete)

### Phase 1 Checkpoint

```
Date completed: 2026-07-25
Tasks completed: 11 / 11
Notes: Monorepo initialized with Bun workspaces. React client and Express server configured. 3-panel editor UI, Zustand store, dnd-kit drag-and-drop, first 5 component definitions, Dexie IndexedDB persistence, New Project modal, and Project Dashboard implemented and verified in browser.
Blockers resolved: Resolved CRA eslint configuration for Bun.
Issues found: None.
```

---

## Phase 2 — Core Editor

### Task Checklist
- [x] 2.1 — All remaining component definitions (full library, Section 5 list)
- [x] 2.2 — Properties Panel with editable field types
- [x] 2.3 — Styling System badge in Properties Panel
- [x] 2.4 — Language badge (JS/TS) in Properties Panel + top bar
- [x] 2.5 — Mid-project styling system switch with confirmation dialog
- [x] 2.6 — Undo/redo (Ctrl+Z / Ctrl+Shift+Z, max 50 history states)
- [x] 2.7 — Component reordering via hover controls & reorder store action
- [x] 2.8 — Multi-select, duplicate, delete
- [x] 2.9 — Live Preview mode (full-screen overlay)
- [x] 2.10 — Left Panel: searchable, grouped by category, draggable items

### Phase 2 Checkpoint

```
Date completed: 2026-07-25
Tasks completed: 10 / 10
Notes: Phase 2 complete. Built full 23-component library definitions with JS/TS templates and style maps across Tailwind, CSS Modules, and Bootstrap 5. Added Properties Panel with rich input schemas, mid-project styling switch, keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+D, Delete), canvas reordering hover controls, Live Preview modal, and categorized searchable component browser.
Blockers resolved: None.
Issues found: None.
```

---

## Phase 3 — Export Engine

### Task Checklist
- [x] 3.1 — Export engine core (`/engine/index.js`) — tree resolver
- [x] 3.2 — Template renderer (JS/TS, placeholder resolution, styleMap)
- [x] 3.3 — Page generator (`src/pages/Home.jsx` / `.tsx`)
- [x] 3.4 — Project scaffold generator (`App`, `index`, `package.json`, `public/index.html`)
- [x] 3.5 — Tailwind config generator
- [x] 3.6 — CSS Modules generator (per-component `.module.css`)
- [x] 3.7 — Bootstrap generator (`src/index.css` with CDN import)
- [x] 3.8 — README generator
- [x] 3.9 — ZIP assembly and download (JSZip + file-saver)
- [x] 3.10 — Export button wired in top bar (loading + success toast)
- [x] 3.11 — Manual QA: 6 export combinations (3 styling × 2 language)

### Phase 3 Manual QA Results

| Combo | Exports? | `npm install` passes? | `npm start` runs? | Notes |
|---|---|---|---|---|
| Tailwind + JS | Yes | Yes | Yes | Standard CRA structure with tailwind directives |
| Tailwind + TS | Yes | Yes | Yes | Standard CRA structure with TypeScript interfaces |
| CSS Modules + JS | Yes | Yes | Yes | Scoped `.module.css` imports per component |
| CSS Modules + TS | Yes | Yes | Yes | Scoped `.module.css` with TSX component templates |
| Bootstrap + JS | Yes | Yes | Yes | Includes Bootstrap 5 dependency & CSS import |
| Bootstrap + TS | Yes | Yes | Yes | Includes Bootstrap 5 dependency & TSX templates |

### Phase 3 Checkpoint

```
Date completed: 2026-07-25
Tasks completed: 11 / 11
Notes: Export engine 100% complete and client-side. Generates clean React CRA projects with user choice of JS/TS language and Tailwind, CSS Modules, or Bootstrap 5 styling system. Includes automated README.md, package.json, and page layout wiring. Packaged into ZIP download using JSZip and file-saver. Verified in browser testing.
Blockers resolved: None.
Issues found: None.
```

---

## Phase 4 — Auth & Cloud Sync

### Task Checklist
- [x] 4.1 — Express server scaffold (routes, CORS, body parser)
- [x] 4.2 — Mongoose models (User, Project)
- [x] 4.3 — Auth routes (register, login, me)
- [x] 4.4 — Project routes (list, sync, delete)
- [x] 4.5 — Client-side auth (modal, JWT, `useAuthStore`)
- [x] 4.6 — Offline sync queue (Dexie `syncQueue` table, flush on reconnect)
- [x] 4.7 — Online/offline indicator in top bar
- [x] 4.8 — Load merge: server projects + local IndexedDB (last-write-wins)

### Phase 4 Checkpoint

```
Date completed: 2026-07-25
Tasks completed: 8 / 8
Notes: Phase 4 complete. Implemented Express API for Auth & Project Sync with JWT authentication, password hashing via bcrypt, and MongoDB Mongoose models. Created client-side useAuthStore, AuthModal, and offline sync queue with Dexie.js (syncQueue table). Top bar and dashboard now feature network status indicators (Online/Offline) and seamless background project synchronization with last-write-wins merging.
Blockers resolved: None.
Issues found: None.
```

---

## Phase 5 — Polish & Release

### Task Checklist
- [x] 5.0-hotfix — Critical bug fixes and UX improvements (see below)
- [ ] 5.1 — Workbox service worker (app shell caching)
- [ ] 5.2 — "New update available" banner
- [ ] 5.3 — Error state audit (all async ops)
- [ ] 5.4 — Loading state audit (skeletons, spinners, disabled buttons)
- [ ] 5.5 — Cross-browser QA (Chrome, Firefox, Edge)
- [ ] 5.6 — Keyboard shortcut audit
- [ ] 5.7 — Empty states (canvas, dashboard, search)
- [ ] 5.8 — Production deploy (Vercel + Railway/Render)
- [ ] 5.9 — Final end-to-end QA on clean machine

### 5.0-hotfix — Critical Bug Fixes & UX Improvements (2026-08-04)

**Fixes applied:**

1. **MongoDB Atlas Connection**: Fixed `dotenv` path resolution in `server/index.js` — was loading `.env` from CWD instead of `server/.env` when started from monorepo root. Explicit `path.join(__dirname, '.env')` resolves the issue.

2. **New Project Modal**: Modal was disconnected from the DOM. Imported `NewProjectModal` into `App.js` and wired `isOpen`/`onProjectCreated` props. Removed duplicate top-right `+ New Project` button from Dashboard (only center button remains).

3. **Canvas Zoom Overflow**: Restructured `CanvasArea.jsx` scaling — wrapped the 1440px canvas inside a dynamically-sized container that tracks scaled dimensions. Eliminates horizontal scrollbar overflow. Default zoom reduced to 70%.

4. **Advanced Styling Panel**: Added "Advanced Styling" section to RightPanel with: Width, Height, Margin, Padding, Border Radius, CSS Position (static/relative/absolute/fixed/sticky), Top/Bottom, Left/Right, and Z-Index. Applied to component wrapper via `getAdvancedStyles()` in `CanvasArea.jsx`.

5. **URL-based Routing**: Installed `react-router-dom`. Routes: `/` (dashboard), `/project/:projectId` (editor). On page refresh the editor hydrates from IndexedDB using the URL project ID. If project not found, redirects to `/`.

6. **Logout Cleanup**: `useAuthStore.logout()` now clears `localStorage` auth keys, `sessionStorage`, and wipes IndexedDB `projects` + `syncQueue` tables. Ensures clean slate for next user session.

7. **Bun Migration**: Replaced all `npm` references with `bun` in `package.json` scripts, `start.sh`, and `start.bat`. Bun v1.3.14 confirmed installed.

### Upcoming Features (Requested, Not Yet Implemented)

| # | Feature | Status |
|---|---------|--------|
| A | Component grouping (multi-select, group/ungroup, move as group) | Pending |
| B | User isolation (users only see own projects) + ZIP import into editor | Pending |
| C | Blender-style UI redesign | Pending |

### Cross-Browser QA Results
> _(Agent: fill in after task 5.5)_

| Browser | Version | Issues Found |
|---|---|---|
| Chrome | | |
| Firefox | | |
| Edge | | |

### Phase 5 Checkpoint (v1 Release Summary)
> _(Agent: fill this in when Phase 5 is complete)_

```
Date completed:
v1 Release tag: v1.0.0
Deploy URLs:
  Client:
  Server:
Final QA result:
Known issues deferred to v2:
```

---

## Decisions Log

| ID | Decision | Status | Resolution |
|---|---|---|---|
| D1 | App domain / URL | Pending | |
| D2 | Monetization model | Pending | |
| D3 | OAuth provider | Pending | |
| D4 | Open source? | Pending | |
| D5 | Canvas component cap (suggested: 50) | Pending | |
| D6 | Runtime: Bun | Resolved | Switched to Bun v1.3.14 for all dev/build/run tasks |

---

## v2 Backlog (out of scope for v1)
> Add items here when the human raises them mid-v1.

- Responsive / mobile preview mode
- Vue, Angular, Svelte, Next.js export targets
- Vite as export option
- AI-assisted layout generation
- Real-time collaboration
- Deployment integration (Vercel/Netlify from within CoDraw)
- TypeScript for the builder UI itself
- Custom component import by user

---

## Session Notes
> _(Agent: add brief notes here at the start and end of each session)_

| Date | Session Summary |
|---|---|
| July 2026 | AGENTS.md + PROGRESS.md created. Project not yet started. |
| 2026-07-25 | Phases 1-4 completed in full. All 23 components, export engine, auth, cloud sync. |
| 2026-08-04 | MongoDB Atlas connection fixed. New Project modal wired. Canvas zoom fixed. Advanced styling panel added. URL routing with react-router-dom. Logout cleanup. Migrated from npm to bun. |

---

*PROGRESS.md — CoDraw v1 — Updated by agent on 2026-08-04*

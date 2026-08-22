# AGENTS.md — CoDraw
> **Read this entire file before writing a single line of code.**
> This is the authoritative instruction set for any AI agent working on the CoDraw project.
> Every decision made here is intentional. Do not deviate without explicit human approval.

---

## 0. Agent Operating Rules

These rules apply unconditionally to every agent session:

1. **Always read this file first.** Before any action, re-read AGENTS.md top to bottom.
2. **Always read PROGRESS.md before starting work.** It tells you exactly where the project is and what to do next.
3. **Write a checkpoint to PROGRESS.md after every completed task.** No exceptions.
4. **Never skip ahead.** Complete Phase tasks in order. If a dependency is incomplete, fix it before moving forward.
5. **Never assume.** If a decision is marked `[HUMAN DECISION NEEDED]`, stop and ask the human before proceeding.
6. **Never break what works.** Run the relevant test/check after every meaningful change.
7. **Prefer explicit over clever.** Write code a junior developer can read and modify.
8. **One task at a time.** Complete, test, and checkpoint before starting the next.
9. **No AI-generated UI components.** All components are hand-authored, deterministic, and predictable.
10. **Commit message format:** `[phase-X.Y] short description` — e.g. `[phase-1.2] add IndexedDB save/load`

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | CoDraw |
| **Type** | Browser-based visual website builder |
| **Core Concept** | Drag-and-drop UI components on a canvas → export clean React codebase + README |
| **Team** | 3 developers (Vardhman + 2 collaborators) |
| **Stack** | React.js (CRA) · Node.js · Express · MongoDB · HTML/CSS/JS |
| **v1 Export Target** | React.js (Create React App — NOT Vite) |
| **Language Support** | JavaScript and TypeScript — user selects per project |
| **Design Inspiration** | MS Paint · Figma · Photopea |
| **AI Usage** | Zero AI in the builder or export pipeline |

---

## 2. Architecture Overview

```
codraw/
├── client/                  # React CRA app — the builder UI
│   ├── public/
│   ├── src/
│   │   ├── components/      # Builder UI components (panels, canvas, toolbar)
│   │   ├── library/         # Pre-built draggable UI component definitions
│   │   ├── engine/          # Export engine: JSON → React code + ZIP
│   │   ├── store/           # Zustand canvas state
│   │   ├── hooks/           # Custom hooks (useOfflineSync, useProjectDB, etc.)
│   │   ├── db/              # IndexedDB interface (Dexie.js)
│   │   ├── utils/           # Helpers
│   │   └── App.js
│   └── package.json
│
├── server/                  # Node.js + Express API
│   ├── routes/              # /auth, /projects
│   ├── models/              # Mongoose: User, Project
│   ├── middleware/          # JWT auth middleware
│   ├── controllers/
│   └── index.js
│
├── AGENTS.md                # ← You are here
├── PROGRESS.md              # ← Always update after every task
└── README.md
```

---

## 3. Core Constraints — Never Violate These

### 3.1 Export Engine
- Export target is **React.js (CRA)** only in v1. No Vite. No Next.js.
- CRA scaffold: `npx create-react-app my-app` (JS) or `npx create-react-app my-app --template typescript` (TS)
- The export engine runs **100% client-side**. No server round-trip for guest users.
- Exported ZIP must be runnable with `npm install && npm start` on a fresh machine — no extra config.
- Exported code must have **zero runtime dependency on CoDraw**.

### 3.2 Language Selection
- Every project has a `language` field: `"js"` or `"ts"`.
- User selects language at **project creation** via a modal. Cannot be changed after creation (v1).
- JS projects export `.js` / `.jsx` files.
- TS projects export `.ts` / `.tsx` files with proper type annotations on all component props.
- The component library must support both. Each component definition includes both a JS and TS template.
- The Properties Panel shows a language badge (JS / TS) as a non-editable indicator.

### 3.3 Styling System
- Supported: **Tailwind CSS**, **Plain CSS / CSS Modules**, **Bootstrap 5**
- User selects at project creation. Can be switched mid-project (with confirmation dialog warning style loss).
- Switching re-maps all component class props — never silently drops styles.
- Each component in the library defines style mappings for all 3 systems.

### 3.4 Offline First
- The full editor (canvas, drag-drop, properties, export) works with zero network.
- All project state persisted to **IndexedDB** via Dexie.js immediately on every change.
- Service worker (Workbox) caches the app shell.
- Logged-in users: pending sync operations queued in IndexedDB, flushed on reconnect.
- An online/offline indicator badge is always visible in the top bar.

### 3.5 Auth
- Guest mode: full feature access. Projects stored in IndexedDB only.
- Account mode: JWT auth. Projects synced to MongoDB.
- No feature gating in v1. Auth = persistence convenience only.

---

## 4. Canvas JSON Schema

This is the **single source of truth** for every project. The export engine reads this JSON — not the visual canvas state.

```json
{
  "meta": {
    "projectId": "uuid-v4",
    "name": "My Project",
    "version": "1.0",
    "framework": "react-cra",
    "language": "js",
    "stylingSystem": "tailwind",
    "createdAt": "ISO-8601",
    "updatedAt": "ISO-8601"
  },
  "canvas": {
    "width": 1440,
    "gridSize": 8,
    "components": [
      {
        "id": "comp_001",
        "type": "Navbar",
        "parentId": null,
        "order": 0,
        "props": {
          "brand": "My Site",
          "links": ["Home", "About", "Contact"],
          "linkTo": "/about",
          "backgroundColor": "#1a1a2e",
          "textColor": "#ffffff"
        },
        "children": []
      }
    ]
  }
}
```

**Rules:**
- `projectId` is a UUID v4, generated once at creation, never changed.
- `language` is `"js"` or `"ts"` — set at creation, immutable.
- `stylingSystem` is `"tailwind"` | `"css-modules"` | `"bootstrap"` — mutable with confirmation.
- `framework` is always `"react-cra"` in v1.
- Every component node has a unique `id`, a `type` matching a library entry, and a `props` object.
- `parentId: null` means root-level (direct child of page). Non-null means nested inside another component.
- `order` is the render order among siblings (0-indexed).
- **MPA Support:** Components like Button, Card, and CTABlock can accept a `linkTo` prop to act as navigational anchors (`<a>` tags) within the exported site.

---

## 5. Component Library Specification

Each component in `/client/src/library/` is a definition object, not a React component.

```js
// Example: library/components/Navbar.js
export const NavbarDef = {
  type: 'Navbar',
  category: 'Navigation',
  label: 'Navbar',
  icon: 'layout-navbar',           // icon name from icon set
  defaultProps: {
    brand: 'My Site',
    links: ['Home', 'About', 'Contact'],
    backgroundColor: '#ffffff',
    textColor: '#111111',
  },
  propsSchema: [
    { key: 'brand',           label: 'Brand Name',      type: 'text' },
    { key: 'links',           label: 'Nav Links',       type: 'array-text' },
    { key: 'backgroundColor', label: 'Background',      type: 'color' },
    { key: 'textColor',       label: 'Text Color',      type: 'color' },
  ],
  styleMap: {
    tailwind: {
      wrapper: 'flex items-center justify-between px-6 py-4',
      brand:   'text-xl font-bold',
      link:    'ml-4 text-sm hover:underline',
    },
    'css-modules': {
      wrapper: 'navbar__wrapper',
      brand:   'navbar__brand',
      link:    'navbar__link',
    },
    bootstrap: {
      wrapper: 'navbar navbar-expand-lg',
      brand:   'navbar-brand',
      link:    'nav-link',
    },
  },
  templates: {
    js: `
import React from 'react';
{{CSS_IMPORT}}

export default function Navbar({ brand, links, backgroundColor, textColor }) {
  return (
    <nav className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <span className="{{BRAND_CLASS}}">{brand}</span>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link, i) => (
          <li key={i}><a href="#" className="{{LINK_CLASS}}">{link}</a></li>
        ))}
      </ul>
    </nav>
  );
}
    `,
    ts: `
import React from 'react';
{{CSS_IMPORT}}

interface NavbarProps {
  brand: string;
  links: string[];
  backgroundColor: string;
  textColor: string;
}

export default function Navbar({ brand, links, backgroundColor, textColor }: NavbarProps) {
  return (
    <nav className="{{WRAPPER_CLASS}}" style={{ backgroundColor, color: textColor }}>
      <span className="{{BRAND_CLASS}}">{brand}</span>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link, i) => (
          <li key={i}><a href="#" className="{{LINK_CLASS}}">{link}</a></li>
        ))}
      </ul>
    </nav>
  );
}
    `,
  },
};
```

**Template placeholder rules:**
- `{{CSS_IMPORT}}` → resolved by export engine based on styling system (empty for Tailwind, `import styles from './Navbar.module.css'` for CSS Modules, nothing for Bootstrap since it's global)
- `{{WRAPPER_CLASS}}`, `{{BRAND_CLASS}}`, `{{LINK_CLASS}}` → resolved from `styleMap[selectedSystem]`
- Prop values are injected at export time from the JSON `props` object

### v1 Component List (build in this order)

**Category: Layout**
- [ ] Section
- [ ] Container
- [ ] Divider
- [ ] Spacer

**Category: Navigation**
- [ ] Navbar
- [ ] Footer

**Category: Typography**
- [ ] Heading (H1–H6, selectable level)
- [ ] Paragraph
- [ ] Badge

**Category: Forms & Input**
- [ ] Button
- [ ] Text Input
- [ ] Textarea
- [ ] Number Input
- [ ] Select Dropdown
- [ ] Search Box
- [ ] Checkbox
- [ ] Radio

**Category: Media**
- [ ] Image
- [ ] Icon

**Category: UI Blocks**
- [ ] Card
- [ ] Hero Section
- [ ] CTA Block
- [ ] Feature Block

---

## 6. Export Engine Specification

Location: `/client/src/engine/`

### 6.1 Entry Point
```js
// engine/index.js
export async function exportProject(projectJSON) {
  const { meta, canvas } = projectJSON;
  const zip = new JSZip();
  // ... build file tree, add to zip, trigger download
}
```

### 6.2 Pipeline Steps (in order)
1. **Resolve component tree** — sort `canvas.components` by `order`, resolve parent-child nesting
2. **Resolve language** — check `meta.language` (`"js"` or `"ts"`)
3. **Resolve styling system** — check `meta.stylingSystem`
4. **Generate component files** — for each unique component `type` in the tree, render its template with resolved classes and prop defaults
5. **Generate page file** — `src/pages/Home.jsx` (or `.tsx`) — imports all root-level components and renders them in order
6. **Generate App file** — `src/App.js` (or `.tsx`) — imports and renders `<Home />`
7. **Generate entry** — `src/index.js` (or `.tsx`)
8. **Generate styles** — if Tailwind: `tailwind.config.js` + `src/index.css` with `@tailwind` directives; if CSS Modules: individual `.module.css` files per component; if Bootstrap: `src/index.css` importing Bootstrap CDN
9. **Generate package.json** — standard CRA package.json with correct dependencies for chosen styling system
10. **Generate README.md** — see Section 6.3
11. **Pack ZIP** — using JSZip, trigger `saveAs(blob, 'codraw-export.zip')`

### 6.3 Generated README.md Template

```markdown
# {{PROJECT_NAME}}

Generated by CoDraw — https://codraw.app

## Prerequisites
- Node.js v18 or higher
- npm v9 or higher

## Getting Started

\`\`\`bash
# 1. Unzip the project
unzip codraw-export.zip && cd {{PROJECT_FOLDER}}

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
\`\`\`

The app runs at http://localhost:3000

## Project Structure

\`\`\`
src/
├── components/     # Individual UI components
├── pages/
│   └── Home.jsx    # Main page — edit this to rearrange sections
├── App.js          # Root component
└── index.js        # Entry point
\`\`\`

## Styling System: {{STYLING_SYSTEM}}

{{STYLING_INSTRUCTIONS}}

## How to Customise

- **Change text:** Open the component file in `src/components/` and edit the prop defaults or the JSX directly.
- **Add a new section:** Import a component into `src/pages/Home.jsx` and add it to the JSX.
- **Change colours:** Edit the `style` prop or className on the relevant component.

## Common Errors

| Error | Fix |
|---|---|
| `npm install` fails | Make sure Node.js v18+ is installed: `node -v` |
| Port 3000 in use | Run `PORT=3001 npm start` |
| Tailwind classes not applying | Ensure `tailwind.config.js` `content` paths include `./src/**/*.{js,jsx}` |
| Module not found | Delete `node_modules/` and run `npm install` again |

## Language: {{LANGUAGE}}

{{LANGUAGE_NOTE}}
```

---

## 7. UI Layout Reference

```
┌────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Logo | Project Name | Undo Redo | Preview | Save | Export | [JS/TS] | ●Online │
├───────────────┬────────────────────────────────────┬───────────────┤
│  LEFT PANEL   │                                    │  RIGHT PANEL  │
│               │         C A N V A S                │               │
│  Component    │   (represents the webpage)         │  Properties   │
│  Library      │   grid overlay, drop zone          │  Panel        │
│               │   components render visually       │               │
│  [search]     │                                    │  [context-    │
│               │                                    │   sensitive]  │
│  Layout       │                                    │               │
│  Navigation   │                                    │  Styling:     │
│  Typography   │                                    │  [Tailwind ▾] │
│  Forms        │                                    │               │
│  Media        │                                    │  Lang: [JS]   │
│  UI Blocks    │                                    │  (read-only)  │
├───────────────┴────────────────────────────────────┴───────────────┤
│ BOTTOM BAR: Zoom [−][+] | Grid [toggle] | Active: [Main/Isolated] | Components: 4 | JSON View (dev) │
└────────────────────────────────────────────────────────────────────┘
```

---

## 8. Development Phases & Task Checklist

> **For agents:** Work through tasks in order. After each `[ ]` task is complete, change it to `[x]` in PROGRESS.md (not here). Update the Phase status in PROGRESS.md.

---

### Phase 1 — Foundation (Weeks 1–3)
**Goal:** Repo, canvas, 5 components working, JSON save/load.

- [ ] **1.1** Init monorepo: `/client` (CRA) and `/server` (Express). Add root `package.json` with workspaces. Commit.
- [ ] **1.2** Install client deps: `zustand`, `dnd-kit` (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`), `dexie`, `uuid`, `jszip`, `file-saver`
- [ ] **1.3** Install server deps: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`
- [ ] **1.4** Build the basic 3-panel layout (Left / Canvas / Right) with Tailwind CSS applied to the builder UI itself. No functionality yet — just structure and styling.
- [ ] **1.5** Build the canvas area: fixed-width (1440px scaled), grid overlay (8px), drop zone div. No drag yet.
- [ ] **1.6** Set up Zustand store: `useCanvasStore` with `components[]`, `selectedId`, `addComponent`, `updateComponent`, `removeComponent`, `reorderComponents`, `undo`, `redo`.
- [ ] **1.7** Implement drag from left panel → drop onto canvas using dnd-kit. On drop, add component to store with generated UUID and defaultProps.
- [ ] **1.8** Build first 5 components as definition objects in `/library/`: `Navbar`, `HeroSection`, `Button`, `Paragraph`, `Footer`. Canvas renders them visually in order.
- [ ] **1.9** Wire up canvas → JSON serialisation. Every store change triggers a debounced write to IndexedDB (Dexie.js). On app load, read from IndexedDB and hydrate store.
- [ ] **1.10** Build the **New Project modal**: project name field, language selector (JS / TS radio), styling system selector (Tailwind / CSS Modules / Bootstrap radio). Creates a new JSON with correct `meta` and saves to IndexedDB.
- [ ] **1.11** Build the **Project Dashboard** (home screen): lists saved projects from IndexedDB. Options: Open, Duplicate, Delete. "New Project" button opens the modal.

**Phase 1 checkpoint:** Agent must write Phase 1 summary to PROGRESS.md before moving to Phase 2.

---

### Phase 2 — Core Editor (Weeks 4–7)
**Goal:** Full component library, Properties Panel, undo/redo, live preview.

- [ ] **2.1** Build all remaining components in the library (see Section 5 list). Each must have `defaultProps`, `propsSchema`, `styleMap` for all 3 systems, and both JS + TS templates.
- [ ] **2.2** Build the **Properties Panel** (right side). When a component is selected (`selectedId` in store): render its `propsSchema` as editable fields. Field types: `text`, `color`, `array-text`, `number`, `select`, `boolean`. Every change updates the store immediately.
- [ ] **2.3** Add the **Styling System badge** at the top of the Properties Panel (read-only display of current project's styling system).
- [ ] **2.4** Add the **Language badge** (JS / TS) in the Properties Panel and top bar — read-only.
- [ ] **2.5** Implement **mid-project styling system switch**: a dropdown in Properties Panel header. On change → show confirmation dialog ("Switching will re-map all component styles. Continue?") → if confirmed, update `meta.stylingSystem` in store and re-render canvas classes.
- [ ] **2.6** Implement **undo/redo** (Ctrl+Z / Ctrl+Shift+Z). Use a history stack in Zustand — max 50 states. Buttons in top bar also trigger these.
- [ ] **2.7** Implement **component reordering** on canvas: drag handle on each component to change `order`. Update store on drop.
- [ ] **2.8** Implement **multi-select** (click + Shift/Ctrl), **duplicate** (Ctrl+D), **delete** (Delete key or toolbar button).
- [ ] **2.9** Implement **Live Preview mode**: a full-screen overlay that renders the canvas components as actual React with the correct styling system applied. Toggle via "Preview" button in top bar.
- [ ] **2.10** Build the **Left Panel component library browser**: searchable list grouped by category. Each component shows icon + label. Draggable.

**Phase 2 checkpoint:** Agent must write Phase 2 summary to PROGRESS.md before moving to Phase 3.

---

### Phase 3 — Export Engine (Weeks 8–10)
**Goal:** JSON → React CRA ZIP download with README. All 3 styling systems working.

- [ ] **3.1** Build the export engine core (`/engine/index.js`): reads project JSON, resolves component tree (ordered, nested), calls template renderer.
- [ ] **3.2** Build the **template renderer**: for each component type in tree, selects the correct template (JS or TS based on `meta.language`), resolves `{{CSS_IMPORT}}` and all `{{CLASS}}` placeholders from `styleMap[stylingSystem]`, injects actual prop values from JSON.
- [ ] **3.3** Build the **page generator**: produces `src/pages/Home.jsx` (or `.tsx`) that imports all root-level components and renders them in order.
- [ ] **3.4** Build the **project scaffold generator**: produces `App.js/tsx`, `index.js/tsx`, `package.json` (with correct deps for styling system), `public/index.html`.
- [ ] **3.5** Build the **Tailwind config generator**: `tailwind.config.js` + `src/index.css` with directives. Only runs when `stylingSystem === 'tailwind'`.
- [ ] **3.6** Build the **CSS Modules generator**: produces a `.module.css` file per component with class definitions from `styleMap['css-modules']`.
- [ ] **3.7** Build the **Bootstrap generator**: produces `src/index.css` with Bootstrap 5 CDN import. Bootstrap classes come from `styleMap.bootstrap` in templates.
- [ ] **3.8** Build the **README generator**: fills the template from Section 6.3 with project name, language, styling system, and appropriate `{{STYLING_INSTRUCTIONS}}` and `{{LANGUAGE_NOTE}}`.
- [ ] **3.9** Assemble ZIP using JSZip. All files go into a root folder named after the project. Trigger download via `file-saver`.
- [ ] **3.10** Wire the "Export" button in top bar to call `exportProject(currentProjectJSON)`. Show a loading state. Show a success toast on completion.
- [ ] **3.11** **Manual QA checkpoint:** Agent must manually trace a 3-component project (Navbar + Hero + Footer) through the full export pipeline for all 3 styling systems × 2 languages = 6 exports. Verify each ZIP extracts and runs with `npm install && npm start`. Document results in PROGRESS.md.

**Phase 3 checkpoint:** Agent must write Phase 3 summary to PROGRESS.md before moving to Phase 4.

---

### Phase 4 — Auth & Cloud Sync (Weeks 11–13)
**Goal:** Optional accounts, cloud backup, cross-device sync, offline sync queue.

- [ ] **4.1** Build Express server: `index.js`, CORS, JSON body parser, `/api/auth` and `/api/projects` route stubs.
- [ ] **4.2** Build Mongoose models: `User` (email, passwordHash, createdAt), `Project` (userId, projectId, name, jsonBlob, updatedAt).
- [ ] **4.3** Build auth routes: `POST /api/auth/register`, `POST /api/auth/login` (returns JWT), `GET /api/auth/me` (verify token).
- [ ] **4.4** Build project routes: `GET /api/projects` (list for user), `POST /api/projects/sync` (upsert by projectId), `DELETE /api/projects/:id`.
- [ ] **4.5** Build client-side auth: login/register modal, JWT stored in `localStorage`, `useAuthStore` (Zustand) with `user`, `token`, `login`, `logout`.
- [ ] **4.6** Build **offline sync queue** in Dexie.js: a `syncQueue` table. On any save while offline, push `{ projectId, jsonBlob, timestamp }` to queue. On reconnect, flush queue to server.
- [ ] **4.7** Build the **online/offline indicator** in top bar: listens to `navigator.onLine` + `window` online/offline events. Shows green dot (online) or amber dot (offline + "changes saved locally").
- [ ] **4.8** For logged-in users: on app load, merge server projects + local IndexedDB projects. Last-write-wins by `updatedAt` timestamp.

**Phase 4 checkpoint:** Agent must write Phase 4 summary to PROGRESS.md before moving to Phase 5.

---

### Phase 5 — Polish & v1 Release (Weeks 14–16)
**Goal:** Offline mode, service worker, cross-browser QA, deploy.

- [ ] **5.1** Add Workbox service worker to CRA: cache app shell (HTML, JS, CSS, font assets). Use `InjectManifest` strategy.
- [ ] **5.2** Add a "New update available — reload?" banner when a new service worker is waiting.
- [ ] **5.3** Full error state audit: every async operation (save, sync, export) must have a visible error state and a retry action.
- [ ] **5.4** Full loading state audit: skeleton loaders on dashboard, spinner on export, disabled buttons during async ops.
- [ ] **5.5** Cross-browser QA: test on Chrome, Firefox, Edge. Document any issues in PROGRESS.md.
- [ ] **5.6** Keyboard shortcut audit: Ctrl+Z, Ctrl+Shift+Z, Ctrl+D, Delete, Ctrl+S (save/sync), Ctrl+E (export). All must work without focus issues.
- [ ] **5.7** Empty states: empty canvas ("Drag a component here to get started"), empty dashboard ("No projects yet — create one"), empty search results in component panel.
- [ ] **5.8** Deploy client to Vercel. Deploy server to Railway or Render. Set environment variables. Test full flow on production.
- [ ] **5.9** Final QA: a complete user journey from "new project → add 5 components → edit props → export → npm install → npm start" on a clean machine. Document in PROGRESS.md.

**Phase 5 checkpoint:** Write v1 release summary to PROGRESS.md. Tag git commit as `v1.0.0`.

---

## 9. Environment Variables

### Client (`client/.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Server (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codraw
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

---

## 10. Key Dependencies Reference

| Package | Used For | Location |
|---|---|---|
| `zustand` | Canvas state management | client |
| `@dnd-kit/core` | Drag and drop primitives | client |
| `@dnd-kit/sortable` | Component reordering on canvas | client |
| `dexie` | IndexedDB wrapper for offline persistence | client |
| `jszip` | Generate ZIP file client-side | client |
| `file-saver` | Trigger ZIP download in browser | client |
| `uuid` | Generate component and project IDs | client |
| `tailwindcss` | Styling the builder UI itself | client |
| `express` | HTTP server | server |
| `mongoose` | MongoDB ORM | server |
| `jsonwebtoken` | JWT auth | server |
| `bcryptjs` | Password hashing | server |
| `workbox-webpack-plugin` | Service worker / offline | client |

---

## 11. Things That Are Explicitly Out of Scope for v1

Do not implement these. If the human asks, acknowledge and add to a backlog comment in PROGRESS.md.

- AI-generated components or AI-assisted layout
- Responsive / mobile preview mode (v2)
- Vue, Angular, Svelte, Next.js export (v2)
- Real-time collaboration / multiplayer
- Deployment integration (Vercel/Netlify one-click from CoDraw)
- Monetization / paid tiers
- Custom component import by user
- Vite as export target (CRA only in v1)
- TypeScript for the builder UI itself (the builder is written in JS; only exports can be TS)

---

## 12. Decisions That Still Need Human Input

Mark these `[RESOLVED: ...]` in PROGRESS.md when decided.

- [ ] **D1** App domain / URL for production
- [ ] **D2** Monetization model (free / freemium / open source)
- [ ] **D3** OAuth provider for social login (Google? GitHub?)
- [ ] **D4** Whether to open-source the repo
- [ ] **D5** Canvas component count cap (suggested: 50 per page in v1)

---

## 13. How to Resume After a Break

When starting a new session on this project:

1. Read `AGENTS.md` (this file) fully.
2. Read `PROGRESS.md` — find the last completed checkpoint.
3. Find the next unchecked `[ ]` task in the phase currently in progress.
4. Ask the human: "I'm resuming at task X.Y — [task description]. Shall I proceed?"
5. Proceed on confirmation.

---

*AGENTS.md — CoDraw v1 — Last updated July 2026*
*Do not modify this file unless explicitly instructed by the human.*

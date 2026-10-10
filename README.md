# CoDraw

> 🌐 **Live Application:** [https://codraw-live.vercel.app/](https://codraw-live.vercel.app/)
> 🔌 **Live Backend API:** [https://codraw-api.onrender.com](https://codraw-api.onrender.com)

CoDraw is a powerful browser-based visual website builder designed to streamline web development. It allows you to drag-and-drop UI components onto a high-performance canvas, visually edit their properties and styles in real-time, and instantly export a clean, production-ready React codebase (supporting JS/TS, Tailwind, CSS Modules, or Bootstrap).

## ✨ Key Features
- **Drag-and-Drop Canvas:** An intuitive, infinite-panning workspace with smart grid overlays and split-view component isolation.
- **Deep Customization Engine:** Edit everything from typography and spacing to advanced CSS positioning and nested `innerStyles`.
- **Multi-Page Application (MPA) Support:** Link interactive elements together natively.
- **Instant Code Export:** One-click export bundles your design into a complete, ready-to-deploy React project archive.
- **Offline & Cloud Sync:** Fast local persistence via IndexedDB and Workbox Service Workers, backed by seamless MongoDB cloud synchronization.

## 📂 Repository Structure

- `client/` - The React CRA builder interface (Frontend)
- `server/` - The Node.js + Express backend API (Backend)
- `markdown/` - Comprehensive project documentation and guides

## 🚀 Getting Started

CoDraw uses **[Bun](https://bun.sh/)** as its primary package manager and runtime to guarantee maximum performance.

1. **Install Dependencies:**
   Install dependencies for both client and server workspaces:
   ```bash
   bun install
   ```

2. **Database Setup:**
   Ensure your `.env` file in the `server/` directory is configured with your `MONGODB_URI`.
   To prepopulate the database with test users and projects, run:
   ```bash
   cd server
   node seed.js
   ```

3. **Launch the Studio:**
   You can start both the client and server concurrently using the provided start script:
   ```bash
   ./start.sh
   # or on Windows: start.bat
   ```
   The Client will start on `http://localhost:3000` and the API on `http://localhost:5000`.

## 📚 Documentation & References

We maintain detailed documentation inside the `markdown/` directory to keep the project root clean:

- 📖 **[Demo Users & Credentials](./markdown/USERS_DEMO.md)**: Need to log in and test? Check this file for a table of all pre-seeded accounts and their specific project stacks.
- 📈 **[Project Progress & Roadmap](./markdown/PROGRESS.md)**: A complete historical log of our development phases, completed tasks, and upcoming v2 backlog.
- 🤖 **[Agent Guidelines](./markdown/AGENTS.md)**: Strict architectural rules, component templating syntax, and state management guidelines for AI development agents.

---
*Built with React, Express, MongoDB, and Bun.*

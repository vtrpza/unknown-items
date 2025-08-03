# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UNKNOWN ITEMS is a social media platform for sharing mysteries, unknown facts, and unexplained phenomena. Built with Next.js 15, TypeScript, and shadcn/ui components, it follows a modern React architecture with App Router.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Architecture

### Tech Stack
- **Next.js 15.4.5** with App Router and Turbopack
- **TypeScript** with strict mode enabled
- **shadcn/ui** components with New York style
- **Tailwind CSS** with CSS variables
- **Lucide React** for icons

### Directory Structure
```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── globals.css   # Global styles and Tailwind imports
│   ├── layout.tsx    # Root layout with fonts
│   └── page.tsx      # Home page
├── components/       # React components
│   └── ui/           # shadcn/ui components (auto-generated)
├── lib/              # Utility functions
│   └── utils.ts      # cn() utility for className merging
└── hooks/            # Custom React hooks (planned)
```

### Component System
- **shadcn/ui Integration**: Components configured in `components.json` with New York style
- **Path Aliases**: `@/*` maps to `src/*` for clean imports
- **Styling**: Tailwind CSS with `cn()` utility for conditional classes
- **Fonts**: Geist Sans and Geist Mono loaded via next/font/google

### Architecture Principles
Following the comprehensive system architecture documented in `docs/ARCHITECTURE.md`:

1. **Database Design**: Prisma ORM with PostgreSQL (schema planned)
2. **Authentication**: NextAuth.js for user management (not yet implemented)
3. **Real-time Features**: WebSocket integration planned for live interactions
4. **Content Management**: Post creation with categories and mystery status tracking
5. **Social Features**: Follow/unfollow, likes, comments, bookmarks system

### Development Phases
The project follows a 15-week implementation roadmap (see `docs/IMPLEMENTATION-ROADMAP.md`):
- **Phase 1** (Weeks 1-3): Foundation and authentication
- **Phase 2** (Weeks 4-6): Content management and posts
- **Phase 3** (Weeks 7-9): Social features and search
- **Phase 4** (Weeks 10-12): Advanced features and mobile
- **Phase 5** (Weeks 13-15): Quality assurance and deployment

### Key Files to Reference
- `docs/ARCHITECTURE.md` - Complete system design and database schema
- `docs/UI-UX-DESIGN.md` - Design system and component specifications
- `docs/IMPLEMENTATION-ROADMAP.md` - Development phases and milestones
- `components.json` - shadcn/ui configuration

### Mystery Categories
The platform will support 9 mystery categories:
- Unknown Facts, Internet Mysteries, Unidentified Objects
- Unexplained Events, Historical Mysteries, Scientific Anomalies
- Cryptids, Conspiracies, Other

### Current Status
- Basic Next.js setup complete with TypeScript and shadcn/ui
- Architecture and design documentation complete
- Ready for Phase 1 implementation (database setup and authentication)

When implementing features, refer to the detailed specifications in the `docs/` folder and follow the component patterns established by shadcn/ui.
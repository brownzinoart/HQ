# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Database Management
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev --name description-of-change

# Reset database (development only)
npx prisma migrate reset

# Seed database with demo data
node scripts/setup-db.js

# View database in Prisma Studio
npx prisma studio
```

### Development Workflow
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Start production server
npm start
```

### Environment Setup
```bash
# Copy example environment file
cp .env.example .env.local
# Then edit .env.local with your database URL and secrets
```

## Architecture Overview

### Core Concept
FollowBoard is a dual-role activity tracking platform where **Contributors** (like Wally) update their daily activities for **Viewers** (founders) to stay informed without weekly meetings. The platform eliminates sync meeting overhead through structured activity feeds.

### Role-Based Architecture
- **CONTRIBUTOR Role**: Can create/edit activities, contacts, projects, and resources
- **VIEWER Role**: Read-only access to all data, can comment on activities for feedback
- Authentication handles automatic role assignment and route protection

### Database Schema Design
The system revolves around **Activities** as the central entity, with relationships to:
- **Users**: Role-based (CONTRIBUTOR/VIEWER) with NextAuth integration  
- **Contacts**: Lead management with status tracking (COLD/WARM/HOT)
- **Projects**: Progress tracking with percentage completion
- **Resources**: Document/link library for team assets
- **Comments**: Founder feedback system on activities

Key design decisions:
- All user-created content is soft-deleted via Cascade relationships
- Activities support metadata JSON for type-specific data (call duration, email subjects)
- Enum-based status tracking for consistency
- Database indexes on frequently queried fields (userId, createdAt, leadStatus)

### Authentication System
- NextAuth.js with Prisma adapter
- Supports multiple providers: Credentials (demo), Google, GitHub
- Demo accounts auto-created: `wally@followboard.com` (CONTRIBUTOR), `founder@followboard.com` (VIEWER)
- JWT strategy with role information in session
- Custom signin page with Hedgehox branding

### API Design Pattern
REST endpoints follow consistent patterns:
- All routes require authentication via NextAuth session
- Standard error handling with 401/500 responses
- Consistent data shape with included relations (user, contact, project)
- Prisma queries with security-first approach (no raw user data exposure)

### UI/UX Architecture
- **Modern Gen Z Design**: Glassmorphism effects, smooth animations, minimal aesthetic
- **Component Structure**: Feature-based organization with reusable UI components
- **Design System**: Custom Tailwind configuration with Hedgehox brand colors (#253A4B primary, #507DA0 secondary)
- **Responsive Layout**: Mobile-first approach with breakpoint-based grids
- **State Management**: React hooks for local state, NextAuth for auth state

## Important Implementation Details

### Styling System
- Uses Tailwind CSS v3 with custom glassmorphism classes
- Global CSS implements modern gradient backgrounds and micro-interactions
- Component classes: `.card`, `.metric-card`, `.hover-lift`, `.glass`
- Custom scrollbar styling with `.scroll-area` utility
- Responsive grid with `.grid-auto-fit` for dynamic layouts

### Data Fetching Patterns
- API routes use server-side authentication checking
- Client components fetch via standard fetch() with error handling
- Optimistic loading states with skeleton animations
- Consistent error boundaries and fallback UI

### Development Database
- Uses SQLite for local development (file:./dev.db)
- Production should use PostgreSQL (update DATABASE_URL)
- Migration files in `prisma/migrations/`
- Demo data script creates realistic sample content

### Navigation & Routing
- App Router (Next.js 14+) with TypeScript
- Dashboard layout with protected routes under `/dashboard`
- Navigation configuration in `lib/constants.ts` (NAV_ITEMS)
- Current pages: Home, Contacts, Projects, Resources

### Environment Variables
Required for development:
- `DATABASE_URL`: Prisma database connection
- `NEXTAUTH_SECRET`: JWT signing secret
- `NEXTAUTH_URL`: Application base URL (http://localhost:3000)

Optional for OAuth:
- `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_ID/SECRET`

## Development Notes

### When Adding New Features
1. Update Prisma schema if database changes needed
2. Generate migration: `npx prisma migrate dev`
3. Update TypeScript interfaces to match schema
4. Add API routes following existing auth patterns
5. Update navigation in `lib/constants.ts` if new pages
6. Follow glassmorphism design patterns for UI consistency

### Demo Data Access
- Contributor: `wally@followboard.com` (any password)
- Viewer: `founder@followboard.com` (any password)  
- Reset demo data: `node scripts/setup-db.js`

### Current Sprint Status
- ✅ Sprint 1: Foundation, auth, UI, role-based access
- 🎯 Next: Activity feed functionality, contact management, real-time updates

### Design System Conventions
- Use `metric-card` for dashboard stats
- Use `card` for content containers  
- Use `hover-lift` for interactive elements
- Follow Hedgehox brand colors (primary/secondary variables)
- Implement loading states with custom animations
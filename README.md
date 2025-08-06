# FollowBoard

A modern activity tracking platform that allows contributors to keep their founders updated on daily activities without requiring weekly sync meetings.

## Features

- **Dual-Role System**: Contributor (Wally) and Viewer (Founder) roles
- **Activity Feed**: Social media-style feed for real-time updates
- **Contact Management**: Track leads with cold/warm/hot status
- **Project Tracking**: Monitor project progress and completion dates
- **Resource Library**: Store and organize important documents and links
- **Authentication**: Secure login with NextAuth.js
- **Modern UI**: Clean, minimalist design with Hedgehox branding

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: Custom design system with Hedgehox branding

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use a service like Supabase/Neon)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database URL and other settings.

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. (Optional) Seed with demo data:
   ```bash
   node scripts/setup-db.js
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

The application includes two demo accounts for testing:

- **Contributor**: `wally@followboard.com` (password: demo)
- **Viewer/Founder**: `founder@followboard.com` (password: demo)

## Project Structure

```
followboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── features/          # Feature-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication configuration
│   ├── prisma/            # Database client
│   └── utils/             # Utility functions
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Database Schema

The application uses the following main entities:

- **User**: Contributors and viewers with role-based access
- **Activity**: Feed items with different types (email, call, LinkedIn, etc.)
- **Contact**: Lead management with status tracking
- **Project**: Project progress and completion tracking
- **Resource**: Document and link management
- **Comment**: Founder feedback on activities

## Development Roadmap

### Sprint 1 ✅ (Current)
- [x] Project setup and authentication
- [x] Database schema design
- [x] Basic UI and navigation
- [x] Role-based access control

### Sprint 2 (Next)
- [ ] Activity feed functionality
- [ ] Contact management
- [ ] Real-time updates

### Sprint 3
- [ ] Project tracking
- [ ] Resource management
- [ ] Enhanced UI/UX

### Sprint 4
- [ ] Comments and feedback system
- [ ] Search and filtering
- [ ] Performance optimization

### Sprint 5
- [ ] AI-powered summaries
- [ ] Voice integration
- [ ] Smart insights

## Deploy on Vercel

The application is designed to be deployed on Vercel with minimal configuration:

1. Connect your repository to Vercel
2. Set up environment variables in the Vercel dashboard
3. Deploy!

## License

Private - All rights reserved by Hedgehox.

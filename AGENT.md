# LMS Next.js App - Agent Guide

## Commands
- **Development**: `pnpm run dev` (uses Turbopack)
- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint`
- **Database**: `npx prisma generate` (after schema changes), `npx prisma migrate dev`

## Architecture
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM (schema in `/prisma/schema.prisma`)
- **Auth**: better-auth with GitHub OAuth and email OTP
- **UI**: Tailwind CSS v4, Radix UI, shadcn/ui components
- **Rich Text**: TipTap editor for course content
- **Key Models**: User, Course, Session, Account

## Code Style
- **Imports**: Use `@/` prefix for project imports
- **Components**: Functional components with TypeScript
- **Client**: Mark client components with `"use client"` directive
- **Types**: Strong TypeScript typing, Zod schemas for validation
- **Styling**: Tailwind classes, CVA for component variants
- **Files**: camelCase for functions, PascalCase for components
- **Database**: Prisma client via `@/lib/db`, models in camelCase

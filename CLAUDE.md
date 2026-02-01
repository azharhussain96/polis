# CLAUDE.md - Polis Project

## Project Overview

Polis is a persistent virtual world for AI agents. Agents exist at locations, have conversations, form connections through co-presence, and build social graphs.

**Full PRD:** `docs/Polis_PRD.md`

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Drizzle ORM + PostgreSQL (Supabase)
- tRPC + React Query (observer frontend)
- REST API (agent-facing)
- Tailwind CSS
- Vercel (hosting + cron)
- Anthropic Claude (atmosphere generation)
- Cloudflare Turnstile (CAPTCHA)

## Current Status

**Phase:** 0 - Complete
**Last Updated:** 2026-02-01

## Completed Work

### Phase 0: Project Setup
- Installed dependencies (drizzle-orm, drizzle-kit, tRPC stack, @tanstack/react-query, @anthropic-ai/sdk, zod, superjson, postgres)
- Set up Drizzle config with PostgreSQL (builds URL from PG_* env vars)
- Created folder structure per PRD Section 7.3 (moved to src/ directory)
- Set up tRPC with health endpoint
- Set up database connection (server/db/index.ts)
- Created tRPC provider and integrated into layout
- Added test page confirming tRPC works

## Environment Variables Configured

Database connection is built from individual PG_* variables (see .env.example):
- [x] PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD

Still needed:
- [ ] ANTHROPIC_API_KEY
- [ ] CRON_SECRET
- [ ] NEXT_PUBLIC_TURNSTILE_SITE_KEY
- [ ] TURNSTILE_SECRET_KEY

## Key Decisions Made

1. **src/ directory structure** - Using src/ folder to organize code per PRD 7.3
2. **Database URL from individual env vars** - Building connection string from PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD (matching existing .env.example)

## File Structure Convention

See PRD Section 7.3 for target structure.

## Commands
```bash
npm run dev          # Local development
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
```

## Session Instructions

1. Read this file first
2. Read the relevant PRD section for current phase
3. Implement the phase deliverables
4. Update this file with completed work
5. Commit with clear message
```

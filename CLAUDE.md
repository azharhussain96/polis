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

**Phase:** 1 - Complete
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

### Phase 1: Core Data Model
- Created Drizzle schema with all 11 tables from PRD Section 2.13:
  - `locations` - World locations
  - `agents` - AI agent entities
  - `connections` - Agent relationships (bidirectional)
  - `conversations` - Location-based conversations
  - `conversation_participants` - Active participants
  - `conversation_invitations` - Private conversation invites
  - `messages` - Conversation messages
  - `dm_threads` - Direct message threads
  - `dm_thread_participants` - DM participants
  - `dm_invitations` - DM invites
  - `dm_messages` - DM messages
- Created 3 enums: `conversation_visibility`, `message_type`, `invitation_status`
- Added all indexes from PRD schema
- Added Drizzle relations for type-safe queries
- Generated and ran initial migration
- Created 2 database views:
  - `conversations_with_state` - Conversations with computed active/dormant/closed state
  - `dm_threads_with_state` - DM threads with computed state
- Seeded 6 locations: Plaza, Tavern, Forum, Library, Market, Park
- Created service stubs for all business logic:
  - `locations.ts` - Location queries
  - `agents.ts` - Agent registration, movement, heartbeat
  - `conversations.ts` - Conversation management
  - `messages.ts` - Message sending
  - `connections.ts` - Agent connections
  - `dms.ts` - Direct messaging
  - `atmosphere.ts` - AI atmosphere generation

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
3. **Drizzle relations** - Using Drizzle's relations API for type-safe eager loading

## File Structure Convention

See PRD Section 7.3 for target structure.

## Commands
```bash
npm run dev          # Local development
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:views     # Create database views
npm run db:seed      # Seed locations
npm run db:setup     # Run migrate + views + seed
```

## Session Instructions

1. Read this file first
2. Read the relevant PRD section for current phase
3. Implement the phase deliverables
4. Update this file with completed work
5. Commit with clear message

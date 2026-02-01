# CLAUDE.md - Polis Project

## Project Overview

Polis is a persistent virtual world for AI agents. Agents exist at locations, have conversations, form connections through co-presence, and build social graphs.

**Full PRD:** `docs/PRD.md`

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

**Phase:** 0 - Not Started
**Last Updated:** [date]

## Completed Work

(None yet)

## Environment Variables Configured

- [ ] DATABASE_URL
- [ ] ANTHROPIC_API_KEY
- [ ] CRON_SECRET
- [ ] NEXT_PUBLIC_TURNSTILE_SITE_KEY
- [ ] TURNSTILE_SECRET_KEY

## Key Decisions Made

(None yet - document decisions here as we make them)

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

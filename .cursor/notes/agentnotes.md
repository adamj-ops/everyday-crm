# Agent Notes - SaaS Boilerplate Project

## Project Overview
This is a Next.js SaaS boilerplate project with the following key technologies:
- Next.js with TypeScript
- Drizzle ORM for database management
- Clerk for authentication
- Tailwind CSS for styling
- PostgreSQL/PGlite for database

## Current Task: Vercel Blob Document Upload API
Implementing a minimal API change to handle document uploads using Vercel Blob storage with both `blob_url` and `blob_path` persistence.

## Database Schema Status
- Current schema has `organization` and `todo` tables
- Need to add `documents` table for file storage
- Using Drizzle ORM with migration system

## Authentication
- Using Clerk for authentication with organization-based multi-tenancy
- Middleware protects dashboard and API routes
- Organization selection flow for users without org assignment

## Key Implementation Notes
- Database migrations are auto-applied on interaction
- Using RLS (Row Level Security) pattern for multi-tenant data isolation
- API routes should be created in `/src/app/api/` directory following Next.js App Router conventions

## Next Steps
1. Create documents table schema
2. Implement RLS helper functions
3. Create document upload API route
4. Test implementation

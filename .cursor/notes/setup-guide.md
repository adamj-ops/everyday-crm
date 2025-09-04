# CRM Setup Guide

## Prerequisites
✅ Neon database with the required schema
✅ Database credentials in `.env.local`

## Quick Start

### 1. Environment Setup
Copy `env-example.txt` to `.env.local` and fill in your values:

```bash
cp env-example.txt .env.local
```

Required variables:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `DEV_USER_ID` - Development user UUID (default: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
- `DEV_ORG_ID` - Development org UUID (default: 11111111-1111-1111-1111-111111111111)

### 2. Database Seeding
Run this SQL in your Neon console to create test data:

```sql
-- org + user + membership
insert into orgs (id, name) values
('11111111-1111-1111-1111-111111111111','Everyday') on conflict do nothing;

insert into users (id, email, full_name) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aj@example.com','AJ') on conflict do nothing;

insert into team_members (org_id, user_id, role) values
('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','owner')
on conflict do nothing;

-- a property
with p as (
  insert into properties (org_id, street_1, city, state, postal_code, type)
  values ('11111111-1111-1111-1111-111111111111','123 Main St','Austin','TX','78704','single_family')
  returning id
)
-- a deal tied to that property
insert into deals (org_id, property_id, stage)
select '11111111-1111-1111-1111-111111111111', id, 'new' from p
returning id;
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the Implementation

#### Web Interface
- Visit http://localhost:3000/deals
- You should see your seeded deal in the "New" column
- Click stage buttons to move deals between stages

#### API Testing
```bash
# List all deals
curl -s http://localhost:3000/api/deals/list | jq

# Filter by stage
curl -s "http://localhost:3000/api/deals/list?stage=new" | jq

# Update deal stage
curl -s -X POST http://localhost:3000/api/deals/update-stage \
  -H "content-type: application/json" \
  -d '{"dealId":"<DEAL_ID>", "newStage":"under_contract"}' | jq
```

#### Database Testing
```bash
# Test database connection and schema
npx tsx scripts/test-deals-api.ts
```

## Troubleshooting

### Common Issues

**❌ "DATABASE_URL not found"**
- Ensure `.env.local` exists with your Neon database URL

**❌ "403/empty results"**
- Your `DEV_USER_ID`/`DEV_ORG_ID` must match rows in `team_members` table
- Re-run the seed SQL above

**❌ "current transaction is aborted"**
- This shouldn't happen with the new implementation
- Check for nested transactions in your code

**❌ "Deal not found"**
- Ensure the deal exists and belongs to your organization
- Check the deal ID in your database

### File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── deals/
│   │   │   ├── list/route.ts
│   │   │   └── update-stage/route.ts
│   │   ├── offers/
│   │   │   └── accept/route.ts
│   │   └── documents/
│   │       └── upload/route.ts
│   └── deals/
│       └── page.tsx
├── server/
│   └── db.ts (PostgreSQL pool & RLS)
└── components/ui/ (existing Shadcn components)
```

## Features Available

### ✅ Deals Management
- List all deals with property information
- Filter deals by stage
- Update deal stages with one click
- Pipeline visualization

### ✅ Offers Management
- Accept offers
- Automatic assignment creation
- Multi-tenant security

### ✅ Document Upload
- Vercel Blob integration
- Both blob_url and blob_path persistence
- Deal association

### ✅ Security
- Row Level Security (RLS) implementation
- Multi-tenant isolation
- Transaction safety

## Next Steps
- Replace `devUserId`/`devOrgId` with real Clerk authentication
- Add more deal management features
- Implement offer creation UI
- Add document management interface

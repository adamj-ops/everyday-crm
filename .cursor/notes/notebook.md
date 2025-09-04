# Project Notebook - SaaS Boilerplate

## Vercel Blob Document Upload Implementation

### Key Implementation Details

#### Database Schema
- Added `documentsSchema` table with the following fields:
  - `id`: Serial primary key
  - `orgId`: Text field for multi-tenant isolation
  - `type`: Document type (e.g., 'disclosure', 'contract')
  - `title`: Document title (using filename)
  - `blobUrl`: Direct URL from Vercel Blob for downloads/previews
  - `blobPath`: Logical path for grouping (e.g., `deals/123/uuid-filename.pdf`)
  - `mimeType`: File MIME type
  - `fileSize`: File size in bytes
  - `dealId`: Optional association with deals
  - Standard timestamp fields (`createdAt`, `updatedAt`)

#### RLS Implementation
- Created `/src/server/db.ts` with `withRls` helper function
- Currently uses application-layer filtering with dev constants
- Ready for production RLS with PostgreSQL session variables

#### API Route
- Created `/src/app/api/documents/upload/route.ts`
- Accepts `file` and `dealId` via FormData
- Stores file in Vercel Blob with authenticated access
- Persists both `blob_url` and `blob_path` in database
- Returns complete document record

#### File Organization
- Blob path structure: `deals/{dealId}/{uuid}-{filename}`
- Provides logical grouping for deal-related documents
- UUID prefix prevents filename conflicts

### Testing Setup
- Created unit tests in `/tests/api/documents-upload.test.ts`
- Created manual test script `/tests/test-upload.sh`
- Tests cover success cases and error handling

### Next Steps for Production
1. Replace dev constants with real Clerk authentication
2. Implement proper RLS policies in PostgreSQL
3. Add file type validation and size limits
4. Implement document listing/retrieval endpoints
5. Add proper error logging and monitoring

### Important Notes
- Vercel Blob package installed: `@vercel/blob`
- Database migration generated and ready to apply
- All files follow existing project patterns and linting rules

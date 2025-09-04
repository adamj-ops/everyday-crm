import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { POST } from '@/app/api/documents/upload/route';

// Mock Vercel Blob
vi.mock('@vercel/blob', () => ({
  put: vi.fn().mockResolvedValue({
    url: 'https://example.vercel-storage.com/test-file.pdf',
  }),
}));

describe('/api/documents/upload', () => {
  it('should upload a file and return document record', async () => {
    // Create a mock file
    const file = new File(['test content'], 'test-document.pdf', {
      type: 'application/pdf',
    });

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dealId', 'deal-123');

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    // Call the API
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('blobUrl');
    expect(data).toHaveProperty('blobPath');
    expect(data.orgId).toBe('dev-org-456');
    expect(data.title).toBe('test-document.pdf');
    expect(data.type).toBe('disclosure');
    expect(data.dealId).toBe('deal-123');
    expect(data.blobPath).toMatch(/^deals\/deal-123\/.+-test-document\.pdf$/);
  });

  it('should return 400 when file is missing', async () => {
    const formData = new FormData();
    formData.append('dealId', 'deal-123');

    const request = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing file or dealId');
  });

  it('should return 400 when dealId is missing', async () => {
    const file = new File(['test content'], 'test-document.pdf', {
      type: 'application/pdf',
    });

    const formData = new FormData();
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing file or dealId');
  });
});

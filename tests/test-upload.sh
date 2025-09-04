#!/bin/bash

# Test script for document upload API
# Usage: ./test-upload.sh

echo "Testing document upload API..."

# Create a test file
echo "This is a test document for upload testing." > test-document.txt

# Test the upload endpoint
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@test-document.txt" \
  -F "dealId=test-deal-123" \
  -H "Accept: application/json" \
  -v

echo ""
echo "Test completed. Check the response above."

# Clean up
rm test-document.txt

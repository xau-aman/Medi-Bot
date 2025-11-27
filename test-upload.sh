#!/bin/bash

echo "🧪 Testing Upload Endpoint"
echo ""

# Check if backend is running
if ! curl -s http://localhost:5001/test > /dev/null; then
    echo "❌ Backend not running. Start with: python3 app.py"
    exit 1
fi

echo "✅ Backend is running"

# Test upload endpoint with a simple file
echo "🔍 Testing upload endpoint..."

# Create a test image file
echo "Creating test image..."
echo "test image data" > test_image.txt

# Test upload
curl -X POST \
  -F "file=@test_image.txt" \
  http://localhost:5001/upload \
  -v

# Cleanup
rm -f test_image.txt

echo ""
echo "✅ Upload test completed"
#!/bin/bash

echo "📦 Creating Render deployment package..."

# Create deployment folder
mkdir -p render-deploy

# Copy essential files for Render
cp app.py render-deploy/
cp requirements.txt render-deploy/
cp Procfile render-deploy/
cp render.yaml render-deploy/

# Create zip for upload
cd render-deploy
zip -r ../render-deployment.zip .
cd ..

# Cleanup
rm -rf render-deploy

echo "✅ Created render-deployment.zip"
echo "📤 Upload this file to Render.com"
echo ""
echo "🎯 Next steps:"
echo "   1. Go to render.com"
echo "   2. Create Web Service"
echo "   3. Upload render-deployment.zip"
echo "   4. Get your URL"
echo "   5. Run: ./update-apk-url.sh YOUR_URL"
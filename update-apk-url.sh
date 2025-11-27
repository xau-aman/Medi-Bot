#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Please provide your Render URL"
    echo "Usage: ./update-apk-url.sh https://your-app.onrender.com"
    exit 1
fi

RENDER_URL=$1
echo "🔧 Updating mobile app with Render URL: $RENDER_URL"

# Update mobile app API service
sed -i '' "s|const HOSTED_API_URL = '.*';|const HOSTED_API_URL = '$RENDER_URL';|" mobile-app/src/services/ApiService.js

echo "✅ Mobile app updated!"
echo ""
echo "📱 Building APK with hosted backend..."
cd mobile-app

# Build APK
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install eas-cli
fi

if ! npx eas whoami &> /dev/null; then
    echo "🔑 Please login to Expo:"
    npx eas login
fi

echo "🏗️ Starting APK build..."
npx eas build --platform android --profile preview

echo ""
echo "✅ APK build started with backend: $RENDER_URL"
echo "📥 Download link will be provided when ready"
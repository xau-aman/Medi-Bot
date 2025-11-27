#!/bin/bash

echo "🚀 Deploy Backend & Build APK"
echo ""

echo "📋 Deployment Checklist:"
echo "   1. Create GitHub repo with your code"
echo "   2. Deploy to Render.com (free)"
echo "   3. Get your Render URL"
echo "   4. Update mobile app URL below"
echo "   5. Build APK"
echo ""

# Get current backend URL from mobile app
CURRENT_URL=$(grep "const API_BASE_URL" mobile-app/src/services/ApiService.js | cut -d"'" -f2)
echo "📱 Current mobile backend URL: $CURRENT_URL"
echo ""

echo "🔧 To update mobile app URL:"
echo "   Edit mobile-app/src/services/ApiService.js"
echo "   Change HOSTED_API_URL to your Render URL"
echo ""

read -p "Press Enter when you've deployed to Render and updated the URL..."

echo ""
echo "🏗️ Building APK with hosted backend..."
cd mobile-app

# Check if EAS is available
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install eas-cli
fi

# Check if logged in
if ! npx eas whoami &> /dev/null; then
    echo "🔑 Please login to Expo:"
    npx eas login
fi

echo "📱 Starting APK build..."
npx eas build --platform android --profile preview

echo ""
echo "✅ APK build started!"
echo "📥 Download link will be provided when ready"
echo ""
echo "🎯 Your APK will connect to the hosted backend"
echo "🌐 No localhost connection issues!"
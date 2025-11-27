#!/bin/bash

echo "🏗️ Building MediBot AI APK with Ngrok Backend..."
echo ""

# Check if backend is running
echo "🔍 Checking if Flask backend is running..."
if ! curl -s http://localhost:5001/test > /dev/null; then
    echo "❌ Backend not running!"
    echo "   Please start with: python app.py"
    echo ""
    exit 1
fi
echo "✅ Backend is running"

# Check if ngrok is running and get URL
echo "🔍 Checking ngrok tunnel..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    for tunnel in tunnels:
        if tunnel.get('proto') == 'https':
            print(tunnel['public_url'])
            break
except:
    pass
" 2>/dev/null)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Ngrok tunnel not found!"
    echo "   Please start with: ngrok http 5001"
    echo ""
    exit 1
fi

echo "✅ Ngrok tunnel active: $NGROK_URL"
echo ""

# Update mobile app with ngrok URL
echo "🔧 Updating mobile app configuration..."
cd mobile-app

if [ ! -f "src/services/ApiService.js" ]; then
    echo "❌ Mobile app files not found!"
    echo "   Make sure you're in the visionbot directory"
    exit 1
fi

# Update API URL in mobile app
sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = '$NGROK_URL';|" src/services/ApiService.js
echo "✅ Mobile app configured with backend URL"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if logged in to Expo
echo "🔐 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "🔑 Please login to Expo (create free account if needed):"
    eas login
fi

echo ""
echo "🚀 Starting APK build process..."
echo "   This will take 5-10 minutes..."
echo "   You'll get a download link when ready"
echo ""

# Build APK
eas build --platform android --profile preview

echo ""
echo "✅ APK build process completed!"
echo ""
echo "📱 Next steps:"
echo "   1. Download APK from the link above"
echo "   2. Transfer to your Android phone"
echo "   3. Install APK (enable 'Unknown sources' if needed)"
echo "   4. Open MediBot AI app"
echo ""
echo "🔄 IMPORTANT: Keep these running for the app to work:"
echo "   Terminal 1: python app.py"
echo "   Terminal 2: ngrok http 5001 (same URL: $NGROK_URL)"
echo ""
echo "⚠️  If ngrok URL changes, you'll need to rebuild the APK"
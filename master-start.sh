#!/bin/bash

echo "🚀 MediBot AI - Master Startup Script"
echo "   Starting: Backend + Web + Ngrok + APK Build"
echo ""

# Get MacBook IP
MACBOOK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📱 MacBook IP: $MACBOOK_IP"

# Update mobile app with MacBook IP
echo "🔧 Configuring mobile app..."
sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = 'http://$MACBOOK_IP:5001'; // Backend API port|" mobile-app/src/services/ApiService.js
echo "✅ Mobile app configured for: http://$MACBOOK_IP:5001"

echo ""
echo "🏥 Starting Flask backend (port 5001)..."
python3 app.py &
BACKEND_PID=$!

# Wait for backend
sleep 5

# Check backend
if ! curl -s http://localhost:5001/test > /dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi
echo "✅ Backend running on port 5001"

echo ""
echo "⚛️ Starting React frontend (port 3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🌐 Starting ngrok tunnel..."
ngrok http 5001 &
NGROK_PID=$!

# Wait for ngrok
sleep 8

# Get ngrok URL
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

if [ ! -z "$NGROK_URL" ]; then
    echo "✅ Ngrok tunnel: $NGROK_URL"
else
    echo "⚠️  Ngrok tunnel not available"
fi

echo ""
echo "📱 Building APK..."
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

echo "🏗️ Starting APK build (this takes 5-10 minutes)..."
npx eas build --platform android --profile preview &
BUILD_PID=$!

cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "🌐 Web App: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📱 Mobile connects to: http://$MACBOOK_IP:5001"
echo "🌍 Ngrok tunnel: $NGROK_URL"
echo "📦 APK build in progress..."
echo ""
echo "📋 Make sure your phone is on the same WiFi network!"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    kill $BACKEND_PID $FRONTEND_PID $NGROK_PID $BUILD_PID 2>/dev/null
    echo "✅ All services stopped!"
}

trap cleanup EXIT INT TERM

# Wait for processes
wait
#!/bin/bash

echo "🚀 Starting MediBot AI Development Environment..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok not found. Please install it:"
    echo "   brew install ngrok/ngrok/ngrok"
    echo "   OR download from: https://ngrok.com/download"
    exit 1
fi

# Start backend
echo "🏥 Starting Flask backend..."
python app.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
ngrok http 5001 --log=stdout > ngrok.log &
NGROK_PID=$!

# Wait for ngrok to establish tunnel
echo "⏳ Establishing secure tunnel..."
sleep 8

# Extract ngrok URL
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
")

if [ -z "$NGROK_URL" ]; then
    echo "❌ Could not get ngrok URL. Please check ngrok setup."
    kill $BACKEND_PID $NGROK_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ Backend is running!"
echo "📱 Mobile app can connect to: $NGROK_URL"
echo "🌐 Web app available at: http://localhost:5001"
echo ""

# Update mobile app API URL
if [ -f "mobile-app/src/services/ApiService.js" ]; then
    sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = '$NGROK_URL';|" mobile-app/src/services/ApiService.js
    echo "✅ Mobile app updated with new URL!"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Open new terminal"
    echo "   2. Run: cd mobile-app && npm start"
    echo "   3. Scan QR code with Expo Go app"
    echo ""
else
    echo "⚠️  Mobile app not found. Make sure you're in the right directory."
fi

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down development environment..."
    kill $BACKEND_PID $NGROK_PID 2>/dev/null
    rm -f ngrok.log
    echo "✅ Cleanup complete!"
}

# Set trap for cleanup on exit
trap cleanup EXIT INT TERM

# Keep script running
echo "🔄 Development environment is running..."
echo "   Press Ctrl+C to stop"
echo ""

# Wait for processes
wait
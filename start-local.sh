#!/bin/bash

echo "🚀 Starting MediBot AI with Local MacBook IP"
echo ""

# Get MacBook IP
MACBOOK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "📱 Your MacBook IP: $MACBOOK_IP"
echo ""

# Start backend
echo "🏥 Starting Flask backend..."
python3 app.py &
BACKEND_PID=$!

# Wait for backend
sleep 5

# Check if backend started
if curl -s http://localhost:5001/test > /dev/null; then
    echo "✅ Backend started successfully"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ MediBot AI is running!"
echo ""
echo "🌐 Web App: http://localhost:5001"
echo "📱 Mobile App connects to: http://$MACBOOK_IP:5001"
echo ""
echo "🎯 Next Steps:"
echo "   • Web: Open http://localhost:5001"
echo "   • Mobile: cd mobile-app && npx eas build --platform android --profile preview"
echo ""
echo "📋 Make sure your phone is on the same WiFi network!"
echo ""
echo "Press Ctrl+C to stop"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping backend..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Stopped!"
}

trap cleanup EXIT INT TERM
wait
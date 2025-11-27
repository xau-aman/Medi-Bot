#!/bin/bash

echo "🚀 Quick Start - MediBot AI"
echo ""

# Start backend
echo "1. Starting Flask backend..."
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
echo "✅ Setup Complete!"
echo ""
echo "🌐 Web App: http://localhost:5001"
echo "📱 Mobile App: https://29c27f4f82bd.ngrok-free.app"
echo ""
echo "🎯 Next Steps:"
echo "   • Web: Open http://localhost:5001 in browser"
echo "   • Mobile: cd mobile-app && npx eas build --platform android --profile preview"
echo ""
echo "Press Ctrl+C to stop backend"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping backend..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Stopped!"
}

trap cleanup EXIT INT TERM
wait
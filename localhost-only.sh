#!/bin/bash

echo "🏠 MediBot AI - Localhost Only Setup"
echo ""

# Start backend
echo "🏥 Starting Flask backend (localhost:5001)..."
python3 app.py &
BACKEND_PID=$!

# Wait for backend
sleep 5

# Check backend
if ! curl -s http://localhost:5001/test > /dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi
echo "✅ Backend running on localhost:5001"

echo ""
echo "⚛️ Starting React frontend (localhost:3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ MediBot AI is running!"
echo ""
echo "🌐 Web App: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📱 Mobile app configured for localhost (development only)"
echo ""
echo "📋 For mobile testing:"
echo "   • Use Expo Go app on same computer"
echo "   • Or use iOS Simulator / Android Emulator"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped!"
}

trap cleanup EXIT INT TERM
wait
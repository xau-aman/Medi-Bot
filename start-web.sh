#!/bin/bash

echo "🌐 Starting MediBot AI Web Application..."

# Start backend on port 5001
echo "🏥 Starting Flask backend on port 5001..."
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start React frontend on port 3000
echo "⚛️ Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ MediBot AI is starting!"
echo "🌐 Web app: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both services"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down MediBot AI..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Shutdown complete!"
}

# Set trap for cleanup on exit
trap cleanup EXIT INT TERM

# Wait for processes
wait
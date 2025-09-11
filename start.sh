#!/bin/bash

echo "Starting VisionBot..."

# Kill any existing processes
pkill -f "python.*app.py" || true
pkill -f "npm.*start" || true

# Start Flask backend
echo "Starting Flask backend on port 5001..."
python3 app.py &
FLASK_PID=$!

# Wait for Flask to start
sleep 3

# Start React frontend
echo "Starting React frontend on port 3000..."
cd frontend
npm start &
REACT_PID=$!

echo "Backend PID: $FLASK_PID"
echo "Frontend PID: $REACT_PID"
echo ""
echo "🚀 VisionBot is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
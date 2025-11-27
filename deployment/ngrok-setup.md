# 🚀 NGROK Setup (FASTEST SOLUTION)

This is the quickest way to make your local backend accessible to your mobile app.

## Step 1: Install Ngrok

### Download:
- Go to https://ngrok.com/download
- Download for macOS
- Unzip and move to `/usr/local/bin/`

### Or install with Homebrew:
```bash
brew install ngrok/ngrok/ngrok
```

## Step 2: Setup Account (Free)
```bash
# Sign up at https://ngrok.com and get your auth token
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## Step 3: Start Your Backend
```bash
cd /Users/ninjakumar/Documents/Programming/visionbot
python app.py
```

## Step 4: Start Ngrok (New Terminal)
```bash
ngrok http 5001
```

You'll see:
```
Session Status    online
Account           your-email@gmail.com
Version           3.x.x
Region            United States (us)
Latency           -
Web Interface     http://127.0.0.1:4040
Forwarding        https://abc123.ngrok.io -> http://localhost:5001
```

## Step 5: Update Mobile App

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update:

**mobile-app/src/services/ApiService.js:**
```javascript
const API_BASE_URL = 'https://abc123.ngrok.io'; // Your ngrok URL
```

## Step 6: Test Mobile App
```bash
cd mobile-app
npm start
```

## 🎯 Quick Commands

**Terminal 1 (Backend):**
```bash
python app.py
```

**Terminal 2 (Ngrok):**
```bash
ngrok http 5001
```

**Terminal 3 (Mobile):**
```bash
cd mobile-app && npm start
```

## ✅ Advantages:
- Works immediately
- No code deployment needed
- HTTPS included
- Works from anywhere

## ⚠️ Limitations:
- URL changes when you restart ngrok
- Free tier: 2-hour sessions
- Need to update mobile app URL each time

## 🔄 Auto-Update Script

Create `start-dev.sh`:
```bash
#!/bin/bash
echo "🚀 Starting MediBot AI Development..."

# Start backend
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start ngrok and capture URL
ngrok http 5001 --log=stdout > ngrok.log &
NGROK_PID=$!

# Wait for ngrok to start
sleep 5

# Extract ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io')

echo "📱 Backend URL: $NGROK_URL"

# Update mobile app
sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = '$NGROK_URL';|" mobile-app/src/services/ApiService.js

echo "✅ Mobile app updated!"
echo "🎯 Now run: cd mobile-app && npm start"

# Cleanup on exit
trap "kill $BACKEND_PID $NGROK_PID" EXIT
wait
```

Run with: `chmod +x start-dev.sh && ./start-dev.sh`
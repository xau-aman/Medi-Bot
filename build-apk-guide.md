# 📱 Build APK with Ngrok Backend - Complete Guide

## Step 1: Setup Ngrok Backend

### Install Ngrok:
```bash
brew install ngrok/ngrok/ngrok
```

### Get Ngrok Account (Free):
1. Go to https://ngrok.com/signup
2. Sign up for free account
3. Get your auth token from dashboard
4. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`

### Start Backend with Ngrok:
```bash
# Terminal 1: Start your Flask backend
cd /Users/ninjakumar/Documents/Programming/visionbot
python app.py

# Terminal 2: Start ngrok tunnel
ngrok http 5001
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

## Step 2: Configure Mobile App for APK

### Update API URL:
Edit `mobile-app/src/services/ApiService.js`:
```javascript
const API_BASE_URL = 'https://abc123.ngrok.io'; // Your ngrok URL
```

### Install Dependencies:
```bash
cd mobile-app
npm install
```

## Step 3: Build APK

### Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

### Login to Expo:
```bash
eas login
```
(Create free Expo account if needed)

### Build APK:
```bash
cd mobile-app
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo servers
- Build the APK in the cloud
- Give you download link when ready (5-10 minutes)

## Step 4: Download and Install APK

1. **Download**: Click the link from EAS build output
2. **Transfer**: Send APK to your Android phone
3. **Install**: 
   - Enable "Install from unknown sources" in Android settings
   - Tap APK file to install
   - Open MediBot AI app

## Step 5: Keep Backend Running

**Important**: Your APK will connect to the ngrok URL you built it with. Keep these running:

```bash
# Terminal 1: Backend
python app.py

# Terminal 2: Ngrok (same URL as when you built APK)
ngrok http 5001
```

## 🔄 Alternative: Build Script

Create `build-apk.sh`:
```bash
#!/bin/bash
echo "🏗️ Building MediBot AI APK..."

# Check if backend is running
if ! curl -s http://localhost:5001/test > /dev/null; then
    echo "❌ Backend not running. Start with: python app.py"
    exit 1
fi

# Check if ngrok is running
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
    echo "❌ Ngrok not running. Start with: ngrok http 5001"
    exit 1
fi

echo "✅ Backend URL: $NGROK_URL"

# Update mobile app
cd mobile-app
sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = '$NGROK_URL';|" src/services/ApiService.js

echo "✅ Mobile app updated with backend URL"

# Build APK
echo "🚀 Starting APK build..."
eas build --platform android --profile preview

echo ""
echo "✅ APK build started!"
echo "📱 Download link will be provided when build completes"
echo "⏱️ Build time: ~5-10 minutes"
echo ""
echo "🔄 Keep these running while using the app:"
echo "   Terminal 1: python app.py"
echo "   Terminal 2: ngrok http 5001"
```

Run with: `chmod +x build-apk.sh && ./build-apk.sh`

## 📋 Quick Checklist

- [ ] Ngrok installed and authenticated
- [ ] Backend running (`python app.py`)
- [ ] Ngrok tunnel active (`ngrok http 5001`)
- [ ] Mobile app updated with ngrok URL
- [ ] EAS CLI installed and logged in
- [ ] APK build command executed
- [ ] APK downloaded and installed on phone

## 🎯 Final Result

You'll have:
- ✅ Standalone APK file
- ✅ Connects to your ngrok backend
- ✅ Same functionality as web app
- ✅ Works on any Android device
- ✅ No Expo Go app needed

## ⚠️ Important Notes

1. **Ngrok URL**: APK is built with specific ngrok URL - keep same tunnel running
2. **Free Limits**: Ngrok free tier has 2-hour sessions
3. **Rebuild**: If ngrok URL changes, rebuild APK with new URL
4. **Backend**: Must keep Flask backend running for app to work
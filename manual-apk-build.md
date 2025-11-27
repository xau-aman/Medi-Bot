# 📱 Manual APK Build - Step by Step

Since there's a permission issue with global npm install, here's the manual process:

## Step 1: Install EAS CLI Locally
```bash
cd mobile-app
npm install eas-cli
```

## Step 2: Verify Your Ngrok URL is Set
Your ngrok URL: `https://910265327c5b.ngrok-free.app`

Check `mobile-app/src/services/ApiService.js`:
```javascript
const API_BASE_URL = 'https://910265327c5b.ngrok-free.app';
```

## Step 3: Login to Expo
```bash
cd mobile-app
npx eas login
```
Create free account at https://expo.dev if needed.

## Step 4: Build APK
```bash
npx eas build --platform android --profile preview
```

This will:
- Upload your code to Expo servers
- Build APK in the cloud (5-10 minutes)
- Give you download link

## Step 5: Download & Install
1. Click the download link when build completes
2. Transfer APK to your Android phone
3. Enable "Install from unknown sources" in Android settings
4. Install the APK
5. Open MediBot AI app

## Alternative: Use Expo Application Services Web
1. Go to https://expo.dev
2. Create account and new project
3. Upload your mobile-app folder
4. Build APK through web interface

## Keep Backend Running
Your APK will connect to: `https://910265327c5b.ngrok-free.app`

Keep these running:
```bash
# Terminal 1
python app.py

# Terminal 2  
ngrok http 5001
```

## Quick Commands
```bash
cd mobile-app
npm install eas-cli
npx eas login
npx eas build --platform android --profile preview
```
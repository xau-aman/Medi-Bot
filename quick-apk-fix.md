# 🔧 Quick APK Build Fix

The issue is with EAS CLI installation. Here's the manual fix:

## Step 1: Install EAS CLI Manually
```bash
npm install -g eas-cli
```

## Step 2: Login to Expo
```bash
eas login
```
(Create free account at https://expo.dev if needed)

## Step 3: Build APK
```bash
cd mobile-app
eas build --platform android --profile preview
```

## Alternative: Use Fixed Script
```bash
./build-apk.sh
```

The script is now fixed with the correct EAS CLI package name.

## If Still Having Issues:

### Manual Process:
```bash
# 1. Make sure your ngrok URL is in the mobile app
cd mobile-app
# Edit src/services/ApiService.js and set:
# const API_BASE_URL = 'https://910265327c5b.ngrok-free.app';

# 2. Install dependencies
npm install

# 3. Build APK
npx eas-cli build --platform android --profile preview
```

Your ngrok URL is: `https://910265327c5b.ngrok-free.app`
Make sure this is set in `mobile-app/src/services/ApiService.js`
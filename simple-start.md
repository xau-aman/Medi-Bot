# 🚀 Simple Start Guide

## Just Start the Backend Manually:

```bash
python3 app.py
```

This will:
- ✅ Start backend on http://localhost:5001
- ✅ Work with your ngrok tunnel: https://29c27f4f82bd.ngrok-free.app
- ✅ Mobile app is already configured with correct URL

## Then Build APK:

```bash
cd mobile-app
npx eas build --platform android --profile preview
```

## Or Use Fixed Script:

```bash
./quick-start.sh
```

## Web App:

Open: http://localhost:5001

That's it! The mobile app should connect properly now.
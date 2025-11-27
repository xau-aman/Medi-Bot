# 🚀 MediBot AI - Complete Setup Guide

## 🎯 One Command to Rule Them All

```bash
./master-start.sh
```

This single script will:
- ✅ Start Flask backend (port 5001) 
- ✅ Start React frontend (port 3000)
- ✅ Start ngrok tunnel
- ✅ Configure mobile app with your MacBook IP
- ✅ Build APK automatically
- ✅ Show all URLs and connection info

## 📱 How Mobile Connection Works

**Your Setup:**
- **Web App**: http://localhost:3000 (React frontend)
- **Backend API**: http://localhost:5001 (Flask backend)
- **Mobile App**: Connects to `http://192.168.0.8:5001` (your MacBook's backend API)

**Why Port 5001?**
- Web frontend (port 3000) talks to backend (port 5001)
- Mobile app talks directly to backend (port 5001)
- Both use the same backend API!

## 🔧 Manual Steps (if needed)

**1. Start Backend:**
```bash
python3 app.py  # Runs on port 5001
```

**2. Start Frontend:**
```bash
cd frontend && npm start  # Runs on port 3000
```

**3. Build APK:**
```bash
cd mobile-app
npx eas build --platform android --profile preview
```

## 📋 Requirements

- MacBook and phone on same WiFi
- Expo account (free)
- Node.js and Python installed

## 🎉 Result

- **Web App**: http://localhost:3000
- **Mobile APK**: Downloads automatically
- **Same Backend**: Both use your Flask API on port 5001

Everything connects properly now! 🚀
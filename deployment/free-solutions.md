# 🆓 FREE Backend Deployment Solutions

## Option 1: Render (RECOMMENDED)

### Setup:
1. Go to https://render.com (free account)
2. Connect your GitHub repo
3. Create Web Service
4. Use these settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

### Files needed:
**requirements.txt:**
```
Flask==2.3.3
Flask-CORS==4.0.0
ultralytics==8.0.196
Pillow==10.0.1
requests==2.31.0
python-multipart==0.0.6
```

**render.yaml:**
```yaml
services:
  - type: web
    name: medibot-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python app.py
    envVars:
      - key: PORT
        value: 10000
```

### Mobile App Update:
```javascript
const API_BASE_URL = 'https://your-app.onrender.com';
```

## Option 2: Ngrok (EASIEST)

### Setup:
1. Install ngrok: https://ngrok.com/download
2. Run your Flask app: `python app.py`
3. In new terminal: `ngrok http 5001`
4. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

### Mobile App Update:
```javascript
const API_BASE_URL = 'https://abc123.ngrok.io';
```

### Pros:
- ✅ Works immediately
- ✅ No code changes needed
- ✅ Free tier available

### Cons:
- ⚠️ URL changes each restart
- ⚠️ 2-hour session limit (free)

## Option 3: Replit (SIMPLEST)

### Setup:
1. Go to https://replit.com
2. Create new Python repl
3. Upload your files
4. Click Run
5. Get your repl URL

### Mobile App Update:
```javascript
const API_BASE_URL = 'https://your-repl.your-username.repl.co';
```

## Quick Fix Script

Create this file to auto-update your mobile app:

**update-mobile-api.sh:**
```bash
#!/bin/bash
echo "Enter your backend URL (e.g., https://your-app.onrender.com):"
read API_URL

# Update mobile app
sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = '$API_URL';|" mobile-app/src/services/ApiService.js

echo "✅ Mobile app updated with: $API_URL"
echo "Now run: cd mobile-app && npm start"
```

Run with: `chmod +x update-mobile-api.sh && ./update-mobile-api.sh`
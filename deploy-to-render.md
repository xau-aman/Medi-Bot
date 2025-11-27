# 🚀 Deploy to Render - Step by Step

## Step 1: Create GitHub Repository

1. **Create new repo** on GitHub (e.g., `medibot-ai-backend`)
2. **Upload your code**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/medibot-ai-backend.git
git push -u origin main
```

## Step 2: Deploy on Render

1. **Go to** https://render.com
2. **Sign up** with GitHub (free)
3. **Create Web Service**
4. **Connect** your GitHub repo
5. **Use these settings**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment Variables**:
     - `PORT`: `10000`
     - `OPENROUTER_API_KEY`: `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`

## Step 3: Get Your URL

After deployment, you'll get a URL like:
`https://medibot-ai-backend.onrender.com`

## Step 4: Update Mobile App

The mobile app is already configured to use:
`https://medibot-ai-backend.onrender.com`

## Step 5: Build APK

```bash
cd mobile-app
npx eas build --platform android --profile preview
```

## ✅ What You Get

- **Local Web**: Still works on localhost:3000
- **Hosted Backend**: Available globally
- **Mobile APK**: Connects to hosted backend
- **No Connection Issues**: Works from anywhere

## 🔧 Files Created

- `render.yaml` - Render configuration
- `Procfile` - Deployment script
- `requirements.txt` - Python dependencies
- Updated mobile app with hosted URL

Your local setup remains unchanged! 🎉
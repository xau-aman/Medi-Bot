# 🚀 Deploy to Render (No GitHub Required)

## Method 1: Direct Upload

1. **Go to** https://render.com
2. **Sign up** (free account)
3. **Create Web Service**
4. **Choose "Deploy from Git repository"**
5. **Select "Connect a repository later"**
6. **Upload your code directly**:
   - Zip your project folder
   - Upload the zip file
   - Or use Render CLI

## Method 2: Render CLI (Recommended)

```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy directly
render deploy
```

## Method 3: Manual Setup

1. **Create Web Service** on Render
2. **Manual Configuration**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment Variables**:
     - `PORT`: `10000`
     - `OPENROUTER_API_KEY`: `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`

3. **Upload Files**:
   - Upload `app.py`
   - Upload `requirements.txt`
   - Upload any other needed files

## After Deployment

You'll get a URL like: `https://your-app-name.onrender.com`

Copy this URL and run:
```bash
./update-apk-url.sh YOUR_RENDER_URL
```
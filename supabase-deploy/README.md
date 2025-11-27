# 🚀 MediBot AI - Supabase Deployment

## Step 1: Setup Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Get your project URL and anon key

## Step 2: Deploy Backend

```bash
cd supabase-deploy
./deploy-supabase.sh
```

## Step 3: Update Apps

```bash
./update-mobile-supabase.sh https://your-project.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Test

- Web: http://localhost:3000
- Mobile: APK builds automatically
- API: https://your-project.supabase.co/functions/v1/medibot-api

## Environment Variables

**OPENROUTER_API_KEY:** `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`

## Endpoints

- `/test` - Health check
- `/upload` - Image upload and analysis
- `/query` - Medical chat queries
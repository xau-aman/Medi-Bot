#!/bin/bash

echo "🚀 Deploying MediBot AI to Supabase"

# Install Supabase CLI if not present
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase
echo "🔑 Login to Supabase..."
supabase login

# Initialize project
echo "🏗️ Initializing Supabase project..."
supabase init

# Link to your project
echo "🔗 Link to your Supabase project..."
echo "Run: supabase link --project-ref YOUR_PROJECT_REF"

# Deploy Edge Function
echo "📤 Deploying Edge Function..."
supabase functions deploy medibot-api

# Set secrets
echo "🔐 Setting environment variables..."
supabase secrets set OPENROUTER_API_KEY=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

echo "✅ Deployment complete!"
echo "🌐 Your API URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/medibot-api"
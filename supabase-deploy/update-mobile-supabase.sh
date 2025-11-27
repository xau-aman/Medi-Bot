#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./update-mobile-supabase.sh SUPABASE_URL SUPABASE_ANON_KEY"
    echo "Example: ./update-mobile-supabase.sh https://abc123.supabase.co eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    exit 1
fi

SUPABASE_URL=$1
SUPABASE_ANON_KEY=$2

echo "🔧 Updating mobile app with Supabase configuration..."

# Update mobile app
sed -i '' "s|const SUPABASE_URL = '.*';|const SUPABASE_URL = '$SUPABASE_URL';|" ../mobile-app/src/services/ApiService.js
sed -i '' "s|const SUPABASE_ANON_KEY = '.*';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" ../mobile-app/src/services/ApiService.js

# Update web app
sed -i '' "s|const SUPABASE_URL = '.*';|const SUPABASE_URL = '$SUPABASE_URL';|" ../frontend/src/services/api.js
sed -i '' "s|const SUPABASE_ANON_KEY = '.*';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" ../frontend/src/services/api.js

echo "✅ Updated both mobile and web apps!"
echo "📱 Mobile API: $SUPABASE_URL/functions/v1/medibot-api"
echo "🌐 Web API: $SUPABASE_URL/functions/v1/medibot-api"

echo "🏗️ Building APK..."
cd ../mobile-app
npx eas build --platform android --profile preview
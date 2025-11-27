#!/bin/bash

echo "🔧 Fixing Mobile App Connection..."
echo ""

# Check if backend is running
if ! curl -s http://localhost:5001/test > /dev/null; then
    echo "❌ Backend not running. Starting backend..."
    python app.py &
    sleep 5
fi

# Check if ngrok is running
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    for tunnel in tunnels:
        if tunnel.get('proto') == 'https':
            print(tunnel['public_url'])
            break
except:
    pass
" 2>/dev/null)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Ngrok not running. Starting ngrok..."
    ngrok http 5001 &
    sleep 8
    
    # Get new ngrok URL
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "
    import sys, json
    try:
        data = json.load(sys.stdin)
        tunnels = data.get('tunnels', [])
        for tunnel in tunnels:
            if tunnel.get('proto') == 'https':
                print(tunnel['public_url'])
                break
    except:
        pass
    " 2>/dev/null)
fi

if [ -z "$NGROK_URL" ]; then
    echo "❌ Could not start ngrok. Please run manually: ngrok http 5001"
    exit 1
fi

echo "✅ Ngrok URL: $NGROK_URL"

# Update mobile app
if [ -f "mobile-app/src/services/ApiService.js" ]; then
    echo "🔧 Updating mobile app configuration..."
    sed -i '' "s|const API_BASE_URL = '.*';|const API_BASE_URL = '$NGROK_URL';|" mobile-app/src/services/ApiService.js
    echo "✅ Mobile app updated with: $NGROK_URL"
else
    echo "❌ Mobile app files not found"
    exit 1
fi

# Test connection
echo "🧪 Testing connection..."
if curl -s "$NGROK_URL/test" > /dev/null; then
    echo "✅ Connection test successful!"
    echo ""
    echo "🎯 Mobile app should now connect properly"
    echo "📱 Build APK with: cd mobile-app && npx eas build --platform android --profile preview"
else
    echo "❌ Connection test failed"
    echo "   Check if backend and ngrok are running properly"
fi
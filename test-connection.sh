#!/bin/bash

echo "🔍 Testing MediBot AI Backend Connection..."
echo ""

# Test local backend
echo "1. Testing local backend (localhost:5001)..."
if curl -s http://localhost:5001/test > /dev/null; then
    echo "✅ Local backend is running"
    curl -s http://localhost:5001/test | python3 -c "import sys, json; print('Status:', json.load(sys.stdin)['status'])"
else
    echo "❌ Local backend not running - start with: python app.py"
fi

echo ""

# Test ngrok tunnel
echo "2. Testing ngrok tunnel..."
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
    echo "❌ Ngrok tunnel not found - start with: ngrok http 5001"
else
    echo "✅ Ngrok tunnel found: $NGROK_URL"
    
    # Test ngrok connection
    if curl -s "$NGROK_URL/test" > /dev/null; then
        echo "✅ Ngrok tunnel is working"
        curl -s "$NGROK_URL/test" | python3 -c "import sys, json; print('Status:', json.load(sys.stdin)['status'])"
    else
        echo "❌ Ngrok tunnel not responding"
    fi
fi

echo ""

# Check mobile app configuration
echo "3. Checking mobile app configuration..."
if [ -f "mobile-app/src/services/ApiService.js" ]; then
    MOBILE_URL=$(grep "const API_BASE_URL" mobile-app/src/services/ApiService.js | cut -d"'" -f2)
    echo "Mobile app configured for: $MOBILE_URL"
    
    if [ "$MOBILE_URL" = "$NGROK_URL" ]; then
        echo "✅ Mobile app URL matches ngrok tunnel"
    else
        echo "⚠️  Mobile app URL doesn't match ngrok tunnel"
        echo "   Update mobile-app/src/services/ApiService.js with: $NGROK_URL"
    fi
else
    echo "❌ Mobile app files not found"
fi

echo ""
echo "🎯 Summary:"
echo "   Backend: http://localhost:5001"
echo "   Ngrok: $NGROK_URL"
echo "   Mobile: $MOBILE_URL"
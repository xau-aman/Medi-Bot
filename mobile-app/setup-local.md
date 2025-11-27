# 📱 Local MacBook Backend Setup for Mobile App

## 🚀 Quick Setup Guide

### Step 1: Find Your MacBook's IP Address

Open Terminal on your MacBook and run:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

You'll see something like:
```
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

Your MacBook's IP is: `192.168.1.100` (example)

### Step 2: Update Mobile App Configuration

Edit `src/services/ApiService.js` and replace the IP address:
```javascript
const API_BASE_URL = 'http://192.168.1.100:5001'; // Use YOUR MacBook's IP
```

### Step 3: Start Your Backend

On your MacBook, run:
```bash
cd /Users/ninjakumar/Documents/Programming/visionbot
python app.py
```

You'll see:
```
🏥 MediBot AI Backend starting...
📱 Mobile app can connect to: http://[YOUR_MACBOOK_IP]:5001
🌐 Web app available at: http://localhost:5001
💡 To find your MacBook IP: ifconfig | grep 'inet ' | grep -v 127.0.0.1
```

### Step 4: Test Mobile App

1. **Start mobile app:**
```bash
cd mobile-app
npm start
```

2. **Scan QR code** with Expo Go app on your phone

3. **Test connection** - the app should connect to your MacBook backend

## 🔧 Troubleshooting

### Mobile App Can't Connect?

1. **Check same WiFi network:**
   - MacBook and phone must be on same WiFi
   - Check WiFi name on both devices

2. **Check IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Check firewall:**
   - System Preferences → Security & Privacy → Firewall
   - Allow Python/Terminal through firewall

4. **Test backend manually:**
   ```bash
   curl http://YOUR_MACBOOK_IP:5001/test
   ```

### Common IP Addresses by Network:
- Home WiFi: `192.168.1.x` or `192.168.0.x`
- Office WiFi: `10.0.0.x` or `172.16.x.x`
- Mobile Hotspot: `192.168.43.x`

### Quick IP Detection Script:
```bash
# Run this on your MacBook to get the right IP
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
```

## 📱 Mobile Development Workflow

1. **Start Backend (MacBook):**
   ```bash
   python app.py
   ```

2. **Start Mobile App:**
   ```bash
   cd mobile-app
   npm start
   ```

3. **Open on Phone:**
   - Install Expo Go app
   - Scan QR code from terminal
   - App connects to MacBook backend

## 🔒 Network Security

- Backend only accepts connections from local network
- No external internet access required
- All data stays on your local network
- Same security as web version

## ⚡ Performance Tips

- Keep MacBook plugged in during development
- Use same WiFi network (5GHz preferred)
- Close unnecessary apps on MacBook
- Keep phone close to WiFi router

## 🔄 Auto IP Detection (Advanced)

For automatic IP detection, you can use this script:

```bash
#!/bin/bash
# save as get-ip.sh
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "Your MacBook IP: $IP"
echo "Update ApiService.js with: http://$IP:5001"
```

Run with: `chmod +x get-ip.sh && ./get-ip.sh`
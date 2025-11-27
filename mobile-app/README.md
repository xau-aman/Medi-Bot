# MediBot AI Mobile App

Mobile version of MediBot AI - Professional Medical Image Analysis Platform built with React Native and Expo.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Navigate to mobile app directory:**
```bash
cd mobile-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update API endpoint:**
Edit `src/services/ApiService.js` and change `API_BASE_URL` to your deployed backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-url.com'; // Replace with your backend URL
```

### Development

1. **Start Expo development server:**
```bash
npm start
```

2. **Run on device/simulator:**
```bash
# Android
npm run android

# iOS
npm run ios
```

### Building APK

1. **Install EAS CLI:**
```bash
npm install -g @expo/eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Build Android APK:**
```bash
npm run build:android
```

4. **Build iOS App:**
```bash
npm run build:ios
```

## 📱 Features

- **Same Backend Integration**: Uses your existing Flask backend
- **Medical Image Analysis**: Upload from gallery or take photos
- **AI Chat Interface**: Interactive medical consultation
- **Dark/Light Theme**: Automatic theme switching
- **Offline Support**: Graceful handling of network issues
- **HIPAA Compliant Design**: Secure medical data handling

## 🔧 Configuration

### Backend Connection
Update the API endpoint in `src/services/ApiService.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:5001';
```

### App Configuration
Modify `app.json` for:
- App name and version
- Bundle identifiers
- Permissions
- Icons and splash screens

## 📦 Project Structure

```
mobile-app/
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── contexts/         # Theme and state management
│   ├── services/         # API integration
│   └── assets/          # Images and icons
├── App.js               # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## 🔒 Security Features

- **Secure API Communication**: HTTPS support
- **Permission Management**: Camera and storage permissions
- **Data Validation**: Input sanitization
- **Error Handling**: Graceful error management

## 🌐 Backend Compatibility

This mobile app is designed to work with your existing Flask backend without any modifications:
- Uses same `/upload` endpoint for image analysis
- Uses same `/query` endpoint for chat functionality
- Maintains same data format and response structure

## 📋 Requirements

- **iOS**: iOS 11.0 or higher
- **Android**: Android 5.0 (API level 21) or higher
- **Network**: Internet connection for AI analysis
- **Storage**: ~50MB for app installation

## 🚀 Deployment

### Google Play Store
1. Build production APK with `eas build`
2. Create Google Play Console account
3. Upload APK and complete store listing
4. Submit for review

### Apple App Store
1. Build production IPA with `eas build`
2. Create Apple Developer account
3. Upload to App Store Connect
4. Submit for review

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues:**
```bash
npx expo start --clear
```

2. **Android build errors:**
```bash
cd android && ./gradlew clean && cd ..
```

3. **iOS build errors:**
```bash
cd ios && rm -rf Pods && pod install && cd ..
```

### Backend Connection Issues
- Ensure backend is running and accessible
- Check API_BASE_URL in ApiService.js
- Verify CORS settings in Flask backend
- Test with `/test` endpoint

## 📞 Support

For issues related to:
- **Mobile App**: Check React Native/Expo documentation
- **Backend Integration**: Refer to Flask backend documentation
- **Medical Features**: Same as web application

## 🔄 Updates

The mobile app automatically stays in sync with your backend updates. No mobile app updates needed for:
- AI model improvements
- New medical analysis features
- Backend optimizations

Mobile app updates only needed for:
- UI/UX improvements
- New mobile-specific features
- Performance optimizations
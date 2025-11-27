// Network utilities for local development
import { Alert } from 'react-native';

class NetworkUtils {
  // Common local IP patterns for auto-detection
  static commonIPs = [
    '192.168.1.',
    '192.168.0.',
    '10.0.0.',
    '172.16.',
    '192.168.43.' // Mobile hotspot
  ];

  // Test connection to backend
  static async testConnection(baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/test`, {
        method: 'GET',
        timeout: 5000
      });
      const result = await response.json();
      return result.status === 'Backend is working!';
    } catch (error) {
      return false;
    }
  }

  // Show connection help dialog
  static showConnectionHelp() {
    Alert.alert(
      'Backend Connection Help',
      `To connect to your MacBook backend:

1. Find your MacBook's IP address:
   Terminal: ifconfig | grep "inet " | grep -v 127.0.0.1

2. Update src/services/ApiService.js:
   Change API_BASE_URL to: http://YOUR_IP:5001

3. Make sure:
   • MacBook and phone on same WiFi
   • Backend running: python app.py
   • Firewall allows connections

Common IPs:
• Home WiFi: 192.168.1.x
• Office WiFi: 10.0.0.x`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  }

  // Auto-detect and suggest IP addresses
  static async findPossibleIPs() {
    const suggestions = [];
    
    // Generate common IP ranges
    for (const prefix of this.commonIPs) {
      for (let i = 100; i <= 110; i++) {
        suggestions.push(`http://${prefix}${i}:5001`);
      }
    }

    // Test each suggestion
    const workingIPs = [];
    for (const ip of suggestions.slice(0, 20)) { // Test first 20
      if (await this.testConnection(ip)) {
        workingIPs.push(ip);
      }
    }

    return workingIPs;
  }
}

export default NetworkUtils;
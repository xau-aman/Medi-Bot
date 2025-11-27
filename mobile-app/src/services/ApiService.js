// API Service - Supabase Edge Functions
const SUPABASE_URL = 'https://ztfucwdnvoixxjwwgdel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZnVjd2Rudm9peHhqd3dnZGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDIwMTIsImV4cCI6MjA3MzMxODAxMn0.OB0sByl6V5JAjbIxD4yp_-z-I3W4-gNGukwwN4Mgcqw';
const API_BASE_URL = `${SUPABASE_URL}/functions/v1/medibot-api`;

class ApiService {
  static async uploadImage(imageUri) {
    try {
      // Compress image before upload
      const compressedUri = await this.compressImage(imageUri);
      
      const formData = new FormData();
      formData.append('file', {
        uri: compressedUri,
        type: 'image/jpeg',
        name: 'medical_image.jpg',
      });

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        timeout: 60000, // 60 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  static async compressImage(uri) {
    try {
      // Simple compression - reduce quality for faster upload
      return uri; // For now, return original - can add compression library later
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      return uri;
    }
  }

  static async sendQuery(query, imageData = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          image_data: imageData,
        }),
        timeout: 30000, // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Query error:', error);
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/test`, {
        timeout: 10000, // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Connection test error:', error);
      return { status: 'Backend unavailable', error: error.message };
    }
  }
}

export default ApiService;
const SUPABASE_URL = 'https://ztfucwdnvoixxjwwgdel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0ZnVjd2Rudm9peHhqd3dnZGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDIwMTIsImV4cCI6MjA3MzMxODAxMn0.OB0sByl6V5JAjbIxD4yp_-z-I3W4-gNGukwwN4Mgcqw';
const API_BASE_URL = `${SUPABASE_URL}/functions/v1/medibot-api`;

class ApiService {
  static async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });

    return response.json();
  }

  static async sendQuery(query, imageData = null) {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        query,
        image_data: imageData,
      }),
    });

    return response.json();
  }

  static async testConnection() {
    const response = await fetch(`${API_BASE_URL}/test`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    return response.json();
  }
}

export default ApiService;
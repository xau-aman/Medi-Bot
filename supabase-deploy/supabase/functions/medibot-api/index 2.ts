/// <reference types="https://deno.land/x/xhr@0.1.0/mod.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
}

const webApp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediBot AI - Medical Image Analysis</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2d5a3d;
            text-align: center;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        .section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
        }
        .section h3 {
            color: #2d5a3d;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        input[type="file"] {
            width: 100%;
            padding: 12px;
            border: 2px dashed #007bff;
            border-radius: 10px;
            background: white;
            margin: 10px 0;
            cursor: pointer;
        }
        input[type="text"] {
            width: 70%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 10px 5px 10px 0;
            font-size: 16px;
        }
        button {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #007bff;
            color: white;
        }
        .btn-success {
            background: #28a745;
            color: white;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .results {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
            display: none;
        }
        .results h3 {
            color: #28a745;
            margin-bottom: 15px;
        }
        .analysis-content {
            white-space: pre-wrap;
            line-height: 1.6;
            color: #333;
        }
        .loading {
            text-align: center;
            color: #007bff;
            font-weight: 600;
        }
        .error {
            color: #dc3545;
            background: #f8d7da;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 MediBot AI</h1>
        <p class="subtitle">Professional Medical Image Analysis Platform</p>
        
        <div class="section">
            <h3>📤 Upload Medical Image</h3>
            <input type="file" id="imageInput" accept="image/*" />
            <button class="btn-success" onclick="uploadImage()">Analyze Medical Image</button>
            <div id="uploadStatus"></div>
        </div>
        
        <div id="results" class="results">
            <h3>🔍 Medical Analysis Results</h3>
            <div id="analysisContent" class="analysis-content"></div>
        </div>
        
        <div class="section">
            <h3>💬 Medical Consultation Chat</h3>
            <input type="text" id="queryInput" placeholder="Ask a medical question..." />
            <button class="btn-primary" onclick="sendQuery()">Ask MediBot</button>
            <div id="chatResults" class="results" style="display: block;">
                <p>Welcome to MediBot AI! Upload a medical image above or ask a medical question.</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
            ⚠️ This AI tool is for educational purposes only. Always consult qualified healthcare professionals for medical diagnosis and treatment.
        </div>
    </div>

    <script>
        const API_KEY = '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';
        
        async function uploadImage() {
            const input = document.getElementById('imageInput');
            const file = input.files[0];
            const statusDiv = document.getElementById('uploadStatus');
            
            if (!file) {
                statusDiv.innerHTML = '<div class="error">Please select a medical image first</div>';
                return;
            }
            
            statusDiv.innerHTML = '<div class="loading">🔄 Analyzing medical image...</div>';
            
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + API_KEY,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://medibot-ai.supabase.co',
                        'X-Title': 'MediBot AI'
                    },
                    body: JSON.stringify({
                        model: 'google/gemini-2.5-flash',
                        messages: [{
                            role: 'system',
                            content: 'You are MediBot AI, a professional medical imaging assistant. Analyze medical images and provide clinical insights with appropriate medical disclaimers.'
                        }, {
                            role: 'user',
                            content: [{
                                type: 'text',
                                text: 'Analyze this medical image as a radiologist would. Provide: IMAGING MODALITY, ANATOMICAL STRUCTURES, RADIOLOGICAL FINDINGS, CLINICAL IMPRESSION, and MEDICAL DISCLAIMER. Use bullet points (•) exclusively.'
                            }, {
                                type: 'image_url',
                                image_url: {
                                    url: await fileToBase64(file)
                                }
                            }]
                        }],
                        max_tokens: 800
                    })
                });
                
                const result = await response.json();
                
                if (result.choices && result.choices[0]) {
                    document.getElementById('results').style.display = 'block';
                    document.getElementById('analysisContent').textContent = result.choices[0].message.content;
                    statusDiv.innerHTML = '<div style="color: #28a745;">✅ Analysis complete!</div>';
                } else {
                    statusDiv.innerHTML = '<div class="error">Analysis failed: ' + (result.error?.message || 'Unknown error') + '</div>';
                }
            } catch (error) {
                statusDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        async function sendQuery() {
            const input = document.getElementById('queryInput');
            const query = input.value.trim();
            const resultsDiv = document.getElementById('chatResults');
            
            if (!query) return;
            
            resultsDiv.innerHTML = '<div class="loading">🤔 MediBot is thinking...</div>';
            
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + API_KEY,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://medibot-ai.supabase.co',
                        'X-Title': 'MediBot AI'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-3.5-turbo',
                        messages: [{
                            role: 'system',
                            content: 'You are MediBot AI, a professional medical assistant. Provide educational medical information with appropriate disclaimers.'
                        }, {
                            role: 'user',
                            content: 'As MediBot AI, answer this medical question: ' + query + '\\n\\nProvide professional medical information with educational context and appropriate medical disclaimers. Use bullet points (•) for clear structure.'
                        }],
                        max_tokens: 800
                    })
                });
                
                const result = await response.json();
                
                if (result.choices && result.choices[0]) {
                    resultsDiv.innerHTML = '<div class="analysis-content">' + result.choices[0].message.content + '</div>';
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error?.message || 'Unknown error') + '</div>';
                }
                
                input.value = '';
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }
        
        // Allow Enter key for chat
        document.getElementById('queryInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendQuery();
            }
        });
    </script>
</body>
</html>`;

Deno.serve(async (req) => {
  const corsResponse = new Response(webApp, {
    headers: { ...corsHeaders, 'Content-Type': 'text/html' }
  });
  
  return corsResponse;
});
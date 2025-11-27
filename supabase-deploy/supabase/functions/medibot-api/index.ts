const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
}

// Medical AI processing functions
async function queryOpenRouter(prompt, imageData) {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY') || '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'
  
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://medibot-ai.supabase.co",
    "X-Title": "MediBot AI"
  }
  
  const systemPrompt = "You are MediBot AI, a professional medical imaging assistant. You specialize in analyzing medical images and providing clinical insights. Always maintain professional medical terminology, focus on anatomical findings, and include appropriate medical disclaimers. Respond concisely and structure your analysis clearly."
  
  let messages, modelName
  
  if (imageData) {
    messages = [
      {"role": "system", "content": systemPrompt},
      {
        "role": "user",
        "content": [
          {"type": "text", "text": prompt},
          {"type": "image_url", "image_url": {"url": `data:image/jpeg;base64,${imageData}`}}
        ]
      }
    ]
    modelName = "google/gemini-2.5-flash"
  } else {
    messages = [
      {"role": "system", "content": systemPrompt},
      {"role": "user", "content": prompt}
    ]
    modelName = "openai/gpt-3.5-turbo"
  }
  
  const data = {
    model: modelName,
    messages: messages,
    max_tokens: 800
  }
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    if (result.choices && result.choices.length > 0) {
      return result.choices[0].message.content
    } else {
      return `API Error: ${result.error?.message || 'Unknown error'}`
    }
  } catch (error) {
    return `Network error: ${error.message}`
  }
}

// Extract comprehensive metadata from image
function extractMetadata(file) {
  try {
    const metadata = {
      filename: file.name || 'uploaded_image',
      format: file.type || 'Unknown',
      file_size_bytes: file.size,
      file_size_mb: Math.round((file.size / (1024 * 1024)) * 100) / 100,
      upload_timestamp: new Date().toISOString(),
      has_exif: false // Simplified for web - full EXIF extraction would need additional libraries
    }
    
    return metadata
  } catch (error) {
    return {
      error: `Could not extract metadata: ${error.message}`,
      format: 'Unknown',
      size: 'Unknown',
      has_exif: false
    }
  }
}

// Simulate YOLO-like object detection (simplified for web deployment)
function simulateObjectDetection(imageData) {
  // In a real implementation, this would use a web-compatible ML model
  // For now, return empty array since we focus on medical AI analysis
  return []
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
        .metadata {
            background: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            font-size: 14px;
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
            <div id="metadataContent" class="metadata" style="display: none;"></div>
        </div>
        
        <div class="section">
            <h3>💬 Medical Consultation Chat</h3>
            <input type="text" id="queryInput" placeholder="Ask a medical question..." />
            <button class="btn-primary" onclick="sendQuery()">Ask MediBot</button>
            <div id="chatResults" class="results" style="display: block;">
                <p><strong>Welcome to MediBot AI!</strong></p>
                <p>🏥 Professional medical imaging assistant</p>
                <p>📊 AI-powered diagnostic support</p>
                <p>🔬 Clinical analysis and consultation</p>
                <br>
                <p><em>Upload a medical image above or ask a medical question below.</em></p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
            ⚠️ This AI tool is for educational purposes only. Always consult qualified healthcare professionals for medical diagnosis and treatment.
        </div>
    </div>

    <script>
        async function uploadImage() {
            const input = document.getElementById('imageInput');
            const file = input.files[0];
            const statusDiv = document.getElementById('uploadStatus');
            
            if (!file) {
                statusDiv.innerHTML = '<div class="error">Please select a medical image first</div>';
                return;
            }
            
            statusDiv.innerHTML = '<div class="loading">🔄 Analyzing medical image with AI...</div>';
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('results').style.display = 'block';
                    document.getElementById('analysisContent').textContent = result.ai_analysis;
                    
                    // Show metadata if available
                    if (result.metadata) {
                        const metadataDiv = document.getElementById('metadataContent');
                        metadataDiv.innerHTML = '<h4>📋 Image Metadata:</h4>' + 
                            '<p><strong>Format:</strong> ' + result.metadata.format + '</p>' +
                            '<p><strong>Size:</strong> ' + result.metadata.file_size_mb + ' MB</p>' +
                            '<p><strong>Filename:</strong> ' + result.metadata.filename + '</p>';
                        metadataDiv.style.display = 'block';
                    }
                    
                    statusDiv.innerHTML = '<div style="color: #28a745;">✅ Medical analysis complete!</div>';
                } else {
                    statusDiv.innerHTML = '<div class="error">Analysis failed: ' + (result.error || 'Unknown error') + '</div>';
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
            
            resultsDiv.innerHTML = '<div class="loading">🤔 MediBot AI is analyzing your question...</div>';
            
            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });
                
                const result = await response.json();
                
                if (result.response) {
                    resultsDiv.innerHTML = '<div class="analysis-content">' + result.response + '</div>';
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error || 'Unknown error') + '</div>';
                }
                
                input.value = '';
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        document.getElementById('queryInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendQuery();
            }
        });
    </script>
</body>
</html>`;

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  // Serve web app on root path - NO AUTH REQUIRED
  if (path === '/' || path === '/medibot-api' || path === '/medibot-api/') {
    return new Response(webApp, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' }
    })
  }
  
  // API endpoints - NO AUTH REQUIRED
  if (path === '/test' || path === '/medibot-api/test') {
    return new Response(
      JSON.stringify({ 
        status: 'Backend is working!', 
        platform: 'Supabase Edge Functions',
        medical_ai: 'OpenRouter + Gemini',
        features: ['Medical Image Analysis', 'Clinical Consultation', 'AI Diagnostics']
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
  
  if ((path === '/upload' || path === '/medibot-api/upload') && req.method === 'POST') {
    try {
      const formData = await req.formData()
      const file = formData.get('file')
      
      if (!file) {
        return new Response(
          JSON.stringify({ success: false, error: 'No file uploaded' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const base64 = btoa(String.fromCharCode(...uint8Array))

      // Extract metadata
      const metadata = extractMetadata(file)

      // Simulate object detection (simplified for web deployment)
      const detections = simulateObjectDetection(base64)

      // Professional medical analysis prompt
      const analysisPrompt = `Analyze this medical image as a radiologist would. Provide a comprehensive professional medical assessment.

Format your response as:

IMAGING MODALITY:
• Identify the type of medical imaging (X-ray, MRI, CT, ultrasound, etc.)
• Note image quality and technical parameters

ANATOMICAL STRUCTURES:
• List all visible anatomical structures
• Note bone, soft tissue, organ visibility
• Describe anatomical landmarks

RADIOLOGICAL FINDINGS:
• Describe any notable findings in detail
• Comment on symmetry, alignment, density
• Identify any abnormalities or pathology
• Note any artifacts or technical issues

CLINICAL IMPRESSION:
• Provide clinical assessment based on findings
• Suggest differential diagnoses if applicable
• Recommend further imaging if needed
• Note any urgent findings requiring immediate attention

MEDICAL DISCLAIMER:
• This is an AI-assisted analysis for educational purposes
• Clinical correlation and professional medical evaluation required
• Not intended for diagnostic or treatment decisions
• Always consult qualified healthcare professionals

Use medical terminology appropriately. Focus on anatomical and pathological observations only. Use bullet points (•) exclusively.`

      const aiAnalysis = await queryOpenRouter(analysisPrompt, base64)

      return new Response(
        JSON.stringify({
          success: true,
          image_data: base64,
          detections: detections,
          metadata: metadata,
          ai_analysis: aiAnalysis,
          processing_info: {
            model_used: 'Google Gemini 2.5 Flash',
            analysis_type: 'Medical Image Analysis',
            timestamp: new Date().toISOString()
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  if ((path === '/query' || path === '/medibot-api/query') && req.method === 'POST') {
    try {
      const { query, image_data } = await req.json()
      
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'No query provided' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let medicalQuery
      if (image_data) {
        medicalQuery = `Based on the medical image provided, please answer this question: ${query}

Provide a professional medical response using:
• Clear medical explanations with proper terminology
• Relevant anatomical context and clinical significance
• Evidence-based medical information
• Appropriate medical disclaimers and limitations
• Recommendations for professional consultation

Use bullet points (•) for structure. Maintain professional medical tone throughout.`
      } else {
        medicalQuery = `As MediBot AI, please answer this medical question: ${query}

Provide comprehensive medical information including:
• Professional medical explanations
• Current medical knowledge and best practices
• Educational context for healthcare learning
• Appropriate medical disclaimers
• Strong recommendation to consult healthcare professionals
• Relevant medical specialties that should be consulted

Use bullet points (•) for clear structure. Maintain professional medical standards.`
      }

      const response = await queryOpenRouter(medicalQuery, image_data)
      
      return new Response(
        JSON.stringify({ 
          response: response,
          model_info: {
            model_used: image_data ? 'Google Gemini 2.5 Flash' : 'OpenAI GPT-3.5 Turbo',
            query_type: image_data ? 'Image-based Medical Query' : 'Text-based Medical Query',
            timestamp: new Date().toISOString()
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  return new Response(
    JSON.stringify({ error: 'Not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
});
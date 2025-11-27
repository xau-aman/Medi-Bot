from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import base64
import requests
from PIL import Image
import io

app = Flask(__name__)
CORS(app, origins=['*'], methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type', 'Authorization'])

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def query_openrouter(prompt, image_data=None):
    """Send query to OpenRouter API with image analysis capabilities"""
    api_key = os.environ.get('OPENROUTER_API_KEY', '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')
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medibot-ai.local",
        "X-Title": "MediBot AI"
    }
    
    system_prompt = "You are MediBot AI, a professional medical imaging assistant. You specialize in analyzing medical images and providing clinical insights. Always maintain professional medical terminology, focus on anatomical findings, and include appropriate medical disclaimers. Respond concisely and structure your analysis clearly."
    
    if image_data:
        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}}
                ]
            }
        ]
        model_name = "google/gemini-2.5-flash"
    else:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        model_name = "openai/gpt-3.5-turbo"
    
    data = {
        "model": model_name,
        "messages": messages,
        "max_tokens": 800
    }
    
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                               headers=headers, json=data, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content']
        else:
            return f"API Error: {result.get('error', {}).get('message', 'Unknown error')}"
            
    except requests.exceptions.RequestException as e:
        if "Failed to resolve" in str(e) or "Max retries exceeded" in str(e):
            return "Hello! I'm MediBot AI. I'm currently having trouble connecting to my medical AI services. Please check your internet connection or try again. Note: I can still perform basic image analysis offline."
        return f"Network error: {str(e)}"
    except Exception as e:
        return f"Error processing request: {str(e)}"

@app.route('/test')
def test_backend():
    return jsonify({'status': 'Backend is working!', 'yolo_loaded': False})

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return jsonify({'success': True})
        
    try:
        print("Upload request received")
        
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'})
        
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Invalid file type'})
        
        # Read image bytes
        image_bytes = file.read()
        print(f"Image size: {len(image_bytes)} bytes")
        
        # Basic image validation
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img.verify()
        except Exception as e:
            return jsonify({'success': False, 'error': 'Invalid image file'})
        
        # Convert image to base64
        img_base64 = base64.b64encode(image_bytes).decode()
        
        # Medical analysis prompt
        analysis_prompt = """Analyze this medical image as a radiologist would. Provide a professional medical assessment.

Format your response as:

IMAGING MODALITY:
• Identify the type of medical imaging

ANATOMICAL STRUCTURES:
• List visible anatomical structures
• Note bone, soft tissue, or organ visibility

RADIOLOGICAL FINDINGS:
• Describe any notable findings
• Comment on symmetry, alignment, density
• Identify any abnormalities or pathology

CLINICAL IMPRESSION:
• Provide clinical assessment
• Suggest differential diagnoses if applicable
• Recommend further imaging if needed

MEDICAL DISCLAIMER:
• This is an AI-assisted analysis for educational purposes
• Clinical correlation and professional medical evaluation required
• Not intended for diagnostic or treatment decisions

Use medical terminology appropriately. Focus on anatomical and pathological observations only. Use bullet points (•) exclusively."""
        
        ai_analysis = query_openrouter(analysis_prompt, img_base64)
        
        return jsonify({
            'success': True,
            'image_data': img_base64,
            'detections': [],  # No YOLO detections in lightweight version
            'metadata': {'format': img.format if hasattr(img, 'format') else 'Unknown'},
            'ai_analysis': ai_analysis
        })
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/query', methods=['POST'])
def handle_query():
    try:
        data = request.json
        query = data.get('query', '')
        image_data = data.get('image_data', '')
        
        if not query:
            return jsonify({'error': 'No query provided'})
        
        if image_data:
            medical_query = f"""Based on the medical image provided, please answer this question: {query}
            
Provide a professional medical response using:
• Clear medical explanations
• Relevant anatomical context
• Clinical significance if applicable
• Appropriate medical disclaimers

Use bullet points (•) for structure. Maintain professional medical tone."""
        else:
            medical_query = f"""As MediBot AI, please answer this medical question: {query}
            
Provide:
• Professional medical information
• Educational context
• Appropriate medical disclaimers
• Recommendation to consult healthcare professionals

Use bullet points (•) for clear structure."""
        
        response = query_openrouter(medical_query, image_data)
        return jsonify({'response': response})
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, port=port, host='0.0.0.0')
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
import requests
import base64
import io
from PIL import Image
from PIL.ExifTags import TAGS
from werkzeug.utils import secure_filename
import datetime

app = Flask(__name__)
CORS(app, origins=['*'], methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type', 'Authorization'])
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load YOLO model with safe globals
torch.serialization.add_safe_globals(['ultralytics.nn.tasks.DetectionModel'])
model = YOLO('yolov8n.pt')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_image_from_bytes(image_bytes):
    """Analyze image from bytes using YOLO and return detection results"""
    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert PIL image to OpenCV format
    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Run YOLO detection
    results = model(cv_image)
    detections = []
    
    for result in results:
        boxes = result.boxes
        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                conf = box.conf[0].cpu().numpy()
                cls = int(box.cls[0].cpu().numpy())
                class_name = model.names[cls]
                
                if conf > 0.5:  # Filter low confidence detections
                    detections.append({
                        'class': class_name,
                        'confidence': float(conf),
                        'bbox': [float(x1), float(y1), float(x2), float(y2)]
                    })
    
    return detections

def extract_metadata(image_bytes):
    """Extract comprehensive metadata from image bytes"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Get basic image info
        metadata = {
            'filename': 'uploaded_image',
            'format': image.format or 'Unknown',
            'mode': image.mode or 'Unknown',
            'size': f"{image.size[0]} x {image.size[1]}",
            'width': image.size[0],
            'height': image.size[1],
            'total_pixels': image.size[0] * image.size[1],
            'megapixels': round((image.size[0] * image.size[1]) / 1000000, 2),
            'aspect_ratio': round(image.size[0] / image.size[1], 2),
            'file_size_bytes': len(image_bytes),
            'file_size_mb': round(len(image_bytes) / (1024 * 1024), 2)
        }
        
        # Extract EXIF data if available
        exif_data = {}
        if hasattr(image, '_getexif') and image._getexif() is not None:
            exif = image._getexif()
            for tag_id, value in exif.items():
                tag = TAGS.get(tag_id, tag_id)
                exif_data[tag] = value
        
        # Process comprehensive EXIF fields
        processed_exif = {}
        if exif_data:
            # Camera and Device Info
            processed_exif['camera_make'] = exif_data.get('Make', 'Unknown')
            processed_exif['camera_model'] = exif_data.get('Model', 'Unknown')
            processed_exif['software'] = exif_data.get('Software', 'Unknown')
            processed_exif['lens_make'] = exif_data.get('LensMake', 'Unknown')
            processed_exif['lens_model'] = exif_data.get('LensModel', 'Unknown')
            
            # Date and Time
            processed_exif['date_taken'] = exif_data.get('DateTime', 'Unknown')
            processed_exif['date_original'] = exif_data.get('DateTimeOriginal', 'Unknown')
            processed_exif['date_digitized'] = exif_data.get('DateTimeDigitized', 'Unknown')
            
            # Camera Settings
            if 'FNumber' in exif_data:
                processed_exif['aperture'] = f"f/{exif_data['FNumber']}"
            if 'ExposureTime' in exif_data:
                exp_time = exif_data['ExposureTime']
                if exp_time > 0 and exp_time < 1:
                    processed_exif['shutter_speed'] = f"1/{int(1/exp_time)}s"
                else:
                    processed_exif['shutter_speed'] = f"{exp_time}s"
            processed_exif['iso'] = exif_data.get('ISOSpeedRatings', 'Unknown')
            if 'FocalLength' in exif_data:
                processed_exif['focal_length'] = f"{exif_data['FocalLength']}mm"
            processed_exif['focal_length_35mm'] = exif_data.get('FocalLengthIn35mmFilm', 'Unknown')
            
            # Flash and Exposure
            processed_exif['flash'] = exif_data.get('Flash', 'Unknown')
            processed_exif['exposure_mode'] = exif_data.get('ExposureMode', 'Unknown')
            processed_exif['exposure_program'] = exif_data.get('ExposureProgram', 'Unknown')
            processed_exif['metering_mode'] = exif_data.get('MeteringMode', 'Unknown')
            processed_exif['white_balance'] = exif_data.get('WhiteBalance', 'Unknown')
            
            # Image Quality
            processed_exif['color_space'] = exif_data.get('ColorSpace', 'Unknown')
            processed_exif['resolution_unit'] = exif_data.get('ResolutionUnit', 'Unknown')
            processed_exif['x_resolution'] = exif_data.get('XResolution', 'Unknown')
            processed_exif['y_resolution'] = exif_data.get('YResolution', 'Unknown')
            processed_exif['compression'] = exif_data.get('Compression', 'Unknown')
            
            # GPS Information
            gps_info = exif_data.get('GPSInfo', {})
            if gps_info:
                processed_exif['gps_available'] = True
                
                # Extract GPS coordinates
                def convert_to_degrees(value):
                    d, m, s = value
                    return d + (m / 60.0) + (s / 3600.0)
                
                if 'GPSLatitude' in gps_info and 'GPSLatitudeRef' in gps_info:
                    lat = convert_to_degrees(gps_info['GPSLatitude'])
                    if gps_info['GPSLatitudeRef'] == 'S':
                        lat = -lat
                    processed_exif['latitude'] = round(lat, 6)
                
                if 'GPSLongitude' in gps_info and 'GPSLongitudeRef' in gps_info:
                    lon = convert_to_degrees(gps_info['GPSLongitude'])
                    if gps_info['GPSLongitudeRef'] == 'W':
                        lon = -lon
                    processed_exif['longitude'] = round(lon, 6)
                
                processed_exif['gps_altitude'] = gps_info.get('GPSAltitude', 'Unknown')
                processed_exif['gps_timestamp'] = gps_info.get('GPSTimeStamp', 'Unknown')
                processed_exif['gps_datestamp'] = gps_info.get('GPSDateStamp', 'Unknown')
            else:
                processed_exif['gps_available'] = False
            
            # Additional Technical Data
            processed_exif['orientation'] = exif_data.get('Orientation', 'Unknown')
            processed_exif['scene_type'] = exif_data.get('SceneType', 'Unknown')
            processed_exif['scene_capture_type'] = exif_data.get('SceneCaptureType', 'Unknown')
            processed_exif['digital_zoom_ratio'] = exif_data.get('DigitalZoomRatio', 'Unknown')
            processed_exif['contrast'] = exif_data.get('Contrast', 'Unknown')
            processed_exif['saturation'] = exif_data.get('Saturation', 'Unknown')
            processed_exif['sharpness'] = exif_data.get('Sharpness', 'Unknown')
            
            # Remove 'Unknown' values for cleaner display
            processed_exif = {k: v for k, v in processed_exif.items() if v != 'Unknown'}
        
        metadata['exif'] = processed_exif
        metadata['has_exif'] = len(processed_exif) > 0
        
        return metadata
        
    except Exception as e:
        return {
            'error': f'Could not extract metadata: {str(e)}',
            'format': 'Unknown',
            'size': 'Unknown',
            'has_exif': False
        }

def query_openrouter(prompt, image_data=None):
    """Send query to OpenRouter API with image analysis capabilities"""
    api_key = os.environ.get('OPENROUTER_API_KEY', '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')
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medibot-ai.local",
        "X-Title": "MediBot AI"
    }
    
    # Medical system prompt for better context
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
        # Fallback response when API is unavailable
        if "Failed to resolve" in str(e) or "Max retries exceeded" in str(e):
            return "Hello! I'm MediBot AI. I'm currently having trouble connecting to my medical AI services. Please check your internet connection or try again. Note: I can still perform basic image analysis offline."
        return f"Network error: {str(e)}"
    except Exception as e:
        return f"Error processing request: {str(e)}"

# Test route
@app.route('/test')
def test_backend():
    return jsonify({'status': 'Backend is working!', 'yolo_loaded': model is not None})

# Serve React build files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join('frontend/build', path)):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return jsonify({'success': True})
        
    try:
        print("Upload request received")
        print(f"Request files: {list(request.files.keys())}")
        print(f"Request form: {dict(request.form)}")
        
        if 'file' not in request.files:
            print("No file in request")
            return jsonify({'success': False, 'error': 'No file uploaded'})
        
        file = request.files['file']
        if file.filename == '':
            print("Empty filename")
            return jsonify({'success': False, 'error': 'No file selected'})
        
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'error': 'Invalid file type'})
        
        print(f"Processing file: {file.filename}")
        
        # Read image bytes
        image_bytes = file.read()
        print(f"Image size: {len(image_bytes)} bytes")
        
        # Analyze image with YOLO
        detections = analyze_image_from_bytes(image_bytes)
        print(f"Found {len(detections)} detections")
        
        # Extract metadata
        metadata = extract_metadata(image_bytes)
        print(f"Extracted metadata: {metadata.get('format', 'Unknown')} format")
        
        # Convert image to base64 for frontend
        img_base64 = base64.b64encode(image_bytes).decode()
        
        # Load response template
        template_path = 'templates/response_template.txt'
        try:
            with open(template_path, 'r') as f:
                response_template = f.read()
        except:
            # Medical analysis template - simplified
            response_template = """Medical imaging analysis template - respond in structured format with clear sections and bullet points."""
        
        analysis_prompt = f"""Analyze this medical image as a radiologist would. Provide a professional medical assessment.

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

Use medical terminology appropriately. Focus on anatomical and pathological observations only. Use bullet points (•) exclusively - no asterisks or bold formatting."""
        
        ai_analysis = query_openrouter(analysis_prompt, img_base64)
        
        print("Upload successful")
        return jsonify({
            'success': True,
            'image_data': img_base64,
            'detections': detections,
            'metadata': metadata,
            'ai_analysis': ai_analysis
        })
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/query', methods=['POST'])
def handle_query():
    try:
        data = request.json
        query = data.get('query', '')
        image_data = data.get('image_data', '')
        
        if not query:
            return jsonify({'error': 'No query provided'})
        
        print(f"Query received: {query}")
        
        # Enhanced medical query handling
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
        print(f"Query error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    port = int(os.environ.get('PORT', 5001))
    # host='0.0.0.0' allows connections from mobile devices on same network
    print(f"\n🏥 MediBot AI Backend starting...")
    print(f"📱 Mobile app can connect to: http://[YOUR_MACBOOK_IP]:{port}")
    print(f"🌐 Web app available at: http://localhost:{port}")
    print(f"💡 To find your MacBook IP: ifconfig | grep 'inet ' | grep -v 127.0.0.1\n")
    app.run(debug=True, port=port, host='0.0.0.0')
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
from ultralytics import YOLO
import requests
import base64
import io
from PIL import Image
from PIL.ExifTags import TAGS
from werkzeug.utils import secure_filename
import datetime

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load YOLO model
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
    api_key = "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"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5001",
        "X-Title": "VisionBot"
    }
    
    if image_data:
        messages = [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}}
            ]
        }]
        model_name = "google/gemini-2.5-flash"
    else:
        messages = [{"role": "user", "content": prompt}]
        model_name = "openai/gpt-3.5-turbo"
    
    data = {
        "model": model_name,
        "messages": messages,
        "max_tokens": 1000
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
            return "Hello! I'm VisionBot. I'm currently having trouble connecting to my AI services, but I'm still here to help! Please check your internet connection or try again in a moment. You can also upload an image for local YOLO analysis which works offline."
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

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print("Upload request received")
        
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
            # Fallback template if file doesn't exist
            response_template = """What I see:
• {main_subject}
• {key_elements}
• {background}

Objects:
• {object_1}
• {object_2}
• {object_3}

Colors:
• {color_1}
• {color_2}
• {color_3}

Setting:
• {location}
• {time_lighting}

Details:
• {detail_1}
• {detail_2}"""
        
        analysis_prompt = f"""Analyze this image and fill in this exact template:

{response_template}

Replace each {{placeholder}} with actual content. Keep each bullet point short and specific. Use the exact format shown."""
        
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
        
        # Use OpenRouter API with image analysis
        response = query_openrouter(query, image_data)
        return jsonify({'response': response})
        
    except Exception as e:
        print(f"Query error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=False, port=port, host='0.0.0.0')
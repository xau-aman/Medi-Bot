# MediBot AI - Medical Image Analysis Platform

A professional medical AI assistant built with React frontend and Flask backend that combines YOLO anatomical detection with medical AI-powered clinical insights for healthcare professionals and medical education.

## Features

- **Medical React Frontend**: Built with React 18, healthcare-themed animations, and medical UI components
- **YOLO Anatomical Detection**: Real-time anatomical structure detection using YOLOv8
- **Medical AI Chat**: Interactive medical consultation powered by OpenRouter API
- **Medical Image Upload**: Secure upload for X-rays, MRIs, CT scans with preview
- **Clinical Analysis**: Live medical image processing and clinical insights
- **HIPAA Compliant Design**: Secure, privacy-focused medical interface

## 🛠 Tech Stack

### Frontend
- React 18 with Hooks
- Framer Motion for animations
- Lucide React for icons
- Modern CSS with glassmorphism effects

### Backend
- Flask with CORS support
- YOLOv8 for object detection
- OpenRouter API integration
- PIL for image processing

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd visionbot
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Download YOLO model (if not present)
# The yolov8n.pt model will be downloaded automatically on first run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Configure API Keys
Edit `app.py` and replace `YOUR_OPENROUTER_API_KEY` with your actual OpenRouter API key:
```python
OPENROUTER_API_KEY = "your_actual_api_key_here"
```

## Running the Application

### Development Mode

1. **Start the Flask backend**:
```bash
python app.py
```
The backend will run on `http://localhost:5000`

2. **Start the React frontend** (in a new terminal):
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the React app**:
```bash
cd frontend
npm run build
```

2. **Run Flask** (it will serve the built React app):
```bash
python app.py
```
Access the app at `http://localhost:5000`

## UI Features

### Modern Design Elements
- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and text
- **Smooth animations** with Framer Motion
- **Interactive hover states**
- **Progress indicators** and loading states

### User Experience
- **Intuitive navigation** with breadcrumb progress
- **Drag & drop file upload** with preview
- **Real-time analysis** with step-by-step progress
- **Interactive chat** with suggested questions
- **Responsive layout** for all screen sizes

## Medical Usage

1. **Upload Medical Image**: Drag and drop X-rays, MRIs, CT scans, or other medical images
2. **AI Medical Analysis**: Watch real-time progress as AI processes your medical image
3. **View Clinical Results**: See detected anatomical structures and medical findings
4. **Medical Consultation**: Ask medical questions and get AI-powered clinical insights

⚠️ **Medical Disclaimer**: This AI tool is for educational and research purposes only. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.

## 🔧 API Endpoints

- `POST /api/upload` - Upload and analyze image
- `POST /api/query` - Send chat queries about the image
- `GET /` - Serve React application

## File Structure

```
visionbot/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── public/             # Static files
│   └── package.json        # Dependencies
├── app.py                  # Flask backend
├── requirements.txt        # Python dependencies
├── yolov8n.pt             # YOLO model weights
└── README.md              # This file
```

## Supported Features

- **Medical Image Formats**: PNG, JPG, JPEG, DICOM, BMP
- **Max File Size**: 16MB
- **Anatomical Detection**: Medical structures via YOLO
- **Medical AI Models**: Gemini Flash, GPT, and specialized medical models
- **HIPAA Compliance**: Secure medical data processing
- **Medical Specialties**: Radiology, Cardiology, Neurology, Orthopedics, Pathology

## Future Medical Enhancements

- DICOM file support
- Medical report generation
- Integration with medical databases
- Advanced medical visualization
- Clinical decision support
- Multi-modal medical analysis

## License

This project is open source and available under the MIT License.
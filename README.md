# VisionBot - Modern React + Flask AI Image Analysis

A modern web application built with React frontend and Flask backend that combines YOLO object detection with AI-powered chat capabilities.

## Features

- **Modern React Frontend**: Built with React 18, Framer Motion animations, and Tailwind-inspired styling
- **YOLO Object Detection**: Real-time object detection using YOLOv8
- **AI Chat Interface**: Interactive chat powered by OpenRouter API
- **Drag & Drop Upload**: Modern file upload with preview
- **Real-time Analysis**: Live progress tracking and results
- **Responsive Design**: Works perfectly on desktop and mobile

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

## Usage

1. **Upload Image**: Drag and drop or click to select an image file
2. **AI Analysis**: Watch real-time progress as YOLO processes your image
3. **View Results**: See detected objects with confidence scores
4. **Chat**: Ask questions about your image and get AI-powered responses

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

- **Image Formats**: PNG, JPG, JPEG, GIF, BMP
- **Max File Size**: 16MB
- **Object Detection**: 80+ object classes via YOLO
- **AI Models**: Claude, GPT, and other OpenRouter models
- **Browsers**: Chrome, Firefox, Safari, Edge

## Future Enhancements

- Real-time webcam analysis
- Batch image processing
- Custom model training
- Advanced visualization
- Export functionality

## License

This project is open source and available under the MIT License.
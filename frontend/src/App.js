import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Hero from './components/Hero';
import Upload from './components/Upload';
import Analysis from './components/Analysis';
import Chat from './components/Chat';
import SpaceBackground from './components/SpaceBackground';
import Navbar from './components/Navbar';
import HackerWorkspace from './components/HackerWorkspace';

import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [imageData, setImageData] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHackerWorkspace, setShowHackerWorkspace] = useState(false);
  const [keySequence, setKeySequence] = useState([]);

  // Secret key combination: Shift + Shift + H (double tap Shift then H)
  React.useEffect(() => {
    let shiftCount = 0;
    let shiftTimer = null;
    
    const handleKeyDown = (event) => {
      if (event.key === 'Shift') {
        shiftCount++;
        
        if (shiftTimer) clearTimeout(shiftTimer);
        
        shiftTimer = setTimeout(() => {
          shiftCount = 0;
        }, 1000);
        
        return;
      }
      
      // After double shift, press H
      if (event.key === 'h' && shiftCount >= 2) {
        event.preventDefault();
        setShowHackerWorkspace(true);
        shiftCount = 0;
      }
      
      // ESC to close hacker workspace
      if (event.key === 'Escape' && showHackerWorkspace) {
        setShowHackerWorkspace(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHackerWorkspace]);

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImageData(data.image_data);
        setDetections(data.detections);
        
        // Store metadata for the Chat component
        if (data.metadata) {
          window.imageMetadata = data.metadata;
        }
        
        // Store AI analysis for the Chat component
        if (data.ai_analysis) {
          window.lastAnalysis = data.ai_analysis;
        }
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatQuery = async (query) => {
    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          image_data: imageData
        })
      });
      
      const data = await response.json();
      return data.response || 'No response received';
    } catch (error) {
      console.error('Query error:', error);
      return 'Network error occurred';
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'hero':
        return <Hero onGetStarted={() => setCurrentView('chat')} />;
      case 'chat':
        return (
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            <Chat 
              imageData={imageData}
              detections={detections}
              onChatQuery={handleChatQuery}
              onImageUpload={handleImageUpload}
              isLoading={isLoading}
            />
          </motion.div>
        );
      default:
        return <Hero onGetStarted={() => setCurrentView('chat')} />;
    }
  };

  return (
    <div className="App">
      <SpaceBackground currentView={currentView} />
      {currentView === 'hero' && <Navbar isTransitioning={false} />}
      {renderCurrentView()}
      
      {/* Hacker Workspace Overlay */}
      <HackerWorkspace 
        isVisible={showHackerWorkspace}
        onClose={() => setShowHackerWorkspace(false)}
      />
    </div>
  );
}

export default App;
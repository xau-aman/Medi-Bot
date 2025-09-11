import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Upload = ({ onImageUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, GIF, or BMP)');
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      alert('File size too large. Please upload an image smaller than 16MB');
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 40px',
      textAlign: 'center'
    }}>
      <motion.div 
        style={{
          maxWidth: '600px',
          marginBottom: '40px'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 style={{
          fontSize: '32px',
          fontWeight: 300,
          marginBottom: '20px'
        }}>Upload Image</h2>
        <p style={{
          color: '#888888',
          marginBottom: '40px'
        }}>Select an image to analyze with AI-powered object detection</p>
      </motion.div>

      <motion.div
        style={{ width: '100%', maxWidth: '600px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {!selectedFile ? (
          <motion.div
            style={{
              width: '100%',
              height: '300px',
              border: `2px dashed ${dragActive ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              background: dragActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              marginBottom: '40px',
              transition: 'all 0.3s ease'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ borderColor: 'rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div style={{
              fontSize: '60px',
              marginBottom: '20px',
              opacity: 0.6
            }}>📁</div>
            
            <div style={{
              fontSize: '18px',
              fontWeight: 500,
              marginBottom: '8px'
            }}>Choose Image</div>
            
            <div style={{
              fontSize: '14px',
              color: '#888888'
            }}>PNG, JPG, GIF up to 16MB</div>
          </motion.div>
        ) : (
          <motion.div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '12px',
                marginBottom: '20px',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            />
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 500,
                marginBottom: '8px'
              }}>{selectedFile.name}</h3>
              <p style={{
                fontSize: '14px',
                color: '#888888',
                marginBottom: '20px'
              }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={clearSelection}
                  className="btn-secondary"
                  disabled={isLoading}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Change Image
                </button>
                
                <button
                  onClick={handleUpload}
                  className="btn-primary"
                  disabled={isLoading}
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Upload;
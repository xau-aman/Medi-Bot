let currentImageData = null;

document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messages = document.getElementById('messages');
    const loading = document.getElementById('loading');
    const heroSection = document.getElementById('heroSection');
    const uploadSection = document.getElementById('uploadSection');
    const chatSection = document.getElementById('chatSection');
    const backBtn = document.getElementById('backBtn');
    const uploadBackBtn = document.getElementById('uploadBackBtn');
    const startBtn = document.getElementById('startBtn');
    const logoBtn = document.getElementById('logoBtn');
    const imageDisplay = document.getElementById('imageDisplay');
    const detections = document.getElementById('detections');

    // Event listeners
    imageInput.addEventListener('change', handleImageUpload);
    sendBtn.addEventListener('click', sendMessage);
    backBtn.addEventListener('click', goBack);
    uploadBackBtn.addEventListener('click', goToHome);
    startBtn.addEventListener('click', goToUpload);
    logoBtn.addEventListener('click', goToHome);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !sendBtn.disabled) {
            sendMessage();
        }
    });

    messageInput.addEventListener('input', function() {
        sendBtn.disabled = !messageInput.value.trim() || !currentImageData;
    });

    function showLoading() {
        loading.style.display = 'flex';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    function goToHome() {
        heroSection.style.display = 'flex';
        uploadSection.style.display = 'none';
        chatSection.style.display = 'none';
        currentImageData = null;
        messages.innerHTML = '';
        detections.innerHTML = '';
        imageDisplay.style.display = 'none';
        sendBtn.disabled = true;
        messageInput.value = '';
    }

    function goToUpload() {
        heroSection.style.display = 'none';
        uploadSection.style.display = 'flex';
        chatSection.style.display = 'none';
    }

    function switchToChat() {
        heroSection.style.display = 'none';
        uploadSection.style.display = 'none';
        chatSection.style.display = 'block';
    }

    function goBack() {
        goToUpload();
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a valid image file (PNG, JPG, JPEG, GIF, or BMP)');
            return;
        }

        if (file.size > 16 * 1024 * 1024) {
            alert('File size too large. Please upload an image smaller than 16MB');
            return;
        }

        showLoading();

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            
            if (data.success) {
                currentImageData = data.image_data;
                switchToChat();
                displayImage(data.image_data);
                displayDetections(data.detections);
                addBotMessage(`Analysis complete. I've detected ${data.detections.length} objects in your image. What would you like to know?`);
                sendBtn.disabled = false;
            } else {
                alert(`Upload failed: ${data.error}`);
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Upload error:', error);
            alert(`An error occurred while uploading the image: ${error.message}`);
        });
    }

    function displayImage(imageData) {
        imageDisplay.src = `data:image/jpeg;base64,${imageData}`;
        imageDisplay.style.display = 'block';
    }

    function displayDetections(detectionsList) {
        if (detectionsList.length === 0) {
            detections.innerHTML = '<div style="color: #888888; font-size: 14px;">No objects detected</div>';
            return;
        }

        let html = '';
        detectionsList.forEach(detection => {
            const confidence = (detection.confidence * 100).toFixed(1);
            html += `
                <div class="detection-item">
                    <span class="detection-name">${detection.class}</span>
                    <span class="detection-confidence">${confidence}%</span>
                </div>
            `;
        });
        
        detections.innerHTML = html;
    }

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? 'U' : 'AI'}</div>
            <div class="message-content">${content}</div>
        `;
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function addBotMessage(content) {
        addMessage(content, false);
    }

    function addUserMessage(content) {
        addMessage(content, true);
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message || !currentImageData) return;

        addUserMessage(message);
        messageInput.value = '';
        sendBtn.disabled = true;
        
        showLoading();

        fetch('/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: message,
                image_data: currentImageData
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            sendBtn.disabled = false;
            
            if (data.error) {
                addBotMessage(`Error: ${data.error}`);
            } else {
                addBotMessage(data.response || 'No response received');
            }
        })
        .catch(error => {
            hideLoading();
            sendBtn.disabled = false;
            console.error('Query error:', error);
            addBotMessage(`Network error: ${error.message}`);
        });
    }
});
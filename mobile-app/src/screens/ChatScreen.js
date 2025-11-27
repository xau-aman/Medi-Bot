import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import ApiService from '../services/ApiService';
import ThemeToggle from '../components/ThemeToggle';

const ChatScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm MediBot AI, your professional medical imaging assistant.

CAPABILITIES:
• Medical image analysis (X-rays, MRI, CT, ultrasound)
• Anatomical structure identification
• Pathological finding assessment
• Clinical consultation support
• Medical education assistance

SPECIALTIES:
• Radiology • Cardiology • Neurology
• Orthopedics • Pulmonology • Pathology

MEDICAL DISCLAIMER:
• Educational and clinical support purposes only
• All findings require professional medical verification
• Not intended for diagnostic or treatment decisions
• Always consult qualified healthcare professionals`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    setIsUploading(true);
    try {
      const result = await ApiService.uploadImage(imageUri);
      if (result.success) {
        setImageData(result.image_data);
        
        const analysisMessage = {
          id: Date.now(),
          type: 'bot',
          content: result.ai_analysis,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, analysisMessage]);
      } else {
        Alert.alert('Upload Error', result.error || 'Failed to upload image');
      }
    } catch (error) {
      Alert.alert(
        'Upload Error', 
        'Failed to upload image. Please check your internet connection and try again.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await ApiService.sendQuery(inputValue, imageData);
      setIsTyping(false);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: result.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      Alert.alert(
        'Connection Error',
        'Failed to send message. Please check your internet connection.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Connection error. Please check your internet connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatMessage = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('IMAGING MODALITY:') || trimmedLine.includes('ANATOMICAL STRUCTURES:') || 
          trimmedLine.includes('RADIOLOGICAL FINDINGS:') || trimmedLine.includes('CLINICAL IMPRESSION:') || 
          trimmedLine.includes('MEDICAL DISCLAIMER:') || trimmedLine.includes('CAPABILITIES:') || 
          trimmedLine.includes('SPECIALTIES:')) {
        return (
          <Text key={index} style={[styles.messageHeader, { color: colors.accent }]}>
            {trimmedLine}
          </Text>
        );
      }
      
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        return (
          <Text key={index} style={[styles.messageBullet, { color: colors.text }]}>
            {trimmedLine}
          </Text>
        );
      }
      
      if (trimmedLine) {
        return (
          <Text key={index} style={[styles.messageText, { color: colors.text }]}>
            {trimmedLine}
          </Text>
        );
      }
      
      return null;
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>MediBot AI</Text>
        <ThemeToggle />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessage : styles.botMessage
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: message.type === 'user' ? colors.accent : colors.surface,
                  borderColor: colors.border,
                }
              ]}
            >
              {message.type === 'bot' ? (
                <View>{formatMessage(message.content)}</View>
              ) : (
                <Text style={[styles.messageText, { color: message.type === 'user' ? '#ffffff' : colors.text }]}>
                  {message.content}
                </Text>
              )}
            </View>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <View style={[styles.messageBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={[styles.messageText, { color: colors.textSecondary, marginLeft: 8 }]}>
                AI is thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Image Upload Section */}
      <View style={[styles.uploadSection, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.accent }]}
          onPress={pickImage}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading...' : '📁 Upload Image'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.accentDark }]}
          onPress={takePhoto}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>📷 Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Input Section */}
      <View style={[styles.inputSection, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Ask medical questions..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: inputValue.trim() ? colors.accent : colors.surface }]}
          onPress={sendMessage}
          disabled={!inputValue.trim() || isTyping}
        >
          <Text style={[styles.sendButtonText, { color: inputValue.trim() ? '#ffffff' : colors.textMuted }]}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  messageBullet: {
    fontSize: 13,
    paddingLeft: 12,
    marginBottom: 2,
  },
  uploadSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  uploadButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ChatScreen;
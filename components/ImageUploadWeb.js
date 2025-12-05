import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

/**
 * Web-compatible image upload component
 * Uses HTML file input for web, falls back to expo-image-picker for native
 */
export default function ImageUploadWeb({ onImageSelected, children, style }) {
  const fileInputRef = useRef(null);

  const handleWebUpload = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Create a file reader to convert to base64
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target.result;

      // Create an image asset object similar to expo-image-picker format
      const imageAsset = {
        uri: base64,
        base64: base64.split(',')[1], // Remove data:image/...;base64, prefix
        width: null, // Will be determined by image
        height: null,
        type: file.type,
        mimeType: file.type,
        fileName: file.name,
        fileSize: file.size,
      };

      onImageSelected(imageAsset);
    };

    reader.onerror = () => {
      alert('Failed to read image file');
    };

    reader.readAsDataURL(file);
  };

  if (Platform.OS !== 'web') {
    // On native, just render children as-is (they should handle their own picker)
    return children;
  }

  return (
    <View style={style}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <TouchableOpacity onPress={handleWebUpload} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    </View>
  );
}

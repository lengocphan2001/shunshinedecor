import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';

interface ImageEditorModalProps {
  visible: boolean;
  imageUri: string;
  onSave: (editedImagePath: string) => void;
  onCancel: () => void;
}

// This is now a helper function instead of a modal component
// Since crop/rotate opens native picker directly
export async function editImageWithCropRotate(
  imageUri: string,
  onSave: (path: string) => void
): Promise<void> {
  try {
    const editedImage = await ImagePicker.openCropper({
      path: imageUri,
      mediaType: 'photo',
      width: 1920,
      height: 1080,
      cropperToolbarTitle: 'Edit Image',
      cropperChooseText: 'Save',
      cropperCancelText: 'Cancel',
      cropperRotateButtonsHidden: false,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.9,
    });

    if (editedImage && editedImage.path) {
      onSave(editedImage.path);
    }
  } catch (error: any) {
    if (error.code !== 'E_PICKER_CANCELLED') {
      console.error('Error cropping image:', error);
      Alert.alert('Error', 'Failed to crop/rotate image');
    }
  }
}

// Keep component for backward compatibility, but it's now unused
export default function ImageEditorModal({
  visible,
  imageUri,
  onSave,
  onCancel,
}: ImageEditorModalProps) {
  // This component is now deprecated - use editImageWithCropRotate directly
  return null;
}
import { useState, useCallback } from 'react';
import { WatermarkSettings } from '../types';

export function useWatermarkSettings() {
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    type: 'text',
    text: '水印文字',
    fontSize: 24,
    color: '#000000',
    opacity: 80,
    position: 'bottom-right',
    rotation: 0,
    image: null,
    imageSize: 20,
    offsetX: 0,
    offsetY: 0,
    tileSpacing: 100,
  });
  
  const [showWatermark, setShowWatermark] = useState(true);
  
  const updateWatermarkSetting = useCallback((key: keyof WatermarkSettings, value: any) => {
    setWatermarkSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const toggleWatermarkVisibility = useCallback(() => {
    setShowWatermark(prev => !prev);
  }, []);
  
  const setWatermarkImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setWatermarkSettings(prev => ({
      ...prev,
      image: url,
      type: 'image', // Automatically switch to image type when an image is set
    }));
  }, []);
  
  const removeWatermarkImage = useCallback(() => {
    setWatermarkSettings(prev => ({
      ...prev,
      image: null,
    }));
  }, []);
  
  return {
    watermarkSettings,
    showWatermark,
    updateWatermarkSetting,
    toggleWatermarkVisibility,
    setWatermarkImage,
    removeWatermarkImage
  };
}
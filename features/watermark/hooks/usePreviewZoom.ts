import { useState, useCallback, useEffect } from 'react';
import { WatermarkSettings } from '../types';

interface UsePreviewZoomProps {
  watermarkSettings: WatermarkSettings;
  updateWatermarkSetting: (key: keyof WatermarkSettings, value: any) => void;
  watermarkOverlayRef: React.RefObject<HTMLDivElement>;
  currentImageIsGif: boolean;
}

export function usePreviewZoom({
  watermarkSettings,
  updateWatermarkSetting,
  watermarkOverlayRef,
  currentImageIsGif
}: UsePreviewZoomProps) {
  const [previewScale, setPreviewScale] = useState(1);

  // 不再处理水印大小调整，这部分功能已由useWatermarkDrag实现
  // 只保留预览图像的缩放功能

  const zoomInPreview = useCallback(() => {
    setPreviewScale(prev => Math.min(prev + 0.1, 3));
  }, []);

  const zoomOutPreview = useCallback(() => {
    setPreviewScale(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const resetPreviewZoom = useCallback(() => {
    setPreviewScale(1);
  }, []);

  return {
    previewScale,
    zoomInPreview,
    zoomOutPreview,
    resetPreviewZoom
  };
}
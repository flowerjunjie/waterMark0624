import { ImageFile, WatermarkSettings } from '../types';
import GIF from 'gif.js';

interface WatermarkDimensions {
  wmWidth: number;
  wmHeight: number;
}

interface WatermarkPosition {
  x: number;
  y: number;
}

export const getWatermarkDimensions = (
  ctx: CanvasRenderingContext2D, 
  imgWidth: number, 
  imgHeight: number,
  watermarkSettings: WatermarkSettings
): WatermarkDimensions => {
  let wmWidth = 0;
  let wmHeight = 0;

  if (watermarkSettings.type === 'text' || (watermarkSettings.type === 'tiled' && watermarkSettings.text)) {
    ctx.font = `${watermarkSettings.fontSize}px Arial`;
    const metrics = ctx.measureText(watermarkSettings.text);
    wmWidth = metrics.width;
    wmHeight = watermarkSettings.fontSize;
  } else if ((watermarkSettings.type === 'image' || watermarkSettings.type === 'tiled') && watermarkSettings.image) {
    // Calculate watermark dimensions based on image size setting
    wmWidth = imgWidth * (watermarkSettings.imageSize / 100);
    // Use a reasonable aspect ratio for overlay display (1:1 as fallback)
    wmHeight = wmWidth; // Default to square
    
    // Try to get actual image dimensions if available
    const existingImg = document.querySelector(`img[src="${watermarkSettings.image}"]`) as HTMLImageElement;
    if (existingImg && existingImg.naturalWidth && existingImg.naturalHeight) {
      wmHeight = (wmWidth / existingImg.naturalWidth) * existingImg.naturalHeight;
    }
  }
  
  return { wmWidth, wmHeight };
};
import { WatermarkSettings } from '../types';

interface WatermarkPosition {
  x: number;
  y: number;
}

/**
 * 获取水印的位置，确保与预览中显示的位置一致
 */
export const getWatermarkPosition = (
  imgWidth: number, 
  imgHeight: number, 
  wmWidth: number, 
  wmHeight: number,
  watermarkSettings: WatermarkSettings
): WatermarkPosition => {
  // 设置安全边距，水平方向7%，垂直方向2%
  const safeEdgeX = 0.07; // 7%的左右安全边缘
  const safeEdgeY = 0.02; // 2%的上下安全边缘
  const edgeMinX = safeEdgeX;
  const edgeMaxX = 1 - safeEdgeX;
  const edgeMinY = safeEdgeY;
  const edgeMaxY = 1 - safeEdgeY;
  
  // 使用相对位置百分比，与预览和应用时保持一致
  let xPos = 0.5; // 默认在中间
  let yPos = 0.5;
  
  if (watermarkSettings.position === 'custom') {
    // 自定义位置 - 使用offsetX和offsetY作为百分比，但确保在安全范围内
    // 水平方向使用5%安全边距，垂直方向使用2%安全边距
    xPos = Math.max(edgeMinX, Math.min(edgeMaxX, watermarkSettings.offsetX / 100));
    yPos = Math.max(edgeMinY, Math.min(edgeMaxY, watermarkSettings.offsetY / 100));
  } else {
    // 预设位置 - 使用安全边距，与预览保持一致
    switch (watermarkSettings.position) {
      case 'top-left':
        xPos = edgeMinX;
        yPos = edgeMinY;
        break;
      case 'top-right':
        xPos = edgeMaxX;
        yPos = edgeMinY;
        break;
      case 'bottom-left':
        xPos = edgeMinX;
        yPos = edgeMaxY;
        break;
      case 'bottom-right':
        xPos = edgeMaxX;
        yPos = edgeMaxY;
        break;
      case 'center':
      default:
        xPos = 0.5;
        yPos = 0.5;
        break;
    }
  }
  
  // 转换为实际像素坐标
  const x = imgWidth * xPos;
  const y = imgHeight * yPos;
  
  return { x, y };
};
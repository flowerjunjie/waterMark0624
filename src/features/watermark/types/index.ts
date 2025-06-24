export interface ImageFile {
  id: string;
  file: File;
  url: string;
  isGif: boolean;
  watermarked: string | null;
  path: string; // For folder structure
  width?: number; // 图片宽度
  height?: number; // 图片高度
}

export interface WatermarkSettings {
  type: 'text' | 'image' | 'tiled';
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom';
  rotation: number;
  image: string | null; // URL of the watermark image
  imageSize: number; // Percentage of image width
  offsetX: number;
  offsetY: number;
  tileSpacing: number;
}

export type WatermarkPosition = WatermarkSettings['position'];

export interface DragPosition {
  x: number;
  y: number;
}
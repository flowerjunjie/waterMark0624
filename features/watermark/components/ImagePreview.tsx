import React from 'react';
import { ImageFile } from '../types';

interface ImagePreviewProps {
  image: ImageFile;
  previewImageRef: React.RefObject<HTMLImageElement>;
  watermarkOverlayRef: React.RefObject<HTMLDivElement>;
  previewScale: number;
}

// 扩展CSS属性类型以支持自定义CSS变量
interface CustomCSSProperties extends React.CSSProperties {
  '--x-pos'?: string;
  '--y-pos'?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  previewImageRef,
  watermarkOverlayRef,
  previewScale
}) => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="relative" style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center' }}>
        <img
          src={image.url}
          alt={image.file.name}
          ref={previewImageRef}
          className="max-w-full max-h-[70vh] object-contain"
          style={{ 
            display: 'block'
          }}
        />
        
        {/* 水印叠加层 */}
        <div 
          ref={watermarkOverlayRef} 
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            // 使用CSS变量进行定位
            '--x-pos': '50%',
            '--y-pos': '50%',
            pointerEvents: 'none' // 确保不干扰图片交互
          } as CustomCSSProperties}
        >
          {/* 水印控制点样式 */}
          <style>
            {`
              #watermark-content {
                position: absolute;
                top: var(--y-pos);
                left: var(--x-pos);
                transform-origin: center center;
                /* transform已在useWatermarkOverlay.ts中动态设置，避免样式冲突 */
                pointer-events: auto;
                z-index: 10;
                user-select: none;
                will-change: transform; /* 提升渲染性能 */
                backface-visibility: hidden; /* 防止3D变换引起的闪烁 */
                /* 允许水印覆盖几乎整个图片 */
                max-width: 86%; /* 减小最大宽度，确保不会超出安全区域 */
                max-height: 96%;
                overflow: visible;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box !important;
                /* 关键：确保拖动时不会改变大小 */
                transform: translate(-50%, -50%) !important;
              }
              
              #watermark-content div {
                white-space: nowrap;
                text-align: center;
                font-family: Arial, sans-serif;
                transform-origin: center center;
                text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white, 2px 2px 3px rgba(0,0,0,0.3);
                /* 防止形变 */
                transform: none !important;
              }
              
              #watermark-content img {
                display: block;
                transform-origin: center center;
                /* 防止形变 */
                transform: none !important;
                /* 增强图片边缘位置防变形保护 */
                object-fit: contain;
                object-position: center;
                transform-style: preserve-3d;
                perspective: 1000px;
                /* 确保图片在移动时保持尺寸 */
                box-sizing: border-box !important;
                transition: none !important; /* 禁用任何可能的过渡效果 */
                resize: none !important; /* 禁止用户调整大小 */
                /* 关键：禁止任何可能的大小变化 */
                max-width: none;
                max-height: none;
                min-width: 0;
                min-height: 0;
              }
              
              /* 确保拖动时不会改变尺寸的关键CSS */
              .is-dragging #watermark-content img {
                /* 添加更严格的尺寸锁定，确保拖动时不会改变尺寸 */
                transform: none !important;
                transition: none !important;
              }
              
              /* 添加额外的保护，确保拖动时整个水印元素不会改变 */
              .is-dragging #watermark-content {
                /* 锁定变换，只允许位置变化 */
                transform: translate(-50%, -50%) !important;
                /* 锁定尺寸 */
                width: var(--watermark-width, auto) !important;
                height: var(--watermark-height, auto) !important;
              }
              
              .watermark-control-point {
                position: absolute;
                top: var(--y-pos);
                left: var(--x-pos);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: rgba(0, 120, 255, 0.7);
                border: 2px solid white;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
                cursor: move;
                z-index: 100;
                transform: translate(-50%, -50%);
                pointer-events: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                will-change: transform; /* 提升渲染性能 */
              }
              
              /* 水印控制点提示 */
              .watermark-control-point::before {
                content: "";
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s;
                pointer-events: none;
              }
              
              .watermark-control-point:hover::before {
                content: "拖动: 移动位置 | 滚轮: 调整大小";
                opacity: 1;
              }
              
              /* 分离拖动和滚轮功能的视觉反馈 */
              .watermark-control-point[data-mode="drag"] {
                cursor: move;
                background-color: rgba(0, 120, 255, 0.7);
              }
              
              .watermark-control-point[data-mode="resize"] {
                cursor: nesw-resize;
                background-color: rgba(0, 200, 0, 0.7);
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
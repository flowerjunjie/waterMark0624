import React, { useEffect, useRef, useCallback } from 'react';
import { WatermarkSettings, ImageFile } from '../types';

interface UseWatermarkOverlayProps {
  watermarkOverlayRef: React.RefObject<HTMLDivElement>;
  previewImageRef: React.RefObject<HTMLImageElement>;
  currentImage: ImageFile | null;
  watermarkSettings: WatermarkSettings;
  showWatermark: boolean;
  previewScale: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useWatermarkOverlay = ({
  watermarkOverlayRef,
  previewImageRef,
  currentImage,
  watermarkSettings,
  showWatermark,
  previewScale,
  canvasRef
}: UseWatermarkOverlayProps) => {
  const {
    type,
    text,
    fontSize,
    color,
    opacity,
    rotation,
    image,
    position,
    offsetX,
    offsetY,
    imageSize
  } = watermarkSettings;

  // 这个ID用于标记水印元素，防止重复
  const watermarkElementId = 'watermark-content';
  // 跟踪当前是否有水印元素
  const hasWatermarkElement = useRef(false);
  // 使用ref来跟踪上一次的设置，避免不必要的更新
  const prevSettingsRef = useRef<string>('');
  // 跟踪拖动控制点是否已创建
  const hasControlPoint = useRef(false);

  // 使用useCallback包装更新函数，避免重复创建
  const updateWatermarkOverlay = useCallback(() => {
    if (!watermarkOverlayRef.current || !currentImage || !showWatermark) {
      return;
    }

    const overlay = watermarkOverlayRef.current;
    
    // 创建当前设置的快照，用于比较是否需要更新
    const currentSettings = JSON.stringify({
      type,
      text: type === 'text' ? text : '',
      fontSize,
      color,
      opacity,
      rotation,
      image: type === 'image' ? !!image : false,
      position,
      offsetX,
      offsetY,
      imageSize,
      previewScale
    });
    
    // 如果设置没有变化，避免重复更新
    if (currentSettings === prevSettingsRef.current && hasWatermarkElement.current) {
      // 只更新位置，不重新创建元素
      updatePosition();
      return;
    }
    
    // 更新设置引用
    prevSettingsRef.current = currentSettings;
    
    // 移除现有的水印内容元素，仅保留定位点
    let existingWatermark = overlay.querySelector(`#${watermarkElementId}`);
    if (existingWatermark) {
      existingWatermark.remove();
      hasWatermarkElement.current = false;
    }

    // 创建新的水印内容元素
    const watermarkElement = document.createElement('div');
    watermarkElement.id = watermarkElementId;
    watermarkElement.className = 'absolute';
    watermarkElement.style.pointerEvents = 'auto'; // 确保可以接收鼠标事件
    
    // 设置公共样式
    watermarkElement.style.opacity = opacity.toString();
    watermarkElement.style.transformOrigin = 'center center';
    
    // 只有非平铺模式才在外层应用旋转
    if (type !== 'tiled') {
      // 确保水印元素始终居中于定位点
      watermarkElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    } else {
      watermarkElement.style.transform = `translate(-50%, -50%)`;
    }

    // 获取预览图片的实际尺寸，用于计算水印大小
    const previewImg = previewImageRef.current;
    const previewWidth = previewImg ? previewImg.width : 300;
    const previewHeight = previewImg ? previewImg.height : 200;

    console.log('预览图片尺寸:', {
      宽度: previewWidth,
      高度: previewHeight,
      比例: previewScale
    });

    // 根据水印类型创建内容
    if (type === 'text') {
      // 文字水印
      if (text.trim()) {
        const textElement = document.createElement('div');
        textElement.style.color = color;
        textElement.style.fontFamily = 'Arial, sans-serif';
        
        // 使用与下载时完全相同的字体大小计算逻辑
        const scaledFontSize = fontSize;
        textElement.style.fontSize = `${scaledFontSize}px`;
        
        textElement.style.fontWeight = 'normal';
        textElement.style.whiteSpace = 'nowrap';
        textElement.textContent = text;

        console.log('预览文字水印:', {
          文本: text.substring(0, 10) + (text.length > 10 ? '...' : ''),
          字体大小: scaledFontSize
        });

        // 简单轮廓效果
        textElement.style.textShadow = `
          -1px -1px 0 white,
          1px -1px 0 white,
          -1px 1px 0 white,
          1px 1px 0 white,
          2px 2px 3px rgba(0,0,0,0.3)
        `;

        watermarkElement.appendChild(textElement);
      }
    }
    else if (type === 'image') {
      // 图片水印
      if (image) {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.style.pointerEvents = 'none'; // 防止图片干扰拖动
        
        // 使用与下载时完全相同的图片尺寸计算逻辑
        // 图片水印大小应该是预览图片尺寸的百分比
        const maxWidth = previewWidth * (imageSize / 100);
        const maxHeight = previewHeight * (imageSize / 100);
        
        // 设置图片加载完成后的处理
        imgElement.onload = () => {
          const imgWidth = imgElement.naturalWidth;
          const imgHeight = imgElement.naturalHeight;
          
          // 保持图片比例
          const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
          const width = imgWidth * scale;
          const height = imgHeight * scale;
          
          console.log('预览图片水印尺寸:', {
            原始宽度: imgWidth,
            原始高度: imgHeight,
            缩放后宽度: width,
            缩放后高度: height,
            最大宽度: maxWidth,
            最大高度: maxHeight,
            缩放比例: scale
          });
          
          imgElement.style.width = `${width}px`;
          imgElement.style.height = `${height}px`;
        };
        
        // 如果图片已经加载完成，直接设置尺寸
        if (imgElement.complete && imgElement.naturalWidth) {
          const imgWidth = imgElement.naturalWidth;
          const imgHeight = imgElement.naturalHeight;
          
          // 保持图片比例
          const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
          const width = imgWidth * scale;
          const height = imgHeight * scale;
          
          console.log('预览图片水印尺寸(已加载):', {
            原始宽度: imgWidth,
            原始高度: imgHeight,
            缩放后宽度: width,
            缩放后高度: height,
            最大宽度: maxWidth,
            最大高度: maxHeight,
            缩放比例: scale
          });
          
          imgElement.style.width = `${width}px`;
          imgElement.style.height = `${height}px`;
        }
        
        watermarkElement.appendChild(imgElement);
      }
    }
    else if (type === 'tiled') {
      // 平铺水印
      if (text.trim() || image) {
        // 使用canvas预渲染平铺水印，避免创建过多DOM元素
        const tiledCanvas = createTiledWatermarkCanvas();
        if (tiledCanvas) {
          tiledCanvas.style.maxWidth = '100%';
          tiledCanvas.style.maxHeight = '100%';
          tiledCanvas.style.transform = `rotate(${rotation}deg)`;
          watermarkElement.appendChild(tiledCanvas);
        }
      }
    }

    // 只有存在有效内容时才添加元素
    if (watermarkElement.childNodes.length > 0) {
      // 添加水印元素到叠加层
      overlay.appendChild(watermarkElement);
      hasWatermarkElement.current = true;
      
      // 添加拖动控制点（如果不存在）
      if (!hasControlPoint.current) {
        addDragControlPoint(overlay);
      }
      
      // 在添加到DOM后，记录水印元素的初始尺寸
      setTimeout(() => {
        if (watermarkElement) {
          const rect = watermarkElement.getBoundingClientRect();
          // 保存尺寸为CSS变量，便于CSS选择器使用
          overlay.style.setProperty('--watermark-width', `${rect.width}px`);
          overlay.style.setProperty('--watermark-height', `${rect.height}px`);
          
          // 记录子元素的尺寸
          const watermarkChildren = watermarkElement.children;
          for (let i = 0; i < watermarkChildren.length; i++) {
            const child = watermarkChildren[i] as HTMLElement;
            if (child.tagName === 'IMG') {
              const computedStyle = window.getComputedStyle(child);
              child.dataset.originalWidth = computedStyle.width;
              child.dataset.originalHeight = computedStyle.height;
              // 强制应用这些尺寸
              child.style.width = computedStyle.width;
              child.style.height = computedStyle.height;
            }
          }
        }
      }, 10);
      
      // 更新位置
      updatePosition();
    }
  }, [
    type,
    text,
    fontSize,
    color,
    opacity,
    rotation,
    image,
    position,
    offsetX,
    offsetY,
    imageSize,
    previewScale,
    currentImage,
    showWatermark,
    previewImageRef
  ]);

  // 添加拖动控制点
  const addDragControlPoint = (overlay: HTMLDivElement) => {
    // 检查是否已存在控制点
    if (overlay.querySelector('.watermark-control-point')) {
      return;
    }
    
    // 创建控制点元素
    const controlPoint = document.createElement('div');
    controlPoint.className = 'absolute watermark-control-point';
    controlPoint.style.width = '30px';
    controlPoint.style.height = '30px';
    controlPoint.style.borderRadius = '50%';
    controlPoint.style.backgroundColor = 'rgba(0, 120, 255, 0.7)';
    controlPoint.style.border = '2px solid white';
    controlPoint.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.5)';
    controlPoint.style.cursor = 'move';
    controlPoint.style.zIndex = '100';
    controlPoint.style.top = '0';
    controlPoint.style.left = '0';
    controlPoint.style.transform = 'translate(-50%, -50%)';
    controlPoint.style.pointerEvents = 'auto'; // 确保可以接收鼠标事件
    controlPoint.style.display = 'flex';
    controlPoint.style.alignItems = 'center';
    controlPoint.style.justifyContent = 'center';
    
    // 添加图标
    const icon = document.createElement('div');
    icon.innerHTML = '✋'; // 使用手形图标表示拖动
    icon.style.color = 'white';
    icon.style.fontSize = '16px';
    icon.style.fontWeight = 'bold';
    icon.style.userSelect = 'none';
    controlPoint.appendChild(icon);
    
    // 添加操作提示属性
    controlPoint.setAttribute('title', '拖动: 移动位置 | 滚轮: 调整大小');
    
    // 添加提示工具提示
    const tooltip = document.createElement('div');
    tooltip.className = 'watermark-tooltip';
    tooltip.textContent = '拖动移动水印，滚轮调整大小';
    tooltip.style.position = 'absolute';
    tooltip.style.top = '30px';
    tooltip.style.left = '0';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease';
    tooltip.style.zIndex = '101';
    tooltip.style.transform = 'translateX(-50%)';
    controlPoint.appendChild(tooltip);
    
    // 显示/隐藏提示
    controlPoint.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });
    
    controlPoint.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    
    // 添加到叠加层
    overlay.appendChild(controlPoint);
    hasControlPoint.current = true;
  };

  // 创建平铺水印的canvas
  const createTiledWatermarkCanvas = () => {
    if (!canvasRef.current) return null;
    
    // 创建一个临时canvas用于预渲染平铺水印
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 300;
    tempCanvas.height = 300;
    
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;
    
    // 清除画布
    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.globalAlpha = opacity;
    
    // 根据类型绘制水印
    if (type === 'tiled' && text.trim()) {
      // 文字平铺
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 计算平铺间距
      const tileSize = fontSize * 4;
      
      // 绘制3x3网格的文字
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const x = tempCanvas.width / 3 * (i + 0.5);
          const y = tempCanvas.height / 3 * (j + 0.5);
          
          ctx.fillText(text, x, y);
          
          // 添加轮廓效果
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          ctx.strokeText(text, x, y);
        }
      }
    } 
    else if (type === 'tiled' && image) {
      // 图片平铺
      const img = new Image();
      img.src = image;
      
      if (img.complete) {
        // 计算平铺大小
        const tileSize = Math.min(tempCanvas.width, tempCanvas.height) / 4;
        const scale = Math.min(tileSize / img.width, tileSize / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        
        // 绘制3x3网格的图片
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const x = tempCanvas.width / 3 * i + (tempCanvas.width / 3 - width) / 2;
            const y = tempCanvas.height / 3 * j + (tempCanvas.height / 3 - height) / 2;
            
            ctx.drawImage(img, x, y, width, height);
          }
        }
      }
    }
    
    return tempCanvas;
  };

  // 更新水印位置
  const updatePosition = useCallback(() => {
    if (!watermarkOverlayRef.current || !currentImage || !previewImageRef.current) return;
    
    const overlay = watermarkOverlayRef.current;
    const watermarkElement = overlay.querySelector(`#${watermarkElementId}`);
    if (!watermarkElement) return;
    
    // 保存水印内容元素的原始尺寸
    const saveOriginalSizes = () => {
      if (watermarkElement instanceof HTMLElement) {
        const childElements = watermarkElement.children;
        for (let i = 0; i < childElements.length; i++) {
          const child = childElements[i] as HTMLElement;
          if (child.tagName === 'IMG') {
            // 保存图片元素的原始尺寸
            if (!child.dataset.originalWidth) {
              child.dataset.originalWidth = child.style.width || child.offsetWidth + 'px';
              child.dataset.originalHeight = child.style.height || child.offsetHeight + 'px';
            }
          }
        }
      }
    };
    
    // 先保存原始尺寸
    saveOriginalSizes();
    
    // 根据position属性或offsetX/Y设置位置
    let xPos = 0.5; // 默认在中间
    let yPos = 0.5;
    
    // 设置安全边距，左右7%，上下2%
    const safeEdgeX = 0.07; // 7%的左右安全边缘
    const safeEdgeY = 0.02; // 2%的上下安全边缘
    const edgeMinX = safeEdgeX;
    const edgeMaxX = 1 - safeEdgeX;
    const edgeMinY = safeEdgeY;
    const edgeMaxY = 1 - safeEdgeY;
    
    // 如果是自定义位置，使用偏移量但确保在安全区域内
    if (position === 'custom') {
      // 使用offsetX和offsetY作为百分比值，但限制在安全范围内
      // 水平方向使用5%安全边距，垂直方向使用2%安全边距
      xPos = Math.max(edgeMinX, Math.min(edgeMaxX, offsetX / 100));
      yPos = Math.max(edgeMinY, Math.min(edgeMaxY, offsetY / 100));
    } else {
      // 根据预定义位置设置 - 使用安全边距
      switch (position) {
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
    
    // 使用CSS变量设置水印位置
    overlay.style.setProperty('--x-pos', `${xPos * 100}%`);
    overlay.style.setProperty('--y-pos', `${yPos * 100}%`);
    
    // 确保水印元素的transform属性正确设置，避免形变
    if (watermarkElement instanceof HTMLElement) {
      // 设置变换原点为中心点
      watermarkElement.style.transformOrigin = 'center center';
      
      // 保存水印元素的当前尺寸，如果之前没有保存过
      if (!overlay.style.getPropertyValue('--watermark-width')) {
        const rect = watermarkElement.getBoundingClientRect();
        overlay.style.setProperty('--watermark-width', `${rect.width}px`);
        overlay.style.setProperty('--watermark-height', `${rect.height}px`);
      }
      
      if (type !== 'tiled') {
        // 先平移再旋转，避免形变
        watermarkElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      } else {
        watermarkElement.style.transform = `translate(-50%, -50%)`;
      }

      // 确保水印内容的样式正确
      const childElements = watermarkElement.children;
      for (let i = 0; i < childElements.length; i++) {
        const child = childElements[i] as HTMLElement;
        if (child && child.tagName !== 'CANVAS') { // 平铺画布不需要额外处理
          child.style.transformOrigin = 'center center';
          // 消除任何潜在的变形
          child.style.transform = 'none';
          
          // 对图片特殊处理
          if (child.tagName === 'IMG') {
            // 如果没有保存原始尺寸，则保存当前尺寸
            if (!child.dataset.originalWidth || !child.dataset.originalHeight) {
              const computedStyle = window.getComputedStyle(child);
              child.dataset.originalWidth = computedStyle.width;
              child.dataset.originalHeight = computedStyle.height;
            }
            
            // 强制使用保存的原始尺寸
            child.style.width = child.dataset.originalWidth || '';
            child.style.height = child.dataset.originalHeight || '';
            
            // 禁用任何可能导致尺寸变化的样式
            child.style.maxWidth = 'none';
            child.style.maxHeight = 'none';
            child.style.minWidth = child.dataset.originalWidth || '';
            child.style.minHeight = child.dataset.originalHeight || '';
            
            // 添加防止变形的额外样式
            child.style.transformStyle = 'preserve-3d';
            child.style.backfaceVisibility = 'hidden';
            child.style.transition = 'none';
            child.style.resize = 'none';
          }
        }
      }
    }
    
    // 更新控制点位置
    const controlPoint = overlay.querySelector('.watermark-control-point') as HTMLElement;
    if (controlPoint) {
      controlPoint.style.transform = 'translate(-50%, -50%)';
    }
    
    console.log('预览水印位置更新:', {
      位置类型: position,
      x百分比: xPos,
      y百分比: yPos,
      x像素: Math.round(xPos * previewImageRef.current.width),
      y像素: Math.round(yPos * previewImageRef.current.height),
      文本: type === 'text' ? text.substring(0, 10) + (text.length > 10 ? '...' : '') : '图片水印',
      旋转: rotation
    });
  }, [watermarkOverlayRef, previewImageRef, currentImage, position, offsetX, offsetY, type, text, rotation]);

  // 使用useEffect，但减少依赖项，避免过度渲染
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateWatermarkOverlay();
    }, 10); // 添加短暂延迟，避免连续多次更新
    
    return () => clearTimeout(timeoutId);
  }, [updateWatermarkOverlay]);

  // 返回更新函数，以便外部手动调用
  return { updateWatermarkOverlay };
};
import { useState, useRef, useEffect } from 'react';
import { DragPosition, WatermarkSettings, ImageFile } from '../types';

interface UseWatermarkDragProps {
  watermarkSettings: WatermarkSettings;
  updateWatermarkSetting: (key: keyof WatermarkSettings, value: any) => void;
  currentImage: ImageFile | null;
  watermarkOverlayRef: React.RefObject<HTMLDivElement>;
  previewImageRef: React.RefObject<HTMLImageElement>;
}

export function useWatermarkDrag({
  watermarkSettings,
  updateWatermarkSetting,
  currentImage,
  watermarkOverlayRef,
  previewImageRef
}: UseWatermarkDragProps) {
  const isDraggingRef = useRef(false);
  const dragStart = useRef<DragPosition>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const currentPosition = useRef({ x: watermarkSettings.offsetX, y: watermarkSettings.offsetY });

  // 当水印设置变化时更新当前位置引用
  useEffect(() => {
    currentPosition.current = { x: watermarkSettings.offsetX, y: watermarkSettings.offsetY };
  }, [watermarkSettings.offsetX, watermarkSettings.offsetY]);

  useEffect(() => {
    const overlay = watermarkOverlayRef.current;
    const previewImg = previewImageRef.current;

    if (!overlay || !previewImg || !currentImage || currentImage.isGif) return; // Disable dragging for GIFs

    // 找到水印控制点（如果存在）
    const findControlPoint = () => {
      const controlPoint = overlay.querySelector('.absolute');
      return controlPoint as HTMLElement | null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // 确保我们点击的是控制点或水印内容
      const target = e.target as HTMLElement;
      const controlPoint = findControlPoint();
      const isControlPoint = controlPoint && (controlPoint === target || controlPoint.contains(target));
      const isWatermarkContent = target.id === 'watermark-content' || 
                               (target.parentElement && target.parentElement.id === 'watermark-content');

      // 只有点击控制点或水印内容时才开始拖动
      if (!isControlPoint && !isWatermarkContent) return;

      if (watermarkSettings.position !== 'custom') {
        updateWatermarkSetting('position', 'custom');
      }
      
      isDraggingRef.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      
      // 直接应用样式，避免React渲染延迟
      if (isControlPoint) {
        controlPoint.style.cursor = 'grabbing';
        // 添加视觉反馈，表明正在进行拖动操作
        controlPoint.style.backgroundColor = 'rgba(255, 165, 0, 0.8)'; // 拖动时变为橙色
        // 设置模式属性
        controlPoint.setAttribute('data-mode', 'drag');
      }
      
      // 添加拖动标记类，用于CSS锁定尺寸
      if (overlay) {
        overlay.classList.add('is-dragging');
      }
      
      e.stopPropagation(); // Prevent image dragging
      e.preventDefault();
      
      console.log('开始拖动水印');
    };

    const updatePosition = () => {
      if (!isDraggingRef.current || !overlay || !previewImg) return;
      
      // 直接更新状态，不触发React重新渲染
      updateWatermarkSetting('offsetX', currentPosition.current.x);
      updateWatermarkSetting('offsetY', currentPosition.current.y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !previewImg) return;

      // 找到控制点元素
      const controlPoint = overlay.querySelector('.watermark-control-point') as HTMLElement | null;
      
      // 获取水印元素
      const watermarkElement = overlay.querySelector('#watermark-content') as HTMLElement | null;
      
      // 标记拖动状态，用于CSS选择器
      overlay.classList.add('is-dragging');

      // 计算图片在页面中的实际尺寸和位置
      const previewRect = previewImg.getBoundingClientRect();
      
      // 计算拖动的距离（像素）
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      // 将像素距离转换为百分比（相对于图片尺寸）
      const deltaXPercent = (dx / previewRect.width) * 100;
      const deltaYPercent = (dy / previewRect.height) * 100;
      
      // 更新当前位置（百分比）
      let newX = currentPosition.current.x + deltaXPercent;
      let newY = currentPosition.current.y + deltaYPercent;
      
      // 设置安全边距，水平方向7%，垂直方向2%
      const safeMarginX = 7; // 水平方向7%安全边距
      const safeMarginY = 2; // 垂直方向2%安全边距
      newX = Math.max(safeMarginX, Math.min(100 - safeMarginX, newX));
      newY = Math.max(safeMarginY, Math.min(100 - safeMarginY, newY));
      
      // 更新当前位置引用
      currentPosition.current = { x: newX, y: newY };
      
      // 在极端边缘位置额外防止变形
      const isNearEdge = newX <= safeMarginX + 2 || newX >= 100 - safeMarginX - 2 || 
                        newY <= safeMarginY + 2 || newY >= 100 - safeMarginY - 2;
      
      // 更新CSS变量，实现实时拖动效果
      overlay.style.setProperty('--x-pos', `${newX}%`);
      overlay.style.setProperty('--y-pos', `${newY}%`);
      
      // 彻底锁定水印大小，防止拖动过程中改变大小
      if (watermarkElement) {
        // 确保水印元素的变换仅包含位置变化，不影响大小
        if (watermarkSettings.type !== 'tiled') {
          watermarkElement.style.transform = `translate(-50%, -50%) rotate(${watermarkSettings.rotation}deg)`;
        } else {
          watermarkElement.style.transform = `translate(-50%, -50%)`;
        }
        
        // 锁定子元素尺寸
        const watermarkChildren = watermarkElement.children;
        for (let i = 0; i < watermarkChildren.length; i++) {
          const child = watermarkChildren[i] as HTMLElement;
          
          // 对图片元素特殊处理
          if (child.tagName === 'IMG') {
            // 如果没有保存原始尺寸，则保存
            if (!child.dataset.originalWidth || !child.dataset.originalHeight) {
              const computedStyle = window.getComputedStyle(child);
              const width = computedStyle.width;
              const height = computedStyle.height;
              
              child.dataset.originalWidth = width;
              child.dataset.originalHeight = height;
            }
            
            // 强制应用原始尺寸
            child.style.width = child.dataset.originalWidth || '';
            child.style.height = child.dataset.originalHeight || '';
            
            // 添加额外的样式保护，防止尺寸变化
            child.style.maxWidth = child.dataset.originalWidth || '';
            child.style.maxHeight = child.dataset.originalHeight || '';
            child.style.minWidth = child.dataset.originalWidth || '';
            child.style.minHeight = child.dataset.originalHeight || '';
            
            // 禁用可能的变换
            child.style.transform = 'none';
            child.style.transition = 'none';
          }
          
          // 文字水印也需要锁定尺寸
          if (child.tagName === 'DIV' && watermarkSettings.type === 'text') {
            child.style.fontSize = `${watermarkSettings.fontSize}px`;
            child.style.transform = 'none';
          }
        }
      }
      
      // 更新拖动起始点
      dragStart.current = { x: e.clientX, y: e.clientY };
      
      // 使用requestAnimationFrame延迟更新React状态
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updatePosition);

      // 检测是否接近边缘，为边缘位置添加额外视觉反馈
      if (isNearEdge && controlPoint) {
        controlPoint.style.backgroundColor = 'rgba(255, 100, 100, 0.8)'; // 靠近边缘时变红
        controlPoint.setAttribute('title', '警告：接近边缘位置');
      } else if (controlPoint) {
        controlPoint.style.backgroundColor = 'rgba(0, 120, 255, 0.7)'; // 恢复正常颜色
        controlPoint.setAttribute('title', '拖动: 移动位置 | 滚轮: 调整大小');
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      
      // 恢复控制点的光标样式和颜色
      const controlPoint = findControlPoint();
      if (controlPoint) {
        controlPoint.style.cursor = 'move';
        controlPoint.style.backgroundColor = 'rgba(0, 120, 255, 0.7)'; // 恢复正常颜色
        // 重置模式属性
        controlPoint.setAttribute('data-mode', '');
      }
      
      // 移除拖动标记类
      if (overlay) {
        overlay.classList.remove('is-dragging');
      }
      
      // 确保最终位置被保存到React状态
      updateWatermarkSetting('offsetX', currentPosition.current.x);
      updateWatermarkSetting('offsetY', currentPosition.current.y);
      
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      
      console.log('结束拖动，最终位置:', currentPosition.current);
    };

    // 设置控制点的初始光标样式
    const controlPoint = findControlPoint();
    if (controlPoint) {
      controlPoint.style.cursor = 'move';
    }

    // 添加事件监听器到控制点和水印内容
    overlay.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      overlay.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [
    updateWatermarkSetting, 
    watermarkSettings.position,
    currentImage,
    watermarkOverlayRef,
    previewImageRef
  ]);

  // 处理鼠标滚轮事件，用于调整水印大小
  useEffect(() => {
    const overlay = watermarkOverlayRef.current;
    if (!overlay || !currentImage) return;
    
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const watermarkContent = overlay.querySelector('#watermark-content') as HTMLElement;
      const controlPoint = overlay.querySelector('.watermark-control-point') as HTMLElement;
      
      // 确保鼠标在水印元素或控制点上
      const isOnWatermark = 
        (watermarkContent && (watermarkContent === target || watermarkContent.contains(target))) ||
        (controlPoint && (controlPoint === target || controlPoint.contains(target)));
      
      if (!isOnWatermark) return;
      
      // 阻止页面滚动
      e.preventDefault();
      e.stopPropagation();
      
      // 确保不在拖动过程中调整大小
      if (isDraggingRef.current) return;
      
      // 设置控制点为调整大小模式
      if (controlPoint) {
        controlPoint.setAttribute('data-mode', 'resize');
        controlPoint.style.cursor = 'nesw-resize';
      }
      
      // 滚轮方向：向上为正(delta < 0)，向下为负(delta > 0)
      const delta = e.deltaY < 0 ? 1 : -1;
      
      // 根据水印类型调整大小
      if (watermarkSettings.type === 'text') {
        // 调整文字大小，步长为1，范围8-72
        const newSize = Math.max(8, Math.min(72, watermarkSettings.fontSize + delta));
        updateWatermarkSetting('fontSize', newSize);
        
        // 为控制点添加视觉反馈
        if (controlPoint) {
          controlPoint.style.backgroundColor = 'rgba(0, 255, 0, 0.7)'; // 调整大小时变绿
          // 显示当前大小的提示
          const tooltip = controlPoint.querySelector('.watermark-tooltip') as HTMLElement;
          if (tooltip) {
            tooltip.textContent = `文字大小: ${newSize}px`;
            tooltip.style.opacity = '1';
          }
          
          // 延迟恢复原状
          setTimeout(() => {
            if (controlPoint) {
              controlPoint.style.backgroundColor = 'rgba(0, 120, 255, 0.7)'; // 恢复原色
              controlPoint.setAttribute('data-mode', '');
              controlPoint.style.cursor = 'move';
              
              // 恢复提示
              if (tooltip) {
                tooltip.textContent = '拖动移动水印，滚轮调整大小';
                tooltip.style.opacity = '0';
              }
            }
          }, 500);
        }
        
        console.log(`调整文字大小: ${newSize}px`);
      } 
      else if (watermarkSettings.type === 'image') {
        // 调整图片大小，步长为1，范围5-100
        const newSize = Math.max(5, Math.min(100, watermarkSettings.imageSize + delta));
        updateWatermarkSetting('imageSize', newSize);
        
        // 为控制点添加视觉反馈
        if (controlPoint) {
          controlPoint.style.backgroundColor = 'rgba(0, 255, 0, 0.7)'; // 调整大小时变绿
          
          // 显示当前大小的提示
          const tooltip = controlPoint.querySelector('.watermark-tooltip') as HTMLElement;
          if (tooltip) {
            tooltip.textContent = `图片大小: ${newSize}%`;
            tooltip.style.opacity = '1';
          }
          
          // 延迟恢复原状
          setTimeout(() => {
            if (controlPoint) {
              controlPoint.style.backgroundColor = 'rgba(0, 120, 255, 0.7)'; // 恢复原色
              controlPoint.setAttribute('data-mode', '');
              controlPoint.style.cursor = 'move';
              
              // 恢复提示
              if (tooltip) {
                tooltip.textContent = '拖动移动水印，滚轮调整大小';
                tooltip.style.opacity = '0';
              }
            }
          }, 500);
        }
        
        console.log(`调整图片大小: ${newSize}%`);
      }
    };
    
    overlay.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      overlay.removeEventListener('wheel', handleWheel);
    };
  }, [
    currentImage,
    updateWatermarkSetting,
    watermarkSettings.type,
    watermarkSettings.fontSize,
    watermarkSettings.imageSize,
    watermarkOverlayRef
  ]);

  return {
    isDragging: isDraggingRef.current,
    dragStart
  };
}
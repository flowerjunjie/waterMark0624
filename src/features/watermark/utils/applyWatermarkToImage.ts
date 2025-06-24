import { ImageFile, WatermarkSettings } from '../types';
import { getWatermarkDimensions } from './applyWatermark';
import { getWatermarkPosition } from './watermarkPosition';
import { drawTiledTextWatermark, drawTiledImageWatermark, createTiledWatermark } from './tiledWatermark';

/**
 * 将水印应用到图片上
 * @param image 图片元素
 * @param watermarkSettings 水印设置
 * @param canvas Canvas元素
 * @returns 应用水印后的图片URL
 */
export const applyWatermarkToImage = (
  image: HTMLImageElement,
  watermarkSettings: WatermarkSettings,
  canvas: HTMLCanvasElement
): Promise<string> | string => {
  const { type, text, fontSize, color, opacity, position, rotation, image: watermarkImage, offsetX, offsetY, imageSize } = watermarkSettings;
  
  console.log('应用水印到图片 - 类型:', type, '位置:', position, '旋转:', rotation, '偏移:', { offsetX, offsetY });
  
  // 设置canvas尺寸
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('无法获取canvas上下文');
    return Promise.resolve('');
  }
  
  // 绘制原始图片
  ctx.drawImage(image, 0, 0);
  
  // 如果是平铺水印，使用专门的函数处理
  if (type === 'tiled') {
    console.log('应用平铺水印');
    createTiledWatermark(ctx, watermarkSettings, canvas.width, canvas.height);
    return Promise.resolve(canvas.toDataURL('image/png'));
  }
  
  // 设置水印透明度
  ctx.globalAlpha = opacity;
  
  // 计算水印位置 - 使用与预览完全相同的逻辑
  let xPos = 0.5; // 默认在中间
  let yPos = 0.5;
  
  if (position === 'custom') {
    // 自定义位置 - 使用offsetX和offsetY作为百分比
    xPos = offsetX / 100;
    yPos = offsetY / 100;
    
    // 添加安全边距，防止水印靠近边缘导致形变
    const safeMarginX = 0.07; // 7%的水平安全边距
    const safeMarginY = 0.02; // 2%的垂直安全边距
    xPos = Math.max(safeMarginX, Math.min(1 - safeMarginX, xPos));
    yPos = Math.max(safeMarginY, Math.min(1 - safeMarginY, yPos));
  } else {
    // 预设位置 - 使用与预览相同的安全边距
    const safeMarginX = 0.07; // 7%的水平安全边距
    const safeMarginY = 0.02; // 2%的垂直安全边距
    
    switch (position) {
      case 'top-left':
        xPos = safeMarginX;
        yPos = safeMarginY;
        break;
      case 'top-right':
        xPos = 1 - safeMarginX;
        yPos = safeMarginY;
        break;
      case 'bottom-left':
        xPos = safeMarginX;
        yPos = 1 - safeMarginY;
        break;
      case 'bottom-right':
        xPos = 1 - safeMarginX;
        yPos = 1 - safeMarginY;
        break;
      case 'center':
      default:
        xPos = 0.5;
        yPos = 0.5;
        break;
    }
  }
  
  // 转换为实际像素坐标
  const x = Math.round(canvas.width * xPos);
  const y = Math.round(canvas.height * yPos);
  
  console.log('计算水印位置:', { 
    position, 
    xPos, 
    yPos, 
    x, 
    y,
    画布宽度: canvas.width,
    画布高度: canvas.height,
    文本: type === 'text' ? text.substring(0, 10) + (text.length > 10 ? '...' : '') : '图片水印',
    旋转: rotation
  });
  
  // 保存当前状态
  ctx.save();
  
  // 移动到水印位置
  ctx.translate(x, y);
  
  // 应用旋转
  ctx.rotate((rotation * Math.PI) / 180);
  
  // 根据水印类型绘制水印
  if (type === 'text' && text) {
    // 文字水印
    console.log('应用文字水印:', text.substring(0, 10) + (text.length > 10 ? '...' : ''), '字体大小:', fontSize);
    
    // 使用与预览完全相同的字体大小
    const scaledFontSize = fontSize;
    
    ctx.font = `${scaledFontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 测量文本宽度，用于调试
    const textMetrics = ctx.measureText(text);
    console.log('文字水印尺寸:', {
      文本宽度: textMetrics.width,
      字体大小: scaledFontSize
    });
    
    // 绘制文字
    ctx.fillText(text, 0, 0);
    
    // 添加简单的文字轮廓效果
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeText(text, 0, 0);
  } 
  else if (type === 'image' && watermarkImage) {
    // 图片水印
    console.log('应用图片水印, 图片尺寸百分比:', imageSize);
    
    try {
      // 创建新的图片元素
      const img = new Image();
      img.src = watermarkImage;
      
      // 检查图片是否已加载
      if (img.complete) {
        // 计算水印图片的大小 - 使用imageSize属性确定相对大小
        // imageSize是相对于原图的百分比
        const maxWidth = canvas.width * (imageSize / 100);
        const maxHeight = canvas.height * (imageSize / 100);
        
        // 保持图片比例
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        
        console.log('图片水印尺寸:', {
          原始宽度: img.width,
          原始高度: img.height,
          缩放后宽度: width,
          缩放后高度: height,
          最大宽度: maxWidth,
          最大高度: maxHeight,
          缩放比例: scale
        });
        
        // 居中绘制，确保在各个位置都正确显示
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
      } else {
        // 如果图片未加载完成，等待加载
        console.log('等待水印图片加载...');
        return new Promise<string>((resolve, reject) => {
          img.onload = () => {
            try {
              // 计算水印图片的大小 - 使用imageSize属性确定相对大小
              const maxWidth = canvas.width * (imageSize / 100);
              const maxHeight = canvas.height * (imageSize / 100);
              
              // 保持图片比例
              const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
              const width = img.width * scale;
              const height = img.height * scale;
              
              console.log('图片水印尺寸(异步加载):', {
                原始宽度: img.width,
                原始高度: img.height,
                缩放后宽度: width,
                缩放后高度: height,
                最大宽度: maxWidth,
                最大高度: maxHeight,
                缩放比例: scale
              });
              
              // 居中绘制，确保在各个位置都正确显示
              ctx.drawImage(img, -width / 2, -height / 2, width, height);
              
              // 恢复状态
              ctx.restore();
              
              // 返回带水印的图片URL
              resolve(canvas.toDataURL('image/png'));
            } catch (error) {
              console.error('应用水印时出错:', error);
              reject('应用水印时出错');
            }
          };
          
          img.onerror = () => {
            console.error('水印图片加载失败');
            reject('水印图片加载失败');
          };
        }) as any;
      }
    } catch (error) {
      console.error('应用图片水印时出错:', error);
    }
  }
  
  // 恢复状态
  ctx.restore();
  
  console.log('水印应用完成');
  
  // 返回带水印的图片URL
  return Promise.resolve(canvas.toDataURL('image/png'));
};
import { WatermarkSettings } from '../types';

/**
 * 创建平铺水印
 * @param ctx Canvas上下文
 * @param watermarkSettings 水印设置
 * @param width 画布宽度
 * @param height 画布高度
 */
export const createTiledWatermark = (
  ctx: CanvasRenderingContext2D,
  watermarkSettings: WatermarkSettings,
  width: number,
  height: number
) => {
  const { text, fontSize, color, opacity, rotation, image, tileSpacing } = watermarkSettings;
  
  console.log('创建平铺水印:', {
    类型: text ? '文字' : '图片',
    文字: text ? text.substring(0, 10) + (text.length > 10 ? '...' : '') : '',
    角度: rotation,
    间距: tileSpacing
  });

  // 绘制原始图片 - 确保我们保留了背景图片
  // 注意：我们不清除画布，因为调用方已经绘制了原始图片
  
  // 设置全局透明度
  ctx.globalAlpha = opacity;
  
  // 计算网格大小 - 确保与预览中的设置一致
  const gridSize = tileSpacing || 100;
  
  // 计算行列数
  const cols = Math.ceil(width / gridSize) + 1;
  const rows = Math.ceil(height / gridSize) + 1;
  
  // 水印元素的宽高
  let elementWidth = 0;
  let elementHeight = 0;
  
  // 预渲染单个水印元素到临时画布
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    console.error('无法创建临时画布上下文');
    return;
  }
  
  // 设置临时画布大小
  tempCanvas.width = gridSize;
  tempCanvas.height = gridSize;
  
  // 在临时画布上绘制单个水印
  if (text) {
    // 文字水印
    tempCtx.font = `${fontSize}px Arial`; // 与预览使用相同的字体大小
    tempCtx.fillStyle = color;
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    
    // 测量文本宽度
    const textMetrics = tempCtx.measureText(text);
    elementWidth = textMetrics.width;
    elementHeight = fontSize;
    
    // 将原点移动到画布中心
    tempCtx.translate(gridSize / 2, gridSize / 2);
    
    // 应用旋转 - 注意这里只在临时画布上应用一次旋转
    tempCtx.rotate((rotation * Math.PI) / 180);
    
    // 绘制文本
    tempCtx.fillText(text, 0, 0);
    
    // 添加轮廓效果，与预览时相同
    tempCtx.strokeStyle = 'white';
    tempCtx.lineWidth = 1;
    tempCtx.strokeText(text, 0, 0);
    
    // 重置变换
    tempCtx.setTransform(1, 0, 0, 1, 0, 0);
  } else if (image) {
    // 图片水印
    const img = new Image();
    img.src = image;
    
    // 确保图片已加载
    if (img.complete) {
      // 计算图片大小，确保适合网格
      const scale = Math.min(gridSize * 0.8 / img.width, gridSize * 0.8 / img.height);
      elementWidth = img.width * scale;
      elementHeight = img.height * scale;
      
      // 将原点移动到画布中心
      tempCtx.translate(gridSize / 2, gridSize / 2);
      
      // 应用旋转 - 注意这里只在临时画布上应用一次旋转
      tempCtx.rotate((rotation * Math.PI) / 180);
      
      // 绘制图片
      tempCtx.drawImage(
        img,
        -elementWidth / 2,
        -elementHeight / 2,
        elementWidth,
        elementHeight
      );
      
      // 重置变换
      tempCtx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      console.error('图片尚未加载完成，无法创建平铺水印');
      return;
    }
  } else {
    console.error('没有有效的水印内容');
    return;
  }
  
  // 使用临时画布作为图案填充整个画布
  const pattern = ctx.createPattern(tempCanvas, 'repeat');
  if (!pattern) {
    console.error('无法创建图案');
    return;
  }
  
  // 保存当前状态，这样只影响水印绘制
  ctx.save();
  
  // 使用图案填充
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  
  // 恢复状态
  ctx.restore();
  
  console.log('平铺水印创建完成');
};

/**
 * 获取平铺水印的尺寸
 * @param ctx Canvas上下文
 * @param watermarkSettings 水印设置
 */
export const getTiledWatermarkDimensions = (
  ctx: CanvasRenderingContext2D,
  watermarkSettings: WatermarkSettings
) => {
  const { text, fontSize, tileSpacing } = watermarkSettings;
  
  // 默认使用间距作为尺寸
  const size = tileSpacing || 100;
  
  // 如果是文字，计算文字宽度
  if (text) {
    ctx.font = `${fontSize}px Arial`;
    const textMetrics = ctx.measureText(text);
    return {
      width: Math.max(textMetrics.width * 1.2, size),
      height: Math.max(fontSize * 1.5, size)
    };
  }
  
  // 如果是图片，使用默认尺寸
  return { width: size, height: size };
};

/**
 * 绘制平铺文字水印
 * 注意：此函数假设上下文状态已经被设置(字体、颜色、对齐、基线等)
 * 并且画布已经被平移到正确的起始点和应用旋转变换
 */
export function drawTiledTextWatermark(
  ctx: CanvasRenderingContext2D,
  watermarkSettings: WatermarkSettings,
  canvasWidth: number,
  canvasHeight: number
): void {
  // 平铺的间距
  const spacing = watermarkSettings.tileSpacing;
  
  // 计算对角线长度以确保覆盖整个画布
  const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
  const numTilesX = Math.ceil(diagonal / spacing) + 2; // 添加额外的瓦片以确保覆盖
  const numTilesY = Math.ceil(diagonal / spacing) + 2;
  
  console.log(`- 绘制平铺文字: 网格=${numTilesX}x${numTilesY}, 间距=${spacing}px`);
  
  // 绘制网格中的每个文本实例
  for (let i = -numTilesX / 2; i < numTilesX / 2; i++) {
    for (let j = -numTilesY / 2; j < numTilesY / 2; j++) {
      // 计算每个水印的位置
      const x = i * spacing;
      const y = j * spacing;
      
      // 绘制水印文本
      ctx.fillText(watermarkSettings.text, x, y);
    }
  }
}

/**
 * 绘制平铺图片水印
 * 注意：此函数假设上下文已经被平移到正确的起始点和应用旋转变换
 */
export function drawTiledImageWatermark(
  ctx: CanvasRenderingContext2D,
  watermarkImg: HTMLImageElement,
  watermarkSettings: WatermarkSettings,
  wmWidth: number,
  wmHeight: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // 平铺的间距
  const spacing = watermarkSettings.tileSpacing;
  
  // 计算对角线长度以确保覆盖整个画布
  const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
  const numTilesX = Math.ceil(diagonal / spacing) + 2;
  const numTilesY = Math.ceil(diagonal / spacing) + 2;
  
  console.log(`- 绘制平铺图片: 网格=${numTilesX}x${numTilesY}, 间距=${spacing}px`);
  
  // 绘制网格中的每个图片实例
  for (let i = -numTilesX / 2; i < numTilesX / 2; i++) {
    for (let j = -numTilesY / 2; j < numTilesY / 2; j++) {
      // 计算每个水印的位置
      const x = i * spacing;
      const y = j * spacing;
      
      // 绘制水印图片，以(x,y)为中心
      ctx.drawImage(
        watermarkImg, 
        x - wmWidth / 2, 
        y - wmHeight / 2, 
        wmWidth, 
        wmHeight
      );
    }
  }
}
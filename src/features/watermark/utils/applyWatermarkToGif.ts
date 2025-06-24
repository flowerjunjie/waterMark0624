import GIF from 'gif.js';
import { ImageFile, WatermarkSettings } from '../types';
import { getWatermarkDimensions } from './applyWatermark';
import { getWatermarkPosition } from './watermarkPosition';

export const applyWatermarkToGif = async (
  image: ImageFile, 
  watermarkSettings: WatermarkSettings,
  showWatermark: boolean
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image.url;

    await new Promise(resolve => img.onload = resolve);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }

    canvas.width = img.width;
    canvas.height = img.height;

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
      transparent: '#000000' // Set a transparent color if needed, or remove
    });

    // For GIF, we'll apply watermark to the first frame as a demonstration
    // In a real implementation, you'd need to decode all frames
    // This is a simplification for the purpose of the exercise.

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    if (showWatermark) {
      ctx.save();
      ctx.globalAlpha = watermarkSettings.opacity / 100;

      const { wmWidth, wmHeight } = getWatermarkDimensions(ctx, canvas.width, canvas.height, watermarkSettings);
      const { x, y } = getWatermarkPosition(canvas.width, canvas.height, wmWidth, wmHeight, watermarkSettings);

      ctx.translate(x + wmWidth / 2, y + wmHeight / 2);
      ctx.rotate((watermarkSettings.rotation * Math.PI) / 180);

      if (watermarkSettings.type === 'text' || (watermarkSettings.type === 'tiled' && watermarkSettings.text)) {
        ctx.font = `${watermarkSettings.fontSize}px Arial`;
        ctx.fillStyle = watermarkSettings.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (watermarkSettings.type === 'tiled') {
          drawTiledTextWatermark(ctx, watermarkSettings, canvas.width, canvas.height);
        } else {
          ctx.fillText(watermarkSettings.text, 0, 0);
        }
      } else if ((watermarkSettings.type === 'image' || watermarkSettings.type === 'tiled') && watermarkSettings.image) {
        const watermarkImg = new Image();
        watermarkImg.crossOrigin = 'anonymous';
        watermarkImg.src = watermarkSettings.image;
        await new Promise(resolve => watermarkImg.onload = resolve);

        if (watermarkSettings.type === 'tiled') {
          drawTiledImageWatermark(ctx, watermarkImg, watermarkSettings, wmWidth, wmHeight, canvas.width, canvas.height);
        } else {
          ctx.drawImage(watermarkImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
        }
      }
      ctx.restore();
    }

    gif.addFrame(canvas, { delay: 100 }); // Add the watermarked frame
    
    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });

    gif.render();
  });
};

function drawTiledTextWatermark(
  ctx: CanvasRenderingContext2D,
  watermarkSettings: WatermarkSettings,
  canvasWidth: number,
  canvasHeight: number
) {
  const spacing = watermarkSettings.tileSpacing;
  
  // Calculate the diagonal length of the canvas to ensure coverage
  const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
  const numTilesX = Math.ceil(diagonal / spacing) + 2; // Add buffer for rotation
  const numTilesY = Math.ceil(diagonal / spacing) + 2;
  
  for (let i = -numTilesX / 2; i < numTilesX / 2; i++) {
    for (let j = -numTilesY / 2; j < numTilesY / 2; j++) {
      ctx.fillText(watermarkSettings.text, i * spacing, j * spacing);
    }
  }
}

function drawTiledImageWatermark(
  ctx: CanvasRenderingContext2D,
  watermarkImg: HTMLImageElement,
  watermarkSettings: WatermarkSettings,
  wmWidth: number,
  wmHeight: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const spacing = watermarkSettings.tileSpacing;
  
  // Calculate the diagonal length of the canvas to ensure coverage
  const diagonal = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight);
  const numTilesX = Math.ceil(diagonal / spacing) + 2;
  const numTilesY = Math.ceil(diagonal / spacing) + 2;
  
  for (let i = -numTilesX / 2; i < numTilesX / 2; i++) {
    for (let j = -numTilesY / 2; j < numTilesY / 2; j++) {
      ctx.drawImage(
        watermarkImg, 
        i * spacing - wmWidth / 2, 
        j * spacing - wmHeight / 2, 
        wmWidth, 
        wmHeight
      );
    }
  }
}
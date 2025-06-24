import { useCallback, useRef } from 'react';
import { ImageFile, WatermarkSettings } from '../types';
import { applyWatermarkToGif } from '../utils/applyWatermarkToGif';
import { applyWatermarkToImage } from '../utils/applyWatermarkToImage';

interface UseWatermarkApplierProps {
  images: ImageFile[];
  updateImageWatermark: (imageId: string, watermarkedUrl: string) => void;
  watermarkSettings: WatermarkSettings;
  showWatermark: boolean;
}

export function useWatermarkApplier({
  images,
  updateImageWatermark,
  watermarkSettings,
  showWatermark
}: UseWatermarkApplierProps) {
  // 创建一个canvas引用，用于水印处理
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const applyWatermark = useCallback(async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) {
      console.error(`无法找到ID为 ${imageId} 的图片`);
      return;
    }

    console.log(`处理图片: ${image.file.name} (ID: ${image.id})`);

    if (image.isGif) {
      // 对于GIF文件，直接使用原始文件，不尝试添加水印
      console.log(`- 图片是GIF格式，跳过水印处理，保持原始文件`);
      // 不更新watermarked属性，保持为null，这样下载时会使用原始文件
      return;
    }

    // 确保canvas引用可用
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas引用在applyWatermark中不可用');
      return;
    }

    try {
      console.log(`- 开始给图片添加水印`);
      
      // 如果不显示水印，直接返回原始图片
      if (!showWatermark) {
        console.log(`- 水印可见性关闭，跳过水印应用`);
        updateImageWatermark(imageId, image.url);
        return;
      }
      
      // 创建一个临时图片元素来加载图片
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = image.url;
      
      // 等待图片加载完成
      await new Promise((resolve, reject) => {
        if (img.complete) {
          resolve(null);
        } else {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`加载图片失败: ${image.file.name}`));
        }
      });
      
      // 应用水印
      console.log('调用applyWatermarkToImage，传递参数:', {
        imgWidth: img.width,
        imgHeight: img.height,
        canvasAvailable: !!canvas,
        watermarkType: watermarkSettings.type,
        watermarkPosition: watermarkSettings.position
      });
      
      const watermarkedUrl = await Promise.resolve(applyWatermarkToImage(img, watermarkSettings, canvas));
      
      // 确保watermarkedUrl是字符串
      if (typeof watermarkedUrl === 'string') {
        // 记录返回的水印URL的一部分，帮助调试
        const urlPreview = watermarkedUrl.substring(0, 50) + '...';
        console.log(`- 水印应用成功，返回的URL: ${urlPreview}`);
        
        updateImageWatermark(imageId, watermarkedUrl);
      } else {
        console.error('水印应用失败，返回的URL不是字符串类型');
        updateImageWatermark(imageId, image.url); // 使用原始图片作为备选
      }
      console.log(`- 已更新图片 ${image.file.name} 的水印`);
    } catch (error) {
      console.error(`给图片 ${image.file.name} 添加水印失败:`, error);
      // Fallback to original image if watermarking fails
      updateImageWatermark(imageId, image.url);
    }
  }, [images, watermarkSettings, showWatermark, updateImageWatermark]);

  const processAllImages = useCallback(async (onProgress?: (progress: number) => void) => {
    if (images.length === 0) return;
    
    // 确保canvas引用可用
    const canvas = canvasRef.current;
    if (!canvas && !images.every(img => img.isGif)) {
      console.error('Canvas引用对处理图片不可用');
      alert('处理图片时出错：Canvas不可用');
      return;
    }

    console.log(`开始批量处理 ${images.length} 张图片...`);
    
    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        console.log(`处理第 ${i+1}/${images.length} 张图片: ${image.file.name} (ID: ${image.id})`);
        
        // 对于GIF文件，跳过水印处理
        if (image.isGif) {
          console.log(`- 图片是GIF格式，跳过水印处理，保持原始文件`);
          // 更新进度但不处理图片
          if (onProgress) {
            const progressValue = ((i + 1) / images.length) * 100;
            onProgress(progressValue);
          }
          continue;
        }
        
        try {
          await applyWatermark(image.id);
          console.log(`- 处理完成`);
        } catch (error) {
          console.error(`- 处理图片 ${image.file.name} 时出错:`, error);
          // 继续处理下一张图片
        }
        
        if (onProgress) {
          const progressValue = ((i + 1) / images.length) * 100;
          console.log(`- 进度: ${progressValue.toFixed(2)}%`);
          onProgress(progressValue);
        }
      }
      
      console.log('所有图片处理完成');
    } catch (error) {
      console.error('批量处理过程中出错:', error);
      alert('批量处理过程中出错');
    }
  }, [images, applyWatermark]);

  return {
    applyWatermark,
    processAllImages,
    canvasRef
  };
}
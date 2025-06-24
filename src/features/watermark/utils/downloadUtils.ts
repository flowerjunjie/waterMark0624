import JSZip from 'jszip';
import { ImageFile } from '../types';

export const downloadSingleImage = async (currentImage: ImageFile | null) => {
  if (!currentImage) return;
  
  console.log('下载单个图片:', currentImage.file.name);
  console.log('- 原始URL:', currentImage.url);
  console.log('- 水印URL:', currentImage.watermarked);
  console.log('- 是否为GIF:', currentImage.isGif);
  
  try {
    let url;
    let blob;
    
    // 对于GIF文件，始终使用原始文件，不使用水印版本
    if (currentImage.isGif) {
      blob = currentImage.file;
      url = URL.createObjectURL(blob);
      console.log('- 图片是GIF格式，使用原始文件下载');
    } else if (currentImage.watermarked) {
      // 如果有水印版本且不是GIF，使用水印版本
      url = currentImage.watermarked;
      console.log('- 使用水印版本下载');
    } else {
      // 如果没有水印版本，直接使用原始文件创建URL
      blob = currentImage.file;
      url = URL.createObjectURL(blob);
      console.log('- 使用原始文件下载');
    }
    
    const link = document.createElement('a');
    // 对于GIF文件，不添加watermarked_前缀
    link.download = currentImage.isGif ? currentImage.file.name : `watermarked_${currentImage.file.name}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 如果使用了createObjectURL，需要释放
    if (currentImage.isGif || !currentImage.watermarked) {
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('下载图片失败:', error);
    alert('下载图片失败');
  }
};

// 将Data URL转换为Blob对象
const dataURLToBlob = async (dataURL: string): Promise<Blob> => {
  try {
    const response = await fetch(dataURL);
    return await response.blob();
  } catch (error) {
    console.error('Data URL转换为Blob失败:', error);
    throw error;
  }
};

// 从文件路径中提取目录结构
const extractDirectoryPath = (filePath: string): string => {
  // 处理Windows和Web文件系统的路径分隔符
  const normalizedPath = filePath.replace(/\\/g, '/');
  const lastSlashIndex = normalizedPath.lastIndexOf('/');
  
  if (lastSlashIndex === -1) {
    // 没有目录结构，直接在根目录
    return '';
  }
  
  // 返回目录路径（包括末尾的斜杠）
  return normalizedPath.substring(0, lastSlashIndex + 1);
};

export const downloadAllImages = async (
  images: ImageFile[], 
  setProgress: (progress: number) => void,
  setProgressText: (text: string) => void
) => {
  const zip = new JSZip();
  
  if (images.length === 0) {
    alert('没有图片可下载');
    return;
  }

  console.log('开始批量下载图片，总数:', images.length);
  setProgressText('正在打包下载...');
  setProgress(0);

  // 收集所有目录路径，用于创建目录结构
  const directories = new Set<string>();
  
  // 首先遍历所有图片，收集目录结构
  images.forEach(image => {
    const dirPath = extractDirectoryPath(image.path);
    if (dirPath) {
      directories.add(dirPath);
    }
  });
  
  // 创建目录结构
  directories.forEach(dir => {
    zip.folder(dir);
    console.log(`创建目录: ${dir}`);
  });

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      console.log(`处理第${i+1}张图片:`, image.file.name);
      console.log('- 图片ID:', image.id);
      console.log('- 图片URL:', image.url);
      console.log('- 水印URL:', image.watermarked);
      console.log('- 图片路径:', image.path);
      console.log('- 是否为GIF:', image.isGif);
      
      let blob;
      // 对于GIF文件，保持原始文件名；对于其他文件，添加watermarked_前缀
      const fileName = image.isGif ? image.file.name : `watermarked_${image.file.name}`;
      
      // 完整的文件路径，包括目录结构
      const filePath = extractDirectoryPath(image.path) + fileName;
      console.log('- 保存路径:', filePath);
      
      // 对于GIF文件，始终使用原始文件
      if (image.isGif) {
        console.log('- 图片是GIF格式，使用原始文件');
        blob = image.file;
      } else if (image.watermarked) {
        try {
          // 使用水印版本，确保我们获取到的是正确的图像
          blob = await dataURLToBlob(image.watermarked);
          console.log(`- 成功获取水印版本，大小: ${blob.size} 字节`);
        } catch (error) {
          console.error('获取水印版本失败，使用原始文件:', error);
          blob = image.file;
        }
      } else {
        // 如果没有水印版本，直接使用原始文件
        console.log('- 使用原始文件');
        blob = image.file;
      }
      
      // 记录添加到zip的文件信息
      console.log(`- 添加到zip: ${filePath}, 大小: ${blob.size} 字节, 类型: ${blob.type}`);
      zip.file(filePath, blob);
    } catch (error) {
      console.error(`添加 ${image.file.name} 到zip失败:`, error);
    }
    setProgress(((i + 1) / images.length) * 100);
  }

  try {
    console.log('生成zip文件...');
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });
    console.log(`Zip文件生成完成，大小: ${content.size} 字节`);
    
    const link = document.createElement('a');
    link.download = 'watermarked_images.zip';
    const url = URL.createObjectURL(content);
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log('已释放对象URL');
    }, 1000);
  } catch (error) {
    console.error('生成zip文件失败:', error);
    alert('打包下载失败。');
  }
};
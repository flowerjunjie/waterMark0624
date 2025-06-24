import { useState, useCallback } from 'react';
import { ImageFile } from '../types';

export function useImageManager() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  const addImages = useCallback((files: File[]) => {
    const newImageFiles: ImageFile[] = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        isGif: file.type === 'image/gif',
        watermarked: null,
        path: (file as any).webkitRelativePath || file.name,
      }));

    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImageFiles];
      if (!selectedImageId && updatedImages.length > 0) {
        setSelectedImageId(updatedImages[0].id);
      }
      return updatedImages;
    });
  }, [selectedImageId]);
  
  const removeImage = useCallback((id: string) => {
    setImages(prevImages => {
      const updatedImages = prevImages.filter(img => img.id !== id);
      if (selectedImageId === id) {
        setSelectedImageId(updatedImages.length > 0 ? updatedImages[0].id : null);
      }
      return updatedImages;
    });
  }, [selectedImageId]);
  
  const clearAllImages = useCallback(() => {
    if (confirm('确定要清空所有图片吗？')) {
      setImages([]);
      setSelectedImageId(null);
    }
  }, []);
  
  const updateImageWatermark = useCallback((imageId: string, watermarkedUrl: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, watermarked: watermarkedUrl } : img
    ));
  }, []);

  return {
    images,
    selectedImageId,
    setSelectedImageId,
    addImages,
    removeImage,
    clearAllImages,
    updateImageWatermark,
    currentImage: selectedImageId ? images.find(img => img.id === selectedImageId) : null
  };
}
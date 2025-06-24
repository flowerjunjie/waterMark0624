import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/button';
import { 
  HiOutlineAdjustments, 
  HiOutlineRefresh, 
  HiOutlineInformationCircle,
  HiOutlineArrowsExpand
} from 'react-icons/hi';
import WatermarkSettingsPanel from './WatermarkSettingsPanel';
import ImagePreview from './ImagePreview';
import ImageList from './ImageList';
import FileUploader from './FileUploader';
import BatchActions from './BatchActions';
import { useImageManager } from '../hooks/useImageManager';
import { useWatermarkSettings } from '../hooks/useWatermarkSettings';
import { useWatermarkApplier } from '../hooks/useWatermarkApplier';
import { useWatermarkDrag } from '../hooks/useWatermarkDrag';
import { usePreviewZoom } from '../hooks/usePreviewZoom';
import { useWatermarkOverlay } from '../hooks/useWatermarkOverlay';
import { downloadSingleImage, downloadAllImages } from '../utils/downloadUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// 调试函数 - 用于检查DOM中的水印叠加元素
const debugWatermarkOverlay = (overlayRef: React.RefObject<HTMLDivElement>) => {
  if (!overlayRef.current) return;
  
  console.log('====== 调试水印叠加层 ======');
  console.log('水印叠加层元素:', overlayRef.current);
  console.log('子元素数量:', overlayRef.current.childNodes.length);
  console.log('样式:', overlayRef.current.style);
  
  // 检查所有子元素
  Array.from(overlayRef.current.childNodes).forEach((child, index) => {
    if (child instanceof HTMLElement) {
      console.log(`子元素 ${index}:`, child);
      console.log(`子元素 ${index} 样式:`, child.style);
      console.log(`子元素 ${index} innerHTML:`, child.innerHTML);
    }
  });
  console.log('====== 调试结束 ======');
};

const WatermarkTool: React.FC = () => {
  const {
    images,
    selectedImageId,
    setSelectedImageId,
    addImages,
    removeImage,
    clearAllImages,
    updateImageWatermark,
    currentImage
  } = useImageManager();

  const {
    watermarkSettings,
    showWatermark,
    updateWatermarkSetting,
    toggleWatermarkVisibility,
    setWatermarkImage,
    removeWatermarkImage
  } = useWatermarkSettings();

  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);
  const watermarkOverlayRef = useRef<HTMLDivElement>(null);
  const watermarkCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  // 添加一个状态跟踪调试模式
  const [debugMode, setDebugMode] = useState(false);
  // 添加一个状态存储水印信息
  const [watermarkInfo, setWatermarkInfo] = useState<{
    position: string;
    fontSize?: number;
    imageSize?: number;
    previewSize?: {width: number, height: number};
    watermarkSize?: {width: number, height: number};
  } | null>(null);
  
  // 使用useRef跟踪上一次的水印设置，避免不必要的重新应用
  const lastAppliedSettingsRef = useRef<string>('');

  const { applyWatermark, processAllImages, canvasRef } = useWatermarkApplier({
    images,
    updateImageWatermark,
    watermarkSettings,
    showWatermark
  });

  // 同步外部canvas引用和内部canvas引用
  useEffect(() => {
    if (canvasRef.current && watermarkCanvasRef.current !== canvasRef.current) {
      watermarkCanvasRef.current = canvasRef.current;
      console.log('已同步Canvas引用');
    }
  }, [canvasRef]);

  const { previewScale, zoomInPreview, zoomOutPreview, resetPreviewZoom } = usePreviewZoom({
    watermarkSettings,
    updateWatermarkSetting,
    watermarkOverlayRef,
    currentImageIsGif: currentImage?.isGif || false
  });

  useWatermarkDrag({
    watermarkSettings,
    updateWatermarkSetting,
    currentImage: currentImage || null,
    watermarkOverlayRef,
    previewImageRef
  });

  const { updateWatermarkOverlay } = useWatermarkOverlay({
    watermarkOverlayRef,
    previewImageRef,
    currentImage: currentImage || null,
    watermarkSettings,
    showWatermark,
    previewScale,
    canvasRef: watermarkCanvasRef
  });

  // 确保组件挂载后canvas已准备好
  useEffect(() => {
    console.log('水印工具组件初始化 - Canvas引用状态:', !!watermarkCanvasRef.current);
  }, []);

  // 启用调试模式时，运行调试功能
  useEffect(() => {
    if (debugMode) {
      const intervalId = setInterval(() => {
        debugWatermarkOverlay(watermarkOverlayRef);
      }, 2000);
      
      return () => clearInterval(intervalId);
    }
  }, [debugMode]);
  
  // 当水印设置或选中图片变化时应用水印，但使用防抖优化
  useEffect(() => {
    if (!selectedImageId) return;
    
    // 创建当前设置的快照
    const currentSettings = JSON.stringify({
      selectedImageId,
      showWatermark,
      type: watermarkSettings.type,
      text: watermarkSettings.text,
      fontSize: watermarkSettings.fontSize,
      color: watermarkSettings.color,
      opacity: watermarkSettings.opacity,
      rotation: watermarkSettings.rotation,
      position: watermarkSettings.position,
      offsetX: watermarkSettings.offsetX,
      offsetY: watermarkSettings.offsetY
    });
    
    // 如果设置没有变化，避免重复应用
    if (currentSettings === lastAppliedSettingsRef.current) {
      return;
    }
    
    // 更新设置引用
    lastAppliedSettingsRef.current = currentSettings;
    
    // 使用延时，避免频繁应用
    const timeoutId = setTimeout(() => {
      console.log('应用水印到图片:', selectedImageId);
      applyWatermark(selectedImageId);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [
    selectedImageId,
    watermarkSettings.type,
    watermarkSettings.text,
    watermarkSettings.fontSize,
    watermarkSettings.color,
    watermarkSettings.opacity,
    watermarkSettings.rotation,
    watermarkSettings.position,
    watermarkSettings.offsetX,
    watermarkSettings.offsetY,
    showWatermark,
    applyWatermark
  ]);

  // 添加一个单独的副作用，用于处理水印叠加层更新
  useEffect(() => {
    if (watermarkOverlayRef.current) {
      // 确保我们总是只有一个水印内容元素
      const watermarkElements = Array.from(watermarkOverlayRef.current.children).filter(
        child => !(child as HTMLElement).classList.contains('absolute')
      );
      
      if (watermarkElements.length > 1) {
        console.log('检测到多个水印内容元素，移除额外的元素');
        watermarkElements.slice(1).forEach(el => el.remove());
      }
    }
  }, [currentImage, watermarkSettings, showWatermark]);

  // 优化：使用useCallback包装函数，减少重复创建
  const fixDuplicateWatermark = useCallback(() => {
    if (!watermarkOverlayRef.current) return;
    
    const overlay = watermarkOverlayRef.current;
    const controlPoint = overlay.querySelector('.absolute'); // 获取控制点元素
    
    // 保留第一个非控制点子元素和控制点
    const contentElements = Array.from(overlay.children).filter(
      el => !(el as HTMLElement).classList.contains('absolute')
    );
    
    if (contentElements.length > 1) {
      // 清空所有内容
      overlay.innerHTML = '';
      
      // 只添加第一个内容元素和控制点
      if (contentElements[0]) overlay.appendChild(contentElements[0]);
      if (controlPoint) overlay.appendChild(controlPoint);
    }
    
    // 强制重新计算水印位置
    if (updateWatermarkOverlay) {
      updateWatermarkOverlay();
    }
  }, [updateWatermarkOverlay]);

  // 优化：使用useCallback包装函数，减少重复创建
  const fixWatermarkPosition = useCallback(() => {
    // 确保水印位置一致性
    console.log('开始修复水印位置...');
    
    // 强制重新渲染水印
    if (watermarkSettings.position === 'custom') {
      // 对于自定义位置，先微调位置，然后恢复
      const currentOffsetX = watermarkSettings.offsetX;
      const currentOffsetY = watermarkSettings.offsetY;
      
      // 先切换到中心位置，再切回自定义位置
      updateWatermarkSetting('position', 'center');
      
      // 延迟后恢复自定义位置
      setTimeout(() => {
        updateWatermarkSetting('position', 'custom');
        updateWatermarkSetting('offsetX', currentOffsetX);
        updateWatermarkSetting('offsetY', currentOffsetY);
        
        // 强制更新水印叠加层
        setTimeout(() => {
          if (updateWatermarkOverlay) {
            updateWatermarkOverlay();
            console.log('已修复自定义位置水印');
          }
        }, 50);
      }, 50);
    } else {
      // 对于预设位置，先切换到另一个位置，再切回来
      const currentPosition = watermarkSettings.position;
      const tempPosition = currentPosition === 'center' ? 'top-left' : 'center';
      
      // 先切换到临时位置
      updateWatermarkSetting('position', tempPosition);
      
      // 延迟后恢复原始位置
      setTimeout(() => {
        updateWatermarkSetting('position', currentPosition);
        
        // 强制更新水印叠加层
        setTimeout(() => {
          if (updateWatermarkOverlay) {
            updateWatermarkOverlay();
            console.log('已修复预设位置水印');
          }
        }, 50);
      }, 50);
    }
    
    // 如果是文字水印，尝试微调字体大小
    if (watermarkSettings.type === 'text') {
      const currentFontSize = watermarkSettings.fontSize;
      
      // 先微调字体大小
      setTimeout(() => {
        updateWatermarkSetting('fontSize', currentFontSize + 1);
        
        // 然后恢复原始字体大小
        setTimeout(() => {
          updateWatermarkSetting('fontSize', currentFontSize);
          console.log('已修复文字水印字体大小');
        }, 50);
      }, 150);
    }
    
    // 如果是图片水印，尝试微调图片大小
    if (watermarkSettings.type === 'image') {
      const currentImageSize = watermarkSettings.imageSize;
      
      // 先微调图片大小
      setTimeout(() => {
        updateWatermarkSetting('imageSize', currentImageSize + 1);
        
        // 然后恢复原始图片大小
        setTimeout(() => {
          updateWatermarkSetting('imageSize', currentImageSize);
          console.log('已修复图片水印大小');
        }, 50);
      }, 150);
    }
    
    // 如果当前有选中图片，重新应用水印
    if (selectedImageId) {
      setTimeout(() => {
        console.log('重新应用水印到当前图片');
        applyWatermark(selectedImageId);
      }, 300);
    }
  }, [watermarkSettings.position, watermarkSettings.offsetX, watermarkSettings.offsetY, 
      watermarkSettings.type, watermarkSettings.fontSize, watermarkSettings.imageSize,
      updateWatermarkSetting, updateWatermarkOverlay, selectedImageId, applyWatermark]);

  // 处理批量处理所有图片
  const handleProcessAllImages = async () => {
    if (images.length === 0 || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setProgress(0);
      setProgressText('正在处理图片...');
      
      await processAllImages(
        (progress) => {
          setProgress(progress);
          setProgressText(`正在处理: ${Math.round(progress * 100)}%`);
        }
      );
      
      setProgressText('处理完成!');
      setTimeout(() => {
        setProgressText('');
        setProgress(0);
      }, 2000);
    } catch (error) {
      console.error('批量处理出错:', error);
      setProgressText('处理失败!');
      setTimeout(() => {
        setProgressText('');
        setProgress(0);
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理下载当前图片
  const handleDownloadCurrent = async () => {
    if (!currentImage || isProcessing) return;
    
    setIsProcessing(true);
    setProgressText('正在准备下载...');
    
    try {
      await downloadSingleImage(currentImage);
      setProgressText('下载成功!');
    } catch (error) {
      console.error('下载出错:', error);
      setProgressText('下载失败!');
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProgressText('');
      }, 2000);
    }
  };

  // 处理批量下载所有图片
  const handleDownloadAll = async () => {
    if (images.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    setProgress(0);
    setProgressText('正在准备打包下载...');
    
    try {
      await downloadAllImages(
        images,
        (progress) => {
          setProgress(progress);
          setProgressText(`正在打包: ${Math.round(progress * 100)}%`);
        },
        setProgressText
      );
      setProgressText('下载成功!');
    } catch (error) {
      console.error('批量下载出错:', error);
      setProgressText('下载失败!');
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProgressText('');
        setProgress(0);
      }, 2000);
    }
  };

  // 检查水印叠加层
  useEffect(() => {
    if (watermarkOverlayRef.current && previewImageRef.current && currentImage) {
      const overlayRect = watermarkOverlayRef.current.getBoundingClientRect();
      const imageRect = previewImageRef.current.getBoundingClientRect();
      
      setWatermarkInfo({
        position: watermarkSettings.position,
        fontSize: watermarkSettings.type === 'text' ? watermarkSettings.fontSize : undefined,
        imageSize: watermarkSettings.type === 'image' ? watermarkSettings.imageSize : undefined,
        previewSize: { width: imageRect.width, height: imageRect.height },
        watermarkSize: { width: overlayRect.width, height: overlayRect.height }
      });
    }
  }, [
    currentImage, 
    watermarkSettings.position, 
    watermarkSettings.type, 
    watermarkSettings.fontSize, 
    watermarkSettings.imageSize
  ]);

  // 切换全屏预览
  const toggleFullscreen = () => {
    setFullscreenPreview(!fullscreenPreview);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto py-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 左侧: 图片上传和列表 */}
          <div className={`space-y-4 ${fullscreenPreview ? 'hidden' : 'md:col-span-1'}`}>
            <FileUploader onAddImages={addImages} />
            
            <ImageList
              images={images}
              selectedImageId={selectedImageId}
              onSelectImage={setSelectedImageId}
              onRemoveImage={removeImage}
              isProcessing={isProcessing}
            />
          </div>
          
          {/* 中间: 预览区域 */}
          <div className={`space-y-4 ${fullscreenPreview ? 'col-span-full' : 'md:col-span-2'}`}>
            {/* 预览区域头部工具栏 */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-1.5">
                预览区域
                {currentImage && (
                  <span className="text-xs bg-muted py-0.5 px-2 rounded-full">
                    {currentImage.width} × {currentImage.height}
                  </span>
                )}
              </h2>
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="h-8 px-2"
                    >
                      <HiOutlineArrowsExpand className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {fullscreenPreview ? '退出全屏预览' : '全屏预览'}
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={zoomInPreview}
                      disabled={isProcessing}
                      className="h-8 px-2"
                    >
                      +
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>放大预览</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={zoomOutPreview}
                      disabled={isProcessing}
                      className="h-8 px-2"
                    >
                      -
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>缩小预览</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetPreviewZoom}
                      disabled={isProcessing}
                      className="h-8 px-2"
                    >
                      <HiOutlineRefresh className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>重置缩放</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* 预览区域内容 */}
            <div className="relative border rounded-lg p-2 bg-white overflow-hidden" style={{ minHeight: '400px' }}>
              {currentImage ? (
                <ImagePreview
                  image={currentImage}
                  previewImageRef={previewImageRef}
                  watermarkOverlayRef={watermarkOverlayRef}
                  previewScale={previewScale}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <HiOutlineInformationCircle className="h-12 w-12 mb-2" />
                  <p className="text-lg">请上传图片以添加水印</p>
                  <p className="text-sm mt-2">支持上传PNG、JPG、GIF等格式的图片</p>
                </div>
              )}
            </div>
            
            {/* 操作指引 */}
            {currentImage && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">操作提示：</span>
                  <span className="ml-1">拖动水印可调整位置 | 滚轮可调整水印大小 | 右侧面板可设置水印类型和样式</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span>预览缩放: {Math.round(previewScale * 100)}%</span>
                </div>
              </div>
            )}
            
            {/* 操作按钮区域 */}
            <BatchActions
              onProcessAllImages={handleProcessAllImages}
              onDownloadCurrent={handleDownloadCurrent}
              onDownloadAll={handleDownloadAll}
              progressText={progressText}
              progress={progress}
              isProcessing={isProcessing}
              imageCount={images.length}
              hasCurrentImage={!!currentImage}
              onClearAll={clearAllImages}
            />
          </div>
          
          {/* 右侧: 设置面板 */}
          <div className={`${fullscreenPreview ? 'hidden' : 'md:col-span-1'}`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button
                  variant={showSettings ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1"
                >
                  <HiOutlineAdjustments className="h-4 w-4" />
                  {showSettings ? '隐藏设置' : '显示设置'}
                </Button>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fixWatermarkPosition}
                      disabled={isProcessing || !currentImage}
                    >
                      <HiOutlineRefresh className="h-4 w-4 mr-1" />
                      修复位置
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    修复水印位置问题
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {showSettings && (
                <WatermarkSettingsPanel
                  watermarkSettings={watermarkSettings}
                  showWatermark={showWatermark}
                  updateWatermarkSetting={updateWatermarkSetting}
                  toggleWatermarkVisibility={toggleWatermarkVisibility}
                  setWatermarkImage={setWatermarkImage}
                  removeWatermarkImage={removeWatermarkImage}
                  watermarkInputRef={watermarkInputRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 隐藏的文件输入，用于选择水印图片 */}
      <input 
        type="file" 
        ref={watermarkInputRef} 
        accept="image/*" 
        className="hidden" 
        title="选择水印图片"
        aria-label="选择水印图片"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setWatermarkImage(e.target.files[0]);
            e.target.value = '';  // 重置input，允许选择相同的文件
          }
        }} 
      />
    </TooltipProvider>
  );
};

export default WatermarkTool;
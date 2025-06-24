import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Text, Image as ImageIcon, X } from 'lucide-react';
import ColorPicker from '@/components/ColorPicker';
import Dropzone from '@/components/Dropzone';
import { WatermarkSettings } from '../types';

interface TiledWatermarkSettingsProps {
  watermarkSettings: WatermarkSettings;
  updateWatermarkSetting: (key: keyof WatermarkSettings, value: any) => void;
  setWatermarkImage: (file: File) => void;
  removeWatermarkImage: () => void;
  watermarkInputRef: React.RefObject<HTMLInputElement>;
}

const TiledWatermarkSettings: React.FC<TiledWatermarkSettingsProps> = ({
  watermarkSettings,
  updateWatermarkSetting,
  setWatermarkImage,
  removeWatermarkImage,
  watermarkInputRef
}) => {
  // 控制平铺水印内容 - 确保文字和图片只有一个生效
  const setTiledWatermarkMode = (mode: 'text' | 'image') => {
    if (mode === 'text') {
      console.log('设置为平铺文字水印模式');
      updateWatermarkSetting('text', watermarkSettings.text || '水印文字');
      updateWatermarkSetting('image', null); // 清除图片
    } else {
      console.log('设置为平铺图片水印模式');
      updateWatermarkSetting('text', ''); // 清除文字
      watermarkInputRef.current?.click();
    }
  };

  return (
    <div id="tiledSettings">
      <div className="mb-4">
        <Label htmlFor="tileSpacing" className="mb-2 block">平铺间距: {watermarkSettings.tileSpacing}px</Label>
        <Slider
          id="tileSpacing"
          min={50}
          max={300}
          step={1}
          value={[watermarkSettings.tileSpacing]}
          onValueChange={(val) => updateWatermarkSetting('tileSpacing', val[0])}
        />
      </div>
      
      <div className="mb-4">
        <Label className="mb-2 block">平铺内容</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={watermarkSettings.text && !watermarkSettings.image ? 'default' : 'outline'}
            onClick={() => setTiledWatermarkMode('text')}
          >
            <Text className="mr-2 h-4 w-4" />
            文字
          </Button>
          <Button
            variant={watermarkSettings.image && !watermarkSettings.text ? 'default' : 'outline'}
            onClick={() => setTiledWatermarkMode('image')}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            图片
          </Button>
        </div>
      </div>
      
      {watermarkSettings.text && !watermarkSettings.image && (
        <>
          <div className="mb-4">
            <Label htmlFor="watermarkText" className="mb-2 block">水印文字</Label>
            <Input
              id="watermarkText"
              value={watermarkSettings.text}
              onChange={(e) => updateWatermarkSetting('text', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="fontSize" className="mb-2 block">字体大小: {watermarkSettings.fontSize}px</Label>
            <Slider
              id="fontSize"
              min={8}
              max={144}
              step={1}
              value={[watermarkSettings.fontSize]}
              onValueChange={(val) => updateWatermarkSetting('fontSize', val[0])}
            />
          </div>
          <div className="mb-4">
            <Label className="mb-2 block">颜色</Label>
            <ColorPicker
              value={watermarkSettings.color}
              onChange={(color) => updateWatermarkSetting('color', color)}
            />
          </div>
        </>
      )}
      
      {watermarkSettings.image && !watermarkSettings.text && (
        <>
          <div className="mb-4">
            <Label className="mb-2 block">水印图片</Label>
            <Dropzone 
              onFilesAdded={(files) => files.length > 0 && setWatermarkImage(files[0])} 
              className="p-4 min-h-0" 
              onClick={() => watermarkInputRef.current?.click()}
            >
              {watermarkSettings.image ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={watermarkSettings.image} 
                    alt="Watermark" 
                    className="max-w-full max-h-24 rounded-md mb-2" 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      removeWatermarkImage(); 
                    }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    移除
                  </Button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">拖拽或点击上传水印图片</p>
                </>
              )}
            </Dropzone>
          </div>
          <div className="mb-4">
            <Label htmlFor="imageSize" className="mb-2 block">图片大小: {watermarkSettings.imageSize}%</Label>
            <Slider
              id="imageSize"
              min={5}
              max={100}
              step={1}
              value={[watermarkSettings.imageSize]}
              onValueChange={(val) => updateWatermarkSetting('imageSize', val[0])}
            />
          </div>
        </>
      )}

      {/* 通用不透明度设置 */}
      <div className="mb-4">
        <div className="flex justify-between">
          <Label htmlFor="tiledOpacity">不透明度</Label>
          <span className="text-sm text-muted-foreground">{Math.round(watermarkSettings.opacity * 100)}%</span>
        </div>
        <Slider
          id="tiledOpacity"
          min={0.1}
          max={1}
          step={0.01}
          value={[watermarkSettings.opacity]}
          onValueChange={(value) => updateWatermarkSetting('opacity', value[0])}
          aria-label="调整平铺水印不透明度"
        />
      </div>
    </div>
  );
};

export default TiledWatermarkSettings;
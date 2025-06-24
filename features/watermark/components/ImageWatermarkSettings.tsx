import React from 'react';
import { Button } from '../../../components/ui/button';
import { Slider } from '../../../components/ui/slider';
import { Label } from '../../../components/ui/label';
import { WatermarkSettings } from '../types';
import { HiOutlineTrash } from 'react-icons/hi';

interface ImageWatermarkSettingsProps {
  watermarkSettings: WatermarkSettings;
  updateWatermarkSetting: (key: keyof WatermarkSettings, value: any) => void;
  setWatermarkImage: (file: File) => void;
  removeWatermarkImage: () => void;
  watermarkInputRef: React.RefObject<HTMLInputElement>;
}

const ImageWatermarkSettings: React.FC<ImageWatermarkSettingsProps> = ({
  watermarkSettings,
  updateWatermarkSetting,
  setWatermarkImage,
  removeWatermarkImage,
  watermarkInputRef
}) => {
  return (
    <div className="space-y-4">
      {watermarkSettings.image ? (
        <div className="relative border rounded-md p-2 bg-gray-50">
          <img 
            src={watermarkSettings.image} 
            alt="水印图片" 
            className="max-w-full h-auto mx-auto max-h-32"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-red-500 hover:text-red-600 bg-white rounded-full h-6 w-6"
            onClick={removeWatermarkImage}
            title="移除水印图片"
            aria-label="移除水印图片"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => watermarkInputRef.current?.click()}
        >
          选择水印图片
        </Button>
      )}

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="imageSize">图片大小</Label>
          <span className="text-sm text-muted-foreground">{watermarkSettings.imageSize}%</span>
        </div>
        <Slider
          id="imageSize"
          min={5}
          max={100}
          step={1}
          value={[watermarkSettings.imageSize]}
          onValueChange={(value) => updateWatermarkSetting('imageSize', value[0])}
          aria-label="调整图片水印大小"
        />
        <p className="text-xs text-muted-foreground mt-1">
          图片水印大小是相对于原图的百分比，可设置在5%-100%之间
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="imageOpacity">不透明度</Label>
          <span className="text-sm text-muted-foreground">{Math.round(watermarkSettings.opacity * 100)}%</span>
        </div>
        <Slider
          id="imageOpacity"
          min={0.1}
          max={1}
          step={0.01}
          value={[watermarkSettings.opacity]}
          onValueChange={(value) => updateWatermarkSetting('opacity', value[0])}
          aria-label="调整图片水印不透明度"
        />
      </div>
    </div>
  );
};

export default ImageWatermarkSettings;
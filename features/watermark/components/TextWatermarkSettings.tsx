import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ColorPicker from '@/components/ColorPicker';
import { WatermarkSettings } from '../types';

interface TextWatermarkSettingsProps {
  watermarkSettings: WatermarkSettings;
  updateWatermarkSetting: (key: keyof WatermarkSettings, value: any) => void;
}

const TextWatermarkSettings: React.FC<TextWatermarkSettingsProps> = ({
  watermarkSettings,
  updateWatermarkSetting
}) => {
  return (
    <div id="textSettings">
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
      <div className="mb-4">
        <div className="flex justify-between">
          <Label htmlFor="textOpacity">不透明度</Label>
          <span className="text-sm text-muted-foreground">{Math.round(watermarkSettings.opacity * 100)}%</span>
        </div>
        <Slider
          id="textOpacity"
          min={0.1}
          max={1}
          step={0.01}
          value={[watermarkSettings.opacity]}
          onValueChange={(value) => updateWatermarkSetting('opacity', value[0])}
          aria-label="调整文字水印不透明度"
        />
      </div>
    </div>
  );
};

export default TextWatermarkSettings;
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Slider } from '../../../components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { Settings, Image as ImageIcon, Type, Grid3X3 } from 'lucide-react';
import { WatermarkSettings } from '../types';
import TextWatermarkSettings from './TextWatermarkSettings';
import ImageWatermarkSettings from './ImageWatermarkSettings';
import TiledWatermarkSettings from './TiledWatermarkSettings';

interface WatermarkSettingsPanelProps {
  watermarkSettings: WatermarkSettings;
  showWatermark: boolean;
  updateWatermarkSetting: (key: keyof WatermarkSettings, value: any) => void;
  toggleWatermarkVisibility: () => void;
  setWatermarkImage: (file: File) => void;
  removeWatermarkImage: () => void;
  watermarkInputRef: React.RefObject<HTMLInputElement>;
}

const WatermarkSettingsPanel: React.FC<WatermarkSettingsPanelProps> = ({
  watermarkSettings,
  showWatermark,
  updateWatermarkSetting,
  toggleWatermarkVisibility,
  setWatermarkImage,
  removeWatermarkImage,
  watermarkInputRef
}) => {
  // 水印类型选项
  const watermarkTypes = [
    { value: 'text', label: '文字', icon: <Type className="h-4 w-4" /> },
    { value: 'image', label: '图片', icon: <ImageIcon className="h-4 w-4" /> },
    { value: 'tiled', label: '平铺', icon: <Grid3X3 className="h-4 w-4" /> }
  ];

  // 位置选项
  const positionOptions = [
    { value: 'top-left', label: '左上角' },
    { value: 'top-right', label: '右上角' },
    { value: 'center', label: '居中' },
    { value: 'bottom-left', label: '左下角' },
    { value: 'bottom-right', label: '右下角' },
    { value: 'custom', label: '自定义' }
  ];
  
  // 处理水印类型切换
  const handleTypeChange = (type: 'text' | 'image' | 'tiled') => {
    console.log(`切换水印类型到: ${type}`);
    
    // 根据不同类型，设置默认值
    if (type === 'text') {
      // 切换到文字模式
      updateWatermarkSetting('type', 'text');
      if (!watermarkSettings.text) {
        updateWatermarkSetting('text', '水印文字');
      }
    } else if (type === 'image') {
      // 切换到图片模式
      updateWatermarkSetting('type', 'image');
      if (!watermarkSettings.image) {
        watermarkInputRef.current?.click();
      }
    } else if (type === 'tiled') {
      // 切换到平铺模式
      updateWatermarkSetting('type', 'tiled');
      if (!watermarkSettings.text && !watermarkSettings.image) {
        updateWatermarkSetting('text', '水印文字');
      }
    }
  };

  // 根据水印类型显示不同的设置面板
  const renderWatermarkSettings = () => {
    switch (watermarkSettings.type) {
      case 'text':
        return (
          <TextWatermarkSettings
            watermarkSettings={watermarkSettings}
            updateWatermarkSetting={updateWatermarkSetting}
          />
        );
      case 'image':
        return (
          <ImageWatermarkSettings
            watermarkSettings={watermarkSettings}
            updateWatermarkSetting={updateWatermarkSetting}
            setWatermarkImage={setWatermarkImage}
            removeWatermarkImage={removeWatermarkImage}
            watermarkInputRef={watermarkInputRef}
          />
        );
      case 'tiled':
        return (
          <TiledWatermarkSettings
            watermarkSettings={watermarkSettings}
            updateWatermarkSetting={updateWatermarkSetting}
            setWatermarkImage={setWatermarkImage}
            removeWatermarkImage={removeWatermarkImage}
            watermarkInputRef={watermarkInputRef}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          水印设置
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 水印开关 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show-watermark" className="cursor-pointer">显示水印</Label>
            <input
              id="show-watermark"
              type="checkbox"
              checked={showWatermark}
              onChange={toggleWatermarkVisibility}
              className="h-4 w-4"
              title="显示/隐藏水印"
              aria-label="显示/隐藏水印"
            />
          </div>

          {/* 水印类型选择 */}
          <div className="space-y-2">
            <Label>水印类型</Label>
            <div className="grid grid-cols-3 gap-2">
              {watermarkTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={watermarkSettings.type === type.value ? 'default' : 'outline'}
                  onClick={() => handleTypeChange(type.value as 'text' | 'image' | 'tiled')}
                  className="flex items-center gap-1"
                >
                  {type.icon}
                  <span>{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* 水印设置 */}
          {renderWatermarkSettings()}

          {/* 通用设置 */}
          <div className="space-y-4 pt-4 border-t">
            {/* 位置 */}
            <div className="space-y-2">
              <Label htmlFor="position">位置</Label>
              <Select
                value={watermarkSettings.position}
                onValueChange={(value) => updateWatermarkSetting('position', value as WatermarkSettings['position'])}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="选择位置" />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 自定义位置 */}
            {watermarkSettings.position === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offsetX">水平位置: {watermarkSettings.offsetX}%</Label>
                  <Slider
                    id="offsetX"
                    min={0}
                    max={100}
                    step={1}
                    value={[watermarkSettings.offsetX]}
                    onValueChange={(value) => updateWatermarkSetting('offsetX', value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offsetY">垂直位置: {watermarkSettings.offsetY}%</Label>
                  <Slider
                    id="offsetY"
                    min={0}
                    max={100}
                    step={1}
                    value={[watermarkSettings.offsetY]}
                    onValueChange={(value) => updateWatermarkSetting('offsetY', value[0])}
                  />
                </div>
              </div>
            )}

            {/* 旋转 */}
            <div className="space-y-2">
              <Label htmlFor="rotation">旋转: {watermarkSettings.rotation}°</Label>
              <Slider
                id="rotation"
                min={-180}
                max={180}
                step={1}
                value={[watermarkSettings.rotation]}
                onValueChange={(value) => updateWatermarkSetting('rotation', value[0])}
              />
            </div>
          </div>

          {/* 调试信息 */}
          <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
            <p>当前设置:</p>
            <pre className="overflow-auto max-h-20 bg-muted p-2 rounded text-[10px] mt-1">
              {JSON.stringify({
                类型: watermarkSettings.type,
                位置: watermarkSettings.position,
                水平位置: watermarkSettings.offsetX + '%',
                垂直位置: watermarkSettings.offsetY + '%',
                不透明度: Math.round(watermarkSettings.opacity * 100) + '%',
                旋转: watermarkSettings.rotation + '°'
              }, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatermarkSettingsPanel;
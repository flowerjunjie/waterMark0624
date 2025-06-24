import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface HelpDialogProps {
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader className="sticky top-0 bg-card z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle>水印工具使用帮助</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">基本操作</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>上传图片：拖放图片到左侧上传区或点击"上传图片"按钮</li>
              <li>选择图片：在左侧缩略图列表中点击图片进行选择</li>
              <li>删除图片：点击缩略图右上角的删除按钮</li>
              <li>下载图片：点击"下载当前图片"下载单张图片，或"批量下载"下载所有图片</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">水印类型</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>文字水印：</strong>输入文字、选择字体、颜色、大小</li>
              <li><strong>图片水印：</strong>上传水印图片、调整大小</li>
              <li><strong>平铺水印：</strong>在整个图片上平铺文字或图片水印</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">水印调整</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>直接拖动：</strong>在图片预览区可直接拖动水印调整位置</li>
              <li><strong>鼠标滚轮：</strong>使用滚轮可以调整水印大小</li>
              <li><strong>位置选择：</strong>可选择预设位置（左上角、右上角、居中等）</li>
              <li><strong>自定义位置：</strong>选择"自定义"可手动调整水印位置百分比</li>
              <li><strong>不透明度：</strong>调整滑块控制水印的透明度</li>
              <li><strong>旋转：</strong>使用旋转滑块可旋转水印角度</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">批量处理</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>上传多张图片后，可以批量为所有图片应用相同的水印设置</li>
              <li>点击"应用到所有"可将当前水印设置应用到所有上传的图片</li>
              <li>使用"批量下载"可以将所有处理后的图片打包下载</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">支持的文件格式</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>图片：PNG, JPG/JPEG, WEBP, GIF</li>
              <li>水印图片：PNG, JPG/JPEG（推荐使用带透明背景的PNG）</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">常见问题</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">问题：水印不显示或位置不正确</h4>
                <p className="text-muted-foreground">解决方案：点击右侧设置面板中的"显示水印"选项，确保已开启水印显示</p>
              </div>
              <div>
                <h4 className="font-medium">问题：处理GIF图片时速度慢</h4>
                <p className="text-muted-foreground">解决方案：GIF处理需要对每一帧添加水印，会比较耗时，请耐心等待</p>
              </div>
              <div>
                <h4 className="font-medium">问题：水印效果不明显</h4>
                <p className="text-muted-foreground">解决方案：调整水印不透明度、大小或颜色，使水印更加明显</p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">快捷键</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <kbd className="px-2 py-1 bg-muted rounded">Ctrl+O</kbd>
                <span className="ml-2">上传图片</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded">Ctrl+S</kbd>
                <span className="ml-2">保存当前图片</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded">Delete</kbd>
                <span className="ml-2">删除当前图片</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded">+/-</kbd>
                <span className="ml-2">放大/缩小预览</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-muted rounded">H</kbd>
                <span className="ml-2">显示/隐藏帮助</span>
              </div>
            </div>
          </section>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button onClick={onClose}>关闭</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HelpDialog; 
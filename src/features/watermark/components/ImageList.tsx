import React from 'react';
import { Trash2, FileImage, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageFile } from '../types';

interface ImageListProps {
  images: ImageFile[];
  selectedImageId: string | null;
  onSelectImage: (id: string | null) => void;
  onRemoveImage: (id: string) => void;
  isProcessing: boolean;
}

const ImageList: React.FC<ImageListProps> = ({
  images,
  selectedImageId,
  onSelectImage,
  onRemoveImage,
  isProcessing
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            图片列表
          </div>
          <span className="text-sm font-normal bg-muted rounded-full px-2 py-0.5">
            {images.length} 张
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {images.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无图片</p>
              <p className="text-xs mt-2">点击上方"上传图片"或拖放图片到此处</p>
            </div>
          ) : (
            images.map((image) => (
              <div
                key={image.id}
                className={`relative group flex items-center gap-3 p-3 rounded-lg border mb-2 cursor-pointer transition-colors ${
                  selectedImageId === image.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => onSelectImage(image.id)}
              >
                <div className="relative w-12 h-12 overflow-hidden rounded-md flex-shrink-0">
                  <img 
                    src={image.url} 
                    alt={image.file.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                  {image.isGif && (
                    <span className="absolute bottom-0 left-0 bg-black/70 text-white text-[8px] px-1">GIF</span>
                  )}
                  {image.watermarked && (
                    <span className="absolute top-0 right-0 bg-green-600 w-2 h-2 rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{image.file.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span>{(image.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    {image.width && image.height && (
                      <span className="bg-muted rounded-sm px-1">{image.width}×{image.height}</span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onRemoveImage(image.id); 
                  }}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageList;
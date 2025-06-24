import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Download, Trash, DownloadCloud } from 'lucide-react';

interface BatchActionsProps {
  isProcessing: boolean;
  progress: number;
  progressText: string;
  onProcessAllImages: () => Promise<void>;
  onDownloadCurrent: () => Promise<void>;
  onDownloadAll: () => Promise<void>;
  onClearAll: () => void;
  imageCount: number;
  hasCurrentImage: boolean;
}

const BatchActions: React.FC<BatchActionsProps> = ({
  isProcessing,
  progress,
  progressText,
  onProcessAllImages,
  onDownloadCurrent,
  onDownloadAll,
  onClearAll,
  imageCount,
  hasCurrentImage
}) => {
  return (
    <div className="space-y-4">
      {/* 进度条 */}
      {isProcessing && progressText && (
        <div className="w-full">
          <Progress value={progress * 100} className="h-2" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {progressText}
          </p>
        </div>
      )}
      
      {/* 操作按钮组 */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button 
            onClick={onProcessAllImages}
            disabled={imageCount === 0 || isProcessing}
            className="flex items-center gap-1.5"
          >
            <CheckSquare className="h-4 w-4" />
            应用到所有
          </Button>
          <Button 
            variant="outline" 
            onClick={onClearAll} 
            disabled={imageCount === 0 || isProcessing}
            className="flex items-center gap-1.5"
          >
            <Trash className="h-4 w-4" />
            清空列表
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onDownloadCurrent} 
            disabled={!hasCurrentImage || isProcessing}
            className="flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            下载当前图片
          </Button>
          <Button 
            variant="outline" 
            onClick={onDownloadAll} 
            disabled={imageCount === 0 || isProcessing}
            className="flex items-center gap-1.5"
          >
            <DownloadCloud className="h-4 w-4" />
            批量下载
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BatchActions;
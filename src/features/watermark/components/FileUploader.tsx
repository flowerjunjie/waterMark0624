import React, { useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, Folder } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploaderProps {
  onAddImages: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onAddImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onAddImages(Array.from(event.target.files));
      event.target.value = '';
    }
  };

  const handleFolderSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onAddImages(Array.from(event.target.files));
      event.target.value = '';
    }
  };

  const selectFiles = () => fileInputRef.current?.click();
  const selectFolder = () => folderInputRef.current?.click();

  return (
    <Card>
      <CardContent className="pt-6">
        <Dropzone onFilesAdded={onAddImages}>
          <div className="rounded-full bg-primary/10 p-3 mb-4 mx-auto w-fit">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 text-center">上传图片</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            支持 JPG、PNG、GIF 格式<br />可批量上传或拖放文件
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={selectFiles}
              className="flex-1"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              选择图片
            </Button>
            <Button 
              variant="outline" 
              onClick={selectFolder}
              className="flex-1"
            >
              <Folder className="mr-2 h-4 w-4" />
              选择文件夹
            </Button>
          </div>
        </Dropzone>
      </CardContent>
      <input 
        type="file" 
        ref={fileInputRef} 
        multiple 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileSelect} 
      />
      <input 
        type="file" 
        ref={folderInputRef} 
        multiple 
        className="hidden" 
        onChange={handleFolderSelect} 
        // @ts-ignore - webkitdirectory is a non-standard attribute
        webkitdirectory="" 
      />
    </Card>
  );
};

export default FileUploader;
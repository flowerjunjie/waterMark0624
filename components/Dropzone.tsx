import React, { useState, DragEvent } from 'react';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded, children, className, onClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesAdded(files);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-card'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Dropzone;
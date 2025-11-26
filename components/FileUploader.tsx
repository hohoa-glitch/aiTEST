import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile, onClear, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-gray-800/50 border border-gray-700 rounded-2xl flex items-center justify-between animate-fade-in shadow-lg">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <FileVideo className="w-8 h-8 text-red-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-400">선택된 파일</p>
            <p className="font-medium truncate text-white max-w-[200px] sm:max-w-md">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
        {!disabled && (
          <button 
            onClick={onClear}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed transition-all duration-200
        flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group
        ${isDragging 
          ? 'border-red-500 bg-red-500/10' 
          : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center gap-4 text-center p-6 transition-transform duration-200 group-hover:scale-105">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-red-500/20' : 'bg-gray-700/50'}`}>
          <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-red-500' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="text-lg font-medium text-white mb-1">
            동영상 파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500">
            MP4, MOV, WEBM 등 (최대 20MB 권장)
          </p>
        </div>
      </div>
    </div>
  );
};
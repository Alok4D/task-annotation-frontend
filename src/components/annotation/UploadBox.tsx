'use client';
import React, { useState } from 'react';
import { useUploadImageMutation } from '@/features/annotations/annotationApi';
import { UploadCloud } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export const UploadBox = () => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(e.target.files);
    }
  };

  const uploadFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('image', file);
        try {
          await uploadImage(formData).unwrap();
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-full ${
        isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
      }`}
    >
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="text-xs text-blue-600 mt-2 font-medium">Uploading...</p>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
          <p className="text-sm font-semibold text-gray-800">
            Drag & drop images here
          </p>
          <p className="text-xs text-gray-500 mt-1">or click to browse</p>
        </>
      )}
    </div>
  );
};

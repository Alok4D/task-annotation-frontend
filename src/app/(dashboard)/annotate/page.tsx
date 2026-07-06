'use client';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@/components/annotation/Canvas';
import { AnnotationSidebar } from '@/components/annotation/AnnotationSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedImageId } from '@/features/annotations/annotationSlice';
import { useGetImagesQuery, useUploadImageMutation } from '@/features/annotations/annotationApi';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function AnnotatePage() {
  const dispatch = useDispatch();
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const { data: images = [], isLoading: imagesLoading } = useGetImagesQuery();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-select first image if none is selected
  useEffect(() => {
    if (!selectedImageId && images.length > 0) {
      dispatch(setSelectedImageId(images[0].id));
    }
  }, [images, selectedImageId, dispatch]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const formData = new FormData();
          formData.append('image', file);
          try {
            const res = await uploadImage(formData).unwrap();
            dispatch(setSelectedImageId(res.id)); // Auto select the new image
          } catch (error) {
            console.error("Upload failed", error);
          }
        }
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300 w-full p-4">
      {/* Top Bar - Upload */}
      <div className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Image Annotation</h2>
          <p className="text-sm text-gray-500">Upload images and draw polygons.</p>
        </div>
        
        <div>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
            className="hidden"
            ref={fileInputRef}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
          >
            {isUploading ? <Spinner className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload Image(s)'}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {images.length === 0 && !imagesLoading ? (
           <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
             <ImageIcon className="w-16 h-16 text-gray-200 mb-4" />
             <h3 className="text-lg font-bold text-gray-700">No images uploaded yet</h3>
             <p className="text-gray-500 text-sm">Click the upload button above to start annotating.</p>
           </div>
        ) : (
           <>
             <Canvas />
             <AnnotationSidebar />
           </>
        )}
      </div>

      {/* Bottom Slider / Gallery */}
      {images.length > 0 && (
        <div className="h-28 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-x-auto flex items-center gap-3 snap-x">
          {imagesLoading && <Spinner className="w-6 h-6 text-blue-600 mx-auto" />}
          
          {images.map(img => (
            <div 
              key={img.id}
              onClick={() => dispatch(setSelectedImageId(img.id))}
              className={`h-full aspect-video flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all snap-start ${selectedImageId === img.id ? 'border-blue-600 shadow-md ring-4 ring-blue-50' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
            >
              <img 
                src={img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`} 
                alt="Thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@/components/annotation/Canvas';
import { AnnotationSidebar } from '@/components/annotation/AnnotationSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedImageId } from '@/features/annotations/annotationSlice';
import { useGetImagesQuery, useUploadImageMutation, useDeleteImageMutation } from '@/features/annotations/annotationApi';
import { Upload, Image as ImageIcon, Plus, X } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function AnnotatePage() {
  const dispatch = useDispatch();
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const { data: images = [], isLoading: imagesLoading } = useGetImagesQuery();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
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
            dispatch(setSelectedImageId(res.id));
          } catch (error) {
            console.error("Upload failed", error);
          }
        }
      }
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[#F8F9FA] w-full relative overflow-hidden font-sans rounded-2xl shadow-sm border border-gray-200">
      {/* Sleek Top Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-600/20">
            A
          </div>
          <h2 className="text-sm font-bold text-gray-800 tracking-tight">Annotation Workspace</h2>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-70 active:scale-95"
          >
            {isUploading ? <Spinner className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5" />}
            {isUploading ? 'Uploading...' : 'Add Images'}
          </button>
        </div>
      </header>

      {/* Main Workspace (Canvas + Sidebar) */}
      <div className="flex-1 flex min-h-0 relative">
        {images.length === 0 && !imagesLoading ? (
           <div className="flex-1 flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                <ImageIcon className="w-8 h-8 text-blue-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Annotate</h3>
             <p className="text-gray-500 text-sm max-w-sm text-center mb-6">Upload some images to start drawing polygons and marking up your files.</p>
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
              >
                Upload from Computer
              </button>
           </div>
        ) : (
           <>
             {/* Canvas Area takes full space */}
             <Canvas />
             {/* Right Sidebar floats over or takes space? Figma has it taking space on right. */}
             <div className="w-72 bg-white border-l border-gray-200 shadow-xl z-10 flex flex-col">
               <AnnotationSidebar />
             </div>
           </>
        )}

        {/* Floating Bottom Dock for Thumbnails */}
        {images.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-2 flex items-center gap-2 max-w-[80vw] overflow-x-auto snap-x">
              {imagesLoading && <Spinner className="w-5 h-5 text-blue-600 mx-4" />}
              
              {images.map(img => (
                <div 
                  key={img.id}
                  onClick={() => dispatch(setSelectedImageId(img.id))}
                  className={`h-16 aspect-video flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all snap-start group relative ${selectedImageId === img.id ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 mx-2' : 'hover:scale-105 opacity-70 hover:opacity-100 mx-1'}`}
                >
                  <img 
                    src={img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                  {selectedImageId === img.id && (
                    <div className="absolute inset-0 bg-blue-600/10"></div>
                  )}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      deleteImage(img.id);
                      if (selectedImageId === img.id) dispatch(setSelectedImageId(null));
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    title="Delete Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

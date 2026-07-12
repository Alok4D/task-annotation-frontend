'use client';
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@/components/annotation/Canvas';
import { AnnotationSidebar } from '@/components/annotation/AnnotationSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedImageId } from '@/features/annotations/annotationSlice';
import { useGetImagesQuery, useUploadImageMutation, useDeleteImageMutation } from '@/features/annotations/annotationApi';
import { UploadCloud, Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function AnnotatePage() {
  const dispatch = useDispatch();
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const { data: images = [], isLoading: imagesLoading } = useGetImagesQuery();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const selectedIndex = images.findIndex(img => img.id === selectedImageId);
  const handlePrev = () => { if (selectedIndex > 0) dispatch(setSelectedImageId(images[selectedIndex - 1].id)); }
  const handleNext = () => { if (selectedIndex < images.length - 1) dispatch(setSelectedImageId(images[selectedIndex + 1].id)); }

  return (
    <div className="h-full flex flex-col bg-[#F4F5F7] text-gray-900 w-full relative overflow-hidden font-sans rounded-2xl shadow-sm border border-gray-200">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <img src="/full-logo.png" alt="TaskCanvas Logo" className="h-8 object-contain" />
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-2 py-1.5 border border-gray-200">
           <button onClick={handlePrev} disabled={selectedIndex <= 0} className="p-1 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600"/></button>
           <span className="text-sm font-bold text-gray-700 px-2">{images.length > 0 ? `${selectedIndex + 1} / ${images.length}` : '0 / 0'}</span>
           <button onClick={handleNext} disabled={selectedIndex >= images.length - 1 || images.length === 0} className="p-1 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4 text-gray-600"/></button>
        </div>

        {/* Zoom Controls Placeholder (Functional zoom is inside Canvas via scroll) */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1.5 border border-gray-200">
           <button className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-gray-800"><ZoomOut className="w-4 h-4"/></button>
           <span className="text-sm font-bold px-2 text-gray-700">100%</span>
           <button className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-gray-800"><ZoomIn className="w-4 h-4"/></button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Left Sidebar - Thumbnails */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-gray-100">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-[#673de6] hover:bg-[#532cc2] text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95 shadow-md shadow-[#673de6]/20"
            >
              {isUploading ? <Spinner className="w-4 h-4 text-white" /> : <UploadCloud className="w-4 h-4" />}
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
             {imagesLoading && <div className="flex justify-center p-4"><Spinner className="w-6 h-6 text-[#673de6]" /></div>}
             {images.map((img, idx) => (
                <div 
                  key={img.id}
                  onClick={() => dispatch(setSelectedImageId(img.id))}
                  className={`flex flex-col gap-2 p-2 rounded-xl cursor-pointer transition-all border ${selectedImageId === img.id ? 'bg-[#F4F5F7] border-[#673de6] shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <div className="h-28 w-full relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteImage(img.id); if (selectedImageId === img.id) dispatch(setSelectedImageId(null)); }}
                      className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 rounded-md p-1 transition-all shadow-sm"
                      title="Delete Image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-gray-600 px-1 truncate">
                    {img.image.split('/').pop() || `Image_${idx + 1}`}
                  </span>
                </div>
             ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div 
          className="flex-1 flex flex-col relative bg-gray-50/50 shadow-inner"
          style={{ backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        >
          {images.length === 0 && !imagesLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-white border border-gray-200 shadow-sm rounded-2xl flex items-center justify-center mb-6">
                <ImageIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Annotate</h3>
              <p className="text-gray-500 text-sm max-w-sm mb-6">Upload some images to start drawing polygons and marking up your files.</p>
            </div>
          ) : (
            <Canvas>
              <AnnotationSidebar />
            </Canvas>
          )}
        </div>

      </div>
    </div>
  );
}

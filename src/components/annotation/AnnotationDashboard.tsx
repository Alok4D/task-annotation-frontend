'use client';
import React, { useRef } from 'react';
import { useGetImagesQuery, useUploadImageMutation } from '@/features/annotations/annotationApi';
import { useDispatch } from 'react-redux';
import { setSelectedImageId } from '@/features/annotations/annotationSlice';
import { Upload, Link2, ArrowRight, Maximize, Eye, MoreVertical, Layers } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export const AnnotationDashboard = () => {
  const dispatch = useDispatch();
  const { data: images = [], isLoading: imagesLoading } = useGetImagesQuery();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
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
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // diff in minutes
    if (diff < 1) return 'Less than a min ago';
    if (diff < 60) return `${diff} mins ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
  };

  return (
    <div className="min-h-full bg-[#1E2228] text-white p-8 flex flex-col font-sans -mx-6 -my-6">
      
      {/* Top Upload Section */}
      <div className="w-full max-w-3xl mx-auto mb-16 mt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">New Markup</h2>
          <p className="text-[#8B929D] text-sm">Upload images, a PDF, paste a link, or start with a blank canvas.</p>
          <p className="text-[#8B929D] text-sm font-semibold mt-1">Pro Tip: <span className="font-normal">Drag & drop / paste images directly from clipboard.</span></p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
          {/* Blue Upload Button */}
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
            className="w-full h-[42px] bg-[#0D73ED] hover:bg-[#0b62cc] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors relative overflow-hidden"
          >
            {isUploading ? (
              <Spinner className="w-4 h-4 text-white" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Image(s) or PDF'}
          </button>

          {/* Paste Link Input */}
          <div className="w-full relative flex items-center h-[42px] bg-[#282D36] border border-[#3A414B] rounded overflow-hidden">
            <Link2 className="w-4 h-4 text-[#8B929D] absolute left-3" />
            <input 
              type="text" 
              placeholder="Paste a link to a markup, image, or webpage" 
              className="w-full h-full bg-transparent text-sm pl-9 pr-10 outline-none text-[#E0E0E0] placeholder-[#8B929D]"
            />
            <button className="absolute right-0 h-full w-10 bg-[#0D73ED] hover:bg-[#0b62cc] flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Blank Canvas Button */}
          <div className="w-full flex gap-2">
            <button className="flex-1 h-[42px] bg-[#282D36] hover:bg-[#323842] border border-[#3A414B] rounded flex items-center justify-center gap-2 text-sm font-bold text-[#E0E0E0] transition-colors">
              <Maximize className="w-4 h-4" />
              Blank Canvas
            </button>
            <button className="h-[42px] w-[50px] bg-[#282D36] hover:bg-[#323842] border border-[#3A414B] rounded flex items-center justify-center text-[#B3B4B5] transition-colors">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-px border-b border-dashed border-[#3A414B] mb-10 -mx-8 w-[calc(100%+4rem)]"></div>

      {/* Bottom Content Area */}
      <div className="flex gap-12 w-full max-w-[1400px] mx-auto px-4">
        
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <div className="mb-8">
            <h3 className="text-white font-bold text-sm mb-4">My History</h3>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded bg-[#1F242B] text-sm text-[#E0E0E0] hover:bg-[#282D36] transition-colors">
              <Layers className="w-4 h-4 text-[#8B929D]" />
              <span className="font-semibold text-xs">My Markups (0)</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded bg-[#0D73ED] text-white text-sm font-semibold transition-colors mt-2 shadow-[0_0_10px_rgba(13,115,237,0.3)]">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Viewed By Me</span>
            </button>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">My Collections</h3>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg mb-1">Viewed By Me</h2>
          <p className="text-[#8B929D] text-xs mb-8">All the markups shared with you that you've viewed.</p>

          {imagesLoading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner className="text-[#0D73ED] w-8 h-8" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#8B929D] text-sm border border-dashed border-[#3A414B] rounded">
              No images uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((img) => (
                <div key={img.id} className="flex flex-col group cursor-pointer" onClick={() => dispatch(setSelectedImageId(img.id))}>
                  <div className="w-full aspect-square bg-white rounded flex items-center justify-center p-2 mb-3 relative border border-[#3A414B] group-hover:border-[#0D73ED] transition-colors">
                    <img 
                      src={img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`} 
                      alt="Markup" 
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-[#0D73ED]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#E0E0E0] font-semibold mb-1">
                        <Eye className="w-3.5 h-3.5 text-[#8B929D]" />
                        {img.created_at ? timeAgo(img.created_at) : 'Just now'}
                      </div>
                      <div className="text-[10px] text-[#8B929D]">
                        Duplicated {img.created_at ? formatDateShort(img.created_at) : ''} by You
                      </div>
                    </div>
                    <button className="text-[#8B929D] hover:text-white p-1" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

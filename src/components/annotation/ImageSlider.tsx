'use client';
import React, { useEffect } from 'react';
import { useGetImagesQuery } from '@/features/annotations/annotationApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedImageId } from '@/features/annotations/annotationSlice';
import { Spinner } from '@/components/ui/Spinner';

export const ImageSlider = () => {
  const { data: images = [], isLoading } = useGetImagesQuery();
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (images.length > 0 && !selectedImageId) {
      dispatch(setSelectedImageId(images[0].id));
    }
  }, [images, selectedImageId, dispatch]);

  if (isLoading) return <div className="h-24 flex items-center justify-center bg-white rounded-2xl border border-gray-100"><Spinner /></div>;
  if (images.length === 0) return (
    <div className="h-24 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
      <p className="text-sm text-gray-500">No images uploaded yet.</p>
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 pt-2 px-2 snap-x bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      {images.map((img) => (
        <div
          key={img.id}
          onClick={() => dispatch(setSelectedImageId(img.id))}
          className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all snap-start relative ${
            selectedImageId === img.id ? 'ring-4 ring-blue-500 scale-105 shadow-lg z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
        >
          <img
            src={img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

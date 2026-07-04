'use client';
import React, { useEffect } from 'react';
import { Canvas } from '@/components/annotation/Canvas';
import { AnnotationSidebar } from '@/components/annotation/AnnotationSidebar';
import { AnnotationDashboard } from '@/components/annotation/AnnotationDashboard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedImageId } from '@/features/annotations/annotationSlice';

export default function AnnotatePage() {
  const dispatch = useDispatch();
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);

  // When unmounting the page, clear selected image to default back to dashboard next time
  useEffect(() => {
    return () => {
      dispatch(setSelectedImageId(null));
    };
  }, [dispatch]);

  if (!selectedImageId) {
    return (
      <div className="h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AnnotationDashboard />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300 w-full">
      <div className="flex-1 flex gap-4 min-h-0 relative">
        <Canvas />
        <AnnotationSidebar />
      </div>
    </div>
  );
}

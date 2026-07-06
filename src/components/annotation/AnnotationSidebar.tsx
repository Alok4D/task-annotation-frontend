'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetAnnotationsQuery, useDeleteAnnotationMutation } from '@/features/annotations/annotationApi';
import { Trash2, Shapes } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AnnotationSidebar = () => {
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const { data: annotations = [] } = useGetAnnotationsQuery();
  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation();

  const currentAnnotations = annotations.filter(a => a.image === selectedImageId);

  const handleDelete = async (id: number) => {
    if (selectedImageId) {
      await deleteAnnotation({ id, imageId: selectedImageId });
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col w-full h-full">
      <div className="p-5 border-b border-gray-100 flex items-center gap-2">
        <Shapes className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-800">Saved Polygons</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {currentAnnotations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <Shapes className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">No polygons drawn on this image yet.</p>
          </div>
        ) : (
          currentAnnotations.map((ann, idx) => (
            <div key={ann.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100 group hover:border-blue-200 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shadow-sm">
                  {idx + 1}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Polygon {ann.id}
                  <p className="text-[10px] text-gray-400 font-normal">{ann.polygon_points.length} points</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
                onClick={() => handleDelete(ann.id)}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

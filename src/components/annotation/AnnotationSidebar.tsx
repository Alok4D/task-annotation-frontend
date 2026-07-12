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
      await deleteAnnotation(id);
    }
  };

  const savedColors = ['#a855f7', '#22c55e', '#f97316', '#3b82f6', '#ec4899'];

  return (
    <div className="flex-1 bg-white flex flex-col w-full h-full text-gray-800">
      <div className="px-5 py-6 flex items-center gap-2">
        <h3 className="font-bold text-gray-800">Annotations</h3>
      </div>
      
      <div className="flex-1 px-5 pb-5 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
        {currentAnnotations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <Shapes className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No polygons drawn.</p>
          </div>
        ) : (
          currentAnnotations.map((ann, idx) => {
            const color = savedColors[idx % savedColors.length];
            return (
            <div key={ann.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between group hover:bg-gray-100 transition-colors border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}></div>
                <div className="text-sm font-medium text-gray-700">
                  Polygon {idx + 1}
                </div>
              </div>
              
              <button 
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all"
                onClick={() => handleDelete(ann.id)}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { useGetImagesQuery, useGetAnnotationsQuery, useSaveAnnotationMutation } from '@/features/annotations/annotationApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Toolbar, DrawingTool } from './Toolbar';
import { ZoomIn, ZoomOut } from 'lucide-react';

export const Canvas = ({ children }: { children?: React.ReactNode }) => {
  const stageRef = useRef<any>(null);
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const { data: images = [] } = useGetImagesQuery();
  const { data: annotations = [] } = useGetAnnotationsQuery();
  const [saveAnnotation, { isLoading: isSaving }] = useSaveAnnotationMutation();

  const selectedImage = images.find(img => img.id === selectedImageId);
  const imageUrl = selectedImage ? (selectedImage.image.startsWith('http') ? selectedImage.image : `http://127.0.0.1:8000${selectedImage.image}`) : '';
  
  const [image] = useImage(imageUrl, 'anonymous');
  
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  
  const [activeTool, setActiveTool] = useState<DrawingTool>('DRAW');
  const [activeColor, setActiveColor] = useState('#673de6');
  const [activeSize, setActiveSize] = useState(4);

  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const currentAnnotations = annotations.filter(a => a.image === selectedImageId);

  useEffect(() => {
    setPoints([]);
    setIsFinished(false);
    setScale(1);
    setStagePos({ x: 0, y: 0 });
  }, [selectedImageId]);

  const handleStageClick = (e: any) => {
    if (activeTool !== 'DRAW' || isFinished) return;
    
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const currentStageScale = stage.scaleX();
    const x = (pointerPos.x - stage.x()) / currentStageScale;
    const y = (pointerPos.y - stage.y()) / currentStageScale;

    if (points.length >= 3) {
      const startPoint = points[0];
      const dx = x - startPoint.x;
      const dy = y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 10 / scale) {
        setIsFinished(true);
        return;
      }
    }
    setPoints([...points, { x, y }]);
  };

  const handleUndo = () => {
    if (isFinished) setIsFinished(false);
    else setPoints(points.slice(0, -1));
  };

  const handleSave = async () => {
    if (points.length > 2 && selectedImageId) {
      try {
        await saveAnnotation({
          image: selectedImageId,
          polygon_points: points,
        }).unwrap();
        setPoints([]);
        setIsFinished(false);
      } catch (err) {
        console.error('Failed to save annotation', err);
      }
    }
  };

  const handleDownload = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'annotated-image.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    
    const currentStageScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / currentStageScale - stage.x() / currentStageScale,
      y: stage.getPointerPosition().y / currentStageScale - stage.y() / currentStageScale,
    };
    
    const newScale = e.evt.deltaY < 0 ? scale * scaleBy : scale / scaleBy;
    const newStageScale = (image && image.width > 800 ? 800 / image.width : 1) * newScale;

    setScale(newScale);
    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newStageScale) * newStageScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newStageScale) * newStageScale,
    });
  };

  if (!selectedImage) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <p className="text-gray-400 font-medium">Select an image to start annotating</p>
      </div>
    );
  }

  const flatPoints = points.flatMap(p => [p.x, p.y]);
  if (isFinished && points.length > 0) {
    flatPoints.push(points[0].x, points[0].y);
  }

  const baseScale = image && image.width > 800 ? 800 / image.width : 1;

  // A distinct color palette for saved polygons to match the mockup
  const savedColors = ['#a855f7', '#22c55e', '#f97316', '#3b82f6', '#ec4899'];

  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Drawing Area */}
      <div 
        className="flex-1 bg-gray-50/50 relative flex items-center justify-center overflow-hidden shadow-inner"
        style={{ backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      >
        
        {/* Floating Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-2 py-1.5 border border-gray-200 shadow-sm">
           <button onClick={() => setScale(Math.max(0.1, scale / 1.1))} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"><ZoomOut className="w-4 h-4"/></button>
           <span className="text-xs font-bold px-2 text-gray-700 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
           <button onClick={() => setScale(scale * 1.1)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"><ZoomIn className="w-4 h-4"/></button>
        </div>

        {image ? (
          <div className={`transition-shadow shadow-xl bg-white border border-gray-200 hover:shadow-2xl ${activeTool === 'DRAW' ? 'cursor-crosshair' : activeTool === 'PAN' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}>
            <Stage
              ref={stageRef}
              width={image.width * baseScale}
              height={image.height * baseScale}
              scaleX={baseScale * scale}
              scaleY={baseScale * scale}
              x={stagePos.x}
              y={stagePos.y}
              draggable={activeTool === 'PAN'}
              onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
              onClick={handleStageClick}
              onWheel={handleWheel}
            >
              <Layer>
                <KonvaImage image={image} />
                
                {currentAnnotations.map((ann, idx) => {
                  const savedFlatPoints = ann.polygon_points.flatMap(p => [p.x, p.y]);
                  savedFlatPoints.push(ann.polygon_points[0].x, ann.polygon_points[0].y);
                  const color = savedColors[idx % savedColors.length];
                  
                  return (
                    <React.Fragment key={ann.id}>
                      <Line
                        points={savedFlatPoints}
                        stroke={color} 
                        strokeWidth={3 / scale}
                        closed
                        fill={`${color}40`} // 25% opacity
                      />
                      {ann.polygon_points.map((p, i) => (
                        <Circle
                          key={i}
                          x={p.x}
                          y={p.y}
                          radius={3 / scale}
                          fill="#FFFFFF"
                          stroke={color}
                          strokeWidth={1.5 / scale}
                        />
                      ))}
                    </React.Fragment>
                  );
                })}

                {points.length > 0 && (
                  <>
                    <Line
                      points={flatPoints}
                      stroke={activeColor}
                      strokeWidth={activeSize / scale}
                      dash={isFinished ? [] : [10 / scale, 10 / scale]}
                      closed={isFinished}
                      fill={isFinished ? `${activeColor}40` : undefined}
                    />
                    {points.map((p, i) => (
                      <Circle
                        key={i}
                        x={p.x}
                        y={p.y}
                        radius={i === 0 && !isFinished ? (activeSize * 1.5 / scale) : (activeSize / scale)}
                        fill={i === 0 && !isFinished ? activeColor : "#FFFFFF"}
                        stroke={activeColor}
                        strokeWidth={2 / scale}
                      />
                    ))}
                  </>
                )}
              </Layer>
            </Stage>
          </div>
        ) : (
          <p className="text-gray-600">Loading image on canvas...</p>
        )}
      </div>

      {/* Right Sidebar Composite (Tools + Annotations) */}
      <div className="flex shrink-0 w-[420px] bg-white border-l border-gray-200 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        
        <div className="w-[180px]">
          <Toolbar 
            activeTool={activeTool} 
            onToolChange={setActiveTool}
            activeColor={activeColor}
            onColorChange={setActiveColor}
            activeSize={activeSize}
            onSizeChange={setActiveSize}
            onUndo={handleUndo}
            canUndo={points.length > 0}
            onDelete={() => { setPoints([]); setIsFinished(false); }}
            canDelete={points.length > 0}
            onSave={handleSave}
            canSave={points.length > 2 && !isSaving}
            onDownload={handleDownload}
          />
        </div>

        <div className="flex-1 border-l border-gray-200 bg-white flex flex-col">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
          <div className="p-4 mt-auto border-t border-gray-100">
            <button 
              onClick={handleSave} 
              disabled={points.length < 3 || isSaving} 
              className="w-full flex items-center justify-center gap-2 bg-[#673de6] hover:bg-[#532cc2] text-white py-3.5 rounded-md text-sm font-bold transition-all disabled:opacity-50 disabled:hover:bg-[#673de6] shadow-lg shadow-[#673de6]/20 active:scale-95"
            >
              Save Annotations
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

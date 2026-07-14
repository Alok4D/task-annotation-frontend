'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle, Group, Transformer } from 'react-konva';
import useImage from 'use-image';
import { 
  useGetImagesQuery, 
  useGetAnnotationsQuery, 
  useSaveAnnotationMutation,
  useUpdateAnnotationMutation,
  useDeleteAnnotationMutation
} from '@/features/annotations/annotationApi';
import { EraserLine, PenLine, PenType, LineStyle, Annotation } from '@/types/annotation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Toolbar, DrawingTool } from './Toolbar';
import { ZoomIn, ZoomOut, ChevronUp, ChevronDown, Layers, Download, Trash2 } from 'lucide-react';
import { API_URL } from '@/config/env';
import { cn } from '@/utils/cn';

const getPenProps = (line: PenLine, scale: number) => {
  let props: any = {
    stroke: line.color,
    strokeWidth: (line.size * 2) / scale,
    tension: 0.5,
    lineCap: 'round',
    lineJoin: 'round',
    globalCompositeOperation: 'source-over',
    opacity: 1,
    dash: [],
    shadowBlur: 0
  };

  if (line.style === 'DASHED') {
    props.dash = [15 / scale, 10 / scale];
  } else if (line.style === 'DOTTED') {
    props.dash = [2 / scale, (line.size * 2 + 5) / scale];
    props.lineCap = 'round';
  }

  switch (line.type) {
    case 'HIGHLIGHTER':
      props.globalCompositeOperation = 'multiply';
      props.opacity = 0.5;
      props.strokeWidth = (line.size * 4) / scale;
      break;
    case 'MARKER':
      props.opacity = 0.8;
      props.strokeWidth = (line.size * 3) / scale;
      break;
    case 'PENCIL':
      props.strokeWidth = (line.size * 0.8) / scale;
      props.opacity = 0.55;
      props.dash = [0.5 / scale, 1.5 / scale];
      props.lineCap = 'round';
      break;
    case 'BALLPEN':
    default:
      break;
  }
  return props;
};

export const Canvas = ({ children }: { children?: React.ReactNode }) => {
  
  const stageRef = useRef<any>(null);
  const mobileLayersRef = useRef<HTMLDivElement>(null);
  const selectedImageId = useSelector((state: RootState) => state.annotations.selectedImageId);
  const { data: images = [] } = useGetImagesQuery();
  const { data: annotations = [] } = useGetAnnotationsQuery();
  const [saveAnnotation, { isLoading: isSaving }] = useSaveAnnotationMutation();
  const [updateAnnotation] = useUpdateAnnotationMutation();
  const [deleteAnnotation] = useDeleteAnnotationMutation();

  const selectedImage = images.find(img => img.id === selectedImageId);
  const imageUrl = selectedImage ? (selectedImage.image.startsWith('http') ? selectedImage.image : `${API_URL}${selectedImage.image}`) : '';
  
  const [image] = useImage(imageUrl, 'anonymous');
  const baseScale = image && image.width > 800 ? 800 / image.width : 1;
  
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [eraserLines, setEraserLines] = useState<EraserLine[]>([]);
  const [penLines, setPenLines] = useState<PenLine[]>([]);
  const isErasing = useRef(false);
  const isPenning = useRef(false);
  const isMiddleClickPanning = useRef(false);
  
  const [activeTool, setActiveTool] = useState<DrawingTool>('DRAW');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tempPoints, setTempPoints] = useState<{ x: number; y: number }[] | null>(null);
  const [activeColor, setActiveColor] = useState('#673de6');
  const [activeSize, setActiveSize] = useState(4);
  const [activePenType, setActivePenType] = useState<PenType>('BALLPEN');
  const [activeLineStyle, setActiveLineStyle] = useState<LineStyle>('SOLID');

  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [isPanningEnabled, setIsPanningEnabled] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const currentAnnotations = annotations.filter(a => a.image === selectedImageId);

  useEffect(() => {
    setPoints([]);
    setIsFinished(false);
    setEraserLines([]);
    setPenLines([]);
    setSelectedId(null);
    setTempPoints(null);
  }, [selectedImageId]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMiddleClickPanning.current) {
        isMiddleClickPanning.current = false;
        setIsPanningEnabled(false);
        if (stageRef.current) {
          stageRef.current.stopDrag();
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (image && dimensions.width > 0 && dimensions.height > 0) {
      const imgWidth = image.width * baseScale;
      const imgHeight = image.height * baseScale;
      
      const fitScale = Math.min(
        (dimensions.width - 40) / imgWidth,
        (dimensions.height - 40) / imgHeight,
        1
      );
      
      const x = (dimensions.width - imgWidth * fitScale) / 2;
      const y = (dimensions.height - imgHeight * fitScale) / 2;
      
      setScale(fitScale);
      setStagePos({ x, y });
    }
  }, [selectedImageId, image, dimensions.width, dimensions.height]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobileLayersRef.current && !mobileLayersRef.current.contains(event.target as Node)) {
        setIsMobileToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const hasCompletePolygon = points.length >= 3 && isFinished;
    
    if (hasCompletePolygon && selectedImageId && !isSaving) {
      handleSave();
    }
  }, [points, isFinished, selectedImageId, isSaving]);

  const handleStageMouseDown = (e: any) => {
    const isMiddleButton = e.evt && (e.evt.button === 1 || e.evt.which === 2);
    if (isMiddleButton) {
      e.evt.preventDefault();
      isMiddleClickPanning.current = true;
      setIsPanningEnabled(true);
      const stage = e.target.getStage();
      if (stage) {
        stage.startDrag();
      }
      return;
    }

    const clickedOnEmpty = e.target === e.target.getStage() || e.target.className === 'Image';
    if (clickedOnEmpty && activeTool === 'SELECT') {
      setIsPanningEnabled(true);
    } else {
      setIsPanningEnabled(false);
    }

    if (activeTool === 'ERASER') {
      setIsDrawingActive(true);
      isErasing.current = true;
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      const currentStageScale = stage.scaleX();
      const x = (pointerPos.x - stage.x()) / currentStageScale;
      const y = (pointerPos.y - stage.y()) / currentStageScale;
      setEraserLines([...eraserLines, { points: [x, y], size: activeSize }]);
      return;
    }
    
    if (activeTool === 'PEN') {
      setIsDrawingActive(true);
      isPenning.current = true;
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      const currentStageScale = stage.scaleX();
      const x = (pointerPos.x - stage.x()) / currentStageScale;
      const y = (pointerPos.y - stage.y()) / currentStageScale;
      setPenLines([...penLines, { points: [x, y], size: activeSize, color: activeColor, type: activePenType, style: activeLineStyle }]);
      return;
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (activeTool === 'ERASER' && isErasing.current) {
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      const currentStageScale = stage.scaleX();
      const x = (pointerPos.x - stage.x()) / currentStageScale;
      const y = (pointerPos.y - stage.y()) / currentStageScale;
      
      let lastLine = { ...eraserLines[eraserLines.length - 1] };
      lastLine.points = lastLine.points.concat([x, y]);
      
      const newLines = [...eraserLines];
      newLines.splice(eraserLines.length - 1, 1, lastLine);
      setEraserLines(newLines);
      return;
    }

    if (activeTool === 'PEN' && isPenning.current) {
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      const currentStageScale = stage.scaleX();
      const x = (pointerPos.x - stage.x()) / currentStageScale;
      const y = (pointerPos.y - stage.y()) / currentStageScale;
      
      let lastLine = { ...penLines[penLines.length - 1] };
      lastLine.points = lastLine.points.concat([x, y]);
      
      const newLines = [...penLines];
      newLines.splice(penLines.length - 1, 1, lastLine);
      setPenLines(newLines);
      return;
    }
  };

  const handleStageMouseUp = () => {
    if (isMiddleClickPanning.current) {
      isMiddleClickPanning.current = false;
      setIsPanningEnabled(false);
      if (stageRef.current) {
        stageRef.current.stopDrag();
      }
    }
    setIsPanningEnabled(false);
    setIsDrawingActive(false);
    isErasing.current = false;
    isPenning.current = false;
  };

  const handleStageClick = (e: any) => {
    if (activeTool === 'SELECT') {
      const clickedOnEmpty = e.target === e.target.getStage() || e.target.className === 'Image';
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

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

  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (activeTool === 'SELECT' && selectedId && transformerRef.current) {
      const stage = stageRef.current;
      const node = stage.findOne(`#group-${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.forceUpdate();
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, activeTool, annotations]);

  const handleSelectionDelete = async () => {
    if (selectedId) {
      try {
        await deleteAnnotation(selectedId).unwrap();
        setSelectedId(null);
      } catch (err) {
        console.error('Failed to delete annotation', err);
      }
    }
  };

  const handleGroupDragEnd = async (e: any, ann: Annotation) => {
    const node = e.currentTarget;
    const x = node.x();
    const y = node.y();

    node.x(0);
    node.y(0);

    const updatedPolygonPoints = ann.polygon_points?.map(p => ({
      x: p.x + x,
      y: p.y + y
    }));

    const updatedPenLines = ann.pen_lines?.map(line => ({
      ...line,
      points: line.points.map((val, idx) => idx % 2 === 0 ? val + x : val + y)
    }));

    const updatedEraserLines = ann.eraser_lines?.map(line => ({
      ...line,
      points: line.points.map((val, idx) => idx % 2 === 0 ? val + x : val + y)
    }));

    try {
      await updateAnnotation({
        id: ann.id,
        body: {
          polygon_points: updatedPolygonPoints
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to update annotation after drag', err);
    }
  };

  const handleGroupTransformEnd = async (e: any, ann: Annotation) => {
    const node = e.currentTarget;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const x = node.x();
    const y = node.y();

    node.scaleX(1);
    node.scaleY(1);
    node.x(0);
    node.y(0);

    // Compute new points
    const updatedPolygonPoints = ann.polygon_points?.map(p => ({
      x: p.x * scaleX + x,
      y: p.y * scaleY + y
    }));

    const updatedPenLines = ann.pen_lines?.map(line => ({
      ...line,
      points: line.points.map((val, idx) => idx % 2 === 0 ? val * scaleX + x : val * scaleY + y)
    }));

    const updatedEraserLines = ann.eraser_lines?.map(line => ({
      ...line,
      points: line.points.map((val, idx) => idx % 2 === 0 ? val * scaleX + x : val * scaleY + y)
    }));

    try {
      await updateAnnotation({
        id: ann.id,
        body: {
          polygon_points: updatedPolygonPoints
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to update annotation after transform', err);
    }
  };

  const getSelectedAnnotationBounds = () => {
    if (!selectedId) return null;
    const ann = annotations.find(a => a.id === selectedId);
    if (!ann) return null;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    const polyPoints = (tempPoints && ann.id === selectedId) ? tempPoints : ann.polygon_points;

    if (polyPoints && polyPoints.length > 0) {
      polyPoints.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    }

    ann.pen_lines?.forEach(line => {
      for (let i = 0; i < line.points.length; i += 2) {
        const x = line.points[i];
        const y = line.points[i+1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    });

    ann.eraser_lines?.forEach(line => {
      for (let i = 0; i < line.points.length; i += 2) {
        const x = line.points[i];
        const y = line.points[i+1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    });

    if (minX === Infinity) return null;
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const clampStagePos = (pos: { x: number; y: number }) => {
    if (!image || dimensions.width === 0 || dimensions.height === 0) return pos;
    const viewportWidth = dimensions.width;
    const viewportHeight = dimensions.height;
    const stageWidth = image.width * baseScale * scale;
    const stageHeight = image.height * baseScale * scale;
    
    // Keep at least 50px of the image visible inside the viewport
    const minX = -stageWidth + 50;
    const maxX = viewportWidth - 50;
    const minY = -stageHeight + 50;
    const maxY = viewportHeight - 50;
    
    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y))
    };
  };

  useEffect(() => {
    if (image) {
      const clamped = clampStagePos(stagePos);
      if (clamped.x !== stagePos.x || clamped.y !== stagePos.y) {
        setStagePos(clamped);
      }
    }
  }, [scale]);

  const handleUndo = () => {
    if (activeTool === 'ERASER' && eraserLines.length > 0) {
      setEraserLines(eraserLines.slice(0, -1));
    } else if (activeTool === 'PEN' && penLines.length > 0) {
      setPenLines(penLines.slice(0, -1));
    } else if (activeTool === 'DRAW') {
      if (isFinished) setIsFinished(false);
      else setPoints(points.slice(0, -1));
    }
  };

  const handleSave = async () => {
    if (points.length > 2 && selectedImageId) {
      try {
        await saveAnnotation({
          image: selectedImageId,
          polygon_points: points
        }).unwrap();
        setPoints([]);
        setIsFinished(false);
        setEraserLines([]);
        setPenLines([]);
      } catch (err) {
        console.error('Failed to save annotation', err);
      }
    }
  };

  const handleDownload = () => {
    if (stageRef.current) {
      if (transformerRef.current) {
        transformerRef.current.hide();
      }

      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'annotated-image.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (transformerRef.current) {
        transformerRef.current.show();
      }
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

  // A distinct color palette for saved polygons to match the mockup
  const savedColors = ['#a855f7', '#22c55e', '#f97316', '#3b82f6', '#ec4899'];

  const bounds = getSelectedAnnotationBounds();

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative w-full h-full">
      
      <div 
        ref={containerRef}
        className="flex-1 bg-slate-50 relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        
        {/* Floating Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-2 py-1.5 border border-gray-200 shadow-sm">
           <button onClick={() => setScale(Math.max(0.1, scale / 1.1))} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"><ZoomOut className="w-4 h-4"/></button>
           <span className="text-xs font-bold px-2 text-gray-700 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
           <button onClick={() => setScale(scale * 1.1)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"><ZoomIn className="w-4 h-4"/></button>
           
           {/* Mobile Download Button */}
           <button 
             onClick={handleDownload}
             className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors border-l border-gray-200 pl-2 ml-1"
             title="Download Image"
           >
             <Download className="w-4 h-4" />
           </button>
        </div>

        {image ? (
          <div className={`${activeTool === 'DRAW' ? 'cursor-crosshair' : activeTool === 'PAN' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}>
            <Stage
              ref={stageRef}
              width={dimensions.width || 800}
              height={dimensions.height || 600}
              scaleX={baseScale * scale}
              scaleY={baseScale * scale}
              x={stagePos.x}
              y={stagePos.y}
              draggable={activeTool === 'PAN' || (activeTool === 'SELECT' && isPanningEnabled)}
              onDragEnd={(e) => {
                if (e.target === e.target.getStage()) {
                  setStagePos({ x: e.target.x(), y: e.target.y() });
                }
              }}
              onClick={handleStageClick}
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
              onTouchStart={handleStageMouseDown}
              onTouchEnd={handleStageMouseUp}
              onWheel={handleWheel}
            >
              <Layer>
                <KonvaImage image={image} />
              </Layer>
              <Layer>
                {currentAnnotations.map((ann, idx) => {
                  const hasPolygon = ann.polygon_points && ann.polygon_points.length > 0;
                  const polyPoints = (tempPoints && ann.id === selectedId) ? tempPoints : ann.polygon_points;
                  const savedFlatPoints = hasPolygon && polyPoints ? polyPoints.flatMap(p => [p.x, p.y]) : [];
                  if (hasPolygon && polyPoints && polyPoints.length > 0) {
                    savedFlatPoints.push(polyPoints[0].x, polyPoints[0].y);
                  }
                  const color = savedColors[idx % savedColors.length];
                  
                  return (
                    <Group
                      key={ann.id}
                      id={`group-${ann.id}`}
                      x={0}
                      y={0}
                      scaleX={1}
                      scaleY={1}
                      draggable={activeTool === 'SELECT' && selectedId === ann.id}
                      onDragMove={(e) => {
                        if (transformerRef.current) {
                          transformerRef.current.forceUpdate();
                        }
                      }}
                      onDragEnd={(e) => handleGroupDragEnd(e, ann)}
                      onTransform={(e) => {
                        if (transformerRef.current) {
                          transformerRef.current.forceUpdate();
                        }
                      }}
                      onTransformEnd={(e) => handleGroupTransformEnd(e, ann)}
                      onClick={() => {
                        if (activeTool === 'SELECT') {
                          setSelectedId(ann.id);
                        }
                      }}
                      onTap={() => {
                        if (activeTool === 'SELECT') {
                          setSelectedId(ann.id);
                        }
                      }}
                    >
                      {hasPolygon && polyPoints && (
                        <>
                          <Line
                            points={savedFlatPoints}
                            stroke={color} 
                            strokeWidth={3 / scale}
                            closed
                            fill={`${color}40`} // 25% opacity
                          />
                          {polyPoints.map((p, i) => (
                            <Circle
                              key={i}
                              x={p.x}
                              y={p.y}
                              radius={selectedId === ann.id ? 6 / scale : 3 / scale}
                              fill="#FFFFFF"
                              stroke={color}
                              strokeWidth={selectedId === ann.id ? 3 / scale : 1.5 / scale}
                              draggable={activeTool === 'SELECT' && selectedId === ann.id}
                              onDragMove={(e) => {
                                e.cancelBubble = true;
                                const localX = Math.max(0, Math.min(image.width, e.target.x()));
                                const localY = Math.max(0, Math.min(image.height, e.target.y()));
                                e.target.x(localX);
                                e.target.y(localY);

                                const newPoints = [...polyPoints];
                                newPoints[i] = { x: localX, y: localY };
                                setTempPoints(newPoints);

                                const group = e.target.getParent();
                                if (group) {
                                  group.clearCache();
                                }
                                if (transformerRef.current) {
                                  transformerRef.current.forceUpdate();
                                  transformerRef.current.getLayer().batchDraw();
                                }
                              }}
                              onDragEnd={async (e) => {
                                e.cancelBubble = true;
                                const localX = Math.max(0, Math.min(image.width, e.target.x()));
                                const localY = Math.max(0, Math.min(image.height, e.target.y()));
                                e.target.x(localX);
                                e.target.y(localY);

                                const newPoints = [...polyPoints];
                                newPoints[i] = { x: localX, y: localY };
                                try {
                                  await updateAnnotation({
                                    id: ann.id,
                                    body: { polygon_points: newPoints }
                                  }).unwrap();
                                } catch (err) {
                                  console.error(err);
                                }
                                setTempPoints(null);
                                const group = e.target.getParent();
                                if (group) {
                                  group.clearCache();
                                }
                                if (transformerRef.current) {
                                  transformerRef.current.forceUpdate();
                                  transformerRef.current.getLayer().batchDraw();
                                }
                              }}
                            />
                          ))}
                        </>
                      )}
                      
                      {/* Render saved pen lines for this annotation */}
                      {ann.pen_lines?.map((line, i) => (
                        <Line
                          key={`saved-pen-${ann.id}-${i}`}
                          points={line.points}
                          {...getPenProps(line, scale)}
                        />
                      ))}

                      {/* Render saved eraser lines for this annotation (erases polygons & pens) */}
                      {ann.eraser_lines?.map((line, i) => (
                        <Line
                          key={`saved-eraser-${ann.id}-${i}`}
                          points={line.points}
                          stroke="black"
                          strokeWidth={(line.size * 2) / scale}
                          tension={0.5}
                          lineCap="round"
                          lineJoin="round"
                          globalCompositeOperation="destination-out"
                        />
                      ))}
                    </Group>
                  );
                })}

                {activeTool === 'SELECT' && selectedId && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}

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

                {/* Render current drawing pen lines */}
                {penLines.map((line, i) => (
                  <Line
                    key={`pen-${i}`}
                    points={line.points}
                    {...getPenProps(line, scale)}
                  />
                ))}

                {/* Render current drawing eraser lines (erases polygons & pens) */}
                {eraserLines.map((line, i) => (
                  <Line
                    key={`eraser-${i}`}
                    points={line.points}
                    stroke="black"
                    strokeWidth={(line.size * 2) / scale}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation="destination-out"
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        ) : (
          <p className="text-gray-600">Loading image on canvas...</p>
        )}

        {activeTool === 'SELECT' && selectedId && bounds && (
          <div 
            className="absolute z-30 animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${(bounds.x + bounds.width / 2) * baseScale * scale + stagePos.x}px`,
              top: `${bounds.y * baseScale * scale + stagePos.y - 45}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <button 
              onClick={handleSelectionDelete}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg transition-transform active:scale-95 whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Desktop Right Sidebar (Tools + Annotations) */}
      <div className="hidden md:flex shrink-0 w-[420px] bg-white border-l border-gray-200 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        <div className="w-[180px] shrink-0">
          <Toolbar 
            activeTool={activeTool} 
            onToolChange={setActiveTool}
            activeColor={activeColor}
            onColorChange={setActiveColor}
            activeSize={activeSize}
            onSizeChange={setActiveSize}
            onUndo={handleUndo}
            canUndo={points.length > 0 || eraserLines.length > 0 || penLines.length > 0}
            onDelete={() => { setPoints([]); setIsFinished(false); setPenLines([]); setEraserLines([]); }}
            canDelete={points.length > 0 || penLines.length > 0 || eraserLines.length > 0}
            onSave={handleSave}
            canSave={(points.length > 2 || eraserLines.length > 0 || penLines.length > 0) && !isSaving}
            onDownload={handleDownload}
            activePenType={activePenType}
            onPenTypeChange={setActivePenType}
            activeLineStyle={activeLineStyle}
            onLineStyleChange={setActiveLineStyle}
            onClearEraser={() => setEraserLines([])}
          />
        </div>
        <div className="flex-1 border-l border-gray-200 bg-white flex flex-col min-w-0">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Floating Toolbar & Dropdown */}
      <div 
        ref={mobileLayersRef}
        className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-32px)] z-40 transition-transform duration-300"
      >
        {/* Mobile Annotations Dropdown/Popup (opens above the toolbar) */}
        <div className={cn(
          "absolute bottom-full right-0 mb-3 bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-bottom z-50 w-64 max-h-[40vh] flex flex-col",
          isMobileToolsOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        )}>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>

        <Toolbar 
          activeTool={activeTool} 
          onToolChange={setActiveTool}
          activeColor={activeColor}
          onColorChange={setActiveColor}
          activeSize={activeSize}
          onSizeChange={setActiveSize}
          onUndo={handleUndo}
          canUndo={points.length > 0 || eraserLines.length > 0 || penLines.length > 0}
          onDelete={() => { setPoints([]); setIsFinished(false); setPenLines([]); setEraserLines([]); }}
          canDelete={points.length > 0 || penLines.length > 0 || eraserLines.length > 0}
          onSave={handleSave}
          canSave={(points.length > 2 || eraserLines.length > 0 || penLines.length > 0) && !isSaving}
          onDownload={handleDownload}
          activePenType={activePenType}
          onPenTypeChange={setActivePenType}
          activeLineStyle={activeLineStyle}
          onLineStyleChange={setActiveLineStyle}
          onClearEraser={() => setEraserLines([])}
          onToggleDrawer={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
          isDrawerOpen={isMobileToolsOpen}
        />
      </div>
    </div>
  );
};

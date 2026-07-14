'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { 
  MousePointer2, Trash2, Undo2, Hand, Pentagon,
  Save, Download,
  ChevronUp,
  ChevronDown,
  Eraser,
  PenTool,
  Minus,
  Layers
} from 'lucide-react';
import { PenType, LineStyle } from '@/types/annotation';

export type DrawingTool = 'DRAW' | 'SELECT' | 'PAN' | 'ERASER' | 'PEN';

interface ToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  activeSize: number;
  onSizeChange: (size: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  onDelete: () => void;
  canDelete: boolean;
  onSave: () => void;
  canSave: boolean;
  onDownload?: () => void;
  onToggleDrawer?: () => void;
  isDrawerOpen?: boolean;
  activePenType: PenType;
  onPenTypeChange: (type: PenType) => void;
  activeLineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
  onClearEraser?: () => void;
}

const TOOLS = [
  { id: 'SELECT', icon: MousePointer2, label: 'Select' },
  { id: 'DRAW', icon: Pentagon, label: 'Polygon' },
  { id: 'PEN', icon: PenTool, label: 'Pen' },
  { id: 'ERASER', icon: Eraser, label: 'Eraser' },
  { id: 'PAN', icon: Hand, label: 'Pan' }
] as const;

const COLORS = [
  '#000000', '#5F6368', '#4285F4', '#34A853', 
  '#FBBC05', '#EA4335', '#9C27B0', '#FFFFFF'
];

const SIZES = [
  { id: 'S', val: 2 },
  { id: 'M', val: 4 },
  { id: 'L', val: 8 },
];

const PEN_TYPES: { id: PenType; label: string }[] = [
  { id: 'BALLPEN', label: 'Ball Pen' },
  { id: 'HIGHLIGHTER', label: 'Highlighter' },
  { id: 'MARKER', label: 'Marker' },
  { id: 'PENCIL', label: 'Pencil' },
];

const LINE_STYLES: { id: LineStyle; label: string }[] = [
  { id: 'SOLID', label: 'Solid' },
  { id: 'DASHED', label: 'Dashed' },
  { id: 'DOTTED', label: 'Dotted' },
];

export const Toolbar = ({
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
  activeSize,
  onSizeChange,
  onUndo,
  canUndo,
  onDelete,
  canDelete,
  onSave,
  canSave,
  onDownload,
  onToggleDrawer,
  isDrawerOpen,
  activePenType,
  onPenTypeChange,
  activeLineStyle,
  onLineStyleChange,
  onClearEraser
}: ToolbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<'COLOR' | 'SIZE' | 'PENTYPE' | 'LINESTYLE' | null>(null);
  const [mobileMenuFor, setMobileMenuFor] = useState<DrawingTool | null>(null);
  
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // If click is outside both desktopRef and mobileRef, close all menus
      const outsideDesktop = !desktopRef.current || !desktopRef.current.contains(event.target as Node);
      const outsideMobile = !mobileRef.current || !mobileRef.current.contains(event.target as Node);
      
      if (outsideDesktop && outsideMobile) {
        setOpenDropdown(null);
        setMobileMenuFor(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop Toolbar (Vertical) */}
      <div className="hidden md:flex flex-col h-full bg-white text-gray-600 font-sans border-r border-gray-200" ref={desktopRef}>
        <div className="flex-1 px-4 py-6 flex flex-col gap-2">
          <h3 className="font-bold text-gray-800 mb-2 px-2 text-sm">Tools</h3>
          
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id as DrawingTool)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium group",
                activeTool === tool.id 
                  ? "bg-[#673de6] text-white" 
                  : "hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <tool.icon className="w-5 h-5" strokeWidth={activeTool === tool.id ? 2.5 : 2} />
              {tool.label}
            </button>
          ))}

          <div className="w-full h-[1px] bg-gray-200 my-2"></div>

          {/* Color Selection (Only for DRAW and PEN) */}
          {(activeTool === 'DRAW' || activeTool === 'PEN') && (
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'COLOR' ? null : 'COLOR')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: activeColor }} />
                </div>
                Color
              </button>
              {openDropdown === 'COLOR' && (
                <div className="absolute right-full top-0 mr-2 bg-white border border-gray-200 shadow-xl rounded-2xl p-3 grid grid-cols-4 gap-2 w-[140px] z-50">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => { onColorChange(color); setOpenDropdown(null); }}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all border border-gray-200 shadow-sm",
                        activeColor === color ? "scale-110 ring-2 ring-[#673de6] ring-offset-2" : "hover:scale-110 hover:shadow-md"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Size (Not for SELECT or PAN) */}
          {activeTool !== 'SELECT' && activeTool !== 'PAN' && (
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'SIZE' ? null : 'SIZE')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="w-5 h-5 flex items-center justify-center font-bold text-[11px] text-gray-700">
                  {SIZES.find(s => s.val === activeSize)?.id || 'M'}
                </div>
                Size
              </button>
              {openDropdown === 'SIZE' && (
                <div className="absolute right-full top-0 mr-2 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-24 z-50">
                  {SIZES.map(size => (
                    <button
                      key={size.id}
                      onClick={() => { onSizeChange(size.val); setOpenDropdown(null); }}
                      className={cn(
                        "w-full px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors",
                        activeSize === size.val ? "bg-[#673de6]/10 text-[#673de6]" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {size.id} <span className="opacity-50 font-normal">{size.val}px</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTool === 'PEN' && (
            <>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'PENTYPE' ? null : 'PENTYPE')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900"
                >
                  <PenTool className="w-5 h-5 text-gray-500" />
                  {PEN_TYPES.find(p => p.id === activePenType)?.label}
                </button>
                
                {openDropdown === 'PENTYPE' && (
                  <div className="absolute right-full top-0 mr-2 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-32 z-50">
                    {PEN_TYPES.map(pt => (
                      <button
                        key={pt.id}
                        onClick={() => { onPenTypeChange(pt.id); setOpenDropdown(null); }}
                        className={cn(
                          "w-full px-3 py-1.5 text-xs font-semibold rounded-lg text-left transition-colors",
                          activePenType === pt.id ? "bg-[#673de6]/10 text-[#673de6]" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'LINESTYLE' ? null : 'LINESTYLE')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900"
                >
                  <Minus className="w-5 h-5 text-gray-500" />
                  {LINE_STYLES.find(l => l.id === activeLineStyle)?.label}
                </button>
                
                {openDropdown === 'LINESTYLE' && (
                  <div className="absolute right-full top-0 mr-2 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-32 z-50">
                    {LINE_STYLES.map(ls => (
                      <button
                        key={ls.id}
                        onClick={() => { onLineStyleChange(ls.id); setOpenDropdown(null); }}
                        className={cn(
                          "w-full px-3 py-1.5 text-xs font-semibold rounded-lg text-left transition-colors",
                          activeLineStyle === ls.id ? "bg-[#673de6]/10 text-[#673de6]" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {ls.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="w-full h-[1px] bg-gray-200 my-2"></div>

          <button onClick={onDelete} disabled={!canDelete} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"><Trash2 className="w-5 h-5" /> Delete</button>
          <button onClick={onUndo} disabled={!canUndo} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"><Undo2 className="w-5 h-5" /> Undo</button>
          <button onClick={onSave} disabled={!canSave} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"><Save className="w-5 h-5" /> Save</button>
          {onDownload && <button onClick={onDownload} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900"><Download className="w-5 h-5" /> Download</button>}
        </div>
      </div>

      {/* Mobile Toolbar (Floating Horizontal) */}
      <div 
        ref={mobileRef} 
        className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-md border border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-full relative"
      >
        {TOOLS.filter(t => t.id !== 'PAN').map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              if (tool.id === 'SELECT') {
                onToolChange(tool.id as DrawingTool);
                setMobileMenuFor(null);
              } else if (activeTool === tool.id) {
                setMobileMenuFor(mobileMenuFor === tool.id ? null : tool.id);
              } else {
                onToolChange(tool.id as DrawingTool);
                setMobileMenuFor(null);
              }
            }}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all",
              activeTool === tool.id 
                ? "bg-[#673de6] text-white shadow-md shadow-[#673de6]/30" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <tool.icon className="w-5 h-5" strokeWidth={activeTool === tool.id ? 2.5 : 2} />
          </button>
        ))}

        {/* Dynamic Mobile Popover Centered relative to the toolbar */}
        {mobileMenuFor && mobileMenuFor !== 'SELECT' && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white border border-gray-200 shadow-xl rounded-2xl p-4 flex flex-col gap-4 w-64 z-50">
            
            {/* Size Slider (For all tools except SELECT/PAN) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                <span>Size</span>
                <span className="text-[#673de6]">{activeSize}px</span>
              </div>
              <input 
                type="range" 
                min="1" max="20" 
                value={activeSize} 
                onChange={(e) => onSizeChange(Number(e.target.value))}
                className="w-full accent-[#673de6]"
              />
            </div>

            {/* Color (Only for DRAW and PEN, hide for ERASER) */}
            {(mobileMenuFor === 'DRAW' || mobileMenuFor === 'PEN') && (
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-gray-500 uppercase">Color</div>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => onColorChange(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all border border-gray-200",
                        activeColor === color ? "scale-110 ring-2 ring-[#673de6] ring-offset-2" : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pen Settings (For PEN) */}
            {mobileMenuFor === 'PEN' && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-gray-500 uppercase">Type</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PEN_TYPES.map(pt => (
                      <button
                        key={pt.id}
                        onClick={() => onPenTypeChange(pt.id)}
                        className={cn(
                          "px-2 py-1.5 text-[11px] font-semibold rounded-lg text-center transition-colors",
                          activePenType === pt.id ? "bg-[#673de6]/10 text-[#673de6]" : "bg-gray-50 text-gray-600 border border-gray-100"
                        )}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-gray-500 uppercase">Style</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {LINE_STYLES.map(ls => (
                      <button
                        key={ls.id}
                        onClick={() => onLineStyleChange(ls.id)}
                        className={cn(
                          "px-2 py-1.5 text-[11px] font-semibold rounded-lg text-center transition-colors",
                          activeLineStyle === ls.id ? "bg-[#673de6]/10 text-[#673de6]" : "bg-gray-50 text-gray-600 border border-gray-100"
                        )}
                      >
                        {ls.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Clear All (For ERASER) */}
            {mobileMenuFor === 'ERASER' && onClearEraser && (
              <button 
                onClick={() => { onClearEraser(); setMobileMenuFor(null); }}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear All Erasers
              </button>
            )}
          </div>
        )}

        {/* Layer toggle button with Layers icon at the end of the mobile toolbar */}
        {onToggleDrawer && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button 
              onClick={onToggleDrawer}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                isDrawerOpen 
                  ? "bg-[#673de6] text-white shadow-md shadow-[#673de6]/30" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title="Toggle Layers"
            >
              <Layers className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </>
  );
};

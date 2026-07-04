'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { 
  ArrowUpRight, Trash2, Undo2, Redo2, Crop, 
  PaintBucket, Maximize, Sparkles, ChevronDown, 
  Layers, Eye, Share2, Copy, Download,
  Type, Minus, Pen, Highlighter, Square, Circle, 
  Image as ImageIcon, Edit3
} from 'lucide-react';

export type DrawingTool = 'DRAW' | 'SELECT' | 'PAN';

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
}

const TOOLS = [
  { id: 'SELECT', icon: ArrowUpRight, label: 'Arrow' },
  { id: 'DRAW', icon: Edit3, label: 'Polygon' },
  { id: 'PAN', icon: Pen, label: 'Pen' },
] as const;

const COLORS = [
  '#FFFFFF', '#000000', '#5F6368', '#9AA0A6',
  '#4285F4', '#34A853', '#FBBC05', '#FF9800',
  '#EA4335', '#E91E63', '#9C27B0'
];

const SIZES = [
  { id: 'XS', val: 2 },
  { id: 'SM', val: 4 },
  { id: 'MD', val: 6 },
  { id: 'LG', val: 8 },
  { id: 'XL', val: 12 },
  { id: 'XXL', val: 16 },
];

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

import { setSelectedImageId } from '@/features/annotations/annotationSlice';
import { useDispatch } from 'react-redux';

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
  canSave
}: ToolbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<'TOOL' | 'COLOR' | 'SIZE' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpenDropdown(null));

  const activeToolObj = TOOLS.find(t => t.id === activeTool) || TOOLS[0];
  const ActiveToolIcon = activeToolObj.icon;
  const activeSizeObj = SIZES.find(s => s.val === activeSize) || SIZES[3];
  const dispatch = useDispatch();

  const BtnClasses = "flex items-center justify-center h-[34px] px-3 bg-[#2F3136] hover:bg-[#3E4147] text-[#B3B4B5] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-[#2F3136]";
  const ActiveBtnClasses = "flex items-center justify-center h-[34px] px-3 bg-[#0D73ED] text-white transition-colors";

  return (
    <div className="w-full bg-[#1C1E21] h-[52px] flex items-center justify-between px-4 font-sans select-none text-sm border-b border-[#000000]" ref={dropdownRef}>
      
      {/* Left: Logo Area */}
      <div className="flex items-center gap-4 w-[250px]">
        <div 
          onClick={() => dispatch(setSelectedImageId(null))}
          className="text-white font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          title="Back to Dashboard"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L12 4L16 8L8 16L4 12Z" fill="#F44336"/>
            <path d="M12 4L20 12L12 20L4 12" stroke="#FFC107" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-lg tracking-tight">M</span>
        </div>
        <button className="flex items-center gap-2 bg-[#2F3136] hover:bg-[#3E4147] text-gray-300 px-3 h-[30px] rounded text-xs font-medium transition-colors">
          <Layers className="w-3.5 h-3.5" />
          Markups
        </button>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center gap-[1px] bg-[#18191B] p-[1px] rounded-[4px]">
          
          {/* Tool Dropdown */}
          <div className="relative">
            <button 
              className={cn("rounded-l-[3px] gap-1.5 w-16", openDropdown === 'TOOL' ? ActiveBtnClasses : BtnClasses)}
              onClick={() => setOpenDropdown(openDropdown === 'TOOL' ? null : 'TOOL')}
            >
              <ActiveToolIcon className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {openDropdown === 'TOOL' && (
              <div className="absolute top-[40px] left-0 w-[200px] bg-[#1F2124] border border-[#111] rounded shadow-2xl py-1 z-50">
                <button className="w-full flex items-center px-4 py-2 text-[13px] text-[#E0E0E0] hover:bg-[#2F3136] transition-colors"><Type className="w-4 h-4 mr-3 text-[#A0A0A0]" /> Text <span className="ml-auto text-xs text-gray-500">T</span></button>
                <button onClick={() => { onToolChange('SELECT'); setOpenDropdown(null); }} className="w-full flex items-center px-4 py-2 text-[13px] text-white bg-[#0D73ED] transition-colors"><ArrowUpRight className="w-4 h-4 mr-3" /> Arrow <span className="ml-auto text-xs text-white/70">A</span></button>
                <button onClick={() => { onToolChange('DRAW'); setOpenDropdown(null); }} className="w-full flex items-center px-4 py-2 text-[13px] text-[#E0E0E0] hover:bg-[#2F3136] transition-colors"><Edit3 className="w-4 h-4 mr-3 text-[#A0A0A0]" /> Polygon <span className="ml-auto text-xs text-gray-500">P</span></button>
                <button onClick={() => { onToolChange('PAN'); setOpenDropdown(null); }} className="w-full flex items-center px-4 py-2 text-[13px] text-[#E0E0E0] hover:bg-[#2F3136] transition-colors"><Pen className="w-4 h-4 mr-3 text-[#A0A0A0]" /> Pen <span className="ml-auto text-xs text-gray-500">M</span></button>
              </div>
            )}
          </div>

          {/* Color Dropdown */}
          <div className="relative">
            <button 
              className={cn("gap-1.5 w-16", openDropdown === 'COLOR' ? ActiveBtnClasses : BtnClasses)}
              onClick={() => setOpenDropdown(openDropdown === 'COLOR' ? null : 'COLOR')}
            >
              <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: activeColor }} />
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {openDropdown === 'COLOR' && (
              <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[164px] bg-[#1F2124] border border-[#111] rounded shadow-2xl p-3 z-50">
                <div className="grid grid-cols-4 gap-3 place-items-center">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => { onColorChange(color); setOpenDropdown(null); }}
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                        activeColor === color ? "ring-[3px] ring-[#0D73ED] ring-offset-2 ring-offset-[#1F2124]" : "hover:ring-[2px] hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-[#1F2124]"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Size Dropdown */}
          <div className="relative">
            <button 
              className={cn("gap-1.5 w-16", openDropdown === 'SIZE' ? ActiveBtnClasses : BtnClasses)}
              onClick={() => setOpenDropdown(openDropdown === 'SIZE' ? null : 'SIZE')}
            >
              <span className="text-[13px] font-semibold tracking-wide">{activeSizeObj.id}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {openDropdown === 'SIZE' && (
              <div className="absolute top-[40px] left-0 w-[180px] bg-[#1F2124] border border-[#111] rounded shadow-2xl py-1 z-50">
                {SIZES.map(size => (
                  <button
                    key={size.id}
                    onClick={() => { onSizeChange(size.val); setOpenDropdown(null); }}
                    className={cn(
                      "w-full flex items-center px-4 py-2.5 text-[13px] transition-colors",
                      activeSize === size.val ? "bg-[#0D73ED] text-white" : "text-[#B3B4B5] hover:bg-[#2F3136]"
                    )}
                  >
                    <span className={cn("w-8 font-bold", activeSize === size.val ? "text-white" : "text-[#E0E0E0]")}>{size.id}</span>
                    <span className="opacity-90 ml-1">Line Thickness</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-5 bg-[#404348] mx-1"></div>

          <button onClick={onDelete} disabled={!canDelete} className={cn(BtnClasses, "w-11 px-0")}><Trash2 className="w-4 h-4" /></button>
          <button onClick={onUndo} disabled={!canUndo} className={cn(BtnClasses, "w-11 px-0")}><Undo2 className="w-4 h-4" /></button>
          <button disabled className={cn(BtnClasses, "w-11 px-0")}><Redo2 className="w-4 h-4" /></button>
          <button disabled className={cn(BtnClasses, "w-11 px-0")}><Crop className="w-4 h-4" /></button>
          <button disabled className={cn(BtnClasses, "w-11 px-0")}><PaintBucket className="w-4 h-4" /></button>
          <button disabled className={cn(BtnClasses, "w-11 px-0")}><Maximize className="w-4 h-4" /></button>
          <button disabled className={cn(BtnClasses, "w-11 px-0 rounded-r-[3px]")}><Sparkles className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-2 w-[250px]">
        <button className="flex items-center gap-1.5 text-gray-400 hover:text-white px-2 py-1.5 text-xs font-semibold transition-colors">
          <Eye className="w-4 h-4" /> Public
        </button>
        <button className="flex items-center gap-1.5 bg-[#0D73ED] hover:bg-[#0b62cc] text-white px-3.5 h-[30px] rounded text-xs font-medium transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        <button className="flex items-center gap-1.5 bg-[#2F3136] hover:bg-[#3E4147] text-gray-300 px-3.5 h-[30px] rounded text-xs font-medium transition-colors">
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
        <button className="flex items-center gap-1.5 bg-[#2F3136] hover:bg-[#3E4147] text-gray-300 px-3.5 h-[30px] rounded text-xs font-medium transition-colors">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
        <button 
          onClick={onSave}
          disabled={!canSave}
          className="flex items-center gap-1.5 bg-[#00BFA5] hover:bg-[#00a891] text-white px-4 h-[30px] rounded text-xs font-bold transition-colors disabled:opacity-50 disabled:hover:bg-[#00BFA5]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

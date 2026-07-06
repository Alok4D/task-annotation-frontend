'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { 
  MousePointer2, Trash2, Undo2, Hand, Pentagon,
  Save
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
  { id: 'SELECT', icon: MousePointer2, label: 'Select (V)' },
  { id: 'DRAW', icon: Pentagon, label: 'Draw Polygon (P)' },
  { id: 'PAN', icon: Hand, label: 'Pan Canvas (H)' },
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
  const [openDropdown, setOpenDropdown] = useState<'COLOR' | 'SIZE' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpenDropdown(null));

  return (
    <div className="absolute left-6 top-6 flex flex-col gap-3 z-50 font-sans" ref={dropdownRef}>
      
      {/* Main Tool Panel */}
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 p-2 flex flex-col gap-1 w-[52px]">
        
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id as DrawingTool)}
            title={tool.label}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl transition-all relative group",
              activeTool === tool.id 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <tool.icon className="w-[18px] h-[18px]" strokeWidth={activeTool === tool.id ? 2.5 : 2} />
          </button>
        ))}

        <div className="w-6 h-[1px] bg-gray-200 mx-auto my-1 rounded-full"></div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'COLOR' ? null : 'COLOR')}
            title="Stroke Color"
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
              openDropdown === 'COLOR' ? "bg-gray-100" : "hover:bg-gray-100"
            )}
          >
            <div 
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200" 
              style={{ backgroundColor: activeColor }} 
            />
          </button>
          
          {openDropdown === 'COLOR' && (
            <div className="absolute left-full top-0 ml-3 bg-white border border-gray-200 shadow-xl rounded-2xl p-3 grid grid-cols-4 gap-2 w-[140px] animate-in fade-in slide-in-from-left-2 duration-200">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => { onColorChange(color); setOpenDropdown(null); }}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all border border-gray-200 shadow-sm",
                    activeColor === color ? "scale-110 ring-2 ring-blue-500 ring-offset-2" : "hover:scale-110 hover:shadow-md"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Size Picker */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'SIZE' ? null : 'SIZE')}
            title="Stroke Width"
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl transition-all text-[11px] font-bold text-gray-700",
              openDropdown === 'SIZE' ? "bg-gray-100" : "hover:bg-gray-100"
            )}
          >
            {SIZES.find(s => s.val === activeSize)?.id || 'M'}
          </button>
          
          {openDropdown === 'SIZE' && (
            <div className="absolute left-full top-0 ml-3 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-24 animate-in fade-in slide-in-from-left-2 duration-200">
              {SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => { onSizeChange(size.val); setOpenDropdown(null); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors",
                    activeSize === size.val ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {size.id} <span className="opacity-50 font-normal">{size.val}px</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 p-2 flex flex-col gap-1 w-[52px]">
        <button onClick={onUndo} disabled={!canUndo} title="Undo" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent">
          <Undo2 className="w-[18px] h-[18px]" />
        </button>
        <button onClick={onDelete} disabled={!canDelete} title="Clear Current" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500">
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
        <div className="w-6 h-[1px] bg-gray-200 mx-auto my-1 rounded-full"></div>
        <button 
          onClick={onSave} 
          disabled={!canSave} 
          title="Save Polygon" 
          className="w-9 h-9 flex items-center justify-center rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-30 disabled:hover:bg-blue-600 shadow-sm shadow-blue-600/30 active:scale-95"
        >
          <Save className="w-[16px] h-[16px]" />
        </button>
      </div>

    </div>
  );
};

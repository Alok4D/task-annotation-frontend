'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { 
  MousePointer2, Trash2, Undo2, Hand, Pentagon,
  Save, Download
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
  onDownload?: () => void;
}

const TOOLS = [
  { id: 'DRAW', icon: Pentagon, label: 'Polygon' },
  { id: 'SELECT', icon: MousePointer2, label: 'Select' },
  { id: 'PAN', icon: Hand, label: 'Pan' },
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

function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T | null>, handler: () => void) {
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
  canSave,
  onDownload
}: ToolbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<'COLOR' | 'SIZE' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpenDropdown(null));

  return (
    <div className="flex flex-col h-full bg-white text-gray-600 font-sans border-r border-gray-200" ref={dropdownRef}>
      
      {/* Tools Section */}
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

        {/* Color and Size Pickers */}
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
            <div className="absolute left-full top-0 ml-2 bg-white border border-gray-200 shadow-xl rounded-2xl p-3 grid grid-cols-4 gap-2 w-[140px] z-50">
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
            <div className="absolute left-full top-0 ml-2 bg-white border border-gray-200 shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-24 z-50">
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

        <div className="w-full h-[1px] bg-gray-200 my-2"></div>

        {/* Action Panel */}
        <button 
          onClick={onDelete} 
          disabled={!canDelete} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
        >
          <Trash2 className="w-5 h-5" /> Delete
        </button>
        
        <button 
          onClick={onUndo} 
          disabled={!canUndo} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
        >
          <Undo2 className="w-5 h-5" /> Undo
        </button>
        
        <button 
          onClick={onSave} 
          disabled={!canSave} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
        >
          <Save className="w-5 h-5" /> Save
        </button>

        {onDownload && (
          <button 
            onClick={onDownload} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium hover:bg-gray-50 hover:text-gray-900"
          >
            <Download className="w-5 h-5" /> Download
          </button>
        )}

      </div>
      
    </div>
  );
};

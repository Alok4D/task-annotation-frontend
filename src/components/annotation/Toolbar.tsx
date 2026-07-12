'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { 
  MousePointer2, Trash2, Undo2, Hand, Pentagon,
  Save, Download
} from 'lucide-react';

export type DrawingTool = 'DRAW' | 'SELECT' | 'PAN';

interface ToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  canUndo: boolean;
  onDelete: () => void;
  canDelete: boolean;
  onSave: () => void;
  canSave: boolean;
}

const TOOLS = [
  { id: 'DRAW', icon: Pentagon, label: 'Polygon' },
  { id: 'SELECT', icon: MousePointer2, label: 'Select' },
  { id: 'PAN', icon: Hand, label: 'Pan' },
] as const;

export const Toolbar = ({
  activeTool,
  onToolChange,
  onUndo,
  canUndo,
  onDelete,
  canDelete,
  onSave,
  canSave,
}: ToolbarProps) => {

  return (
    <div className="flex flex-col h-full bg-white text-gray-600 font-sans border-r border-gray-200">
      
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
        
        {/* Placeholder for Redo */}
        <button 
          disabled={true} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-sm font-medium opacity-30 cursor-not-allowed"
        >
          <Undo2 className="w-5 h-5 scale-x-[-1]" /> Redo
        </button>

      </div>
      
      {/* Save Button */}
      <div className="p-4 mt-auto">
        <button 
          onClick={onSave} 
          disabled={!canSave} 
          className="w-full flex items-center justify-center gap-2 bg-[#673de6] hover:bg-[#532cc2] text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:hover:bg-[#673de6] shadow-lg shadow-[#673de6]/20 active:scale-95"
        >
          Save Annotations
        </button>
      </div>

    </div>
  );
};

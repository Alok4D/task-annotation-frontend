import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#272B33] rounded shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-[#3A414B]">
        <div className="flex justify-between items-center p-4 border-b border-[#3A414B]">
          <h2 className="font-bold text-lg text-white">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#323842] transition-colors">
            <X className="w-5 h-5 text-[#8B929D]" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

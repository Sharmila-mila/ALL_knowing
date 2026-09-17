import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/20 backdrop-blur-xs transition-all">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E5E7EB] flex flex-col justify-between">
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">{children}</div>
      </div>
    </div>
  );
};

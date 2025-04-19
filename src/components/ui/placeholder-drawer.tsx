'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button'; // Assuming button exists

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const PlaceholderDrawer: React.FC<DrawerProps> = ({ 
  open,
  onClose,
  children,
  title = "Фильтры" // Default title
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    // Overlay
    <div 
      // Increase z-index, keep below panel
      className="fixed inset-0 bg-black/50 z-[999990] transition-opacity duration-300 ease-in-out" 
      onClick={onClose} 
      aria-hidden="true"
    >
      {/* Drawer Panel */}
      <div 
        // Remove max-w-sm, ensure full width, increase z-index
        className={`fixed top-0 right-0 h-full w-screen bg-white shadow-xl z-[999999] transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="drawer-title" className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Закрыть панель">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto h-[calc(100vh-70px)]"> {/* Adjust height based on header */}
          {children}
        </div>
      </div>
    </div>
  );
};

export { PlaceholderDrawer }; 
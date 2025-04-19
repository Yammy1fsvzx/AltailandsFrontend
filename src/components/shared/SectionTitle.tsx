import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
}; 
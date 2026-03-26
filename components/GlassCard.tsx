import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function GlassCard({ children, className = "", title }: GlassCardProps) {
  return (
    <div className={`glass rounded-[24px] p-6 sm:p-8 animate-fade-up ${className}`}>
      {title && <h2 className="text-2xl font-semibold mb-6 text-gradient-cyan-magenta">{title}</h2>}
      {children}
    </div>
  );
}

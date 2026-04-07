import React from "react";

export interface QuoteProps {
  children: React.ReactNode;
  citation?: string;
  className?: string;
}

export function Quote({ children, citation, className = "" }: QuoteProps) {
  return (
    <blockquote className={`quote ${className}`}>
      <div className="text-base font-var-base">{children}</div>
      {citation && <cite className="quote-citation">{citation}</cite>}
    </blockquote>
  );
}

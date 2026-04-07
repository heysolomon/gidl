import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "private" | "featured" | "border";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    default: "badge-default",
    private: "badge-private",
    featured: "badge-featured",
    border: "border border-neutral-200 dark:border-white/10 bg-transparent",
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

export interface LiveBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export function LiveBadge({ children, className = "" }: LiveBadgeProps) {
  return (
    <span className={`badge badge-default ${className}`}>
      <span className="live-indicator">
        <span className="relative inline-flex">
          <span className="live-ping" />
          <span className="live-dot" />
        </span>
      </span>
      {children || "Live"}
    </span>
  );
}

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900 ${className}`}
    >
      {children}
    </div>
  );
}

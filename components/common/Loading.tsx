interface LoadingProps {
  className?: string;
}

export function Loading({ className = "" }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`} role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-teal-500 dark:border-navy-800 dark:border-t-teal-400" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

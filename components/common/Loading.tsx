interface LoadingProps {
  className?: string;
}

export function Loading({ className = "" }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`} role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600 dark:border-zinc-700 dark:border-t-indigo-500" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

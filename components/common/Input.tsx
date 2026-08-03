"use client";

import { useId, type ChangeEventHandler } from "react";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  className?: string;
}

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}: InputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white ${className}`}
      />
    </div>
  );
}

"use client";

import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink font-semibold hover:bg-gold-soft border border-transparent",
  secondary:
    "bg-panel-2 text-zinc-100 hover:bg-line border border-line",
  ghost: "bg-transparent text-zinc-300 hover:bg-panel-2 border border-transparent",
  danger:
    "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3.5 py-2 text-sm",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-line bg-panel/80 backdrop-blur ${className}`}
      {...props}
    />
  );
}

const fieldBase =
  "w-full rounded-lg bg-panel-2 border border-line px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/40 transition";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${fieldBase} ${className}`} {...props} />;
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea ref={ref} className={`${fieldBase} ${className}`} {...props} />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", children, ...props }, ref) {
  return (
    <select ref={ref} className={`${fieldBase} ${className}`} {...props}>
      {children}
    </select>
  );
});

export function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-xs font-medium text-zinc-400 mb-1 ${className}`}>
      {children}
    </label>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

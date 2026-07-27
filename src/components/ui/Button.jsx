import React from 'react'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  }

  const variantStyles = {
    primary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg dark:bg-amber-500 dark:hover:bg-amber-600',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700',
    outline: 'border border-amber-600/40 dark:border-amber-400/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10',
    ghost: 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

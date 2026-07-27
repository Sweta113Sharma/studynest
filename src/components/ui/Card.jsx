import React from 'react'

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  role,
  tabIndex,
  ariaLabel,
  ...props
}) {
  const baseStyles = hover
    ? 'glass-card-hover rounded-3xl p-6 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none cursor-pointer'
    : 'glass-card rounded-3xl p-6 relative overflow-hidden'

  return (
    <div
      onClick={onClick}
      role={role || (onClick ? 'button' : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      aria-label={ariaLabel}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

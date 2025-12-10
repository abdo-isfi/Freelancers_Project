import { useState } from 'react';
import clsx from 'clsx';

/**
 * Dark-themed Input Component matching Login/Register forms
 * Features:
 * - Dark background (bg-[var(--color-surface)])
 * - Border color (border-[var(--color-border)])
 * - Focus ring (focus:bg-[var(--color-bg)])
 * - White text
 * - Hover gradient effect
 * - Rounded corners
 */
function Input({
  label,
  error,
  helperText,
  className,
  required,
  ...props
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="w-full">
      {/* Label - matches login form style */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input wrapper for hover effect */}
      <div className="relative w-full">
        <input
          className={clsx(
            // Base styles matching login form
            'peer relative z-10 border-2 border-[var(--color-border)] h-13 w-full rounded-md bg-[var(--color-surface)] px-4 py-2.5 font-medium outline-none drop-shadow-sm transition-all duration-200 ease-in-out',
            // Focus state
            'focus:bg-[var(--color-bg)] focus:border-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-text-primary)]/20',
            // Text and placeholder
            'text-white placeholder:font-medium placeholder:text-[var(--color-text-secondary)]',
            // Error state
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...props}
        />
        
        {/* Hover gradient effect - top and bottom borders */}
        {isHovering && !error && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{helperText}</p>
      )}
    </div>
  );
}

export default Input;


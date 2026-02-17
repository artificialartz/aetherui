import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantStyles = {
  primary: 'bg-white/10 hover:bg-white/20 border-white/20',
  secondary: 'bg-white/5 hover:bg-white/10 border-white/10',
  ghost: 'bg-transparent hover:bg-white/5 border-transparent',
};

/**
 * GlassButton component with smooth animations
 * Uses Framer Motion for interactive feedback
 */
export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        className={[
          'relative overflow-hidden',
          'rounded-xl border',
          'font-medium text-white/90',
          'transition-all duration-300',
          'backdrop-blur-md',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeStyles[size],
          variantStyles[variant],
          !disabled && 'hover:shadow-xl',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        <motion.span
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        {/* Shimmer effect on hover */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Glass } from './Glass';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  title?: string;
  description?: string;
  variant?: 'default' | 'hover' | 'interactive';
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: '',
  hover: 'hover:scale-[1.02] hover:shadow-2xl',
  interactive: 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]',
};

/**
 * GlassCard component for displaying content in a glassmorphic card
 * Supports different interaction variants
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ title, description, variant = 'default', children, className = '', ...props }, ref) => {
    return (
      <Glass
        ref={ref}
        rounded="2xl"
        className={['p-6', variantStyles[variant], className].filter(Boolean).join(' ')}
        {...props}
      >
        {title && (
          <motion.h3
            className="text-xl font-semibold mb-2 text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h3>
        )}
        {description && (
          <motion.p
            className="text-white/60 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </Glass>
    );
  }
);

GlassCard.displayName = 'GlassCard';

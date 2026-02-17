import React from 'react';
import { motion } from 'framer-motion';
import { MeshGradient } from './MeshGradient';
import type { MeshGradientConfig } from '../types';
import { meshGradientPresets } from '../utils/meshGradient';

interface MeshGradientCardProps {
  preset?: keyof typeof meshGradientPresets;
  config?: MeshGradientConfig;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

/**
 * MeshGradientCard - A card component with animated mesh gradient background
 * Perfect for showcases, feature highlights, and interactive content
 */
export const MeshGradientCard = React.forwardRef<HTMLDivElement, MeshGradientCardProps>(
  (
    {
      preset,
      config,
      title,
      description,
      children,
      className = '',
      interactive = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={['relative rounded-3xl overflow-hidden', interactive && 'cursor-pointer', className]
          .filter(Boolean)
          .join(' ')}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        <MeshGradient preset={preset} config={config} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 p-8">
          {title && (
            <motion.h3
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h3>
          )}
          {description && (
            <motion.p
              className="text-white/80 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
);

MeshGradientCard.displayName = 'MeshGradientCard';

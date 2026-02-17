import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import type { GlassProps, GlassVariant } from '../types';

interface GlassComponentProps extends GlassProps, Omit<HTMLMotionProps<'div'>, 'children'> {}

const variantStyles: Record<GlassVariant, string> = {
  default: 'bg-white/5 border-white/10',
  subtle: 'bg-white/[0.02] border-white/5',
  strong: 'bg-white/10 border-white/20',
  frosted: 'bg-white/[0.08] border-white/15 backdrop-blur-xl',
};

const blurStyles = {
  xs: 'backdrop-blur-xs',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const roundedStyles = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

/**
 * Glass component with backdrop-filter optimizations
 * Uses hardware acceleration for better performance
 */
export const Glass = React.forwardRef<HTMLDivElement, GlassComponentProps>(
  (
    {
      variant = 'default',
      blur = 'md',
      opacity,
      border = true,
      shadow = true,
      rounded = 'xl',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'relative',
      // Hardware acceleration
      'transform-gpu',
      'will-change-transform',
      // Smooth transitions
      'transition-all',
      'duration-300',
      // Prevent sub-pixel rendering issues
      'antialiased',
    ];

    const variantClass = variantStyles[variant];
    const blurClass = blurStyles[blur];
    const borderClass = border ? 'border' : '';
    const shadowClass = shadow ? 'shadow-lg' : '';
    const roundedClass = roundedStyles[rounded];

    const { style: propsStyle, ...restProps } = props;
    const inlineStyle: React.CSSProperties = {
      ...(opacity !== undefined && { backgroundColor: `rgba(255, 255, 255, ${opacity * 0.05})` }),
    };

    // Merge user-provided styles (if they exist as CSSProperties)
    if (propsStyle) {
      Object.assign(inlineStyle, propsStyle);
    }

    return (
      <motion.div
        ref={ref}
        className={[
          ...baseClasses,
          blurClass,
          variantClass,
          borderClass,
          shadowClass,
          roundedClass,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={inlineStyle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...restProps}
      >
        {children}
      </motion.div>
    );
  }
);

Glass.displayName = 'Glass';

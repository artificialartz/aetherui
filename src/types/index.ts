import type { ReactNode, CSSProperties } from 'react';

/**
 * Glassmorphism variant types
 */
export type GlassVariant = 'default' | 'subtle' | 'strong' | 'frosted';

/**
 * Mesh gradient color types
 */
export interface MeshGradientColor {
  color: string;
  position: [number, number]; // [x, y] as percentages
}

/**
 * Mesh gradient configuration
 */
export interface MeshGradientConfig {
  colors: MeshGradientColor[];
  animated?: boolean;
  speed?: number;
}

/**
 * Glass component props
 */
export interface GlassProps {
  variant?: GlassVariant;
  blur?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  children: ReactNode;
  className?: string;
}

// Re-export CSSProperties for use in utilities
export type { CSSProperties };

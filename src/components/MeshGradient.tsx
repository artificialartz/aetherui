import React from 'react';
import { motion } from 'framer-motion';
import type { MeshGradientConfig } from '../types';
import {
  generateMeshBackground,
  generateMeshAnimation,
  meshGradientPresets,
  randomMeshGradient,
} from '../utils/meshGradient';

interface MeshGradientProps {
  preset?: keyof typeof meshGradientPresets | 'random';
  config?: MeshGradientConfig;
  animated?: boolean;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * MeshGradient component for creating animated iridescent mesh gradients
 * Supports presets, custom configs, and random generation
 */
export const MeshGradient = React.forwardRef<HTMLDivElement, MeshGradientProps>(
  (
    {
      preset,
      config: userConfig,
      animated = true,
      speed,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Determine which config to use
    const getConfig = (): MeshGradientConfig => {
      if (userConfig) return userConfig;
      if (preset === 'random') return randomMeshGradient();
      if (preset && meshGradientPresets[preset]) {
        const presetConfig = meshGradientPresets[preset];
        return {
          ...presetConfig,
          animated: animated ?? presetConfig.animated,
          ...(speed !== undefined && { speed }),
        };
      }
      return meshGradientPresets.aurora;
    };

    const config = getConfig();
    const background = generateMeshBackground(config);
    const animationStyle = config.animated ? generateMeshAnimation(config.speed) : {};

    return (
      <motion.div
        ref={ref}
        className={['relative overflow-hidden', className].join(' ')}
        style={{
          background,
          ...animationStyle,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {/* Overlay for better content readability */}
        {children && (
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

MeshGradient.displayName = 'MeshGradient';

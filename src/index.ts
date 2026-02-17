// Components
export { Glass } from './components/Glass';
export { GlassCard } from './components/GlassCard';
export { GlassButton } from './components/GlassButton';
export { GlassInput } from './components/GlassInput';
export { MeshGradient } from './components/MeshGradient';
export { MeshGradientCard } from './components/MeshGradientCard';
export { CommandPalette } from './components/CommandPalette';
export { AdaptiveLayout, useBreakpoint, useResponsiveValue } from './components/AdaptiveLayout';

// Types
export type {
  GlassVariant,
  GlassProps,
  MeshGradientColor,
  MeshGradientConfig,
  CSSProperties,
} from './types';

export type { Command, CommandGroup, CommandPaletteProps } from './components/CommandPalette';
export type {
  AdaptiveLayoutProps,
  ResponsiveValue,
  Breakpoint,
  ColumnSpan,
  GridAlignment,
} from './components/AdaptiveLayout';

// Utils
export {
  meshGradientPresets,
  generateMeshGradient,
  generateMeshBackground,
  generateMeshAnimation,
  createMeshGradient,
  interpolateMeshGradients,
  randomMeshGradient,
} from './utils/meshGradient';

export {
  supportsBackdropFilter,
  getBackdropFilterProperty,
  getOptimizedBlurRadius,
  applyHardwareAcceleration,
  removeHardwareAcceleration,
  getBackdropFilterFallback,
  createPerformanceMonitor,
  shouldUsePerformanceMode,
  getOptimizedAnimationDuration,
} from './utils/backdropFilter';

// Hooks
export {
  useBackdropFilter,
  usePerformanceMonitor,
  useHardwareAcceleration,
} from './hooks/useBackdropFilter';

// Styles
import './style.css';

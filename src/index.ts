// Components
export { Glass } from './components/Glass';
export { GlassCard } from './components/GlassCard';
export { GlassButton } from './components/GlassButton';
export { GlassInput } from './components/GlassInput';
export { MeshGradient } from './components/MeshGradient';
export { MeshGradientCard } from './components/MeshGradientCard';

// Types
export type {
  GlassVariant,
  GlassProps,
  MeshGradientColor,
  MeshGradientConfig,
  CSSProperties,
} from './types';

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

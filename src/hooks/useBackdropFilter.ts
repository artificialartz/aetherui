import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  supportsBackdropFilter,
  shouldUsePerformanceMode,
  getOptimizedBlurRadius,
} from '../utils/backdropFilter';

interface UseBackdropFilterOptions {
  blurRadius?: number;
  enablePerformanceMode?: boolean;
}

interface UseBackdropFilterReturn {
  isSupported: boolean;
  isPerformanceMode: boolean;
  optimizedBlurRadius: number;
  elementRef: RefObject<HTMLDivElement>;
}

/**
 * Hook for managing backdrop-filter with automatic optimizations
 */
export function useBackdropFilter(options: UseBackdropFilterOptions = {}): UseBackdropFilterReturn {
  const { blurRadius = 12, enablePerformanceMode = true } = options;

  const [isSupported, setIsSupported] = useState(true);
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  const [optimizedBlurRadius, setOptimizedBlurRadius] = useState(blurRadius);

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check backdrop-filter support
    setIsSupported(supportsBackdropFilter());

    // Check if performance mode should be enabled
    if (enablePerformanceMode) {
      setIsPerformanceMode(shouldUsePerformanceMode());
      setOptimizedBlurRadius(getOptimizedBlurRadius(blurRadius));
    }
  }, [blurRadius, enablePerformanceMode]);

  return {
    isSupported,
    isPerformanceMode,
    optimizedBlurRadius,
    elementRef,
  };
}

/**
 * Hook for monitoring animation performance
 */
export function usePerformanceMonitor(threshold: number = 30) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameId: number;
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        setIsLowPerformance(fps < threshold);
        frameCount = 0;
        lastTime = currentTime;
      }

      frameId = requestAnimationFrame(measureFrame);
    };

    frameId = requestAnimationFrame(measureFrame);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [threshold]);

  return { isLowPerformance };
}

/**
 * Hook for applying hardware acceleration to elements
 */
export function useHardwareAcceleration(enabled: boolean = true) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
    element.style.backfaceVisibility = 'hidden';

    return () => {
      element.style.transform = '';
      element.style.willChange = '';
      element.style.backfaceVisibility = '';
    };
  }, [enabled]);

  return ref;
}

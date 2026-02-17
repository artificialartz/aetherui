import type { CSSProperties } from 'react';

/**
 * Backdrop filter utilities for optimized glassmorphism effects
 */

/**
 * Detects if backdrop-filter is supported in the current browser
 */
export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined') return true; // SSR - assume supported

  const testElement = document.createElement('div');
  const testValues = [
    'backdrop-filter',
    '-webkit-backdrop-filter',
    '-moz-backdrop-filter',
    '-o-backdrop-filter',
  ];

  return testValues.some((value) => {
    testElement.style.cssText = `#${value}: blur(10px)`;
    return !!testElement.style.length;
  });
}

/**
 * Gets the appropriate backdrop-filter CSS property for the current browser
 */
export function getBackdropFilterProperty(): string {
  if (typeof window === 'undefined') return 'backdrop-filter';

  const testElement = document.createElement('div');
  const testValues = [
    'backdrop-filter',
    '-webkit-backdrop-filter',
    '-moz-backdrop-filter',
  ];

  for (const value of testValues) {
    testElement.style.cssText = `#${value}: blur(10px)`;
    if (testElement.style.length) {
      return value;
    }
  }

  return 'backdrop-filter';
}

/**
 * Optimizes backdrop-filter performance by reducing blur radius on low-end devices
 */
export function getOptimizedBlurRadius(baseRadius: number): number {
  if (typeof window === 'undefined') return baseRadius;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Math.max(2, Math.floor(baseRadius / 2));
  }

  // Simple device detection for performance optimization
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    return Math.max(4, Math.floor(baseRadius * 0.7));
  }

  return baseRadius;
}

/**
 * Applies hardware acceleration to an element for smoother animations
 */
export function applyHardwareAcceleration(element: HTMLElement): void {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
}

/**
 * Removes hardware acceleration from an element
 */
export function removeHardwareAcceleration(element: HTMLElement): void {
  element.style.transform = '';
  element.style.willChange = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
}

/**
 * Creates a fallback style for browsers that don't support backdrop-filter
 */
export function getBackdropFilterFallback(
  opacity: number = 0.8
): CSSProperties {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
  };
}

/**
 * Optimizes render performance by throttling repaints during animations
 */
export function createPerformanceMonitor() {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;

  const measureFrame = () => {
    frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - lastTime;

    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFrame);
  };

  return {
    start: () => requestAnimationFrame(measureFrame),
    getFPS: () => fps,
    isLowPerformance: () => fps < 30,
  };
}

/**
 * Determines if performance mode should be enabled based on device capabilities
 */
export function shouldUsePerformanceMode(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check for low memory devices (rough heuristic)
  const isLowMemory = (navigator as any).deviceMemory < 4;

  return isMobile || isLowMemory;
}

/**
 * Gets optimized animation duration based on device performance
 */
export function getOptimizedAnimationDuration(baseDuration: number): number {
  if (shouldUsePerformanceMode()) {
    return Math.max(100, baseDuration * 0.5);
  }
  return baseDuration;
}

/**
 * Unit tests for AetherUI utility functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  supportsBackdropFilter,
  getBackdropFilterProperty,
  getOptimizedBlurRadius,
  shouldUsePerformanceMode,
  createPerformanceMonitor,
  getOptimizedAnimationDuration,
  applyHardwareAcceleration,
  removeHardwareAcceleration,
  getBackdropFilterFallback,
} from '../src/utils/backdropFilter';

import {
  meshGradientPresets,
  generateMeshGradient,
  generateMeshBackground,
  generateMeshAnimation,
  createMeshGradient,
  interpolateMeshGradients,
  randomMeshGradient,
} from '../src/utils/meshGradient';

describe('Backdrop Filter Utilities', () => {
  let mockWindow: Window & { matchMedia?: unknown };

  beforeEach(() => {
    // Mock window object
    mockWindow = window as Window & { matchMedia?: unknown };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('supportsBackdropFilter', () => {
    it('should return true in SSR environment', () => {
      // Store original window
      const originalWindow = global.window;

      // Mock SSR environment
      // @ts-expect-error - testing SSR scenario
      delete global.window;

      const result = supportsBackdropFilter();
      expect(result).toBe(true);

      // Restore window
      global.window = originalWindow;
    });

    it('should detect backdrop-filter support', () => {
      const result = supportsBackdropFilter();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getOptimizedBlurRadius', () => {
    it('should return original radius in SSR', () => {
      // @ts-expect-error - testing SSR scenario
      delete global.window;

      const result = getOptimizedBlurRadius(20);
      expect(result).toBe(20);

      // Restore window
      global.window = window;
    });

    it('should reduce blur radius for mobile devices', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const result = getOptimizedBlurRadius(20);
      expect(result).toBeLessThan(20);
      expect(result).toBeGreaterThanOrEqual(4);
    });

    it('should respect reduced motion preference', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      });

      const result = getOptimizedBlurRadius(20);
      expect(result).toBeLessThan(20);
    });
  });

  describe('shouldUsePerformanceMode', () => {
    it('should return false in SSR', () => {
      // @ts-expect-error - testing SSR scenario
      delete global.window;

      const result = shouldUsePerformanceMode();
      expect(result).toBe(false);

      global.window = window;
    });

    it('should detect mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const result = shouldUsePerformanceMode();
      expect(result).toBe(true);
    });

    it('should respect reduced motion', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      });

      const result = shouldUsePerformanceMode();
      expect(result).toBe(true);
    });
  });

  describe('getOptimizedAnimationDuration', () => {
    it('should reduce duration in performance mode', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      });

      const result = getOptimizedAnimationDuration(500);
      expect(result).toBeLessThan(500);
      expect(result).toBeGreaterThanOrEqual(100);
    });
  });

  describe('hardware acceleration', () => {
    it('should apply hardware acceleration to element', () => {
      const element = document.createElement('div');
      applyHardwareAcceleration(element);

      expect(element.style.transform).toBe('translateZ(0)');
      expect(element.style.willChange).toBe('transform');
      expect(element.style.backfaceVisibility).toBe('hidden');
      expect(element.style.perspective).toBe('1000px');
    });

    it('should remove hardware acceleration from element', () => {
      const element = document.createElement('div');
      element.style.transform = 'translateZ(0)';

      removeHardwareAcceleration(element);

      expect(element.style.transform).toBe('');
      expect(element.style.willChange).toBe('');
    });
  });

  describe('getBackdropFilterFallback', () => {
    it('should return fallback styles', () => {
      const result = getBackdropFilterFallback(0.8);

      expect(result.backgroundColor).toContain('rgba');
      expect(result.backgroundImage).toContain('linear-gradient');
    });
  });

  describe('createPerformanceMonitor', () => {
    it('should create a performance monitor', () => {
      const monitor = createPerformanceMonitor();

      expect(monitor).toHaveProperty('start');
      expect(monitor).toHaveProperty('getFPS');
      expect(monitor).toHaveProperty('isLowPerformance');
      expect(typeof monitor.start).toBe('function');
      expect(typeof monitor.getFPS).toBe('function');
      expect(typeof monitor.isLowPerformance).toBe('function');
    });
  });
});

describe('Mesh Gradient Utilities', () => {
  describe('meshGradientPresets', () => {
    it('should have all expected presets', () => {
      expect(meshGradientPresets).toHaveProperty('aurora');
      expect(meshGradientPresets).toHaveProperty('sunset');
      expect(meshGradientPresets).toHaveProperty('ocean');
      expect(meshGradientPresets).toHaveProperty('galaxy');
      expect(meshGradientPresets).toHaveProperty('forest');
      expect(meshGradientPresets).toHaveProperty('fire');
    });

    it('should have valid preset configs', () => {
      Object.values(meshGradientPresets).forEach((preset) => {
        expect(preset).toHaveProperty('colors');
        expect(preset.colors).toBeInstanceOf(Array);
        expect(preset.colors.length).toBeGreaterThan(0);
        expect(preset).toHaveProperty('animated');
        expect(preset).toHaveProperty('speed');
      });
    });
  });

  describe('generateMeshGradient', () => {
    it('should generate a valid gradient string', () => {
      const config = {
        colors: [
          { color: '#ff0000', position: [0, 0] as [number, number] },
          { color: '#00ff00', position: [50, 50] as [number, number] },
        ],
        animated: true,
        speed: 10,
      };

      const result = generateMeshGradient(config);

      expect(result).toContain('radial-gradient');
      expect(result).toContain('#ff0000');
      expect(result).toContain('#00ff00');
    });
  });

  describe('generateMeshBackground', () => {
    it('should generate a valid background string', () => {
      const config = {
        colors: [
          { color: '#0000ff', position: [100, 100] as [number, number] },
        ],
        animated: false,
      };

      const result = generateMeshBackground(config);

      expect(result).toContain('radial-gradient');
      expect(result).toContain('#0000ff');
    });
  });

  describe('generateMeshAnimation', () => {
    it('should generate animation styles', () => {
      const result = generateMeshAnimation(15);

      expect(result.backgroundSize).toBe('200% 200%');
      expect(result.animation).toContain('mesh-gradient');
      expect(result.animation).toContain('15s');
    });
  });

  describe('createMeshGradient', () => {
    it('should create gradient from color array', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const result = createMeshGradient(colors, true, 20);

      expect(result.colors).toHaveLength(3);
      expect(result.colors[0].color).toBe('#ff0000');
      expect(result.animated).toBe(true);
      expect(result.speed).toBe(20);
    });

    it('should handle more colors than positions', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      const result = createMeshGradient(colors);

      expect(result.colors).toHaveLength(5);
      expect(result.colors[4].position).toBeDefined();
    });
  });

  describe('interpolateMeshGradients', () => {
    it('should interpolate between two configs', () => {
      const config1 = {
        colors: [
          { color: '#ff0000', position: [0, 0] as [number, number] },
          { color: '#00ff00', position: [100, 100] as [number, number] },
        ],
        animated: true,
        speed: 10,
      };

      const config2 = {
        colors: [
          { color: '#0000ff', position: [50, 50] as [number, number] },
          { color: '#ffff00', position: [50, 50] as [number, number] },
        ],
        animated: true,
        speed: 20,
      };

      const result = interpolateMeshGradients(config1, config2, 0.5);

      expect(result.colors).toHaveLength(2);
      expect(result.speed).toBe(15);
      expect(result.animated).toBe(true);
    });

    it('should handle edge cases', () => {
      const config1 = {
        colors: [{ color: '#ff0000', position: [0, 0] as [number, number] }],
        animated: false,
        speed: 10,
      };

      const config2 = {
        colors: [{ color: '#0000ff', position: [100, 100] as [number, number] }],
        animated: true,
        speed: 20,
      };

      const result = interpolateMeshGradients(config1, config2, 0);
      expect(result.speed).toBe(10);
      expect(result.animated).toBe(false);
    });
  });

  describe('randomMeshGradient', () => {
    it('should generate a valid random gradient', () => {
      const result = randomMeshGradient();

      expect(result.colors).toHaveLength(4);
      expect(result.animated).toBe(true);
      expect(result.speed).toBeGreaterThan(14);
      expect(result.speed).toBeLessThan(26);

      result.colors.forEach((colorDef) => {
        expect(colorDef.color).toMatch(/^hsl\(/);
        expect(colorDef.position).toHaveLength(2);
        expect(colorDef.position[0]).toBeGreaterThanOrEqual(0);
        expect(colorDef.position[0]).toBeLessThanOrEqual(100);
      });
    });

    it('should generate different gradients on multiple calls', () => {
      const result1 = randomMeshGradient();
      const result2 = randomMeshGradient();

      // Very unlikely to be the same
      const colorsAreDifferent =
        result1.colors.some((c, i) => c.color !== result2.colors[i].color);

      expect(colorsAreDifferent).toBe(true);
    });
  });
});

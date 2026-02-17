import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';
import { useAnimation, useMotionValue, useTransform } from 'framer-motion';

/**
 * Hook for managing hover states with smooth transitions
 */
export function useHover(
  options: {
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    delay?: number;
  } = {}
) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleHoverStart = useCallback(() => {
    if (options.delay) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(true);
        options.onHoverStart?.();
      }, options.delay);
    } else {
      setIsHovered(true);
      options.onHoverStart?.();
    }
  }, [options]);

  const handleHoverEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
    options.onHoverEnd?.();
  }, [options]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isHovered,
    hoverProps: {
      onMouseEnter: handleHoverStart,
      onMouseLeave: handleHoverEnd,
    },
  };
}

/**
 * Hook for managing focus states with accessibility support
 */
export function useFocus<T extends HTMLElement = HTMLElement>() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const hasFocusedByMouse = useRef(false);

  const handleFocus = useCallback((_e: React.FocusEvent<T>) => {
    setIsFocused(true);
    // Only show focus ring if not triggered by mouse
    if (!hasFocusedByMouse.current) {
      setIsFocusVisible(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFocusVisible(false);
    hasFocusedByMouse.current = false;
  }, []);

  const handleMouseDown = useCallback(() => {
    hasFocusedByMouse.current = true;
  }, []);

  return {
    isFocused,
    isFocusVisible,
    focusProps: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseDown: handleMouseDown,
    },
  };
}

/**
 * Hook for managing press/click states with ripple effects
 */
export function usePress(options: {
  onPress?: () => void;
  onPressEnd?: () => void;
  disabled?: boolean;
} = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const rippleControls = useAnimation();
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handlePressStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (options.disabled) return;

      setIsPressed(true);

      // Create ripple effect
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (e as React.MouseEvent).clientX - rect.left - size / 2;
      const y = (e as React.MouseEvent).clientY - rect.top - size / 2;

      rippleControls.set({
        scale: 0,
        opacity: 0.6,
        x,
        y,
        width: size * 2,
        height: size * 2,
      });

      rippleControls.start({
        scale: 4,
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      });
    },
    [options.disabled, rippleControls]
  );

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    options.onPress?.();
    options.onPressEnd?.();
  }, [options]);

  return {
    isPressed,
    rippleControls,
    rippleRef,
    pressProps: {
      onMouseDown: handlePressStart,
      onMouseUp: handlePressEnd,
      onMouseLeave: handlePressEnd,
      onTouchStart: handlePressStart,
      onTouchEnd: handlePressEnd,
    },
  };
}

/**
 * Hook for smooth value transitions with spring physics
 */
export function useSpringTransition(
  value: number,
  options: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  } = {}
) {
  const { stiffness: _stiffness = 300, damping: _damping = 30, mass: _mass = 1 } = options;

  const motionValue = useMotionValue(value);
  const spring = useTransform(motionValue, (_latest) => value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return spring;
}

/**
 * Hook for managing intersection observer with lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * Hook for managing reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for managing click outside behavior
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  options: {
    enabled?: boolean;
    ignoreElements?: RefObject<HTMLElement>[];
  } = {}
) {
  const { enabled = true, ignoreElements = [] } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside the ref
      if (ref.current && !ref.current.contains(target)) {
        // Check if click is on any ignored elements
        const isIgnored = ignoreElements.some(
          (elRef) => elRef.current && elRef.current.contains(target)
        );

        if (!isIgnored) {
          callback();
        }
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback, enabled, ignoreElements]);

  return ref;
}

/**
 * Hook for managing escape key press
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, enabled]);
}

/**
 * Hook for managing keyboard navigation in lists
 */
export function useKeyboardNavigation<T>(items: T[], options: {
  onSelect?: (item: T) => void;
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal';
} = {}) {
  const { onSelect, loop = true, orientation = 'vertical' } = options;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev + 1;
          if (next >= items.length) {
            return loop ? 0 : prev;
          }
          return next;
        });
        break;
      case prevKey:
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev - 1;
          if (next < 0) {
            return loop ? items.length - 1 : prev;
          }
          return next;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (items[selectedIndex]) {
          onSelect?.(items[selectedIndex]);
        }
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(items.length - 1);
        break;
    }
  }, [items, selectedIndex, loop, orientation, onSelect]);

  return {
    selectedIndex,
    setSelectedIndex,
    keyboardProps: {
      onKeyDown: handleKeyDown,
    },
  };
}

/**
 * Hook for managing clipboard operations
 */
export function useClipboard(options: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
} = {}) {
  const [isCopied, setIsCopied] = useState(false);
  const { timeout = 2000, onSuccess, onError } = options;

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        onSuccess?.();

        setTimeout(() => setIsCopied(false), timeout);
      } catch (error) {
        onError?.(error as Error);
        setIsCopied(false);
      }
    },
    [timeout, onSuccess, onError]
  );

  return { isCopied, copy };
}

/**
 * Hook for managing debounced values
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing throttled callbacks
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Hook for managing media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    // Add listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

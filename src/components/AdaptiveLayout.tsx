import React, { useState, useEffect, useCallback, forwardRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';

export type GridAlignment = 'start' | 'center' | 'end' | 'stretch';

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export interface AdaptiveLayoutProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /**
   * Content to be displayed in the adaptive layout
   */
  children: React.ReactNode;
  /**
   * Layout mode
   */
  mode?: 'grid' | 'flex' | 'masonry' | 'carousel';
  /**
   * Number of columns (responsive)
   */
  columns?: ResponsiveValue<ColumnSpan | number>;
  /**
   * Gap between items (responsive)
   */
  gap?: ResponsiveValue<string>;
  /**
   * Minimum item width for auto-layout
   */
  minItemWidth?: number;
  /**
   * Whether items should have equal height
   */
  equalHeight?: boolean;
  /**
   * Alignment of items
   */
  align?: GridAlignment;
  /**
   * Whether to enable animation on layout changes
   */
  animated?: boolean;
  /**
   * Duration of layout animations
   */
  animationDuration?: number;
  /**
   * Whether to show load more button
   */
  loadMore?: boolean;
  /**
   * Callback when load more is clicked
   */
  onLoadMore?: () => void;
  /**
   * Whether content is loading
   */
  loading?: boolean;
  /**
   * Maximum items to show initially
   */
  maxItems?: number;
  /**
   * Custom breakpoints
   */
  breakpoints?: Record<Breakpoint, number>;
  className?: string;
}

// Default breakpoints matching Tailwind CSS
const defaultBreakpoints: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Gets the current breakpoint based on window width
 */
function getCurrentBreakpoint(
  width: number,
  breakpoints: Record<Breakpoint, number>
): Breakpoint {
  const sortedBreakpoints = Object.entries(breakpoints).sort(
    ([, a], [, b]) => b - a
  ) as [Breakpoint, number][];

  for (const [bp, value] of sortedBreakpoints) {
    if (width >= value) {
      return bp;
    }
  }

  return 'xs';
}

/**
 * Gets the responsive value for the current breakpoint
 */
function getResponsiveValue<T>(
  values: ResponsiveValue<T> | T,
  currentBreakpoint: Breakpoint,
  defaultValue: T
): T {
  if (typeof values !== 'object' || values === null) {
    return values as T;
  }

  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Find the nearest defined value
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp in values && (values as ResponsiveValue<T>)[bp] !== undefined) {
      return (values as ResponsiveValue<T>)[bp]!;
    }
  }

  return defaultValue;
}

/**
 * AdaptiveLayout - A responsive layout component that adapts to screen size
 * Supports grid, flex, masonry, and carousel layouts with smooth animations
 */
export const AdaptiveLayout = forwardRef<HTMLDivElement, AdaptiveLayoutProps>(
  (
    {
      children,
      mode = 'grid',
      columns = { xs: 1, sm: 2, md: 3, lg: 4 },
      gap = { xs: '1rem', sm: '1.5rem', md: '2rem' },
      minItemWidth = 280,
      equalHeight = false,
      align = 'stretch',
      animated = true,
      animationDuration = 0.3,
      loadMore = false,
      onLoadMore,
      loading = false,
      maxItems,
      breakpoints = defaultBreakpoints,
      className = '',
      ...props
    },
    ref
  ) => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('md');
    const [visibleCount, setVisibleCount] = useState(maxItems ?? Infinity);

    // Update breakpoint on window resize
    useEffect(() => {
      const handleResize = () => {
        setCurrentBreakpoint(getCurrentBreakpoint(window.innerWidth, breakpoints));
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [breakpoints]);

    // Get current column count
    const columnCount = useMemo(() => {
      const cols = getResponsiveValue<number | ColumnSpan>(
        columns,
        currentBreakpoint,
        1
      );
      return typeof cols === 'number' ? cols : 1;
    }, [columns, currentBreakpoint]);

    // Get current gap value
    const gapValue = useMemo(() => {
      return getResponsiveValue<string>(gap, currentBreakpoint, '1rem');
    }, [gap, currentBreakpoint]);

    // Get child items
    const items = useMemo(() => {
      const childrenArray = React.Children.toArray(children);
      return maxItems !== undefined ? childrenArray.slice(0, visibleCount) : childrenArray;
    }, [children, visibleCount, maxItems]);

    // Calculate item width based on column count and gap
    const getItemWidth = useCallback(() => {
      const totalGap = (columnCount - 1) * parseFloat(gapValue);
      return `calc((100% - ${totalGap}px) / ${columnCount})`;
    }, [columnCount, gapValue]);

    // Handle load more
    const handleLoadMore = useCallback(() => {
      setVisibleCount((prev) => prev + (maxItems ?? 12));
      onLoadMore?.();
    }, [onLoadMore, maxItems]);

    const hasMoreItems =
      maxItems !== undefined &&
      React.Children.toArray(children).length > visibleCount;

    // Render items based on layout mode
    const renderContent = () => {
      const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
      };

      switch (mode) {
        case 'grid': {
          const gridStyle: React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: gapValue,
            alignItems: align === 'stretch' ? 'stretch' : align,
          };

          return (
            <div style={gridStyle} className="adaptive-grid">
              <AnimatePresence mode="popLayout">
                {items.map((child, index) => (
                  <motion.div
                    key={typeof child === 'object' && child && 'key' in child ? (child.key as string) : index}
                    variants={animated ? itemVariants : undefined}
                    initial={animated ? 'hidden' : undefined}
                    animate="visible"
                    exit={animated ? 'hidden' : undefined}
                    transition={{ duration: animationDuration, delay: index * 0.05 }}
                    style={equalHeight ? { height: '100%' } : undefined}
                  >
                    {child}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        }

        case 'flex': {
          const flexStyle: React.CSSProperties = {
            display: 'flex',
            flexWrap: 'wrap',
            gap: gapValue,
            alignItems: align,
          };

          return (
            <div style={flexStyle} className="adaptive-flex">
              <AnimatePresence mode="popLayout">
                {items.map((child, index) => (
                  <motion.div
                    key={typeof child === 'object' && child && 'key' in child ? (child.key as string) : index}
                    variants={animated ? itemVariants : undefined}
                    initial={animated ? 'hidden' : undefined}
                    animate="visible"
                    exit={animated ? 'hidden' : undefined}
                    transition={{ duration: animationDuration, delay: index * 0.05 }}
                    style={{ flex: `0 0 ${getItemWidth()}` }}
                  >
                    {child}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        }

        case 'carousel': {
          const carouselStyle: React.CSSProperties = {
            display: 'flex',
            gap: gapValue,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          };

          return (
            <div
              style={carouselStyle}
              className="adaptive-carousel custom-scrollbar"
            >
              {items.map((child, index) => (
                <motion.div
                  key={typeof child === 'object' && child && 'key' in child ? (child.key as string) : index}
                  style={{
                    flex: `0 0 ${getItemWidth()}`,
                    scrollSnapAlign: 'start',
                  }}
                  variants={animated ? itemVariants : undefined}
                  initial={animated ? 'hidden' : undefined}
                  animate="visible"
                  transition={{ duration: animationDuration, delay: index * 0.02 }}
                >
                  {child}
                </motion.div>
              ))}
            </div>
          );
        }

        case 'masonry': {
          // Masonry layout using columns
          const masonryStyle: React.CSSProperties = {
            columnCount: columnCount,
            columnGap: gapValue,
          };

          return (
            <div style={masonryStyle} className="adaptive-masonry">
              <AnimatePresence mode="popLayout">
                {items.map((child, index) => (
                  <motion.div
                    key={typeof child === 'object' && child && 'key' in child ? (child.key as string) : index}
                    variants={animated ? itemVariants : undefined}
                    initial={animated ? 'hidden' : undefined}
                    animate="visible"
                    exit={animated ? 'hidden' : undefined}
                    transition={{ duration: animationDuration, delay: index * 0.05 }}
                    style={{ breakInside: 'avoid', marginBottom: gapValue }}
                  >
                    {child}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        }

        default:
          return null;
      }
    };

    return (
      <motion.div ref={ref} className={className} {...props}>
        {renderContent()}

        {/* Load More Button */}
        {loadMore && hasMoreItems && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/90 font-medium backdrop-blur-md hover:bg-white/20 transition-all disabled:opacity-50"
              onClick={handleLoadMore}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            className="text-center py-12 text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No items to display
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AdaptiveLayout.displayName = 'AdaptiveLayout';

/**
 * Hook to get current breakpoint and window dimensions
 */
export function useBreakpoint(
  customBreakpoints?: Record<Breakpoint, number>
) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        breakpoint: 'md' as Breakpoint,
        width: 1024,
        height: 768,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoints = customBreakpoints || defaultBreakpoints;

    return {
      breakpoint: getCurrentBreakpoint(width, breakpoints),
      width,
      height,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoints = customBreakpoints || defaultBreakpoints;

      setState({
        breakpoint: getCurrentBreakpoint(width, breakpoints),
        width,
        height,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [customBreakpoints]);

  return state;
}

/**
 * Hook to get responsive value for current breakpoint
 */
export function useResponsiveValue<T>(
  values: ResponsiveValue<T> | T,
  defaultValue: T,
  customBreakpoints?: Record<Breakpoint, number>
): T {
  const { breakpoint } = useBreakpoint(customBreakpoints);

  return useMemo(
    () => getResponsiveValue(values, breakpoint, defaultValue),
    [values, breakpoint, defaultValue]
  );
}

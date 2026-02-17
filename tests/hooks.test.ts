/**
 * Unit tests for AetherUI hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useHover,
  useFocus,
  usePress,
  useDebounce,
  useThrottle,
  useClipboard,
  useClickOutside,
  useEscapeKey,
} from '../src/hooks/useInteractions';

describe('useHover Hook', () => {
  it('should start with isHovered as false', () => {
    const { result } = renderHook(() => useHover());

    expect(result.current.isHovered).toBe(false);
  });

  it('should set isHovered to true on hover', () => {
    const onHoverStart = vi.fn();
    const { result } = renderHook(() => useHover({ onHoverStart }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);
    expect(onHoverStart).toHaveBeenCalled();
  });

  it('should set isHovered to false on hover end', () => {
    const onHoverEnd = vi.fn();
    const { result } = renderHook(() => useHover({ onHoverEnd }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverEnd).toHaveBeenCalled();
  });

  it('should delay hover when delay option is provided', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useHover({ delay: 100 }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(false);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(true);

    vi.useRealTimers();
  });
});

describe('useFocus Hook', () => {
  it('should start with isFocused as false', () => {
    const { result } = renderHook(() => useFocus());

    expect(result.current.isFocused).toBe(false);
    expect(result.current.isFocusVisible).toBe(false);
  });

  it('should set isFocused to true on focus', () => {
    const { result } = renderHook(() => useFocus());

    act(() => {
      result.current.focusProps.onFocus({} as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.isFocused).toBe(true);
    expect(result.current.isFocusVisible).toBe(true);
  });

  it('should set isFocused to false on blur', () => {
    const { result } = renderHook(() => useFocus());

    act(() => {
      result.current.focusProps.onFocus({} as React.FocusEvent<HTMLInputElement>);
      result.current.focusProps.onBlur();
    });

    expect(result.current.isFocused).toBe(false);
    expect(result.current.isFocusVisible).toBe(false);
  });

  it('should hide focus ring on mouse interaction', () => {
    const { result } = renderHook(() => useFocus());

    act(() => {
      result.current.focusProps.onMouseDown();
      result.current.focusProps.onFocus({} as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.isFocused).toBe(true);
    expect(result.current.isFocusVisible).toBe(false);
  });
});

describe('usePress Hook', () => {
  it('should start with isPressed as false', () => {
    const { result } = renderHook(() => usePress());

    expect(result.current.isPressed).toBe(false);
  });

  it('should set isPressed to true on press start', () => {
    const { result } = renderHook(() => usePress());

    act(() => {
      result.current.pressProps.onMouseDown({} as React.MouseEvent);
    });

    expect(result.current.isPressed).toBe(true);
  });

  it('should call onPress callback', () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => usePress({ onPress }));

    act(() => {
      result.current.pressProps.onMouseDown({} as React.MouseEvent);
      result.current.pressProps.onMouseUp();
    });

    expect(onPress).toHaveBeenCalled();
  });

  it('should not call onPress when disabled', () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => usePress({ onPress, disabled: true }));

    act(() => {
      result.current.pressProps.onMouseDown({} as React.MouseEvent);
      result.current.pressProps.onMouseUp();
    });

    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));

    expect(result.current).toBe('test');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Should still be initial before delay
    expect(result.current).toBe('initial');

    // Fast forward past delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset delay on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'change1' });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    rerender({ value: 'change2' });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should not have updated yet
    expect(result.current).toBe('initial');

    // Fast forward remaining time
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('change2');
  });
});

describe('useThrottle Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle callback execution', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    // First call should execute immediately
    act(() => {
      result.current('arg1');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg1');

    // Immediate second call should be throttled
    act(() => {
      result.current('arg2');
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // After delay, should execute again
    act(() => {
      vi.advanceTimersByTime(500);
      result.current('arg3');
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('arg3');
  });
});

describe('useClipboard Hook', () => {
  beforeEach(() => {
    // Mock clipboard API
    global.navigator.clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn(),
    } as any;
  });

  it('should start with isCopied as false', () => {
    const { result } = renderHook(() => useClipboard());

    expect(result.current.isCopied).toBe(false);
  });

  it('should copy text to clipboard', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useClipboard({ onSuccess }));

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(onSuccess).toHaveBeenCalled();

    // Should set isCopied to true temporarily
    expect(result.current.isCopied).toBe(true);

    // Wait for timeout
    await waitFor(
      () => {
        expect(result.current.isCopied).toBe(false);
      },
      { timeout: 2500 }
    );
  });

  it('should handle clipboard errors', async () => {
    const onError = vi.fn();
    const error = new Error('Clipboard error');
    global.navigator.clipboard.writeText = vi.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useClipboard({ onError }));

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(onError).toHaveBeenCalledWith(error);
    expect(result.current.isCopied).toBe(false);
  });
});

describe('useClickOutside Hook', () => {
  it('should call callback when clicking outside', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Create a ref element
    const container = document.createElement('div');
    result.current.current = container;

    act(() => {
      // Simulate click outside
      const outsideEvent = new MouseEvent('mousedown', { bubbles: true });
      document.dispatchEvent(outsideEvent);
    });

    expect(callback).toHaveBeenCalled();
  });

  it('should not call callback when clicking inside', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside(callback));

    // Create a ref element
    const container = document.createElement('div');
    result.current.current = container;

    act(() => {
      // Simulate click inside
      const insideEvent = new MouseEvent('mousedown', { bubbles: true });
      container.dispatchEvent(insideEvent);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should respect ignored elements', () => {
    const callback = vi.fn();
    const ignoredRef = { current: null };

    // Create ignored element
    const ignoredElement = document.createElement('button');
    ignoredRef.current = ignoredElement;
    document.body.appendChild(ignoredElement);

    const { result } = renderHook(() =>
      useClickOutside(callback, { ignoreElements: [ignoredRef] })
    );

    // Create a ref element
    const container = document.createElement('div');
    result.current.current = container;

    act(() => {
      // Simulate click on ignored element
      const ignoredEvent = new MouseEvent('mousedown', { bubbles: true });
      ignoredElement.dispatchEvent(ignoredEvent);
    });

    expect(callback).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(ignoredElement);
  });

  it('should not call callback when disabled', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside(callback, { enabled: false }));

    // Create a ref element
    const container = document.createElement('div');
    result.current.current = container;

    act(() => {
      // Simulate click outside
      const outsideEvent = new MouseEvent('mousedown', { bubbles: true });
      document.dispatchEvent(outsideEvent);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useEscapeKey Hook', () => {
  it('should call callback on escape key press', () => {
    const callback = vi.fn();
    renderHook(() => useEscapeKey(callback));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });

    expect(callback).toHaveBeenCalled();
  });

  it('should not call callback on other keys', () => {
    const callback = vi.fn();
    renderHook(() => useEscapeKey(callback));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback when disabled', () => {
    const callback = vi.fn();
    renderHook(() => useEscapeKey(callback, false));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});

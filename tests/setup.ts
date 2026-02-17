/**
 * Vitest setup file
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> [];
  private readonly callback: IntersectionObserverCallback;
  private elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.rootMargin = options?.rootMargin ?? '';
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0];
  }

  observe(target: Element): void {
    this.elements.add(target);
    // Simulate intersection
    this.callback([{ target, isIntersecting: true }], this);
  }

  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  disconnect(): void {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as any;

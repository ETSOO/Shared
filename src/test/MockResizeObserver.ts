/**
 * Mock implementation of ResizeObserver for testing purposes
 */
export class MockResizeObserver implements ResizeObserver {
  callbacks: Function[] = [];
  elements: Element[] = [];

  constructor(callback: Function) {
    this.callbacks.push(callback);
  }

  observe(element: Element) {
    this.elements.push(element);
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter((el) => el !== element);
  }

  disconnect() {
    this.elements = [];
  }

  // Helper to trigger the callback manually in tests
  trigger(entries: ResizeObserverEntry[]) {
    this.callbacks.forEach((cb) => cb(entries));
  }
}

/**
 * A mock implementation of DOMRect for testing purposes
 */
export class MockDOMRect implements DOMRect {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
  toJSON(): any {
    return JSON.stringify({
      bottom: this.bottom,
      height: this.height,
      left: this.left,
      right: this.right,
      top: this.top,
      width: this.width,
      x: this.x,
      y: this.y
    });
  }

  constructor(width: number, height: number, x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.bottom = this.top + this.height;
    this.right = this.left = this.width;
  }
}

/**
 * Error with custom data
 * Other information can be hold by 'name', 'cause', and 'stack' property
 *
 */
export class DataError<T = Record<string, unknown>> extends Error {
  /**
   * Custom data
   */
  public readonly data: T;

  /**
   * Constructor
   * @param message Error message
   * @param data Custom data
   */
  constructor(message: string, data: T) {
    super(message);

    this.data = data;

    // Set the prototype explicitly to ensure instanceof works correctly
    Object.setPrototypeOf(this, DataError.prototype);
  }
}

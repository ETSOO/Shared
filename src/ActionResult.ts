import { IActionResult } from "./IActionResult";

/**
 * Action result
 */
export class ActionResult {
  /**
   * Create a result from error
   * @returns Action result interface
   */
  static create<D extends object = {}>(error: Error) {
    // If the error has status / statusCode
    const status =
      "status" in error
        ? error.status
        : "statusCode" in error
        ? error.statusCode
        : undefined;

    // Result
    const result: IActionResult<D> = {
      status: typeof status === "number" ? status : undefined,
      ok: false,
      type: error.name,
      title: error.message
    };

    // Return
    return result;
  }
}

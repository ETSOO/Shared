import { DelayedExecutorType } from "./types/DelayedExecutorType";

const hasRequestAnimationFrame = typeof requestAnimationFrame === "function";

/**
 * Extend utilities
 */
export namespace ExtendUtils {
  /**
   * Apply mixins, official suggested method
   * https://www.typescriptlang.org/docs/handbook/mixins.html#understanding-the-sample
   * @param derivedCtor Mixin target class
   * @param baseCtors Mixin base classes
   */
  export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        if (name !== "constructor") {
          // eslint-disable-next-line no-param-reassign
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
  }

  /**
   * Create delayed executor
   * @param func Function
   * @param delayMiliseconds Delay miliseconds
   * @returns Result
   */
  export function delayedExecutor<P extends any[]>(
    func: (...args: P) => void,
    delayMiliseconds: number
  ): DelayedExecutorType<P> {
    let cancel: (() => void) | undefined;
    return {
      /**
       * Call the function
       * @param miliseconds Delayed miliseconds for this call
       * @param args Args
       */
      call(miliseconds?: number, ...args: P) {
        this.clear();
        cancel = waitFor(() => {
          func(...args);
          cancel = undefined;
        }, miliseconds ?? delayMiliseconds);
      },

      /**
       * Clear
       */
      clear() {
        if (this.isRunning()) {
          if (cancel) cancel();
          cancel = undefined;
        }
      },

      /**
       * Is running or not
       * @returns Result
       */
      isRunning() {
        return cancel != null;
      }
    };
  }

  /**
   * Promise handler to catch error
   * @param promise Promise
   */
  export const promiseHandler = (promise: Promise<unknown>) =>
    promise
      .then((value) => [value, undefined])
      .catch((reason) => Promise.resolve([undefined, reason]));

  /**
   * Delay promise
   * @param delay Delay miniseconds
   */
  export function sleep(delay = 0) {
    return new Promise<void>((resolve) => {
      waitFor(resolve, delay);
    });
  }

  /**
   * Wait for condition meets and execute callback
   * requestAnimationFrame to replace setTimeout
   * @param callback Callback
   * @param checkReady Check ready, when it's a number as miliseconds, similar to setTimeout
   * @returns cancel callback
   */
  export function waitFor(
    callback: () => void,
    checkReady: ((spanTime: number) => boolean) | number
  ) {
    let requestID: number | undefined | NodeJS.Timeout;

    if (hasRequestAnimationFrame) {
      let lastTime: number | undefined;
      function loop(timestamp: number) {
        // Cancelled
        if (requestID == null) return;

        if (lastTime === undefined) {
          lastTime = timestamp;
        }

        const elapsed = timestamp - lastTime;

        const isReady =
          typeof checkReady === "number"
            ? elapsed >= checkReady
            : checkReady(elapsed);

        if (isReady) {
          callback();
        } else if (requestID != null) {
          // May also be cancelled in callback or somewhere
          requestID = requestAnimationFrame(loop);
        }
      }
      requestID = requestAnimationFrame(loop);
    } else if (typeof checkReady === "number") {
      requestID = setTimeout(callback, checkReady);
    } else {
      // Bad practice to use setTimeout in this way, only for compatibility
      const ms = 20;
      let spanTime = 0;
      let cr = checkReady;
      function loop() {
        // Cancelled
        if (requestID == null) return;

        spanTime += ms;

        if (cr(spanTime)) {
          callback();
        } else if (requestID != null) {
          // May also be cancelled in callback or somewhere
          requestID = setTimeout(loop, ms);
        }
      }
      requestID = setTimeout(loop, ms);
    }

    return () => {
      if (requestID) {
        if (hasRequestAnimationFrame && typeof requestID === "number") {
          cancelAnimationFrame(requestID);
        } else {
          clearTimeout(requestID);
        }
        requestID = undefined;
      }
    };
  }

  /**
   * Repeat interval for callback
   * @param callback Callback
   * @param miliseconds Miliseconds
   * @returns cancel callback
   */
  export function intervalFor(callback: () => void, miliseconds: number) {
    let requestID: number | undefined | NodeJS.Timer;

    if (hasRequestAnimationFrame) {
      let lastTime: number | undefined;
      function loop(timestamp: number) {
        // Cancelled
        if (requestID == null) return;

        if (lastTime === undefined) {
          lastTime = timestamp;
        }

        const elapsed = timestamp - lastTime;
        if (elapsed >= miliseconds) {
          lastTime = timestamp;
          callback();
        }

        if (requestID != null) {
          // May also be cancelled in callback or somewhere
          requestID = requestAnimationFrame(loop);
        }
      }
      requestID = requestAnimationFrame(loop);
    } else {
      requestID = setInterval(callback, miliseconds);
    }

    return () => {
      if (requestID) {
        if (hasRequestAnimationFrame && typeof requestID === "number") {
          cancelAnimationFrame(requestID);
        } else {
          clearInterval(requestID);
        }
        requestID = undefined;
      }
    };
  }
}

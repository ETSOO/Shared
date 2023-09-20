import { DelayedExecutorType } from './types/DelayedExecutorType';

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
                if (name !== 'constructor') {
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
        return new Promise((resolve) => {
            waitFor(() => resolve, delay);
        });
    }

    /**
     * Wait for condition meets and execute callback
     * requestAnimationFrame to replace setTimeout
     * @param callback Callback
     * @param checkReady Check ready, when it's a number, similar to setTimeout
     * @returns cancel callback
     */
    export function waitFor(
        callback: () => void,
        checkReady: ((spanTime: number) => boolean) | number
    ) {
        let startTime: number | undefined;
        let requestID: number | undefined;
        function doWait(time?: number) {
            // Reset request id
            requestID = undefined;

            // First time
            if (startTime == null) startTime = time;

            // Ignore
            if (startTime === 0) return;

            const spanTime =
                startTime == null || time == null ? 0 : time - startTime;
            if (
                time != null &&
                (typeof checkReady === 'number'
                    ? spanTime >= checkReady
                    : checkReady(spanTime))
            ) {
                callback();
            } else {
                requestID = requestAnimationFrame(doWait);
            }
        }

        doWait();

        return () => {
            if (requestID) cancelAnimationFrame(requestID);
            startTime = undefined;
        };
    }
}

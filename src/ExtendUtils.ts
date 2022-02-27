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
        let seed: number = 0;
        return {
            /**
             * Call the function
             * @param args Args
             */
            call(...args: P) {
                this.clear();
                seed = window.setTimeout(
                    (...args: P) => {
                        func(...args);
                        seed = 0;
                    },
                    delayMiliseconds,
                    ...args
                );
            },

            /**
             * Clear
             */
            clear() {
                if (this.isRunning()) {
                    window.clearTimeout(seed);
                    seed = 0;
                }
            },

            /**
             * Is running or not
             * @returns Result
             */
            isRunning() {
                return seed > 0;
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
            setTimeout(resolve, delay);
        });
    }
}

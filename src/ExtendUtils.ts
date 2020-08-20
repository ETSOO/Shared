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
     * Promise handler to catch error
     * @param promise Promise
     */
    export const promiseHandler = (promise: Promise<any>) =>
        promise
            .then((value) => [value, undefined])
            .catch((reason) => Promise.resolve([undefined, reason]));
}

export type DelayedExecutorType<P extends any[]> = {
    /**
     * Call the function
     * @param args Args
     */
    call(...args: P): void;

    /**
     * Clear
     */
    clear(): void;

    /**
     * Is running or not
     * @returns Result
     */
    isRunning(): boolean;
};

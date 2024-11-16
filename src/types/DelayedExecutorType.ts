export type DelayedExecutorType<P extends any[] = []> = {
  /**
   * Call the function
   * @param miliseconds Delayed miliseconds for this call
   * @param args Args
   */
  call(miliseconds?: number, ...args: P): void;

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

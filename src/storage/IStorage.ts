/**
 * Storage interface
 */
export interface IStorage {
    /**
     * Current instance index
     */
    readonly instanceIndex: number;

    /**
     * Get data
     * @param key Key name
     * @param persistance From the persisted data
     */
    getData<T>(key: string, persistance?: boolean): T | undefined;

    /**
     * Get data with default value
     * @param key Key name
     * @param defaultValue Default value
     * @param persistance From the persisted data
     */
    getData<T>(key: string, defaultValue: T, persistance?: boolean): T;

    /**
     * Get object data
     * @param key Key name
     * @param persistance From the persisted data
     */
    getObject<T extends {}>(key: string, persistance?: boolean): T | undefined;

    /**
     * Set data
     * @param key Key name
     * @param data  Data, null for removal
     * @param persistance Persist the data, false will stop persistance
     */
    setData(key: string, data: unknown, persistance?: boolean): void;

    /**
     * Get current instance count
     * @returns Current instance count
     */
    getInstanceCount(): number;

    /**
     * Update instance count
     * @param removed Is removed?
     * @returns Current instance count
     */
    updateInstanceCount(removed: boolean): number;
}

/**
 * Storage init callback
 */
export interface IStorageInitCallback {
    (field: string, data: string | null, instanceIndex: number): string | null;
}

/**
 * Storage constructor interface
 */
export interface IStorageConstructor {
    new (globalFields: string[], callback: IStorageInitCallback): IStorage;
}

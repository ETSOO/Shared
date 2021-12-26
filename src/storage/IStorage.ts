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
     */
    getData<T>(key: string): T | undefined;

    /**
     * Get data with default value
     * @param key Key name
     * @param defaultValue Default value
     */
    getData<T>(key: string, defaultValue: T): T;

    /**
     * Get persisted data
     * @param key Key name
     */
    getPersistedData<T>(key: string): T | undefined;

    /**
     * Get persisted data with default value
     * @param key Key name
     * @param defaultValue Default value
     */
    getPersistedData<T>(key: string, defaultValue: T): T;

    /**
     * Get object data
     * @param key Key name
     */
    getObject<T extends {}>(key: string): T | undefined;

    /**
     * Get persisted object data
     * @param key Key name
     */
    getPersistedObject<T extends {}>(key: string): T | undefined;

    /**
     * Set data
     * @param key Key name
     * @param data  Data, null for removal
     */
    setData(key: string, data: unknown): void;

    /**
     * Set persisted data
     * @param key Key name
     * @param data  Data, null for removal
     */
    setPersistedData(key: string, data: unknown): void;

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

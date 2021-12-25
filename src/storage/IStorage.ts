/**
 * Storage interface
 */
export interface IStorage {
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
     * Get session storage object data
     * @param key Key name
     */
    getObject<T extends {}>(key: string): T | undefined;

    /**
     * Set data
     * @param key Key name
     * @param data  Data, null for removal
     * @param persistance Persist the data, false will stop persistance
     */
    setData(key: string, data: unknown, persistance?: boolean): void;
}

/**
 * Storage constructor interface
 */
export interface IStorageConstructor {
    new (
        globalFields: string[],
        callback: (field: string, data: string | null) => string | null
    ): IStorage;
}

/**
 * Storage interface
 */
export interface IStorage {
    /**
     * Copy keys to session from persisted source
     * @param keys Keys
     * @param removeSource Remove from the source
     */
    copy(keys: string[], removeSource?: boolean): void;

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
}

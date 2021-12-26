import { StorageUtils } from '../StorageUtils';
import { Utils } from '../Utils';
import { IStorage, IStorageInitCallback } from './IStorage';

/**
 * Window storage
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export class WindowStorage implements IStorage {
    /**
     * Instance count field name
     */
    private readonly instanceCountField = 'EtsooSmartERPInstanceCount';

    private _instanceIndex: number;
    /**
     * Current instance index
     */
    get instanceIndex() {
        return this._instanceIndex;
    }

    /**
     * Constructor
     * @param persistedFields Persisted fields
     * @param callback Field and data callback
     */
    constructor(
        protected persistedFields: string[],
        callback: IStorageInitCallback
    ) {
        // Init instance index
        this._instanceIndex = this.getInstanceCount();

        // Copy global fields to session storage
        persistedFields.forEach((field) => {
            const data = callback(
                field,
                localStorage.getItem(field),
                this._instanceIndex
            );
            if (data == null) sessionStorage.removeItem(field);
            else sessionStorage.setItem(field, data);
        });
    }

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
     * Get data
     * @param key Key name
     * @param defaultValue Default value
     */
    getData<T>(key: string, defaultValue?: T): T | undefined {
        // Get storage
        const data = sessionStorage.getItem(key);

        // No default value
        if (defaultValue == null) return Utils.parseString<T>(data);

        // Return
        return Utils.parseString<T>(data, defaultValue);
    }

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
     * Get persisted data
     * @param key Key name
     * @param defaultValue Default value
     */
    getPersistedData<T>(key: string, defaultValue?: T): T | undefined {
        // Get storage
        const data = localStorage.getItem(key);

        // No default value
        if (defaultValue == null) return Utils.parseString<T>(data);

        // Return
        return Utils.parseString<T>(data, defaultValue);
    }

    /**
     * Get object data
     * @param key Key name
     */
    getObject<T extends {}>(key: string) {
        // Get storage
        const data = sessionStorage.getItem(key);

        if (data == null) return undefined;

        return <T>JSON.parse(data);
    }

    /**
     * Get persisted object data
     * @param key Key name
     */
    getPersistedObject<T extends {}>(key: string) {
        // Get storage
        const data = localStorage.getItem(key);

        if (data == null) return undefined;

        return <T>JSON.parse(data);
    }

    /**
     * Set data
     * @param key Key name
     * @param data  Data, null for removal
     */
    setData(key: string, data: unknown) {
        StorageUtils.setSessionData(key, data);
        if (this.persistedFields.includes(key)) {
            this.setPersistedData(key, data);
        }
    }

    /**
     * Set persisted data
     * @param key Key name
     * @param data  Data, null for removal
     */
    setPersistedData(key: string, data: unknown) {
        StorageUtils.setLocalData(key, data);
    }

    /**
     * Get current instance count
     * @returns Current instance count
     */
    getInstanceCount() {
        const count = this.getPersistedData(this.instanceCountField, 0);
        // Make sure starting from 0
        if (count < 0) return 0;
        return count;
    }

    /**
     * Update instance count
     * @param removed Is removed?
     * @returns Current instance count
     */
    updateInstanceCount(removed: boolean) {
        const count = this.getInstanceCount() + (removed ? -1 : 1);
        this.setPersistedData(this.instanceCountField, count);
        return count;
    }
}

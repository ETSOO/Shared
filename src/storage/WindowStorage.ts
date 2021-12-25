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
     * @param globalFields Global fields
     * @param callback Field and data callback
     */
    constructor(
        private globalFields: string[],
        callback: IStorageInitCallback
    ) {
        // Init instance index
        this._instanceIndex = this.getInstanceCount();

        // Copy global fields to session storage
        globalFields.forEach((field) => {
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
     * Get data
     * @param key Key name
     * @param defaultValue Default value
     * @param persistance From the persisted data
     */
    getData<T>(
        key: string,
        defaultValue?: T,
        persistance?: boolean
    ): T | undefined {
        // Get storage
        const data = persistance
            ? localStorage.getItem(key)
            : sessionStorage.getItem(key);

        // No default value
        if (defaultValue == null) return Utils.parseString<T>(data);

        // Return
        return Utils.parseString<T>(data, defaultValue);
    }

    /**
     * Get object data
     * @param key Key name
     * @param persistance From the persisted data
     */
    getObject<T extends {}>(key: string, persistance?: boolean) {
        // Get storage
        const data = persistance
            ? localStorage.getItem(key)
            : sessionStorage.getItem(key);

        if (data == null) return undefined;

        return <T>JSON.parse(data);
    }

    /**
     * Set data
     * @param key Key name
     * @param data  Data, null for removal
     * @param persistance To the persisted data, false will stop persistance
     */
    setData(key: string, data: unknown, persistance?: boolean) {
        if (persistance) {
            StorageUtils.setLocalData(key, data);
            return;
        }

        StorageUtils.setSessionData(key, data);
        if (persistance !== false && this.globalFields.includes(key)) {
            StorageUtils.setLocalData(key, data);
        }
    }

    /**
     * Get current instance count
     * @returns Current instance count
     */
    getInstanceCount() {
        const count = this.getData(this.instanceCountField, 0, true);
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
        this.setData(this.instanceCountField, count, true);
        return count;
    }
}

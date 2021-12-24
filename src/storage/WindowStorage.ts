import { StorageUtils } from '../StorageUtils';
import { Utils } from '../Utils';
import { IStorage } from './IStorage';

/**
 * Window storage
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export class WindowStorage implements IStorage {
    /**
     * Constructor
     * @param globalFields Global fields
     */
    constructor(private globalFields: string[]) {
        if (globalFields.length == 0) return;

        // Copy global fields to session storage where first item does not exist
        const firsItem = sessionStorage.getItem(globalFields[0]);
        if (firsItem) return;

        globalFields.forEach((field) => {
            const data = localStorage.getItem(field);
            if (data != null) {
                sessionStorage.setItem(field, data);
            }
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
     * Set data
     * @param key Key name
     * @param data  Data, null for removal
     */
    setData(key: string, data: unknown) {
        StorageUtils.setSessionData(key, data);
        if (this.globalFields.includes(key)) {
            StorageUtils.setLocalData(key, data);
        }
    }
}

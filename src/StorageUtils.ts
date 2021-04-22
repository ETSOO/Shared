import { DataTypes } from './DataTypes';
import { Utils } from './Utils';

/**
 * Storage utilities
 */
export namespace StorageUtils {
    /**
     * Set local storage data
     * @param key Key name
     * @param data  Data, null for removal
     */
    export function setLocalData(
        key: string,
        data: DataTypes.BaseCType | object
    ) {
        if (data == null) {
            window.localStorage.removeItem(key);
            return;
        }

        window.localStorage.setItem(
            key,
            typeof data === 'string' ? data : JSON.stringify(data)
        );
    }

    /**
     * Set session storage data
     * @param key Key name
     * @param data Data, null for removal
     */
    export function setSessionData(
        key: string,
        data: DataTypes.BaseCType | object
    ) {
        if (data == null) {
            window.sessionStorage.removeItem(key);
            return;
        }

        window.sessionStorage.setItem(
            key,
            typeof data === 'string' ? data : JSON.stringify(data)
        );
    }

    /**
     * Get local storage data
     * @param key Key name
     * @param defaultValue Default value
     */
    export function getLocalData<T>(key: string, defaultValue: T) {
        // Get storage
        const data = window.localStorage.getItem(key);

        // Return
        return Utils.parseString(data, defaultValue);
    }

    /**
     * Get session storage data
     * @param key Key name
     */
    export function getSessionData<T>(key: string, defaultValue: T) {
        // Get storage
        const data = window.sessionStorage.getItem(key);

        // Return
        return Utils.parseString(data, defaultValue);
    }
}

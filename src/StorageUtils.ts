import { NodeStorage } from './node/Storage';
import { Utils } from './Utils';

// Mock node
globalThis.localStorage ??= new NodeStorage();
globalThis.sessionStorage ??= new NodeStorage();

/**
 * Storage utilities
 * NodeStorage needs data persistance
 */
export namespace StorageUtils {
    /**
     * Set local storage data
     * @param key Key name
     * @param data  Data, null for removal
     */
    export function setLocalData(key: string, data: unknown) {
        if (data == null) {
            localStorage.removeItem(key);
            return;
        }

        localStorage.setItem(
            key,
            typeof data === 'string' ? data : JSON.stringify(data)
        );
    }

    /**
     * Set session storage data
     * @param key Key name
     * @param data Data, null for removal
     */
    export function setSessionData(key: string, data: unknown) {
        if (data == null) {
            sessionStorage.removeItem(key);
            return;
        }

        sessionStorage.setItem(
            key,
            typeof data === 'string' ? data : JSON.stringify(data)
        );
    }

    /**
     * Get local storage data
     * @param key Key name
     * @param defaultValue Default value
     */
    export function getLocalData<T, M = T | undefined>(
        key: string,
        defaultValue?: M
    ): M extends T ? M : undefined {
        // Get storage
        const data = localStorage.getItem(key);

        // Return
        return Utils.parseString(data, defaultValue);
    }

    /**
     * Get local storage object data
     * @param key Key name
     */
    export function getLocalObject<T extends {}>(key: string) {
        // Get storage
        const data = localStorage.getItem(key);
        if (data == null) return undefined;
        return <T>JSON.parse(data);
    }

    /**
     * Get session storage data
     * @param key Key name
     */
    export function getSessionData<T, M = T | undefined>(
        key: string,
        defaultValue?: M
    ): M extends T ? M : undefined {
        // Get storage
        const data = sessionStorage.getItem(key);

        // Return
        return Utils.parseString(data, defaultValue);
    }

    /**
     * Get session storage object data
     * @param key Key name
     */
    export function getSessionObject<T extends {}>(key: string) {
        // Get storage
        const data = sessionStorage.getItem(key);
        if (data == null) return undefined;
        return <T>JSON.parse(data);
    }
}

/**
 * Storage utilities
 */
export namespace StorageUtils {
    /**
     * Cache local storage data
     * @param key Key name
     * @param data  Data, null for removal
     */
    export function cacheLocalData(
        key: string,
        data: string | object | undefined
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
     * Cache session storage data
     * @param key Key name
     * @param data Data, null for removal
     */
    export function cacheSessionData(
        key: string,
        data: string | object | undefined
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
     */
    export function getLocalData(key: string) {
        return window.localStorage.getItem(key);
    }

    /**
     * Get local storage data with specific type
     * @param key Key name
     */
    export function getLocalDataTyped<T>(key: string) {
        const data = getLocalData(key);
        if (data) return JSON.parse(data) as T;
        return undefined;
    }

    /**
     * Get session storage data
     * @param key Key name
     */
    export function getSessionData(key: string) {
        return window.sessionStorage.getItem(key);
    }

    /**
     * Get session storage data with specific type
     * @param key Key name
     */
    export function getSessionDataTyped<T>(key: string) {
        const data = getSessionData(key);
        if (data) return JSON.parse(data) as T;
        return undefined;
    }
}

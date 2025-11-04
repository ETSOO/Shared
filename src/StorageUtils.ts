import { NodeStorage } from "./node/Storage";
import { Utils } from "./Utils";

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
      typeof data === "string" ? data : JSON.stringify(data)
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
      typeof data === "string" ? data : JSON.stringify(data)
    );
  }

  /**
   * Get local storage data
   * @param key Key name
   */
  export function getLocalData<T>(key: string): T | undefined;

  /**
   * Get local storage data
   * @param key Key name
   * @param defaultValue Default value
   */
  export function getLocalData<T>(key: string, defaultValue: T): T;

  /**
   * Get local storage data
   * @param key Key name
   * @param defaultValue Default value
   */
  export function getLocalData<T>(
    key: string,
    defaultValue?: T
  ): T | undefined {
    // Get storage
    const data = localStorage.getItem(key);

    // No default value
    if (defaultValue == null) return Utils.parseString<T>(data);

    // Return
    return Utils.parseString<T>(data, defaultValue);
  }

  /**
   * Get local storage object data
   * @param key Key name
   */
  export function getLocalObject<T extends object>(key: string) {
    // Get storage
    const data = localStorage.getItem(key);
    if (data == null) return undefined;
    return <T>JSON.parse(data);
  }

  /**
   * Get session storage data
   * @param key Key name
   */
  export function getSessionData<T>(key: string): T | undefined;

  /**
   * Get session storage data with default value
   * @param key Key name
   * @param defaultValue Default value
   */
  export function getSessionData<T>(key: string, defaultValue: T): T;

  /**
   * Get session storage data
   * @param key Key name
   * @param defaultValue Default value
   */
  export function getSessionData<T>(
    key: string,
    defaultValue?: T
  ): T | undefined {
    // Get storage
    const data = sessionStorage.getItem(key);

    // No default value
    if (defaultValue == null) return Utils.parseString<T>(data);

    // Return
    return Utils.parseString<T>(data, defaultValue);
  }

  /**
   * Get session storage object data
   * @param key Key name
   */
  export function getSessionObject<T extends object>(key: string) {
    // Get storage
    const data = sessionStorage.getItem(key);
    if (data == null) return undefined;
    return <T>JSON.parse(data);
  }
}

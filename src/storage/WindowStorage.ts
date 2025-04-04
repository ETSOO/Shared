import { StorageUtils } from "../StorageUtils";
import { Utils } from "../Utils";
import { IStorage } from "./IStorage";

/**
 * Window storage
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export class WindowStorage implements IStorage {
  /**
   * Clear keys
   * @param keys Keys
   * @param persisted Persisted or session data
   */
  clear(keys: string[], persisted?: boolean) {
    keys.forEach((key) => {
      if (persisted) this.setPersistedData(key, undefined);
      else this.setData(key, undefined);
    });
  }

  /**
   * Copy keys to session from persisted source
   * @param keys Keys
   * @param removeSource Remove from the source
   */
  copyFrom(keys: string[], removeSource?: boolean) {
    keys.forEach((key) => {
      this.setData(key, this.getPersistedData(key));
      if (removeSource) this.setPersistedData(key, undefined);
    });
  }

  /**
   * Copy keys to persisted source
   * @param keys Keys
   * @param removeSource Remove from the source
   */
  copyTo(keys: string[], removeSource?: boolean) {
    keys.forEach((key) => {
      this.setPersistedData(key, this.getData(key));
      if (removeSource) this.setData(key, undefined);
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
  getObject<T extends object>(key: string) {
    // Get storage
    const data = sessionStorage.getItem(key);

    if (data == null) return undefined;

    return <T>JSON.parse(data);
  }

  /**
   * Get persisted object data
   * @param key Key name
   */
  getPersistedObject<T extends object>(key: string) {
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
  }

  /**
   * Set persisted data
   * @param key Key name
   * @param data  Data, null for removal
   */
  setPersistedData(key: string, data: unknown) {
    StorageUtils.setLocalData(key, data);
  }
}

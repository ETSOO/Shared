/**
 * Node storage
 * Please take care of the persistence with source property
 */
export class NodeStorage {
  /**
   * Storage source
   */
  source: [string, string][] = [];

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Returns the number of key/value pairs currently present in the list
   */
  get length(): number {
    return this.source.length;
  }

  /**
   * Empties the list associated with the object of all key/value pairs, if there are any.
   */
  clear(): void {
    this.source = [];
  }

  /**
   * Returns the current value associated with the given key, or null if the given key does not exist in the list
   * @param key Key
   */
  getItem(key: string): string | null {
    const item = this.source.find((p) => p[0] === key);
    return item == null ? null : item[1];
  }

  /**
   * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
   */
  key(index: number): string | null {
    if (index < 0 || index >= this.source.length) return null;
    return this.source[index][0];
  }

  /**
   * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
   */
  removeItem(key: string): void {
    this.source.remove((p) => p[0] === key);
  }

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   */
  setItem(key: string, value: string): void {
    const item = this.source.find((p) => p[0] === key);
    if (item) {
      item[1] = value;
    } else {
      this.source.push([key, value]);
    }
  }
}

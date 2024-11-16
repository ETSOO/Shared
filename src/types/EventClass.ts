/**
 * Abstract event base class
 * T for type
 * D for data
 */
export abstract class EventBase<T, D> {
  private _propagationStopped: boolean = false;
  /**
   * stopImmediatePropagation called
   */
  get propagationStopped() {
    return this._propagationStopped;
  }

  private _timeStamp: number;
  /**
   * Time stamp
   */
  get timeStamp() {
    return this._timeStamp;
  }

  /**
   * Constructor
   * @param type Type
   */
  constructor(
    public readonly target: {},
    public readonly type: T,
    public readonly data: D
  ) {
    this._timeStamp = Date.now();
  }

  /**
   * Prevent all other listeners from being called
   */
  stopImmediatePropagation() {
    this._propagationStopped = true;
  }
}

/**
 * Event options
 */
interface EventOptions {
  /**
   * A boolean value indicating that events of this type will be dispatched first
   */
  capture?: boolean;

  /**
   * A boolean value indicating that the listener should be invoked at most once after being added
   */
  once?: boolean;
}

type EventClassDef = { [key: string]: object };

/**
 * Event class
 * T for type
 * D for data
 */
export abstract class EventClass<D extends EventClassDef> {
  // Listeners
  private readonly listeners = new Map<
    keyof D,
    [(event: EventBase<keyof D, D[keyof D]>) => void, EventOptions?][]
  >();

  /**
   * Has specific type events
   * @param type Type
   */
  hasEvents<T extends keyof D>(type: T): boolean;

  /**
   * Has specific type and callback events
   * @param type Type
   * @param callback Callback
   */
  hasEvents<T extends keyof D>(
    type: T,
    callback: (event: EventBase<T, D[T]>) => void
  ): boolean;

  /**
   * Has specific type and callback events
   * @param type Type
   * @param callback Callback
   * @returns Result
   */
  hasEvents<T extends keyof D>(
    type: T,
    callback?: (event: EventBase<T, D[T]>) => void
  ) {
    const items = this.listeners.get(type);
    if (items == null || items.length === 0) return false;

    if (callback) {
      return items.some((item) => item[0] == callback);
    }

    return true;
  }

  /**
   * Remove all specific type events
   * @param type Type
   */
  off<T extends keyof D>(type: T): void;

  /**
   * Remove specific type and callback event
   * @param type Type
   * @param callback Callback
   */
  off<T extends keyof D>(
    type: T,
    callback: (event: EventBase<T, D[T]>) => void
  ): void;

  /**
   * Remove specific type and callback event
   * @param type Type
   * @param callback Callback
   */
  off<T extends keyof D>(
    type: T,
    callback?: (event: EventBase<T, D[T]>) => void
  ) {
    if (callback == null) {
      this.listeners.delete(type);
      return;
    }

    const items = this.listeners.get(type);
    if (items == null) return;

    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i][0] == callback) {
        items.splice(i, 1);
      }
    }
  }

  /**
   * Add event listeners
   * @param collection Collection of events
   */
  on(collection: {
    [type in keyof D]: (event: EventBase<type, D[type]>) => void;
  }): void;

  /**
   * Add event listener
   * @param type Type
   * @param callback Callback
   * @param options Options
   */
  on<T extends keyof D>(
    type: T,
    callback: (event: EventBase<T, D[T]>) => void,
    options?: EventOptions
  ): void;

  /**
   * Add events
   * @param type Type
   * @param callback Callback
   * @param options Options
   */
  on<T extends keyof D>(
    type:
      | {
          [type in keyof D]: (event: EventBase<type, D[type]>) => void;
        }
      | T,
    callback?: (event: EventBase<T, D[T]>) => void,
    options?: EventOptions
  ) {
    if (typeof type === "object") {
      for (const key in type) {
        const item = key as keyof D;
        const itemCallback = type[item] ?? callback;
        if (itemCallback) this.on(item, itemCallback, options);
      }
      return;
    }

    if (callback == null) return;
    this.listeners.has(type) || this.listeners.set(type, []);

    // String to T conversion problem
    // "keyofStringsOnly": true could solve part of it
    this.listeners.get(type)?.push([callback as any, options]);
  }

  /**
   * Trigger event
   * @param event Event
   */
  trigger<T extends keyof D>(event: EventBase<T, D[T]>) {
    const items = this.listeners.get(event.type);
    if (items == null) return;

    // Len
    const len = items.length;
    if (len === 0) return;

    // Need to be removed indicies
    const indicies: number[] = [];

    // Capture items first
    let stopped: boolean = false;
    for (let c = 0; c < len; c++) {
      const item = items[c];
      const [callback, options] = item;
      if (options == null || !options.capture) continue;

      callback(event);

      if (options.once) {
        indicies.push(c);
      }

      if (event.propagationStopped) {
        stopped = true;
        break;
      }
    }

    if (!stopped) {
      for (let c = 0; c < len; c++) {
        const item = items[c];
        const [callback, options] = item;
        if (options?.capture) continue;

        callback(event);

        if (options?.once) {
          indicies.push(c);
        }

        if (event.propagationStopped) {
          stopped = true;
          break;
        }
      }
    }

    // Remove all once handlers
    for (let i = indicies.length - 1; i >= 0; i--) {
      items.splice(indicies[i], 1);
    }
  }
}

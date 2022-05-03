/**
 * Abstract event base class
 * T for type
 * D for data
 */
export abstract class EventBase<T extends string, D> {
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
        public readonly target: EventClass<T, D>,
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

/**
 * Event class callback
 * T for type
 * D for data
 */
export type EventClassCallback<T extends string, D> = (
    event: EventBase<T, D>
) => void;

/**
 * Event class collection definition
 * T for type
 * D for data
 */
export type EventClassCollection<T extends string, D> = {
    [key in T]?: EventClassCallback<T, D>;
};

/**
 * Event class
 * T for type
 * D for data
 */
export abstract class EventClass<T extends string, D> {
    // Listeners
    private readonly listeners = new Map<
        T,
        [EventClassCallback<T, D>, EventOptions?][]
    >();

    /**
     * Has specific type events
     * @param type Type
     */
    hasEvents(type: T): boolean;

    /**
     * Has specific type and callback events
     * @param type Type
     * @param callback Callback
     */
    hasEvents(type: T, callback: EventClassCallback<T, D>): boolean;

    /**
     * Has specific type and callback events
     * @param type Type
     * @param callback Callback
     * @returns Result
     */
    hasEvents(type: T, callback?: EventClassCallback<T, D>) {
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
    off(type: T): void;

    /**
     * Remove specific type and callback event
     * @param type Type
     * @param callback Callback
     */
    off(type: T, callback: EventClassCallback<T, D>): void;

    /**
     * Remove specific type and callback event
     * @param type Type
     * @param callback Callback
     */
    off(type: T, callback?: EventClassCallback<T, D>) {
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
    on(collection: EventClassCollection<T, D>): void;

    /**
     * Add event listener
     * @param type Type
     * @param callback Callback
     * @param options Options
     */
    on(
        type: T,
        callback: EventClassCallback<T, D>,
        options?: EventOptions
    ): void;

    /**
     * Add events
     * @param type Type
     * @param callback Callback
     * @param options Options
     */
    on(
        type: EventClassCollection<T, D> | T,
        callback?: EventClassCallback<T, D>,
        options?: EventOptions
    ) {
        if (typeof type === 'object') {
            for (const key in type) {
                const item = key as T;
                const itemCallback = type[item] ?? callback;
                if (itemCallback) this.on(item, itemCallback, options);
            }
            return;
        }

        if (callback == null) return;
        this.listeners.has(type) || this.listeners.set(type, []);
        this.listeners.get(type)?.push([callback, options]);
    }

    /**
     * Trigger event
     * @param event Event
     */
    trigger(event: EventBase<T, D>) {
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

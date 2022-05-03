import { EventBase, EventClass } from './EventClass';

/**
 * ETSOO Extended history event type
 */
export type EHistoryEventType = 'navigate' | 'push' | 'replace' | 'clear';

/**
 * ETSOO Extended history event data
 */
export interface EHistoryEventData {
    /**
     * Current index
     */
    index: number;
}

/**
 * ETSOO Extended abstract history class
 */
export abstract class EHistory<
    T,
    D extends EHistoryEventData
> extends EventClass<EHistoryEventType, D> {
    // Index
    private _index: number = -1;

    /**
     * States
     */
    readonly states: T[] = [];

    /**
     * States length
     */
    get length() {
        return this.states.length;
    }

    /**
     * Get current state index
     */
    get index() {
        return this._index;
    }

    /**
     * Get current state
     */
    get state() {
        if (this._index === -1) return undefined;
        return this.states[this._index];
    }

    /**
     * Back to the previous state
     */
    back() {
        this.go(-1);
    }

    /**
     * Clear all states but keep event listeners
     */
    clear() {
        // https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
        this.states.length = 0;
        this._index = -1;
        this.trigger(this.createEvent('clear', this._index));
    }

    /**
     * Create event
     * @param type Type
     * @param index Current index
     */
    protected abstract createEvent(
        type: EHistoryEventType,
        index: number
    ): EventBase<EHistoryEventType, D>;

    /**
     * Forward to the next state
     */
    forward() {
        this.go(1);
    }

    /**
     * Go to the specific state
     * @param delta A negative value moves backwards, a positive value moves forwards
     */
    go(delta: number) {
        // No data
        if (this._index === -1) return undefined;

        // New index
        const newIndex = this._index + delta;

        // Not in the range
        if (newIndex < 0 || newIndex >= this.length) return undefined;

        // Update the index
        this._index = newIndex;

        // Trigger event
        this.trigger(this.createEvent('navigate', newIndex));
    }

    /**
     * Adds an entry to the history stack
     * @param state State
     */
    pushState(state: T) {
        if (this._index >= 0) {
            // Remove states after the index
            this.states.splice(this._index + 1);
        }

        this.states.push(state);
        this._index++;
        this.trigger(this.createEvent('push', this._index));
    }

    /**
     * Modifies the current history entry
     * @param state State
     */
    replaceState(state: T) {
        if (this._index === -1) return;
        this.states[this._index] = state;
        this.trigger(this.createEvent('replace', this._index));
    }
}

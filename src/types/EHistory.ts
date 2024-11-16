import { EventBase, EventClass } from "./EventClass";

interface EHistoryEventData {
  /**
   * Current index
   */
  index: number;
}

interface EHistoryNavigateEventData extends EHistoryEventData {
  /**
   * Delta
   */
  delta: number;
}

type EHistoryEventDef = {
  clear: EHistoryEventData;
  navigate: EHistoryNavigateEventData;
  push: EHistoryEventData;
  replace: EHistoryEventData;
};

type EHistoryEventType = Exclude<keyof EHistoryEventDef, "navigate">;

/**
 * ETSOO Extended history event
 */
export class EHistoryEvent extends EventBase<
  EHistoryEventType,
  EHistoryEventData
> {}

/**
 * ETSOO Extended history navigate event
 */
export class EHistoryNavigateEvent extends EventBase<
  "navigate",
  EHistoryNavigateEventData
> {
  constructor(target: {}, data: EHistoryNavigateEventData) {
    super(target, "navigate", data);
  }
}

/**
 * ETSOO Extended abstract history class
 */
export abstract class EHistory<T> extends EventClass<EHistoryEventDef> {
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
   * Constructor
   * @param maxDepth Max depth of the history
   */
  constructor(public readonly maxDepth: number = 20) {
    super();
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
    this.trigger(this.createEvent("clear", this._index));
  }

  /**
   * Create event
   * @param type Type
   * @param index Current index
   */
  protected createEvent<T extends EHistoryEventType>(type: T, index: number) {
    return new EHistoryEvent(this, type, { index });
  }

  protected createNavigateEvent(index: number, delta: number) {
    return new EHistoryNavigateEvent(this, { index, delta });
  }

  /**
   * Forward to the next state
   */
  forward() {
    this.go(1);
  }

  /**
   * Get [undo, redo] status
   */
  getStatus(): [boolean, boolean] {
    if (this.length < 2) return [false, false];
    if (this._index <= 0) return [false, true];
    if (this._index + 1 >= this.length) return [true, false];
    return [true, true];
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
    this.trigger(this.createNavigateEvent(newIndex, delta));
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

    if (this.length > this.maxDepth) {
      this.states.shift();
    }

    this.trigger(this.createEvent("push", this._index));
  }

  /**
   * Modifies the current history entry
   * @param state State
   */
  replaceState(state: T) {
    if (this._index === -1) return;
    this.states[this._index] = state;
    this.trigger(this.createEvent("replace", this._index));
  }
}

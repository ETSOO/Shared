import { EHistory, EHistoryNavigateEvent } from '../src/types/EHistory';

// Extended for tests
class LHistory extends EHistory<number> {}

test('Tests for history', () => {
    const history = new LHistory();
    expect(history.index).toBe(-1);
    history.pushState(1);
    expect(history.getStatus()).toStrictEqual([false, false]);
    history.pushState(2);
    history.pushState(3);
    expect(history.getStatus()).toStrictEqual([true, false]);
    expect(history.states).toStrictEqual([1, 2, 3]);
    expect(history.index).toBe(2);
    history.back();
    expect(history.getStatus()).toStrictEqual([true, true]);
    history.pushState(4);
    expect(history.index).toBe(2);
    expect(history.states).toStrictEqual([1, 2, 4]);
    history.go(-2);
    expect(history.state).toBe(1);
    history.forward();
    expect(history.index).toBe(1);
    history.replaceState(0);
    expect(history.state).toBe(0);
    history.clear();
    expect(history.length).toBe(0);
});

test('Tests for events', () => {
    const navigatorFn = jest.fn();
    const navigatorStopFn = jest.fn((event: EHistoryNavigateEvent) => {
        event.stopImmediatePropagation();
    });
    const clearFn = jest.fn();
    const pushFn = jest.fn();
    const replaceFn = jest.fn();

    const history = new LHistory(3);

    history.on({
        clear: clearFn,
        push: pushFn,
        replace: replaceFn,
        navigate: navigatorFn
    });
    history.on('navigate', navigatorFn);
    history.on('navigate', navigatorFn, { capture: true, once: true });

    history.clear();
    expect(clearFn).toHaveBeenCalled();

    history.pushState(1);
    expect(pushFn).toHaveBeenCalled();

    history.replaceState(11);
    expect(replaceFn).toHaveBeenCalled();

    history.pushState(2);
    history.back();
    expect(navigatorFn).toHaveBeenCalledTimes(3);

    history.forward();
    // Once handler was removed
    expect(navigatorFn).toHaveBeenCalledTimes(5);

    history.on('navigate', navigatorStopFn, { capture: true });
    history.go(-1);
    expect(navigatorStopFn).toHaveBeenCalled();

    // Previous handler stopped propagation
    expect(navigatorFn).toHaveBeenCalledTimes(5);

    history.pushState(3);
    history.pushState(4);
    history.pushState(5);
    expect(history.length).toBe(3);
});

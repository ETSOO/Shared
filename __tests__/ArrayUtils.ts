import { ArrayUtils } from '../src/ArrayUtils';

test('Tests for simple type toUnique', () => {
    const result = [1, 1, 3, 5, 5].toUnique();
    expect(result).toStrictEqual([1, 3, 5]);
});

test('Tests for object type toUnique', () => {
    const result = [
        { id: 1, label: 'a' },
        { id: 2, label: 'b' },
        { id: 2, label: 'b' }
    ].toUnique();
    expect(result.length).toBe(2);
});

test('Tests for differences', () => {
    const a1 = ['a', 'b', 'c', 'e'];
    const a2 = ['a', 'c', 'd'];
    expect(ArrayUtils.differences(a1, a2)).toEqual(['b', 'e']);
    expect(ArrayUtils.differences(a1, a2, true)).toEqual(['b', 'e', 'd']);
});

test('Tests for sum numbers', () => {
    const items = [12, 8, 22];
    expect(items.sum()).toBe(42);
});

test('Tests for sum fields', () => {
    const items = [
        { id: 1, label: 'a', amount: 3.14 },
        { id: 2, label: 'b', amount: 4.54 }
    ];
    expect(items.sum('amount')).toBe(7.68);
});

test('Tests for max / min numbers', () => {
    const items = [12, 8, 22];
    expect(items.max()).toBe(22);
    expect(items.min()).toBe(8);
});

test('Tests for max / min fields', () => {
    const items = [
        { id: 1, label: 'a', amount: 3.14 },
        { id: 2, label: 'b', amount: 4.54 },
        { id: 2, label: 'b', amount: 1.52 }
    ];
    expect(items.max('amount')).toBe(4.54);
    expect(items.min('amount')).toBe(1.52);
});

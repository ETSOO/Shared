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
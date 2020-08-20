import { NumberUtils } from '../src/NumberUtils';

test('Tests for parse', () => {
    expect(NumberUtils.parse('123')).toBe(123);
    expect(NumberUtils.parse(Object(123))).toBe(123);
    expect(isNaN(NumberUtils.parse('a'))).toBeTruthy();
});

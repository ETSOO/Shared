import { NumberUtils } from '../src/NumberUtils';

test('Tests for format', () => {
    expect(NumberUtils.format(undefined)).toBeUndefined();
    expect(NumberUtils.format(12.4, 'zh-CN', { style: 'percent' })).toBe(
        '1,240%'
    );
});

test('Tests for formatMoney', () => {
    expect(NumberUtils.formatMoney(1282.4, 'CNY', 'zh-CN')).toBe('¥1,282.40');
    expect(NumberUtils.formatMoney(1282, 'CNY', 'zh-CN', true)).toBe('¥1,282');
});

test('Tests for parse', () => {
    expect(NumberUtils.parse('123')).toBe(123);
    expect(NumberUtils.parse(Object(123))).toBe(123);
    expect(isNaN(NumberUtils.parse('a'))).toBeTruthy();
});

test('Tests for parseWithUnit', () => {
    expect(NumberUtils.parseWithUnit('8px')).toStrictEqual([8, 'px']);
    expect(NumberUtils.parseWithUnit('16')).toStrictEqual([16, '']);
    expect(NumberUtils.parseWithUnit('a16')).toBeUndefined();
});

test('Tests for toExact', () => {
    // 0.7000000000000001
    const result = 0.8 - 0.1;
    expect(result).not.toBe(0.7);
    expect(result.toExact()).toBe(0.7);
});

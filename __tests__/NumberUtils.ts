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

import { DateUtils } from '../src/DateUtils';

test('Tests for parse', () => {
    // Arrange
    const date = new Date(Date.UTC(2021, 5, 12, 2, 23, 6));

    // Act & assert
    expect(DateUtils.format('zh-CN', date, 'd')).toBe('2021/06/12');
    expect(DateUtils.format('en-US', date, 'dm')).toBe('06/12/2021 14:23');
    expect(DateUtils.format('en-NZ', date, 'ds')).toBe('12/06/2021 14:23:06');
});

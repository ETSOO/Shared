import { DateUtils } from '../src/DateUtils';

test('Tests for parse', () => {
    // Arrange
    const date = new Date('2021-06-12T02:23:06');

    // Act & assert
    expect(DateUtils.format('zh-CN', date, 'd')).toBe('2021/06/12');
    expect(DateUtils.format('en-US', date, 'dm')).toBe('06/12/2021 02:23');
    expect(DateUtils.format('en-NZ', date, 'ds')).toBe('12/06/2021 02:23:06');
});

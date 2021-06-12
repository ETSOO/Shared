import { DateUtils } from '../src/DateUtils';

test('Tests for local date time', () => {
    // Arrange
    const date = new Date('2021-06-12T02:23:06');

    // Act & assert
    expect(DateUtils.format('zh-CN', date, 'd')).toBe('2021/06/12');
    expect(DateUtils.format('en-US', date, 'dm')).toBe('06/12/2021 02:23');
    expect(DateUtils.format('en-NZ', date, 'ds')).toBe('12/06/2021 02:23:06');
});

test('Tests for UTC date time', () => {
    // Arrange
    const utc1 = new Date('2021-06-12T02:23:06.000Z');

    // Act & assert
    expect(DateUtils.format('en-NZ', utc1, 'ds', 'Pacific/Auckland')).toBe(
        '12/06/2021 14:23:06'
    );

    const utc2 = new Date('2021-06-12T02:23:06.000Z');

    expect(DateUtils.format('en-US', utc2, 'ds', 'America/New_York')).toBe(
        '06/11/2021 22:23:06'
    );
});

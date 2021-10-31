import { DateUtils } from '../src/DateUtils';

test('Tests for local date time', () => {
    // Arrange
    const date = new Date('2021-06-12T02:23:06');

    // Act & assert
    expect(DateUtils.format(date, 'zh-CN', 'd')).toBe('2021/06/12');
    expect(DateUtils.format(date, 'en-US', 'dm')).toBe('06/12/2021 02:23');
    expect(DateUtils.format(date, 'en-NZ', 'ds')).toBe('12/06/2021 02:23:06');
});

test('Tests for UTC date time', () => {
    // Arrange
    const utc1 = new Date('2021-06-12T02:23:06.000Z');

    // Act & assert
    expect(DateUtils.format(utc1, 'en-NZ', 'ds', 'Pacific/Auckland')).toBe(
        '12/06/2021 14:23:06'
    );

    const utc2 = new Date('2021-06-12T02:23:06.000Z');

    expect(DateUtils.format(utc2, 'en-US', 'ds', 'America/New_York')).toBe(
        '06/11/2021 22:23:06'
    );
});

test('Tests for date parse', () => {
    const json = `
    {   
        "id": 1234, 
        "logined": false,   
        "name": "Jimmy Roe",
        "externalId": "1234",
        "creation": "2014-01-01T13:13:34.441Z"
    }
    `;

    const result = JSON.parse(json, DateUtils.buildJsonParser(['creation']));
    const isDate = result.creation instanceof Date;
    const isIdDate = result.externalId instanceof Date;

    expect(isIdDate).toBeFalsy();
    expect(isDate).toBeTruthy();
});

test('Tests for formatForInput', () => {
    const result1 = DateUtils.formatForInput('2021/7/17');
    expect(result1).toBe('2021-07-17');

    const result2 = DateUtils.formatForInput(new Date(2021, 5, 6));
    expect(result2).toBe('2021-06-06');
});

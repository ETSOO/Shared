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

test('Tests for getDays', () => {
    expect(DateUtils.getDays(2021, 1)).toBe(28);
    expect(DateUtils.getDays(2009, 1)).toBe(28);
    expect(DateUtils.getDays(2008, 1)).toBe(29);
    expect(DateUtils.getDays(2000, 1)).toBe(29);
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

    const result = JSON.parse(json, DateUtils.jsonParser(['creation']));
    const isDate = result.creation instanceof Date;
    const isIdDate = result.externalId instanceof Date;

    expect(isIdDate).toBeFalsy();
    expect(isDate).toBeTruthy();
});

test('Tests for formatForInput', () => {
    const result1 = DateUtils.formatForInput('2021/7/17');
    expect(result1).toBe('2021-07-17');

    const d = new Date(2021, 5, 6, 20, 8, 45);
    const result2 = DateUtils.formatForInput(d);
    expect(result2).toBe('2021-06-06');

    const result3 = DateUtils.formatForInput(d, false);
    expect(result3).toBe('2021-06-06T20:08');

    const result4 = DateUtils.formatForInput(d, true);
    expect(result4).toBe('2021-06-06T20:08:45');
});

test('Tests for substract', () => {
    const d1 = new Date('2021/1/13 12:00:00');
    const d2 = new Date('2022/1/13 12:00:00');
    const d3 = new Date('2022/1/13 12:10:01');
    const d4 = new Date('2023/1/12 12:00:00');
    expect(d3.substract(d1).totalYears > 1).toBeTruthy();
    expect(d4.substract(d1).totalYears < 2).toBeTruthy();
    expect(d2.substract(d1).totalMinutes > 10).toBeTruthy();
});

test('Tests for sameDay', () => {
    expect(
        DateUtils.sameDay('2022/9/11 22:03', new Date(2022, 8, 11, 10, 3))
    ).toBeTruthy();
    expect(
        DateUtils.sameDay('2022/9/11 22:03', new Date(2022, 9, 11, 10, 3))
    ).toBeFalsy();
});

test('Tests for sameMonth', () => {
    expect(
        DateUtils.sameMonth('2022-09-11 22:03', new Date(2022, 8, 10, 10, 3))
    ).toBeTruthy();
    expect(
        DateUtils.sameMonth('2022/9/11 22:03', '2022/8/31 23:59:59')
    ).toBeFalsy();
});

import { DataTypes } from '../src/DataTypes';

test('Tests for convert', () => {
    expect(DataTypes.convert('5', 0)).toStrictEqual(5);
    expect(
        DataTypes.convert('2021/10/13', new Date())?.getDate()
    ).toStrictEqual(13);
    expect(DataTypes.convert('a', [])?.length).toStrictEqual(1);
    expect(DataTypes.convert('1', [0])).toStrictEqual([1]);
    expect(DataTypes.convert('', 0)).toBeUndefined();
    expect(DataTypes.convert('false', true)).toBeFalsy();
    expect(DataTypes.convert('1', true)).toBeTruthy();
    expect(DataTypes.convert(true, true)).toBeTruthy();
});

test('Tests for convertByType', () => {
    expect(DataTypes.convertByType('', 'number')).toBeUndefined();
    expect(DataTypes.convertByType('', 'string')).toBeUndefined();
    expect(DataTypes.convertByType('', 'boolean')).toBeUndefined();
    expect(DataTypes.convertByType(['5', 8], 'number[]')).toStrictEqual([5, 8]);
    expect(DataTypes.convertByType(['5', 8], 'string[]')).toStrictEqual([
        '5',
        '8'
    ]);
    expect(
        DataTypes.convertByType('2021/10/13', 'date')?.getDate()
    ).toStrictEqual(13);
});

test('Tests for convertSimple', () => {
    expect(
        DataTypes.convertSimple(5.8, DataTypes.CombinedEnum.Int)
    ).toStrictEqual(6);
    expect(
        DataTypes.convertSimple(5.88293, DataTypes.CombinedEnum.Money)
    ).toStrictEqual(5.8829);
});

test('Tests for getBasicName', () => {
    expect(
        DataTypes.getBasicName(DataTypes.CombinedEnum.DateTime)
    ).toStrictEqual('date');
});

test('Tests for getEnumByKey', () => {
    expect(
        DataTypes.getEnumByKey(DataTypes.HAlignEnum, 'Center')
    ).toStrictEqual(DataTypes.HAlignEnum.Center);

    expect(
        DataTypes.getEnumByKey(DataTypes.HAlignEnum, 'Unknown')
    ).toBeUndefined();
});

test('Tests for getEnumByValue', () => {
    expect(DataTypes.getEnumByValue(DataTypes.HAlignEnum, 2)).toStrictEqual(
        DataTypes.HAlignEnum.Center
    );

    expect(DataTypes.getEnumByValue(DataTypes.HAlignEnum, 4)).toBeUndefined();
});

test('Tests for getEnumKey', () => {
    expect(
        DataTypes.getEnumKey(DataTypes.HAlignEnum, DataTypes.HAlignEnum.Center)
    ).toBe('center');
});

test('Tests for getEnumKeys', () => {
    enum ProductUnit {
        KILOGRAM = 32,
        GRAM = 'GRAM33'
    }
    expect(DataTypes.getEnumKeys(ProductUnit)).toContainEqual('GRAM');

    const keys = DataTypes.getEnumKeys(DataTypes.CombinedEnum);
    expect(keys).toContainEqual('Unkwown');
});

test('Tests for getItemId', () => {
    // Arrange
    const items: DataTypes.IdItem[] = [
        { id: 1 },
        { id: '123' },
        { id: () => 'f123' }
    ];

    // Assert
    expect(DataTypes.getItemId(items[0])).toBe('1');
    expect(DataTypes.getItemId(items[2])).toBe('f123');
});

test('Tests for getValue', () => {
    const data = { id: 1, flag: true };
    expect(DataTypes.getValue(data, 'id')).toBe(1);
    expect(DataTypes.getValue(data, 'flag')).toBe('true');
    expect(DataTypes.getValue(data, 'unknown')).toBeNull();
});

test('Tests for getIdValue', () => {
    const data = { id: 1, flag: true, field: 'string' };
    expect(DataTypes.getIdValue(data, 'id')).toBe(1);
    expect(DataTypes.getIdValue(data, 'field')).toBe('string');
});

test('Tests for getStringValue', () => {
    const data = { id: 1, flag: true };
    expect(DataTypes.getStringValue(data, 'id')).toBe('1');
    expect(DataTypes.getStringValue(data, 'flag')).toBe('true');
});

test('Tests for getItemLabel', () => {
    // Arrange
    const items: DataTypes.IdLabelItem[] = [
        { id: 1, label: '123' },
        { id: '123', label: () => 'f123' },
        { id: () => 'f123', label: 'l123' }
    ];

    // Assert
    expect(DataTypes.getItemLabel(items[0])).toBe('123');
    expect(DataTypes.getItemLabel(items[1])).toBe('f123');
});

test('Tests for isSimpleType', () => {
    expect(DataTypes.isSimpleType(1)).toBeTruthy();
    expect(DataTypes.isSimpleType(new Date())).toBeTruthy();
    expect(DataTypes.isSimpleType(Symbol())).toBeFalsy();
    expect(DataTypes.isSimpleType(['a', 'b', 'c'])).toBeTruthy();
    expect(DataTypes.isSimpleType({})).toBeFalsy();
});

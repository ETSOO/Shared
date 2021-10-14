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
});

test('Tests for convertArray', () => {
    expect(DataTypes.convertArray(['5', 8], [0])).toStrictEqual([5, 8]);
});

test('Tests for convertArray', () => {
    expect(
        DataTypes.convertSimple(5.8, DataTypes.CombinedEnum.Int)
    ).toStrictEqual(6);
    expect(
        DataTypes.convertSimple(5.88293, DataTypes.CombinedEnum.Money)
    ).toStrictEqual(5.8829);
});

test('Tests for getSimple', () => {
    expect(DataTypes.getSimple(DataTypes.CombinedEnum.DateTime)).toBeInstanceOf(
        Date
    );
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
});

test('Tests for isSimpleType', () => {
    expect(DataTypes.isSimpleType(1)).toBeTruthy();
    expect(DataTypes.isSimpleType(new Date())).toBeTruthy();
    expect(DataTypes.isSimpleType(Symbol())).toBeFalsy();
    expect(DataTypes.isSimpleType(['a', 'b', 'c'])).toBeTruthy();
    expect(DataTypes.isSimpleType({})).toBeFalsy();
});

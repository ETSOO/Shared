import { DataTypes } from '../src/DataTypes';

test('Tests for changeType', () => {
    expect(DataTypes.changeType('5', DataTypes.DataType.Int)).toStrictEqual(5);
    expect(DataTypes.changeType(5.8, DataTypes.DataType.Int)).toStrictEqual(6);
    expect(
        DataTypes.changeType(5.88293, DataTypes.DataType.Money)
    ).toStrictEqual(5.8829);
    expect(
        DataTypes.changeType('2021/9/10', DataTypes.DataType.Date)
    ).toBeInstanceOf(Date);
    expect(
        DataTypes.changeType('true', DataTypes.DataType.Boolean)
    ).toBeTruthy();
});

test('Tests for parseType', () => {
    expect(DataTypes.parseType(5)).toBe(DataTypes.DataType.Number);
    expect(DataTypes.parseType(true)).toBe(DataTypes.DataType.Boolean);
    expect(DataTypes.parseType(new Date())).toBe(DataTypes.DataType.DateTime);
});

test('Tests for isSimpleType', () => {
    expect(DataTypes.isSimpleType(1)).toBeTruthy();
    expect(DataTypes.isSimpleType(new Date())).toBeTruthy();
    expect(DataTypes.isSimpleType(Symbol())).toBeTruthy();
    expect(DataTypes.isSimpleType(['a', 'b', 'c'])).toBeTruthy();

    expect(DataTypes.isSimpleType({})).toBeFalsy();
});

test('Tests for isSimpleObject', () => {
    const data: DataTypes.DynamicData = {};
    expect(DataTypes.isSimpleObject(data)).toBeTruthy();

    data.id = 1001;
    data.birthday = new Date('1980/12/8');
    data.uid = Symbol('test');
    data.ids = [1, 2, 3];
    expect(DataTypes.isSimpleObject(data)).toBeTruthy();

    data.childen = {};
    expect(DataTypes.isSimpleObject(data)).toBeFalsy();
});

test('Tests for hAlignFromEnum', () => {
    expect(DataTypes.hAlignFromEnum(DataTypes.HAlignEnum.Center)).toBe(
        'center'
    );
});

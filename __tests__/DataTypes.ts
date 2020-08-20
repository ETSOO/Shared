import { DataTypes } from '../src/DataTypes';

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

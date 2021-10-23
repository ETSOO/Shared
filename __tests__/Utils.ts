import { Utils } from '../src/Utils';

test('Tests for getDataChanges', () => {
    const input = {
        id: 1,
        name: 'Name',
        gender: 'F',
        brand: '',
        price: '6.0',
        amount: ''
    };
    const initData = {
        id: 1,
        name: 'Name',
        gender: 'M',
        brand: 'ETSOO',
        price: 6,
        amount: 0
    };
    const fields = Utils.getDataChanges(input, initData);
    expect(fields).toStrictEqual(['gender', 'brand', 'amount']);
    expect(input.price).toBeUndefined();
    expect(input.amount).toBeUndefined();
});

test('Tests for formatString', () => {
    const template = '{0} is first item, {1} is second item, {0} repeat';
    const result = 'aa is first item, bb is second item, aa repeat';
    expect(Utils.formatString(template, 'aa', 'bb')).toBe(result);
    expect(template.format('aa', 'bb')).toBe(result);
});

test('Tests for formatLowerLetter', () => {
    expect(Utils.formatLowerLetter('HelloWorld')).toBe('helloWorld');
});

test('Tests for formatUpperLetter', () => {
    expect(Utils.formatUpperLetter('hello')).toBe('Hello');
});

test('Tests for joinItems', () => {
    expect(Utils.joinItems(['a', undefined, ' b', '', 'c '], ',')).toBe(
        'a,b,c'
    );
});

test('Tests for newGUID', () => {
    // Arrange
    const id1 = Utils.newGUID();
    const id2 = Utils.newGUID();

    // Assert
    expect(id1).not.toEqual(id2);
    expect(id1.length).toBe(id2.length);
});

test('Tests for removeNonLetters', () => {
    expect(Utils.removeNonLetters('1234-5678@abc.')).toBe('12345678abc');
});

test('Tests for objectEqual', () => {
    const obj1 = { a: 1, b: 'abc', c: true, d: null };
    const obj2 = { a: '1', b: 'abc', c: true };
    expect(Utils.objectEqual(obj1, obj2)).toBeFalsy();
    expect(Utils.objectEqual(obj1, obj2, [], 0)).toBeTruthy();
    expect(Utils.objectEqual(obj1, obj2, ['a'])).toBeTruthy();
    expect(Utils.objectEqual(obj1, obj2, ['a'], 2)).toBeFalsy();
});

test('Tests for parseString', () => {
    expect(Utils.parseString('test', '')).toBe('test');
    expect(Utils.parseString('true', false)).toBe(true);
    expect(Utils.parseString('3.14', 0)).toBe(3.14);
    expect(Utils.parseString('2021/4/13', new Date())).toStrictEqual(
        new Date('2021/4/13')
    );
});

test('Test for setLabels', () => {
    // Arrange
    const source = { label: 'Hello' };
    const newLabel = 'world';

    // Act
    Utils.setLabels(source, { label1: newLabel }, { label: 'label1' });

    // Assert
    expect(source.label).toBe(newLabel);
});

test('Test for snakeNameToWord', () => {
    expect(Utils.snakeNameToWord('snake_name')).toBe('Snake Name');
    expect(Utils.snakeNameToWord('snake_name', true)).toBe('Snake name');
});

test('Tests for mergeClasses', () => {
    expect(Utils.mergeClasses('a', '', 'b ', undefined, 'c')).toBe('a b c');
});

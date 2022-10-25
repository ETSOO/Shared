import { Utils } from '../src/Utils';

test('Tests for addBlankItem', () => {
    const options = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' }
    ];
    Utils.addBlankItem(options, 'id', 'name');
    expect(options.length).toBe(3);
    expect(options[0].id).toBe('');
    expect(options[0].name).toBe('---');
});

test('Tests for correctTypes', () => {
    const input = {
        id: '1',
        ignore: '2',
        price: '6.0',
        amount: '',
        date: '2022/01/28',
        enabled: 'true',
        ids: ['1', '2']
    };
    Utils.correctTypes(input, {
        id: 'number',
        price: 'number',
        amount: 'number',
        date: 'date',
        enabled: 'boolean',
        ids: 'number[]'
    });
    expect(typeof input.id).toBe('number');
    expect(typeof input.price).toBe('number');
    expect(input.amount).toBeUndefined();
    expect((input.date as any) instanceof Date ? true : false).toBeTruthy();
    expect(input.enabled).toBeTruthy();
    expect(input.ids).toStrictEqual([1, 2]);
});

test('Tests for getDataChanges', () => {
    const input = {
        id: 1,
        name: 'Name',
        gender: 'F',
        brand: '',
        price: '6.0',
        amount: '',
        enabled: true,
        value: undefined,
        ids: [1, 2]
    };
    const initData = {
        id: 1,
        name: 'Name',
        gender: 'M',
        brand: 'ETSOO',
        price: 6,
        amount: 0,
        enabled: true,
        ids: [1, 2]
    };
    const fields = Utils.getDataChanges(input, initData);
    expect(fields).toStrictEqual(['gender', 'brand', 'amount']);
    expect(input.price).toBeUndefined();
    expect(input.amount).toBeUndefined();
});

test('Tests for formatInitial', () => {
    expect(Utils.formatInitial('HelloWorld')).toBe('helloWorld');
    expect('HelloWorld'.formatInitial(false)).toBe('helloWorld');
    expect('hello'.formatInitial(true)).toBe('Hello');
});

test('Tests for formatString', () => {
    const template = '{0} is first item, {1} is second item, {0} repeat';
    const result = 'aa is first item, bb is second item, aa repeat';
    expect(Utils.formatString(template, 'aa', 'bb')).toBe(result);
    expect(template.format('aa', 'bb')).toBe(result);
});

test('Tests for hideData', () => {
    expect('xz@etsoo.com'.hideEmail()).toBe('x***@etsoo.com');
    expect('info@etsoo.com'.hideEmail()).toBe('in***@etsoo.com');
    expect('info@etsoo.com'.hideData('@')).toBe('in***@etsoo.com');
    expect('12345678'.hideData()).toBe('123***678');
});

test('Tests for isDigits', () => {
    expect(Utils.isDigits('1')).toBeTruthy();
    expect(Utils.isDigits('12', 3)).toBeFalsy();
    expect(Utils.isDigits('123', 3)).toBeTruthy();
});

test('Tests for isEmail', () => {
    expect(Utils.isEmail('abc')).toBeFalsy();
    expect(Utils.isEmail('a@')).toBeFalsy();
    expect(Utils.isEmail('xz@etsoo.com')).toBeTruthy();
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

test('Tests for numberToChars and charsToNumber', () => {
    const num = 1638777042242;
    const chars = Utils.numberToChars(num);
    expect(chars).toEqual('QmpkdVgv');
    expect(Utils.charsToNumber(chars)).toEqual(num);
});

test('Tests for removeNonLetters', () => {
    const input = '1234-5678@abc.';
    const result = '12345678abc';
    expect(Utils.removeNonLetters(input)).toBe(result);
    expect(input.removeNonLetters()).toBe(result);
});

test('Tests for replaceNullOrEmpty', () => {
    expect(Utils.replaceNullOrEmpty('a', 's')).toBe('a');
    expect(Utils.replaceNullOrEmpty(null, 's')).toBe('s');
    expect(Utils.replaceNullOrEmpty(' ', 's')).toBe('s');
});

test('Tests for objectEqual', () => {
    const obj1 = { a: 1, b: 'abc', c: true, d: null, f: [1, 2] };
    const obj2 = { a: '1', b: 'abc', c: true, f: [1, 2] };
    expect(Utils.objectEqual(obj1, obj2)).toBeFalsy();
    expect(Utils.objectEqual(obj1, obj2, [], 0)).toBeTruthy();
    expect(Utils.objectEqual(obj1, obj2, ['a'])).toBeTruthy();
    expect(Utils.objectEqual(obj1, obj2, ['a'], 2)).toBeFalsy();
});

test('Tests for objectUpdated', () => {
    const objPrev = { a: 1, b: 'abc', c: true, d: null, f: [1, 2] };
    const objNew = { a: 2, b: 'abc', d: new Date(), f: [1, 2, 3], g: true };
    const fields = Utils.objectUpdated(objNew, objPrev, ['d']);
    expect(fields.sort()).toStrictEqual(['a', 'c', 'f', 'g']);
});

test('Tests for parseString', () => {
    expect(Utils.parseString<string>('test')).toBe('test');
    expect(Utils.parseString('test', '')).toBe('test');
    expect(Utils.parseString('true', false)).toBe(true);
    expect(Utils.parseString('', false)).toBeFalsy();
    expect(Utils.parseString<boolean>('')).toBeUndefined();
    expect(Utils.parseString<number>(undefined)).toBeUndefined();
    expect(Utils.parseString('3.14', 0)).toBe(3.14);
    expect(Utils.parseString(null, 0)).toBe(0);
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

test('Tests for getResult', () => {
    // Arrange
    type test = ((visible: boolean) => number) | number;
    const input: test = (visible) => (visible ? 1 : 0);
    const inputNumber: test = 5;

    // Act & assert
    const result = Utils.getResult(input, true);
    expect(result).toBe(1);
    expect(Utils.getResult(input, false)).toBe(0);

    const valueResult = Utils.getResult(inputNumber);
    expect(valueResult).toBe(5);
});

test('Tests for trim', () => {
    expect(Utils.trim('//a/', '/')).toBe('a');
    expect(Utils.trim('/*/a/', ...['/', '*'])).toBe('a');
    expect(Utils.trim('abc', ...['/', '*'])).toBe('abc');
});

test('Tests for trimStart', () => {
    expect(Utils.trimStart('//a/', '/')).toBe('a/');
    expect(Utils.trimStart('/*/a/', ...['/', '*'])).toBe('a/');
    expect(Utils.trimStart('abc', ...['/', '*'])).toBe('abc');
});

test('Tests for trimEnd', () => {
    expect(Utils.trimEnd('//a/', '/')).toBe('//a');
    expect(Utils.trimEnd('/*/a*/', ...['/', '*'])).toBe('/*/a');
    expect(Utils.trimEnd('abc', ...['/', '*'])).toBe('abc');
});

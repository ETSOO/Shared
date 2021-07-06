import { Utils } from '../src/Utils';

test('Tests for formDataToObject', () => {
    // Arrange
    const form1 = new FormData();
    form1.append('item', 'a');
    form1.append('item', 'b');
    form1.append('item', 'c');
    form1.append('job', 'good');

    // Act
    const result = Utils.formDataToObject(form1);

    // Assert
    expect(Array.isArray(result['item'])).toBeTruthy();
    expect(result['item'].length).toBe(3);
});

test('Tests for formatUpperLetter', () => {
    expect(Utils.formatUpperLetter('hello')).toBe('Hello');
});

test('Tests for joinItems', () => {
    expect(Utils.joinItems(['a', undefined, ' b', '', 'c '], ',')).toBe(
        'a,b,c'
    );
});

test('Tests for mergeFormData', () => {
    // Arrange
    const form1 = new FormData();
    form1.append('item', 'a');
    form1.append('item', 'b');
    form1.append('item', 'c');
    form1.append('job', 'good');
    form1.append('job', 'bad');

    const form2 = new FormData();
    form2.append('job', 'x');
    form2.append('job', 'y');

    // Act
    const result = Utils.mergeFormData(form1, form2);

    // Assert
    expect(Array.from(result.values())).toContainEqual('x');
});

test('Tests for newGUID', () => {
    // Arrange
    const id1 = Utils.newGUID();
    const id2 = Utils.newGUID();

    // Assert
    expect(id1).not.toEqual(id2);
    expect(id1.length).toBe(id2.length);
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

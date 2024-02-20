import { DomUtils } from '../src/DomUtils';
import { DataTypes } from '../src/DataTypes';
import { DateUtils } from '../src/DateUtils';

// Implement for tests
class Rect implements DOMRect {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
    toJSON(): any {
        return JSON.stringify({
            bottom: this.bottom,
            height: this.height,
            left: this.left,
            right: this.right,
            top: this.top,
            width: this.width,
            x: this.x,
            y: this.y
        });
    }

    constructor(width: number, height: number, x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.left = x;
        this.top = y;
        this.bottom = this.top + this.height;
        this.right = this.left = this.width;
    }
}

describe('Tests for clearFormData', () => {
    // Applies only to tests in this describe block
    // Arrange
    let form: FormData;
    beforeEach(() => {
        form = new FormData();
        form.append('id', '1');
        form.append('item', 'a');
        form.append('item', 'b');
        form.append('item', 'c');
        form.append('job', 'good');
        form.append('empty', '');
    });

    test('Remove empties only', () => {
        const result = DomUtils.clearFormData(form);
        expect(Array.from(result.keys()).includes('empty')).toBeFalsy();
    });

    test('Clear with source', () => {
        const result = DomUtils.clearFormData(form, { id: 1, job: 'good' });
        const keys = Array.from(result.keys());
        expect(expect.arrayContaining(keys)).not.toContainEqual(
            expect.arrayContaining(['id', 'job', 'empty'])
        );
    });

    test('Clear with source and hold fields', () => {
        const result = DomUtils.clearFormData(form, {}, ['id']);
        const keys = Array.from(result.keys());
        expect(keys.includes('id')).toBeTruthy();
    });
});

test('Tests for formDataToObject', () => {
    // Arrange
    const form1 = new FormData();
    form1.append('item', 'a');
    form1.append('item', 'b');
    form1.append('item', 'c');
    form1.append('job', 'good');

    // Act
    const result = DomUtils.formDataToObject(form1);

    // Assert
    expect(Array.isArray(result['item'])).toBeTruthy();
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
    const result = DomUtils.mergeFormData(form1, form2);
    const values = result.getAll('job');

    // Assert
    expect(values.includes('x')).toBeTruthy();
});

test('Tests for dimensionEqual', () => {
    const rect1: DOMRect = new Rect(200, 300);
    const rect2: DOMRect = new Rect(100, 200);
    expect(DomUtils.dimensionEqual(undefined, undefined)).toBeTruthy();
    expect(DomUtils.dimensionEqual(rect1, undefined)).toBeFalsy();
    expect(DomUtils.dimensionEqual(rect1, rect2)).toBeFalsy();
});

test('Tests for formDataToObject', () => {
    const formData = new FormData();
    formData.append('id', '1234');
    formData.append('name', 'test');

    expect(DomUtils.formDataToObject(formData)).toEqual({
        id: '1234',
        name: 'test'
    });
});

test('Tests for dataAs', () => {
    const formData = new FormData();
    formData.append('id', '1234');
    formData.append('name', 'test');
    formData.append('price', '34.25');
    formData.append('options', '1,2,3,4');
    formData.append('memo', 'Memo');
    formData.append('email', 'a@b');
    formData.append('email', 'c@d');
    formData.append('code', '123');
    formData.append('code', '456');

    const data = DomUtils.dataAs(formData, {
        id: 'number',
        name: 'string',
        price: 'number',
        options: 'number[]',
        email: 'string[]',
        code: 'number[]'
    });

    expect(data.id).toStrictEqual(1234);
    expect(data.options?.length).toStrictEqual(4);
    expect(data.options![0]).toStrictEqual(1);

    expect(data.email).toEqual(['a@b', 'c@d']);
    expect(data.code?.length).toStrictEqual(2);
    expect(data.code).toEqual([123, 456]);
    expect(data).not.toHaveProperty('memo', 'Memo');

    const keepSourceData = DomUtils.dataAs(
        formData,
        {
            id: 'number',
            name: 'string',
            price: 'number',
            options: 'number[]'
        },
        true
    );
    expect(keepSourceData).toHaveProperty('memo', 'Memo');
});

test('Tests for dataValueAs', () => {
    const formData = new FormData();
    formData.append('id', '1234');
    formData.append('name', 'test');
    formData.append('price', '34.25');
    formData.append('options', '1,2,3,4');
    formData.append('memo', 'Memo');

    const templateValue = {
        id: 0,
        name: '',
        price: 0,
        options: [0]
    };

    const data = DomUtils.dataValueAs(formData, templateValue);

    expect(data.id).toStrictEqual(1234);
    expect(data.options?.length).toStrictEqual(4);
    expect(data.options![0]).toStrictEqual(1);
    expect(data).not.toHaveProperty('memo', 'Memo');

    const keepSourceData = DomUtils.dataValueAs(formData, templateValue, true);
    expect(keepSourceData).toHaveProperty('memo', 'Memo');
});

test('Tests for dataValueAs', () => {
    const formData = new FormData();
    formData.append('id', '1234');
    formData.append('name', 'test');
    formData.append('price', '34.25');
    formData.append('options', '1,2,3,4');

    const data = DomUtils.dataValueAs(formData, {
        id: 0,
        name: '',
        price: 0,
        options: [0]
    });

    expect(data.id).toStrictEqual(1234);
    expect(data.options?.length).toStrictEqual(4);
    expect(data.options![0]).toStrictEqual(1);
});

test('Tests for detectedCulture', () => {
    expect(DomUtils.detectedCulture).toBe('en-US');
});

test('Tests for getCulture', () => {
    const cultures: DataTypes.CultureDefinition[] = [
        {
            name: 'zh-Hans',
            label: '简体中文',
            resources: {},
            compatibleNames: ['zh-CN', 'zh-SG']
        },
        { name: 'en', label: 'English', resources: {} }
    ];

    const [culture1, match1] = DomUtils.getCulture(cultures, 'zh-CN');
    expect(culture1?.name).toBe('zh-Hans');
    expect(match1).toBe(DomUtils.CultureMatch.Compatible);

    const [culture2] = DomUtils.getCulture(cultures, 'zh-Hans-CN');
    expect(culture2?.name).toBe('zh-Hans');

    const [culture3] = DomUtils.getCulture(cultures, 'zh-Hans-HK');
    expect(culture3?.name).toBe('zh-Hans');

    const [culture4] = DomUtils.getCulture(cultures, 'zh-SG');
    expect(culture4?.name).toBe('zh-Hans');

    const [culture5] = DomUtils.getCulture(cultures, 'en-GB');
    expect(culture5?.name).toBe('en');

    const [culture6, match6] = DomUtils.getCulture(cultures, 'fr-CA');
    expect(culture6?.name).toBe('zh-Hans');
    expect(match6).toBe(DomUtils.CultureMatch.Default);
});

test('Tests for getLocationKey', () => {
    expect(DomUtils.getLocationKey('test')).toBe('http://localhost/:test');
});

test('Tests for headersToObject', () => {
    expect(DomUtils.headersToObject({ t1: 'a', t2: 'b' })).toHaveProperty(
        't2',
        'b'
    );
});

test('Tests for isFormData', () => {
    const formData = new FormData();
    expect(DomUtils.isFormData(formData)).toBeTruthy();
    expect(DomUtils.isFormData({})).toBeFalsy();
});

test('Tests for isJSONContentType', () => {
    expect(DomUtils.isJSONContentType('application/problem+json')).toBeTruthy();
    expect(DomUtils.isJSONContentType('application/javascript')).toBeTruthy();
});

test('Tests for mergeURLSearchParams', () => {
    // Arrange
    const params = new URLSearchParams();
    params.set('id', '123');

    const data: DataTypes.SimpleObject = {
        name: 'test',
        favor: ['pear', 'apple']
    };

    // Assert
    expect(DomUtils.mergeURLSearchParams(params, data).get('favor')).toBe(
        'pear,apple'
    );
});

test('Tests for setFocus', () => {
    // Arrange
    const focus = jest.fn();

    const root = document.body;
    const container = document.createElement('div');
    root.append(container);
    const input = document.createElement('input');
    input.name = 'test';
    input.onfocus = focus;
    container.append(input);

    DomUtils.setFocus('test');
    expect(focus).toBeCalledTimes(1);

    input.blur();

    DomUtils.setFocus({ test: 'No content' }, container);
    expect(focus).toBeCalledTimes(2);
});

test('Tests for getInputValue', () => {
    // Arrange
    const input = document.createElement('input');
    input.type = 'datetime-local';
    input.value = DateUtils.formatForInput('2023-09-21T23:08', false) ?? '';

    // Act
    const result = DomUtils.getInputValue(input);

    // Assert
    expect(result).not.toBeUndefined();
    expect(result instanceof Date).toBeTruthy();
    if (result instanceof Date) {
        expect(result.getDate()).toBe(21);
    }
});

test('Tests for setupLogging', () => {
    // Arrange
    const action = jest.fn();
    DomUtils.setupLogging(action, true);

    // Act
    console.error('Test');

    // Assert
    expect(action).toHaveBeenCalledTimes(1);
});

import { DomUtils } from '../src/DomUtils';
import { DataTypes } from '../src/DataTypes';
import { FormData } from 'formdata-node';

(globalThis as any).FormData ??= FormData;

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
    expect(result['item'].length).toBe(3);
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

    // Assert
    expect(Array.from(result.values())).toContainEqual('x');
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

test('Tests for detectedCulture', () => {
    expect(DomUtils.detectedCulture).toBe('en-US');
});

test('Tests for getCulture', () => {
    const cultures: DataTypes.CultureDefinition[] = [
        { name: 'zh-CN', label: '简体中文', resources: {} },
        { name: 'en-US', label: 'English', resources: {} }
    ];

    expect(DomUtils.getCulture(cultures, 'zh-CN')?.name).toBe('zh-CN');
});

test('Tests for getCountry', () => {
    const countries: DataTypes.Country[] = [
        {
            id: 'CN',
            id3: 'CHN',
            nid: '156',
            continent: 'AS',
            exitCode: '00',
            idd: '86',
            currency: 'CNY',
            language: 'zh-CN'
        },
        {
            id: 'NZ',
            id3: 'NZL',
            nid: '554',
            continent: 'OC',
            exitCode: '00',
            idd: '64',
            currency: 'NZD',
            language: 'en-NZ'
        }
    ];

    expect(DomUtils.getCountry(countries, 'CN')?.id).toBe('CN');
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

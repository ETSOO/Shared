import { DomUtils } from '../src/DomUtils';
import { DataTypes } from '../src/DataTypes';

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

test('Tests for mergeClasses', () => {
    expect(DomUtils.mergeClasses('a', '', 'b ', undefined, 'c')).toBe('a b c');
});

test('Tests for detectedCulture', () => {
    expect(DomUtils.detectedCulture).toBe('en-US');
});

test('Tests for getCurrentCulture', () => {
    const cultures: DataTypes.CultureDefinition[] = [
        { name: 'zh-CN', label: '简体中文', resources: {} },
        { name: 'en-US', label: 'English', resources: {} }
    ];

    expect(DomUtils.getCulture(cultures, 'zh-CN')?.name).toBe('zh-CN');
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

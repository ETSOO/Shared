import { EColor } from '../src/types/EColor';

test('Tests for parse', () => {
    // Arrange & act
    const colorShort = EColor.parse('#000');
    const color = EColor.parse('#e21821');
    const colorRgb = EColor.parse('RGB(226, 24, 33)');

    // Assert
    expect(colorShort?.toRGBColor()).toBe('RGB(0, 0, 0)');
    expect(color?.toRGBColor()).toBe('RGB(226, 24, 33)');
    expect(colorRgb?.toHEXColor()).toBe('#e21821');
});

test('Tests for getColors', () => {
    expect(EColor.getColors(undefined, 128).length).toBe(8);
});

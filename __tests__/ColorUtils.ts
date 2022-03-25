import { EColor } from '../src/types/EColor';
import { ColorUtils } from '../src/ColorUtils';

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
    const colors = ColorUtils.getColors(undefined, 128);
    expect(colors.length).toBe(8);
});

test('Tests for toRGBColor', () => {
    const color = new EColor(0, 0, 0);
    expect(color.toRGBColor()).toBe('RGB(0, 0, 0)');
    expect(color.toRGBColor(0.1)).toBe('RGBA(0, 0, 0, 0.1)');
    expect(color.alpha).toBeUndefined();
});

/**
 * Etsoo implmented Color
 */
export class EColor {
    /**
     * Adjust value
     * @param value Current value
     * @param adjust Adjust value
     * @returns Adjusted value
     */
    static adjust(value: number, adjust?: number) {
        if (adjust == null) return value;
        value = Math.abs(value + adjust);
        if (value > 255) return value % 255;
        return value;
    }

    /**
     * Format color
     * @param input Input color text
     * @param hexColor Format as Hex color
     * @returns Result
     */
    static format(input: string | undefined | null, hexColor?: boolean) {
        // Null
        if (input == null) return undefined;

        // Like transparent, black, red
        if (/^[a-zA-Z]+$/gi.test(input)) return input.toLowerCase();

        const color = EColor.parse(input);
        if (color == null) return undefined;

        return hexColor ? color.toHEXColor() : color.toRGBColor();
    }

    /**
     * HEX string to integer value
     * @param hex HEX string
     * @returns Integer value
     */
    static hexTo(hex: string) {
        return parseInt(hex, 16);
    }

    /**
     * Format value to 16 radix string
     * @param num Int value
     * @returns Result
     */
    static toHex(num: number) {
        return num.toString(16).padStart(2, '0');
    }

    /**
     * Parse HTML color to EColor
     * @param htmlColor HTML color
     * @returns EColor
     */
    static parse(htmlColor?: string | null): EColor | undefined {
        // Null
        if (htmlColor == null) return undefined;
        htmlColor = htmlColor.trim().toUpperCase();

        // HEX color
        if (htmlColor.startsWith('#')) {
            htmlColor = htmlColor.substring(1);
            if (htmlColor.length === 3)
                htmlColor = Array.from(htmlColor)
                    .map((c) => c + c)
                    .join('');

            if (htmlColor.length === 6) {
                return new EColor(
                    EColor.hexTo(htmlColor.substring(0, 2)),
                    EColor.hexTo(htmlColor.substring(2, 4)),
                    EColor.hexTo(htmlColor.substring(4, 6))
                );
            }

            return undefined;
        }

        // For RGB and RGBA
        const reg = /^RGBA?\(([0-9,\s\.]+)\)$/;
        const result = htmlColor.match(reg);
        if (result != null && result.length == 2) {
            const parts = result[1].split(/\s*,\s*/);
            if (parts.length === 3 || parts.length === 4) {
                const alpha = parts[3];
                return new EColor(
                    parseInt(parts[0]),
                    parseInt(parts[1]),
                    parseInt(parts[2]),
                    alpha == null ? undefined : parseFloat(alpha)
                );
            }
        }

        return undefined;
    }

    /**
     * Constructor
     * @param r Reg
     * @param g Green
     * @param b Blue
     * @param alpha Alpha
     */
    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number,
        public readonly alpha?: number
    ) {}

    /**
     * Clone color with adjustments
     * @param adjustR Adjust R value
     * @param adjustG Adjust G value
     * @param adjustB Adjust B value
     * @param alpha New alpha value
     */
    clone(
        adjustR?: number,
        adjustG?: number,
        adjustB?: number,
        alpha?: number
    ) {
        const r = EColor.adjust(this.r, adjustR);
        const g = EColor.adjust(this.g, adjustG);
        const b = EColor.adjust(this.b, adjustB);
        if (
            r === this.r &&
            g === this.g &&
            b === this.b &&
            (alpha == null || alpha === this.alpha)
        )
            return undefined;
        return new EColor(r, g, b, alpha);
    }

    /**
     * Get contrast ratio, a value between 0 and 1
     * @param color Contrast color
     */
    getContrastRatio(color: EColor) {
        const lum1 = this.getLuminance();
        const lum2 = color.getLuminance();
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    /**
     * Get Delta value (perceptible by human eyes)
     * <= 1, Not perceptible by human eyes
     * 1 - 2, Perceptible through close observation
     * 2 - 10, Perceptible at a glance
     * 11 - 49, Colors are more similar than opposite
     * 100+, Colors are exact opposite
     * @param color Contrast color
     * @returns Value
     */
    getDeltaValue(color: EColor) {
        const labA = this.toLabValue();
        const labB = color.toLabValue();
        const deltaL = labA[0] - labB[0];
        const deltaA = labA[1] - labB[1];
        const deltaB = labA[2] - labB[2];
        const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
        const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
        const deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        const sc = 1.0 + 0.045 * c1;
        const sh = 1.0 + 0.015 * c1;
        const deltaLKlsl = deltaL / 1.0;
        const deltaCkcsc = deltaC / sc;
        const deltaHkhsh = deltaH / sh;
        const i =
            deltaLKlsl * deltaLKlsl +
            deltaCkcsc * deltaCkcsc +
            deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }

    /**
     * Get luminance
     * Darker one has higher luminance
     * https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
     */
    getLuminance() {
        const a = [this.r, this.g, this.b].map((v) => {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    /**
     * To HEX color string
     * @returns HEX color string
     */
    toHEXColor() {
        return `#${EColor.toHex(this.r)}${EColor.toHex(this.g)}${EColor.toHex(
            this.b
        )}`;
    }

    /**
     * To Lab value
     * @returns Lab value
     */
    toLabValue(): [number, number, number] {
        let r = this.r / 255,
            g = this.g / 255,
            b = this.b / 255,
            x,
            y,
            z;
        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
        return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
    }

    /**
     * To RGB color string
     * @param alpha Alpha value, false means ignore it
     * @returns RGB color string
     */
    toRGBColor(alpha?: boolean | number) {
        // Decide
        let includeAlpha: boolean,
            alphaValue: number | undefined = this.alpha;

        if (typeof alpha === 'number') {
            alphaValue = alpha;
            includeAlpha = true;
        } else if (alpha == null) {
            includeAlpha = this.alpha != null;
        } else {
            includeAlpha = alpha;
        }

        if (includeAlpha)
            return `RGBA(${this.r}, ${this.g}, ${this.b}, ${alphaValue ?? 1})`;

        return `RGB(${this.r}, ${this.g}, ${this.b})`;
    }
}

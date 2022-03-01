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
     * Get HEX or RGB colors
     * @param init Initial color
     * @param factor Increase factor
     * @param hex to HEX or not
     * @returns Result
     */
    static getColors(init = '#000', factor: number = 51, hex: boolean = true) {
        return EColor.getEColors(init, factor).map((c) =>
            hex ? c.toHEXColor() : c.toRGBColor()
        );
    }

    /**
     * Get EColors
     * @param init Initial color
     * @param factor Increase factor
     * @returns Result
     */
    static getEColors(init = '#000', factor: number = 51): EColor[] {
        // Init color
        const initColor = EColor.parse(init) ?? new EColor(0, 0, 0);

        // Factors elements
        // 51 = '00', '33', '66', '99', 'cc', 'ff'
        const factors: number[] = [];
        let f = 0;
        while (f <= 255) {
            factors.push(f);
            f += factor;
        }

        // RGB loop
        const colors: EColor[] = [initColor];

        for (const r of factors) {
            for (const g of factors) {
                for (const b of factors) {
                    const newColor = initColor.clone(r, g, b);
                    if (newColor) colors.push(newColor);
                }
            }
        }

        return colors;
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
        htmlColor = htmlColor.toUpperCase();

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
     * Clone color with adjusts
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
     * To RGB color string
     * @param includeAlpha Include alpha or not
     * @returns RGB color string
     */
    toRGBColor(includeAlpha?: boolean) {
        // Default case
        includeAlpha ??= this.alpha != null;

        if (includeAlpha)
            return `RGBA(${this.r}, ${this.g}, ${this.b}, ${this.alpha ?? 1})`;

        return `RGB(${this.r}, ${this.g}, ${this.b})`;
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
}

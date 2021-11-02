export namespace NumberUtils {
    /**
     * Format number
     * @param input Input
     * @param locale Locale
     * @param options Options
     * @returns Result
     */
    export function format(
        input?: number | bigint,
        locale?: string | string[],
        options?: Intl.NumberFormatOptions
    ) {
        if (input == null) return undefined;

        // Formatter
        const intl = new Intl.NumberFormat(locale, options);

        return intl.format(input);
    }

    /**
     * Format money
     * @param input Input
     * @param currency Currency, like USD for US dollar
     * @param locale Locale
     * @param isInteger Is integer value
     * @param options Options
     * @returns Result
     */
    export function formatMoney(
        input?: number | bigint,
        currency?: string,
        locale?: string | string[],
        isInteger: boolean = false,
        options: Intl.NumberFormatOptions = {}
    ) {
        if (currency) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
            options.style = 'currency';
            options.currency = currency;
            options.currencyDisplay ??= 'narrowSymbol';
        }

        if (isInteger) {
            options.minimumFractionDigits ??= 0;
            options.maximumFractionDigits ??= 0;
        } else options.minimumFractionDigits ??= 2;

        return format(input, locale, options);
    }

    /**
     * Parse float value
     * @param rawData Raw data
     */
    export const parse = (
        rawData: string | number | undefined | object
    ): number => {
        if (rawData == null) {
            return Number.NaN;
        }

        if (typeof rawData === 'number') {
            return rawData;
        }

        return parseFloat(rawData.toString());
    };

    /**
     * Parse float value and unit
     * @param input Input string
     * @returns Result, like [number, string]
     */
    export const parseWithUnit = (
        input: string
    ): [number, string] | undefined => {
        if (/^(\d+)(\D*)$/g.test(input)) {
            return [Number(RegExp.$1), RegExp.$2.trim()];
        }
        return undefined;
    };
}

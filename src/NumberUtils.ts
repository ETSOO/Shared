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
            options.style = 'currency';
            options.currency = currency;
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
}

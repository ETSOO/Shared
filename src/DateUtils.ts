export namespace DateUtils {
    /**
     * Day format, YYYY-MM-DD
     */
    export const DayFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    /**
     * Minute format, YYYY-MM-DD hh:mm
     */
    export const MinuteFormat: Intl.DateTimeFormatOptions = {
        ...DayFormat,
        hour: '2-digit',
        hour12: false,
        minute: '2-digit'
    };

    /**
     * Second format, YYYY-MM-DD hh:mm:ss
     */
    export const SecondFormat: Intl.DateTimeFormatOptions = {
        ...MinuteFormat,
        second: '2-digit'
    };

    /**
     * Format
     * @param locale Locale
     * @param input Input date time
     * @param options Options
     */
    export function format(
        locale: string,
        input?: Date | string,
        options?: Intl.DateTimeFormatOptions | 'd' | 'dm' | 'ds'
    ) {
        // Null case
        if (input == null) return undefined;

        // Type transformation
        if (typeof input === 'string') input = new Date(input);

        // Default options
        options ??= DayFormat;

        // Default options
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        let opt: Intl.DateTimeFormatOptions;
        switch (options) {
            case 'd':
                opt = DayFormat;
                break;
            case 'dm':
                opt = MinuteFormat;
                break;
            case 'ds':
                opt = SecondFormat;
                break;
            default:
                opt = options;
        }

        // Return format result
        return new Intl.DateTimeFormat(locale, opt)
            .format(input)
            .replace(/,\s*/g, ' ');
    }
}

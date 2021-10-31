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
        hourCycle: 'h23',
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
     * Date format options
     */
    export type FormatOptions = Intl.DateTimeFormatOptions | 'd' | 'dm' | 'ds';

    /**
     * Format
     * @param input Input date time
     * @param locale Locale
     * @param options Options
     * @param timeZone Time zone
     */
    export function format(
        input?: Date | string,
        locale?: string | string[],
        options?: FormatOptions,
        timeZone?: string
    ) {
        // Null case
        if (input == null) return undefined;

        // Type transformation
        if (typeof input === 'string') {
            const parsedDate = parse(input);
            if (parsedDate == null) return undefined;
            input = parsedDate;
        }

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

        // Clone as new options with time zone
        const newOpt = { ...opt, ...(timeZone != null && { timeZone }) };

        // Return format result
        return new Intl.DateTimeFormat(locale, newOpt)
            .format(input)
            .replace(/,\s*/g, ' ');
    }

    /**
     * Format to 'yyyy-MM-dd', especially used for date input min/max property
     * @param date Input date
     */
    export function formatForInput(date?: Date | string) {
        // Parse string as date
        if (typeof date === 'string') date = new Date(date);

        // Default is now
        date ??= new Date();

        // Parts
        const parts = [
            date.getFullYear(),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getDate().toString().padStart(2, '0')
        ];

        // Return
        return parts.join('-');
    }

    /**
     * Build JSON parser
     * @param keys Date field names
     * @returns JSON parser
     */
    export const jsonParser = (keys: string[]) => {
        return function (key: string, value: unknown) {
            if (
                typeof value === 'string' &&
                value != null &&
                value !== '' &&
                keys.includes(key)
            ) {
                const parsedDate = parse(value);
                if (parsedDate != null) return parsedDate;
            }
            return value;
        };
    };

    /**
     * Parse string to date
     * 2021/10/31 or 2021-10-31
     * @param input Input string
     * @returns Date
     */
    export function parse(input: string) {
        const f = input[0];
        if (f >= '0' && f <= '9' && /[-\/\s]/g.test(input)) {
            const n = Date.parse(input);
            if (!isNaN(n)) return new Date(n);
        }
        return undefined;
    }
}

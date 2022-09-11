declare global {
    interface Date {
        /**
         * Substract date
         * @param input Input date
         */
        substract(input: Date): TimeSpan;
    }
}

Date.prototype.substract = function (this: Date, input: Date): TimeSpan {
    // Calculate from miniseconds
    const totalMiniseconds = this.valueOf() - input.valueOf();
    const totalSeconds = totalMiniseconds / 1000.0;
    const totalMinutes = totalSeconds / 60.0;
    const totalHours = totalMinutes / 60.0;
    const totalDays = totalHours / 24.0;

    // Calcuate days
    const thisYear = this.getFullYear();
    const thisMonth = this.getMonth();
    const inputCopy = new Date(input);
    inputCopy.setFullYear(thisYear);
    inputCopy.setMonth(thisMonth);

    const diffDays =
        (new Date(this).valueOf() - inputCopy.valueOf()) / 86400000.0;
    const diffMonths =
        diffDays > 0
            ? diffDays / DateUtils.getDays(thisYear, thisMonth)
            : diffDays / DateUtils.getDays(thisYear, thisMonth - 1);

    // Total months
    const totalMonths =
        12 * (thisYear - input.getFullYear()) +
        (thisMonth - input.getMonth()) +
        diffMonths;

    // Total years
    const totalYears = totalMonths / 12.0;

    return {
        totalMiniseconds,
        totalSeconds,
        totalMinutes,
        totalHours,
        totalDays,
        totalMonths,
        totalYears
    };
};

/**
 * TimeSpan
 */
export interface TimeSpan {
    totalMiniseconds: number;
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    totalMonths: number;
    totalYears: number;
}

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
        // Parse
        const parsed = parse(input);

        // Null case
        if (parsed == null) return undefined;

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
            .format(parsed)
            .replace(/,\s*/g, ' ');
    }

    /**
     * Format to 'yyyy-MM-dd' or 'yyyy-MM-ddThh:mm:ss, especially used for date input min/max property
     * @param date Input date
     * @param hasSecond 'undefined' for date only, 'false' for hour:minute only
     */
    export function formatForInput(
        date?: Date | string | null,
        hasSecond?: boolean
    ) {
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

        // Date
        const d = parts.join('-');
        if (hasSecond == null) return d;

        const hm = [
            date.getHours().toString().padStart(2, '0'),
            date.getMinutes().toString().padStart(2, '0')
        ];
        if (hasSecond) hm.push(date.getSeconds().toString().padStart(2, '0'));
        return `${d}T${hm.join(':')}`;
    }

    /**
     * Get month's days
     * @param year Year
     * @param month Month, starts from 0
     * @returns Days
     */
    export const getDays = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();

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
    export function parse(input?: Date | string | null) {
        if (input == null) return undefined;
        if (typeof input === 'string') {
            const f = input[0];
            if (f >= '0' && f <= '9' && /[-\/\s]/g.test(input)) {
                const n = Date.parse(input);
                if (!isNaN(n)) return new Date(n);
            }
            return undefined;
        }
        return input;
    }

    /**
     * Two dates are in the same day
     * @param d1 First date
     * @param d2 Second date
     * @returns Result
     */
    export function sameDay(
        d1?: Date | string | null,
        d2?: Date | string | null
    ) {
        d1 = parse(d1);
        d2 = parse(d2);
        if (d1 == null || d2 == null) return false;
        return d1.toDateString() === d2.toDateString();
    }

    /**
     * Two dates are in the same month
     * @param d1 First date
     * @param d2 Second date
     * @returns Result
     */
    export function sameMonth(
        d1?: Date | string | null,
        d2?: Date | string | null
    ) {
        d1 = parse(d1);
        d2 = parse(d2);
        if (d1 == null || d2 == null) return false;
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth()
        );
    }
}

import { DataTypes } from './DataTypes';
import isEqual from 'lodash.isequal';

declare global {
    interface String {
        /**
         * Check the input string contains Chinese character or not
         * @param this Input
         * @param test Test string
         */
        containChinese(this: string): boolean;

        /**
         * Check the input string contains Korean character or not
         * @param this Input
         * @param test Test string
         */
        containKorean(this: string): boolean;

        /**
         * Check the input string contains Japanese character or not
         * @param this Input
         * @param test Test string
         */
        containJapanese(this: string): boolean;

        /**
         * Format string with parameters
         * @param this Input template
         * @param parameters Parameters to fill the template
         */
        format(this: string, ...parameters: string[]): string;

        /**
         * Format inital character to lower case or upper case
         * @param this Input string
         * @param upperCase To upper case or lower case
         */
        formatInitial(this: string, upperCase: boolean): string;

        /**
         * Hide data
         * @param this Input string
         * @param endChar End char
         */
        hideData(this: string, endChar?: string): string;

        /**
         * Hide email data
         * @param this Input email
         */
        hideEmail(this: string): string;

        /**
         * Is digits string
         * @param this Input string
         * @param minLength Minimum length
         */
        isDigits(this: string, minLength?: number): boolean;

        /**
         * Is email string
         * @param this Input string
         */
        isEmail(this: string): boolean;

        /**
         * Remove non letters (0-9, a-z, A-Z)
         * @param this Input string
         */
        removeNonLetters(this: string): string;
    }
}

String.prototype.containChinese = function (this: string): boolean {
    const regExp =
        /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;
    return regExp.test(this);
};

String.prototype.containKorean = function (this: string): boolean {
    const regExp =
        /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u3400-\u4dbf]/g;
    return regExp.test(this);
};

String.prototype.containJapanese = function (this: string): boolean {
    const regExp = /[\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g;
    return regExp.test(this);
};

String.prototype.format = function (
    this: string,
    ...parameters: string[]
): string {
    let template = this;
    parameters.forEach((value, index) => {
        template = template.replace(new RegExp(`\\{${index}\\}`, 'g'), value);
    });
    return template;
};

String.prototype.formatInitial = function (
    this: string,
    upperCase: boolean = false
) {
    const initial = this.charAt(0);
    return (
        (upperCase ? initial.toUpperCase() : initial.toLowerCase()) +
        this.slice(1)
    );
};

String.prototype.hideData = function (this: string, endChar?: string) {
    if (this.length === 0) return this;

    if (endChar != null) {
        const index = this.indexOf(endChar);
        if (index === -1) return this.hideData();
        return this.substring(0, index).hideData() + this.substring(index);
    }

    var len = this.length;
    if (len < 4) return this.substring(0, 1) + '***';
    if (len < 6) return this.substring(0, 2) + '***';
    if (len < 8) return this.substring(0, 2) + '***' + this.slice(-2);
    if (len < 12) return this.substring(0, 3) + '***' + this.slice(-3);

    return this.substring(0, 4) + '***' + this.slice(-4);
};

String.prototype.hideEmail = function (this: string) {
    return this.hideData('@');
};

String.prototype.isDigits = function (this: string, minLength?: number) {
    return this.length >= (minLength ?? 0) && /^\d+$/.test(this);
};

String.prototype.isEmail = function (this: string) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.toLowerCase());
};

String.prototype.removeNonLetters = function (this: string) {
    return this.replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Utilities
 */
export namespace Utils {
    /**
     * Add blank item to collection
     * @param options Options
     * @param idField Id field, default is id
     * @param labelField Label field, default is label
     * @param blankLabel Blank label, default is ---
     */
    export function addBlankItem<T extends object>(
        options: T[],
        idField?: string | keyof T,
        labelField?: unknown,
        blankLabel?: string
    ) {
        // Avoid duplicate blank items
        idField ??= 'id';
        if (options.length === 0 || Reflect.get(options[0], idField) !== '') {
            const blankItem: any = {
                [idField]: '',
                [typeof labelField === 'string' ? labelField : 'label']:
                    blankLabel ?? '---'
            };
            options.unshift(blankItem);
        }

        return options;
    }

    /**
     * Array 1 items do not exist in Array 2 or reverse match
     * @param a1 Array 1
     * @param a2 Array 2
     * @param round A round for both matches
     */
    export function arrayDifferences<T>(a1: T[], a2: T[], round?: boolean) {
        const diff = a1.filter((x) => !a2.includes(x));
        if (round) return [...diff, ...a2.filter((x) => !a1.includes(x))];
        return diff;
    }

    /**
     * Base64 chars to number
     * @param base64Chars Base64 chars
     * @returns Number
     */
    export function charsToNumber(base64Chars: string) {
        const chars =
            typeof Buffer === 'undefined'
                ? [...atob(base64Chars)].map((char) => char.charCodeAt(0))
                : [...Buffer.from(base64Chars, 'base64')];

        return chars.reduce((previousValue, currentValue, currentIndex) => {
            return previousValue + currentValue * Math.pow(128, currentIndex);
        }, 0);
    }

    /**
     * Correct object's property value type
     * @param input Input object
     * @param fields Fields to correct
     */
    export function correctTypes<
        T extends object,
        F extends { [P in keyof T]?: DataTypes.BasicNames }
    >(input: T, fields: F) {
        for (const field in fields) {
            const type = fields[field];
            if (type == null) continue;
            const value = Reflect.get(input, field);
            const newValue = DataTypes.convertByType(value, type);
            if (newValue !== value) {
                Reflect.set(input, field, newValue);
            }
        }
    }

    /**
     * Two values equal
     * @param v1 Value 1
     * @param v2 Value 2
     * @param strict Strict level, 0 with ==, 1 === but null equal undefined, 2 ===
     */
    export function equals(v1: unknown, v2: unknown, strict = 1) {
        // Null and undefined case
        if (v1 == null || v2 == null) {
            if (strict <= 1 && v1 == v2) return true;
            return v1 === v2;
        }

        // For date, array and object
        if (typeof v1 === 'object') return isEqual(v1, v2);

        // 1 and '1' case
        if (strict === 0) return v1 == v2;

        // Strict equal
        return v1 === v2;
    }

    /**
     * Exclude specific items
     * @param items Items
     * @param field Filter field
     * @param excludedValues Excluded values
     * @returns Result
     */
    export function exclude<
        T extends { [P in D]: DataTypes.IdType },
        D extends string = 'id'
    >(items: T[], field: D, ...excludedValues: T[D][]) {
        return items.filter((item) => !excludedValues.includes(item[field]));
    }

    /**
     * Async exclude specific items
     * @param items Items
     * @param field Filter field
     * @param excludedValues Excluded values
     * @returns Result
     */
    export async function excludeAsync<
        T extends { [P in D]: DataTypes.IdType },
        D extends string = 'id'
    >(items: Promise<T[] | undefined>, field: D, ...excludedValues: T[D][]) {
        const result = await items;
        if (result == null) return result;
        return exclude(result, field, ...excludedValues);
    }

    /**
     * Format inital character to lower case or upper case
     * @param input Input string
     * @param upperCase To upper case or lower case
     */
    export function formatInitial(input: string, upperCase: boolean = false) {
        return input.formatInitial(upperCase);
    }

    /**
     * Format string with parameters
     * @param template Template with {0}, {1}, ...
     * @param parameters Parameters to fill the template
     * @returns Result
     */
    export function formatString(template: string, ...parameters: string[]) {
        return template.format(...parameters);
    }

    /**
     * Get data changed fields with input data updated
     * @param input Input data
     * @param initData Initial data
     * @param ignoreFields Ignore fields
     * @returns
     */
    export function getDataChanges(
        input: object,
        initData: object,
        ignoreFields: string[] = ['id']
    ): string[] {
        // Changed fields
        const changes: string[] = [];

        Object.entries(input).forEach(([key, value]) => {
            // Ignore fields, no process
            if (ignoreFields.includes(key)) return;

            // Compare with init value
            const initValue = Reflect.get(initData, key);

            if (value == null && initValue == null) {
                // Both are null, it's equal
                Reflect.deleteProperty(input, key);
                return;
            }

            if (initValue != null) {
                const newValue = DataTypes.convert(value, initValue);
                if (Utils.equals(newValue, initValue)) {
                    Reflect.deleteProperty(input, key);
                    return;
                }

                // Update
                Reflect.set(input, key, newValue);
            }

            // Remove empty property
            if (value == null || value === '') {
                Reflect.deleteProperty(input, key);
            }

            // Hold the key
            changes.push(key);
        });

        return changes;
    }

    /**
     * Get input function or value result
     * @param input Input function or value
     * @param args Arguments
     * @returns Result
     */
    export const getResult = <R, T = DataTypes.Func<R> | R>(
        input: T,
        ...args: T extends DataTypes.Func<R> ? Parameters<typeof input> : never
    ): T extends DataTypes.Func<R> ? ReturnType<T> : T => {
        return typeof input === 'function' ? input(...args) : input;
    };

    /**
     * Get time zone
     * @returns Timezone
     */
    export const getTimeZone = () => {
        // If Intl supported
        if (
            typeof Intl === 'object' &&
            typeof Intl.DateTimeFormat === 'function'
        )
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    /**
     * Is digits string
     * @param input Input string
     * @param minLength Minimum length
     * @returns Result
     */
    export const isDigits = (input?: string, minLength?: number) => {
        if (input == null) return false;
        return input.isDigits(minLength);
    };

    /**
     * Is email string
     * @param input Input string
     * @returns Result
     */
    export const isEmail = (input?: string) => {
        if (input == null) return false;
        return input.isEmail();
    };

    /**
     * Join items as a string
     * @param items Items
     * @param joinPart Join string
     */
    export const joinItems = (
        items: (string | undefined)[],
        joinPart: string = ', '
    ) =>
        items
            .reduce((items, item) => {
                if (item) {
                    const newItem = item.trim();
                    if (newItem) items.push(newItem);
                }
                return items;
            }, [] as string[])
            .join(joinPart);

    /**
     * Merge class names
     * @param classNames Class names
     */
    export const mergeClasses = (...classNames: (string | undefined)[]) =>
        joinItems(classNames, ' ');

    /**
     * Create a GUID
     */
    export function newGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Number to base64 chars
     * @param num Input number
     * @returns Result
     */
    export function numberToChars(num: number) {
        const codes = [];
        while (num > 0) {
            const code = num % 128;
            codes.push(code);
            num = (num - code) / 128;
        }

        if (typeof Buffer === 'undefined') {
            return btoa(String.fromCharCode(...codes));
        } else {
            const buffer = Buffer.from(codes);
            return buffer.toString('base64');
        }
    }

    /**
     * Test two objects are equal or not
     * @param obj1 Object 1
     * @param obj2 Object 2
     * @param ignoreFields Ignored fields
     * @param strict Strict level, 0 with ==, 1 === but null equal undefined, 2 ===
     * @returns Result
     */
    export function objectEqual(
        obj1: object,
        obj2: object,
        ignoreFields: string[] = [],
        strict = 1
    ) {
        // Unique keys
        const keys = Utils.objectKeys(obj1, obj2, ignoreFields);

        for (const key of keys) {
            // Values
            const v1 = Reflect.get(obj1, key);
            const v2 = Reflect.get(obj2, key);

            if (!Utils.equals(v1, v2, strict)) return false;
        }

        return true;
    }

    /**
     * Get two object's unqiue properties
     * @param obj1 Object 1
     * @param obj2 Object 2
     * @param ignoreFields Ignored fields
     * @returns Unique properties
     */
    export function objectKeys(
        obj1: object,
        obj2: object,
        ignoreFields: string[] = []
    ) {
        // All keys
        const allKeys = [...Object.keys(obj1), ...Object.keys(obj2)].filter(
            (item) => !ignoreFields.includes(item)
        );

        // Unique keys
        return new Set(allKeys);
    }

    /**
     * Get the new object's updated fields contrast to the previous object
     * @param objNew New object
     * @param objPre Previous object
     * @param ignoreFields Ignored fields
     * @param strict Strict level, 0 with ==, 1 === but null equal undefined, 2 ===
     * @returns Updated fields
     */
    export function objectUpdated(
        objNew: object,
        objPrev: object,
        ignoreFields: string[] = [],
        strict = 1
    ) {
        // Fields
        const fields: string[] = [];

        // Unique keys
        const keys = Utils.objectKeys(objNew, objPrev, ignoreFields);

        for (const key of keys) {
            // Values
            const vNew = Reflect.get(objNew, key);
            const vPrev = Reflect.get(objPrev, key);

            if (!Utils.equals(vNew, vPrev, strict)) {
                fields.push(key);
            }
        }

        return fields;
    }

    /**
     * Parse string (JSON) to specific type, no type conversion
     * For type conversion, please use DataTypes.convert
     * @param input Input string
     * @returns Parsed value
     */
    export function parseString<T>(
        input: string | undefined | null
    ): T | undefined;

    /**
     * Parse string (JSON) to specific type, no type conversion
     * For type conversion, please use DataTypes.convert
     * @param input Input string
     * @param defaultValue Default value
     * @returns Parsed value
     */
    export function parseString<T>(
        input: string | undefined | null,
        defaultValue: T
    ): T;

    /**
     * Parse string (JSON) to specific type, no type conversion
     * When return type depends on parameter value, uses function overloading, otherwise uses conditional type
     * For type conversion, please use DataTypes.convert
     * @param input Input string
     * @param defaultValue Default value
     * @returns Parsed value
     */
    export function parseString<T>(
        input: string | undefined | null,
        defaultValue?: T
    ): T | undefined {
        // Undefined and empty case, return default value
        if (input == null || input === '') return <T>defaultValue;

        // String
        if (typeof defaultValue === 'string') return <any>input;

        try {
            // Date
            if (defaultValue instanceof Date) {
                const date = new Date(input);
                if (date == null) return <any>defaultValue;
                return <any>date;
            }

            // JSON
            const json = JSON.parse(input);

            // Return
            return <T>json;
        } catch {
            if (defaultValue == null) return <any>input;
            return <T>defaultValue;
        }
    }

    /**
     * Remove non letters
     * @param input Input string
     * @returns Result
     */
    export const removeNonLetters = (input?: string) => {
        return input?.removeNonLetters();
    };

    /**
     * Replace null or empty with default value
     * @param input Input string
     * @param defaultValue Default value
     * @returns Result
     */
    export const replaceNullOrEmpty = (
        input: string | null | undefined,
        defaultValue: string
    ) => {
        if (input == null || input.trim() === '') return defaultValue;
        return input;
    };

    /**
     * Set source with new labels
     * @param source Source
     * @param labels Labels
     * @param reference Key reference dictionary
     */
    export const setLabels = (
        source: DataTypes.StringRecord,
        labels: DataTypes.StringRecord,
        reference?: Readonly<DataTypes.StringDictionary>
    ) => {
        Object.keys(source).forEach((key) => {
            // Reference key
            const labelKey = reference == null ? key : reference[key] ?? key;

            // Label
            const label = labels[labelKey];

            if (label != null) {
                // If found, update
                Reflect.set(source, key, label);
            }
        });
    };

    /**
     * Snake name to works, 'snake_name' to 'Snake Name'
     * @param name Name text
     * @param firstOnly Only convert the first word to upper case
     */
    export const snakeNameToWord = (
        name: string,
        firstOnly: boolean = false
    ) => {
        const items = name.split('_');
        if (firstOnly) {
            items[0] = items[0].formatInitial(true);
            return items.join(' ');
        }

        return items.map((part) => part.formatInitial(true)).join(' ');
    };

    function getSortValue(n1: number, n2: number) {
        if (n1 === n2) return 0;
        if (n1 === -1) return 1;
        if (n2 === -1) return -1;
        return n1 - n2;
    }

    /**
     * Sort array by favored values
     * @param items Items
     * @param favored Favored values
     * @returns Sorted array
     */
    export const sortByFavor = <T>(items: T[], favored: T[]) => {
        return items.sort((r1, r2) => {
            const n1 = favored.indexOf(r1);
            const n2 = favored.indexOf(r2);
            return getSortValue(n1, n2);
        });
    };

    /**
     * Sort array by favored field values
     * @param items Items
     * @param field Field to sort
     * @param favored Favored field values
     * @returns Sorted array
     */
    export const sortByFieldFavor = <T, F extends keyof T>(
        items: T[],
        field: F,
        favored: T[F][]
    ) => {
        return items.sort((r1, r2) => {
            const n1 = favored.indexOf(r1[field]);
            const n2 = favored.indexOf(r2[field]);
            return getSortValue(n1, n2);
        });
    };

    /**
     * Trim chars
     * @param input Input string
     * @param chars Trim chars
     * @returns Result
     */
    export const trim = (input: string, ...chars: string[]) => {
        return trimEnd(trimStart(input, ...chars), ...chars);
    };

    /**
     * Trim end chars
     * @param input Input string
     * @param chars Trim chars
     * @returns Result
     */
    export const trimEnd = (input: string, ...chars: string[]) => {
        let start = input.length - 1;

        while (start >= 0 && chars.indexOf(input[start]) >= 0) --start;

        return input.substring(0, start + 1);
    };

    /**
     * Trim start chars
     * @param input Input string
     * @param chars Trim chars
     * @returns Result
     */
    export const trimStart = (input: string, ...chars: string[]) => {
        let start = 0;
        const end = input.length;

        while (start < end && chars.indexOf(input[start]) >= 0) ++start;

        return input.substring(start);
    };
}

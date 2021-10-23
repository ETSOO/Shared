import { DataTypes } from './DataTypes';

/**
 * Utilities
 */
export namespace Utils {
    /**
     * Format word's first letter to lower case
     * @param word Word
     */
    export function formatLowerLetter(word: string) {
        return word.charAt(0).toLowerCase() + word.slice(1);
    }

    /**
     * Format string
     * @param template Template with {0}, {1}, ...
     * @param parameters Parameters to fill the template
     * @returns Result
     */
    export function formatString(template: string, ...parameters: string[]) {
        return template.format(...parameters);
    }

    /**
     * Format word's first letter to upper case
     * @param word Word
     */
    export function formatUpperLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    /**
     * Get data changed fields with input data updated
     * @param input Input data
     * @param initData Initial data
     * @param ignoreFields Ignore fields
     * @returns
     */
    export function getDataChanges(
        input: {},
        initData: {},
        ignoreFields: string[] = ['id']
    ): string[] {
        // Changed fields
        const changes: string[] = [];

        Object.entries(input).forEach(([key, value]) => {
            // Ignore fields, no process
            if (ignoreFields.includes(key)) return;

            // Contract with init value
            const initValue = Reflect.get(initData, key);

            if (initValue != null) {
                const newValue = DataTypes.convert(value, initValue);
                if (newValue === initValue) {
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
     * Test two objects are equal or not
     * @param obj1 Object 1
     * @param obj2 Object 2
     * @param ignoreFields Ignored fields
     * @param strict Strict level, 0 with ==, 1 === but null equal undefined, 2 ===
     * @returns Result
     */
    export function objectEqual(
        obj1: {},
        obj2: {},
        ignoreFields: string[] = [],
        strict = 1
    ) {
        // Keys
        const keys = new Set([
            ...Object.keys(obj1).filter((item) => !ignoreFields.includes(item)),
            ...Object.keys(obj2).filter((item) => !ignoreFields.includes(item))
        ]);

        for (const key of keys) {
            // Values
            const v1 = Reflect.get(obj1, key);
            const v2 = Reflect.get(obj2, key);

            // Null and undefined case
            if (v1 == null && v2 == null && strict <= 1) continue;

            // 1 and '1' case
            if (strict === 0 && v1 == v2) continue;

            // Strict equal
            if (v1 !== v2) return false;
        }

        return true;
    }

    /**
     * Parse string (JSON) to specific type
     * @param input Input string
     * @param defaultValue Default value
     * @returns Parsed value
     */
    export function parseString<T>(
        input: string | undefined | null,
        defaultValue: T
    ): T {
        // Undefined case, return default value
        if (input == null) return defaultValue;

        // String
        if (typeof defaultValue === 'string') return <any>input;

        try {
            // Date
            if (defaultValue instanceof Date) {
                const date = new Date(input);
                if (date == null) return defaultValue;
                return <any>date;
            }

            // JSON
            const json = JSON.parse(input);

            // Return
            return <T>json;
        } catch (e) {
            console.log('Utils.parseString error', e);
            return defaultValue;
        }
        /*
        finally part will still return the boolean value
        finally {
            return defaultValue
        }
        */
    }

    /**
     * Remove non letters
     * @param input Input string
     * @returns Result
     */
    export const removeNonLetters = (input?: string) => {
        if (input == null || input === '') return input;
        return input.replace(/[^a-zA-Z0-9]/g, '');
    };

    /**
     * Set source with new labels
     * @param source Source
     * @param labels Labels
     * @param reference Key reference dictionary
     */
    export const setLabels = (
        source: {},
        labels: DataTypes.StringRecord,
        reference: Readonly<DataTypes.StringDictionary> = {}
    ) => {
        const newLabels = Object.keys(source).reduce(
            (newLabels, key, _index, _keys) => {
                // Reference key
                const labelKey = reference[key] ?? key;

                // Label
                const label = labels[labelKey];

                if (label != null) {
                    // If found, update
                    newLabels[key] = String(label);
                }

                return newLabels;
            },
            {} as DataTypes.StringDictionary
        );
        Object.assign(source, newLabels);
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
            items[0] = formatUpperLetter(items[0]);
            return items.join(' ');
        }

        return items.map((part) => formatUpperLetter(part)).join(' ');
    };
}

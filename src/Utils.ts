import { DataTypes } from './DataTypes';

/**
 * Utilities
 */
export namespace Utils {
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
        input: Record<string, any>,
        initData: Record<string, any>,
        ignoreFields: string[] = ['id']
    ): string[] {
        // Changed fields
        const changes: string[] = [];

        Object.entries(input).forEach(([key, value]) => {
            // Ignore fields, no process
            if (ignoreFields.includes(key)) return;

            const initValue = initData[key];
            if (initValue != null) {
                const newValue = DataTypes.changeType(
                    value,
                    DataTypes.parseType(initValue)
                );
                if (newValue === initValue) {
                    delete input[key];
                    return;
                }
                input[key] = newValue;
            }

            // Remove empty property
            if (value == null || value === '') delete input[key];

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
        if (typeof defaultValue === 'string') return input as any;

        try {
            // Date
            if (defaultValue instanceof Date) {
                return new Date(input) as any;
            }

            // JSON
            const json = JSON.parse(input);

            // Return
            return json as T;
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
     * Set source with new labels
     * @param source Source
     * @param labels Labels
     * @param reference Key reference dictionary
     */
    export const setLabels = (
        source: {},
        labels: DataTypes.ReadonlySimpleObject,
        reference: DataTypes.ReadonlyStringDictionary = {}
    ) => {
        const newLabels = Object.keys(source).reduce(
            (newLabels, key, _index, _keys) => {
                // Reference key
                const labelKey = reference[key] ?? key;

                // Label
                const label = labels[labelKey];

                if (label != null) {
                    // If found, update
                    newLabels[key] = label.toString();
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

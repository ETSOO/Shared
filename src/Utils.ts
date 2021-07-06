import { DataTypes } from './DataTypes';

/**
 * Utilities
 */
export namespace Utils {
    /**
     * Clear form data
     * @param data Form data
     * @param source Source data to match
     * @param keepFields Fields need to be kept
     */
    export function clearFormData(
        data: FormData,
        source?: {},
        keepFields?: string[]
    ) {
        // Unique keys
        const keys = new Set(data.keys());

        // Remove empty key
        const removeEmpty = (key: string) => {
            // Need to be kept
            if (keepFields != null && keepFields.includes(key)) return;

            // Get all values
            const formValues = data.getAll(key);
            if (formValues.length == 1 && formValues[0] === '') {
                // Remove empty field
                data.delete(key);
            }
        };

        if (source == null) {
            // Remove all empty strings
            for (var key of keys) {
                removeEmpty(key);
            }
        } else {
            const sourceKeys = Object.keys(source);
            for (const key of sourceKeys) {
                // Need to be kept
                if (keepFields != null && keepFields.includes(key)) continue;

                // Get all values
                const formValues = data.getAll(key);
                if (formValues.length > 0) {
                    // Matched
                    // Source value
                    const sourceValue = (source as any)[key];

                    if (Array.isArray(sourceValue)) {
                        // Array, types may differ
                        if (formValues.join('`') === sourceValue.join('`')) {
                            // Equal value, remove the key
                            data.delete(key);
                        }
                    } else if (formValues.length == 1) {
                        // Other
                        if (formValues[0].toString() === `${sourceValue}`) {
                            // Equal value, remove the key
                            data.delete(key);
                        }
                    }
                }
            }

            // Left fields
            for (const key of keys) {
                // Already cleared
                if (sourceKeys.includes(key)) continue;

                // Remove empties
                removeEmpty(key);
            }
        }

        // Return
        return data;
    }

    /**
     * Form data to object
     * @param form Form data
     * @returns Object
     */
    export function formDataToObject(form: FormData) {
        const dic: Record<string, any> = {};
        for (var key of new Set(form.keys())) {
            const values = form.getAll(key);
            dic[key] = values.length == 1 ? values[0] : values;
        }
        return dic;
    }

    /**
     * Format word's first letter to upper case
     * @param word Word
     */
    export function formatUpperLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

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
     * Merge form data to primary one
     * @param form Primary form data
     * @param forms Other form data
     * @returns Merged form data
     */
    export function mergeFormData(form: FormData, ...forms: FormData[]) {
        for (var newForm of forms) {
            for (var key of new Set(newForm.keys())) {
                form.delete(key);
                newForm.getAll(key).forEach((value) => form.append(key, value));
            }
        }

        return form;
    }

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

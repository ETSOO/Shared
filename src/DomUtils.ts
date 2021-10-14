import { DataTypes } from './DataTypes';
import { FormDataFieldValue, IFormData } from './types/FormData';

if (typeof navigator === 'undefined') {
    // Test mock only
    global.navigator = { language: 'en-US' } as any;
    global.location = { href: 'http://localhost/' } as any;
}

/**
 * Dom Utilities
 * Not all methods support Node
 */
export namespace DomUtils {
    /**
     * Language cache parameter name
     */
    export const Culture = 'culture';

    /**
     * Country cache parameter name
     */
    export const Country = 'country';

    /**
     * Clear form data
     * @param data Form data
     * @param source Source data to match
     * @param keepFields Fields need to be kept
     */
    export function clearFormData(
        data: IFormData,
        source?: {},
        keepFields?: string[]
    ) {
        // Unique keys, FormData may have same name keys
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
            for (const key of keys) {
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
                    const sourceValue = Reflect.get(source, key);

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
     * Cast data to target type
     * @param source Source data
     * @param template Template for generation
     * @returns Result
     */
    export function dataAs<T extends {}>(
        source: IFormData | {},
        template: T
    ): Partial<T> {
        // Properties
        const properties = Object.keys(template);

        // New data
        // Object.create(...)
        const data = <Partial<T>>{};

        // Entries
        const entries = isFormData(source)
            ? source.entries()
            : Object.entries(source);

        for (const [key, value] of entries) {
            // Is included
            const property = properties.find(
                (p) => p.localeCompare(key, 'en', { sensitivity: 'base' }) === 0
            );
            if (property == null) continue;

            // Template value
            const templateValue = Reflect.get(template, property);

            // Formatted value
            const propertyValue = DataTypes.convert(value, templateValue);

            // Set value
            // Object.assign(data, { [property]: propertyValue });
            // Object.defineProperty(data, property, { value: propertyValue });
            Reflect.set(data, property, propertyValue);
        }

        // Return
        return data;
    }

    /**
     * Current detected country
     */
    export const detectedCountry = (() => {
        // URL first, then local storage
        let country: string | null;
        try {
            country =
                new URL(location.href).searchParams.get(Country) ||
                localStorage.getItem(Country);
        } catch {
            country = null;
        }

        // Return
        return country;
    })();

    /**
     * Current detected culture
     */
    export const detectedCulture = (() => {
        // URL first, then local storage
        let culture: string | null;
        try {
            culture =
                new URL(location.href).searchParams.get(Culture) ||
                localStorage.getItem(Culture);
        } catch {
            culture = null;
        }

        // Browser detected
        if (culture == null) {
            culture =
                (navigator.languages && navigator.languages[0]) ||
                navigator.language;
        }

        // Return
        return culture;
    })();

    /**
     * Is two dimensions equal
     * @param d1 Dimension 1
     * @param d2 Dimension 2
     */
    export function dimensionEqual(d1?: DOMRect, d2?: DOMRect) {
        if (d1 == null && d2 == null) {
            return true;
        }

        if (d1 == null || d2 == null) {
            return false;
        }

        if (
            d1.left === d2.left &&
            d1.top === d2.top &&
            d1.right === d2.right &&
            d1.bottom === d2.bottom
        ) {
            return true;
        }

        return false;
    }

    /**
     * Form data to object
     * @param form Form data
     * @returns Object
     */
    export function formDataToObject(form: IFormData) {
        const dic: Record<string, FormDataFieldValue | FormDataFieldValue[]> =
            {};
        for (const key of new Set(form.keys())) {
            const values = form.getAll(key);
            dic[key] = values.length == 1 ? values[0] : values;
        }
        return dic;
    }

    /**
     * Get the available culture definition
     * @param items Available cultures
     * @param culture Detected culture
     */
    export const getCulture = (
        items: DataTypes.CultureDefinition[],
        culture: string
    ) => {
        if (items.length === 0) {
            return undefined;
        }

        // Exact match
        const exactMatch = items.find((item) => item.name === culture);
        if (exactMatch) return exactMatch;

        // Compatible match
        const compatibleMatch = items.find((item) =>
            item.compatibleName?.includes(culture)
        );
        if (compatibleMatch) return compatibleMatch;

        // Same part, like zh-CN and zh-HK
        const samePart = culture.split('-')[0];
        const samePartMatch = items.find((item) =>
            item.name.startsWith(samePart)
        );
        if (samePartMatch) return samePartMatch;

        // Default
        return items[0];
    };

    /**
     * Get an unique key combined with current URL
     * @param key Key
     */
    export const getLocationKey = (key: string) => `${location.href}:${key}`;

    function isIterable<T>(
        headers: Record<string, string> | Iterable<T>
    ): headers is Iterable<T> {
        return Symbol.iterator in headers;
    }

    /**
     * Convert headers to object
     * @param headers Heaers
     */
    export function headersToObject(
        headers: HeadersInit | Iterable<[string, string]>
    ): Record<string, string> {
        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }

        if (typeof Headers === 'undefined') {
            return Object.fromEntries(Object.entries(headers));
        }

        if (headers instanceof Headers) {
            return Object.fromEntries(headers.entries());
        }

        if (isIterable(headers)) {
            return Object.fromEntries(headers);
        }

        return headers;
    }

    /**
     * Is IFormData type guard
     * @param input Input object
     * @returns result
     */
    export function isFormData(input: unknown): input is IFormData {
        if (
            typeof input === 'object' &&
            input != null &&
            'entries' in input &&
            'getAll' in input &&
            'keys' in input
        ) {
            return true;
        }
        return false;
    }

    /**
     * Is JSON content type
     * @param contentType Content type string
     */
    export function isJSONContentType(contentType: string) {
        if (
            contentType &&
            // application/problem+json
            // application/json
            (contentType.includes('json') ||
                contentType.startsWith('application/javascript'))
        )
            return true;
        return false;
    }

    /**
     * Merge form data to primary one
     * @param form Primary form data
     * @param forms Other form data
     * @returns Merged form data
     */
    export function mergeFormData(form: IFormData, ...forms: IFormData[]) {
        for (const newForm of forms) {
            for (const key of new Set(newForm.keys())) {
                form.delete(key);
                newForm
                    .getAll(key)
                    .forEach((value) => form.append(key, value as any));
            }
        }

        return form;
    }

    /**
     * Merge URL search parameters
     * @param base URL search parameters
     * @param data New simple object data to merge
     */
    export function mergeURLSearchParams(
        base: URLSearchParams,
        data: DataTypes.SimpleObject
    ) {
        Object.entries(data).forEach(([key, value]) => {
            if (value == null) return;
            base.set(key, value.toString());
        });
        return base;
    }

    /**
     * Save country name
     * @param country Country name
     */
    export function saveCountry(country: string) {
        localStorage.setItem(Country, country);
    }

    /**
     * Save culture name
     * @param culture Culture name
     */
    export function saveCulture(culture: string) {
        localStorage.setItem(Culture, culture);
    }

    /**
     * Set HTML element focus by name
     * @param name Element name or first collection item
     */
    export function setFocus(name: string | {}) {
        const elementName =
            typeof name === 'object' ? Object.keys(name)[0] : name.toString();

        const element = document.getElementsByName(elementName)[0];
        if (element != null) element.focus();
    }
}

import { DataTypes } from './DataTypes';
import { Utils } from './Utils';

/**
 * Dom Utilities
 */
export namespace DomUtils {
    /**
     * Language parameter name
     */
    export const Lang = 'lang';

    /**
     * Current detected language
     */
    export const detectedLanguage = (() => {
        // URL first, then local storage
        let language: string | null;
        try {
            language =
                new URL(window.location.href).searchParams.get(Lang) ||
                localStorage.getItem(Lang);
        } catch {
            language = null;
        }

        // Browser detected
        if (language == null) {
            language =
                (navigator.languages && navigator.languages[0]) ||
                navigator.language;
        }

        // Return
        return language;
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
     * @param formData Form data
     */
    export const formDataToObject = (formData: FormData) =>
        Object.fromEntries(formData);

    /**
     * Get the available language definition
     * @param items Available languages
     * @param language Detected language
     */
    export const getLanguage = (
        items: DataTypes.LanguageDefinition[],
        language: string
    ) => {
        if (items.length === 0) {
            return undefined;
        }

        return items.find((item) => item.name === language) || items[0];
    };

    /**
     * Get an unique key combined with current URL
     * @param key Key
     */
    export const getLocationKey = (key: string) =>
        `${window.location.href}:${key}`;

    /**
     * Convert headers to object
     * @param headers Heaers
     */
    export function headersToObject(
        headers: HeadersInit
    ): Record<string, string> {
        if (headers instanceof Headers) {
            return Object.fromEntries(headers.entries());
        }

        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }

        return headers;
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
     * Merge class names
     * @param classNames Class names
     */
    export const mergeClasses = (...classNames: (string | undefined)[]) =>
        Utils.joinItems(classNames, ' ');

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
     * Save language name
     * @param lang Language name
     */
    export function saveLanguage(lang: string) {
        localStorage.setItem(Lang, lang);
    }
}

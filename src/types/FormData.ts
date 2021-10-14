/**
 * File like interface
 */
export interface IFile {
    /**
     * Name of the file
     */
    readonly name: string;

    /**
     * Size of the file in bytes
     */
    readonly size: number;

    /**
     * MIME type
     */
    readonly type: string;

    /**
     * Last modified time of the file, in millisecond since the UNIX epoch
     */
    readonly lastModified: number;
}

/**
 * FormDataFieldValue like type
 */
export type FormDataFieldValue = string | IFile;

/**
 * FormData like interface
 * https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
export interface IFormData {
    append(name: string, value: unknown, filename?: string): void;
    delete(name: string): void;
    entries(): IterableIterator<[string, FormDataEntryValue]>;
    set(name: string, value: unknown, filename?: string): void;
    get(name: string): FormDataFieldValue | null;
    getAll(name: string): FormDataFieldValue[];
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<FormDataEntryValue>;
}

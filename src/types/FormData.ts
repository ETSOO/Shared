/**
 * File like interface
 */
export interface IFile {
    name: string;
    size: number;
    type: string;
    lastModified: number;
}

/**
 * FormDataFieldValue like type
 */
declare type FormDataFieldValue = string | IFile;

/**
 * FormData like interface
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

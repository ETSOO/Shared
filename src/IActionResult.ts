import { IdType } from './DataTypes';

/**
 * Result errors
 * Indexable type
 */
export interface IResultErrors {
    readonly [key: string]: string[];
}

/**
 * Operation result interface
 */
export interface IActionResult<D extends object = {}> {
    /**
     * Status code
     */
    readonly status?: number;

    /**
     * Result data
     */
    readonly data?: D;

    /**
     * Result errors
     */
    readonly errors?: IResultErrors;

    /**
     * Title
     */
    title?: string;

    /**
     * Detail
     */
    detail?: string;

    /**
     * Trace id
     */
    traceId?: string;

    /**
     * Type
     */
    type?: string;

    /**
     * Field name
     */
    field?: string;

    /**
     * Success or not
     */
    readonly ok: boolean;
}

/**
 * Action result with id
 */
export type IdActionResult<T extends IdType = number> = IActionResult<{
    id: T;
}>;

/**
 * Action result with message data
 */
export type MsgActionResult = IActionResult<{
    msg: string;
}>;

/**
 * Action result with id, message data
 */
export type IdMsgActionResult = IActionResult<{
    id: number;
    msg: string;
}>;

/**
 * Action result with dynamic data
 */
export type DynamicActionResult = IActionResult<Record<string, any>>;

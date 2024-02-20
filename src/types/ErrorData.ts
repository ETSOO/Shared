export type ErrorType =
    | 'error'
    | 'unhandledrejection'
    | 'consoleWarn'
    | 'consoleError';

export type ErrorData = {
    type: ErrorType;
    eventType?: string;
    message: string;
    source?: string;
    lineNo?: number;
    colNo?: number;
    stack?: string;
};

import { NewGUID } from './Utils';

/**
 * Display align
 */
export enum NotificationAlign {
    TopLeft,
    TopCenter,
    TopRight,

    Center,
    Unkown, // Reserved for modal, only one instance supported

    BottomLeft,
    BottomCenter,
    BottomRight
}

/**
 * Modal types
 */
export enum NotificationModalType {
    Loading = 0,
    Confirm = 1,
    Prompt = 2,
    Error = 3
}

/**
 * Message types
 */
export enum NotificationMessageType {
    Default = 10,
    Success = 11,
    Warning = 12,
    Info = 13,
    Danger = 14
}

/**
 * Merged type definition below together
 */
export const NotificationType = {
    ...NotificationModalType,
    ...NotificationMessageType
};

/**
 * Notification types
 */
export type NotificationType = NotificationModalType | NotificationMessageType;

/**
 * Notification UI creator
 */
export interface NotificationCreator<UI> {
    (): UI;
}

/**
 * On dismiss callback
 */
export interface NotificationDismiss {
    (): void;
}

/**
 * On return callback
 * return false will prevent default action
 */
export interface NotificationReturn<T> {
    (value: T): boolean | void;
}

/**
 * Notification class
 * Generic parameter UI presents UI element type
 */
export abstract class Notification<UI> {
    /**
     * Display align
     */
    readonly align: NotificationAlign;

    /**
     * Content
     */
    content: string | NotificationCreator<UI>;

    /**
     * Dismiss timeout seed
     */
    private dismissSeed: number = 0;

    /**
     * Unique id
     */
    readonly id: string;

    /**
     * Input or control properties
     */
    inputProps?: any;

    /**
     * Display as modal
     */
    modal: boolean;

    /**
     * On dismiss handling
     */
    onDismiss?: NotificationDismiss;

    /**
     * On return value
     */
    onReturn?: NotificationReturn<any>;

    /**
     * Show the icon or hide it
     */
    showIcon?: boolean;

    /**
     * Seconds to auto dismiss
     */
    timespan: number;

    /**
     * Title
     */
    title?: string | NotificationCreator<UI>;

    /**
     * Type
     */
    type: NotificationType;

    /**
     * Constructor
     * @param type Type
     * @param content Content
     * @param title Title
     * @param align Align
     */
    constructor(
        type: NotificationType,
        content: string | NotificationCreator<UI>,
        title?: string | NotificationCreator<UI>,
        align?: NotificationAlign
    ) {
        this.id = NewGUID();

        this.type = type;
        this.content = content;
        this.title = title;

        // Modal type
        this.modal = type in NotificationModalType;

        // Align, only available for none modal
        this.align = this.modal
            ? NotificationAlign.Unkown
            : align || NotificationAlign.Center;

        // Display as modal will lasts otherwise 5 seconds to dismiss it
        this.timespan = this.modal ? 0 : 5;
    }

    /**
     * Dismiss it
     * @param delaySeconds Delay seconds
     * @returns Is delayed or not
     */
    dismiss(delaySeconds: number = 0): boolean {
        if (delaySeconds > 0) {
            this.removeTimeout();
            this.dismissSeed = window.setTimeout(
                this.dismiss.bind(this),
                delaySeconds * 1000,
                0 // force to dismiss
            );
            return true;
        }

        if (this.onDismiss) this.onDismiss();

        this.dispose();

        return false;
    }

    // Remove possible dismiss timeout
    private removeTimeout() {
        if (this.dismissSeed > 0) {
            window.clearTimeout(this.dismissSeed);
            this.dismissSeed = 0;
        }
    }

    /**
     * Dispose it
     */
    dispose() {
        this.removeTimeout();
    }

    /**
     * Render method
     * @param className Style class name
     */
    abstract render(className?: string): UI;
}

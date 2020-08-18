import { Notification, NotificationAlign } from './Notification';

/**
 * Notification action
 */
export interface NotificationAction {
    (id: string, remove: boolean): void;
}

/**
 * Notifications sorted with display align type
 */
export type NotificationDictionary = {
    [key: number]: Notification<any>[];
};

/**
 * Notification container class
 */
class NotificationContainerClass {
    // Registered update action
    private registeredUpdate?: NotificationAction;

    /**
     * Notification collection to display
     */
    readonly notifications: NotificationDictionary;

    private _count: number;
    /**
     * Notification count
     */
    get count(): number {
        return this._count;
    }

    /**
     * Constructor
     */
    constructor() {
        // Init notification collection
        this._count = 0;
        this.notifications = {};
        for (const align in NotificationAlign) {
            if (!isNaN(Number(align))) this.notifications[align] = [];
        }
    }

    /**
     * Add notification
     * @param notification Notification
     * @param top Is insert top
     */
    add(notification: Notification<any>, top: boolean = false): void {
        if (this.registeredUpdate == null) {
            throw new Error('Registration required');
        }

        // Support dismiss action
        const { onDismiss } = notification;
        notification.onDismiss = () => {
            // Remove the notification
            this.remove(notification);

            // Custom onDismiss callback
            if (onDismiss) onDismiss();
        };

        // Add to the collection
        const alignItems = this.notifications[notification.align];

        if (notification.align === NotificationAlign.Unkown) {
            // Only one modal window is visible
            if (alignItems.length > 0) {
                alignItems[0].dismiss();
            }
            alignItems.push(notification);
        } else {
            if (top) alignItems.unshift(notification);
            else alignItems.push(notification);
        }

        // Add count
        this._count++;

        // Call the registered add method
        this.registeredUpdate(notification.id, false);

        // Auto dismiss in timespan seconds
        if (notification.timespan > 0)
            notification.dismiss(notification.timespan);
    }

    /**
     * Dispose all notifications
     */
    dispose(): void {
        for (const align in this.notifications) {
            const items = this.notifications[align];
            items.forEach((item) => item.dispose());
        }
    }

    /**
     * Remove notification
     * @param notification Notification
     */
    remove(notification: Notification<any>): void {
        if (this.registeredUpdate == null) {
            throw new Error('Registration required');
        }

        // Remove from the collection
        const alignItems = this.notifications[notification.align];
        const index = alignItems.findIndex((n) => n.id === notification.id);
        if (index !== -1) {
            alignItems.splice(index, 1);

            // Deduct count
            this._count--;

            // Trigger remove
            this.registeredUpdate(notification.id, true);
        }
    }

    /**
     * Register component action
     * @param update Update action
     */
    register(update: NotificationAction): void {
        this.registeredUpdate = update;
    }
}

/**
 * Notification container object
 */
export const NotificationContainer = new NotificationContainerClass();

# NotificationBase
**TypeScript notification component for extending with all features described and partially implemented.**

## Installing

Using npm:

```bash
$ npm install @etsoo/notificationbase
```

Using yarn:

```bash
$ yarn add @etsoo/notificationbase
```

## Notification
Notification object to display.

Properties:

|Name|Description|
|---:|---|
|align|Readonly, display align|
|content|Content to display|
|id|Unique id|
|inputProps|Input or additional control properties|
|modal|Display as modal window or not|
|onDismiss|Dismiss callback|
|onReturn|Return value callback|
|showIcon|Show icon or not|
|timespan|Seconds to auto dismiss|
|title|Title|
|type|Notification type|

Methods:

```ts
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
    )

    /**
     * Dismiss it
     * @param delaySeconds Delay seconds
     * @returns Is delayed or not
     */
    dismiss(delaySeconds: number = 0): boolean

    /**
     * Dispose it
     */
    dispose()

    /**
     * Render method
     * @param className Style class name
     */
    abstract render(className?: string): UI;
```


## NotificationContainer
NotificationContainer is a global instance of NotificationContainerClass to provide global access of properties and methods.

Properties:

|Name|Description|
|---:|---|
|notifications|Readonly. Notification collection to display|
|count|Readonly. Notification count|

Methods:

```ts
    /**
     * Add notification
     * @param notification Notification
     * @param top Is insert top
     */
    add(notification: Notification<any>, top: boolean = false): void

    /**
     * Dispose all notifications
     */
    dispose(): void

    /**
     * Remove notification
     * @param notification Notification
     */
    remove(notification: Notification<any>): void

    /**
     * Register component action
     * @param update Update action
     */
    register(update: NotificationAction): void
```
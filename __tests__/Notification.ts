import { NotificationContainer } from '../src/NotificationContainer';
import { Notification, NotificationType } from '../src/Notification';

// Class implementation for tests
class NotificationTest extends Notification<any> {
    /**
     * Render method
     * @param className Style class name
     */
    render(className?: string) {
        return {};
    }
}

// Timer mock
// https://jestjs.io/docs/en/timer-mocks
jest.useFakeTimers();

test('Tests for notification dismiss', () => {
    // Arrange
    const n = new NotificationTest(NotificationType.Loading, 'Test');

    // Spy on the method
    const spy = jest.spyOn(n, 'dismiss');

    // Act
    n.dismiss(2);

    // Assert
    // setTimeout should be called 1 time
    expect(setTimeout).toBeCalled();

    // Fast forward
    jest.runOnlyPendingTimers();

    // dismiss should be called 2 times
    expect(spy).toBeCalledTimes(2);
});

test('Tests for notification container add', (done) => {
    // Arrange
    const n = new NotificationTest(NotificationType.Loading, 'Test');

    const update = (notificationId: string, remove: boolean) => {
        expect(notificationId).toBe(n.id);
        expect(remove).toBeFalsy();
        expect(NotificationContainer.count).toBe(1);
        done();
    };

    NotificationContainer.register(update);

    // Act
    NotificationContainer.add(n);
});

test('Tests for notification container remove', (done) => {
    // Arrange
    const n = new NotificationTest(NotificationType.Loading, 'Test');
    n.onDismiss = () => {
        expect(NotificationContainer.count).toBe(0);
        done();
    };
    n.timespan = 3;

    const update = (notificationId: string, remove: boolean) => {
        done();
    };

    NotificationContainer.register(update);

    // Act
    NotificationContainer.add(n);

    // Assert
    // Previous test added one but a new modal type will remove it
    expect(NotificationContainer.count).toBe(1);

    // Fast forward
    jest.runOnlyPendingTimers();
});

jest.clearAllTimers();

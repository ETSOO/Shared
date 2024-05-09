import { Keyboard } from '../src/Keyboard';

test('Tests for KeyboardEvent.key', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });
    const callback = (e: KeyboardEvent) => {
        expect(e.key).toBe(Keyboard.Keys.Space);
    };
    window.addEventListener('keydown', callback);
    window.dispatchEvent(event);
    window.removeEventListener('keydown', callback);
});

test('Tests for isTypingContent', () => {
    expect(Keyboard.isTypingContent(Keyboard.Keys.A)).toBeTruthy();
    expect(Keyboard.isTypingContent(Keyboard.Keys.Ampersand)).toBeTruthy();
    expect(Keyboard.isTypingContent(Keyboard.Keys.Shift)).toBeFalsy();
    expect(Keyboard.isTypingContent(Keyboard.Keys.PrintScreen)).toBeFalsy();
});

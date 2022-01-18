import { Keyboard } from '../src/Keyboard';

test('Tests for isTypingContent', () => {
    expect(Keyboard.isTypingContent(Keyboard.Keys.A)).toBeTruthy();
    expect(Keyboard.isTypingContent(Keyboard.Keys.Ampersand)).toBeTruthy();
    expect(Keyboard.isTypingContent(Keyboard.Keys.Shift)).toBeFalsy();
    expect(Keyboard.isTypingContent(Keyboard.Keys.PrintScreen)).toBeFalsy();
});

import { WindowStorage } from '../src/storage/WindowStorage';

// Arrange
localStorage.setItem('test', 'test');
localStorage.setItem('a', 'a');
const storage = new WindowStorage(['test', 'a'], (field, data, index) => {
    if (index === 0 && field === 'test') return null;
    return data;
});

test('Tests for getInstanceCount', () => {
    expect(storage.getInstanceCount()).toBe(0);
});

test('Tests for updateInstanceCount / getInstanceCount', () => {
    // Current index -1
    storage.updateInstanceCount(true);

    // Always make sure it starts with 0
    expect(storage.getInstanceCount()).toBe(0);
});

test('Tests for getData', () => {
    expect(storage.getData('test')).toBeUndefined();
    expect(storage.getPersistedData('test')).toBe('test');

    expect(storage.getData('a')).toBe('a');
    expect(storage.getPersistedData('a')).toBe('a');
});

test('Tests for setData', () => {
    storage.setData('test', 'test2');
    expect(storage.getData('test')).toBe('test2');
    expect(storage.getPersistedData('test')).toBe('test2');
});

import { WindowStorage } from '../src/storage/WindowStorage';

// Arrange
const storage = new WindowStorage([], (_field, data, _index) => data);

test('Tests for getInstanceCount', () => {
    expect(storage.getInstanceCount()).toBe(0);
});

test('Tests for updateInstanceCount / getInstanceCount', () => {
    // Current index -1
    storage.updateInstanceCount(true);

    // Always make sure it starts with 0
    expect(storage.getInstanceCount()).toBe(0);
});

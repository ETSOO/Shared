import { StorageUtils } from '../src/StorageUtils';

test('Tests for all', () => {
    // Arrange
    StorageUtils.setSessionData('string', 'test');
    StorageUtils.setSessionData('boolean', true);
    StorageUtils.setSessionData('number', 3.14);
    StorageUtils.setSessionData('test', { id: 123, name: 'test' });

    expect(StorageUtils.getSessionData('string', '')).toBe('test');
    expect(StorageUtils.getSessionData('boolean', false)).toBe(true);
    expect(StorageUtils.getSessionData('number', 0)).toBe(3.14);
    expect(StorageUtils.getSessionData('test', {})).toHaveProperty('id', 123);
});

test('Tests for getLocalObject', () => {
    StorageUtils.setLocalData('test', { id: 123, name: 'test' });
    const data = StorageUtils.getLocalObject<{ id: number }>('test');
    expect(data?.id).toBe(123);
    expect(data).toHaveProperty('name', 'test');
});

test('Tests for getSessionObject', () => {
    StorageUtils.setSessionData('test', { id: 123, name: 'test' });
    const data = StorageUtils.getSessionObject<{ id: number }>('test');
    expect(data?.id).toBe(123);
    expect(data).toHaveProperty('name', 'test');
});

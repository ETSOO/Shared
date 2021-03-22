import { StorageUtils } from '../src/StorageUtils';

test('Tests for all', () => {
    // Arrange
    StorageUtils.cacheSessionData('string', 'test');
    StorageUtils.cacheSessionData('test', { id: 123, name: 'test' });

    expect(StorageUtils.getSessionData('string')).toBe('test');
    expect(StorageUtils.getSessionDataAs<any>('test')).toHaveProperty(
        'id',
        123
    );
});

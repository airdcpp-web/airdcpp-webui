import { describe, expect, test, vi } from 'vitest';
import RowDataLoader from '../RowDataLoader';

describe('RowDataLoader', () => {
  const createMockStore = (rowCount = 100) => ({
    rowCount,
    viewUrl: '/test/view',
    DEBUG: false,
  });

  const createMockSocket = () => ({
    get: vi.fn().mockResolvedValue([]),
  });

  test('should merge item data into existing row', () => {
    const loader = new RowDataLoader(createMockStore(), vi.fn(), createMockSocket());
    loader.onItemsUpdated([{ id: 1, name: 'test' }], 0, 1);

    loader.onItemsUpdated([{ id: 1, name: 'updated' }], 0, 1);

    expect(loader.getRowData(0)).toEqual({ id: 1, name: 'updated' });
  });

  test('should set item data when no previous data', () => {
    const loader = new RowDataLoader(createMockStore(), vi.fn(), createMockSocket());
    loader.onItemsUpdated([{ id: 1, name: 'new' }], 0, 1);

    expect(loader.getRowData(0)).toEqual({ id: 1, name: 'new' });
  });

  test('should clear data when empty items received', () => {
    const loader = new RowDataLoader(createMockStore(), vi.fn(), createMockSocket());
    loader.onItemsUpdated([{ id: 1 }], 0, 1);
    loader.onItemsUpdated([], 0, 0);

    expect(loader.getRowData(0)).toBeUndefined();
  });

  test('should not update row when data is equal (isEqual check)', () => {
    const onDataLoad = vi.fn();
    const loader = new RowDataLoader(createMockStore(), onDataLoad, createMockSocket());
    loader.onItemsUpdated([{ id: 1 }], 0, 1);
    onDataLoad.mockClear();

    loader.onItemsUpdated([{ id: 1 }], 0, 1);

    expect(loader.getRowData(0)).toEqual({ id: 1 });
  });

  test('should handle multiple row updates', () => {
    const loader = new RowDataLoader(createMockStore(), vi.fn(), createMockSocket());
    loader.onItemsUpdated([{ id: 1 }, { id: 2 }, { id: 3 }], 0, 3);

    loader.onItemsUpdated([{ id: 1, name: 'a' }, { id: 2, name: 'b' }], 0, 2);

    expect(loader.getRowData(0)).toEqual({ id: 1, name: 'a' });
    expect(loader.getRowData(1)).toEqual({ id: 2, name: 'b' });
    // Items not in the new range are deleted
    expect(loader.getRowData(2)).toBeUndefined();
  });

  test('should store item directly when no existing data and $set is used', () => {
    const loader = new RowDataLoader(createMockStore(), vi.fn(), createMockSocket());
    loader.onItemsUpdated([{ id: 1, name: 'test' }], 0, 1);

    expect(loader.getRowData(0)).toEqual({ id: 1, name: 'test' });
  });

  test('should delete rows outside range when items are shorter than data', () => {
    const loader = new RowDataLoader(createMockStore(), vi.fn(), createMockSocket());
    loader.onItemsUpdated([{ id: 1 }, { id: 2 }, { id: 3 }], 0, 3);

    loader.onItemsUpdated([{ id: 1 }], 0, 1);

    expect(loader.getRowData(0)).toEqual({ id: 1 });
    expect(loader.getRowData(1)).toBeUndefined();
    expect(loader.getRowData(2)).toBeUndefined();
  });
});

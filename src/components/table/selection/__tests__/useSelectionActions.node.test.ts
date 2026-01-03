import { describe, expect, test, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelectionActions } from '../useSelectionActions';
import { TableSelectionContextValue } from '../types';

// Mock item type for testing
interface TestItem {
  id: number;
  name: string;
}

// Helper to create mock items
const createItems = (count: number): TestItem[] =>
  Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

// Helper to create mock selection context
const createMockSelection = (
  overrides: Partial<TableSelectionContextValue> = {}
): TableSelectionContextValue => ({
  selectedIds: new Set<number>(),
  excludedIds: new Set<number>(),
  selectAllMode: false,
  selectedCount: 0,
  toggleItem: vi.fn(),
  selectItems: vi.fn(),
  setSelectAllMode: vi.fn(),
  clearSelection: vi.fn(),
  isSelected: vi.fn(() => false),
  ...overrides,
});

// Helper to create mock store
const createMockStore = (items: TestItem[] = [], rowCount?: number) => ({
  items,
  rowCount: rowCount ?? items.length,
});

// Setup helper to reduce boilerplate in tests
const setup = (
  selectionOverrides: Partial<TableSelectionContextValue> = {},
  items: TestItem[] = [],
  rowCount?: number,
) => {
  const selection = createMockSelection(selectionOverrides);
  const store = createMockStore(items, rowCount);
  return renderHook(() => useSelectionActions<TestItem>({ selection, store }));
};

describe('useSelectionActions', () => {
  describe('initial state', () => {
    test('should have showBulkDownload as false initially', () => {
      const { result } = setup();
      expect(result.current.showBulkDownload).toBe(false);
    });

    test('should have empty selectedItems when no selection', () => {
      const { result } = setup({}, createItems(5));
      expect(result.current.selectedItems).toEqual([]);
    });
  });

  describe('getTotalCount', () => {
    test('should return store rowCount', () => {
      const { result } = setup({}, createItems(5), 100);
      expect(result.current.getTotalCount()).toBe(100);
    });

    test('should return 0 when rowCount is undefined', () => {
      const selection = createMockSelection();
      const store = { items: [] };
      const { result } = renderHook(() =>
        useSelectionActions<TestItem>({ selection, store })
      );
      expect(result.current.getTotalCount()).toBe(0);
    });

    test('should return 0 for empty store', () => {
      const { result } = setup({}, [], 0);
      expect(result.current.getTotalCount()).toBe(0);
    });
  });

  describe('selectedItems in normal mode', () => {
    test('should return items that are in selectedIds', () => {
      const { result } = setup(
        { selectedIds: new Set([1, 3, 5]), selectAllMode: false },
        createItems(5),
      );
      expect(result.current.selectedItems).toHaveLength(3);
      expect(result.current.selectedItems.map((i) => i.id)).toEqual([1, 3, 5]);
    });

    test('should return empty array when no items are selected', () => {
      const { result } = setup(
        { selectedIds: new Set(), selectAllMode: false },
        createItems(5),
      );
      expect(result.current.selectedItems).toEqual([]);
    });

    test('should handle selectedIds that do not exist in store', () => {
      const { result } = setup(
        { selectedIds: new Set([1, 99, 100]), selectAllMode: false },
        createItems(3),
      );
      expect(result.current.selectedItems).toHaveLength(1);
      expect(result.current.selectedItems[0].id).toBe(1);
    });
  });

  describe('selectedItems in select-all mode', () => {
    test('should return all items when no exclusions', () => {
      const { result } = setup(
        { selectAllMode: true, excludedIds: new Set() },
        createItems(5),
      );
      expect(result.current.selectedItems).toHaveLength(5);
    });

    test('should exclude items in excludedIds', () => {
      const { result } = setup(
        { selectAllMode: true, excludedIds: new Set([2, 4]) },
        createItems(5),
      );
      expect(result.current.selectedItems).toHaveLength(3);
      expect(result.current.selectedItems.map((i) => i.id)).toEqual([1, 3, 5]);
    });

    test('should return empty array when all items are excluded', () => {
      const { result } = setup(
        { selectAllMode: true, excludedIds: new Set([1, 2, 3]) },
        createItems(3),
      );
      expect(result.current.selectedItems).toEqual([]);
    });
  });

  describe('handleBulkDownload', () => {
    test('should set showBulkDownload to true', () => {
      const { result } = setup();
      expect(result.current.showBulkDownload).toBe(false);
      act(() => {
        result.current.handleBulkDownload();
      });
      expect(result.current.showBulkDownload).toBe(true);
    });

    test('should remain true when called multiple times', () => {
      const { result } = setup();
      act(() => {
        result.current.handleBulkDownload();
        result.current.handleBulkDownload();
      });
      expect(result.current.showBulkDownload).toBe(true);
    });
  });

  describe('handleBulkDownloadClose', () => {
    test('should set showBulkDownload to false', () => {
      const { result } = setup();
      act(() => {
        result.current.handleBulkDownload();
      });
      expect(result.current.showBulkDownload).toBe(true);
      act(() => {
        result.current.handleBulkDownloadClose();
      });
      expect(result.current.showBulkDownload).toBe(false);
    });

    test('should call clearSelection', () => {
      const clearSelection = vi.fn();
      const { result } = setup({ clearSelection });
      act(() => {
        result.current.handleBulkDownloadClose();
      });
      expect(clearSelection).toHaveBeenCalledTimes(1);
    });
  });

  describe('reactivity', () => {
    test('should update selectedItems when selection changes', () => {
      const items = createItems(5);
      const store = createMockStore(items);

      const { result, rerender } = renderHook(
        ({ selection }) => useSelectionActions<TestItem>({ selection, store }),
        {
          initialProps: {
            selection: createMockSelection({
              selectedIds: new Set([1]),
              selectAllMode: false,
            }),
          },
        }
      );

      expect(result.current.selectedItems).toHaveLength(1);

      // Update selection by rerendering with new props
      rerender({
        selection: createMockSelection({
          selectedIds: new Set([1, 2, 3]),
          selectAllMode: false,
        }),
      });

      expect(result.current.selectedItems).toHaveLength(3);
    });

    test('should update selectedItems when store items change', () => {
      const selection = createMockSelection({
        selectedIds: new Set([1, 2, 3]),
        selectAllMode: false,
      });
      let items = createItems(2);
      let store = createMockStore(items);

      const { result, rerender } = renderHook(
        ({ store }) => useSelectionActions<TestItem>({ selection, store }),
        { initialProps: { store } }
      );

      expect(result.current.selectedItems).toHaveLength(2);

      // Add more items to store
      items = createItems(5);
      store = createMockStore(items);
      rerender({ store });

      expect(result.current.selectedItems).toHaveLength(3);
    });
  });

  describe('edge cases', () => {
    test('should handle empty store items array', () => {
      const { result } = setup(
        { selectedIds: new Set([1, 2, 3]), selectAllMode: false },
        [],
      );
      expect(result.current.selectedItems).toEqual([]);
    });

    test('should handle undefined store items', () => {
      const selection = createMockSelection({
        selectedIds: new Set([1, 2, 3]),
        selectAllMode: false,
      });
      const store = { rowCount: 10 };
      const { result } = renderHook(() =>
        useSelectionActions<TestItem>({ selection, store })
      );
      expect(result.current.selectedItems).toEqual([]);
    });

    test('should filter out null/undefined items', () => {
      const items = [
        { id: 1, name: 'Item 1' },
        null as unknown as TestItem,
        { id: 3, name: 'Item 3' },
        undefined as unknown as TestItem,
      ];
      const { result } = setup(
        { selectAllMode: true, excludedIds: new Set() },
        items,
      );
      expect(result.current.selectedItems).toHaveLength(2);
      expect(result.current.selectedItems.map((i) => i.id)).toEqual([1, 3]);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableSelection } from '../useTableSelection';

// Helper to reduce boilerplate
const setup = () => renderHook(() => useTableSelection());

const item = (id: number) => ({ id, name: `Item ${id}` });

describe('useTableSelection', () => {
  describe('initial state', () => {
    test('should have empty selection initially', () => {
      const { result } = setup();

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.selectedCount).toBe(0);
    });
  });

  describe('toggleItem', () => {
    test('should add item to selection when toggled', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.selectedIds.has(1)).toBe(true);
      expect(result.current.selectedCount).toBe(1);
      expect(result.current.isSelected(1)).toBe(true);
    });

    test('should remove item from selection when toggled again', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
      });
      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.selectedIds.has(1)).toBe(false);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.isSelected(1)).toBe(false);
    });

    test('should handle multiple item selections', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
        result.current.toggleItem(3);
      });

      expect(result.current.selectedIds.size).toBe(3);
      expect(result.current.selectedCount).toBe(3);
      expect(result.current.isSelected(1)).toBe(true);
      expect(result.current.isSelected(2)).toBe(true);
      expect(result.current.isSelected(3)).toBe(true);
      expect(result.current.isSelected(4)).toBe(false);
    });

    test('should cache supplied item data so it survives leaving the store', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1, item(1));
      });

      expect(result.current.getCachedItemData(1)).toEqual(item(1));
    });

    test('should drop cached data when an item is deselected', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1, item(1));
      });
      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.getCachedItemData(1)).toBeUndefined();
    });
  });

  describe('selectItems', () => {
    test('should select the supplied items and cache their data', () => {
      const { result } = setup();

      act(() => {
        result.current.selectItems([item(1), item(2), item(3)]);
      });

      expect(result.current.selectedCount).toBe(3);
      expect(result.current.isSelected(2)).toBe(true);
      expect(result.current.getCachedItemData(2)).toEqual(item(2));
      expect(result.current.getItemDataCache().size).toBe(3);
    });

    test('should replace any previous selection', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(9, item(9));
      });
      act(() => {
        result.current.selectItems([item(1), item(2)]);
      });

      expect(result.current.selectedIds.size).toBe(2);
      expect(result.current.isSelected(9)).toBe(false);
      expect(result.current.getCachedItemData(9)).toBeUndefined();
    });

    test('should clear the selection when given an empty list', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1, item(1));
      });
      act(() => {
        result.current.selectItems([]);
      });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.getItemDataCache().size).toBe(0);
    });
  });

  describe('clearSelection', () => {
    test('should clear the selection and the cache', () => {
      const { result } = setup();

      act(() => {
        result.current.selectItems([item(1), item(2)]);
      });

      expect(result.current.selectedCount).toBe(2);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.getItemDataCache().size).toBe(0);
    });
  });

  describe('isSelected', () => {
    test('should report only the selected ids', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(3);
      });

      expect(result.current.isSelected(1)).toBe(true);
      expect(result.current.isSelected(2)).toBe(false);
      expect(result.current.isSelected(3)).toBe(true);
    });
  });

  describe('selectedCount', () => {
    test('should track the number of selected items', () => {
      const { result } = setup();

      expect(result.current.selectedCount).toBe(0);

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
      });

      expect(result.current.selectedCount).toBe(2);

      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.selectedCount).toBe(1);
    });
  });

  describe('entity/view change behavior', () => {
    test('should clear selection when entityId changes', () => {
      const { result, rerender } = renderHook(
        ({ entityId }) => useTableSelection({ entityId }),
        { initialProps: { entityId: 1 } },
      );

      act(() => {
        result.current.toggleItem(1, item(1));
        result.current.toggleItem(2, item(2));
      });

      expect(result.current.selectedCount).toBe(2);

      rerender({ entityId: 2 });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.getItemDataCache().size).toBe(0);
    });

    test('should clear selection when viewId changes', () => {
      const { result, rerender } = renderHook(
        ({ viewId }) => useTableSelection({ viewId }),
        { initialProps: { viewId: 'view1' } },
      );

      act(() => {
        result.current.selectItems([item(1), item(2), item(3)]);
      });

      expect(result.current.selectedCount).toBe(3);

      rerender({ viewId: 'view2' });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.getItemDataCache().size).toBe(0);
    });

    test('should not clear selection when same entityId is passed', () => {
      const { result, rerender } = renderHook(
        ({ entityId }) => useTableSelection({ entityId }),
        { initialProps: { entityId: 1 } },
      );

      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.selectedCount).toBe(1);

      rerender({ entityId: 1 });

      expect(result.current.selectedCount).toBe(1);
    });
  });
});

import { describe, expect, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableSelection } from '../useTableSelection';

// Helper to reduce boilerplate
const setup = () => renderHook(() => useTableSelection());

describe('useTableSelection', () => {
  describe('initial state', () => {
    test('should have empty selection initially', () => {
      const { result } = setup();

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.selectAllMode).toBe(false);
      expect(result.current.excludedIds.size).toBe(0);
    });
  });

  describe('toggleItem in normal mode', () => {
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
  });

  describe('selectAllMode', () => {
    test('should enter select-all mode with total count', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      expect(result.current.selectAllMode).toBe(true);
      expect(result.current.selectedCount).toBe(100);
      expect(result.current.excludedIds.size).toBe(0);
    });

    test('should clear previous selections when entering select-all mode', () => {
      const { result } = setup();

      // First select some items manually
      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
      });

      expect(result.current.selectedIds.size).toBe(2);

      // Enter select-all mode
      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.selectAllMode).toBe(true);
      expect(result.current.selectedCount).toBe(100);
    });

    test('should exit select-all mode and clear all', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.setSelectAllMode(false, 0);
      });

      expect(result.current.selectAllMode).toBe(false);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.excludedIds.size).toBe(0);
    });
  });

  describe('toggleItem in select-all mode', () => {
    test('should add item to excluded list when toggled in select-all mode', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.toggleItem(5);
      });

      expect(result.current.excludedIds.has(5)).toBe(true);
      expect(result.current.selectedCount).toBe(99);
      expect(result.current.isSelected(5)).toBe(false);
      expect(result.current.isSelected(1)).toBe(true); // Other items still selected
    });

    test('should remove item from excluded list when toggled again', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.toggleItem(5);
      });

      act(() => {
        result.current.toggleItem(5);
      });

      expect(result.current.excludedIds.has(5)).toBe(false);
      expect(result.current.selectedCount).toBe(100);
      expect(result.current.isSelected(5)).toBe(true);
    });

    test('should handle multiple exclusions', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
        result.current.toggleItem(3);
      });

      expect(result.current.excludedIds.size).toBe(3);
      expect(result.current.selectedCount).toBe(97);
      expect(result.current.isSelected(1)).toBe(false);
      expect(result.current.isSelected(2)).toBe(false);
      expect(result.current.isSelected(3)).toBe(false);
      expect(result.current.isSelected(4)).toBe(true);
    });
  });

  describe('selectItems', () => {
    test('should select specific items', () => {
      const { result } = setup();

      act(() => {
        result.current.selectItems([1, 2, 3]);
      });

      expect(result.current.selectedIds.size).toBe(3);
      expect(result.current.isSelected(1)).toBe(true);
      expect(result.current.isSelected(2)).toBe(true);
      expect(result.current.isSelected(3)).toBe(true);
    });

    test('should exit select-all mode when selecting specific items', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.selectItems([1, 2]);
      });

      expect(result.current.selectAllMode).toBe(false);
      expect(result.current.selectedIds.size).toBe(2);
      expect(result.current.excludedIds.size).toBe(0);
    });

    test('should replace previous selection', () => {
      const { result } = setup();

      act(() => {
        result.current.selectItems([1, 2, 3]);
      });

      act(() => {
        result.current.selectItems([4, 5]);
      });

      expect(result.current.selectedIds.size).toBe(2);
      expect(result.current.isSelected(1)).toBe(false);
      expect(result.current.isSelected(4)).toBe(true);
      expect(result.current.isSelected(5)).toBe(true);
    });
  });

  describe('clearSelection', () => {
    test('should clear normal selection', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
      });

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.selectedCount).toBe(0);
    });

    test('should clear select-all mode and exclusions', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
        result.current.toggleItem(5);
      });

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectAllMode).toBe(false);
      expect(result.current.excludedIds.size).toBe(0);
      expect(result.current.selectedCount).toBe(0);
    });
  });

  describe('isSelected', () => {
    test('should return correct state in normal mode', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.isSelected(1)).toBe(true);
      expect(result.current.isSelected(2)).toBe(false);
    });

    test('should return correct state in select-all mode', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.toggleItem(5);
      });

      expect(result.current.isSelected(1)).toBe(true);
      expect(result.current.isSelected(5)).toBe(false);
    });
  });

  describe('selectedCount', () => {
    test('should count selected items in normal mode', () => {
      const { result } = setup();

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
        result.current.toggleItem(3);
      });

      expect(result.current.selectedCount).toBe(3);
    });

    test('should calculate count correctly in select-all mode', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      expect(result.current.selectedCount).toBe(100);

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
      });

      expect(result.current.selectedCount).toBe(98);
    });

    test('should not go below zero', () => {
      const { result } = setup();

      act(() => {
        result.current.setSelectAllMode(true, 2);
      });

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
        result.current.toggleItem(3);
        result.current.toggleItem(4);
        result.current.toggleItem(5);
      });

      // Even with more exclusions than total, count should be 0
      expect(result.current.selectedCount).toBe(0);
    });
  });

  describe('entity/view change behavior', () => {
    test('should clear selection when entityId changes', () => {
      const { result, rerender } = renderHook(
        ({ entityId }) => useTableSelection({ entityId }),
        { initialProps: { entityId: 1 } }
      );

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(2);
      });

      expect(result.current.selectedCount).toBe(2);

      // Change entityId
      rerender({ entityId: 2 });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.selectAllMode).toBe(false);
    });

    test('should clear selection when viewId changes', () => {
      const { result, rerender } = renderHook(
        ({ viewId }) => useTableSelection({ viewId }),
        { initialProps: { viewId: 'view1' } }
      );

      act(() => {
        result.current.setSelectAllMode(true, 100);
      });

      act(() => {
        result.current.toggleItem(5);
      });

      expect(result.current.selectedCount).toBe(99);

      // Change viewId
      rerender({ viewId: 'view2' });

      expect(result.current.selectedCount).toBe(0);
      expect(result.current.selectAllMode).toBe(false);
      expect(result.current.excludedIds.size).toBe(0);
    });

    test('should not clear selection when same entityId is passed', () => {
      const { result, rerender } = renderHook(
        ({ entityId }) => useTableSelection({ entityId }),
        { initialProps: { entityId: 1 } }
      );

      act(() => {
        result.current.toggleItem(1);
      });

      expect(result.current.selectedCount).toBe(1);

      // Rerender with same entityId
      rerender({ entityId: 1 });

      expect(result.current.selectedCount).toBe(1);
    });
  });
});

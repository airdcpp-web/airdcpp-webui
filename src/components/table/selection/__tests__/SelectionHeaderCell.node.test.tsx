import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as React from 'react';

import { SelectionHeaderCell } from '../SelectionHeaderCell';
import TableSelectionContext from '../SelectionContext';
import { TableSelectionContextValue } from '../types';

// Ensure DOM is cleaned up after each test
afterEach(() => {
  cleanup();
});

// Helper to create mock selection context
const createMockContext = (
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

// Helper to render with context
const renderWithContext = (
  context: TableSelectionContextValue,
  totalCountGetter: () => number = () => 10
) => {
  return render(
    <TableSelectionContext.Provider value={context}>
      <SelectionHeaderCell totalCountGetter={totalCountGetter} />
    </TableSelectionContext.Provider>
  );
};

describe('SelectionHeaderCell', () => {
  describe('checkbox checked state (allSelected)', () => {
    test('should be unchecked when no items are selected', () => {
      const context = createMockContext();
      renderWithContext(context);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('should be checked when selectAllMode with no exclusions', () => {
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set(),
      });
      renderWithContext(context);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('should be unchecked when selectAllMode but all items excluded', () => {
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      });
      renderWithContext(context, () => 10);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('should be checked when all items manually selected (not selectAllMode)', () => {
      const context = createMockContext({
        selectAllMode: false,
        selectedIds: new Set([1, 2, 3, 4, 5]),
      });
      renderWithContext(context, () => 5);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('should be unchecked when only some items manually selected', () => {
      const context = createMockContext({
        selectAllMode: false,
        selectedIds: new Set([1, 2]),
      });
      renderWithContext(context, () => 10);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('should be unchecked when totalCount is 0', () => {
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set(),
      });
      renderWithContext(context, () => 0);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('indeterminate state (someSelected)', () => {
    test('should be indeterminate when some items manually selected', () => {
      const context = createMockContext({
        selectAllMode: false,
        selectedIds: new Set([1, 2, 3]),
      });
      renderWithContext(context, () => 10);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    test('should be indeterminate in selectAllMode with some exclusions', () => {
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set([1, 2]),
      });
      renderWithContext(context, () => 10);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    test('should not be indeterminate when no items selected', () => {
      const context = createMockContext({
        selectAllMode: false,
        selectedIds: new Set(),
      });
      renderWithContext(context, () => 10);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);
    });

    test('should not be indeterminate when all items selected', () => {
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set(),
      });
      renderWithContext(context, () => 10);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);
    });

    test('should not be indeterminate when all manually selected', () => {
      const context = createMockContext({
        selectAllMode: false,
        selectedIds: new Set([1, 2, 3, 4, 5]),
      });
      renderWithContext(context, () => 5);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);
    });
  });

  describe('handleChange (click behavior)', () => {
    test('should enter selectAllMode when clicked and not in selectAllMode', () => {
      const setSelectAllMode = vi.fn();
      const context = createMockContext({
        selectAllMode: false,
        setSelectAllMode,
      });
      renderWithContext(context, () => 100);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(setSelectAllMode).toHaveBeenCalledWith(true, 100);
    });

    test('should exit selectAllMode when clicked and in selectAllMode', () => {
      const setSelectAllMode = vi.fn();
      const context = createMockContext({
        selectAllMode: true,
        setSelectAllMode,
      });
      renderWithContext(context);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(setSelectAllMode).toHaveBeenCalledWith(false, 0);
    });

    test('should use fresh totalCount when entering selectAllMode', () => {
      const setSelectAllMode = vi.fn();
      const context = createMockContext({
        selectAllMode: false,
        setSelectAllMode,
      });

      let count = 50;
      const dynamicCountGetter = () => count;
      renderWithContext(context, dynamicCountGetter);

      // Simulate count changing before click
      count = 75;

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      // Should use the current count (75), not the initial render count (50)
      expect(setSelectAllMode).toHaveBeenCalledWith(true, 75);
    });
  });

  describe('accessibility', () => {
    test('should have "Select all" aria-label when not all selected', () => {
      const context = createMockContext();
      renderWithContext(context);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Select all');
    });

    test('should have "Deselect all" aria-label when all selected', () => {
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set(),
      });
      renderWithContext(context);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Deselect all');
    });
  });

  describe('edge cases', () => {
    test('should handle selectAllMode with exclusions equal to totalCount', () => {
      // All items excluded = nothing selected
      const context = createMockContext({
        selectAllMode: true,
        excludedIds: new Set([1, 2, 3]),
      });
      renderWithContext(context, () => 3);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox).not.toBeChecked();
      // Not indeterminate because excludedIds.size (3) is not < totalCount (3)
      expect(checkbox.indeterminate).toBe(false);
    });

    test('should handle empty state correctly', () => {
      const context = createMockContext({
        selectAllMode: false,
        selectedIds: new Set(),
        excludedIds: new Set(),
      });
      renderWithContext(context, () => 0);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox).not.toBeChecked();
      expect(checkbox.indeterminate).toBe(false);
    });
  });
});

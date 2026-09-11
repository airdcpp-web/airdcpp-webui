import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as React from 'react';

import { SelectionHeaderCell } from '../SelectionHeaderCell';
import TableSelectionContext from '../SelectionContext';
import { TableSelectionContextValue } from '../types';
import { MAX_SELECT_ALL_ITEMS } from '../constants';

afterEach(() => {
  cleanup();
});

const createMockContext = (
  overrides: Partial<TableSelectionContextValue> = {},
): TableSelectionContextValue => ({
  selectedIds: new Set<number>(),
  selectedCount: 0,
  toggleItem: vi.fn(),
  selectItems: vi.fn(),
  clearSelection: vi.fn(),
  isSelected: vi.fn(() => false),
  getCachedItemData: vi.fn(() => undefined),
  getItemDataCache: vi.fn(() => new Map()),
  ...overrides,
});

interface RenderOptions {
  totalCount?: number;
  onSelectAll?: () => void;
  isSelectingAll?: boolean;
}

// Minimal translator: resolves to the supplied default value
const t = ((key: string, options?: string | { defaultValue?: string; count?: number }) => {
  if (typeof options === 'string') {
    return options;
  }
  const defaultValue = options?.defaultValue ?? key;
  return options?.count === undefined
    ? defaultValue
    : defaultValue.replace('{{count}}', String(options.count));
}) as any;

const renderCell = (
  context: TableSelectionContextValue,
  { totalCount = 10, onSelectAll = vi.fn(), isSelectingAll = false }: RenderOptions = {},
) => {
  render(
    <TableSelectionContext.Provider value={context}>
      <SelectionHeaderCell
        totalCountGetter={() => totalCount}
        onSelectAll={onSelectAll}
        isSelectingAll={isSelectingAll}
        t={t}
      />
    </TableSelectionContext.Provider>,
  );
  return { onSelectAll };
};

// Convenience: a selection of n items
const selectionOf = (n: number) =>
  createMockContext({
    selectedIds: new Set(Array.from({ length: n }, (_, i) => i + 1)),
    selectedCount: n,
  });

describe('SelectionHeaderCell', () => {
  describe('checked state', () => {
    test('is unchecked when nothing is selected', () => {
      renderCell(createMockContext(), { totalCount: 10 });
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('is checked when every row is selected', () => {
      renderCell(selectionOf(10), { totalCount: 10 });
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('is unchecked when only some rows are selected', () => {
      renderCell(selectionOf(4), { totalCount: 10 });
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('is unchecked for an empty view', () => {
      renderCell(createMockContext(), { totalCount: 0 });
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('indeterminate state', () => {
    test('is indeterminate when some but not all rows are selected', () => {
      renderCell(selectionOf(4), { totalCount: 10 });
      expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
    });

    test('is not indeterminate when nothing is selected', () => {
      renderCell(createMockContext(), { totalCount: 10 });
      expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(false);
    });

    test('is not indeterminate when everything is selected', () => {
      renderCell(selectionOf(10), { totalCount: 10 });
      expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(false);
    });
  });

  describe(`cap of ${MAX_SELECT_ALL_ITEMS} items`, () => {
    test(`is enabled at exactly ${MAX_SELECT_ALL_ITEMS} rows`, () => {
      renderCell(createMockContext(), { totalCount: MAX_SELECT_ALL_ITEMS });
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test(`is disabled at ${MAX_SELECT_ALL_ITEMS + 1} rows`, () => {
      renderCell(createMockContext(), { totalCount: MAX_SELECT_ALL_ITEMS + 1 });
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    test('explains itself via a tooltip when disabled by the cap', () => {
      renderCell(createMockContext(), { totalCount: MAX_SELECT_ALL_ITEMS + 1 });
      const title = screen.getByRole('checkbox').getAttribute('title');
      expect(title).toBeTruthy();
      expect(title).toContain(String(MAX_SELECT_ALL_ITEMS));
    });

    test('stays enabled above the cap when rows are already selected, so they can be cleared', () => {
      renderCell(selectionOf(3), { totalCount: MAX_SELECT_ALL_ITEMS + 1 });
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('is disabled for an empty view', () => {
      renderCell(createMockContext(), { totalCount: 0 });
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('interaction', () => {
    test('requests select-all when nothing is selected', () => {
      const onSelectAll = vi.fn();
      const context = createMockContext();
      renderCell(context, { totalCount: 10, onSelectAll });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onSelectAll).toHaveBeenCalledTimes(1);
      expect(context.clearSelection).not.toHaveBeenCalled();
    });

    test('clears the selection when rows are already selected', () => {
      const onSelectAll = vi.fn();
      const context = selectionOf(10);
      renderCell(context, { totalCount: 10, onSelectAll });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(context.clearSelection).toHaveBeenCalledTimes(1);
      expect(onSelectAll).not.toHaveBeenCalled();
    });

    test('clears a partial selection rather than extending it', () => {
      const onSelectAll = vi.fn();
      const context = selectionOf(4);
      renderCell(context, { totalCount: 10, onSelectAll });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(context.clearSelection).toHaveBeenCalledTimes(1);
      expect(onSelectAll).not.toHaveBeenCalled();
    });

    test('does nothing when clicked above the cap with nothing selected', () => {
      const onSelectAll = vi.fn();
      const context = createMockContext();
      renderCell(context, { totalCount: MAX_SELECT_ALL_ITEMS + 1, onSelectAll });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onSelectAll).not.toHaveBeenCalled();
      expect(context.clearSelection).not.toHaveBeenCalled();
    });
  });

  describe('while selecting all', () => {
    test('is disabled during the fetch', () => {
      renderCell(createMockContext(), { totalCount: 10, isSelectingAll: true });
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    test('does not fire again while the fetch is in flight', () => {
      const onSelectAll = vi.fn();
      renderCell(createMockContext(), {
        totalCount: 10,
        onSelectAll,
        isSelectingAll: true,
      });

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onSelectAll).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    test('labels the action when nothing is selected', () => {
      renderCell(createMockContext(), { totalCount: 10 });
      expect(screen.getByRole('checkbox')).toHaveAccessibleName('Select all');
    });

    test('labels the action when rows are selected', () => {
      renderCell(selectionOf(10), { totalCount: 10 });
      expect(screen.getByRole('checkbox')).toHaveAccessibleName('Deselect all');
    });
  });
});

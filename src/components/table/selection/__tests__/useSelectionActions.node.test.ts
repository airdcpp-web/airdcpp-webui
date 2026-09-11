import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as React from 'react';

import { useSelectionActions } from '../useSelectionActions';
import { MAX_SELECT_ALL_ITEMS } from '../constants';
import { TableSelectionContextValue } from '../types';
import { SocketContext } from '@/context/SocketContext';
import { APISocket } from '@/services/SocketService';

import NotificationActions from '@/actions/NotificationActions';

vi.mock('@/actions/NotificationActions', () => ({
  default: {
    apiError: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

interface TestItem {
  id: number;
  name: string;
}

const createItems = (count: number): TestItem[] =>
  Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

// Minimal translator: returns the supplied default value
const t = ((_key: string, options?: { defaultValue?: string }) =>
  options?.defaultValue ?? _key) as any;

const createMockSelection = (
  overrides: Partial<TableSelectionContextValue> = {},
  cachedItems: TestItem[] = [],
): TableSelectionContextValue => {
  const itemCache = new Map<number, TestItem>();
  cachedItems.forEach((item) => item && itemCache.set(item.id, item));

  return {
    selectedIds: new Set<number>(),
    selectedCount: 0,
    toggleItem: vi.fn(),
    selectItems: vi.fn(),
    clearSelection: vi.fn(),
    isSelected: vi.fn(() => false),
    getCachedItemData: vi.fn((id: number) =>
      itemCache.get(id),
    ) as TableSelectionContextValue['getCachedItemData'],
    getItemDataCache: vi.fn(
      () => itemCache,
    ) as TableSelectionContextValue['getItemDataCache'],
    ...overrides,
  };
};

const createMockStore = (rowCount: number, items: TestItem[] = []) => ({
  viewUrl: 'search/1',
  rowCount,
  items,
});

const setup = ({
  rowCount = 10,
  storeItems = [],
  cachedItems = [],
  selectionOverrides = {},
  socketGet = vi.fn(async () => [] as TestItem[]),
}: {
  rowCount?: number;
  storeItems?: TestItem[];
  cachedItems?: TestItem[];
  selectionOverrides?: Partial<TableSelectionContextValue>;
  socketGet?: ReturnType<typeof vi.fn>;
} = {}) => {
  const selection = createMockSelection(selectionOverrides, cachedItems);
  const store = createMockStore(rowCount, storeItems);
  const socket = { get: socketGet } as unknown as APISocket;

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(SocketContext.Provider, { value: socket }, children);

  const rendered = renderHook(
    () => useSelectionActions<TestItem>({ selection, store, t }),
    { wrapper },
  );

  return { ...rendered, selection, store, socketGet };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSelectionActions', () => {
  describe('select-all availability', () => {
    test(`allows select-all at exactly ${MAX_SELECT_ALL_ITEMS} rows`, () => {
      const { result } = setup({ rowCount: MAX_SELECT_ALL_ITEMS });
      expect(result.current.canSelectAll()).toBe(true);
    });

    test(`disallows select-all at ${MAX_SELECT_ALL_ITEMS + 1} rows`, () => {
      const { result } = setup({ rowCount: MAX_SELECT_ALL_ITEMS + 1 });
      expect(result.current.canSelectAll()).toBe(false);
    });

    test('disallows select-all for an empty view', () => {
      const { result } = setup({ rowCount: 0 });
      expect(result.current.canSelectAll()).toBe(false);
    });
  });

  describe('selectAll', () => {
    test('selects rows fetched from the API, not the sparse store', async () => {
      // The store holds only a screenful; the server has all 30 rows.
      // This is the bug being fixed: selecting from store.items silently
      // dropped everything outside the loaded window.
      const storeItems = createItems(5);
      const serverItems = createItems(30);
      const socketGet = vi.fn(async () => serverItems);

      const { result, selection, socketGet: get } = setup({
        rowCount: 30,
        storeItems,
        socketGet,
      });

      await act(async () => {
        await result.current.selectAll();
      });

      expect(get).toHaveBeenCalledWith('search/1/items/0/30');
      expect(selection.selectItems).toHaveBeenCalledWith(serverItems);
      expect(selection.selectItems).not.toHaveBeenCalledWith(storeItems);
    });

    test('does nothing when the view exceeds the cap', async () => {
      const { result, selection, socketGet } = setup({
        rowCount: MAX_SELECT_ALL_ITEMS + 1,
      });

      await act(async () => {
        await result.current.selectAll();
      });

      expect(socketGet).not.toHaveBeenCalled();
      expect(selection.selectItems).not.toHaveBeenCalled();
    });

    test('does nothing for an empty view', async () => {
      const { result, selection, socketGet } = setup({ rowCount: 0 });

      await act(async () => {
        await result.current.selectAll();
      });

      expect(socketGet).not.toHaveBeenCalled();
      expect(selection.selectItems).not.toHaveBeenCalled();
    });

    test('leaves the selection untouched and reports the error when the fetch fails', async () => {
      const socketGet = vi.fn(async () => {
        throw new Error('Network down');
      });
      const { result, selection } = setup({ rowCount: 10, socketGet });

      await act(async () => {
        await result.current.selectAll();
      });

      expect(selection.selectItems).not.toHaveBeenCalled();
      expect(selection.clearSelection).not.toHaveBeenCalled();
      expect(NotificationActions.apiError).toHaveBeenCalled();
    });

    test('reports progress while fetching and clears it afterwards', async () => {
      let resolveFetch: (items: TestItem[]) => void = () => {};
      const socketGet = vi.fn(
        () =>
          new Promise<TestItem[]>((resolve) => {
            resolveFetch = resolve;
          }),
      );

      const { result } = setup({ rowCount: 10, socketGet });

      expect(result.current.isSelectingAll).toBe(false);

      let pending: Promise<void>;
      act(() => {
        pending = result.current.selectAll();
      });

      await waitFor(() => expect(result.current.isSelectingAll).toBe(true));

      await act(async () => {
        resolveFetch(createItems(10));
        await pending;
      });

      expect(result.current.isSelectingAll).toBe(false);
    });

    test('clears the progress flag even when the fetch fails', async () => {
      const socketGet = vi.fn(async () => {
        throw new Error('Network down');
      });
      const { result } = setup({ rowCount: 10, socketGet });

      await act(async () => {
        await result.current.selectAll();
      });

      expect(result.current.isSelectingAll).toBe(false);
    });
  });

  describe('selectedItems', () => {
    test('resolves selected ids from the cache', () => {
      const items = createItems(5);
      const { result } = setup({
        cachedItems: items,
        selectionOverrides: { selectedIds: new Set([1, 3, 5]) },
      });

      expect(result.current.selectedItems.map((i) => i.id)).toEqual([1, 3, 5]);
    });

    test('is empty when nothing is selected', () => {
      const { result } = setup({ cachedItems: createItems(5) });
      expect(result.current.selectedItems).toEqual([]);
    });

    test('skips ids that have no cached data', () => {
      const { result } = setup({
        cachedItems: createItems(3),
        selectionOverrides: { selectedIds: new Set([1, 99]) },
      });

      expect(result.current.selectedItems.map((i) => i.id)).toEqual([1]);
    });

    test('resolves items that have left the sparse store', () => {
      // Cache holds items the store no longer has loaded
      const { result } = setup({
        rowCount: 500,
        storeItems: [],
        cachedItems: createItems(3),
        selectionOverrides: { selectedIds: new Set([1, 2, 3]) },
      });

      expect(result.current.selectedItems).toHaveLength(3);
    });
  });

  describe('getTotalCount', () => {
    test('returns the store row count', () => {
      const { result } = setup({ rowCount: 100 });
      expect(result.current.getTotalCount()).toBe(100);
    });

    test('returns 0 when the row count is unknown', () => {
      const selection = createMockSelection();
      const socket = { get: vi.fn() } as unknown as APISocket;
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(SocketContext.Provider, { value: socket }, children);

      const { result } = renderHook(
        () => useSelectionActions<TestItem>({ selection, store: {}, t }),
        { wrapper },
      );

      expect(result.current.getTotalCount()).toBe(0);
    });
  });
});

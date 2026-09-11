import { useCallback, useMemo, useState } from 'react';

import { TableSelectionContextValue } from './types';
import { MAX_SELECT_ALL_ITEMS } from './constants';

import { useSocket } from '@/context/SocketContext';
import NotificationActions from '@/actions/NotificationActions';
import { toI18nKey } from '@/utils/TranslationUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface ViewStore<T> {
  rowCount?: number;
  items?: T[];
  viewUrl?: string;
}

interface UseSelectionActionsOptions<T extends { id: API.IdType }> {
  selection: TableSelectionContextValue;
  store: ViewStore<T>;
  t: UI.TranslateF;
}

interface UseSelectionActionsResult<T> {
  // Selected items, resolved from the selection's item data cache
  selectedItems: T[];
  getTotalCount: () => number;
  // Whether "select all" is offered for the current view size
  canSelectAll: () => boolean;
  // True while the select-all fetch is in flight
  isSelectingAll: boolean;
  // Fetch every row in the view from the API and select them
  selectAll: () => Promise<void>;
}

export const useSelectionActions = <T extends { id: API.IdType }>({
  selection,
  store,
  t,
}: UseSelectionActionsOptions<T>): UseSelectionActionsResult<T> => {
  const socket = useSocket();
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  // Simple getters - no useCallback, so they always read the current store value
  const getTotalCount = () => store.rowCount || 0;
  const canSelectAll = () => {
    const rowCount = getTotalCount();
    return rowCount > 0 && rowCount <= MAX_SELECT_ALL_ITEMS;
  };

  // The view store only holds the rows around the visible range, so the full
  // set has to come from the API - the same endpoint RowDataLoader pages
  // through while scrolling, just requested in one go.
  const selectAll = useCallback(async () => {
    const rowCount = store.rowCount || 0;
    if (rowCount === 0 || rowCount > MAX_SELECT_ALL_ITEMS) {
      return;
    }

    setIsSelectingAll(true);
    try {
      const items = await socket.get<T[]>(`${store.viewUrl}/items/0/${rowCount}`);
      selection.selectItems(items);
    } catch (error) {
      NotificationActions.apiError(
        t(toI18nKey('selectAllFailed', UI.Modules.COMMON), {
          defaultValue: 'Failed to select all items',
        }),
        error as Error,
      );
    } finally {
      setIsSelectingAll(false);
    }
  }, [store.rowCount, store.viewUrl, socket, selection.selectItems, t]);

  // Resolved from the cache, which is populated when checkboxes are clicked and
  // when select-all fetches rows, so selections survive items leaving the store
  const selectedItems = useMemo(() => {
    const itemDataCache = selection.getItemDataCache<T>();
    const result: T[] = [];
    for (const id of selection.selectedIds) {
      const item = itemDataCache.get(id);
      if (item) {
        result.push(item);
      }
    }
    return result;
  }, [selection.selectedIds, selection.getItemDataCache]);

  return {
    selectedItems,
    getTotalCount,
    canSelectAll,
    isSelectingAll,
    selectAll,
  };
};

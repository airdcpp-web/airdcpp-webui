import { useCallback, useMemo, useState } from 'react';
import { BulkSelectionData, TableSelectionContextValue } from './types';

import * as API from '@/types/api';

interface ViewStore<T> {
  rowCount?: number;
  items?: T[];
}

interface UseSelectionActionsOptions<T extends { id: API.IdType }> {
  selection: TableSelectionContextValue;
  store: ViewStore<T>;
}

interface UseSelectionActionsResult<T> {
  showBulkDownload: boolean;
  // Selected items - uses selection context's cache for individual selections
  // and store items for select-all mode
  selectedItems: T[];
  // Get selection data for passing to backend bulk API
  // This is the preferred way to handle bulk operations
  getSelectionData: () => BulkSelectionData;
  getTotalCount: () => number;
  handleBulkDownload: () => void;
  handleBulkDownloadClose: () => void;
  // Handler for bulk action menu clicks - intercepts download actions to open dialog
  // Returns true to prevent default action execution
  handleBulkActionClick: (actionId: string) => boolean;
}

export const useSelectionActions = <T extends { id: API.IdType }>({
  selection,
  store,
}: UseSelectionActionsOptions<T>): UseSelectionActionsResult<T> => {
  const [showBulkDownload, setShowBulkDownload] = useState(false);

  // Get total count from store for select-all
  const getTotalCount = useCallback(() => {
    return store.rowCount || 0;
  }, [store]);

  // Get selection data for backend API calls
  // This returns IDs that can be passed to the backend for entity resolution
  const getSelectionData = useCallback((): BulkSelectionData => {
    const totalCount = store.rowCount || 0;

    if (selection.selectAllMode) {
      return {
        mode: 'select_all',
        selectedIds: [],
        excludedIds: Array.from(selection.excludedIds),
        totalCount,
      };
    }

    return {
      mode: 'explicit',
      selectedIds: Array.from(selection.selectedIds),
      excludedIds: [],
      totalCount,
    };
  }, [selection.selectAllMode, selection.selectedIds, selection.excludedIds, store.rowCount]);

  // Get selected items using the selection context's cache
  // The cache is populated when checkboxes are clicked (at selection time),
  // so it persists even when items leave the sparse store
  const selectedItems = useMemo(() => {
    const items = store.items || [];

    if (selection.selectAllMode) {
      // In select-all mode, return all loaded items except excluded ones
      // (can't use cache here since we don't know which items to include)
      return items.filter((item: T) => item && !selection.excludedIds.has(item.id));
    }

    // Normal mode: Get items from the selection context's cache
    // This cache is populated at checkbox click time, so items persist
    // even when they leave the sparse store
    const itemDataCache = selection.getItemDataCache<T>();
    const result: T[] = [];
    for (const id of selection.selectedIds) {
      const item = itemDataCache.get(id);
      if (item) {
        result.push(item);
      }
    }
    return result;
  }, [store.items, selection.selectAllMode, selection.excludedIds, selection.selectedIds, selection.getItemDataCache]);

  const handleBulkDownload = useCallback(() => {
    setShowBulkDownload(true);
  }, []);

  const handleBulkDownloadClose = useCallback(() => {
    setShowBulkDownload(false);
    // Note: Selection is cleared inside BulkDownloadDialog after successful download
    // Don't clear here to avoid issues when dialog is cancelled or closed early
  }, []);

  // Handler for bulk action menu clicks - intercepts download actions to open dialog
  const handleBulkActionClick = useCallback(
    (actionId: string) => {
      if (actionId === 'download' || actionId === 'downloadTo') {
        setShowBulkDownload(true);
        return true; // Prevent default handler
      }
      return false;
    },
    [],
  );

  return {
    showBulkDownload,
    selectedItems,
    getSelectionData,
    getTotalCount,
    handleBulkDownload,
    handleBulkDownloadClose,
    handleBulkActionClick,
  };
};

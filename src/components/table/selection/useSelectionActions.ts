import { useCallback, useMemo, useState } from 'react';
import { TableSelectionContextValue } from './types';

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
  selectedItems: T[];
  getTotalCount: () => number;
  handleBulkDownload: () => void;
  handleBulkDownloadClose: () => void;
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

  // Memoize selected items directly to avoid unstable function reference
  const selectedItems = useMemo(() => {
    const items = store.items || [];
    if (selection.selectAllMode) {
      // In select-all mode, return all loaded items except excluded ones
      return items.filter((item: T) => item && !selection.excludedIds.has(item.id));
    }
    return items.filter((item: T) => item && selection.selectedIds.has(item.id));
  }, [store, selection.selectAllMode, selection.excludedIds, selection.selectedIds]);

  const handleBulkDownload = useCallback(() => {
    setShowBulkDownload(true);
  }, []);

  const handleBulkDownloadClose = useCallback(() => {
    setShowBulkDownload(false);
    selection.clearSelection();
  }, [selection]);

  return {
    showBulkDownload,
    selectedItems,
    getTotalCount,
    handleBulkDownload,
    handleBulkDownloadClose,
  };
};

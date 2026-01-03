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
  // Selected items that are currently loaded in the view store
  // NOTE: In large datasets, this may not include all selected items!
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

  // Memoize selected items directly to avoid unstable function reference
  // NOTE: This only returns items that are currently loaded in the sparse view store!
  // For large datasets, use getSelectionData() and let the backend resolve entities
  const selectedItems = useMemo(() => {
    const items = store.items || [];
    if (selection.selectAllMode) {
      // In select-all mode, return all loaded items except excluded ones
      return items.filter((item: T) => item && !selection.excludedIds.has(item.id));
    }
    return items.filter((item: T) => item && selection.selectedIds.has(item.id));
  }, [store.items, selection.selectAllMode, selection.excludedIds, selection.selectedIds]);

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

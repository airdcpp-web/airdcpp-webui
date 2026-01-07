import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import * as API from '@/types/api';
import { TableSelectionContextValue, SelectableItem } from './types';

export interface UseTableSelectionOptions {
  // Clear selection when these values change
  entityId?: API.IdType;
  viewId?: API.IdType | string;
}

export const useTableSelection = (
  options: UseTableSelectionOptions = {}
): TableSelectionContextValue => {
  const { entityId, viewId } = options;
  const [selectedIds, setSelectedIds] = useState<Set<API.IdType>>(new Set());
  // When true, all items are selected except those in excludedIds
  const [selectAllMode, setSelectAllModeState] = useState(false);
  // Items explicitly deselected while in select-all mode
  const [excludedIds, setExcludedIds] = useState<Set<API.IdType>>(new Set());
  // Track total count for calculating selected count in select-all mode
  const [totalCount, setTotalCount] = useState(0);
  // Cache of item data - persists item data even when items leave sparse store
  const itemDataCache = useRef<Map<API.IdType, SelectableItem>>(new Map());

  // Clear selection when entity or view changes
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectAllModeState(false);
    setExcludedIds(new Set());
    setTotalCount(0);
    itemDataCache.current.clear();
  }, [entityId, viewId]);

  const toggleItem = useCallback((id: API.IdType, itemData?: SelectableItem) => {
    if (selectAllMode) {
      // In select-all mode, toggling an item adds/removes it from excluded list
      setExcludedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          // Re-adding to selection - cache the item data if provided
          if (itemData) {
            itemDataCache.current.set(id, itemData);
          }
        } else {
          next.add(id);
          // Removing from selection - remove from cache
          itemDataCache.current.delete(id);
        }
        return next;
      });
    } else {
      // Normal mode: toggle in selectedIds
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          // Removing from selection - remove from cache
          itemDataCache.current.delete(id);
        } else {
          next.add(id);
          // Adding to selection - cache the item data if provided
          if (itemData) {
            itemDataCache.current.set(id, itemData);
          }
        }
        return next;
      });
    }
  }, [selectAllMode]);

  const setSelectAllMode = useCallback((enabled: boolean, newTotalCount: number) => {
    setTotalCount(newTotalCount);
    if (enabled) {
      // Enter select-all mode
      setSelectAllModeState(true);
      setExcludedIds(new Set());
      setSelectedIds(new Set());
      // Clear cache - in select-all mode we use store items directly
      itemDataCache.current.clear();
    } else {
      // Exit select-all mode (clear all)
      setSelectAllModeState(false);
      setExcludedIds(new Set());
      setSelectedIds(new Set());
      itemDataCache.current.clear();
    }
  }, []);

  const selectItems = useCallback((ids: API.IdType[]) => {
    setSelectAllModeState(false);
    setExcludedIds(new Set());
    setSelectedIds(new Set(ids));
    // Clear cache - these IDs don't have item data
    itemDataCache.current.clear();
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectAllModeState(false);
    setExcludedIds(new Set());
    itemDataCache.current.clear();
  }, []);

  // Get cached item data by ID
  const getCachedItemData = useCallback(<T extends SelectableItem>(id: API.IdType): T | undefined => {
    return itemDataCache.current.get(id) as T | undefined;
  }, []);

  // Get the entire item data cache
  const getItemDataCache = useCallback(<T extends SelectableItem>(): Map<API.IdType, T> => {
    return itemDataCache.current as Map<API.IdType, T>;
  }, []);

  const isSelected = useCallback(
    (id: API.IdType) => {
      if (selectAllMode) {
        // In select-all mode, item is selected unless explicitly excluded
        return !excludedIds.has(id);
      }
      return selectedIds.has(id);
    },
    [selectAllMode, excludedIds, selectedIds]
  );

  // Calculate selected count based on mode
  const selectedCount = useMemo(() => {
    if (selectAllMode) {
      return Math.max(0, totalCount - excludedIds.size);
    }
    return selectedIds.size;
  }, [selectAllMode, totalCount, excludedIds.size, selectedIds.size]);

  return useMemo(
    () => ({
      selectedIds,
      selectedCount,
      selectAllMode,
      excludedIds,
      toggleItem,
      setSelectAllMode,
      selectItems,
      clearSelection,
      isSelected,
      getCachedItemData,
      getItemDataCache,
    }),
    [
      selectedIds,
      selectedCount,
      selectAllMode,
      excludedIds,
      toggleItem,
      setSelectAllMode,
      selectItems,
      clearSelection,
      isSelected,
      getCachedItemData,
      getItemDataCache,
    ]
  );
};

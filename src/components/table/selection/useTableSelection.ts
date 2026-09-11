import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import * as API from '@/types/api';
import { TableSelectionContextValue, SelectableItem } from './types';

export interface UseTableSelectionOptions {
  // Clear selection when these values change
  entityId?: API.IdType;
  viewId?: API.IdType | string;
}

export const useTableSelection = (
  options: UseTableSelectionOptions = {},
): TableSelectionContextValue => {
  const { entityId, viewId } = options;
  const [selectedIds, setSelectedIds] = useState<Set<API.IdType>>(new Set());
  // Cache of item data - persists item data even when items leave sparse store
  const itemDataCache = useRef<Map<API.IdType, SelectableItem>>(new Map());

  // Clear selection when entity or view changes
  useEffect(() => {
    setSelectedIds(new Set());
    itemDataCache.current.clear();
  }, [entityId, viewId]);

  const toggleItem = useCallback((id: API.IdType, itemData?: SelectableItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        itemDataCache.current.delete(id);
      } else {
        next.add(id);
        if (itemData) {
          itemDataCache.current.set(id, itemData);
        }
      }
      return next;
    });
  }, []);

  // Replace the selection with the supplied items, caching their data so that
  // it survives the items leaving the sparse view store
  const selectItems = useCallback((items: SelectableItem[]) => {
    itemDataCache.current.clear();
    items.forEach((item) => {
      if (item) {
        itemDataCache.current.set(item.id, item);
      }
    });
    setSelectedIds(new Set(items.filter((item) => !!item).map((item) => item.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    itemDataCache.current.clear();
  }, []);

  const getCachedItemData = useCallback(
    <T extends SelectableItem>(id: API.IdType): T | undefined => {
      return itemDataCache.current.get(id) as T | undefined;
    },
    [],
  );

  const getItemDataCache = useCallback(<T extends SelectableItem>(): Map<
    API.IdType,
    T
  > => {
    return itemDataCache.current as Map<API.IdType, T>;
  }, []);

  const isSelected = useCallback((id: API.IdType) => selectedIds.has(id), [selectedIds]);

  return useMemo(
    () => ({
      selectedIds,
      selectedCount: selectedIds.size,
      toggleItem,
      selectItems,
      clearSelection,
      isSelected,
      getCachedItemData,
      getItemDataCache,
    }),
    [
      selectedIds,
      toggleItem,
      selectItems,
      clearSelection,
      isSelected,
      getCachedItemData,
      getItemDataCache,
    ],
  );
};

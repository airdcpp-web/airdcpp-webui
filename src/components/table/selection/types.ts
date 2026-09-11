import * as API from '@/types/api';

export interface TableSelectionState {
  selectedIds: Set<API.IdType>;
  selectedCount: number;
}

export interface TableSelectionActions {
  // Toggle item selection; optionally provide item data for caching
  toggleItem: (id: API.IdType, itemData?: SelectableItem) => void;
  clearSelection: () => void;
  isSelected: (id: API.IdType) => boolean;
  // Replace the selection with these items, caching their data
  selectItems: (items: SelectableItem[]) => void;
  // Get cached item data (useful when items leave sparse store)
  getCachedItemData: <T extends SelectableItem>(id: API.IdType) => T | undefined;
  // Get all cached item data
  getItemDataCache: <T extends SelectableItem>() => Map<API.IdType, T>;
}

export type TableSelectionContextValue = TableSelectionState & TableSelectionActions;

export interface SelectableItem {
  id: API.IdType;
  name?: string;
}

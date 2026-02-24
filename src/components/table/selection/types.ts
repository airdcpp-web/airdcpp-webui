import * as API from '@/types/api';

export interface TableSelectionState {
  selectedIds: Set<API.IdType>;
  selectedCount: number;
  // When true, all items are selected except those in excludedIds
  selectAllMode: boolean;
  // Items explicitly deselected while in select-all mode
  excludedIds: Set<API.IdType>;
}

export interface TableSelectionActions {
  // Toggle item selection; optionally provide item data for caching
  toggleItem: (id: API.IdType, itemData?: SelectableItem) => void;
  // Toggle select-all mode on/off
  setSelectAllMode: (enabled: boolean, totalCount: number) => void;
  clearSelection: () => void;
  isSelected: (id: API.IdType) => boolean;
  selectItems: (ids: API.IdType[]) => void;
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

// Data structure for passing selection to bulk operations
// This allows the backend to resolve entities instead of the frontend
export interface BulkSelectionData {
  // Selection mode
  mode: 'explicit' | 'select_all';
  // For explicit mode: the selected IDs
  selectedIds: API.IdType[];
  // For select_all mode: the excluded IDs
  excludedIds: API.IdType[];
  // Total count (for select_all mode calculations)
  totalCount: number;
}

// Result from bulk download API
export interface BulkDownloadResult {
  succeeded: Array<{
    id?: API.IdType;
    tth?: string;
    name: string;
    bundle_info?: object;
    directory_download?: object;
  }>;
  failed: Array<{
    id?: API.IdType;
    tth?: string;
    name: string;
    error: string;
  }>;
}

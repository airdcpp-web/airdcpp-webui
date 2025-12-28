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
  toggleItem: (id: API.IdType) => void;
  // Toggle select-all mode on/off
  setSelectAllMode: (enabled: boolean, totalCount: number) => void;
  clearSelection: () => void;
  isSelected: (id: API.IdType) => boolean;
  selectItems: (ids: API.IdType[]) => void;
}

export type TableSelectionContextValue = TableSelectionState & TableSelectionActions;

export interface SelectableItem {
  id: API.IdType;
  name?: string;
}

import { IdType } from './common';

export enum FilterMethod {
  PARTIAL = 0, /// case-insensitive pattern matching (multiple patterns separated with spaces)
  REGEX = 1, /// regular expression
  WILDCARD = 2,
  EXACT = 3, /// case-sensitive, character-for-character equality
}

/*export const FilterMethod = {
  PARTIAL: 0, /// case-insensitive pattern matching (multiple patterns separated with spaces)
  REGEX: 1, /// regular expression
  WILDCARD: 2,
  EXACT: 3, /// case-sensitive, character-for-character equality
};*/

export interface TableFilter {
  method: FilterMethod;
  property: string;
  pattern: string | number;
}

export type TableItemUpdateData<DataT> = {
  id: IdType;
  properties: Partial<DataT>;
};

export type TableUpdateData<DataT> = {
  items: TableItemUpdateData<DataT>[];
  range_start: number;
  total_items: number;
  matching_items: number;
};

export interface TableSettingRequest {
  range_start: number;
  max_count: number;
  sort_property: string;
  sort_ascending: boolean;
  paused: boolean;
  source_filter: TableFilter;
}

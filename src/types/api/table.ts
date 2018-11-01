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


export type TableItem = {
  id: IdType;
  properties: object;
};

export type TableData = {
  items: TableItem[];
  range_start: number;
  total_items: number;
  matching_items: number;
};
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
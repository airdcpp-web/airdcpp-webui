export const enum UrgencyEnum {
  HIGHEST = 6,
  HIGH = 5,
  NORMAL = 3,
  LOW = 1,
  STATUS = 0,
  
  ERROR = 6,
  WARNING = 4,
  INFO = 1,
}

export interface UrgencyCountMap {
  [key: number]: number;
}

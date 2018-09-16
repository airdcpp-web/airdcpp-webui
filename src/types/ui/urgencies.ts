export const enum UrgencyEnum {
  HIGH = 5,
  MEDIUM = 3,
  LOW = 2,
  INFO = 1,
  STATUS = 0,
}

export interface UrgencyCountMap {
  [key: number]: number;
}

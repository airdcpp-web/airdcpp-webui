import * as API from 'types/api';

export const enum UrgencyEnum {
  HIGHEST = 7,
  HIGH = 6,
  NORMAL = 4,
  LOW = 2,
  STATUS = 1,

  ERROR = 7,
  WARNING = 5,
  INFO = 2,
  VERBOSE = 0,
}

export interface UrgencyCountMap {
  [key: number]: number;
}

export type ChatMessageUrcencies = Record<keyof API.UnreadChatMessageCounts, UrgencyEnum>;
export type StatusMessageUrcencies = Record<
  keyof API.UnreadStatusMessageCounts,
  UrgencyEnum
>;

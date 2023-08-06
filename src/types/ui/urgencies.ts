import * as API from 'types/api';

export const enum UrgencyEnum {
  HIGHEST = 6,
  HIGH = 4,
  NORMAL = 3,
  LOW = 1,
  HIDDEN = 0, // 0 = hidden

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  ERROR = 6,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  WARNING = 4,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  INFO = 1,
  // VERBOSE = 0, // 0 = hidden
}

export interface UrgencyCountMap {
  [key: number]: number;
}

export type ChatMessageUrcencies = Record<keyof API.UnreadChatMessageCounts, UrgencyEnum>;
export type StatusMessageUrcencies = Record<
  keyof API.UnreadStatusMessageCounts,
  UrgencyEnum
>;

export interface UnreadInfoStore {
  getTotalUrgencies: () => UrgencyCountMap | null;
  isInitialized: () => boolean;
}

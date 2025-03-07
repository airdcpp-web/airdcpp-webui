import * as API from '@/types/api';
import { SessionType } from './sessions';

export const enum UrgencyEnum {
  HIGHEST = 6,
  HIGH = 4,
  NORMAL = 3,
  LOW = 1,
  HIDDEN = 0, // 0 = hidden

  ERROR = 7,
  WARNING = 5,
  INFO = 2,
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

export type SessionUrgencyCountMapper<SessionT extends SessionType> = (
  session: SessionT,
) => ChatMessageUrcencies | StatusMessageUrcencies;

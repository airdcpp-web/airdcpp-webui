import {
  SeverityEnum,
  UnreadChatMessageCounts,
  UnreadStatusMessageCounts,
} from 'types/api';
import { UrgencyEnum } from 'types/ui';

type ChatMessageUrcencies = Record<keyof UnreadChatMessageCounts, UrgencyEnum>;
type StatusMessageUrcencies = Record<keyof UnreadStatusMessageCounts, UrgencyEnum>;

export const HubMessageUrgencies: ChatMessageUrcencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.NORMAL,
  mention: UrgencyEnum.HIGHEST,
};

export const HubMessageNotifyUrgencies: ChatMessageUrcencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.HIGH,
  mention: UrgencyEnum.HIGHEST,
};

export const PrivateMessageUrgencies: ChatMessageUrcencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.HIGHEST,
  mention: UrgencyEnum.HIGHEST,
};

export const ChatroomUrgencies: ChatMessageUrcencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.HIGH,
  mention: UrgencyEnum.HIGHEST,
};

export const SimpleSessionUnreadUrgency = UrgencyEnum.HIGHEST;

export const LogMessageUrgencies: StatusMessageUrcencies = {
  [SeverityEnum.INFO]: UrgencyEnum.INFO,
  [SeverityEnum.WARNING]: UrgencyEnum.WARNING,
  [SeverityEnum.ERROR]: UrgencyEnum.ERROR,
  [SeverityEnum.VERBOSE]: UrgencyEnum.VERBOSE,
};

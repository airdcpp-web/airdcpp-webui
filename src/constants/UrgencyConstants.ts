import { SeverityEnum } from 'types/api';
import { UrgencyEnum } from 'types/ui';

export const HubMessageUrgencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.NORMAL,
  mention: UrgencyEnum.HIGHEST,
};

export const HubMessageNotifyUrgencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.HIGH,
  mention: UrgencyEnum.HIGHEST,
};

export const PrivateMessageUrgencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.HIGHEST,
  mention: UrgencyEnum.HIGHEST,
};

export const ChatroomUrgencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.LOW,
  user: UrgencyEnum.HIGH,
  mention: UrgencyEnum.HIGHEST,
};

export const SimpleSessionUnreadUrgency = UrgencyEnum.HIGHEST;

export const LogMessageUrgencies = {
  [SeverityEnum.INFO]: UrgencyEnum.INFO,
  [SeverityEnum.WARNING]: UrgencyEnum.WARNING,
  [SeverityEnum.ERROR]: UrgencyEnum.ERROR,
};

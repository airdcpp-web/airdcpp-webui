import { SeverityEnum } from 'types/api';
import { UrgencyEnum } from 'types/ui';

export const HubMessageUrgencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.INFO,
  user: UrgencyEnum.LOW,
};

export const PrivateMessageUrgencies = {
  status: UrgencyEnum.STATUS,
  bot: UrgencyEnum.INFO,
  user: UrgencyEnum.HIGH,
};

export const LogMessageUrgencies = {
  [SeverityEnum.INFO]: UrgencyEnum.INFO,
  [SeverityEnum.WARNING]: UrgencyEnum.MEDIUM,
  [SeverityEnum.ERROR]: UrgencyEnum.HIGH,
};

import * as API from 'types/api';
import * as UI from 'types/ui';

export const HubMessageUrgencies: UI.ChatMessageUrcencies = {
  status: UI.UrgencyEnum.HIDDEN,
  verbose: UI.UrgencyEnum.HIDDEN,
  bot: UI.UrgencyEnum.LOW,
  user: UI.UrgencyEnum.NORMAL,
  mention: UI.UrgencyEnum.HIGHEST,
};

export const HubMessageNotifyUrgencies: UI.ChatMessageUrcencies = {
  status: UI.UrgencyEnum.HIDDEN,
  verbose: UI.UrgencyEnum.HIDDEN,
  bot: UI.UrgencyEnum.LOW,
  user: UI.UrgencyEnum.HIGH,
  mention: UI.UrgencyEnum.HIGHEST,
};

export const PrivateMessageUrgencies: UI.ChatMessageUrcencies = {
  status: UI.UrgencyEnum.HIDDEN,
  verbose: UI.UrgencyEnum.HIDDEN,
  bot: UI.UrgencyEnum.LOW,
  user: UI.UrgencyEnum.HIGHEST,
  mention: UI.UrgencyEnum.HIGHEST,
};

export const ChatroomUrgencies: UI.ChatMessageUrcencies = {
  status: UI.UrgencyEnum.HIDDEN,
  verbose: UI.UrgencyEnum.HIDDEN,
  bot: UI.UrgencyEnum.LOW,
  user: UI.UrgencyEnum.HIGH,
  mention: UI.UrgencyEnum.HIGHEST,
};

export const SimpleSessionUnreadUrgency = UI.UrgencyEnum.HIGHEST;

export const LogMessageUrgencies: UI.StatusMessageUrcencies = {
  [API.SeverityEnum.INFO]: UI.UrgencyEnum.INFO,
  [API.SeverityEnum.WARNING]: UI.UrgencyEnum.WARNING,
  [API.SeverityEnum.ERROR]: UI.UrgencyEnum.ERROR,
  [API.SeverityEnum.VERBOSE]: UI.UrgencyEnum.HIDDEN,
};

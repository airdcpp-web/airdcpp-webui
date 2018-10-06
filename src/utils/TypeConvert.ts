import * as API from 'types/api';
import * as UI from 'types/ui';


export const dupeToStringType = (dupeInfo: API.Dupe) => {
  if (!dupeInfo) {
    return '';
  }

  return 'dupe ' + dupeInfo.id.replace('_', ' ');
};

export const userOnlineStatusToColor = (flags: Array<API.UserFlag | API.HubUserFlag>) => {
  if (flags.indexOf('bot') !== -1) {
    return 'blue';
  }

  if (flags.indexOf('offline') !== -1) {
    return 'lightgrey';
  }

  if (flags.indexOf('away') !== -1) {
    return 'yellow';
  }

  return 'green';
};

export const hubOnlineStatusToColor = (connectState: API.HubConnectStateEnum) => {
  if (connectState === API.HubConnectStateEnum.CONNECTED) {
    return 'green';
  }

  if (connectState === API.HubConnectStateEnum.CONNECTING) {
    return 'yellow';
  }
  
  return 'lightgrey';
};

export const urgencyToColor = (urgency: number) => {
  switch (urgency) {
    case UI.UrgencyEnum.HIGH: return 'red';
    case UI.UrgencyEnum.MEDIUM: return 'yellow';
    case UI.UrgencyEnum.LOW: return 'blue';
    case UI.UrgencyEnum.INFO: return 'grey';
    default: return '';
  }
};

export const toErrorResponse = (errorCode: number, message: string) => ({
  code: errorCode,
  message,
  json: {
    message,
  }
});

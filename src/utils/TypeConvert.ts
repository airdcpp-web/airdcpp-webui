import { UrgencyEnum } from 'constants/UrgencyConstants';

import * as API from 'types/api';


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
  if (connectState === 'connected') {
    return 'green';
  }

  if (connectState === 'connecting') {
    return 'yellow';
  }
  
  return 'lightgrey';
};

export const urgencyToColor = (urgency: number) => {
  switch (urgency) {
    case UrgencyEnum.HIGH: return 'red';
    case UrgencyEnum.MEDIUM: return 'yellow';
    case UrgencyEnum.LOW: return 'blue';
    case UrgencyEnum.INFO: return 'grey';
    default: return '';
  }
};

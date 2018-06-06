import { UrgencyEnum } from 'constants/UrgencyConstants';

export const dupeToStringType = (dupeInfo) => {
  if (!dupeInfo) {
    return '';
  }

  return 'dupe ' + dupeInfo.id.replace('_', ' ');
};

export const userOnlineStatusToColor = (flags) => {
  if (flags.indexOf('bot') != -1) {
    return 'blue';
  }

  if (flags.indexOf('offline') != -1) {
    return 'lightgrey';
  }

  if (flags.indexOf('away') != -1) {
    return 'yellow';
  }

  return 'green';
};

export const hubOnlineStatusToColor = (connectState) => {
  if (connectState === 'connected') {
    return 'green';
  }

  if (connectState === 'connecting') {
    return 'yellow';
  }
  
  return 'lightgrey';
};

export const urgencyToColor = (urgencyMap) => {
  switch (urgencyMap) {
  case UrgencyEnum.HIGH: return 'red';
  case UrgencyEnum.MEDIUM: return 'yellow';
  case UrgencyEnum.LOW: return 'blue';
  case UrgencyEnum.INFO: return 'grey';
  default: return '';
  }
};

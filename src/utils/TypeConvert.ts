import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse, FieldError } from 'airdcpp-apisocket';
import { DataFetchError } from 'decorators/DataProviderDecorator';


export const dupeToStringType = (dupeInfo: API.Dupe | null) => {
  if (!dupeInfo) {
    return '';
  }

  return `dupe ${dupeInfo.id.replace('_', ' ')}`;
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
    case UI.UrgencyEnum.ERROR:
    case UI.UrgencyEnum.HIGHEST: return 'red';
    case UI.UrgencyEnum.HIGH: return 'purple';
    case UI.UrgencyEnum.WARNING: return 'yellow';
    case UI.UrgencyEnum.NORMAL: return 'blue';
    case UI.UrgencyEnum.INFO:
    case UI.UrgencyEnum.LOW: return 'grey';
    default: return '';
  }
};

export const toErrorResponse = (errorCode: number, message: string): ErrorResponse => ({
  code: errorCode,
  message,
  json: {
    message,
  }
});

export const errorResponseToString = (error: DataFetchError): string => {
  let message = error.message;
  if (error.code) {
    message += ` (code ${error.code})`;
  }

  if (error.json && (error.json as FieldError).field) {
    message += ` (field ${(error.json as FieldError).field})`;
  }

  return message;
};

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';
import { ErrorResponse } from 'airdcpp-apisocket';


export const toCorsSafeUrl = (url: string) => {
  const proxyUrl = LocalSettingStore.getValue(LocalSettings.CORS_PROXY);
  return !!proxyUrl ? proxyUrl + url : url;
};

export const formatHttpError = (error: JQuery.jqXHR) => {
  return error.status === 0 ? 'Network/client error' : error.statusText;
};


export const toApiError = (error: JQuery.jqXHR): ErrorResponse => {
  const message = formatHttpError(error);
  return {
    code: error.status,
    message,
    json: {
      message,
    }
  };
};

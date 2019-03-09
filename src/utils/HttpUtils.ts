import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';
import { ErrorResponse } from 'airdcpp-apisocket';
import i18next from 'i18next';

import * as UI from 'types/ui';
import { translate } from './TranslationUtils';


export const toCorsSafeUrl = (url: string) => {
  const proxyUrl = LocalSettingStore.getValue(LocalSettings.CORS_PROXY);
  return !!proxyUrl ? proxyUrl + url : url;
};

export const formatHttpError = (error: JQuery.jqXHR, t: i18next.TFunction) => {
  return error.status === 0 ? translate('Network/client error', t, UI.Modules.COMMON) : error.statusText;
};


export const toApiError = (error: JQuery.jqXHR, t: i18next.TFunction): ErrorResponse => {
  const message = formatHttpError(error, t);
  return {
    code: error.status,
    message,
    json: {
      message,
    }
  };
};

export const fetchData = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`${res.statusText} (code ${res.status})`);
  }

  return res;
};

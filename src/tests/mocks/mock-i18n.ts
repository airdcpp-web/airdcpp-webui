import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { i18nOptions } from '@/services/LocalizationService';
import translations from '../../../resources/locales/en/webui.main.json';

export const getMockI18n = () => {
  i18n.use(initReactI18next).init({
    lng: 'en',
    debug: false,
    resources: { en: translations },
    ...i18nOptions,
  });

  return i18n;
};

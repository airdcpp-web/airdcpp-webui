import i18n from 'i18next';
import XHR, { RequestCallback } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import Moment from 'moment';

import { fetchData } from 'utils/HttpUtils';

const loadLocalFile = (callback: RequestCallback, url: string) => {
  const fullUrl = `/js/locales/${url}`;

  // Attempt to download local plain JSON
  // Useful for testing custom translation files, such as unpublished translations from Transifex
  fetchData(fullUrl)
    .then(async (response) => {
      let json;

      try {
        json = await response.json();
      } catch (e) {
        callback(`Failed to parse custom translation file as JSON ${fullUrl}`, e);
        return;
      }

      console.log(`Custom translation file ${fullUrl} was loaded successfully`);
      callback(null, {
        data: json,
        status: 200,
      });
    })
    .catch((fetchError) => {
      callback(
        `Failed to download translation resource ${fullUrl} (fallback)`,
        fetchError
      );
    });
};

const loadLocales: XHR['options']['request'] = async (options, url, data, callback) => {
  if (!!data) {
    // Post missing translations (can't be handled by webpack)
    try {
      const res = await fetchData(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: Object.keys(data)
          .map((key) => {
            return (
              encodeURIComponent(key) +
              '=' +
              encodeURIComponent((data as Record<string, string>)[key])
            );
          })
          .join('&'),
      });

      const responseData = await res.json();
      callback(null, {
        status: 200,
        data: responseData,
      });
    } catch (e) {
      callback(`Failed to post translation`, e);
    }
  }

  // Load localization file
  try {
    const { default: locale } = await import(
      /* webpackChunkName: "/locales/[request]" */ `../../resources/locales/${url}`
    );

    callback(null, {
      status: 200,
      data: locale,
    });
  } catch (e) {
    console.warn(
      'Default translation file was not found, attempting to load a custom file',
      e
    );
    loadLocalFile(callback, url);
    return;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // if not using I18nextProvider
  .use(XHR)
  .init(
    {
      backend: {
        loadPath: '{{lng}}/webui.{{ns}}.json',
        parse: (data: any) => data,
        request: loadLocales,
      },
      ns: ['main'],
      fallbackLng: 'en',
      debug: true,
      load: 'languageOnly',
      defaultNS: 'main',
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      saveMissing: process.env.NODE_ENV !== 'production',

      // react i18next special options (optional)
      react: {
        useSuspense: true,
        nsMode: 'default',
      },
    },
    undefined
  )
  .then(() => {
    Moment.locale(i18n.language);
  });

i18n.on('languageChanged', (lng) => {
  Moment.locale(lng);
});

export { i18n };

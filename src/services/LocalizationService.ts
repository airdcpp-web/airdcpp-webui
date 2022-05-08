import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import Moment from 'moment';

import { getFilePath } from 'utils/FileUtils';
import { fetchData } from 'utils/HttpUtils';


const loadLocales: XHR['options']['ajax'] = (url, options, callback: any, data) => {
  if (!!data) {
    // Post missing translations (can't be handled by webpack)
    fetchData(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: Object.keys(data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&')
    })
      .then(res => {
        callback(res);
      })
      .catch(e => {
        callback(null, e);
      });

    return;
  }

  // Load localization file
  let waitForLocale;
  try {
    waitForLocale = require(`../../resources/locales/${url}`);
  } catch (e) {
    callback(null, { status: 404 });
    return;
  }

  waitForLocale(
    (locale: string) => {
      callback(locale, { status: 200 });
    },
    (e: any) => {
      console.warn(`Failed to load resource ${url} (webpack)`, e);

      const fullUrl = e.request;
      if (!fullUrl) {
        console.error(`Can't execute translation resource loading fallback for ${url} (request URL missing)`, e);
        callback(null, { status: 404 });
        return;
      }

      // Attempt to download local plain JSON 
      // Useful for testing custom translation files, such as unpublished translations from Transifex
      const baseUrl = getFilePath(fullUrl);
      fetchData(
        baseUrl + url
      )
        .then(async (response) => {
          let json;

          try {
            json = await response.json();
          } catch (e) {
            console.error(`Failed to parse custom translation file as JSON ${url}`, e);
            callback(null, { status: 404 });
            return;
          }

          console.log(`Custom translation file ${url} was loaded successfully`);
          callback(json, { status: 200 });
        })
        .catch(fetchError => {
          console.error(`Failed to download translation resource ${url} (fallback)`, fetchError);
          callback(null, fetchError);
        });
    }
  );
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
        ajax: loadLocales
      },
      //resources,
      ns: [ 'main' ],
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
      }
    }, 
    undefined
  )
  .then(() => {
    Moment.locale(i18n.language);
  });

i18n.on('languageChanged', lng => {
  Moment.locale(lng);
});

export { i18n };

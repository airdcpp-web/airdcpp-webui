import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

//import * as resources from '../../resources/locales';
//import { camelCase } from 'lodash';
import Moment from 'moment';

//@ts-ignore
import ajax from 'i18next-xhr-backend/dist/commonjs/ajax'; // don't use es because of jest
import { getFilePath } from 'utils/FileUtils';
​

const loadLocales: XHR['options']['ajax'] = (url, options, callback: any, data) => {
  if (!!data) {
    // Post missing translations (can't be handled by webpack)
    ajax(url, options, callback, data);
    return;
  }

  const waitForLocale = require(`../../resources/locales/${url}`);
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

      // Attempt to local plain JSON 
      // Useful for testing custom translation files, such as unpublished translations from Transifex
      const baseUrl = getFilePath(fullUrl);
      ajax(
        baseUrl + url, 
        options, 
        (responseData: any, res: any) => {
          let json;

          const success = res.status >= 200 && res.status <= 299;
          if (success) {
            try {
              json = JSON.parse(responseData);
            } catch (e) {
              console.error(`Failed to parse custom translation file as JSON ${url}`, e);
              callback(null, { status: 404 });
              return;
            }

            console.log(`Custom translation file ${url} was loaded successfully`);
          } else {
            console.error(`Failed to download translation resource ${url} (fallback)`, e);
          }
  
          callback(!!json ? json : responseData, res);
        }, 
        data
      );
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
  ​
      // react i18next special options (optional)
      react: {
        wait: false,
        //bindI18n: 'languageChanged loaded',
        //bindStore: 'added removed',
        nsMode: 'default',
        /*hashTransKey: (defaultValue: string) => {
          return camelCase(defaultValue);
          // return a key based on defaultValue or if you prefer to just 
          // remind you should set a key return false and throw an error
        },*/
      }
    }, 
    undefined
  )
  .then(() => {
    Moment.locale(i18n.language);
  });
​
i18n.on('languageChanged', lng => {
  Moment.locale(lng);
});

export { i18n };

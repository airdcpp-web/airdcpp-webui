import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import * as LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import * as resources from '../../resources/locales';
//import { camelCase } from 'lodash';
import Moment from 'moment';
​
​

/*const loadLocales: XHR.BackendOptions['ajax'] = (url, options, callback: any, data) => {
  try {
    let waitForLocale = require(`../../resources/locales/${url}.json`);
    waitForLocale((locale: string) => {
      callback(locale, { status: '200' });
    });
  } catch (e) {
    console.error(`Failed to load resource ${url}`, e);
    callback(null, { status: '404' });
  }
};*/

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // if not using I18nextProvider
  .use(XHR)
  .init(
    {
      /*backend: {
        loadPath: '{{lng}}',
        parse: (data: any) => data,
        ajax: loadLocales
      },*/
      resources,
      fallbackLng: 'en',
      debug: true,
      load: 'languageOnly',
      defaultNS: 'main',
      //lng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      saveMissing: true,
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
    Moment.locale('fi');
    //Moment.locale(i18n.language);
  });
​
i18n.on('languageChanged', lng => {
  Moment.locale(lng);
});

export { i18n };

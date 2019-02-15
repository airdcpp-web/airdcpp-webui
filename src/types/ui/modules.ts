import i18next from 'i18next';


export const enum Modules {
  QUEUE = 'queue',
  SEARCH = 'search',
  SHARE = 'share',
  HOME = 'home',
  LOGIN = 'login',
  FAVORITE_HUBS = 'favoriteHubs',
  SETTINGS = 'settings',
  EXTENSIONS = 'extensions',
  TRANSFERS = 'transfers',
  WIDGETS = 'widgets',

  FILELISTS = 'filelists',
  HUBS = 'hubs',
  MESSAGES = 'messages',
  VIEWED_FILES = 'viewedFiles',
  EVENTS = 'events',

  COMMON = 'common',
}

export enum SubNamespaces {
  FORM = 'form',
  ACTIONS = 'actions',
  PROMPTS = 'prompts',
  TABLE = 'table',
  NAVIGATION = 'navigation',
}

export interface ModuleTranslator {
  t: i18next.TFunction;
  toI18nKey: (text: string, subModuleIds?: string[]) => string;
  translate: (text: string, subModuleIds?: string[]) => string;
  moduleId: string | string[];
  plainT: i18next.TFunction;
}

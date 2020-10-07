import { TFunction } from 'i18next';


export const enum Modules {
  QUEUE = 'queue',
  SEARCH = 'search',
  SHARE = 'share',
  HOME = 'home',
  LOGIN = 'login',
  HASH = 'hash',
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
  NOTIFICATIONS = 'notifications',
  UNITS = 'units',
}

export interface ModuleTranslator {
  t: TFunction;
  toI18nKey: (text: string, subModuleIds?: string[]) => string;
  translate: (text: string, subModuleIds?: string[]) => string;
  moduleId: string | string[];
  plainT: TFunction;
}

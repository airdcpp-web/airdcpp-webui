const MODULE_URL = 'histories';

export enum HistoryStringEnum {
  SEARCH = 'search_pattern',
  EXCLUDE = 'search_excluded',
  DOWNLOAD_DIR = 'download_target',
}

export enum HistoryEntryEnum {
  HUB = 'hub',
  PRIVATE_CHAT = 'private_chat',
  FILELIST = 'filelist',
}

export default {
  MODULE_URL: MODULE_URL,

  STRINGS_URL: MODULE_URL + '/strings',
  SESSIONS_URL: MODULE_URL + '/sessions',
};

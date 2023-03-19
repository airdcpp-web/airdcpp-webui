const MODULE_URL = 'settings';

export const enum SettingProfileEnum {
  NORMAL = 0,
  RAR = 1,
  LAN = 2,
}

export const enum IncomingConnectionModeEnum {
  INCOMING_DISABLED = -1,
  INCOMING_ACTIVE = 0,
  INCOMING_ACTIVE_UPNP = 1,
  INCOMING_PASSIVE = 2,
}

export const enum OutgoingConnectionModeEnum {
  OUTGOING_DIRECT = 0,
  OUTGOING_SOCKS = 1,
}

export const enum LocalSettings {
  NOTIFY_MENTION = 'notify_mention_my_nick',
  NOTIFY_PM_USER = 'notify_pm_user',
  NOTIFY_PM_BOT = 'notify_pm_bot',
  NOTIFY_HUB_MESSAGE = 'notify_hub_message',

  NOTIFY_BUNDLE_STATUS = 'notify_bundle_status',

  NOTIFY_EVENTS_INFO = 'notify_events_info',
  NOTIFY_EVENTS_WARNING = 'notify_events_warning',
  NOTIFY_EVENTS_ERROR = 'notify_events_error',

  UNREAD_LABEL_DELAY = 'unread_label_delay',
  BACKGROUND_IMAGE_URL = 'background_image_url',

  NO_INSTALL_PROMPT = 'no_install_prompt',
}

export default {
  MODULE_URL: MODULE_URL,

  ITEMS_GET_URL: MODULE_URL + '/get',
  ITEMS_SET_URL: MODULE_URL + '/set',
  ITEMS_RESET_URL: MODULE_URL + '/reset',
  ITEMS_DEFINITIONS_URL: MODULE_URL + '/definitions',
};

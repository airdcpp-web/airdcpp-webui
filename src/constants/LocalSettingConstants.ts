import * as API from '@/types/api';
import * as UI from '@/types/ui';

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

type LocalFormFieldDefinition = UI.FormFieldDefinition & {
  default_value: UI.FormValueBase;
};

export const LocalSettingDefinitions: LocalFormFieldDefinition[] = [
  {
    key: LocalSettings.NOTIFY_MENTION,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: true,
    title: 'Mentions of my nick',
  },
  {
    key: LocalSettings.NOTIFY_PM_USER,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: true,
    title: 'Private messages (users)',
  },
  {
    key: LocalSettings.NOTIFY_PM_BOT,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: false,
    title: 'Private messages (bots)',
  },
  {
    key: LocalSettings.NOTIFY_HUB_MESSAGE,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: false,
    title: 'Hub chat messages (only in hubs where chat notifications are enabled)',
  },
  {
    key: LocalSettings.NOTIFY_BUNDLE_STATUS,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: true,
    title: 'Bundle status changes',
  },
  {
    key: LocalSettings.NOTIFY_EVENTS_INFO,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: false,
    title: 'Info events',
  },
  {
    key: LocalSettings.NOTIFY_EVENTS_WARNING,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: true,
    title: 'Warning events',
  },
  {
    key: LocalSettings.NOTIFY_EVENTS_ERROR,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: true,
    title: 'Error events',
  },
  {
    key: LocalSettings.UNREAD_LABEL_DELAY,
    type: API.SettingTypeEnum.NUMBER,
    default_value: 0,
    title: 'Delay for marking chat sessions as read (seconds)',
  },
  {
    key: LocalSettings.BACKGROUND_IMAGE_URL,
    type: API.SettingTypeEnum.URL,
    default_value: null,
    optional: true,
    title: 'Custom background image URL',
  },
  {
    key: LocalSettings.NO_INSTALL_PROMPT,
    type: API.SettingTypeEnum.BOOLEAN,
    default_value: false,
    title: `Never show the application install prompt in Home view`,
  },
];

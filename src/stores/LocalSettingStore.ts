//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { LocalSettings } from 'constants/SettingConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

type LocalFormFieldDefinition = UI.FormFieldDefinition & {
  default_value: UI.FormValueBase;
};

export const SettingDefinitions: LocalFormFieldDefinition[] = [
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

// Settings are saved in local storage only after the default value has been modified
// Default value from the respective definition is returned otherwise
const Store = {
  settings: {} as UI.FormValueMap,

  init() {
    this.settings = loadLocalProperty('local_settings', {});
  },

  getInitialState() {
    return this.getValues();
  },

  getDefinition(key: string) {
    const definition = SettingDefinitions.find((def) => def.key === key);
    invariant(definition, `Invalid local setting key ${key} supplied`);
    return definition;
  },

  // Return setting item infos (see API help for settings/items/info for details)
  getDefinitions(keys: string[]) {
    return keys.map(this.getDefinition);
  },

  // Get the current value by key (or default value if no value has been set)
  getValue(key: string) {
    if (this.settings.hasOwnProperty(key)) {
      return this.settings[key];
    }

    return this.getDefinition(key)!.default_value;
  },

  getValues() {
    return SettingDefinitions.reduce((reduced, { key }) => {
      reduced[key] = this.getValue(key);
      return reduced;
    }, {} as UI.FormValueMap);
  },

  setValue(key: string, value: UI.FormValueMap[keyof UI.FormValueMap]) {
    this.setValues({
      [key]: value,
    });
  },

  // Append values for the provided key -> value object
  setValues(items: UI.FormValueMap) {
    this.settings = Object.assign({}, this.settings, items);
    saveLocalProperty('local_settings', this.settings);
    (this as any).trigger(this.getValues());
  },
};

const LocalSettingStore = Reflux.createStore(Store);

export default LocalSettingStore;

import { Lens, lens } from '@dhmk/zustand-lens';

import * as UI from '@/types/ui';

import { loadLocalProperty, saveLocalProperty } from '@/utils/BrowserUtils';
import { getLocalSettingValue } from '@/utils/LocalSettingUtils';

export const createLocalSettingSlice = () => {
  const createSlice: Lens<UI.LocalSettingsSlice, UI.AppStore> = (set, get, api) => {
    const slice = {
      settings: {} as UI.LocalSettingValues,

      init: () => {
        set({
          settings: loadLocalProperty('local_settings', {}),
        });
      },

      // Get the current value by key (or default value if no value has been set)
      getValue: <ValueType extends UI.FormValueBase>(key: string): ValueType => {
        return getLocalSettingValue(key, get().settings);
      },

      setValue: (
        key: string,
        value: UI.LocalSettingValues[keyof UI.LocalSettingValues],
      ) => {
        get().setValues({
          [key]: value,
        });
      },

      // Append values for the provided key -> value object
      setValues: (items: Partial<UI.LocalSettingValues>) => {
        const newSettings = {
          ...get().settings,
          ...(items as UI.LocalSettingValues),
        };

        saveLocalProperty('local_settings', newSettings);
        set({
          settings: newSettings,
        });
      },
    };

    return slice;
  };

  return createSlice;
};

export const initLocalSettingStore = (appStore: UI.AppStore) => {
  appStore.settings.init();
};

export const createLocalSettingStore = () => {
  return lens<UI.LocalSettingsSlice, UI.AppStore>((...a) => ({
    ...createLocalSettingSlice()(...a),
  }));
};

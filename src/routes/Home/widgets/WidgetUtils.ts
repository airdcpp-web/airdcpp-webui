import * as UI from '@/types/ui';

import { getModuleT, toI18nKey } from '../../../utils/TranslationUtils';
import { getRandomInt } from '../../../utils/ValueUtils';
import { loadLocalProperty, saveLocalProperty } from '../../../utils/BrowserUtils';

export const createWidgetId = (typeId: string) => `${typeId}_${getRandomInt(1, 1000000)}`;

// Key for widget settings in local storage (should not be accessed directly by the widget)
export const widgetIdToSettingKey = (id: string) => `widget_${id}`;

// Key for custom widget state in local storage (to be accessed directly by the widget)
export const widgetIdToLocalStateKey = (id: string) =>
  `${widgetIdToSettingKey(id)}_state`;

export const widgetIdToType = (id: string) => {
  const pos = id.indexOf('_');
  return pos !== -1 ? id.substring(0, pos) : id;
};

export const getWidgetInfoById = (id: string, widgets: UI.Widget[]) => {
  const widgetType = widgetIdToType(id);
  return widgets.find((item) => item.typeId === widgetType);
};

export const getWidgetT = (widgetInfo: UI.Widget, t: UI.TranslateF) => {
  return getModuleT(t, [UI.Modules.WIDGETS, widgetInfo.typeId]);
};

export const translateWidgetName = (widgetInfo: UI.Widget, t: UI.TranslateF) => {
  return t(
    toI18nKey('widgetName', [UI.Modules.WIDGETS, widgetInfo.typeId]),
    widgetInfo.name,
  );
};

export const EmptyWidgetSettings = {
  name: '',
  widget: {},
};

export const loadWidgetSettings = (
  id: string,
  widgetInfo?: UI.Widget,
): UI.WidgetSettings => {
  const settings = loadLocalProperty<UI.WidgetSettings>(
    widgetIdToSettingKey(id),
    EmptyWidgetSettings,
  );

  // Add new default settings
  if (widgetInfo && widgetInfo.formSettings) {
    widgetInfo.formSettings.forEach((definition) => {
      if (!settings.widget.hasOwnProperty(definition.key)) {
        settings.widget[definition.key] = definition.default_value;
      }
    });
  }

  return settings;
};

export const saveWidgetSettings = <SettingsT>(
  id: string,
  settings: UI.WidgetSettings<SettingsT>,
) => {
  saveLocalProperty(widgetIdToSettingKey(id), settings);
};

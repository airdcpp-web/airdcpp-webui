import * as UI from 'types/ui';
import { getModuleT, toI18nKey } from './TranslationUtils';

export const createWidgetId = (typeId: string) =>
  `${typeId}_${Math.floor(Math.random() * 100000000 + 1)}`;

// Key for widget settings in local storage (should not be accessed directly by the widget)
export const widgetIdToSettingKey = (id: string) => `widget_${id}`;

// Key for custom widget state in local storage (to be accessed directly by the widget)
export const widgetIdToLocalStateKey = (id: string) =>
  `${widgetIdToSettingKey(id)}_state`;

export const widgetIdToType = (id: string) => {
  const pos = id.indexOf('_');
  return pos !== -1 ? id.substring(0, pos) : id;
};

export const getWidgetT = (widgetInfo: UI.Widget, t: UI.TranslateF) => {
  return getModuleT(t, [UI.Modules.WIDGETS, widgetInfo.typeId]);
};

export const translateWidgetName = (widgetInfo: UI.Widget, t: UI.TranslateF) => {
  return t(
    toI18nKey('widgetName', [UI.Modules.WIDGETS, widgetInfo.typeId]),
    widgetInfo.name
  );
};

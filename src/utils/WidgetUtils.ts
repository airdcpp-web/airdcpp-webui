
import * as UI from 'types/ui';
import { getModuleT, toI18nKey } from './TranslationUtils';
import i18next from 'i18next';


export const createWidgetId = (typeId: string) => `${typeId}_${Math.floor((Math.random() * 100000000) + 1)}`;

export const widgetIdToSettingKey = (id: string) => `widget_${id}`;

export const widgetIdToType = (id: string) => {
  const pos = id.indexOf('_');
  return pos !== -1 ? id.substring(0, pos) : id;
};

export const getWidgetT = (widgetInfo: UI.Widget, t: i18next.TFunction) => {
  return getModuleT(t, [ UI.Modules.WIDGETS, widgetInfo.typeId ]);
};

export const translateWidgetName = (widgetInfo: UI.Widget, t: i18next.TFunction) => {
  return t(toI18nKey('widgetName', [ UI.Modules.WIDGETS, widgetInfo.typeId ]), widgetInfo.name);
};

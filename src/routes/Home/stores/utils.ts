import { saveWidgetSettings } from '@/routes/Home/widgets/WidgetUtils';
import { Layouts } from 'react-grid-layout';

import * as UI from '@/types/ui';
import {
  ApplicationWidgetInfo,
  ExtensionWidgetInfo,
  NotepadWidgetInfo,
  RSSWidgetInfo,
  TransferWidgetInfo,
} from '../widgets';
import { HomeLayoutColumns } from '../constants/HomeLayoutConstants';

export const createLayoutWidget = (
  layouts: Layouts,
  widgetInfo: UI.Widget,
  id: string,
  x?: number,
  y?: number,
) => {
  // Add the same widget for all layouts (we are lazy and use the same size for all layouts)
  return Object.keys(HomeLayoutColumns).reduce((reducedLayouts, key) => {
    reducedLayouts[key] = layouts[key] || [];
    reducedLayouts[key] = reducedLayouts[key].concat({
      i: id,
      x: x || (reducedLayouts[key].length * 2) % (HomeLayoutColumns[key] || 12),
      y: y || 0,
      ...widgetInfo.size,
    });

    return reducedLayouts;
  }, {} as Layouts);
};

const createDefaultLayoutWidget = <SettingsT>(
  layouts: Layouts,
  widgetInfo: UI.Widget,
  x: number,
  y: number,
  name?: string,
  settings?: SettingsT,
  suffix = '_default',
) => {
  const id = widgetInfo.typeId + suffix;
  const newLayout = createLayoutWidget(layouts, widgetInfo, id, x, y);

  saveWidgetSettings(id, {
    name,
    widget: settings,
  });

  return newLayout;
};

const createDefaultLayoutWidgets = (layouts: Layouts) => {
  layouts = createDefaultLayoutWidget(layouts, ApplicationWidgetInfo, 0, 0);
  layouts = createDefaultLayoutWidget(
    layouts,
    RSSWidgetInfo,
    ApplicationWidgetInfo.size.w,
    0,
    'News',
    {
      feed_url: 'https://airdcpp-web.github.io/feed.xml',
    },
    '_releases',
  );

  layouts = createDefaultLayoutWidget(
    layouts,
    ExtensionWidgetInfo,
    ApplicationWidgetInfo.size.w + RSSWidgetInfo.size.w,
    0,
  );
  layouts = createDefaultLayoutWidget(
    layouts,
    TransferWidgetInfo,
    ApplicationWidgetInfo.size.w + RSSWidgetInfo.size.w + ExtensionWidgetInfo.size.w,
    0,
  );
  layouts = createDefaultLayoutWidget(layouts, NotepadWidgetInfo, 0, 5);
  return layouts;
};

export const ensureDefaultLayoutWidgets = (layouts: Layouts) => {
  if (Object.keys(layouts).length !== 0) {
    return layouts;
  }

  // Initialize the default layout
  return createDefaultLayoutWidgets(layouts);
};

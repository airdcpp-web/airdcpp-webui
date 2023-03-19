//@ts-ignore
import Reflux from 'reflux';

import WidgetActions /*, { WidgetItemInfo }*/ from 'actions/reflux/WidgetActions';

import reject from 'lodash/reject';
import {
  loadLocalProperty,
  removeLocalProperty,
  saveLocalProperty,
} from 'utils/BrowserUtils';

import { Application } from 'widgets/Application';
import { Extensions } from 'widgets/Extensions';
import { Notepad } from 'widgets/Notepad';
import { RSS } from 'widgets/RSS';
import { Transfers } from 'widgets/Transfers';

import * as UI from 'types/ui';
import { Layouts, Layout } from 'react-grid-layout';
import {
  widgetIdToSettingKey,
  widgetIdToType,
  widgetIdToLocalStateKey,
} from 'utils/WidgetUtils';

// CONSTANTS
const cols: { [P in string]: number } = { lg: 14, md: 10, sm: 6, xs: 4, xxs: 2 };
const breakpoints: { [P in string]: number } = {
  lg: 1600,
  md: 1100,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const widgets = [Application, RSS, Notepad, Transfers, Extensions];

const LAYOUT_STORAGE_KEY = 'home_layout';
const LAYOUT_VERSION = 4;

export const EmptyWidgetSettings = {
  name: '',
  widget: {},
};

// HELPERS
const getWidgetSettings = (id: string, widgetInfo?: UI.Widget): UI.WidgetSettings => {
  const settings = loadLocalProperty<UI.WidgetSettings>(
    widgetIdToSettingKey(id),
    EmptyWidgetSettings
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

const saveSettings = <SettingsT>(id: string, settings: UI.WidgetSettings<SettingsT>) => {
  saveLocalProperty(widgetIdToSettingKey(id), settings);
};

const createWidget = (
  layouts: Layouts,
  widgetInfo: UI.Widget,
  id: string,
  x?: number,
  y?: number
) => {
  // Add the same widget for all layouts (we are lazy and use the same size for all layouts)
  return Object.keys(cols).reduce((reducedLayouts, key) => {
    reducedLayouts[key] = layouts[key] || [];
    reducedLayouts[key] = reducedLayouts[key].concat({
      i: id,
      x: x || (reducedLayouts[key].length * 2) % (cols[key] || 12),
      y: y || 0,
      ...widgetInfo.size,
    });

    return reducedLayouts;
  }, {});
};

const createDefaultWidget = <SettingsT>(
  layouts: Layouts,
  widgetInfo: UI.Widget,
  x: number,
  y: number,
  name?: string,
  settings?: SettingsT,
  suffix = '_default'
) => {
  const id = widgetInfo.typeId + suffix;
  const newLayout = createWidget(layouts, widgetInfo, id, x, y);

  saveSettings(id, {
    name,
    widget: settings,
  });

  return newLayout;
};

const getWidgetInfoById = (id: string) => {
  const widgetType = widgetIdToType(id);
  return widgets.find((item) => item.typeId === widgetType);
};

interface StorageLayouts {
  version: number;
  items: Layouts;
}

const Store = {
  layouts: {} as Layouts,
  listenables: WidgetActions,
  init: function () {
    // Try to load saved ones
    const layoutInfo = loadLocalProperty<StorageLayouts>(LAYOUT_STORAGE_KEY);
    if (layoutInfo && layoutInfo.items) {
      if (layoutInfo.version === LAYOUT_VERSION) {
        this.layouts = layoutInfo.items;
      } else if (layoutInfo.version === 3) {
        this.layouts = createDefaultWidget(
          layoutInfo.items,
          Extensions,
          Application.size.w + RSS.size.w,
          0
        );
      }
    }

    this.ensureDefaultWidgets();
  },

  ensureDefaultWidgets: function () {
    if (Object.keys(this.layouts).length !== 0) {
      return;
    }

    // Initialize the default layout
    this.layouts = createDefaultWidget(this.layouts, Application, 0, 0);
    this.layouts = createDefaultWidget(
      this.layouts,
      RSS,
      Application.size.w,
      0,
      'News',
      {
        feed_url: 'https://airdcpp-web.github.io/feed.xml',
      },
      '_releases'
    );

    this.layouts = createDefaultWidget(
      this.layouts,
      Extensions,
      Application.size.w + RSS.size.w,
      0
    );
    this.layouts = createDefaultWidget(
      this.layouts,
      Transfers,
      Application.size.w + RSS.size.w + Extensions.size.w,
      0
    );
    this.layouts = createDefaultWidget(this.layouts, Notepad, 0, 5);
  },

  getInitialState: function () {
    return this.layouts;
  },

  onCreate(id: string, settings: UI.WidgetSettings, typeId: string) {
    saveSettings(id, settings);

    this.layouts = createWidget(this.layouts, this.getWidgetInfoById(typeId)!, id);

    (this as any).trigger(this.layouts);
  },

  onEdit(id: string, settings: UI.WidgetSettings) {
    saveSettings(id, settings);

    this.layouts = {
      ...this.layouts,
    };

    (this as any).trigger(this.layouts);
  },

  onRemove(id: string) {
    removeLocalProperty(widgetIdToSettingKey(id));
    removeLocalProperty(widgetIdToLocalStateKey(id));

    this.layouts = Object.keys(cols).reduce((layouts, key) => {
      if (this.layouts[key]) {
        layouts[key] = reject(this.layouts[key], { i: id });
      }

      return layouts;
    }, {});

    (this as any).trigger(this.layouts);
  },

  getWidgetInfoById: getWidgetInfoById,
  getWidgetSettings: getWidgetSettings,

  get widgets() {
    return widgets;
  },

  get cols() {
    return cols;
  },

  get breakpoints() {
    return breakpoints;
  },

  onLayoutChange(layout: Layout[], layouts: Layouts) {
    saveLocalProperty(LAYOUT_STORAGE_KEY, {
      version: LAYOUT_VERSION,
      items: layouts,
    });

    this.layouts = {
      ...layouts,
    };

    (this as any).trigger(this.layouts);
  },
};

const WidgetStore: typeof Store = Reflux.createStore(Store);

export default WidgetStore;

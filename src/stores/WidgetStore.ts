//@ts-ignore
import Reflux from 'reflux';

import WidgetActions, { WidgetItemInfo } from 'actions/WidgetActions';
import WidgetUtils from 'utils/WidgetUtils';

import reject from 'lodash/reject';
import { loadLocalProperty, removeLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';

import { Application } from 'widgets/Application';
import { RSS } from 'widgets/RSS';
import { Transfers } from 'widgets/Transfers';

import * as UI from 'types/ui';
import { Layouts, Layout, Breakpoints } from 'react-grid-layout';


// CONSTANTS
const cols: {[P in Breakpoints]: number } = { lg: 14, md: 10, sm: 6, xs: 4, xxs: 2 };
const breakpoints: {[P in Breakpoints]: number } = { lg: 1600, md: 1100, sm: 768, xs: 480, xxs: 0 };

const widgets = [
  Application,
  RSS,
  Transfers,
];

const LAYOUT_STORAGE_KEY = 'home_layout';
const LAYOUT_VERSION = 3;

// HELPERS
const getWidgetSettings = (id: string, widgetInfo?: UI.Widget) => {
  const settings = loadLocalProperty(WidgetUtils.idToSettingKey(id), { });

  // Add new default settings
  if (widgetInfo && widgetInfo.formSettings) {
    settings.widget = settings.widget || {};
    widgetInfo.formSettings
      .forEach(definition => {
        if (!settings.widget.hasOwnProperty(definition.key)) {
          settings.widget[definition.key] = definition.default_value;
        }
      });
  }

  return settings;
};

const saveSettings = <SettingsT>(id: string, settings: UI.WidgetSettings<SettingsT>) => {
  saveLocalProperty(WidgetUtils.idToSettingKey(id), settings);
};

const createWidget = (layouts: Layouts, widgetInfo: UI.Widget, id: string, x?: number, y?: number) => {
  // Add the same widget for all layouts (we are lazy and use the same size for all layouts)
  return Object.keys(cols)
    .reduce(
      (reducedLayouts, key) => {
        reducedLayouts[key] = layouts[key] || [];
        reducedLayouts[key] = reducedLayouts[key].concat({ 
          i: id, 
          x: x || reducedLayouts[key].length * 2 % (cols[key] || 12), 
          y: y || 0, 
          ...widgetInfo.size
        });

        return reducedLayouts;
      }, 
      {}
    );
};

const createDefaultWidget = <SettingsT>(
  layouts: Layouts, 
  widgetInfo: UI.Widget, 
  x: number, 
  y: number, 
  name: string, 
  settings?: SettingsT, 
  suffix: string = '_default'
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
  const widgetType = WidgetUtils.idToWidgetType(id);
  return widgets.find(item => item.typeId === widgetType);
};


const Store = {
  layouts: {} as Layouts,
  listenables: WidgetActions,
  init: function () {
    // Try to load saved ones
    let layoutInfo = loadLocalProperty(LAYOUT_STORAGE_KEY);
    if (layoutInfo && layoutInfo.items) {
      if (layoutInfo.version === LAYOUT_VERSION) {
        this.layouts = layoutInfo.items;
      }
    }

    if (Object.keys(this.layouts).length === 0) {
      // Initialize the default layout
      this.layouts = createDefaultWidget(this.layouts, Application, 0, 0, Application.name);
      this.layouts = createDefaultWidget(
        this.layouts, 
        RSS, 
        2, 
        0, 
        'News', 
        {
          feed_url: 'https://airdcpp-web.github.io/feed.xml',
        }, 
        '_releases'
      );

      this.layouts = createDefaultWidget(this.layouts, Transfers, 5, 0, Transfers.name);
    }
  },

  getInitialState: function () {
    return this.layouts;
  },

  onCreateSaved(id: string, settings: UI.WidgetSettings, typeId: string) {
    saveSettings(id, settings);


    this.layouts = createWidget(this.layouts, this.getWidgetInfoById(typeId)!, id);

    (this as any).trigger(this.layouts);
  },

  onEditSaved(id: string, settings: UI.WidgetSettings) {
    saveSettings(id, settings);

    this.layouts = { 
      ...this.layouts
    };

    (this as any).trigger(this.layouts);
  },

  onRemove({ id }: Pick<WidgetItemInfo, 'id'>) {
    removeLocalProperty(WidgetUtils.idToSettingKey(id));

    this.layouts = Object.keys(cols)
      .reduce(
        (layouts, key) => {
          if (this.layouts[key]) {
            layouts[key] = reject(this.layouts[key], { i: id });
          }

          return layouts;
        }, 
        {}
      );

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

  onLayoutChange(layout: Layout, layouts: Layouts) {
    saveLocalProperty(LAYOUT_STORAGE_KEY, {
      version: LAYOUT_VERSION,
      items: layouts,
    });

    this.layouts = {
      ...layouts
    };

    (this as any).trigger(this.layouts);
  },
};

const WidgetStore: typeof Store = Reflux.createStore(Store);

export default WidgetStore;

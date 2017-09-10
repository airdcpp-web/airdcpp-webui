import Reflux from 'reflux';

import WidgetActions from 'actions/WidgetActions';
import WidgetUtils from 'utils/WidgetUtils';

import reject from 'lodash/reject';
import BrowserUtils from 'utils/BrowserUtils';

import Application from 'widgets/Application';
import RSS from 'widgets/RSS';
import Transfers from 'widgets/Transfers';


// HELPERS
const getWidgetSettings = (id, widgetInfo) => {
  const settings = BrowserUtils.loadLocalProperty(WidgetUtils.idToSettingKey(id), { });

  // Add new default settings
  if (widgetInfo && widgetInfo.formSettings) {
    settings.widget = settings.widget || {};
    widgetInfo.formSettings.forEach(definition => {
      if (!settings.widget.hasOwnProperty(definition.key)) {
        settings.widget[definition.key] = definition.default_value;
      }
    });
  }

  return settings;
};

const saveSettings = (id, settings) => {
  BrowserUtils.saveLocalProperty(WidgetUtils.idToSettingKey(id), settings);
};

const createWidget = (layouts, widgetInfo, id, x, y) => {
  // Add the same widget for all layouts (we are lazy and use the same size for all layouts)
  return Object.keys(cols).reduce((reducedLayouts, key) => {
    reducedLayouts[key] = layouts[key] || [];
    reducedLayouts[key] = reducedLayouts[key].concat({ 
      i: id, 
      x: x || reducedLayouts[key].length * 2 % (cols[key] || 12), 
      y: y || 0, 
      ...widgetInfo.size
    });

    return reducedLayouts;
  }, {});
};

const createDefaultWidget = (layouts, widgetInfo, x, y, name, settings, suffix = '_default') => {
  const id = widgetInfo.typeId + suffix;
  const newLayout = createWidget(layouts, widgetInfo, id, x, y);

  saveSettings(id, {
    name,
    widget: settings,
  });

  return newLayout;
};

const getWidgetInfoById = (id) => {
  const widgetType = WidgetUtils.idToWidgetType(id);
  return widgets.find(item => item.typeId === widgetType);
};


// CONSTANTS
const cols = { xlg: 14, lg: 10, sm: 6, xs: 4, xxs: 2 };
const breakpoints = { xlg: 1600, lg: 1100, sm: 768, xs: 480, xxs: 0 };

const widgets = [
  Application,
  RSS,
  Transfers,
];

const LAYOUT_STORAGE_KEY = 'home_layout';
const LAYOUT_VERSION = 3;


const WidgetStore = Reflux.createStore({
  listenables: WidgetActions,
  init: function () {
    // Try to load saved ones
    let layoutInfo = BrowserUtils.loadLocalProperty(LAYOUT_STORAGE_KEY);
    if (layoutInfo && layoutInfo.items) {
      if (layoutInfo.version === LAYOUT_VERSION) {
        this.layouts = layoutInfo.items;
      } else if (layoutInfo.version === 2) {
        this.layouts = layoutInfo.items;

        // Replace the old release feed with the blog news feed
        const releases = getWidgetSettings('rss_releases');
        if (releases) {
          this.onRemoveConfirmed('rss_releases');
          this.layouts = createDefaultWidget(this.layouts, RSS, 2, 0, 'News', {
            feed_url: 'https://airdcpp-web.github.io/feed.xml',
          }, '_releases');
        }
      }
    }

    if (!this.layouts) {
      // Initialize the default layout
      this.layouts = {};
      this.layouts = createDefaultWidget(this.layouts, Application, 0, 0, Application.name);
      this.layouts = createDefaultWidget(this.layouts, RSS, 2, 0, 'News', {
        feed_url: 'https://airdcpp-web.github.io/feed.xml',
      }, '_releases');
      this.layouts = createDefaultWidget(this.layouts, Transfers, 5, 0, Transfers.name);
    }
  },

  getInitialState: function () {
    return this.layouts;
  },

  onCreateSaved(id, settings, widgetInfo) {
    saveSettings(id, settings);

    this.layouts = createWidget(this.layouts, widgetInfo, id);

    this.trigger(this.layouts);
  },

  onEditSaved(id, settings) {
    saveSettings(id, settings);

    this.layouts = Object.assign({}, this.layouts);
    this.trigger(this.layouts);
  },

  onRemoveConfirmed(id) {
    BrowserUtils.removeLocalProperty(WidgetUtils.idToSettingKey(id));

    this.layouts = Object.keys(cols).reduce((layouts, key) => {
      if (this.layouts[key]) {
        layouts[key] = reject(this.layouts[key], { i: id });
      }

      return layouts;
    }, {});

    this.trigger(this.layouts);
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

  onLayoutChange(layout, layouts) {
    BrowserUtils.saveLocalProperty(LAYOUT_STORAGE_KEY, {
      version: LAYOUT_VERSION,
      items: layouts,
    });

    this.layouts = Object.assign({}, layouts);

    this.trigger(this.layouts);
  },
});

export default WidgetStore;

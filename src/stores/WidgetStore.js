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
	if (widgetInfo && widgetInfo.defaultSettings) {
		Object.keys(widgetInfo.defaultSettings).forEach(key => {
			if (!settings.widget.hasOwnProperty(key)) {
				settings.widget[key] = widgetInfo.defaultSettings[key];
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


const WidgetStore = Reflux.createStore({
	listenables: WidgetActions,
	init: function () {
		let layoutInfo = BrowserUtils.loadLocalProperty(LAYOUT_STORAGE_KEY);
		if (layoutInfo && layoutInfo.items && layoutInfo.version === 2) {
			this.layouts = layoutInfo.items;
		} else {
			// Initialize the default layout
			this.layouts = {};
			this.layouts = createDefaultWidget(this.layouts, Application, 0, 0, Application.name);
			this.layouts = createDefaultWidget(this.layouts, RSS, 2, 0, 'Client releases', {
				feed_url: 'https://github.com/airdcpp-web/airdcpp-webclient/releases.atom',
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
			version: 2,
			items: layouts,
		});

		this.layouts = Object.assign({}, layouts);

		this.trigger(this.layouts);
	},
});

export default WidgetStore;

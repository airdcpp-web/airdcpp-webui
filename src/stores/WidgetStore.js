import Reflux from 'reflux';

import WidgetActions from 'actions/WidgetActions';

import reject from 'lodash/reject';
import BrowserUtils from 'utils/BrowserUtils';

import RSS from 'widgets/RSS';
import Transfers from 'widgets/Transfers';


// HELPERS
const idToSettingKey = (id) => 'widget_' + id;

const idToWidgetType = (id) => {
	const pos = id.indexOf('_');
	return pos !== -1 ? id.substring(0, pos) : id;
};

const getWidgetSettings = (id) => {
	return BrowserUtils.loadLocalProperty(idToSettingKey(id), { });
};

const saveSettings = (id, settings) => {
	BrowserUtils.saveLocalProperty(idToSettingKey(id), settings);
};

const getWidgetInfoById = (id) => {
	const widgetType = idToWidgetType(id);
	return widgets.find(item => item.typeId === widgetType);
};

const createDefaultWidget = (x, y, widgetInfo, name, settings, suffix = '_default') => {
	const item = {
		i: widgetInfo.typeId + suffix,
		x,
		y,
		...widgetInfo.size,
	};

	saveSettings(item.i, {
		name,
		widget: settings,
	});

	return item;
};


// CONSTANTS
const widgets = [
	RSS,
	Transfers,
];

const LAYOUT_STORAGE_KEY = 'home_layout';


const WidgetStore = Reflux.createStore({
	listenables: WidgetActions,
	init: function () {
		let layout = BrowserUtils.loadLocalProperty(LAYOUT_STORAGE_KEY);
		if (layout && layout.items) {
			this.layout = layout.items;
		} else {
			// Initialize the default layout
			this.layout = [
				createDefaultWidget(0, 0, Transfers, Transfers.name),
				createDefaultWidget(9, 0, RSS, 'Application releases', {
					feed_url: 'https://github.com/airdcpp-web/airdcpp-webclient/releases.atom',
				}, '_releases'),
			];
		}
	},

	getInitialState: function () {
		return this.layout;
	},

	onCreateSaved(id, settings, widgetInfo) {
		saveSettings(id, settings);

		this.layout = this.layout.concat({ 
			i: id, 
			x: this.layout.length * 2 % (this.cols || 12), 
			y: 0, 
			...widgetInfo.size
		});

		console.log('Widget added', this.layout);
		this.trigger(this.layout);
	},

	onEditSaved(id, settings) {
		saveSettings(id, settings);
		this.trigger(this.layout);
	},

	onRemoveConfirmed(id) {
		BrowserUtils.removeLocalProperty(idToSettingKey(id));

		this.layout = reject(this.layout, { i: id });
		this.trigger(this.layout);
	},

	getWidgetInfoById: getWidgetInfoById,
	getWidgetSettings: getWidgetSettings,

	get widgets() {
		return widgets;
	},

	onBreakpointChange(breakpoint, cols) {
		this.cols = cols;
		this.trigger(this.layout);
	},

	onLayoutChange(layout) {
		BrowserUtils.saveLocalProperty(LAYOUT_STORAGE_KEY, {
			version: UI_VERSION,
			items: layout,
		});

		this.layout = layout;

		this.trigger(this.layout);
		console.log('New layout', layout);
	},
});

export default WidgetStore;

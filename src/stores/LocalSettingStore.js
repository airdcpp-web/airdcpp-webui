import Reflux from 'reflux';
import invariant from 'invariant';

import BrowserUtils from 'utils/BrowserUtils';
import { LocalSettings, FieldTypes } from 'constants/SettingConstants';


const SettingDefinitions = {
	[LocalSettings.NOTIFY_PM_USER]: {
		type: FieldTypes.BOOLEAN,
		defaultValue: true,
		title: 'Private messages (users)',
	}, 
	[LocalSettings.NOTIFY_PM_BOT]: {
		type: FieldTypes.BOOLEAN,
		defaultValue: false,
		title: 'Private messages (bots)',
	}, 
	[LocalSettings.NOTIFY_BUNDLE_STATUS]: {
		type: FieldTypes.BOOLEAN,
		defaultValue: true,
		title: 'Bundle status changes',
	}, 
	[LocalSettings.NOTIFY_EVENTS_INFO]: {
		type: FieldTypes.BOOLEAN,
		defaultValue: false,
		title: 'Info events',
	}, 
	[LocalSettings.NOTIFY_EVENTS_WARNING]: {
		type: FieldTypes.BOOLEAN,
		defaultValue: true,
		title: 'Warning events',
	}, 
	[LocalSettings.NOTIFY_EVENTS_ERROR]: {
		type: FieldTypes.BOOLEAN,
		defaultValue: true,
		title: 'Error events',
	}, 
	[LocalSettings.UNREAD_LABEL_DELAY]: {
		type: FieldTypes.NUMBER,
		defaultValue: 0,
		title: 'Delay for marking chat sessions as read (seconds)',
	}, 
	[LocalSettings.BACKGROUND_IMAGE_URL]: {
		type: FieldTypes.STRING,
		defaultValue: null,
		optional: true,
		title: 'Custom background image URL',
	}
};


// Settings are saved in local storage only after the default value has been modified
// Default value fron 'Settings' object is returned otherwise
const LocalSettingStore = Reflux.createStore({
	init: function () {
		this.settings = BrowserUtils.loadLocalProperty('local_settings', {});
	},

	getState() {
		return this.settings;
	},

	// Return setting item infos (see API help for settings/items/info for details) 
	getDefinitions(keys) {
		return keys.reduce((reduced, key) => {
			invariant(SettingDefinitions[key], 'Invalid local setting key ' + key + ' supplied');
			reduced[key] = SettingDefinitions[key];
			return reduced;
		}, {});
	},

	// Get the current value by key (or default value if no value has been set)
	getValue(key) {
		if (this.settings.hasOwnProperty(key)) {
			return this.settings[key];
		}

		invariant(SettingDefinitions[key], 'Invalid setting key supplied');
		return SettingDefinitions[key].defaultValue;
	},

	// Append values for the provided key -> value object 
	setValues(items) {
		this.settings = Object.assign({}, this.settings, items);
		BrowserUtils.saveLocalProperty('local_settings', this.settings);
		this.trigger(this.getState());
	},
});

export default LocalSettingStore;
import Reflux from 'reflux';
import invariant from 'invariant';

import BrowserUtils from 'utils/BrowserUtils';
import { LocalSettings } from 'constants/SettingConstants';


const Settings = [
	{
		key: LocalSettings.NOTIFY_PM_USER,
		defaultValue: true,
		title: 'Private messages (users)',
	}, {
		key: LocalSettings.NOTIFY_PM_BOT,
		defaultValue: false,
		title: 'Private messages (bots)',
	}, {
		key: LocalSettings.NOTIFY_BUNDLE_STATUS,
		defaultValue: true,
		title: 'Bundle status changes',
	}, {
		key: LocalSettings.NOTIFY_EVENTS_INFO,
		defaultValue: false,
		title: 'Info events',
	}, {
		key: LocalSettings.NOTIFY_EVENTS_WARNING,
		defaultValue: true,
		title: 'Warning events',
	}, {
		key: LocalSettings.NOTIFY_EVENTS_ERROR,
		defaultValue: true,
		title: 'Error events',
	}, {
		key: LocalSettings.UNREAD_LABEL_DELAY,
		defaultValue: 0,
		title: 'Delay for marking chat sessions as read',
		unit: 'seconds',
	}, {
		key: LocalSettings.BACKGROUND_IMAGE_URL,
		defaultValue: null,
		title: 'Custom background image URL',
	}
];


// Settings are saved in local storage only after the default value has been modified
// Default value fron 'Settings' object is returned otherwise
const LocalSettingStore = Reflux.createStore({
	init: function () {
		this.settings = BrowserUtils.loadLocalProperty('local_settings', {});
	},

	getState() {
		return this.settings;
	},

	// Return setting item info (see API help for settings/items/info for details) 
	keyToInfo(key) {
		const setting = Settings.find(setting => setting.key === key);
		return {
			...setting,
			value: this.getValue(key),
		};
	},

	// Return setting item infos (see API help for settings/items/info for details) 
	getInfos(keys) {
		return keys.reduce((reduced, key) => {
			reduced[key] = this.keyToInfo(key);
			return reduced;
		}, {});
	},

	// Get the current value by key (or default value if no value has been set)
	getValue(key) {
		if (this.settings.hasOwnProperty(key)) {
			return this.settings[key];
		}

		const setting = Settings.find(setting => setting.key === key);
		invariant(setting, 'Invalid setting key supplied');
		return setting.defaultValue;
	},

	// Append values for the provided key -> value object 
	setValues(items) {
		this.settings = Object.assign({}, this.settings, items);
		BrowserUtils.saveLocalProperty('local_settings', this.settings);
		this.trigger(this.getState());
	},
});

export default LocalSettingStore;
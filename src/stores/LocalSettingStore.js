import Reflux from 'reflux';
import BrowserUtils from 'utils/BrowserUtils';

const LocalSettingStore = Reflux.createStore({
	init: function () {
		
	},

	get touchModeEnabled() {
		const rawValue = localStorage.getItem('touch_mode');
		if (!rawValue) {
			return BrowserUtils.preferTouch();
		}

		return JSON.parse(rawValue);
	},

	toggleTouchMode() {
		localStorage.setItem('touch_mode', JSON.stringify(!this.touchModeEnabled));
		this.trigger();
	},
});

export default LocalSettingStore
;

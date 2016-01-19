import Reflux from 'reflux';
import BrowserUtils from 'utils/BrowserUtils';

const LocalSettingStore = Reflux.createStore({
	init: function () {
		
	},

	get touchModeEnabled() {
		return BrowserUtils.loadLocalProperty('touch_mode', BrowserUtils.preferTouch());
	},

	toggleTouchMode() {
		BrowserUtils.saveLocalProperty('touch_mode', !this.touchModeEnabled);
		this.trigger();
	},
});

export default LocalSettingStore
;

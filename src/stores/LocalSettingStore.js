import Reflux from 'reflux';

const LocalSettingStore = Reflux.createStore({
	init: function () {
		
	},

	get touchModeEnabled() {
		 return JSON.parse(localStorage.getItem('touch_mode'));
	},

	toggleTouchMode() {
		localStorage.setItem('touch_mode', JSON.stringify(!this.touchModeEnabled));
		this.trigger();
	},
});

export default LocalSettingStore
;

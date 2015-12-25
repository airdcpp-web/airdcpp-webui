import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);

export default {
	hasTouchSupport() {
		 return 'ontouchstart' in document.documentElement // works on most browsers
		 	 || 'onmsgesturechange' in window; // works on ie10
		 //return false;
	},

	useMobileLayout() {
		return window.innerWidth < 700 || md.phone();
	},

	preferTouch() {
		return md.mobile();
	},

	get mobileDetect() {
		return md;
	},
};
export default {
	hasTouchSupport() {
		 return 'ontouchstart' in document.documentElement // works on most browsers
		 	 || 'onmsgesturechange' in window; // works on ie10
		 //return false;
	},
}
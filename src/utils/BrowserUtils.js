import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);


const loadProperty = (storage, storageKey, defaultData) => {
	if (storageKey) {
		const savedItem = storage.getItem(storageKey);
		if (savedItem !== undefined && savedItem !== null) { // 'false' should be loaded
			try {
				return JSON.parse(savedItem);
			} catch (e) {
				// Possibly a legacy storage item that wasn't saved as JSON
				console.warn('Failed to load storage property', e.message);
			}
		}
	}

	return defaultData;
};

const saveProperty = (storage, storageKey, data) => {
	if (!storageKey) {
		return;
	}

	storage.setItem(storageKey, JSON.stringify(data));
};

export default {
	loadLocalProperty(storageKey, defaultData) {
		return loadProperty(localStorage, storageKey, defaultData);
	},

	saveLocalProperty(storageKey, data) {
		saveProperty(localStorage, storageKey, data);
	},

	loadSessionProperty(storageKey, defaultData) {
		return loadProperty(sessionStorage, storageKey, defaultData);
	},

	saveSessionProperty(storageKey, data) {
		saveProperty(sessionStorage, storageKey, data);
	},

	hasTouchSupport() {
		 return 'ontouchstart' in document.documentElement // works on most browsers
		 	 || 'onmsgesturechange' in window; // works on ie10
		 //return false;
	},

	useMobileLayout() {
		return window.innerWidth < 700 || md.phone();
	},

	preferTouch() {
		return md.mobile() ? true : false;
	},

	getBasePath() {
		const pathTokens = window.location.pathname.split('/');

		// All basenames must used a fixed prefix
		if (pathTokens.length > 1 && pathTokens[1].indexOf('airdcpp-') === 0) {
			return '/' + pathTokens[1] + '/';
		}

		return '/';
	},

	get mobileDetect() {
		return md;
	},
};
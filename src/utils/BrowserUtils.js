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
	removeLocalProperty(storageKey) {
		localStorage.removeItem(storageKey);
	},
	loadSessionProperty(storageKey, defaultData) {
		return loadProperty(sessionStorage, storageKey, defaultData);
	},

	saveSessionProperty(storageKey, data) {
		saveProperty(sessionStorage, storageKey, data);
	},
	removeSessionProperty(storageKey) {
		sessionStorage.removeItem(storageKey);
	},
	hasTouchSupport() {
		 return 'ontouchstart' in document.documentElement // works on most browsers
		 	 || 'onmsgesturechange' in window; // works on ie10
		 //return false;
	},

	useMobileLayout() {
		return window.innerWidth < 700;
	},
};
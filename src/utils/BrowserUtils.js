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

export const loadLocalProperty = (storageKey, defaultData) => {
  return loadProperty(localStorage, storageKey, defaultData);
};

export const saveLocalProperty = (storageKey, data) => {
  saveProperty(localStorage, storageKey, data);
};

export const removeLocalProperty = (storageKey) => {
  localStorage.removeItem(storageKey);
};

export const loadSessionProperty = (storageKey, defaultData) => {
  return loadProperty(sessionStorage, storageKey, defaultData);
};

export const saveSessionProperty = (storageKey, data) => {
  saveProperty(sessionStorage, storageKey, data);
};

export const removeSessionProperty = (storageKey) => {
  sessionStorage.removeItem(storageKey);
};

export const hasTouchSupport = () => {
  return 'ontouchstart' in document.documentElement // works on most browsers
    || 'onmsgesturechange' in window; // works on ie10
  //return false;
};

export const useMobileLayout= () => {
  return window.innerWidth < 700;
};

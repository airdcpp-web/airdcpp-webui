import invariant from 'invariant';
import { NavigateFunction, NavigateOptions, To, Location } from 'react-router';

const loadProperty = (
  storage: Storage,
  storageKey: string | undefined,
  defaultData?: any,
) => {
  if (storageKey) {
    const savedItem = storage.getItem(storageKey);
    if (savedItem !== undefined && savedItem !== null) {
      // 'false' should be loaded
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

const saveProperty = (storage: Storage, storageKey: string | undefined, data: any) => {
  if (!storageKey) {
    return;
  }

  storage.setItem(storageKey, JSON.stringify(data));
};

export const loadLocalProperty = <ValueType>(
  storageKey: string | undefined,
  defaultData?: ValueType,
): ValueType => {
  return loadProperty(localStorage, storageKey, defaultData);
};

export const saveLocalProperty = (storageKey: string | undefined, data: any) => {
  saveProperty(localStorage, storageKey, data);
};

export const removeLocalProperty = (storageKey: string) => {
  localStorage.removeItem(storageKey);
};

export const loadSessionProperty = <ValueType>(
  storageKey: string | undefined,
  defaultData?: ValueType,
): ValueType => {
  return loadProperty(sessionStorage, storageKey, defaultData);
};

export const saveSessionProperty = (storageKey: string | undefined, data: any) => {
  saveProperty(sessionStorage, storageKey, data);
};

export const removeSessionProperty = (storageKey: string) => {
  sessionStorage.removeItem(storageKey);
};

export const hasTouchSupport = () => {
  return (
    'ontouchstart' in document.documentElement || // works on most browsers
    'onmsgesturechange' in window
  ); // works on ie10
  //return false;
};

export const hasCopySupport = () => !!(navigator as any).clipboard;

export const usingMobileLayout = (width?: number | null) => {
  return (width ?? window.innerWidth) < 700 || window.innerHeight < 500;
};

export const pushUnique = (
  to: To,
  options: NavigateOptions,
  currentLocation: Location,
  navigate: NavigateFunction,
) => {
  invariant(currentLocation, 'pushUnique: current location was not supplied');
  if (to !== currentLocation.pathname) {
    navigate(to, options);
  } else {
    navigate(to, { ...options, replace: true });
  }
};

export const browserStorageUnavailable = () => {
  try {
    sessionStorage.setItem('storage_test', 'test');
    sessionStorage.removeItem('storage_test');
  } catch (e) {
    if (e.code === DOMException.QUOTA_EXCEEDED_ERR && sessionStorage.length === 0) {
      // Safari and private mode
      return {
        id: 'privateBrowsingNotSupported',
        message: `This site can't be used with your browser if private browsing mode is enabled`,
      };
    } else {
      return {
        id: 'dataStorageNotSupported',
        message: `This site can't be used with your browser because it doesn't support data storage`,
      };
    }
  }

  return null;
};

export const preventMouseFocus: React.MouseEventHandler = (e) => {
  // Left click only; let keyboard and other buttons behave normally
  if (e.button === 0) e.preventDefault();
};

export const preventPointerFocus: React.PointerEventHandler = (e) => {
  const anyEvt = e as any;
  if (anyEvt.pointerType === 'mouse' || anyEvt.pointerType === 'pen') {
    e.preventDefault();
  }
};

// Convenience spread
export const noMouseFocusProps = {
  onMouseDown: preventMouseFocus,
  onPointerDown: preventPointerFocus,
};

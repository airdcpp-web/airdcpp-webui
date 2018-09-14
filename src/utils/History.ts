import update from 'immutability-helper';
import invariant from 'invariant';

import createHistory from 'history/createBrowserHistory';

import OverlayConstants from 'constants/OverlayConstants';
import { Location, LocationDescriptorObject } from 'history';


const History = createHistory({
  // Remove the trailing slash from base path
  basename: getBasePath().slice(0, -1),		
});

// Returns paths for currently open modals
const getModalPaths = (state: object) => {
  return Object.keys(state).reduce(
    (modalPaths, key) => {
      if (key.indexOf(OverlayConstants.MODAL_PREFIX) === 0) {
        modalPaths.push(state[key].pathname);
      }

      return modalPaths;
    }, 
    [] as string[]
  );
};

// Returns the current pathname with modals stripped
const getModelessPath = (location: Location) => {
  let pathname = location.pathname;
  if (!location.state) {
    return pathname;
  }

  const modalPaths = getModalPaths(location.state);

  while (1) {
    // Do we have a modal with this path?
    if (modalPaths.indexOf(pathname) === -1) {
      break;
    }

    // Use the parent path
    const index = pathname.indexOf('/', 1);
    if (index === -1) {
      break;
    }

    pathname = pathname.substring(0, index);
  }

  return pathname;
};

// Returns a new location state object without any modals 
const createModelessState = (state: object) => {
  return Object.keys(state).reduce(
    (newState, key) => {
      if (key.indexOf(OverlayConstants.MODAL_PREFIX) !== 0) {
        newState[key] = state[key];
      }

      return newState;
    }, 
    {}
  );
};


const mergeOverlayData = (locationState: object, overlayId: string, data?: object) => {
  return update(locationState, { 
    [overlayId]: { 
      data: { $merge: data } 
    } 
  });
};

// Push a new sidebar state or merge the data into an existing one (if the sidebar is open already) 
const getSidebarState = (currentLocation: Location, data: object = {}) => {
  console.assert(currentLocation, 'Current location not supplied for overlay creation');
  console.assert(currentLocation.pathname, 'Invalid location object supplied for overlay creation');

  const state = currentLocation.state ? createModelessState(currentLocation.state) : {};
  if (!state[OverlayConstants.SIDEBAR_ID]) {
    // We are opening the sidebar
    state[OverlayConstants.SIDEBAR_ID] = {
      returnTo: getModelessPath(currentLocation),
      data,
    };

    return state;
  }

  // Sidebar is open already, merge the new data
  return mergeOverlayData(state, OverlayConstants.SIDEBAR_ID, data || {});
};

const addModalState = (currentLocation: Location, overlayId: string, data: object = {}, pathname: string) => {
  console.assert(currentLocation, 'Current location not supplied for overlay creation');
  console.assert(currentLocation.pathname, 'Invalid location object supplied for overlay creation');

  const state = currentLocation.state ? Object.assign({}, currentLocation.state) : {};
  state[overlayId] = {
    returnTo: currentLocation.pathname,
    data,
    pathname,
  };

  return state;
};

const Helpers = {
  pushModal: function (currentLocation: Location, pathname: string, overlayId: string, data?: object) {
    const state = addModalState(currentLocation, overlayId, data, pathname);
    History.push(pathname, state);
  },

  // Returns modal IDs from currentLocation
  getModalIds(currentLocation: Location) {
    if (!currentLocation.state) {
      return null;
    }

    // Check all modal entries that don't exist in current props
    const ids = Object.keys(currentLocation.state)
      .filter(key => key.indexOf(OverlayConstants.MODAL_PREFIX) === 0);

    return ids.length > 0 ? ids : null;
  },

  hasSidebar(currentLocation: Location) {
    return currentLocation.state && currentLocation.state[OverlayConstants.SIDEBAR_ID];
  },

  replaceSidebar: function (currentLocation: Location, pathname: string, data?: object) {
    const state = getSidebarState(currentLocation, data);
    History.replace(pathname, state);
  },

  pushSidebar: function (currentLocation: Location, pathname: string, data?: object) {
    // replaceState is invoked automatically if the path hasn't changed
    const state = getSidebarState(currentLocation, data);
    History.push(pathname, state);
  },

  // Append new location data when in sidebar layout and create a new history entry
  pushSidebarData: function (currentLocation: Location, data?: object) {
    const state = mergeOverlayData(currentLocation.state, OverlayConstants.SIDEBAR_ID, data);
    History.push(currentLocation.pathname, state);
  },

  // Append new location data when in sidebar layout without creating a new history entry
  replaceSidebarData: function (currentLocation: Location, data?: object) {
    const state = mergeOverlayData(currentLocation.state, OverlayConstants.SIDEBAR_ID, data);
    History.replace(currentLocation.pathname, state);
  },

  // Shorthand function for receiving the data
  // Data for modals is converted to regular props by the parent decorator 
  // but it won't work well with a nested sidebar structure
  getSidebarData: function (currentLocation: LocationDescriptorObject) {
    return currentLocation.state[OverlayConstants.SIDEBAR_ID].data;
  },

  // Remove overlay from the location state
  removeOverlay: function (location: LocationDescriptorObject, overlayId: string, changeLocation: boolean = true) {
    const { state } = location;
    const { returnTo } = state[overlayId];
    invariant(overlayId, 'Return address or overlay id missing when closing an overlay');

    delete state[overlayId];

    if (changeLocation) {
      if (returnTo) {
        History.replace(returnTo, state);
      } else {
        History.goBack();
      }
    }
  },

  // Uses replace instead if the next path matches the current one regardless of the state or other properties
  // Note that the regular history functions will ignore fully identical locations in 
  // any case so there's no need to check that manually
  pushUnique: function (nextLocation: LocationDescriptorObject, currentLocation: Location) {
    invariant(currentLocation, 'pushUnique: current location was not supplied');
    if (nextLocation.pathname !== currentLocation.pathname) {
      History.push(nextLocation);
    } else {
      History.replace(nextLocation);
    }
  },
};

export default Object.assign(History, Helpers);

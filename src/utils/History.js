import update from 'react-addons-update';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import { SIDEBAR_ID } from 'constants/OverlayConstants';

const History = createBrowserHistory();

const mergeOverlayData = (locationState, overlayId, data) => {
	return update(locationState, { 
		[overlayId]: { 
			data: { $merge: data } 
		} 
	});
};

const getOverlayState = (currentLocation, overlayId, data) => {
	console.assert(currentLocation, 'Current location not supplied for overlay creation');

	const state = currentLocation.state || {};
	if (!state[overlayId]) {
		// Creating the overlay
		state[overlayId] = {
			returnTo: currentLocation.pathname,
			data: data || {}
		};

		return state;
	}

	// Merge the new data
	return mergeOverlayData(state, overlayId, data || {});
};

const removeOverlayState = (currentLocation, overlayId) => {
	const { state } = currentLocation;
	const { returnTo } = state[overlayId];
	console.assert(returnTo && overlayId, 'Return address or overlay id missing when closing an overlay');
	delete state[overlayId];
};


const pushModal = (currentLocation, nextPath, overlayId, data) => {
	if (typeof currentLocation !== 'object') {
		currentLocation = Object.assign({}, { pathname: currentLocation });
	}

	const state = getOverlayState(currentLocation, 'modal', data);
	History.pushState(state, nextPath);
};

// Router links should always use full path for active link detection to work
const toSidebarPath = (path) => {
	if (path.indexOf('/sidebar/') == 0) {
		return path;
	}

	return '/sidebar/' + path;
};

const replaceSidebar = (currentLocation, nextPath, data) => {
	const state = getOverlayState(currentLocation, SIDEBAR_ID, data);
	History.replaceState(state, toSidebarPath(nextPath));
};

const pushSidebar = (currentLocation, nextPath, data) => {
	if (toSidebarPath(nextPath) === currentLocation.pathname) {
		// Don't create duplicate history entries
		replaceSidebar(currentLocation, nextPath);
		return;
	}

	const state = getOverlayState(currentLocation, SIDEBAR_ID, data);
	History.pushState(state, toSidebarPath(nextPath));
};

// Append new location data when in sidebar layout and create a new history entry
const pushSidebarData = (currentLocation, data) => {
	const newState = mergeOverlayData(currentLocation.state, SIDEBAR_ID, data);
	History.pushState(newState, currentLocation.pathname);
};

// Append new location data when in sidebar layout without creating a new history entry
const replaceSidebarData = (currentLocation, data) => {
	const newState = mergeOverlayData(currentLocation.state, SIDEBAR_ID, data);
	History.replaceState(newState, currentLocation.pathname);
};

// Shorthand function for receiving the data
// Data for modals is converted to regular props by the parent decorator but it won't work well with a nested sidebar structure
const getSidebarData = (currentLocation) => {
	return currentLocation.state[SIDEBAR_ID].data;
};

const removeSidebar = (currentLocation) => {
	const returnTo = removeOverlayState(currentLocation, SIDEBAR_ID);
	History.replaceState(currentLocation.state, returnTo);
};

export default Object.assign(History, { 
	pushModal: pushModal, 
	pushSidebar: pushSidebar,
	replaceSidebar: replaceSidebar,
	pushSidebarData: pushSidebarData,
	replaceSidebarData: replaceSidebarData,
	getSidebarData: getSidebarData,
	removeSidebar: removeSidebar,
});

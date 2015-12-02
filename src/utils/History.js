import update from 'react-addons-update';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import { useQueries } from 'history';
import { SIDEBAR_ID } from 'constants/OverlayConstants';

const History = useQueries(createBrowserHistory)();

const mergeOverlayData = (locationState, overlayId, data) => {
	return update(locationState, { 
		[overlayId]: { 
			data: { $merge: data } 
		} 
	});
};

const getOverlayState = (currentLocation, overlayId, data) => {
	console.assert(currentLocation, 'Current location not supplied for overlay creation');

	const state = currentLocation.state ? Object.assign({}, currentLocation.state) : {};
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

const OverlayHelpers = {
	pushModal: function (currentLocation, nextPath, overlayId, data) {
		if (typeof currentLocation !== 'object') {
			currentLocation = Object.assign({}, { pathname: currentLocation });
		}

		const state = getOverlayState(currentLocation, 'modal_' + overlayId, data);
		History.pushState(state, nextPath);
	},

	replaceSidebar: function (currentLocation, nextPath, data) {
		const state = getOverlayState(currentLocation, SIDEBAR_ID, data);
		History.replaceState(state, nextPath);
	},

	pushSidebar: function (currentLocation, nextPath, data) {
		// replaceState is invoked automatically if the path hasn't changed
		const state = getOverlayState(currentLocation, SIDEBAR_ID, data);
		History.pushState(state, nextPath);
	},

	// Append new location data when in sidebar layout and create a new history entry
	// Query will always be appended due to history lib: https://github.com/rackt/history/pull/43
	pushSidebarData: function (currentLocation, data) {
		const newState = mergeOverlayData(currentLocation.state, SIDEBAR_ID, data);
		History.pushState(newState, currentLocation.pathname, data);
	},

	// Append new location data when in sidebar layout without creating a new history entry
	replaceSidebarData: function (currentLocation, data, addQuery = false) {
		const newState = mergeOverlayData(currentLocation.state, SIDEBAR_ID, data);
		History.replaceState(newState, currentLocation.pathname, addQuery ? data : null);
	},

	// Shorthand function for receiving the data
	// Data for modals is converted to regular props by the parent decorator but it won't work well with a nested sidebar structure
	getSidebarData: function (currentLocation) {
		return currentLocation.state[SIDEBAR_ID].data;
	},
};

export default Object.assign(History, OverlayHelpers);

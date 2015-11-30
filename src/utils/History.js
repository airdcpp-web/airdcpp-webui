import update from 'react-addons-update';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import { useQueries } from 'history';
import { SIDEBAR_ID } from 'constants/OverlayConstants';

import qs from 'qs';

const History = useQueries(createBrowserHistory)();

/*const filterFunc = (prefix, value) => {
	//return value.split('/');
	Object.keys(value).map((key, index) => {
		value[key] = value[key].split('/');
	});

	return value;
};

const History = useQueries(createBrowserHistory)({
	parseQueryString: function (queryString) {
		return qs.parse(queryString);
	},
	stringifyQuery: function (query) {
		return qs.stringify(query, { arrayFormat: 'brackets', filter: filterFunc });
	}
});*/


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

const pushModal = (currentLocation, nextPath, overlayId, data) => {
	if (typeof currentLocation !== 'object') {
		currentLocation = Object.assign({}, { pathname: currentLocation });
	}

	const state = getOverlayState(currentLocation, 'modal_' + overlayId, data);
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
// Query will always be appended due to history lib: https://github.com/rackt/history/pull/43
const pushSidebarData = (currentLocation, data) => {
	const newState = mergeOverlayData(currentLocation.state, SIDEBAR_ID, data);
	History.pushState(newState, currentLocation.pathname, data);
};

// Append new location data when in sidebar layout without creating a new history entry
const replaceSidebarData = (currentLocation, data, addQuery = false) => {
	const newState = mergeOverlayData(currentLocation.state, SIDEBAR_ID, data);
	History.replaceState(newState, currentLocation.pathname, addQuery ? data : null);
};

// Shorthand function for receiving the data
// Data for modals is converted to regular props by the parent decorator but it won't work well with a nested sidebar structure
const getSidebarData = (currentLocation) => {
	return currentLocation.state[SIDEBAR_ID].data;
};


export default Object.assign(History, { 
	pushModal: pushModal, 
	pushSidebar: pushSidebar,
	replaceSidebar: replaceSidebar,
	pushSidebarData: pushSidebarData,
	replaceSidebarData: replaceSidebarData,
	getSidebarData: getSidebarData,
});

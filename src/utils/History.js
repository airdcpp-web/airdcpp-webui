import React from 'react';

import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory'
import { SIDEBAR_ID } from 'constants/OverlayConstants'

const History = createBrowserHistory();

// currentLocation can also be a string, but that should be used only when the old location state can be replaced
// You may also pass additional data to the state
const getOverlayState = (currentLocation, overlayId, data) => {
	console.assert(currentLocation, "Current location not supplied for overlay creation");

	let state = currentLocation.state || {};
	if (!state[overlayId]) {
		state[overlayId] = {
			returnTo: currentLocation.pathname,
			data: data || {}
		};
	}

	return state;
}

const mergeOverlayData = (currentLocation, newData, overlayId) => {
	return React.addons.update(currentLocation.state, { 
		[overlayId]: { 
			data: {$merge: newData} 
		} 
	});
}

const pushModal = (currentLocation, nextPath, overlayId, data) => {
	if (typeof currentLocation !== "object") {
		currentLocation = Object.assign({}, { pathname: currentLocation })
	}

	const state = getOverlayState(currentLocation, overlayId, data);
	History.pushState(state, nextPath);
}

const replaceSidebar = (currentLocation, nextPath, data) => {
	const state = getOverlayState(currentLocation, SIDEBAR_ID, data);
	History.replaceState(state, "/sidebar/" + nextPath);
}

const pushSidebar = (currentLocation, nextPath, data) => {
	const fullNextPath = "/sidebar/" + nextPath;
	if (fullNextPath === currentLocation.pathname) {
		// Don't create duplicate history entries
		replaceSidebar(currentLocation, nextPath);
		return;
	}

	const state = getOverlayState(currentLocation, SIDEBAR_ID, data);
	History.pushState(state, fullNextPath);
}

// Append new location data when in sidebar layout and create a new history entry
const pushSidebarData = (currentLocation, data) => {
	const newState = mergeOverlayData(currentLocation, data, SIDEBAR_ID);
	History.pushState(newState, currentLocation.pathname);
}

// Append new location data when in sidebar layout without creating a new history entry
const replaceSidebarData = (currentLocation, data) => {
	const newState = mergeOverlayData(currentLocation, data, SIDEBAR_ID);
	History.replaceState(newState, currentLocation.pathname);
}

// Shorthand function for receiving the data
// Data for modals is converted to regular props by the parent decorator but it won't work well with a nested sidebar structure
const getSidebarData = (currentLocation) => {
	return currentLocation.state[SIDEBAR_ID].data;
}


export default Object.assign(History, { 
	pushModal: pushModal, 
	pushSidebar: pushSidebar,
	replaceSidebar: replaceSidebar,
	pushSidebarData: pushSidebarData,
	replaceSidebarData: replaceSidebarData,
	getSidebarData: getSidebarData,
});
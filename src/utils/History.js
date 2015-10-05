import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory'
import { SIDEBAR_ID } from 'constants/OverlayConstants'

const History = createBrowserHistory();

// currentLocation can also be a string, but that should be used only when the old location state can be replaced
// You may also pass additional data to the state
const pushOverlay = (currentLocation, nextPath, overlayId, data) => {
	if (typeof currentLocation !== "object") {
		currentLocation = Object.assign({}, { pathname: currentLocation })
	}

    let state = currentLocation.state || {};
    if (!state[overlayId]) {
      state[overlayId] = {
        returnTo: currentLocation.pathname,
        data: data
      };
    }

	History.pushState(state, nextPath);
}

const pushSidebar = (currentLocation, nextPath) => {
	pushOverlay(currentLocation, "/sidebar/" + nextPath, SIDEBAR_ID);
}

export default Object.assign(History, { pushOverlay: pushOverlay }, { pushSidebar: pushSidebar });
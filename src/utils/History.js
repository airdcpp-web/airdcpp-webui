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
      data: data
    };
  }

  return state;
}

const pushModal = (currentLocation, nextPath, overlayId, data) => {
  if (typeof currentLocation !== "object") {
    currentLocation = Object.assign({}, { pathname: currentLocation })
  }

  const state = getOverlayState(currentLocation, overlayId, data);
  History.pushState(state, nextPath);
}

const replaceSidebar = (currentLocation, nextPath) => {
  const state = getOverlayState(currentLocation, SIDEBAR_ID);
  History.replaceState(state, "/sidebar/" + nextPath);
}

const pushSidebar = (currentLocation, nextPath) => {
  const fullNextPath = "/sidebar/" + nextPath;
  if (fullNextPath === currentLocation.pathname) {
    // Don't create duplicate history entries
    replaceSidebar(currentLocation, nextPath);
    return;
  }

  const state = getOverlayState(currentLocation, SIDEBAR_ID);
  History.pushState(state, fullNextPath);
}

export default Object.assign(History, { 
  pushModal: pushModal, 
  pushSidebar: pushSidebar,
  replaceSidebar: replaceSidebar
});
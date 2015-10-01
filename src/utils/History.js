// history.js
import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory'
//import { BrowserHistory } from 'react-router';

const History = createBrowserHistory();

const pushOverlay = (locationPath, pathSuffix, overlayId, data) => {
	const overlayData = {
		returnTo: locationPath,
		data: data
	};

	History.pushState({ [overlayId]: overlayData }, locationPath + pathSuffix);
}

export default Object.assign(History, { pushOverlay: pushOverlay });
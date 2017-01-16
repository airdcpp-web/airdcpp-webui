'use strict';
import Reflux from 'reflux';
import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import IconConstants from 'constants/IconConstants';
import OverlayConstants from 'constants/OverlayConstants';

import NotificationActions from 'actions/NotificationActions';

export const SearchActions = Reflux.createActions([
	{ 'result': { 
		displayName: 'Result details',
		icon: IconConstants.OPEN },
	},
	{ 'download': { asyncResult: true } },
]);

SearchActions.download.listen((itemData, downloadData) => {
	return SocketService.post(SearchConstants.RESULTS_URL + '/' + itemData.itemInfo.id + '/download', downloadData)
		.then(SearchActions.download.completed)
		.catch(error => SearchActions.download.failed(itemData, error));
});

SearchActions.download.failed.listen((itemData, error) => {
	NotificationActions.apiError('Failed to queue the item ' + itemData.itemInfo.name, error);
});

SearchActions.result.listen(function (data, location) {
	History.pushModal(location, location.pathname + '/result', OverlayConstants.SEARCH_RESULT_MODAL, { parentResult: data });
});

export default SearchActions;

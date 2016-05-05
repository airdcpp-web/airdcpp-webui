'use strict';
import Reflux from 'reflux';
import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

export const SearchActions = Reflux.createActions([
	{ 'download': { asyncResult: true } }
]);

SearchActions.download.listen((itemData, downloadData) => {
	return SocketService.post(SearchConstants.RESULT_URL + '/' + itemData.itemInfo.id + '/download', downloadData)
		.then(SearchActions.download.completed)
		.catch(error => SearchActions.download.failed(itemData, error));
});

SearchActions.download.failed.listen((itemData, error) => {
	NotificationActions.apiError('Failed to queue the item ' + itemData.itemInfo.name, error);
});

export default SearchActions;

'use strict';
import Reflux from 'reflux';
import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

export const SearchActions = Reflux.createActions([
	//{ 'postSearch': { asyncResult: true } },
	{ 'download': { asyncResult: true } }
]);

/*SearchActions.postSearch.listen(function (pattern) {
	let that = this;
	return SocketService.get(QUERY_URL, { 
		pattern: pattern
	})
		.then(that.completed)
		.catch(this.failed);
});*/

SearchActions.download.listen((itemData, downloadData) => {
	return SocketService.post(SearchConstants.RESULT_URL + '/' + itemData.itemInfo.id + '/download', downloadData)
		.then(SearchActions.download.completed)
		.catch(error => SearchActions.download.failed(itemData, error));
});

SearchActions.download.failed.listen((itemData, error) => {
	NotificationActions.error({
		title: itemData.itemInfo.name,
		message: 'Failed to queue the item: ' + error.message
	});
});

export default SearchActions;

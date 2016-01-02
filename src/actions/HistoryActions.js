'use strict';
import Reflux from 'reflux';
import HistoryConstants from 'constants/HistoryConstants';
import SocketService from 'services/SocketService';

export const HistoryActions = Reflux.createActions([
	{ 'add': { asyncResult: true } },
]);

HistoryActions.add.listen(function (historyId, item) {
	let that = this;
	return SocketService.post(HistoryConstants.ITEM_URL + '/' + historyId, { 
		item,
	})
		.then(that.completed)
		.catch(that.failed);
});

export default HistoryActions;

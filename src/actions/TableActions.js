import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import LoginStore from 'stores/LoginStore';

const TableActions = Reflux.createActions([
	{ 'setRange': { asyncResult: true } },
	{ 'setSort': { asyncResult: true } },
	{ 'close': { asyncResult: true } },
	{ 'pause': { asyncResult: true } },
	'init',
	'clear',
]);

const postSettings = (settings, viewUrl, action) => {
	return SocketService.post(viewUrl + '/settings', settings)
		.then(data => action.completed(viewUrl, data))
		.catch(error => action.failed(viewUrl, error));
};

TableActions.close.listen(function (viewUrl, sessionExists) {
	if (sessionExists && LoginStore.socketAuthenticated) {
		let that = this;
		return SocketService.delete(viewUrl)
			.then(data => that.completed(viewUrl, data))
			.catch(error => this.failed(viewUrl, error));
	}
});

TableActions.setSort.listen(function (viewUrl, sortProperty, sortAscending) {
	postSettings({ 
		sort_property: sortProperty,
		sort_ascending: sortAscending,
	}, viewUrl, this);
});

TableActions.setRange.listen(function (viewUrl, rangeStart, maxRows) {
	postSettings({ 
		range_start: rangeStart, 
		max_count: maxRows,
	}, viewUrl, this);
});

TableActions.pause.listen(function (viewUrl, pause) {
	postSettings({ 
		paused: pause,
	}, viewUrl, this);
});

export default TableActions;

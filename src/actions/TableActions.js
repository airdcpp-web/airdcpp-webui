import Reflux from 'reflux';
import SocketService from 'services/SocketService';

const TableActions = Reflux.createActions([
	{ 'changeSettings': { asyncResult: true } },
	{ 'close': { asyncResult: true } },
	{ 'pause': { asyncResult: true } },
	{ 'start': { asyncResult: true } },
	'init',
	'clear',
]);

TableActions.start.listen(function (viewUrl) {
	let that = this;
	return SocketService.post(viewUrl)
		.then(data => that.completed(viewUrl, data))
		.catch(error => this.failed(viewUrl, error));
});

TableActions.close.listen(function (viewUrl, sessionExists) {
	if (sessionExists) {
		let that = this;
		return SocketService.delete(viewUrl)
			.then(data => that.completed(viewUrl, data))
			.catch(error => this.failed(viewUrl, error));
	}
});

TableActions.changeSettings.listen(function (viewUrl, rangeStart, maxRows, sortProperty, sortAscending) {
	let that = this;
	return SocketService.post(viewUrl + '/settings', { 
		range_start: rangeStart, 
		max_count: maxRows,
		sort_property: sortProperty,
		sort_ascending: sortAscending,
	}).then(data => that.completed(viewUrl, data))
		.catch(error => this.failed(viewUrl, error));
});

TableActions.pause.listen(function (viewUrl, pause) {
	let that = this;
	return SocketService.post(viewUrl + '/settings', { 
		paused: pause,
	}).then(data => that.completed(viewUrl, data))
		.catch(error => this.failed(viewUrl, error));
});

export default TableActions;

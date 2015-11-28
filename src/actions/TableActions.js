import Reflux from 'reflux';
import SocketService from 'services/SocketService';

const TableActions = Reflux.createActions([
	{ 'changeSettings': { asyncResult: true } },
	{ 'close': { asyncResult: true } },
	{ 'pause': { asyncResult: true } },
]);

TableActions.close.listen(function (viewUrl) {
	let that = this;
	return SocketService.delete(viewUrl)
		.then(data => that.completed(viewUrl))
		.catch(error => this.failed(viewUrl, error));
});

TableActions.close.failed.listen(function (viewUrl, error) {
	// Probably a deleted session
});

TableActions.changeSettings.listen(function (viewUrl, rangeStart, maxRows, sortProperty, sortAscending) {
	let that = this;
	return SocketService.post(viewUrl, { 
		range_start: rangeStart, 
		max_count: maxRows,
		sort_property: sortProperty,
		sort_ascending: sortAscending,
	}).then(data => that.completed(viewUrl, data))
		.catch(error => this.failed(viewUrl, error));
});

TableActions.pause.listen(function (viewUrl, pause) {
	let that = this;
	return SocketService.post(viewUrl, { 
		paused: pause,
	}).then(data => that.completed(viewUrl, data))
		.catch(error => this.failed(viewUrl, error));
});

export default TableActions;

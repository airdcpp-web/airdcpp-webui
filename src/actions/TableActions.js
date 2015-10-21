import Reflux from 'reflux';
import SocketService from 'services/SocketService'

const TableActions = Reflux.createActions([
	{ "changeSettings": { asyncResult: true} },
  { "close": { asyncResult: true} },
  { "pause": { asyncResult: true} },
  { "filter": { asyncResult: true} }
]);

/*TableActions.getItems.listen(function(url, viewName, rangeStart, rangeEnd) {
  var that = this;
  return SocketService.get(url + "/" + rangeStart + "/" + rangeEnd)
    .then(data => that.completed(viewName, data, rangeStart, rangeEnd))
    .catch(error => this.failed(viewName, error));
});*/

TableActions.close.listen(function(viewUrl) {
  let that = this;
  return SocketService.delete(viewUrl)
    .then(data => that.completed(viewUrl))
    .catch(error => this.failed(viewUrl, error));
});

TableActions.changeSettings.listen(function(viewUrl, rangeStart, maxRows, sortProperty, sortAscending) {
  let that = this;
  return SocketService.post(viewUrl, { 
    range_start: rangeStart, 
    max_count: maxRows,
    sort_property: sortProperty,
    sort_ascending: sortAscending
  }).then(data => that.completed(viewUrl, data))
    .catch(error => this.failed(viewUrl, error));
});

TableActions.pause.listen(function(viewUrl, pause) {
  let that = this;
  return SocketService.post(viewUrl, { 
    paused: pause
  }).then(data => that.completed(viewUrl, data))
    .catch(error => this.failed(viewUrl, error));
});

TableActions.filter.listen(function(viewUrl, pattern, method = 0, property = "any") {
  let that = this;
  return SocketService.post(viewUrl + "/filter", { 
    pattern: pattern,
    method: method,
    property: property
  }).then(data => that.completed(viewUrl, data))
    .catch(error => this.failed(viewUrl, error));
});

export default TableActions;
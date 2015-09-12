import Reflux from 'reflux';
import SocketService from '../services/SocketService'

var TableActions = Reflux.createActions([
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

TableActions.close.listen(function(url, viewName) {
  var that = this;
  return SocketService.delete(url + "/" + viewName)
    .then(data => that.completed(viewName))
    .catch(error => this.failed(viewName, error));
});

TableActions.changeSettings.listen(function(url, viewName, rangeStart, rangeEnd, sortProperty, sortAscending) {
  var that = this;
  return SocketService.post(url + "/" + viewName, { 
    range_start: rangeStart, 
    range_end: rangeEnd,
    sort_property: sortProperty,
    sort_ascending: sortAscending
  }).then(data => that.completed(viewName, data))
    .catch(error => this.failed(viewName, error));
});

TableActions.pause.listen(function(url, viewName, pause) {
  var that = this;
  return SocketService.post(url + "/" + viewName, { 
    paused: pause
  }).then(data => that.completed(viewName, data))
    .catch(error => this.failed(viewName, error));
});

TableActions.filter.listen(function(url, viewName, pattern, method = 0, property = -1) {
  var that = this;
  return SocketService.post(url + "/" + viewName, { 
    pattern: pattern,
    method: method,
    property: property
  }).then(data => that.completed(viewName, data))
    .catch(error => this.failed(viewName, error));
});

export default TableActions;
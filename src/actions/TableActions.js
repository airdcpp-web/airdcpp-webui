import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import LoginStore from 'stores/LoginStore';

const TableActions = Reflux.createActions([
  { 'setRange': { asyncResult: true } },
  { 'setSort': { asyncResult: true } },
  { 'close': { asyncResult: true } },
  { 'pause': { asyncResult: true } },
  { 'init': { asyncResult: true } },
  'clear',
]);

const postSettings = (settings, viewUrl, action) => {
  return SocketService.post(viewUrl + '/settings', settings)
    .then(data => action.completed(viewUrl, data))
    .catch(error => action.failed(viewUrl, error));
};

TableActions.close.listen(function (viewUrl, sessionExists) {
  if (sessionExists && LoginStore.socketAuthenticated) {
    const that = this;
    return SocketService.delete(viewUrl)
      .then(data => that.completed(viewUrl, data))
      .catch(error => this.failed(viewUrl, error));
  }

  return Promise.resolve();
});

TableActions.setSort.listen(function (viewUrl, sortProperty, sortAscending) {
  postSettings({ 
    sort_property: sortProperty,
    sort_ascending: sortAscending,
  }, viewUrl, this);
});

TableActions.setRange.listen(function (viewUrl, rangeStart, maxRows) {
  console.assert(maxRows > 0, 'Invalid max rows');
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

TableActions.init.listen(function (viewUrl, entityId, filterData) {
  if (filterData) {
    postSettings({ 
      source_filter: filterData,
    }, viewUrl, this);
  }
});


export default TableActions;

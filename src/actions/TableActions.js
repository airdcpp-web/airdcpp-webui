import Reflux from 'reflux';

const TableActions = Reflux.createActions([
  { setRange: { asyncResult: true } },
  { setSort: { asyncResult: true } },
  { close: { asyncResult: true } },
  { pause: { asyncResult: true } },
  { init: { asyncResult: true } },
  'clear',
]);

const postSettings = (socket, settings, viewUrl, action) => {
  return socket
    .post(viewUrl + '/settings', settings)
    .then((data) => action.completed(viewUrl, data))
    .catch((error) => action.failed(viewUrl, error));
};

TableActions.close.listen(function (socket, viewUrl, sessionExists) {
  if (sessionExists) {
    const that = this;
    return socket
      .delete(viewUrl)
      .then((data) => that.completed(viewUrl, data))
      .catch((error) => this.failed(viewUrl, error));
  }

  return Promise.resolve();
});

TableActions.setSort.listen(function (socket, viewUrl, sortProperty, sortAscending) {
  postSettings(
    socket,
    {
      sort_property: sortProperty,
      sort_ascending: sortAscending,
    },
    viewUrl,
    this,
  );
});

TableActions.setRange.listen(function (socket, viewUrl, rangeStart, maxRows) {
  console.assert(maxRows > 0, 'Invalid max rows');
  postSettings(
    socket,
    {
      range_start: rangeStart,
      max_count: maxRows,
    },
    viewUrl,
    this,
  );
});

TableActions.pause.listen(function (socket, viewUrl, pause) {
  postSettings(
    socket,
    {
      paused: pause,
    },
    viewUrl,
    this,
  );
});

TableActions.init.listen(function (socket, viewUrl, entityId, filterData) {
  if (filterData) {
    postSettings(
      socket,
      {
        source_filter: filterData,
      },
      viewUrl,
      this,
    );
  }
});

export default TableActions;

import Reflux from 'reflux';

import NotificationActions from 'actions/NotificationActions';

const NotificationStore = Reflux.createStore({
  listenables: NotificationActions,
  init: function () {
  },

  onSuccess(...props) {
    this.trigger('success', ...props);
  },

  onInfo(...props) {
    this.trigger('info', ...props);
  },

  onWarning(...props) {
    this.trigger('warning', ...props);
  },

  onError(...props) {
    this.trigger('error', ...props);
  },

  onApiError(title, error, uid) {
    this.trigger('error', { 
      title: title,
      message: error.message + ' (code ' + error.code + ')',
      uid: uid
    });
  },
});

export default NotificationStore;

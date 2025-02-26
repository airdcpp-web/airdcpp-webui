import Reflux from 'reflux';

import NotificationActions from '@/actions/NotificationActions';
import { errorResponseToString } from '@/utils/TypeConvert';

const NotificationStore = Reflux.createStore({
  listenables: NotificationActions,

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
      message: errorResponseToString(error),
      uid: uid,
    });
  },
});

export default NotificationStore;

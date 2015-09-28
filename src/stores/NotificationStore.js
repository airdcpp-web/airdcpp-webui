import Reflux from 'reflux';

//import {TRANSFER_MODULE_URL, STATISTICS} from 'constants/TransferConstants';
import {QUEUE_MODULE_URL, BUNDLE_STATUS, StatusEnum} from 'constants/QueueConstants';

import SocketStore from './SocketStore'
import StorageMixin from 'mixins/StorageMixin'
import History from 'utils/History'

import NotificationActions from 'actions/NotificationActions'
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin'

export default Reflux.createStore({
  mixins: [SocketSubscriptionMixin],
  listenables: NotificationActions,
  init: function() {

  },

  onSuccess(...props) {
    this.trigger("success", ...props);
  },

  onInfo(...props) {
    this.trigger("info", ...props);
  },

  onWarning(...props) {
    this.trigger("warning", ...props);
  },

  onError(...props) {
    this.trigger("error", ...props);
  },

  onSocketConnected() {
    this.addSocketListener(QUEUE_MODULE_URL, BUNDLE_STATUS, this._onBundleStatus);
  },

  _onBundleStatus: function(bundle) {
    let text;
    let level;
    switch(bundle.status.id) {
      case StatusEnum.STATUS_QUEUED: break;
      case StatusEnum.STATUS_FAILED_MISSING:
      case StatusEnum.STATUS_SHARING_FAILED: {
        text = "Scanning failed for the bundle " + bundle.name + ": " + bundle.status.str;
        level = "error";
        break;
      };
      case StatusEnum.STATUS_FINISHED: {
        text = "The bundle " + bundle.name + " has finished downloading";
        level = "info";
        break;
      };
      case StatusEnum.STATUS_HASH_FAILED: {
        text = "Failed to hash the bundle " + bundle.name + ": " + bundle.status.str;
        level = "error";
        break;
      };
      case StatusEnum.STATUS_HASHED: {
        text = "The bundle " + bundle.name + " has finished hashing";
        level = "info";
        break;
      };
      case StatusEnum.STATUS_SHARED: {
        text = "The bundle " + bundle.name + " has been added in share";
        level = "info";
        break;
      };
    }

    if (level) {
      this.trigger(level, text, bundle.id, {
        label: "View queue",
        callback: () => { History.pushState(null, '/queue'); }
      });
    }
  }
});
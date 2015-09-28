import React from 'react';
import Reflux from 'reflux';

import NotificationSystem from 'react-notification-system';
import NotificationActions from 'actions/NotificationActions';
import NotificationStore from 'stores/NotificationStore';

const Notifications = React.createClass({
  mixins: [Reflux.listenTo(NotificationStore, "_addNotification")],

  _notificationSystem: null,

  _addNotification: function(level, message, uid = null, button = null) {
    this._notificationSystem.addNotification({
      message: message,
      level: level,
      position: 'tl',
      autoDismiss: 5,
      action: button,
      uid: uid
    });
  },

  componentDidMount: function() {
    this._notificationSystem = this.refs.notificationSystem;

    /*NotificationActions.success.listen((...props) => this._addNotification("success", ...props));
    NotificationActions.info.listen((...props) => this._addNotification("info", ...props));
    NotificationActions.warning.listen((...props) => this._addNotification("warning", ...props));
    NotificationActions.error.listen((...props) => this._addNotification("error", ...props));*/
  },

  render: function() {
    return (
        <NotificationSystem ref="notificationSystem" />
      );
  }
});

export default Notifications;
import React from 'react';
import Reflux from 'reflux';

import NotificationSystem from 'react-notification-system';
import NotificationStore from 'stores/NotificationStore';

const Notifications = React.createClass({
	mixins: [ Reflux.listenTo(NotificationStore, '_addNotification') ],

	_notificationSystem: null,

	_addNotification: function (level, notification) {
		this._notificationSystem.addNotification(Object.assign(notification, {
			level: level,
			position: 'tl',
			autoDismiss: 5
		}));
	},

	componentDidMount: function () {
		this._notificationSystem = this.refs.notificationSystem;
	},

	render: function () {
		return (
			<NotificationSystem ref="notificationSystem" />
		);
	}
});

export default Notifications;

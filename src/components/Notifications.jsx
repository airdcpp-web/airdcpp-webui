import React from 'react';
import Reflux from 'reflux';

import { PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE } from 'constants/PrivateChatConstants';
import { QUEUE_MODULE_URL, BUNDLE_STATUS, StatusEnum } from 'constants/QueueConstants';

import NotificationSystem from 'react-notification-system';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import History from 'utils/History';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import Logo from '../../images/AirDCPlusPlus.png';


const Notifications = React.createClass({
	mixins: [ SocketSubscriptionMixin(), Reflux.listenTo(NotificationStore, '_addNotification') ],

	_notificationSystem: null,

	_addNotification: function (level, notification) {
		if ('Notification' in window && Notification.permission === 'granted') {
			this.showNativeNotification(level, notification);
			return;
		}

		this._notificationSystem.addNotification(Object.assign(notification, {
			level: level,
			position: 'tl',
			autoDismiss: 5
		}));
	},

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	},

	showNativeNotification(level, notificationInfo) {
		var options = {
			body: notificationInfo.message,
			icon: Logo,
			tag: notificationInfo.uid,
		};

		const n = new Notification(notificationInfo.title, options);
		n.onclick = () => {
			window.focus();
			if (notificationInfo.action) {
				notificationInfo.action.callback();
			}
		};

		setTimeout(n.close.bind(n), 5000);
	},

	componentDidMount: function () {
		if ('Notification' in window) {
			Notification.requestPermission();
		}

		this._notificationSystem = this.refs.notificationSystem;
	},

	render: function () {
		return (
			<NotificationSystem ref="notificationSystem" />
		);
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, this._onPrivateMessage);
		addSocketListener(QUEUE_MODULE_URL, BUNDLE_STATUS, this._onBundleStatus);
	},

	_onPrivateMessage(message) {
		const cid = message.reply_to.cid;
		if (message.is_read || (PrivateChatSessionStore.getActiveSession() === cid && document.hasFocus())) {
			return;
		}

		NotificationActions.info({
			title: message.from.nick,
			message: message.text,
			uid: cid,
			action: {
				label: 'View message',
				callback: () => { 
					History.pushSidebar(this.props.location, 'messages/session/' + cid); 
				}
			}
		});
	},

	_onBundleStatus: function (bundle) {
		let text;
		let level;
		switch (bundle.status.id) {
			case StatusEnum.STATUS_QUEUED: {
				text = 'The bundle has been added in queue';
				level = 'info';
				break;
			}
			case StatusEnum.STATUS_FAILED_MISSING:
			case StatusEnum.STATUS_SHARING_FAILED: {
				text = 'Scanning failed for the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.STATUS_FINISHED: {
				text = 'The bundle has finished downloading';
				level = 'info';
				break;
			};
			case StatusEnum.STATUS_HASH_FAILED: {
				text = 'Failed to hash the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.STATUS_HASHED: {
				text = 'The bundle has finished hashing';
				level = 'info';
				break;
			};
			case StatusEnum.STATUS_SHARED: {
				text = 'The bundle has been added in share';
				level = 'info';
				break;
			};
		}

		if (level) {
			NotificationActions.info({
				title: bundle.name,
				message: text,
				uid: bundle.id,
				action: {
					label: 'View queue',
					callback: () => { 
						History.pushState(null, '/queue'); 
					}
				}
			});
		}
	}
});

export default Notifications;
